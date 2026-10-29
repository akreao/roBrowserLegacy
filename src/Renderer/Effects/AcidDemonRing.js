/**
 * Renderer/Effects/AcidDemonRing.js
 *
 * Draws the official client's Acid Demonstration rings (effect 537): four
 * dark violet bands of ring_black.tga rising round the target's cell, on the
 * cast circle's band layout. The motion and geometry are in
 * AcidDemonRingSim.js; this file only draws them. It keeps its own program
 * and texture so freeing it never touches the cast circles (CastCircle.js).
 *
 * Effect table entry:
 *   { type: 'FUNC', attachedEntity: false, func(Params) {
 *       this.add(new AcidDemonRing(Params.Inst.position, Params.Inst.startTick), Params);
 *   } }
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import WebGL from 'Utils/WebGL.js';
import Client from 'Core/Client.js';
import SpriteRenderer from 'Renderer/SpriteRenderer.js';
import {
	RING_TICK_MS,
	RING_FRAMES,
	RING_VERTICES,
	RING_COLOR,
	ringAlpha,
	planTurns,
	buildRings
} from './AcidDemonRingSim.js';
import _vertexShader from './EffectPrim.vs?raw';
import _fragmentShader from './EffectPrim.fs?raw';

const TEXTURE = 'data/texture/effect/ring_black.tga';

/**
 * @var {WebGLProgram}
 */
let _program = null;

/**
 * @var {WebGLTexture} shared by every ring set
 */
let _texture = null;

class AcidDemonRing {
	/**
	 * @param {vec3} position the target's cell (the effect copies it: the rings stay put)
	 * @param {number} startTick
	 */
	constructor(position, startTick) {
		this.position = position;
		this.startTick = startTick || 0;
		this.endTick = this.startTick + RING_FRAMES * RING_TICK_MS;
		this.vertices = new Float32Array(RING_VERTICES * 5);
		this.color = new Float32Array([RING_COLOR[0] / 255, RING_COLOR[1] / 255, RING_COLOR[2] / 255, 1]);
		this.turns = planTurns(RING_FRAMES);
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
		if (!_texture) {
			return;
		}

		// The client counts a tick before drawing, so the first frame is tick 1.
		const t = Math.min(RING_FRAMES, Math.floor((tick - this.startTick) / RING_TICK_MS) + 1);
		const alpha = ringAlpha(t);
		if (alpha <= 0) {
			return;
		}
		const starts = buildRings(this.vertices, t, this.turns, this.position);
		const attribute = _program.attribute;
		const self = this;

		SpriteRenderer.runWithDepth(true, false, false, function () {
			gl.bindBuffer(gl.ARRAY_BUFFER, self.buffer);
			gl.bufferData(gl.ARRAY_BUFFER, self.vertices, gl.DYNAMIC_DRAW);
			gl.vertexAttribPointer(attribute.aPosition, 3, gl.FLOAT, false, 4 * 5, 0);
			gl.vertexAttribPointer(attribute.aTextureCoord, 2, gl.FLOAT, false, 4 * 5, 3 * 4);
			gl.bindTexture(gl.TEXTURE_2D, _texture);
			self.color[3] = alpha / 255;
			gl.uniform4fv(_program.uniform.uColor, self.color);
			gl.drawArrays(gl.TRIANGLES, 0, starts[starts.length - 1]);
		});
	}

	static init(gl) {
		_program = WebGL.createShaderProgram(gl, _vertexShader, _fragmentShader);
		Client.loadFile(TEXTURE, buffer => {
			WebGL.texture(gl, buffer, texture => {
				if (!_program) {
					gl.deleteTexture(texture);
					return;
				}
				_texture = texture;
			});
		});
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

		// Normal alpha blending (the band renderer's colour mode 13)
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	}

	static afterRender(gl) {
		gl.disableVertexAttribArray(_program.attribute.aPosition);
		gl.disableVertexAttribArray(_program.attribute.aTextureCoord);
	}
}

export default AcidDemonRing;
