/**
 * Renderer/Effects/BurstParts.js
 *
 * Draws the official client's primitive 89 bursts (BurstPartsSim.js): thin
 * blades of light from one point over an actor, all bursts of a frame in a few
 * draw calls (AuraBatch.js).
 *
 * Effect table entry:
 *   { type: 'FUNC', attachedEntity: true, duration, func(Params) {
 *       this.add(new BurstParts(3, 12, 'alpha_center.tga', Params.Init.ownerEntity, Params.Inst.startTick), Params);
 *   } }
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import AuraBatch, { QUAD_FAN, sharedTexture, freeSharedTextures } from 'Renderer/Effects/AuraBatch.js';
import { BLEND_ADD, BLEND_ALPHA } from 'Renderer/Effects/AuraBlend.js';
import { PRIM_TICK_MS, UNITS_PER_CELL } from 'Renderer/Effects/EffectPrimSim.js';
import {
	BURST_LOOKS,
	createBurst,
	stepBurst,
	burstAlive,
	bladeCorners,
	bladeWidths
} from 'Renderer/Effects/BurstPartsSim.js';

/** Every burst's blades, drawn together, and the textures they share. */
const _batch = new AuraBatch({ fog: true, mergeAdditive: true });
const _textures = new Map();

/**
 * The client's corners are tip (u 0, v 1), tip (u 1, v 1), then the centre twice;
 * the batch's go (0, 0), (1, 0), (1, 1), (0, 1).
 */
const CORNER_ORDER = [3, 2, 1, 0];

class BurstParts {
	/**
	 * @param {number} variant the helper's third argument
	 * @param {number} sets how many times the effect calls the helper
	 * @param {string} texture under data/texture/effect/
	 * @param {Entity} owner the actor, followed
	 * @param {number} startTick
	 */
	constructor(variant, sets, texture, owner, startTick) {
		this.owner = owner;
		this.position = owner ? owner.position : [0, 0, 0];
		this.startTick = startTick || 0;
		this.textureName = texture;
		this.burst = createBurst(variant, sets);
		this.looks = BURST_LOOKS[variant] || BURST_LOOKS[3];
		this.widths = bladeWidths(variant);
		this.points = [
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0]
		];
	}

	init(gl) {
		// Ready either way: without the texture nothing is drawn, but the burst
		// still runs out and the effect is cleaned up.
		sharedTexture(
			_textures,
			gl,
			this.textureName,
			texture => {
				this.texture = texture;
				this.ready = true;
			},
			() => {
				this.ready = true;
			}
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
		const ticks = Math.floor((tick - this.startTick) / PRIM_TICK_MS) + 1;
		while (this.burst.ticks < ticks) {
			stepBurst(this.burst);
		}
		if (!burstAlive(this.burst)) {
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
		for (const blade of this.burst.blades) {
			if (blade.counter <= 0 || blade.alpha < 1) {
				continue;
			}
			for (let q = 0; q < 2; q++) {
				const look = this.looks[q];
				const corners = bladeCorners(blade, this.widths[q]);
				for (let k = 0; k < 4; k++) {
					const c = corners[CORNER_ORDER[k]];
					points[k][0] = ox + c[0] / UNITS_PER_CELL;
					points[k][1] = oy + c[1] / UNITS_PER_CELL;
					points[k][2] = oz + c[2] / UNITS_PER_CELL;
				}
				_batch.quad(
					this.texture,
					look.blend === 'alpha' ? BLEND_ALPHA : BLEND_ADD,
					points,
					QUAD_FAN,
					look.color[0] / 255,
					look.color[1] / 255,
					look.color[2] / 255,
					(blade.alpha & 0xff) / 255,
					0
				);
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
		// The blades are drawn only through the batch, whatever auraBatching says.
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

export default BurstParts;
