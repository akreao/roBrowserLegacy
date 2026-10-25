/**
 * Renderer/Effects/EnergyOrb.js
 *
 * Draws a Kagerou/Oboro's spirit charm orbs as the official client does
 * (effects 735 to 738, one per charm element): the orbs circle the actor in
 * a ring that turns with the camera, each a normal-blended quad with an
 * additive quad on top. The motion is in EnergyOrbSim.js; this file only
 * draws it.
 *
 * Effect table entry:
 *   { type: 'FUNC', attachedEntity: true, func(Params) {
 *       this.add(new EnergyOrb(Params.Init.ownerEntity, 735, Params.Init.spiritNum, Params.Inst.startTick), Params);
 *   } }
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import WebGL from 'Utils/WebGL.js';
import Client from 'Core/Client.js';
import SpriteRenderer from 'Renderer/SpriteRenderer.js';
import { ORB_TICK_MS, UNITS_PER_CELL, ORB_LOOKS, createOrbs, orbAlpha, orbAt, cameraFrame } from './EnergyOrbSim.js';
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
 * Textures by file name, shared by every orb ring.
 */
const _textures = new Map();

/**
 * Camera frame for the ring, refreshed once a frame: screen right and "away
 * from the camera", both flat on the ground, in GL world space.
 */
const _right = new Float32Array(3);
const _away = new Float32Array(3);

const _position = new Float32Array(3);
const _color = new Float32Array([1, 1, 1, 1]);

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

class EnergyOrb {
	/**
	 * @param {Entity} entity actor the orbs circle (its position is kept by reference)
	 * @param {number} effectId 735 fire, 736 wind, 737 water, 738 earth
	 * @param {number} count charms
	 * @param {number} startTick
	 */
	constructor(entity, effectId, count, startTick) {
		const look = ORB_LOOKS[effectId] || ORB_LOOKS[735];
		this.position = entity.position;
		this.texture = look.texture;
		this.size = look.size;
		this.orbs = createOrbs(count);
		this.startTick = startTick || 0;
	}

	init(gl) {
		loadTexture(gl, this.texture);
		this.ready = true;
	}

	free(gl) {
		this.ready = false;
	}

	render(gl, tick) {
		const texture = _textures.get(this.texture);
		if (!texture || !this.orbs.length || tick < this.startTick) {
			return;
		}

		// The client counts a tick before drawing, so the first frame is tick 1.
		const ticks = Math.floor((tick - this.startTick) / ORB_TICK_MS) + 1;
		_color[3] = orbAlpha(ticks) / 255;

		const uniform = _program.uniform;
		const attribute = _program.attribute;
		const base = this.position;
		const orbs = this.orbs;
		const size = this.size;

		gl.bindBuffer(gl.ARRAY_BUFFER, _buffer);
		gl.vertexAttribPointer(attribute.aPosition, 2, gl.FLOAT, false, 4 * 4, 0);
		gl.vertexAttribPointer(attribute.aTextureCoord, 2, gl.FLOAT, false, 4 * 4, 2 * 4);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.uniform4fv(uniform.uColor, _color);

		SpriteRenderer.runWithDepth(true, false, false, function () {
			for (let i = 0; i < orbs.length; i++) {
				const orb = orbAt(orbs[i], ticks, size);
				const x = orb.x / UNITS_PER_CELL;
				const z = orb.z / UNITS_PER_CELL;

				// GL world: (x + 0.5, -height, y + 0.5); the client's height is already negative-up
				_position[0] = base[0] + 0.5 + _right[0] * x + _away[0] * z;
				_position[1] = -base[2] + orb.y / UNITS_PER_CELL;
				_position[2] = base[1] + 0.5 + _right[2] * x + _away[2] * z;
				gl.uniform3fv(uniform.uPosition, _position);

				// Back quad, normal blending, a little larger
				gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
				gl.uniform1f(uniform.uSize, orb.back / UNITS_PER_CELL);
				gl.drawArrays(gl.TRIANGLES, 0, 6);

				// Front quad, additive
				gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
				gl.uniform1f(uniform.uSize, orb.front / UNITS_PER_CELL);
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

		cameraFrame(modelView, _right, _away);
	}

	static afterRender(gl) {
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.disableVertexAttribArray(_program.attribute.aPosition);
		gl.disableVertexAttribArray(_program.attribute.aTextureCoord);
	}
}

export default EnergyOrb;
