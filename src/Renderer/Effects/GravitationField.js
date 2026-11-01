/**
 * Renderer/Effects/GravitationField.js
 *
 * Draws the official client's Gravitation Field spikes (effect 522): a 5 x 5
 * grid of stone and ice spikes shuddering out of the ground. The motion and
 * numbers are in GravitationFieldSim.js, the spike shape in IceSpikesSim.js;
 * this file only draws them, one batch a texture.
 *
 * Effect table entry:
 *   { type: 'FUNC', func(Params) {
 *       this.add(new GravitationField(position, startTick, planGravitation(), GRAVITATION.castLength), Params);
 *   } }
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import WebGL from 'Utils/WebGL.js';
import Client from 'Core/Client.js';
import SpriteRenderer from 'Renderer/SpriteRenderer.js';
import { SPIKE_VERTICES, buildSpike } from './IceSpikesSim.js';
import { GRAVITATION, GRAVITATION_TEXTURES, GRAVITATION_TICK_MS, gravitationAt } from './GravitationFieldSim.js';
import _vertexShader from './EffectPrim.vs?raw';
import _fragmentShader from './EffectPrim.fs?raw';

/**
 * @var {WebGLProgram}
 */
let _program = null;

/**
 * @var {Array} WebGLTexture by spike kind, shared by every field
 */
const _textures = [];
let _loading = false;

/**
 * Bumped when the class is freed (map change, context reset): a load started
 * before that belongs to the old context and is dropped when it finishes.
 */
let _generation = 0;

/** Floats in one spike: 12 vertices of x, y, z, u, v. */
const SPIKE_FLOATS = SPIKE_VERTICES * 5;

class GravitationField {
	/**
	 * @param {vec3} position effect position, in cells
	 * @param {number} startTick
	 * @param {Array} spikes from planGravitation
	 * @param {number} length effect length in ticks (the spikes fade over it)
	 */
	constructor(position, startTick, spikes, length) {
		this.position = position;
		this.startTick = startTick || 0;
		this.length = length;
		this.endTick = this.startTick + Math.min(length, GRAVITATION.life) * GRAVITATION_TICK_MS;
		this.color = new Float32Array([1, 1, 1, 1]);
		// One batch a texture
		this.batches = GRAVITATION_TEXTURES.map((file, kind) => {
			const own = spikes.filter(spike => spike.kind === kind);
			return { kind, spikes: own, vertices: new Float32Array(own.length * SPIKE_FLOATS), buffer: null };
		});
	}

	init(gl) {
		this.batches.forEach(batch => {
			batch.buffer = gl.createBuffer();
		});
		if (!_loading) {
			_loading = true;
			const generation = _generation;
			GRAVITATION_TEXTURES.forEach((file, kind) => {
				Client.loadFile(`data/texture/effect/${file}`, buffer => {
					WebGL.texture(gl, buffer, texture => {
						if (generation !== _generation) {
							gl.deleteTexture(texture);
							return;
						}
						_textures[kind] = texture;
					});
				});
			});
		}
		this.ready = true;
	}

	free(gl) {
		this.ready = false;
		this.batches.forEach(batch => {
			if (batch.buffer) {
				gl.deleteBuffer(batch.buffer);
				batch.buffer = null;
			}
		});
	}

	render(gl, tick) {
		if (tick < this.startTick) {
			return;
		}
		if (tick >= this.endTick) {
			this.needCleanUp = true;
			return;
		}

		const state = gravitationAt(Math.floor((tick - this.startTick) / GRAVITATION_TICK_MS), this.length);
		if (!state || state.alpha <= 0) {
			return;
		}

		const attribute = _program.attribute;
		const self = this;
		this.color[3] = state.alpha / 255;
		gl.uniform4fv(_program.uniform.uColor, this.color);

		SpriteRenderer.runWithDepth(true, false, false, function () {
			self.batches.forEach(batch => {
				const texture = _textures[batch.kind];
				if (!texture || !batch.spikes.length) {
					return;
				}
				let offset = 0;
				batch.spikes.forEach(spike => {
					offset = buildSpike(batch.vertices, offset, spike, state.rise, self.position, GRAVITATION);
				});
				gl.bindBuffer(gl.ARRAY_BUFFER, batch.buffer);
				gl.bufferData(gl.ARRAY_BUFFER, batch.vertices, gl.DYNAMIC_DRAW);
				gl.vertexAttribPointer(attribute.aPosition, 3, gl.FLOAT, false, 4 * 5, 0);
				gl.vertexAttribPointer(attribute.aTextureCoord, 2, gl.FLOAT, false, 4 * 5, 3 * 4);
				gl.bindTexture(gl.TEXTURE_2D, texture);
				gl.drawArrays(gl.TRIANGLES, 0, batch.spikes.length * SPIKE_VERTICES);
			});
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
		_textures.forEach(texture => texture && gl.deleteTexture(texture));
		_textures.length = 0;
		_loading = false;
		_generation++;
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

		// Normal alpha blending, as the client draws primitive 117
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	}

	static afterRender(gl) {
		gl.disableVertexAttribArray(_program.attribute.aPosition);
		gl.disableVertexAttribArray(_program.attribute.aTextureCoord);
	}
}

export default GravitationField;
