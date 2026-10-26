/**
 * Renderer/Effects/BodyMotion.js
 *
 * What the official client's Taekwon body effects do to their owner's own
 * sprite. They draw nothing themselves: while one lives it marks its owner on
 * each tick, and EntityRender reads the marks when it draws each layer of the
 * owner (body, head, headgear...), each layer on its own.
 *
 * The client (kRO 2020-12-29) sets a bit and a counter on the actor on each
 * tick of the effect, and the actor clears them after it is drawn:
 *
 *  - press (413 EF_PRESSEDBODY, Heel Drop): the layer's top edge comes down so
 *    the layer keeps a share of its height, its bottom edge staying put;
 *  - spin (414 EF_SPINEDBODY, 466 EF_SPINEDBODY2, Roundhouse): the layer turns
 *    about its centre, one full turn;
 *  - kick (415 EF_KICKEDBODY, Counter Kick): the layer goes up and comes down,
 *    by a share of its own height;
 *  - quake (458 EF_QUAKEBODY2 and 426 EF_QUAKEBODY, Flying Kick): each edge of
 *    the layer moves by a random -5..+5 pixels every frame;
 *  - ready (449 EF_TAE_READY, stances and Tumbling): the layers are drawn twice
 *    more, added, in blue, fading in and out.
 *
 * Effect table entry:
 *   { type: 'FUNC', attachedEntity: true, func(Params) {
 *       this.add(new BodyMotion(Params.Init.ownerEntity, Params.Inst.startTick, 413, 50), Params);
 *   } }
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import EntityManager from 'Renderer/EntityManager.js';
import { PRIM_TICK_MS } from './EffectPrimSim.js';
import { SCHEDULES } from './BodyMotionSim.js';

export default class BodyMotion {
	static ready = true;
	// Before the entities, so a mark set on a tick shows on that tick's draw.
	static renderBeforeEntities = true;
	static beforeRender() {}
	static afterRender() {}

	/**
	 * @param {Entity} owner
	 * @param {number} startTick
	 * @param {number} effectId 413, 414, 415, 426, 449, 458 or 466
	 * @param {number} frames lifetime in ticks (1/60 s)
	 */
	constructor(owner, startTick, effectId, frames) {
		this.owner = owner || null;
		this.startTick = startTick || 0;
		this.schedule = SCHEDULES[effectId] || (() => null);
		this.frames = Math.max(1, Math.floor(frames));
		if (this.owner) {
			if (!this.owner._bodyMotions) {
				this.owner._bodyMotions = new Map();
			}
			this.owner._bodyMotions.set(this, null);
		}
		this.ready = true;
	}

	render(gl, tick) {
		if (!this.owner || EntityManager.get(this.owner.GID) !== this.owner) {
			this.needCleanUp = true;
			return;
		}
		if (tick < this.startTick) {
			return;
		}
		const age = Math.floor((tick - this.startTick) / PRIM_TICK_MS);
		if (age >= this.frames) {
			this.needCleanUp = true;
			this.owner._bodyMotions.set(this, null);
			return;
		}
		this.owner._bodyMotions.set(this, this.schedule(age));
	}

	free() {
		if (this.owner && this.owner._bodyMotions) {
			this.owner._bodyMotions.delete(this);
		}
		this.owner = null;
	}
}
