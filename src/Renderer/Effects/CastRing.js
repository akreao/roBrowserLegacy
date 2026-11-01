/**
 * Renderer/Effects/CastRing.js
 *
 * Draws the official client's cast-aura ring effect: two rings of four leaning
 * bands round the caster (sizes 45 and 25), each coloured by its argument.
 * Effects 2367 (ring_yellow.tga, 0), 1556 (ring_blue.tga, 20 and 21), 1565
 * (ring_yellow.tga, 23) and 1938 (new_battle_w/abr_battle_warior.tga, 0);
 * 911 (ring_white.tga, 15); 2369 (ring_white.tga, 0, colour cycling).
 * With the `epiclesis` option it draws Epiclesis's flat green rings instead
 * (effect 1655, EpiclesisRingSim.js): a new ring every 100 ticks, for as long as
 * the effect lives.
 * The motion and geometry are in CastRingSim.js; this file only draws them.
 *
 * Effect table entry:
 *   { type: 'FUNC', attachedEntity: true, castLoop: true, func(Params) {
 *       this.add(new CastRing(Params.Init.ownerEntity.position, Params.Inst.startTick,
 *           Params.Init.duration, 'ring_yellow.tga', [0, 0]), Params);
 *   } }
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import WebGL from 'Utils/WebGL.js';
import Client from 'Core/Client.js';
import SpriteRenderer from 'Renderer/SpriteRenderer.js';
import {
	RING_TICK_MS,
	RING_VERTICES,
	STRIPS,
	ringFrames,
	modeTint,
	createRing,
	stepRing,
	buildRing
} from './CastRingSim.js';
import {
	RING_EVERY,
	TINT as EPICLESIS_TINT,
	createEpiclesisRing,
	stepEpiclesisRing,
	ringRunning
} from './EpiclesisRingSim.js';
import _vertexShader from './EffectPrim.vs?raw';
import _fragmentShader from './EffectPrim.fs?raw';

/**
 * @var {WebGLProgram}
 */
let _program = null;

/**
 * Textures by file name, shared by every ring.
 */
const _textures = new Map();

function loadTexture(gl, name) {
	if (_textures.has(name)) {
		return;
	}
	_textures.set(name, null);
	Client.loadFile(`data/texture/effect/${name}`, buffer => {
		WebGL.texture(gl, buffer, texture => {
			if (!_textures.has(name)) {
				gl.deleteTexture(texture);
				return;
			}
			_textures.set(name, texture);
		});
	});
}

/** The two sizes the client builds each effect's rings with, in order. */
const SIZES = [45, 25];

class CastRing {
	/**
	 * @param {vec3} position caster position (kept by reference, so it follows)
	 * @param {number} startTick
	 * @param {number} castTime cast time, ms
	 * @param {string} texture file under data/texture/effect/
	 * @param {number[]} args the size-45 ring's argument, then the size-25 ring's
	 * @param {boolean|object} [cycle] build the colour-cycling twin (client primitive 139); or options:
	 *   { cycle, sizes: the rings' sizes (default 45 and 25), textures: one file per ring (default `texture`
	 *   for all), castTimeOnly: live castTime / 16 ticks,
	 *   without the 56-tick minimum (an effect that does not raise its own lifetime),
	 *   epiclesis: Epiclesis's rings, one every 100 ticks until the effect is removed (castTime and args unused) }
	 */
	constructor(position, startTick, castTime, texture, args, cycle = false) {
		const options = typeof cycle === 'object' && cycle ? cycle : { cycle };
		this.position = position;
		this.startTick = startTick || 0;
		if (options.epiclesis) {
			this.epiclesis = true;
			this.texture = texture;
			this.textures = null;
			this.ticks = 0;
			this.frames = Infinity;
			this.endTick = Infinity;
			this.rings = [];
			return;
		}
		this.frames = options.castTimeOnly ? Math.max(1, Math.floor((castTime || 0) / 16)) : ringFrames(castTime);
		this.endTick = this.startTick + this.frames * RING_TICK_MS;
		this.texture = texture;
		this.textures = options.textures || null;
		this.ticks = 0;
		this.rings = (options.sizes || SIZES).map((size, i) => ({
			sim: createRing(size, args[i], this.frames, !!options.cycle),
			vertices: new Float32Array(RING_VERTICES * 5),
			color: new Float32Array(4),
			buffer: null
		}));
	}

	init(gl) {
		for (const ring of this.rings) {
			ring.buffer = gl.createBuffer();
		}
		(this.textures || [this.texture]).forEach(name => loadTexture(gl, name));
		this.ready = true;
	}

	free(gl) {
		this.ready = false;
		for (const ring of this.rings) {
			if (ring.buffer) {
				gl.deleteBuffer(ring.buffer);
				ring.buffer = null;
			}
		}
	}

