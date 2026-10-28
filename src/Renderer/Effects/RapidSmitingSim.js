/**
 * Renderer/Effects/RapidSmitingSim.js
 *
 * The official client's Rapid Smiting shields (effect 520, EF_SHIELDBOOMERANG3),
 * without any WebGL, so they can be tested on their own. Spec:
 * effect-port/paladin-skills.md.
 *
 * As the official client (kRO 2025-07-16) plays it, on the target as the damage
 * packet arrives: five shields, launched 3 ticks apart, each from the target's
 * position at launch:
 *
 *  - One billboard of shield_boomerang.bmp, 10 x 10 units, white,
 *    alpha-blended, 8 units up.
 *  - A random whole-degree heading. It starts 37.5 units behind the target
 *    along it and moves 2.5 units a tick, so it passes through the target on
 *    its 15th update and flies on.
 *  - Alpha 25 at launch, +45 a tick for 5 ticks (250), then from its 15th
 *    update -10 a tick.
 *  - It spins -15 degrees a tick.
 *  - Three copies trail it, as Shield Boomerang's shield
 *    (ShieldBoomerangSim.trailAt).
 *
 * Units are the client's: world units (5 to a cell), ticks (60 a second).
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/** Numbers of the shields. */
export const SMITE = {
	count: 5, // shields
	every: 3, // ticks between launches
	speed: 2.5, // units a tick
	lead: 15, // ticks to reach the target
	lift: 8, // height above the target's ground
	alpha: 25, // at launch
	fadeIn: 45, // alpha gained a tick, for the first 5 updates
	fadeInTicks: 5,
	alphaMax: 255,
	fadeFrom: 15, // first update that loses alpha
	fadeOut: 10, // alpha lost a tick
	spin: -15, // degrees a tick
	half: 5, // half width
	life: 499 // effect lifetime, ticks
};

/** Shield image, under data/texture. */
export const SMITE_TEXTURE = 'effect/shield_boomerang.bmp';

const RAD = Math.PI / 180;

/**
 * Every state of one shield, from its launch to its last visible update,
 * relative to the target's position.
 *
 * @param {number} dir heading, whole degrees
 * @return {object} { states, last } in the shape ShieldBoomerangSim.trailAt reads
 */
export function planShield(dir) {
	const dx = Math.cos(dir * RAD) * SMITE.speed;
	const dy = Math.sin(dir * RAD) * SMITE.speed;
	let s = { x: -dx * SMITE.lead, y: -dy * SMITE.lead, up: SMITE.lift, alpha: SMITE.alpha, angle: 0, dir };
	const states = [s];

	for (let n = 1; n < SMITE.life && s.alpha > 0; n++) {
		s = Object.assign({}, s);
		s.angle = (s.angle + SMITE.spin + 360) % 360;
		if (n <= SMITE.fadeInTicks) {
			s.alpha = Math.min(SMITE.alphaMax, s.alpha + SMITE.fadeIn);
		}
		if (n >= SMITE.fadeFrom) {
			s.alpha = Math.max(0, s.alpha - SMITE.fadeOut);
		}
		s.x += dx;
		s.y += dy;
		states.push(s);
	}

	return { states, last: states.length - 1 };
}

/**
 * The shield after k updates, or null outside its life.
 *
 * @param {object} plan from planShield
 * @param {number} k
 * @return {?object} { x, y, up, alpha, angle } in units, alpha 0-255
 */
export function shieldAt(plan, k) {
	const s = k >= 0 ? plan.states[k] : null;
	return s && s.alpha > 0 ? s : null;
}

/**
 * Effect tick on which shield i is launched.
 *
 * @param {number} i
 * @return {number}
 */
export function launchTick(i) {
	return i * SMITE.every;
}

/**
 * A random whole-degree heading, as the client picks one.
 *
 * @param {function} [random] returns a number in [0, 1)
 * @return {number}
 */
export function randomHeading(random = Math.random) {
	return Math.floor(random() * 360) % 360;
}
