/**
 * Renderer/Effects/StreakLines.js
 *
 * Draws the official client's streak lines (effect primitive type 56):
 * Quill Spear's effect 2442, eight sets of four soft streaks racing from
 * behind the caster toward the target, on both sides of the line. The
 * motion and geometry are in StreakLinesSim.js; this file only draws them.
 *
 * Effect table entry:
 *   { type: 'FUNC', func(Params) {
 *       this.add(new StreakLines(casterPosition, targetPosition, Params.Inst.startTick,
 *           { black: 'druid/at_quill_spear/quill_spear_line/line_black.tga', color: '...' }), Params);
 *   } }
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import WebGL from 'Utils/WebGL.js';
import Client from 'Core/Client.js';
import SpriteRenderer from 'Renderer/SpriteRenderer.js';
import {
	STREAK_TICK_MS,
	STREAK_FRAMES,
	STREAK_VERTICES,
	tintColor,
	createVariantSets,
	streakAngle,
	createStreakSets,
	advanceStreaks,
	buildStreak
} from './StreakLinesSim.js';
import _vertexShader from './EffectPrim.vs?raw';
import _fragmentShader from './EffectPrim.fs?raw';

/**
 * @var {WebGLProgram}
 */
let _program = null;

/**
 * Textures by file name, shared by every effect: a crowd casting loads them once.
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

class StreakLines {
	/**
	 * @param {vec3} position caster position (copied: the sets stay where they start)
	 * @param {vec3} target target position, sets the direction once
	 * @param {number} startTick
	 * @param {object} textures texture files under data/texture/effect/ by key ({ black, color } for
	 *   Quill Spear, { line3, line3y } for the builder's variants)
	 * @param {number[]} [variants] the 2025 builder's variants (0xbdf6e0), one set of 4 streaks each;
	 *   Quill Spear's 8 sets without
	 */
	constructor(position, target, startTick, textures, variants) {
		this.position = [position[0], position[1], position[2]];
		this.angle = streakAngle(target[0] - position[0], target[1] - position[1]);
		this.startTick = startTick || 0;
		this.endTick = this.startTick + STREAK_FRAMES * STREAK_TICK_MS;
		this.textures = textures;
		this.streaks = variants ? createVariantSets(variants) : createStreakSets();
		this.vertices = new Float32Array(this.streaks.length * STREAK_VERTICES * 5);
		this.color = new Float32Array([1, 1, 1, 1]);
	}

	init(gl) {
		this.buffer = gl.createBuffer();
		Object.values(this.textures).forEach(name => loadTexture(gl, name));
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

		// The client counts a tick before drawing, so the first frame is tick 1.
		advanceStreaks(this.streaks, Math.floor((tick - this.startTick) / STREAK_TICK_MS) + 1);

		const streaks = this.streaks;
		let o = 0;
		for (const streak of streaks) {
			o = buildStreak(this.vertices, o, streak, this.angle, this.position);
		}

		const attribute = _program.attribute;
		const self = this;

		SpriteRenderer.runWithDepth(true, false, false, function () {
			gl.bindBuffer(gl.ARRAY_BUFFER, self.buffer);
			gl.bufferData(gl.ARRAY_BUFFER, self.vertices, gl.DYNAMIC_DRAW);
			gl.vertexAttribPointer(attribute.aPosition, 3, gl.FLOAT, false, 4 * 5, 0);
			gl.vertexAttribPointer(attribute.aTextureCoord, 2, gl.FLOAT, false, 4 * 5, 3 * 4);

			let bound = null;
			for (let i = 0; i < streaks.length; i++) {
				const streak = streaks[i];
				const texture = _textures.get(self.textures[streak.texture]);
				if (streak.alpha <= 0 || !texture) {
					continue;
				}
				if (texture !== bound) {
					gl.bindTexture(gl.TEXTURE_2D, texture);
					bound = texture;
				}
				const [r, g, b] = tintColor(streak.tint);
				self.color[0] = r / 255;
				self.color[1] = g / 255;
				self.color[2] = b / 255;
				self.color[3] = streak.alpha / 255;
				gl.uniform4fv(_program.uniform.uColor, self.color);
				gl.drawArrays(gl.TRIANGLES, i * STREAK_VERTICES, STREAK_VERTICES);
			}
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

		// Normal alpha blending, as the client draws these streaks
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	}

	static afterRender(gl) {
		gl.disableVertexAttribArray(_program.attribute.aPosition);
		gl.disableVertexAttribArray(_program.attribute.aTextureCoord);
	}
}

export default StreakLines;
