/**
 * Renderer/Effects/StealSparkSim.js
 *
 * The official client's Steal sparks (effect 18, EF_STEAL), without any WebGL,
 * so they can be tested on their own. Spec: effect-port/thief-skills.md.
 *
 * As the official client plays it, on the target when Steal succeeds:
 *
 *  - Tick 0: effect/EF_Steal.wav and 10 sparks (sprite particle7), nothing after.
 *  - A spark gets a heading r(360) and an elevation r(100) - 50 degrees, and
 *    starts 4 + r(4) units from the target's centre that way, raised 10 units.
 *    It follows the target.
 *  - It moves along the heading (level) at (50 + r(50)) / 100 units a tick,
 *    slowing by half that over its 50-tick life; and up at (60 + r(90)) / 100
 *    units a tick, pulled down by twice that over its life, so it peaks at
 *    tick 25 and is back at its start height at the end.
 *  - Scale (100 + r(100)) / 100, shrinking to 0 over its life. Full alpha,
 *    fading from tick 34 to 0 at its end.
 *
 * Units are the client's: world units (5 to a cell), ticks (60 a second).
 * r(k) is a whole number from 0 to k - 1.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/** Numbers of the sparks. */
export const STEAL = {
	count: 10,
	life: 50,
	fadeStart: 34,
	lift: 10
};

const r = (random, k) => Math.floor(random() * k);
const rad = d => (d * Math.PI) / 180;

/**
 * @param {function} [random] returns a number in [0, 1)
 * @return {Array<object>} the sparks, in client units
 */
export function planSparks(random = Math.random) {
	const sparks = [];
	for (let i = 0; i < STEAL.count; i++) {
		const heading = r(random, 360);
		const elevation = r(random, 100) - 50;
		const dist = 4 + r(random, 4);
		sparks.push({
			heading,
			start: {
				x: Math.cos(rad(elevation)) * Math.cos(rad(heading)) * dist,
				y: Math.cos(rad(elevation)) * Math.sin(rad(heading)) * dist,
				up: Math.sin(rad(elevation)) * dist + STEAL.lift
			},
			speed: (50 + r(random, 50)) / 100,
			rise: (60 + r(random, 90)) / 100,
			scale: (100 + r(random, 100)) / 100
		});
	}
	return sparks;
}

/**
 * Alpha (0-254) after k ticks of a life with the given fade start.
 *
 * @param {number} k
 * @param {number} life
 * @param {number} fadeStart
 * @return {number}
 */
export function fadeAlpha(k, life, fadeStart) {
	if (k < fadeStart) {
		return 254;
	}
	return Math.max((254 * (life - 1 - k)) / (life - fadeStart), 0);
}

/**
 * A spark after `age` ticks, or null once its life is over.
 *
 * @param {object} spark from planSparks
 * @param {number} age
 * @return {?object} { x, y, up } in client units from the target, scale, alpha 0-254
 */
export function sparkAt(spark, age) {
	const k = Math.floor(age);
	if (k >= STEAL.life) {
		return null;
	}
	// Level: v += -v0 / 2 / life, then move (never backwards)
	const slow = spark.speed / STEAL.life / 2;
	let dist = 0;
	for (let m = 1; m <= k; m++) {
		dist += Math.max(spark.speed - slow * m, 0);
	}
	// Up: starts at rise, gravity 2 x rise / life
	const g = (2 * spark.rise) / STEAL.life;
	const up = spark.rise * k - (g * k * (k + 1)) / 2;
	const h = rad(spark.heading);
	return {
		x: spark.start.x + Math.cos(h) * dist,
		y: spark.start.y + Math.sin(h) * dist,
		up: spark.start.up + up,
		scale: spark.scale * (1 - k / STEAL.life),
		alpha: fadeAlpha(k, STEAL.life, STEAL.fadeStart)
	};
}
