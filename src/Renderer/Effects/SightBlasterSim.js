/**
 * Renderer/Effects/SightBlasterSim.js
 *
 * The Sight Blaster look (effect 601, EF_SIGHT2) as the official client
 * (kRO 2025-07-16) draws it while the status is on, without any WebGL, so it
 * can be tested on its own. Spec: effect-port/wizard-audit.md.
 *
 * On every even tick of its age the effect leaves one Sight sprite
 * (이팩트\Sight.spr) 15 units from the caster and 20 units above the ground,
 * at an angle of -5 degrees times its age, so the sprites draw a ring that
 * turns once every 72 ticks. Each sprite follows the caster, stays put
 * otherwise, and lives 20 ticks: its scale starts at 2.5 and loses 0.1 a tick,
 * its alpha starts at 50 (of 255) and loses 3 a tick, and its animation moves
 * on a frame every 3 ticks. Ten are alive at once.
 *
 * Units are the client's, 5 to a cell; ticks are 60 a second.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { UNITS_PER_CELL } from './EffectPrimSim.js';

/** Numbers of the look. */
export const SIGHT = {
	every: 2,
	degPerTick: -5,
	radius: 15,
	height: 20,
	life: 20,
	scale: 2.5,
	scaleStep: -0.1,
	alpha: 50,
	alphaStep: -3,
	frameTicks: 3
};

/** Ticks for the ring to come round to the same angle: 360 / 5. */
export const SIGHT_PERIOD = 72;

/** Sprites in one turn of the ring, one per slot. */
export const SIGHT_SLOTS = SIGHT_PERIOD / SIGHT.every;

/**
 * The degree the client's sin/cos tables read for a whole number of degrees.
 * Past +-360 it takes the remainder; a negative angle reads the table one
 * degree on (index 361 + d), so -5 reads 356.
 *
 * @param {number} deg whole degrees
 * @return {number} degrees actually used
 */
export function tableDegree(deg) {
	let d = deg;
	if (d > 360 || d < -360) {
		d -= 360 * Math.trunc(d / 360);
	}
	return d < 0 ? d + 361 : d;
}

/**
 * Where the sprite spawned on tick `spawn` sits, in cells from the caster.
 * x = sin * 15 and the client's z = cos * -15, with the map's y taken as the
 * client's z.
 *
 * @param {number} spawn tick it was left on
 * @return {{x: number, y: number, z: number}}
 */
export function sightSpot(spawn) {
	const rad = (tableDegree(Math.trunc(spawn * SIGHT.degPerTick)) * Math.PI) / 180;
	return {
		x: (Math.sin(rad) * SIGHT.radius) / UNITS_PER_CELL,
		y: (-Math.cos(rad) * SIGHT.radius) / UNITS_PER_CELL,
		z: SIGHT.height / UNITS_PER_CELL
	};
}

/**
 * The sprite of slot `slot` on tick `age` of the effect, or null when that
 * slot has none alive. Slot k leaves a sprite on ticks 2k, 2k + 72, 2k + 144...
 * Scale and alpha are those after the sprite's first update.
 *
 * @param {number} slot 0 to SIGHT_SLOTS - 1
 * @param {number} age effect ticks
 * @return {{x: number, y: number, z: number, scale: number, alpha: number, frame: number}|null}
 */
export function sightSpriteAt(slot, age) {
	const tick = Math.floor(age);
	const first = slot * SIGHT.every;
	if (tick < first) {
		return null;
	}
	const spawn = first + SIGHT_PERIOD * Math.floor((tick - first) / SIGHT_PERIOD);
	const t = tick - spawn;
	if (t >= SIGHT.life) {
		return null;
	}
	return {
		...sightSpot(spawn),
		scale: SIGHT.scale + SIGHT.scaleStep * (t + 1),
		alpha: Math.max(0, SIGHT.alpha + SIGHT.alphaStep * (t + 1)),
		frame: Math.floor(t / SIGHT.frameTicks)
	};
}
