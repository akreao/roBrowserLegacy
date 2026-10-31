/**
 * Renderer/Effects/SonicWave.js
 *
 * Draws one ring set of the official client's Sonic Wave (effect 1678): four
 * white bands of son_wave_00.tga or son_wave_01.tga drifting from the caster
 * towards the target. The motion and geometry are in SonicWaveSim.js; this
 * file only draws them. Spec: effect-port/sonic-wave.md.
 *
 * The set takes the caster's position and the heading to the target when it
 * starts, as the client builds each set from where they are at that tick.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import WebGL from 'Utils/WebGL.js';
import Client from 'Core/Client.js';
import Preferences from 'Preferences/Map.js';
import SpriteRenderer from 'Renderer/SpriteRenderer.js';
import {
	WAVE_TICK_MS,
	WAVE_TEXTURES,
	RING_VERTICES,
	simulateRing,
	buildRing,
	headingTo
} from 'Renderer/Effects/SonicWaveSim.js';
import _vertexShader from './EffectPrim.vs?raw';
import _fragmentShader from './EffectPrim.fs?raw';

/**
 * @var {WebGLProgram}
 */
let _program = null;

/**
 * @var {Array<WebGLTexture>} by variant
 */
const _textures = [null, null];

/**
 * Bumped by every init and free, so a texture load that finishes after a free
 * (a map change) is dropped.
 */
let _generation = 0;

/** Rings in a set. */
const RINGS = 4;

class SonicWave {
	/**
	 * @param {number} variant 0 (son_wave_00) or 1 (son_wave_01)
	 * @param {object} from caster: { entity, position }
	 * @param {object} to target: { entity, position }
	 * @param {number} startTick
	 */
	constructor(variant, from, to, startTick) {
		this.variant = variant;
		this.from = from;
		this.to = to;
		this.startTick = startTick || 0;
		this.started = false;
		this.vertices = new Float32Array(RING_VERTICES * 5);
		this.color = new Float32Array([1, 1, 1, 1]);
	}

	/**
	 * Take the caster's position and the heading, and run the rings.
	 */
	start() {
		const from = (this.from.entity && this.from.entity.position) || this.from.position || [0, 0, 0];
		const to = (this.to.entity && this.to.entity.position) || this.to.position || from;
		this.position = [from[0], from[1], from[2]];
		this.heading = headingTo(from, to);
		const low = !!Preferences.mineffect;
		this.rings = [];
		for (let i = 0; i < RINGS; i++) {
			this.rings.push(simulateRing(i, this.variant, low));
		}
		this.frames = Math.max(...this.rings.map(states => states.length - 1));
		this.started = true;
	}

	init(gl) {
		this.buffer = gl.createBuffer();
		this.ready = true;
	}

	free(gl) {
		this.ready = false;
		if (this.buffer) {
			gl.deleteBuffer(this.buffer);
			this.buffer = null;
		}
	}

	render(gl, tick) {
		if (tick < this.startTick) {
			return;
		}
		if (!this.started) {
			this.start();
		}
		// The client updates before drawing, so the first frame is set tick 1.
		const t = Math.floor((tick - this.startTick) / WAVE_TICK_MS) + 1;
		if (t > this.frames) {
			this.needCleanUp = true;
			return;
		}
		const texture = _textures[this.variant];
		if (!texture) {
			return;
		}

		const attribute = _program.attribute;
		const self = this;
		SpriteRenderer.runWithDepth(true, false, false, function () {
			gl.bindBuffer(gl.ARRAY_BUFFER, self.buffer);
			gl.bindTexture(gl.TEXTURE_2D, texture);
			for (const states of self.rings) {
				const state = states[t];
				if (!state || state.alpha <= 0) {
					continue;
				}
				const end = buildRing(self.vertices, 0, state, self.variant, self.heading, self.position);
				gl.bufferData(gl.ARRAY_BUFFER, self.vertices, gl.DYNAMIC_DRAW);
				gl.vertexAttribPointer(attribute.aPosition, 3, gl.FLOAT, false, 4 * 5, 0);
				gl.vertexAttribPointer(attribute.aTextureCoord, 2, gl.FLOAT, false, 4 * 5, 3 * 4);
				self.color[3] = state.alpha / 255;
				gl.uniform4fv(_program.uniform.uColor, self.color);
				gl.drawArrays(gl.TRIANGLES, 0, end / 5);
			}
		});
	}

	static init(gl) {
		_program = WebGL.createShaderProgram(gl, _vertexShader, _fragmentShader);
		const generation = ++_generation;
		WAVE_TEXTURES.forEach((file, variant) => {
			Client.loadFile(file, buffer => {
				WebGL.texture(gl, buffer, texture => {
					if (generation !== _generation) {
						gl.deleteTexture(texture);
						return;
					}
					if (_textures[variant]) {
						gl.deleteTexture(_textures[variant]);
					}
					_textures[variant] = texture;
				});
			});
		});
		this.ready = true;
		this.renderBeforeEntities = false;
	}

	static free(gl) {
		_generation++;
		if (_program) {
			gl.deleteProgram(_program);
			_program = null;
		}
		_textures.forEach((texture, variant) => {
			if (texture) {
				gl.deleteTexture(texture);
				_textures[variant] = null;
			}
		});
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

		// Normal alpha blending (the band renderer's colour mode 0)
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	}

	static afterRender(gl) {
		gl.disableVertexAttribArray(_program.attribute.aPosition);
		gl.disableVertexAttribArray(_program.attribute.aTextureCoord);
	}
}

export default SonicWave;
