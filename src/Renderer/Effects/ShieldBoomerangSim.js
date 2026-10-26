/**
 * Renderer/Effects/ShieldBoomerangSim.js
 *
 * The official client's Shield Boomerang shield (effect 249, EF_SHIELDBOOMERANG),
 * without any WebGL, so it can be tested on its own. Spec:
 * effect-port/crusader-skills.md.
 *
 * As the official client plays it, on the caster as the damage packet arrives,
 * aimed at the target's position:
 *
 *  - One billboard of shield_boomerang.bmp, 14 x 14 units, white, alpha-blended,
 *    alpha 255. It starts 8 units above the caster and moves 2 units a tick.
 *  - It spins 15 degrees a tick, the other way round from Throw Stone's stone.
 *  - Its heading, in whole degrees, is taken once on its first update, toward
 *    the target.
 *  - Out: while (tick x 2) is at most the distance it flies straight, its height
 *    following the ground from the caster's to the target's.
 *  - Turn: then it keeps flying and turns 5 degrees a tick until its heading is
 *    within 4 degrees of the way back to the caster. The height stays.
 *  - Back: then it flies straight, its height going back, and loses 12 alpha a
 *    tick.
 *  - Three copies trail it, refreshed every third tick: the first takes the
 *    shield as it was before that tick's move with alpha - 150, each next one
 *    the copy ahead's old place with 25 less again.
 *
 * Units are the client's: world units (5 to a cell), ticks (60 a second).
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/** Numbers of the throw. */
export const SHIELD = {
	speed: 2, // units a tick
	lift: 8, // start height above the caster's ground
	spin: -15, // degrees a tick
	turn: 5, // degrees a tick while turning back
	aim: 4, // heading tolerance (degrees) that ends the turn
	fade: 12, // alpha lost a tick on the way back
	half: 7, // half width
	trailEvery: 3, // ticks between trail refreshes
	trail: [150, 25, 25], // alpha each trailing copy loses from the one ahead
	life: 499 // effect lifetime, ticks
};

/** Shield image, under data/texture. */
export const SHIELD_TEXTURE = 'effect/shield_boomerang.bmp';

const RAD = Math.PI / 180;

/**
 * Heading from (dx, dy) as the client takes it: the first whole degree in
 * 0..180 whose cosine is at most the x share, mirrored to 360 minus it when
 * the y share is negative (so straight along +x below the axis gives 360).
 *
 * @param {number} dx
 * @param {number} dy
 * @return {number} degrees, 0..360
 */
export function heading(dx, dy) {
	const len = Math.sqrt(dx * dx + dy * dy);
	for (let a = 0; a <= 180; a++) {
		if (Math.cos(a * RAD) <= dx / len + 1e-9) {
			return dy / len < 0 ? 360 - a : a;
		}
	}
	return 180;
}

/**
 * Every state of the shield, from its launch to its last visible tick.
 *
 * @param {number[]} from start [x, y, ground height] in units (the caster)
 * @param {number[]} to target [x, y, ground height] in units
 * @return {object} { states, last }
 */
export function planBoomerang(from, to) {
	const dx = to[0] - from[0];
	const dy = to[1] - from[1];
	const dist = Math.sqrt(dx * dx + dy * dy);
	const climb = dist > 0 ? (SHIELD.speed / dist) * (to[2] - from[2]) : 0;

	let s = { x: from[0], y: from[1], up: SHIELD.lift, alpha: 255, angle: 0, dir: 0, phase: 0 };
	const states = [s];

	for (let n = 1; n < SHIELD.life && s.alpha > 0; n++) {
		s = Object.assign({}, s);
		s.angle = (s.angle + SHIELD.spin + 360) % 360;
		if (n === 1) {
			s.dir = dist > 0 ? heading(dx, dy) : 180;
		}
		if (s.phase === 0) {
			if (n * SHIELD.speed > dist) {
				s.phase = 1;
			}
			s.up += climb;
		} else if (s.phase === 1) {
			const back = heading(from[0] - s.x, from[1] - s.y);
			if (s.dir < back - SHIELD.aim || s.dir > back + SHIELD.aim) {
				s.dir += SHIELD.turn;
				if (s.dir >= 360) {
					s.dir -= 360;
				}
			} else {
				s.phase = 2;
			}
		} else {
			s.alpha = Math.max(0, s.alpha - SHIELD.fade);
			s.up -= climb;
		}
		s.x += Math.cos(s.dir * RAD) * SHIELD.speed;
		s.y += Math.sin(s.dir * RAD) * SHIELD.speed;
		states.push(s);
	}

	return { from, states, last: states.length - 1 };
}

/**
 * The shield after k updates, or null past its end.
 *
 * @param {object} plan from planBoomerang
 * @param {number} k
 * @return {?object} { x, y, up, alpha, angle } in units, alpha 0-255
 */
export function shieldAt(plan, k) {
	const s = plan.states[k];
	return s && s.alpha > 0 ? s : null;
}

/**
 * Trailing copy i (0 nearest) after k updates, or null when it does not show.
 * On update j (j a multiple of 3) copy 2 takes copy 1, copy 1 copy 0, and
 * copy 0 the shield as it was before update j. So after the refresh on j, copy
 * i is the shield after j - 1 - 3i updates, valid once j - 3i >= 3.
 *
 * @param {object} plan from planBoomerang
 * @param {number} i
 * @param {number} k
 * @return {?object}
 */
export function trailAt(plan, i, k) {
	const j = k - (k % SHIELD.trailEvery);
	if (j - SHIELD.trailEvery * i < SHIELD.trailEvery || k > plan.last) {
		return null;
	}
	const p = plan.states[j - 1 - SHIELD.trailEvery * i];
	let alpha = p.alpha;
	for (let n = 0; n <= i; n++) {
		alpha = Math.max(0, alpha - SHIELD.trail[n]);
	}
	return alpha > 0 ? Object.assign({}, p, { alpha }) : null;
}
