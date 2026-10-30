/**
 * Renderer/Effects/BlitzStreaks.js
 *
 * Draws the 10 ac_center2.tga streaks of Blitz Beat's hit (effect 115):
 * two crossed quads each, added, all of a frame in a few draw calls
 * (AuraBatch.js). The motion is in BlitzBeatSim.js.
 *
 * Effect table entry:
 *   { type: 'FUNC', attachedEntity: true, func(Params) {
 *       this.add(new BlitzStreaks(Params.Init.ownerEntity, Params.Inst.startTick), Params);
 *   } }
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import AuraBatch, { QUAD_FAN, sharedTexture, freeSharedTextures } from 'Renderer/Effects/AuraBatch.js';
import { BLEND_ADD } from 'Renderer/Effects/AuraBlend.js';
import { PRIM_TICK_MS, UNITS_PER_CELL, facingAngle } from 'Renderer/Effects/EffectPrimSim.js';
import { STREAK, createStreak, stepStreak, streakAlive, streakQuads } from 'Renderer/Effects/BlitzBeatSim.js';

/** Every streak of a frame, drawn together, and the texture they share. */
const _batch = new AuraBatch({ fog: true, mergeAdditive: true });
const _textures = new Map();

const TEXTURE = 'ac_center2.tga';

class BlitzStreaks {
	/**
	 * @param {Entity} owner the target, followed
	 * @param {number} startTick
	 * @param {function} [random] returns a number in [0, 1)
	 */
	constructor(owner, startTick, random = Math.random) {
		this.owner = owner;
		this.position = owner ? owner.position : [0, 0, 0];
		this.startTick = startTick || 0;
		// The client turns them by the target's facing angle when they start.
		this.yaw = facingAngle(owner && owner.direction);
		this.streaks = [];
		for (let i = 0; i < STREAK.count; i++) {
			this.streaks.push(createStreak(random));
		}
		this.ticks = 0;
		this.points = [
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0]
		];
	}

	init(gl) {
		sharedTexture(_textures, gl, TEXTURE, texture => {
			this.texture = texture;
			this.ready = true;
		});
	}

	free() {
		this.ready = false;
	}

	render(gl, tick) {
		if (tick < this.startTick) {
			return;
		}
		// The client updates before it draws, so the first frame is one tick on.
		const ticks = Math.floor((tick - this.startTick) / PRIM_TICK_MS) + 1;
		while (this.ticks < ticks) {
			this.streaks.forEach(stepStreak);
			this.ticks++;
		}
		if (!streakAlive(this.streaks[0])) {
			this.needCleanUp = true;
			return;
		}
		if (!_batch.active || !this.texture) {
			return;
		}

		const pos = this.owner ? this.owner.position : this.position;
		const ox = pos[0] + 0.5;
		const oy = -pos[2];
		const oz = pos[1] + 0.5;
		const points = this.points;
		for (const s of this.streaks) {
			if (s.alpha < 1) {
				continue;
			}
			for (const quad of streakQuads(s, this.yaw)) {
				for (let k = 0; k < 4; k++) {
					points[k][0] = ox + quad[k][0] / UNITS_PER_CELL;
					points[k][1] = oy + quad[k][1] / UNITS_PER_CELL;
					points[k][2] = oz + quad[k][2] / UNITS_PER_CELL;
				}
				_batch.quad(this.texture, BLEND_ADD, points, QUAD_FAN, 1, 1, 1, s.alpha / 255, 0);
			}
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
		// The streaks are drawn only through the batch, whatever auraBatching says.
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

export default BlitzStreaks;
