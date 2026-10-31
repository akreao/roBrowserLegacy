/**
 * Renderer/Effects/CasterMarks.js
 *
 * What the official client's cast effects 934 (Nightmare Erasion), 2373
 * (Shinkirou) and 502 (Spiral Pierce Max), Shrink's 599, Wind Walk's 389,
 * Enchant Deadly Poison's 493, Soul Destroyer's 361 and Meteor Assault's 409,
 * do to the
 * caster's own sprite (and a few effects to their target's, such as Tarot
 * Card of Fate's 500). It
 * draws nothing itself: it marks the owner each tick, and EntityRender reads
 * the marks.
 *
 * The client sets bits on the caster on each tick of the effect, and the
 * caster's tick clears them after a draw, so a mark shows only on the ticks
 * the effect sets it:
 *
 *  - added body (bit 0x1): the sprite is drawn adding light (BodyGlow's mark);
 *  - glow copy (bit 0x8): one more copy of the sprite, in its own colour,
 *    added, a few pixels larger on every side (see EntityRender);
 *  - split images (bit 0x1000, with the effect's age): four white copies of the
 *    sprite sliding out right, left, down and up, fading out by age 30;
 *  - colour: the caster's colour, which every actor's tick brings back by
 *    8 out of 255 a channel once nothing sets it;
 *  - turn: the owner's facing, turned by a number of degrees from where it
 *    faced when the turning started (Falcon Assault spins its target).
 *    A schedule may ask for the turn only while the owner can be seen
 *    (whileVisible), as Chase Walk's cast spin does.
 *
 * Effect table entry:
 *   { type: 'FUNC', attachedEntity: true, func(Params) {
 *       this.add(new CasterMarks(Params.Init.ownerEntity, Params.Inst.startTick, frames, 934), Params);
 *   } }
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import EntityManager from 'Renderer/EntityManager.js';
import StatusState from 'DB/Status/StatusState.js';
import { PRIM_TICK_MS } from './EffectPrimSim.js';

/** Colour recovery a tick, out of 255, and the split images' fade. */
export const RECOVER_STEP = 8;
export const SPLIT_TICKS = 30;
/** Falcon Assault's turn a tick, in degrees. */
export const TURN_STEP = 30;

/**
 * Chase Walk's cast spin (1195): degrees turned on tick `age`, 12 to age 15,
 * 18 to age 30, 24 to age 40, then 48.
 *
 * @param {number} age
 * @return {number}
 */
export function castSpinStep(age) {
	if (age <= 15) {
		return 12;
	}
	if (age <= 30) {
		return 18;
	}
	if (age <= 40) {
		return 24;
	}
	return 48;
}

/**
 * Chase Walk's cast spin: degrees turned in all by the end of tick `age` (0-359).
 *
 * @param {number} age
 * @return {number}
 */
export function castSpinTurn(age) {
	let degrees = 0;
	for (let a = 0; a <= age; a++) {
		degrees = (degrees + castSpinStep(a)) % 360;
	}
	return degrees;
}

const RED = [255, 0, 0];
const PINK = [255, 89, 182];
const YELLOW = [250, 250, 100];
const WHITE = [255, 255, 255];
const PURPLE = [182, 89, 255];
const BLUE = [0, 0, 255];
const MAGENTA = [255, 0, 255];

/**
 * What each effect sets on the caster on its tick `age` (0 on the first).
 * `color` is the colour it sets (0-255), or null to leave it.
 */
