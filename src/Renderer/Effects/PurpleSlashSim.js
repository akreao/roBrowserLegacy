/**
 * Renderer/Effects/PurpleSlashSim.js
 *
 * The official client's purple slashes (primitives 86 and 92, purpleslash.tga),
 * without any WebGL, so they can be tested on their own. Soul Destroyer's 361
 * makes one prim 86 aimed at the target; Meteor Assault's 409 makes eight
 * prim 92, one every 45 degrees. Spec: effect-port/assassin-cross-skills.md.
 *
 * A primitive has four parts. Part i starts at age -28 + i (prim 92: minus one
 * more r(6), the same for its four parts), 10 - r(5) units above the ground,
 * with speed 0.8 and alpha 0. Each tick its age goes up by one, and once it is
 * above 0:
 *  - on its first tick a prim 86 part turns to the target, r(31) - 15 degrees
 *    off (a prim 92 part keeps the heading it was made with);
 *  - on its next 9 ticks alpha rises by 10 and speed grows by 2 %;
 *  - after that alpha falls by 5 and speed grows by 4 % a tick, until alpha
 *    would go below 0 and the part is gone;
 *  - every one of those ticks the part moves `speed` units along its heading.
 *
 * Each part is drawn as a level square, its corners 20 units from its centre
 * at heading + 45, 135, 225 and 315 degrees, the texture's left edge (the arc)
 * leading, tinted (200, 200, 255), alpha blended.
 *
 * Units are the client's: world units (5 to a cell), ticks (60 a second),
 * degrees; headings are measured on the map from +x toward +y.
 * r(k) is a whole number from 0 to k - 1.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/** Numbers of the slashes. */
export const SLASH = {
	parts: 4,
	startAge: -28,
	speed: 0.8,
	riseTicks: 9,
	riseStep: 10,
	riseGrowth: 1.02,
	fadeStep: 5,
	fadeGrowth: 1.04,
	corner: 20,
	height: 10,
	heightRand: 5,
	jitter: 15,
	delayRand: 6,
	color: [200, 200, 255]
};

const r = (random, k) => Math.floor(random() * k);

/**
 * Heading in degrees (0-359, whole) from one map point to another, the client's
 * way: 180 when they are the same point.
 *
 * @param {number} dx
 * @param {number} dy
 * @return {number}
 */
export function headingTo(dx, dy) {
	if (!dx && !dy) {
		return 180;
	}
	const cos = Math.max(-1, Math.min(1, dx / Math.hypot(dx, dy)));
	// The client takes the first whole degree whose cosine is not above dx / length.
	const a = Math.max(0, Math.ceil((Math.acos(cos) * 180) / Math.PI - 1e-9));
	return dy < 0 ? (360 - a) % 360 : a;
}

/**
 * A part's path, tick by tick from its primitive's start.
 *
 * @param {number} start age at the start (negative)
 * @param {number} heading degrees
 * @param {number} up height above the ground, units
 * @return {object} { up, frames: [{ x, y, alpha, heading } | null], end }
 */
export function slashPath(start, heading, up) {
	const frames = [null];
	let age = start;
	let speed = SLASH.speed;
	let alpha = 0;
	let x = 0;
	let y = 0;

	for (;;) {
		const old = age++;
		if (age > 0) {
			if (old >= 1 && old <= SLASH.riseTicks) {
				alpha += SLASH.riseStep;
				speed *= SLASH.riseGrowth;
			} else if (old > SLASH.riseTicks) {
				alpha -= SLASH.fadeStep;
				speed *= SLASH.fadeGrowth;
				if (alpha < 0) {
					break;
				}
			}
			const rad = (heading * Math.PI) / 180;
			x += speed * Math.cos(rad);
			y += speed * Math.sin(rad);
		}
		frames.push(alpha > 0 ? { x, y, alpha, heading } : null);
	}

	return { up, frames, end: frames.length };
}

/**
 * The four parts of a prim 86 (Soul Destroyer), aimed at `heading`.
 *
 * @param {number} heading degrees, toward the target (headingTo)
 * @param {function} [random] returns a number in [0, 1)
 * @return {Array<object>} slashPath results
 */
export function planAimedSlash(heading, random = Math.random) {
	const parts = [];
	for (let i = 0; i < SLASH.parts; i++) {
		const up = SLASH.height - r(random, SLASH.heightRand);
		const turn = r(random, 2 * SLASH.jitter + 1) - SLASH.jitter;
		parts.push(slashPath(SLASH.startAge + i, (((heading + turn) % 360) + 360) % 360, up));
	}
	return parts;
}

/**
 * The four parts of a prim 92 (Meteor Assault) flying out along `heading`.
 *
 * @param {number} heading degrees
 * @param {function} [random] returns a number in [0, 1)
 * @return {Array<object>} slashPath results
 */
export function planOutwardSlash(heading, random = Math.random) {
	const delay = r(random, SLASH.delayRand);
	const parts = [];
	for (let i = 0; i < SLASH.parts; i++) {
		const up = SLASH.height - r(random, SLASH.heightRand);
		parts.push(slashPath(SLASH.startAge - delay + i, heading, up));
	}
	return parts;
}

/**
 * A part on tick `frame` of its primitive, or null when it does not show.
 *
 * @param {object} part from slashPath
 * @param {number} frame
 * @return {?object} { x, y, alpha, heading }
 */
export function slashAt(part, frame) {
	const f = Math.floor(frame);
	return f >= 0 && f < part.frames.length ? part.frames[f] : null;
}
