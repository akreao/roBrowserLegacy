/**
 * Renderer/Effects/DupleLightSim.js
 *
 * Duple Light's orbs (effect 833 as the official client draws it for the Duple
 * Light status), without any WebGL (kRO 2025-07-16: CRagEffect case 0xbba5d2
 * calls 0xc07700(3); primitive 145, update 0xb80fb0, draw 0xb87250).
 * Spec: effect-port/duple-light.md.
 *
 *  - Two orbs (the status passes the count, 2) circle the actor 7 units out
 *    and 15 units up, half a turn apart, turning 1 degree every 2 ticks and
 *    wandering by up to 0.5 units along each axis.
 *  - Each orb is two camera-facing thunder_center.bmp squares, (68, 42, 255)
 *    and a half-size (155, 155, 255) one, breathing by 5%, fading in by 1 a
 *    tick to 200.
 *  - Round each orb four freeze_a.bmp sparks, started 20 ticks apart: an
 *    upright square through the orb at a random heading, growing 2% a tick
 *    from 3 units; past 6 it fades by 3 a tick and starts again. Colours
 *    (105, 105, 255), (35, 35, 255), (75, 75, 255), (5, 5, 255). All added.
 *
 * Units are the client's: world units (5 to a cell), y down; ticks (60 a second);
 * whole degrees, as the client's sine table.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

const DEG = Math.PI / 180;

/** The status's orb count (message 0xe with 2). */
export const ORBS = 2;

/** Orbit radius and height (up), units. */
export const ORBIT = 7;
export const HEIGHT = 15;

/** Sparks per orb, and the ticks between their starts. */
export const SPARKS = 4;
export const SPARK_DELAY = 20;

/** Core colours (0-255) and spark blues by spark. */
export const CORE_COLORS = [
	[68, 42, 255],
	[155, 155, 255]
];
export const SPARK_GREYS = [105, 35, 75, 5];

const sin = deg => Math.sin(Math.trunc(deg) * DEG);
const cos = deg => Math.cos(Math.trunc(deg) * DEG);

/**
 * @param {number} n
 * @return {number} 0..n-1
 */
export function randomInt(n) {
	return Math.floor(Math.random() * n);
}

/**
 * Build one orb.
 *
 * @param {number} phase degrees round the actor
 * @param {function} [rand]
 * @return {object}
 */
export function createOrb(phase, rand = randomInt) {
	const wander = [];
	for (let i = 0; i < 6; i++) {
		wander.push(rand(360));
	}
	const spin = rand(360);
	const sparks = [];
	for (let i = 0; i < SPARKS; i++) {
		sparks.push({ age: 0 - SPARK_DELAY * i, turn: rand(360), size: 3, heading: rand(360), alpha: 200, shown: 0 });
	}
	return { age: 0, alpha: 0, phase, wander, spin, sparks, center: [0, 0, 0] };
}

/**
 * Build the status's orbs.
 *
 * @param {number} [count]
 * @param {function} [rand]
 * @return {Array<object>}
 */
export function createOrbs(count = ORBS, rand = randomInt) {
	const orbs = [];
	const n = Math.min(5, count);
	for (let i = 0; i < n; i++) {
		orbs.push(createOrb((i * 360) / n, rand));
	}
	return orbs;
}

/**
 * One update tick of an orb, as the client's primitive update.
 *
 * @param {object} orb
 * @param {function} [rand]
 */
export function stepOrb(orb, rand = randomInt) {
	orb.age++;
	if (orb.age < 201) {
		orb.alpha++;
	}

	// Three wandering angles, each chasing a target it picks again on reaching it
	const w = orb.wander;
	for (let k = 0; k < 6; k += 2) {
		let cur = w[k];
		const target = w[k + 1];
		if (target <= cur) {
			cur = Math.max(0, cur - 1);
			w[k] = cur;
			if (cur <= target) {
				w[k + 1] = 359 - (Math.trunc(cur) === 0 ? 0 : rand(Math.trunc(cur)));
			}
		} else {
			cur = Math.min(359, cur + 1);
			w[k] = cur;
			if (target < cur) {
				w[k + 1] = Math.trunc(cur) === 0 ? 0 : rand(Math.trunc(cur));
			}
		}
	}

	if ((orb.age & 1) === 0) {
		orb.phase += 1;
		if (orb.phase >= 360) {
			orb.phase -= 360;
		}
	}
	orb.center[0] = sin(orb.phase) * ORBIT + sin(w[0]) * 0.5;
	orb.center[1] = -HEIGHT + sin(w[4]) * 0.5;
	orb.center[2] = cos(orb.phase) * ORBIT + sin(w[2]) * 0.5;

	orb.spin += 5 + rand(5);
	if (orb.spin >= 360) {
		orb.spin -= 360;
	}

	orb.sparks.forEach((spark, i) => {
		if (i !== 0) {
			spark.age++;
		} else {
			spark.age = orb.age;
		}
		if (spark.age <= 0) {
			return;
		}
		spark.turn = spark.turn + 1 > 359 ? spark.turn - 359 : spark.turn + 1;
		spark.size *= 1.02;
		if (spark.size > 6) {
			spark.alpha -= 3;
			if (spark.alpha < 1) {
				spark.size = 3;
				spark.heading = rand(360);
				spark.alpha = 200;
			}
		}
		spark.shown = Math.max(0, spark.size * sin(spark.turn) * 0.1 + spark.size * 0.9);
	});
}

/**
 * Size (units) of core square 0 or 1: the corners sit this far from the centre.
 *
 * @param {object} orb
 * @param {number} core 0 or 1
 * @return {number}
 */
export function coreSize(orb, core) {
	return sin(orb.spin) * 0.05 + (core === 0 ? 1 : 0.5);
}

/**
 * Corners of spark i: an upright square through the orb's centre, across the
 * spark's heading, `shown` units wide and tall.
 *
 * @param {object} orb
 * @param {object} spark
 * @return {Array<Array<number>>} four corners, client units relative to the actor
 */
export function sparkCorners(orb, spark) {
	const h = spark.shown * 0.5;
	const c = orb.center;
	const a = Math.trunc(spark.heading);
	const ax = cos(a) * h;
	const az = sin(a) * h;
	const top = c[1] + h;
	return [
		[c[0] + ax, top, c[2] + az],
		[c[0] - ax, top, c[2] - az],
		[c[0] - ax, top - spark.shown, c[2] - az],
		[c[0] + ax, top - spark.shown, c[2] + az]
	];
}
