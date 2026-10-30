/**
 * Renderer/Effects/FieldBand.js
 *
 * Draws the official client's ground band (primitive 36): one band of a ring
 * texture breathing open under a skill unit's cell, for as long as the unit
 * lasts (Volcano 239 ring_red.tga, Deluge 240 ring_blue.tga, Violent Gale 241
 * magic_green.tga). The motion and geometry are in FieldBandSim.js; this file
 * only draws them.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import WebGL from 'Utils/WebGL.js';
import Client from 'Core/Client.js';
import SpriteRenderer from 'Renderer/SpriteRenderer.js';
import { FIELD_BAND_TICK_MS, FIELD_BAND_VERTICES, createBand, stepBand, buildBand } from './FieldBandSim.js';
import _vertexShader from './EffectPrim.vs?raw';
import _fragmentShader from './EffectPrim.fs?raw';

/**
 * @var {WebGLProgram}
 */
let _program = null;

/**
 * Textures by file name, shared by every band.
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

class FieldBand {
	/**
	 * @param {Array} position cell position (x, y, height)
	 * @param {number} startTick
	 * @param {string} texture file under data/texture/effect/
	 * @param {function} [random] returns [0, 1), for the start angle and alpha
	 * @param {number[]} [color] [r, g, b] 0-255 the texture is tinted with (white when left out)
	 */
	constructor(position, startTick, texture, random = Math.random, color = [255, 255, 255]) {
		this.position = position;
		this.startTick = startTick || 0;
		this.texture = texture;
		this.band = createBand(random);
		this.vertices = new Float32Array(FIELD_BAND_VERTICES * 5);
		this.color = new Float32Array([color[0] / 255, color[1] / 255, color[2] / 255, 1]);
	}

	init(gl) {
		this.buffer = gl.createBuffer();
		loadTexture(gl, this.texture);
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

		// The client counts a tick before drawing, so the first frame is tick 1.
		// After a long pause (hidden tab) only the last cycle matters: skip ahead.
		const t = Math.floor((tick - this.startTick) / FIELD_BAND_TICK_MS) + 1;
		if (t - this.band.age > 600) {
			this.band.age = t - 600;
		}
		while (this.band.age < t) {
			stepBand(this.band);
		}

		const texture = _textures.get(this.texture);
		const alpha = Math.min(255, this.band.alpha);
		if (!texture || alpha <= 0) {
			return;
		}
		const count = buildBand(this.vertices, this.band, this.position);
		const attribute = _program.attribute;
		const self = this;

		SpriteRenderer.runWithDepth(true, false, false, function () {
			gl.bindBuffer(gl.ARRAY_BUFFER, self.buffer);
			gl.bufferData(gl.ARRAY_BUFFER, self.vertices, gl.DYNAMIC_DRAW);
			gl.vertexAttribPointer(attribute.aPosition, 3, gl.FLOAT, false, 4 * 5, 0);
			gl.vertexAttribPointer(attribute.aTextureCoord, 2, gl.FLOAT, false, 4 * 5, 3 * 4);
			gl.bindTexture(gl.TEXTURE_2D, texture);
			self.color[3] = alpha / 255;
			gl.uniform4fv(_program.uniform.uColor, self.color);
			gl.drawArrays(gl.TRIANGLES, 0, count);
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

		// Normal alpha blending, as the client draws primitive 36
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	}

	static afterRender(gl) {
		gl.disableVertexAttribArray(_program.attribute.aPosition);
		gl.disableVertexAttribArray(_program.attribute.aTextureCoord);
	}
}

export default FieldBand;
