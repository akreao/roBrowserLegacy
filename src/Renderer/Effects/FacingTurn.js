/**
 * Renderer/Effects/FacingTurn.js
 *
 * Tornado Kick's turn (435 EF_STORMKICK): the official client (kRO
 * 2020-12-29) turns the caster's facing by 30 degrees on each of the effect's
 * first 48 ticks, four full turns that end where they started. It draws
 * nothing itself.
 *
 * The client turns the actor's facing angle, from which it picks the
 * direction it draws; here the turn moves the entity's direction one step
 * every 45 degrees, the way the server's direction numbers go round.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import EntityManager from 'Renderer/EntityManager.js';
import { PRIM_TICK_MS } from './EffectPrimSim.js';

/** Degrees a tick, and for how many ticks. */
export const TURN_STEP = 30;
export const TURN_TICKS = 48;

/** roBrowser direction <-> server direction (the same table both ways). */
const DIR_MAP = [4, 3, 2, 1, 0, 7, 6, 5];

/**
 * The entity direction on tick `age` of the turn, from direction `start`.
 *
 * @param {number} start roBrowser direction (0-7) when the turn began
 * @param {number} age ticks since the turn began
 * @return {number} roBrowser direction (0-7)
 */
export function turnedDirection(start, age) {
	const ticks = Math.min(Math.max(0, age) + 1, TURN_TICKS);
	const steps = Math.floor(((ticks * TURN_STEP) % 360) / 45);
	return DIR_MAP[(DIR_MAP[start & 7] + steps) % 8];
}

export default class FacingTurn {
	static ready = true;
	static renderBeforeEntities = true;
	static beforeRender() {}
	static afterRender() {}

	/**
	 * @param {Entity} owner
	 * @param {number} startTick
	 */
	constructor(owner, startTick) {
		this.owner = owner || null;
		this.startTick = startTick || 0;
		this.start = owner ? owner.direction : 0;
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
		this.owner.direction = turnedDirection(this.start, age);
		if (age >= TURN_TICKS - 1) {
			this.needCleanUp = true;
		}
	}

	free() {
		this.owner = null;
	}
}
