/**
 * Renderer/Effects/HealCylinders.js
 *
 * Draws Heal's two upright alpha_down.tga bands (effects 312 and 320,
 * HealSim.js) round the target with the cast-aura ring's geometry
 * (CastRingSim.buildRing), added.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import WebGL from 'Utils/WebGL.js';
import Client from 'Core/Client.js';
import SpriteRenderer from 'Renderer/SpriteRenderer.js';
import { RING_TICK_MS, RING_VERTICES, STRIPS, buildRing } from 'Renderer/Effects/CastRingSim.js';
import { HEAL_LIFE, createHeal, stepHeal } from 'Renderer/Effects/HealSim.js';
import _vertexShader from './EffectPrim.vs?raw';
import _fragmentShader from './EffectPrim.fs?raw';

/**
 * @var {WebGLProgram}
 */
let _program = null;

/**
 * @var {WebGLTexture} effect\alpha_down.tga
 */
let _texture = null;

/**
 * Bumped by every init and free, so a texture load that finishes after a free
 * (a map change) is dropped.
 */
let _generation = 0;

/** Fog colour for these added bands: fogged, they fade to nothing. */
const BLACK = new Float32Array([0, 0, 0]);

class HealCylinders {
	/**
	 * @param {number} effectId 312 or 320
	 * @param {object} owner the target (the bands follow it)
	 * @param {number} startTick
	 */
	constructor(effectId, owner, startTick) {
		this.owner = owner;
		this.position = owner && owner.position ? owner.position : [0, 0, 0];
		this.startTick = startTick || 0;
		this.endTick = this.startTick + HEAL_LIFE * RING_TICK_MS;
		this.heal = createHeal(effectId);
		this.ticks = 0;
		this.vertices = new Float32Array(RING_VERTICES * 5);
		const tint = this.heal.kind.tint;
		this.color = new Float32Array([tint[0] / 255, tint[1] / 255, tint[2] / 255, 1]);
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
		if (tick > this.endTick) {
			this.needCleanUp = true;
			return;
		}
		// The client updates before it draws, so the first frame is tick 1.
		const t = Math.min(HEAL_LIFE, Math.floor((tick - this.startTick) / RING_TICK_MS) + 1);
		while (this.ticks < t) {
			stepHeal(this.heal);
			this.ticks++;
		}
		if (!_texture) {
			return;
		}

		const attribute = _program.attribute;
		SpriteRenderer.runWithDepth(true, false, false, () => {
			gl.bindTexture(gl.TEXTURE_2D, _texture);
			buildRing(this.vertices, this.heal, (this.owner && this.owner.position) || this.position);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
			gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
			gl.vertexAttribPointer(attribute.aPosition, 3, gl.FLOAT, false, 4 * 5, 0);
			gl.vertexAttribPointer(attribute.aTextureCoord, 2, gl.FLOAT, false, 4 * 5, 3 * 4);
			this.heal.bands.forEach((band, b) => {
				const alpha = Math.min(255, band.alpha);
				if (alpha <= 0) {
					return;
				}
				this.color[3] = alpha / 255;
				gl.uniform4fv(_program.uniform.uColor, this.color);
				gl.drawArrays(gl.TRIANGLES, b * STRIPS * 6, STRIPS * 6);
			});
		});
	}

	static init(gl) {
		_program = WebGL.createShaderProgram(gl, _vertexShader, _fragmentShader);
		const generation = ++_generation;
		Client.loadFile('data/texture/effect/alpha_down.tga', buffer => {
			WebGL.texture(gl, buffer, texture => {
				if (generation !== _generation) {
					gl.deleteTexture(texture);
					return;
				}
				if (_texture) {
					gl.deleteTexture(_texture);
				}
				_texture = texture;
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
		if (_texture) {
			gl.deleteTexture(_texture);
			_texture = null;
		}
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

		// Added (band colours 9 and 5)
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
	}

	static afterRender(gl) {
		gl.disableVertexAttribArray(_program.attribute.aPosition);
		gl.disableVertexAttribArray(_program.attribute.aTextureCoord);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	}
}

export default HealCylinders;
