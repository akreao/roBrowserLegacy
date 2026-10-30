/**
 * Renderer/Effects/ArrowVulcanSim.js
 *
 * The numbers of Arrow Vulcan's streaks (effect 393) in the official client
 * (kRO 2025-07-16: effect case 0x189 at 0xbc9216, set-up 0xbfff50, update
 * 0xb46b50 case 0x45, draw 0xb7de80), without any WebGL.
 *
 * On each of its first 9 ticks the effect adds a primitive 69 that holds 4
 * streaks, 36 in all. A streak is a thin five-sided tube of alpha_center.tga
 * from just behind the caster to just past the target, lifted 4 to 10 units
 * off the ground. It waits 30 to 139 ticks, fades in by 8 a tick to 160 over
 * 20 ticks, then out by 2 a tick. Each primitive lives 200 ticks, the
 * effect's own length, which cuts the latest streaks short. Two tubes are
 * drawn per streak, both pink (255, 89, 182): the streak itself, blended,
 * and a glow 0.25 units wider, added.
 *
 * Units: the client's world units (5 to a cell); angles in degrees.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/** The effect: one primitive on each of its first `prims` ticks. */
export const VULCAN = {
	prims: 9,
	perPrim: 4,
	life: 200 // each primitive's life, the effect's length
};

/** One streak (an entry of primitive 69, type 3). */
export const STREAK = {
	delay: 30, // ticks before it shows, plus r(110)
	delayRange: 110,
	jitter: 4, // start spread on x and z: r(100) * 0.08 - 4
	backRange: 100, // start pulled back toward the caster by r(100) * 0.15
	backStep: 0.15,
	extraStep: 0.3, // length past the target: r(100) * 0.3
	radius: 0.02, // + r(11) * 0.008
	radiusStep: 0.008,
	height: 4, // + r(100) * 0.06
	heightStep: 0.06,
	glow: 0.25, // the added tube is this much wider
	sides: 5,
	rise: 8,
	riseTicks: 20,
	fall: 2,
	color: [255, 89, 182]
};

/**
 * A new streak.
 *
 * @param {number} prim the effect tick its primitive was added on (0..8)
 * @param {Array} dir unit direction from caster to target, [x, z]
 * @param {number} distance caster to target, units
 * @param {function} [random] returns a number in [0, 1)
 * @return {object} start and end relative to the caster, in units
 */
export function createStreak(prim, dir, distance, random = Math.random) {
	const r = k => Math.floor(random() * k);
	const delay = STREAK.delay + r(STREAK.delayRange);
	const sx = r(100) * 0.08 - STREAK.jitter;
	const sz = r(100) * 0.08 - STREAK.jitter;
	const back = r(STREAK.backRange) * STREAK.backStep;
	const radius = r(11) * STREAK.radiusStep + STREAK.radius;
	const height = r(100) * STREAK.heightStep + STREAK.height;
	const length = r(100) * STREAK.extraStep + distance;
	const ax = sx - dir[0] * back;
	const az = sz - dir[1] * back;
	return {
		prim,
		delay,
		ax,
		az,
		bx: ax + dir[0] * length,
		bz: az + dir[1] * length,
		radius,
		height
	};
}

/**
 * Alpha of a streak (0..255) on an effect tick.
 *
 * @param {object} streak
 * @param {number} tick effect tick
 * @return {number}
 */
export function streakAlpha(streak, tick) {
	const age = tick - streak.prim;
	if (age < 0 || age >= VULCAN.life) {
		return 0;
	}
	const k = age - streak.delay;
	if (k <= 0) {
		return 0;
	}
	if (k <= STREAK.riseTicks) {
		return k * STREAK.rise;
	}
	return Math.max(0, STREAK.riseTicks * STREAK.rise - (k - STREAK.riseTicks) * STREAK.fall);
}

/** The last effect tick on which anything shows. */
export const LAST_TICK = VULCAN.prims - 1 + VULCAN.life - 1;

/**
 * The ring of a tube end: `sides + 1` points around the line, in units
 * relative to the end, the first and last the same. The ring stands across
 * the streak: sideways and up.
 *
 * @param {Array} dir unit direction, [x, z]
 * @param {number} radius
 * @param {number} height lift; the client's y runs down
 * @return {Array} [x, y, z] points
 */
export function ring(dir, radius, height) {
	// Sideways: the direction turned 90 degrees.
	const px = -dir[1];
	const pz = dir[0];
	const out = [];
	for (let k = 0; k <= STREAK.sides; k++) {
		const a = ((k * 360) / STREAK.sides) * (Math.PI / 180);
		const s = radius * Math.cos(a);
		out.push([s * px, radius * Math.sin(a) - height, s * pz]);
	}
	return out;
}

/**
 * Direction and distance from caster to target, in units.
 *
 * @param {Array} from caster cell [x, y]
 * @param {Array} to target cell [x, y]
 * @param {number} unitsPerCell
 * @return {object} { dir: [x, z], distance }
 */
export function aim(from, to, unitsPerCell) {
	const dx = (to[0] - from[0]) * unitsPerCell;
	const dz = (to[1] - from[1]) * unitsPerCell;
	const distance = Math.hypot(dx, dz);
	if (!distance) {
		return { dir: [1, 0], distance: 0 };
	}
	return { dir: [dx / distance, dz / distance], distance };
}