	render(gl, tick) {
		if (tick < this.startTick) {
			return;
		}
		if (tick > this.endTick) {
			this.needCleanUp = true;
			return;
		}

		// The client runs a tick before drawing, so the first frame shows tick 1.
		const t = Math.min(this.frames, Math.floor((tick - this.startTick) / RING_TICK_MS) + 1);
		// Epiclesis lives as long as its unit: after a long gap (a hidden tab), replay only the last ticks
		if (this.epiclesis) {
			this.ticks = Math.max(this.ticks, t - 300);
		}
		while (this.ticks < t) {
			if (this.epiclesis) {
				this.stepEpiclesis(gl);
			} else {
				for (const ring of this.rings) {
					stepRing(ring.sim);
				}
			}
			this.ticks++;
		}

		const textures = (this.textures || this.rings.map(() => this.texture)).map(name => _textures.get(name));
		if (textures.some(texture => !texture)) {
			return;
		}

		const attribute = _program.attribute;
		const self = this;

		SpriteRenderer.runWithDepth(true, false, false, function () {
			self.rings.forEach((ring, i) => {
				gl.bindTexture(gl.TEXTURE_2D, textures[i]);
				buildRing(ring.vertices, ring.sim, self.position);
				if (!ring.buffer) {
					ring.buffer = gl.createBuffer();
				}
				gl.bindBuffer(gl.ARRAY_BUFFER, ring.buffer);
				gl.bufferData(gl.ARRAY_BUFFER, ring.vertices, gl.DYNAMIC_DRAW);
				gl.vertexAttribPointer(attribute.aPosition, 3, gl.FLOAT, false, 4 * 5, 0);
				gl.vertexAttribPointer(attribute.aTextureCoord, 2, gl.FLOAT, false, 4 * 5, 3 * 4);
				const tint = self.epiclesis ? { color: EPICLESIS_TINT, additive: true } : modeTint(ring.sim.mode);
				ring.color[0] = tint.color[0] / 255;
				ring.color[1] = tint.color[1] / 255;
				ring.color[2] = tint.color[2] / 255;
				gl.blendFunc(gl.SRC_ALPHA, tint.additive ? gl.ONE : gl.ONE_MINUS_SRC_ALPHA);

				ring.sim.bands.forEach((band, b) => {
					const alpha = Math.min(255, band.alpha);
					if (alpha <= 0) {
						return;
					}
					ring.color[3] = alpha / 255;
					gl.uniform4fv(_program.uniform.uColor, ring.color);
					gl.drawArrays(gl.TRIANGLES, b * STRIPS * 6, STRIPS * 6);
				});
			});
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		});
	}

	/**
	 * One tick of Epiclesis's rings: a new ring on effect ticks 0, 100, 200...
	 * (the client builds it before the update, so it moves on the same tick),
	 * then every ring runs; spent rings are dropped.
	 *
	 * @param {WebGLRenderingContext} gl
	 */
	stepEpiclesis(gl) {
		if (this.ticks % RING_EVERY === 0) {
			// The GL buffer is made when the ring is first drawn, so replayed ticks make none
			this.rings.push({
				sim: createEpiclesisRing(),
				vertices: new Float32Array(RING_VERTICES * 5),
				color: new Float32Array(4),
				buffer: null
			});
		}
		for (const ring of this.rings) {
			stepEpiclesisRing(ring.sim);
		}
		this.rings = this.rings.filter(ring => {
			if (ringRunning(ring.sim)) {
				return true;
			}
			if (ring.buffer) {
				gl.deleteBuffer(ring.buffer);
			}
			return false;
		});
	}

	static init(gl) {
		_program = WebGL.createShaderProgram(gl, _vertexShader, _fragmentShader);
		this.ready = true;
		this.renderBeforeEntities = false;
	}

	static free(gl) {
		if (_program) {
			gl.deleteProgram(_program);
			_program = null;
		}
		for (const texture of _textures.values()) {
			if (texture) {
				gl.deleteTexture(texture);
			}
		}
		_textures.clear();
		this.ready = false;
	}

	static beforeRender(gl, modelView, projection, fog) {
		const uniform = _program.uniform;
		const attribute = _program.attribute;

		gl.useProgram(_program);
		gl.uniformMatrix4fv(uniform.uModelViewMat, false, modelView);
		gl.uniformMatrix4fv(uniform.uProjectionMat, false, projection);

		gl.uniform1i(uniform.uFogUse, fog.use && fog.exist);
		gl.uniform1f(uniform.uFogNear, fog.near);
		gl.uniform1f(uniform.uFogFar, fog.far);
		gl.uniform3fv(uniform.uFogColor, fog.color);

		gl.activeTexture(gl.TEXTURE0);
		gl.uniform1i(uniform.uDiffuse, 0);

		gl.enableVertexAttribArray(attribute.aPosition);
		gl.enableVertexAttribArray(attribute.aTextureCoord);

		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	}

	static afterRender(gl) {
		gl.disableVertexAttribArray(_program.attribute.aPosition);
		gl.disableVertexAttribArray(_program.attribute.aTextureCoord);
	}
}

export default CastRing;
