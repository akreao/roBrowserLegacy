/**
 * Renderer/Effects/ForestLight.js
 *
 * Draws the official client's forest-light columns (effect 719: Renovatio):
 * four pale green cloud11.tga columns from the target up into the sky, added.
 * The numbers are in ForestLightSim.js. Spec: effect-port/forest-light.md.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import WebGL from 'Utils/WebGL.js';
import Client from 'Core/Client.js';
import SpriteRenderer from 'Renderer/SpriteRenderer.js';
import { PRIM_TICK_MS } from 'Renderer/Effects/EffectPrimSim.js';
import {
	FOREST_LIGHT_LIFE,
	COLUMN_VERTICES,
	TINT,
	createColumns,
	stepColumns,
	buildColumn,
	columnsDone
} from 'Renderer/Effects/ForestLightSim.js';
import _vertexShader from './EffectPrim.vs?raw';
import _fragmentShader from './EffectPrim.fs?raw';

/**
 * @var {WebGLProgram}
 */
let _program = null;

/**
 * @var {WebGLTexture} effect\cloud11.tga
 */
let _texture = null;

/**
 * Bumped by every init and free, so a texture load that finishes after a free
 * (a map change) is dropped.
 */
let _generation = 0;

class ForestLight {
	/**
	 * @param {Array} position where the target stands, in cells (copied: the columns stay)
	 * @param {number} startTick
	 */
	constructor(position, startTick) {
		this.position = [position[0], position[1], position[2]];
		this.startTick = startTick || 0;
		this.columns = createColumns();
		this.ticks = 0;
		this.vertices = new Float32Array(COLUMN_VERTICES * 5);
		this.color = new Float32Array([TINT[0] / 255, TINT[1] / 255, TINT[2] / 255, 1]);
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
		// The client updates before it draws, so the first frame is tick 1.
		const t = Math.min(FOREST_LIGHT_LIFE, Math.floor((tick - this.startTick) / PRIM_TICK_MS) + 1);
		while (this.ticks < t) {
			stepColumns(this.columns);
			this.ticks++;
		}
		if (t >= FOREST_LIGHT_LIFE || columnsDone(this.columns)) {
			this.needCleanUp = true;
			return;
		}
		if (!_texture) {
			return;
		}

		const attribute = _program.attribute;
		const self = this;
		SpriteRenderer.runWithDepth(true, false, false, function () {
			gl.bindBuffer(gl.ARRAY_BUFFER, self.buffer);
			gl.bindTexture(gl.TEXTURE_2D, _texture);
			for (const column of self.columns) {
				if (column.alpha <= 0) {
					continue;
				}
				const end = buildColumn(self.vertices, 0, column, self.position);
				gl.bufferData(gl.ARRAY_BUFFER, self.vertices, gl.DYNAMIC_DRAW);
				gl.vertexAttribPointer(attribute.aPosition, 3, gl.FLOAT, false, 4 * 5, 0);
				gl.vertexAttribPointer(attribute.aTextureCoord, 2, gl.FLOAT, false, 4 * 5, 3 * 4);
				self.color[3] = Math.min(255, column.alpha) / 255;
				gl.uniform4fv(_program.uniform.uColor, self.color);
				gl.drawArrays(gl.TRIANGLES, 0, end / 5);
			}
		});
	}

	static init(gl) {
		_program = WebGL.createShaderProgram(gl, _vertexShader, _fragmentShader);
		const generation = ++_generation;
		Client.loadFile('data/texture/effect/cloud11.tga', buffer => {
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
		gl.uniform3fv(uniform.uFogColor, fog.color);

		gl.activeTexture(gl.TEXTURE0);
		gl.uniform1i(uniform.uDiffuse, 0);

		gl.enableVertexAttribArray(attribute.aPosition);
		gl.enableVertexAttribArray(attribute.aTextureCoord);

		// Added, as the client draws these columns
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
	}

	static afterRender(gl) {
		gl.disableVertexAttribArray(_program.attribute.aPosition);
		gl.disableVertexAttribArray(_program.attribute.aTextureCoord);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	}
}

export default ForestLight;
