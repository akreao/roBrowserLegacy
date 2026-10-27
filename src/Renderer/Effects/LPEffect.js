/**
 * Renderer/Effects/LPEffect.js
 *
 * Land Protector ground tile (effect 242), as the official client draws it:
 * aaa copy.bmp as a diamond 2 units above each unit cell, breathing, added
 * to the scene at alpha 100. Numbers in LandProtectorSim.js.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import WebGL from 'Utils/WebGL.js';
import { FlatTexture } from 'Renderer/Effects/Tiles.js';
import { ALPHA, LAND_PROTECTOR_TICK_MS, LIFT_CELLS, cornerDistance } from './LandProtectorSim.js';
import _vertexShader from './LPEffect.vs?raw';
import _fragmentShader from './LPEffect.fs?raw';

class LPEffect extends FlatTexture('data/texture/effect/aaa copy.bmp') {
	static createShaderProgram(gl) {
		return WebGL.createShaderProgram(gl, _vertexShader, _fragmentShader);
	}

	static beforeRender(gl, modelView, projection, fog, tick) {
		super.beforeRender(gl, modelView, projection, fog, tick);
		gl.uniform1f(this._program.uniform.uAlpha, ALPHA);
		gl.uniform1f(this._program.uniform.uLift, LIFT_CELLS);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
	}

	static afterRender(gl) {
		super.afterRender(gl);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	}

	/**
	 * @param {Array} position cell position (x, y, height)
	 * @param {number} startTick
	 * @param {function} [random] returns [0, 1), for the breathing phase
	 */
	constructor(position, startTick, random = Math.random) {
		super(position, startTick);
		this.startTick = startTick || 0;
		this.startAngle = Math.floor(random() * 360);
	}

	render(gl, tick) {
		// The client counts a tick before drawing, so the first frame is tick 1.
		const t = Math.max(0, Math.floor((tick - this.startTick) / LAND_PROTECTOR_TICK_MS)) + 1;
		gl.uniform1f(this.constructor._program.uniform.uSize, cornerDistance(this.startAngle, t));
		super.render(gl, tick);
	}
}
export default LPEffect;
