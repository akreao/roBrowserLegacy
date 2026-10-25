/**
 * Renderer/Effects/SoulCollect.js
 *
 * Draws a Soul Reaper's or Soul Ascetic's soul energy as the official client
 * does (effect 1225): up to five orbs circling the actor, each a coloured
 * additive quad with a smaller white one on top. The numbers are in
 * SoulCollectSim.js; this file only draws them.
 *
 * Effect table entry:
 *   { type: 'FUNC', attachedEntity: true, func(Params) {
 *       this.add(new SoulCollect(Params.Init.ownerEntity, Params.Init.spiritNum, Params.Inst.startTick), Params);
 *   } }
 *
 * The packet handler updates the count of a running one with setCount(), as
 * the client does, so orbs already shown keep their fade.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import WebGL from 'Utils/WebGL.js';
import Client from 'Core/Client.js';
import SpriteRenderer from 'Renderer/SpriteRenderer.js';
import {
	SOUL_TICK_MS,
	UNITS_PER_CELL,
	TEXTURE,
	OVERLAY,
	soulLook,
	soulShown,
	soulAlpha,
	ringPhase,
	soulOffset
} from './SoulCollectSim.js';
import _vertexShader from './EnergyOrb.vs?raw';
import _fragmentShader from './EffectPrim.fs?raw';

/**
 * @var {WebGLProgram}
 */
let _program = null;

/**
 * @var {WebGLBuffer} one quad: corner x, y then u, v (top of the image at the top)
 */
let _buffer = null;

/**
 * @var {WebGLTexture|null}
 */
let _texture = null;
let _textureRequested = false;

const _position = new Float32Array(3);
const _color = new Float32Array([1, 1, 1, 1]);

function loadTexture(gl) {
	if (_textureRequested) {
		return;
	}
	_textureRequested = true;
	Client.loadFile(`data/texture/effect/${TEXTURE}`, buffer => {
		WebGL.texture(gl, buffer, texture => {
			if (!_textureRequested) {
				gl.deleteTexture(texture);
				return;
			}
			_texture = texture;
		});
	});
}

class SoulCollect {
	/**
	 * @param {Entity} entity actor the orbs circle (its position is kept by reference)
	 * @param {number} count soul energy
	 * @param {number} startTick
	 */
	constructor(entity, count, startTick) {
		this.position = entity.position;
		this.startTick = startTick || 0;
		this.shownSince = [];
		this.setCount(count);
		entity.soulCollect = this;
	}

	/**
	 * New soul energy count. The newest souls are added or removed; the rest
	 * keep their state.
	 *
	 * @param {number} count
	 */
	setCount(count) {
		this.count = Math.max(0, count | 0);
		this.shownSince.length = this.count;
	}

	init(gl) {
		loadTexture(gl);
		this.ready = true;
	}

	free(gl) {
		this.ready = false;
	}

	render(gl, tick) {
		if (!_texture || !this.count || tick < this.startTick) {
			return;
		}

		// The client counts a tick before drawing, so the first frame is tick 1.
		const ticks = Math.floor((tick - this.startTick) / SOUL_TICK_MS) + 1;
		const phase = ringPhase(ticks);
		const count = this.count;
		const shownSince = this.shownSince;
		const uniform = _program.uniform;
		const attribute = _program.attribute;
		const base = this.position;

		gl.bindBuffer(gl.ARRAY_BUFFER, _buffer);
		gl.vertexAttribPointer(attribute.aPosition, 2, gl.FLOAT, false, 4 * 4, 0);
		gl.vertexAttribPointer(attribute.aTextureCoord, 2, gl.FLOAT, false, 4 * 4, 2 * 4);
		gl.bindTexture(gl.TEXTURE_2D, _texture);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

		SpriteRenderer.runWithDepth(true, false, false, function () {
			for (let i = 0; i < count; i++) {
				if (!soulShown(i, count)) {
					shownSince[i] = undefined;
					continue;
				}
				if (shownSince[i] === undefined) {
					shownSince[i] = ticks;
				}
				const age = ticks - shownSince[i] + 1;
				const look = soulLook(i);
				const offset = soulOffset(i, count, phase);

				// GL world: (x + 0.5, -height, y + 0.5); the client's height is already negative-up
				_position[0] = base[0] + 0.5 + offset.x / UNITS_PER_CELL;
				_position[1] = -base[2] + offset.y / UNITS_PER_CELL;
				_position[2] = base[1] + 0.5 + offset.z / UNITS_PER_CELL;
				gl.uniform3fv(uniform.uPosition, _position);

				// Base quad, in the tier's colour
				_color[0] = look.rgb[0] / 255;
				_color[1] = look.rgb[1] / 255;
				_color[2] = look.rgb[2] / 255;
				_color[3] = soulAlpha(age, look.cap) / 255;
				gl.uniform4fv(uniform.uColor, _color);
				gl.uniform1f(uniform.uSize, look.size / UNITS_PER_CELL);
				gl.drawArrays(gl.TRIANGLES, 0, 6);

				// Overlay quad, white, half the size
				_color[0] = OVERLAY.rgb[0] / 255;
				_color[1] = OVERLAY.rgb[1] / 255;
				_color[2] = OVERLAY.rgb[2] / 255;
				_color[3] = soulAlpha(age, OVERLAY.cap) / 255;
				gl.uniform4fv(uniform.uColor, _color);
				gl.uniform1f(uniform.uSize, (look.size * OVERLAY.scale) / UNITS_PER_CELL);
				gl.drawArrays(gl.TRIANGLES, 0, 6);
			}
		});
	}

	static init(gl) {
		_program = WebGL.createShaderProgram(gl, _vertexShader, _fragmentShader);
		_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, _buffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([-1, 1, 0, 0, 1, 1, 1, 0, 1, -1, 1, 1, 1, -1, 1, 1, -1, -1, 0, 1, -1, 1, 0, 0]),
			gl.STATIC_DRAW
		);
		this.ready = true;
		this.renderBeforeEntities = false;
	}

	static free(gl) {
		if (_program) {
			gl.deleteProgram(_program);
			_program = null;
		}
		if (_buffer) {
			gl.deleteBuffer(_buffer);
			_buffer = null;
		}
		if (_texture) {
			gl.deleteTexture(_texture);
			_texture = null;
		}
		_textureRequested = false;
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
	}

	static afterRender(gl) {
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.disableVertexAttribArray(_program.attribute.aPosition);
		gl.disableVertexAttribArray(_program.attribute.aTextureCoord);
	}
}

export default SoulCollect;