export const SCHEDULES = {
	// Counter Instinct (392): glow copy to tick 29, the caster grey (100) three ticks out of six, else 250.
	392: age => {
		const on = age < 30;
		const c = age % 6 < 3 ? 100 : 250;
		return { add: false, glow: on, split: false, color: on ? [c, c, c] : null };
	},
	// Nightmare Erasion: added body and glow copy two ticks out of four, ages 12 to 33.
	934: age => {
		const on = age >= 10 && age <= 34 && age % 4 < 2;
		return { add: on, glow: on, split: false, color: null };
	},
	// Preserve (496): ticks 10 to 30, added body and colour 250 on even ticks, white on odd ones.
	496: age => {
		const on = age >= 10 && age <= 30;
		const even = age % 2 === 0;
		return { add: on && even, glow: false, split: false, color: on ? (even ? [250, 250, 250] : WHITE) : null };
	},
	// Shinkirou: split images all along, red added body and glow copy to age 30.
	2373: age => {
		const on = age <= 30;
		return { add: on, glow: on, split: true, color: on ? RED : null };
	},
	// Eternal Chaos / Loki's Veil status (EF_ENERVATION7): flickering purple (added) and white, ages 4 to 90.
	864: age => {
		const on = age >= 4 && age <= 90;
		const even = age % 2 === 0;
		return { add: on && even, glow: false, split: false, color: on ? (even ? PURPLE : WHITE) : null };
	},
	// Falcon Assault, on its target: from age 30 the target spins 30 degrees a tick
	// to age 54, and is drawn adding light on ages 30-34, 40-44 and 50.
	387: age => {
		const add = age >= 30 && age <= 50 && (age - 30) % 10 < 5;
		const turn = age >= 30 && age <= 54 ? ((age - 29) * TURN_STEP) % 360 : null;
		return { add, glow: false, split: false, color: null, turn };
	},
	// Marionette Control (396, on the caster and the target): pink added body and a glow copy on
	// every tick, as long as the effect lives (the status). While the Marionette status tint
	// (EntityState) is on it already gives the pink, so 396 leaves the colour to it.
	396: () => ({ add: true, glow: true, split: false, color: PINK, unlessVirtue: StatusState.OPT3.MARIONETTE }),
	// Assumptio (375): a glow copy on every tick, as long as the effect lives (the status).
	375: () => ({ add: false, glow: true, split: false, color: null }),
	// Tarot Card of Fate (500, on the target): glow copy to age 30, flickering blue (added) and white.
	500: age => {
		const on = age <= 30;
		const even = age % 2 === 0;
		return { add: on && even, glow: on, split: false, color: on ? (even ? BLUE : WHITE) : null };
	},
	// EF_CHEMICAL2DASH2 (835, Hundred Spear): glow copy and a pale yellow on ages 20 to 100.
	835: age => {
		const on = age >= 20 && age <= 100;
		return { add: false, glow: on, split: false, color: on ? [255, 255, 150] : null };
	},
	// Spiral Pierce Max: glow copy to age 140, flickering yellow (added) and white.
	502: age => {
		const on = age <= 140;
		const even = age % 2 === 0;
		return { add: on && even, glow: on, split: false, color: on ? (even ? YELLOW : WHITE) : null };
	},
	// Enchant Deadly Poison (493): ticks 0 to 80, added body and magenta on even ticks, white on odd ones.
	493: age => {
		const on = age <= 80;
		const even = age % 2 === 0;
		return { add: on && even, glow: false, split: false, color: on ? (even ? MAGENTA : WHITE) : null };
	},
	// Soul Destroyer (361): ticks 0 to 10 added body and magenta on every tick.
	361: age => {
		const on = age <= 10;
		return { add: on, glow: false, split: false, color: on ? MAGENTA : null };
	},
	// Meteor Assault (409): the same as Soul Destroyer's 361.
	409: age => SCHEDULES[361](age),
	// Wind Walk (389): ticks 5 to 25 added body and light green (220, 250, 220) on every tick.
	389: age => {
		const on = age >= 5 && age <= 25;
		return { add: on, glow: false, split: false, color: on ? [220, 250, 220] : null };
	},
	// Chase Walk's cast aura (1195): from the first tick the caster turns, faster and faster
	// (castSpinStep), only while it can be seen. No other mark.
	1195: age => ({ add: false, glow: false, split: false, color: null, turn: castSpinTurn(age), whileVisible: true }),
	// Shrink: ticks 5 to 25 flickering yellow (added) and white, no glow copy.
	599: age => {
		const on = age >= 5 && age <= 25;
		const even = age % 2 === 0;
		return { add: on && even, glow: false, split: false, color: on ? (even ? YELLOW : WHITE) : null };
	},
	// Close Confine (602, on the target): after tick 20, red on even ticks and white on odd ones.
	602: age => {
		const on = age > 20;
		return { add: false, glow: false, split: false, color: on ? (age % 2 === 0 ? [250, 50, 50] : WHITE) : null };
	}
};

/**
 * The caster's colour on tick `age`: the last colour the effect set, brought
 * back by 8 a tick since.
 *
 * @param {function} schedule
 * @param {number} age
 * @return {number[]|null} 0-255 per channel, or null when never set
 */
export function colorAt(schedule, age) {
	for (let a = age; a >= 0 && age - a <= Math.ceil(255 / RECOVER_STEP); a--) {
		const set = schedule(a).color;
		if (set) {
			return set.map(c => Math.min(255, c + RECOVER_STEP * (age - a)));
		}
	}
	return null;
}

/** roBrowser direction <-> server direction (the same table both ways). */
const DIR_MAP = [4, 3, 2, 1, 0, 7, 6, 5];

/**
 * The facing (roBrowser direction, 0-7) after turning `degrees` from
 * `direction`: one step every whole 45 degrees, the way the server's direction
 * numbers go round, as Tornado Kick's turn does (FacingTurn.js).
 *
 * @param {number} direction
 * @param {number} degrees
 * @return {number}
 */
