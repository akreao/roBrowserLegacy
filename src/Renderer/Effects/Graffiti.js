/**
 * Renderer/Effects/Graffiti.js
 *
 * Draws a Graffiti (Rogue's Scribble) unit's text flat on the ground, the way
 * the official client does (GraffitiSim.js has the numbers): the text written
 * with effect\alpabet.bmp into a 384 x 384 texture, laid over the 18 x 18
 * cells around the unit and turned by the local player's facing when the unit
 * appeared.
 *
 * Effect table entry:
 *   { type: 'FUNC', func(Params) {
 *       this.add(new Graffiti(position, Params.Init.unitMessage, angle), Params);
 *   } }
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import WebGL from 'Utils/WebGL.js';
import Texture from 'Utils/Texture.js';
import glMatrix from 'Utils/gl-matrix.js';
import Client from 'Core/Client.js';
import Altitude from 'Renderer/Map/Altitude.js';
import { GRAFFITI_CELLS, GRAFFITI_TEXTURE, GLYPH_PX, layoutGraffiti, graffitiUV } from './GraffitiSim.js';
import _vertexShader from './GroundEffect.vs?raw';
import _fragmentShader from './GroundEffect.fs?raw';

const mat4 = glMatrix.mat4;
const _identity = mat4.create();
const _color = new Float32Array([1, 1, 1, 1]);

let _program = null;

/** alpabet.bmp as a canvas (magenta removed), shared by every graffiti. */
let _atlas = null;
let _atlasLoading = false;
const _waiting = new Set();

/** Graffiti with GL objects, rebuilt after a context loss. */
const _live = new Set();

function loadAtlas() {
	if (_atlas || _atlasLoading) {
		return;
	}
	_atlasLoading = true;
	Client.loadFile('data/texture/effect/alpabet.bmp', buffer => {
		Texture.load(buffer, function (success) {
			_atlasLoading = false;
			if (!success) {
				_waiting.clear();
				return;
			}
			_atlas = this;
			_waiting.forEach(graffiti => graffiti.buildTexture());
			_waiting.clear();
		});
	});
}

class Graffiti {
	/**
	 * @param {Array} position unit position, in cells
	 * @param {string} text the caster's text
	 * @param {number} angle facing in degrees the text is turned by
	 */
	constructor(position, text, angle) {
		this.x = Math.floor(position[0]);
		this.y = Math.floor(position[1]);
		this.text = text || '';
		this.angle = angle || 0;
		this.texture = null;
	}

	init(gl) {
		this.gl = gl;
		_live.add(this);
		const plane = Altitude.generatePlane(this.x, this.y, GRAFFITI_CELLS);
		if (!plane) {
			return;
		}
		const data = new Float32Array(plane);
		for (let i = 0; i < data.length; i += 5) {
			const uv = graffitiUV(data[i] - this.x, data[i + 2] - this.y, this.angle);
			data[i + 3] = uv[0];
			data[i + 4] = uv[1];
		}
		this.vertCount = data.length / 5;
		this.buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

		if (_atlas) {
			this.buildTexture();
		} else {
			_waiting.add(this);
			loadAtlas();
		}
		this.ready = true;
	}

	/**
	 * Write the text into this graffiti's own texture.
	 */
	buildTexture() {
		const gl = this.gl;
		if (!gl || !this.buffer) {
			return;
		}
		const canvas = document.createElement('canvas');
		canvas.width = canvas.height = GRAFFITI_TEXTURE;
		const ctx = canvas.getContext('2d');
		layoutGraffiti(this.text).forEach(g => {
			ctx.drawImage(_atlas, g.sx, g.sy, GLYPH_PX, GLYPH_PX, g.x, g.y, g.w, GLYPH_PX);
		});

		this.texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	}

	free(gl) {
		_waiting.delete(this);
		_live.delete(this);
		if (this.buffer) {
			gl.deleteBuffer(this.buffer);
			this.buffer = null;
		}
		if (this.texture) {
			gl.deleteTexture(this.texture);
			this.texture = null;
		}
		this.ready = false;
	}

	render(gl) {
		if (!this.texture) {
			return;
		}
		const attribute = _program.attribute;
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		gl.vertexAttribPointer(attribute.aPosition, 3, gl.FLOAT, false, 5 * 4, 0);
		gl.vertexAttribPointer(attribute.aTextureCoord, 2, gl.FLOAT, false, 5 * 4, 3 * 4);
		gl.drawArrays(gl.TRIANGLES, 0, this.vertCount);
	}

	static init(gl) {
		_program = WebGL.createShaderProgram(gl, _vertexShader, _fragmentShader);
		loadAtlas();
		this.ready = true;
	}

	static free(gl) {
		if (_program) {
			gl.deleteProgram(_program);
			_program = null;
		}
		// The atlas is a canvas, not a GL object: it survives a context reset.
		// Live graffiti lost their buffer and texture with the old context: drop
		// them (deleting a lost object does nothing) and build them again.
		_live.forEach(graffiti => {
			graffiti.free(gl);
			graffiti.needInit = true;
		});
		this.ready = false;
	}

	static beforeRender(gl, modelView, projection, fog) {
		const uniform = _program.uniform;
		const attribute = _program.attribute;

		gl.depthMask(false);
		gl.useProgram(_program);
		gl.uniformMatrix4fv(uniform.uModelViewMat, false, modelView);
		gl.uniformMatrix4fv(uniform.uProjectionMat, false, projection);
		gl.uniformMatrix4fv(uniform.uRotationMat, false, _identity);
		gl.uniform1i(uniform.uFogUse, fog.use && fog.exist);
		gl.uniform1f(uniform.uFogNear, fog.near);
		gl.uniform1f(uniform.uFogFar, fog.far);
		gl.uniform3fv(uniform.uFogColor, fog.color);
		gl.uniform4fv(uniform.uSpriteRendererColor, _color);
		gl.activeTexture(gl.TEXTURE0);
		gl.uniform1i(uniform.uDiffuse, 0);
		gl.enableVertexAttribArray(attribute.aPosition);
		gl.enableVertexAttribArray(attribute.aTextureCoord);
	}

	static afterRender(gl) {
		gl.depthMask(true);
		gl.disableVertexAttribArray(_program.attribute.aPosition);
		gl.disableVertexAttribArray(_program.attribute.aTextureCoord);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	}
}

Graffiti.renderBeforeEntities = true;
export default Graffiti;
