/**
 * Renderer/Effects/ArrowVulcan.js
 *
 * Draws Arrow Vulcan's streaks (effect 393): 36 thin pink tubes of
 * alpha_center.tga from the caster to past the target, each a blended tube
 * and an added glow around it, through AuraBatch.js. The numbers are in
 * ArrowVulcanSim.js.
 *
 * Effect table entry:
 *   { type: 'FUNC', func(Params) {
 *       this.add(new ArrowVulcan(Params.Inst.position, Params.Inst.otherPosition, Params.Inst.startTick), Params);
 *   } }
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import AuraBatch, { sharedTexture, freeSharedTextures } from 'Renderer/Effects/AuraBatch.js';
import { BLEND_ADD, BLEND_ALPHA } from 'Renderer/Effects/AuraBlend.js';
import { PRIM_TICK_MS, UNITS_PER_CELL } from 'Renderer/Effects/EffectPrimSim.js';
import { VULCAN, STREAK, LAST_TICK, createStreak, streakAlpha, ring, aim } from 'Renderer/Effects/ArrowVulcanSim.js';

const _batch = new AuraBatch({ fog: true, mergeAdditive: true });
const _textures = new Map();

const TEXTURE = 'alpha_center.tga';

const R = STREAK.color[0] / 255;
const G = STREAK.color[1] / 255;
const B = STREAK.color[2] / 255;

/**
 * A tube is `sides` quads, each from one side of the start ring to the same
 * side of the end ring: u runs around, v from the start (1) to the end (0).
 */
const SIDES = STREAK.sides;
const TUBE_VERTICES = SIDES * 4;
const TUBE_INDICES = new Uint16Array(SIDES * 6);
for (let k = 0; k < SIDES; k++) {
	const v = k * 4;
	TUBE_INDICES.set([v, v + 1, v + 2, v, v + 2, v + 3], k * 6);
}

/**
 * The vertices of a tube, relative to its start, in cells and GL axes.
 *
 * @param {object} streak from createStreak
 * @param {Array} dir unit direction, [x, z]
 * @param {number} radius units
 * @param {Float32Array} [out]
 * @return {Float32Array} x, y, z, u, v each
 */
export function tubeVertices(streak, dir, radius, out = new Float32Array(TUBE_VERTICES * 5)) {
	const points = ring(dir, radius, streak.height);
	const ex = (streak.bx - streak.ax) / UNITS_PER_CELL;
	const ez = (streak.bz - streak.az) / UNITS_PER_CELL;
	let o = 0;
	const put = (p, x, z, u, v) => {
		out[o++] = p[0] / UNITS_PER_CELL + x;
		out[o++] = p[1] / UNITS_PER_CELL;
		out[o++] = p[2] / UNITS_PER_CELL + z;
		out[o++] = u;
		out[o++] = v;
	};
	for (let k = 1; k <= SIDES; k++) {
		put(points[k - 1], 0, 0, 0, 1);
		put(points[k], 0, 0, 1, 1);
		put(points[k], ex, ez, 1, 0);
		put(points[k - 1], ex, ez, 0, 0);
	}
	return out;
}

class ArrowVulcan {
	/**
	 * @param {Array} position the caster's cell [x, y, z]
	 * @param {Array} target the target's cell [x, y, z]
	 * @param {number} startTick
	 * @param {function} [random] returns a number in [0, 1)
	 */
	constructor(position, target, startTick, random = Math.random) {
		this.position = position ? [position[0], position[1], position[2]] : [0, 0, 0];
		this.startTick = startTick || 0;
		const { dir, distance } = aim(this.position, target || this.position, UNITS_PER_CELL);
		this.dir = dir;
		this.streaks = [];
		for (let p = 0; p < VULCAN.prims; p++) {
			for (let i = 0; i < VULCAN.perPrim; i++) {
				const streak = createStreak(p, dir, distance, random);
				streak.inner = tubeVertices(streak, dir, streak.radius);
				streak.outer = tubeVertices(streak, dir, streak.radius + STREAK.glow);
				this.streaks.push(streak);
			}
		}
	}

	init(gl) {
		// Ready whether it loads or not: it still runs out and is cleaned up.
		const done = () => {
			this.ready = true;
		};
		sharedTexture(
			_textures,
			gl,
			TEXTURE,
			texture => {
				this.texture = texture;
				done();
			},
			done
		);
	}

	free() {
		this.ready = false;
	}

	render(gl, tick) {
		if (tick < this.startTick) {
			return;
		}
		// The client updates before it draws, so the first frame is one tick on.
		const t = Math.floor((tick - this.startTick) / PRIM_TICK_MS) + 1;
		if (t > LAST_TICK) {
			this.needCleanUp = true;
			return;
		}
		if (!_batch.active || !this.texture) {
			return;
		}

		const pos = this.position;
		const ox = pos[0] + 0.5;
		const oy = -pos[2];
		const oz = pos[1] + 0.5;
		for (const streak of this.streaks) {
			const alpha = streakAlpha(streak, t);
			if (alpha <= 0) {
				continue;
			}
			const x = ox + streak.ax / UNITS_PER_CELL;
			const z = oz + streak.az / UNITS_PER_CELL;
			const a = alpha / 255;
			_batch.mesh(this.texture, BLEND_ALPHA, streak.inner, TUBE_VERTICES, TUBE_INDICES, x, oy, z, R, G, B, a, 0);
			_batch.mesh(this.texture, BLEND_ADD, streak.outer, TUBE_VERTICES, TUBE_INDICES, x, oy, z, R, G, B, a, 0);
		}
	}

	static init() {
		this.ready = true;
		this.renderBeforeEntities = false;
	}

	static free(gl) {
		_batch.free(gl);
		freeSharedTextures(_textures, gl);
		this.ready = false;
	}

	static beforeRender(gl, modelView, projection, fog) {
		_batch.begin(gl, modelView, projection, fog);
		// Drawn only through the batch, whatever auraBatching says.
		if (!_batch.active && typeof gl.createVertexArray === 'function') {
			_batch.active = true;
			_batch.modelView.set(modelView);
			_batch.projection.set(projection);
			_batch.fog.use = !!(fog.use && fog.exist);
			_batch.fog.near = fog.near;
			_batch.fog.far = fog.far;
			_batch.fog.color.set(fog.color);
		}
	}

	static afterRender(gl) {
		_batch.flush(gl);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	}
}

export default ArrowVulcan;