export function turnedDirection(direction, degrees) {
	const steps = ((Math.floor(degrees / 45) % 8) + 8) % 8;
	return DIR_MAP[(DIR_MAP[direction & 7] + steps) % 8];
}

/**
 * Split images' alpha (out of 255) at age `age`.
 *
 * @param {number} age
 * @return {number}
 */
export function splitAlpha(age) {
	return Math.max(0, (SPLIT_TICKS - age) * 5);
}

/**
 * Recover a colour on an entity by 8 a tick until it is back to normal.
 * Stops as soon as a newer mark sets the entity's colour, so a restarted
 * effect is not lightened by its earlier copy's recovery.
 *
 * @param {Entity} entity
 * @param {number[]} color 0-255 per channel
 */
function recoverColor(entity, color) {
	if (!entity.animations || !entity._flashColor) {
		return;
	}
	const token = {};
	entity._flashColorOwner = token;
	entity.animations.add(tick => {
		if (entity._flashColorOwner !== token) {
			return true;
		}
		const steps = Math.floor(tick / PRIM_TICK_MS);
		let done = true;
		for (let i = 0; i < 3; i++) {
			const c = Math.min(255, color[i] + RECOVER_STEP * steps);
			entity._flashColor[i] = c / 255;
			done = done && c >= 255;
		}
		entity.recalculateBlendingColor();
		return done;
	});
}

export default class CasterMarks {
	static ready = true;
	// Before the entities, so a mark set on a tick shows on that tick's draw.
	static renderBeforeEntities = true;
	static beforeRender() {}
	static afterRender() {}

	/**
	 * @param {Entity} owner the caster
	 * @param {number} startTick
	 * @param {number} frames lifetime in ticks (1/60 s)
	 * @param {number} effectId a key of SCHEDULES
	 */
	constructor(owner, startTick, frames, effectId) {
		this.owner = owner || null;
		this.startTick = startTick || 0;
		this.frames = Math.max(1, Math.floor(frames));
		this.schedule = SCHEDULES[effectId];
		this.add = false;
		this.glow = false;
		this.color = null;
		this.ready = true;
	}

	/**
	 * Put the marks of tick `age` on the owner, or take them all off (null)
	 */
	mark(age) {
		const owner = this.owner;
		const state = age === null ? { add: false, glow: false, split: false } : this.schedule(age);

		if (state.add !== this.add) {
			owner._additiveBody = Math.max(0, (owner._additiveBody || 0) + (state.add ? 1 : -1));
			this.add = state.add;
		}
		if (state.glow !== this.glow) {
			owner._castGlow = Math.max(0, (owner._castGlow || 0) + (state.glow ? 1 : -1));
			this.glow = state.glow;
		}
		if (state.split) {
			owner._splitImageAge = age;
			this._split = true;
		} else if (this._split) {
			owner._splitImageAge = undefined;
			this._split = false;
		}

		const hidden = state.whileVisible && typeof owner.isVisible === 'function' && !owner.isVisible();
		if (state.turn !== null && state.turn !== undefined && !hidden) {
			if (this.turnFrom === undefined) {
				this.turnFrom = owner.direction;
			}
			owner.direction = turnedDirection(this.turnFrom, state.turn);
		}

		// A colour another tint on the owner already gives is not applied twice (they multiply)
		const tinted = state.unlessVirtue && (owner._virtue & state.unlessVirtue) !== 0;
		if (tinted && this.color && owner._flashColor && owner._flashColorOwner === this) {
			// The tint came on after this effect's colour: hand the colour over to it at once
			owner._flashColor[0] = owner._flashColor[1] = owner._flashColor[2] = 1;
			owner.recalculateBlendingColor();
			this.color = null;
		}
		if (age !== null && owner._flashColor && !tinted) {
			const color = colorAt(this.schedule, age);
			if (color || this.color) {
				const c = color || WHITE;
				owner._flashColor[0] = c[0] / 255;
				owner._flashColor[1] = c[1] / 255;
				owner._flashColor[2] = c[2] / 255;
				owner.recalculateBlendingColor();
				owner._flashColorOwner = this;
				this.color = color;
			}
		}
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
			return;
		}
		this.mark(age);
	}

	free() {
		if (this.owner) {
			const unless = this.schedule(0).unlessVirtue;
			if (unless && (this.owner._virtue & unless) !== 0) {
				this.mark(0); // the tint is on: hand the colour over to it at once
			}
			this.mark(null);
			// The caster's own tick keeps bringing its colour back after the effect.
			if (this.color && this.color.some(c => c < 255)) {
				recoverColor(this.owner, this.color);
			}
		}
		this.owner = null;
	}
}
