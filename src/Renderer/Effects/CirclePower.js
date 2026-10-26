/**
 * Renderer/Effects/CirclePower.js
 *
 * Draws the official client's EF_CIRCLEPOWER2..8 effects (861, 865, 867, 871,
 * 873, 875, 877): coloured clouds of freeze_a.bmp rising and fading on an actor
 * when a song's status starts on it. The motion and geometry are in
 * CirclePowerSim.js; this file only draws them.
 *
 * Effect table entry:
 *   { type: 'FUNC', attachedEntity: true, func(Params) {
 *       this.add(new CirclePower(Params.Init.ownerEntity.position, Params.Inst.startTick, 2), Params);
 *   } }
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import WebGL from 'Utils/WebGL.js';
import Client from 'Core/Client.js';
import SpriteRenderer from 'Renderer/SpriteRenderer.js';
import {
	CIRCLE_POWER_TICK_MS,
	CIRCLE_POWER_VERTICES,
	LIFE,
	SET_TICKS,
	TEXTURE,
	createSet,
	stepSet,
	squareVisible,
	squareColor,
	buildSquare
} from './CirclePowerSim.js';
import _vertexShader from './EffectPrim.vs?raw';
import _fragmentShader from './EffectPrim.fs?raw';

/**
 * @var {WebGLProgram}
 */
let _program = null;

/**
 * @var {WebGLTexture} freeze_a.bmp, shared by every effect
 */
let _texture = null;
let _loading = false;

function loadTexture(gl) {
	if (_texture || _loading) {
		return;
	}
	_loading = true;
	Client.loadFile(`data/texture/effect/${TEXTURE}`, buffer => {
		WebGL.texture(gl, buffer, texture => {
			if (!_loading) {
				gl.deleteTexture(texture);
				return;
			}
			_texture = texture;
		});
	});
}

class CirclePower {
	/**
	 * @param {vec3} position actor position (kept by reference, so it follows)
	 * @param {number} startTick
	 * @param {number} variant colour: 2 green, 3 blue, 4 yellow, 5 red, 6 magenta, 7 cyan, 8 white
	 */
	constructor(position, startTick, variant) {
		this.position = position;
		this.startTick = startTick || 0;
		this.endTick = this.startTick + LIFE * CIRCLE_POWER_TICK_MS;
		this.variant = variant;
		this.sets = [];
		this.age = -1;
		this.vertices = new Float32Array(CIRCLE_POWER_VERTICES * 5);
		this.color = new Float32Array(4);
	}

	init(gl) {
		this.buffer = gl.createBuffer();
		loadTexture(gl);
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
	 * Run the client's ticks up to `age`: build the sets on their ticks, then move every set.
	 */
	advance(age) {
		while (this.age < age) {
			this.age++;
			if (SET_TICKS.includes(this.age)) {
				this.sets.push(createSet(Math.random));
			}
			this.sets.forEach(set => stepSet(set, Math.random));
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
		this.advance(Math.min(LIFE - 1, Math.floor((tick - this.startTick) / CIRCLE_POWER_TICK_MS)));
		if (!_texture) {
			return;
		}

		const squares = this.sets.flat().filter(squareVisible);
		if (!squares.length) {
			return;
		}
		let o = 0;
		squares.forEach(square => {
			o = buildSquare(this.vertices, o, square, this.position);
		});

		const attribute = _program.attribute;
		const self = this;
		SpriteRenderer.runWithDepth(false, false, false, function () {
			gl.bindBuffer(gl.ARRAY_BUFFER, self.buffer);
			gl.bufferData(gl.ARRAY_BUFFER, self.vertices, gl.DYNAMIC_DRAW);
			gl.vertexAttribPointer(attribute.aPosition, 3, gl.FLOAT, false, 4 * 5, 0);
			gl.vertexAttribPointer(attribute.aTextureCoord, 2, gl.FLOAT, false, 4 * 5, 3 * 4);
			gl.bindTexture(gl.TEXTURE_2D, _texture);
			squares.forEach((square, i) => {
				const rgb = squareColor(self.variant, square.k);
				self.color[0] = rgb[0] / 255;
				self.color[1] = rgb[1] / 255;
				self.color[2] = rgb[2] / 255;
				self.color[3] = square.alpha / 255;
				gl.uniform4fv(_program.uniform.uColor, self.color);
				gl.drawArrays(gl.TRIANGLES, i * 6, 6);
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
		if (_texture) {
			gl.deleteTexture(_texture);
			_texture = null;
		}
		_loading = false;
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

		// The client adds the squares' light (source alpha, one)
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
	}

	static afterRender(gl) {
		gl.disableVertexAttribArray(_program.attribute.aPosition);
		gl.disableVertexAttribArray(_program.attribute.aTextureCoord);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	}
}

export default CirclePower;
