/**
 * Renderer/Effects/SandGrainSim.js
 *
 * The official client's Sand Attack sand (effect 310, EF_SPRINKLESAND), without
 * any WebGL, so it can be tested on its own. Spec: effect-port/thief-skills.md.
 *
 * As the official client plays it, on the target as the damage packet arrives:
 *
 *  - 80 grains, all made on the first tick, fixed in the world (they do not
 *    follow the target). Texture effect/thunder_center.bmp tinted (250, 250, 150),
 *    additive. No sound.
 *  - A grain starts on the ground at (r(9) - 4, r(9) - 4) units from the target.
 *    Its counter starts at r(10) - 10 and goes up one a tick; it is live while
 *    the counter is above 0.
 *  - Counter 1: it picks a heading r(360). Every live tick: it rises
 *    r(40) / 100 + 0.2 units, drifts r(10) / 100 units along the heading and
 *    turns -5 degrees.
 *  - Alpha: +15 a tick on counters 2-10 (to 135), then -3 a tick from counter 11;
 *    at 0 (counter 55) the grain is gone.
 *  - Half width r(16) x 0.03 + 0.1 units.
 *
 * Units are the client's: world units (5 to a cell), ticks (60 a second).
 * r(k) is a whole number from 0 to k - 1.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/** Grains in one throw: 20 primitives of 4 grains. */
export const SAND_GRAINS = 80;

/** Last tick any grain shows (start delay at most 11, then 54 live ticks). */
export const SAND_LAST_TICK = 65;

/** Grain colour (0..1) and texture. */
export const SAND_COLOR = [250 / 255, 250 / 255, 150 / 255];
export const SAND_TEXTURE = 'effect/thunder_center.bmp';

const r = (random, k) => Math.floor(random() * k);

/**
 * @param {function} [random] returns a number in [0, 1)
 * @return {Array<object>} the grains, in client units
 */
export function planGrains(random = Math.random) {
	const grains = [];
	for (let i = 0; i < SAND_GRAINS; i++) {
		grains.push({
			x: r(random, 9) - 4,
			y: r(random, 9) - 4,
			counter: r(random, 10) - 10,
			heading: r(random, 360),
			rise: r(random, 40) / 100 + 0.2,
			drift: r(random, 10) / 100,
			half: r(random, 16) * 0.03 + 0.1
		});
	}
	return grains;
}

/**
 * Alpha (0-255) after the grain's live tick k.
 *
 * @param {number} k counter value
 * @return {number}
 */
export function grainAlpha(k) {
	if (k <= 1) {
		return 0;
	}
	if (k <= 10) {
		return 15 * (k - 1);
	}
	return Math.max(135 - 3 * (k - 10), 0);
}

/**
 * Where a grain is after `age` ticks, or null when it does not show.
 *
 * @param {object} grain from planGrains
 * @param {number} age ticks since the effect started
 * @return {?object} { x, y, up } in client units from the target, alpha 0-255, angle (degrees), half
 */
export function grainAt(grain, age) {
	const k = grain.counter + Math.floor(age);
	if (k <= 0) {
		return null;
	}
	const alpha = grainAlpha(k);
	if (alpha <= 0) {
		return null;
	}
	const a = (grain.heading * Math.PI) / 180;
	return {
		x: grain.x + Math.cos(a) * grain.drift * k,
		y: grain.y + Math.sin(a) * grain.drift * k,
		up: grain.rise * k,
		alpha,
		angle: (((-5 * k) % 360) + 360) % 360,
		half: grain.half
	};
}
