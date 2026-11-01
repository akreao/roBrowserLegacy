/**
 * Renderer/Effects/DupleLight.js
 *
 * Draws Duple Light's orbs (DupleLightSim.js): two blue thunder_center.bmp orbs
 * circling the actor, each with four freeze_a.bmp sparks, added. Lives until
 * the effect is removed (the Duple Light status ends). Spec:
 * effect-port/duple-light.md.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import WebGL from 'Utils/WebGL.js';
import Client from 'Core/Client.js';
import Camera from 'Renderer/Camera.js';
import SpriteRenderer from 'Renderer/SpriteRenderer.js';
import { PRIM_TICK_MS, UNITS_PER_CELL } from 'Renderer/Effects/EffectPrimSim.js';
import {
	CORE_COLORS,
	SPARK_GREYS,
	createOrbs,
	stepOrb,
	coreSize,
	sparkCorners
} from 'Renderer/Effects/DupleLightSim.js';
import _vertexShader from './EffectPrim.vs?raw';
import _fragmentShader from './EffectPrim.fs?raw';

const DEG = Math.PI / 180;

/**
 * @var {WebGLProgram}
 */
let _program = null;

/** Textures: 0 thunder_center.bmp, 1 freeze_a.bmp. */
const TEXTURE_FILES = ['data/texture/effect/thunder_center.bmp', 'data/texture/effect/freeze_a.bmp'];
const _textures = [null, null];

/**
 * Bumped by every init and free, so a texture load that finishes after a free
 * (a map change) is dropped.
 */
let _generation = 0;

/** Fog colour for the added orbs: fogged, they fade to nothing instead of adding the fog's colour. */
const BLACK = new Float32Array([0, 0, 0]);

/** Most update ticks replayed in one frame (after a hidden tab, say); older ones are skipped. */
const MAX_CATCH_UP = 120;

class DupleLight {
	/**
	 * @param {object} owner the actor (the orbs follow it)
	 * @param {number} startTick
	 * @param {number} [count] orbs, as the status passes them (2)
	 */
	constructor(owner, startTick, count) {
		this.owner = owner;
		this.startTick = startTick || 0;
		this.orbs = createOrbs(count);
		this.ticks = 0;
		this.vertices = new Float32Array(6 * 5);
		this.color = new Float32Array(4);
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

	/**
	 * Write a quad's two triangles from four corners (client units about the actor).
	 */
	quad(corners, center) {
		const out = this.vertices;
		const uv = [
			[0, 0],
			[1, 0],
			[1, 1],
			[0, 1]
		];
		let o = 0;
		for (const k of [0, 1, 2, 2, 3, 0]) {
			const p = corners[k];
			out[o++] = center[0] + p[0] / UNITS_PER_CELL;
			out[o++] = center[1] + p[1] / UNITS_PER_CELL;
			out[o++] = center[2] + p[2] / UNITS_PER_CELL;
			out[o++] = uv[k][0];
			out[o++] = uv[k][1];
		}
	}

	draw(gl, texture, rgb, alpha) {
		if (!texture || alpha <= 0) {
			return;
		}
		const attribute = _program.attribute;
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
		gl.vertexAttribPointer(attribute.aPosition, 3, gl.FLOAT, false, 4 * 5, 0);
		gl.vertexAttribPointer(attribute.aTextureCoord, 2, gl.FLOAT, false, 4 * 5, 3 * 4);
		this.color[0] = rgb[0] / 255;
		this.color[1] = rgb[1] / 255;
		this.color[2] = rgb[2] / 255;
		this.color[3] = Math.min(255, alpha) / 255;
		gl.uniform4fv(_program.uniform.uColor, this.color);
		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}

	render(gl, tick) {
		if (tick < this.startTick) {
			return;
		}
		// The client updates before it draws, so the first frame is tick 1.
		const t = Math.floor((tick - this.startTick) / PRIM_TICK_MS) + 1;
		// The orbs live as long as the status: after a long gap, replay only the last ticks
		this.ticks = Math.max(this.ticks, t - MAX_CATCH_UP);
		while (this.ticks < t) {
			this.orbs.forEach(orb => stepOrb(orb));
			this.ticks++;
		}

		const at = (this.owner && this.owner.position) || [0, 0, 0];
		// The actor's feet in GL space; client units below are added in cells (y down).
		const center = [at[0] + 0.5, -at[2], at[1] + 0.5];

		// Camera-facing axes, as Level99Bubble builds them from the camera angles (GL and client axes agree)
		const beta = ((360 - Camera.angle[0] + 90) % 360) * DEG;
		const alpha = ((360 - Camera.angle[1]) % 360) * DEG;
		const right = [Math.cos(alpha), 0, -Math.sin(alpha)];
		const up = [Math.cos(beta) * Math.sin(alpha), -Math.sin(beta), Math.cos(beta) * Math.cos(alpha)];

		SpriteRenderer.runWithDepth(true, false, false, () => {
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
			for (const orb of this.orbs) {
				const c = orb.center;
				for (let core = 0; core < 2; core++) {
					const s = coreSize(orb, core);
					const corners = [0, 90, 180, 270].map(a => {
						const x = Math.cos(a * DEG) * s;
						const y = Math.sin(a * DEG) * s;
						return [
							c[0] + x * right[0] + y * up[0],
							c[1] + x * right[1] + y * up[1],
							c[2] + x * right[2] + y * up[2]
						];
					});
					this.quad(corners, center);
					this.draw(gl, _textures[0], CORE_COLORS[core], orb.alpha);
				}
				orb.sparks.forEach((spark, i) => {
					if (spark.age <= 0 || !(spark.shown > 0)) {
						return;
					}
					this.quad(sparkCorners(orb, spark), center);
					this.draw(gl, _textures[1], [SPARK_GREYS[i], SPARK_GREYS[i], 255], spark.alpha);
				});
			}
		});
	}

	static init(gl) {
		_program = WebGL.createShaderProgram(gl, _vertexShader, _fragmentShader);
		const generation = ++_generation;
		TEXTURE_FILES.forEach((file, i) => {
			Client.loadFile(file, buffer => {
				WebGL.texture(gl, buffer, texture => {
					if (generation !== _generation) {
						gl.deleteTexture(texture);
						return;
					}
					if (_textures[i]) {
						gl.deleteTexture(_textures[i]);
					}
					_textures[i] = texture;
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
		_textures.forEach((texture, i) => {
			if (texture) {
				gl.deleteTexture(texture);
				_textures[i] = null;
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
		gl.uniform3fv(uniform.uFogColor, BLACK);

		gl.activeTexture(gl.TEXTURE0);
		gl.uniform1i(uniform.uDiffuse, 0);

		gl.enableVertexAttribArray(attribute.aPosition);
		gl.enableVertexAttribArray(attribute.aTextureCoord);

		// Added, as the client draws the orbs
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
	}

	static afterRender(gl) {
		gl.disableVertexAttribArray(_program.attribute.aPosition);
		gl.disableVertexAttribArray(_program.attribute.aTextureCoord);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	}
}

export default DupleLight;
