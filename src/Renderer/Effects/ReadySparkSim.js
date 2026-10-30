/**
 * Renderer/Effects/ReadySparkSim.js
 *
 * The blue sparks of Kaahi / Kaizel / Comfort / Hatred (effect 543, EF_HATED)
 * and of the Star Gladiator's combo-ready status (546, EF_SMA_READY) as the
 * official client (kRO 2025-07-16) draws them, without any WebGL, so they can
 * be tested on their own. Spec: effect-port/star-gladiator-audit.md.
 *
 * Both effects call the spawner 0xbf5c10 on every tick (543 with mode 1, 546
 * with mode 2). On every 4th tick of a window (543: ticks 0-80, 546: ticks
 * 40-120) it makes one prim of type 59 (update in 0xb46b50, draw 0xb6c630)
 * holding four sparks:
 *
 *  - a spark starts r(11) - 5 units off the actor on x and on z, 6 units up,
 *    and stays where it was left; it rises (10 + r(20)) / 100 units a tick;
 *  - its picture (effect/pok1.tga) is a square turned 5 degrees a tick, its
 *    corners 2 + r(10) / 10 units from its middle;
 *  - its alpha rises 15 a tick from tick 2 to 10 (to 135), then falls 3 a
 *    tick; it is gone when that goes under 0 (tick 56);
 *  - spark k (0-3) shows effect/pok3.tga instead on ticks 35 - 7k and 36 - 7k;
 *  - it is drawn added, tinted (150, 150, 250).
 *
 * Units are the client's, 5 to a cell; ticks are 60 a second. r(k) is a whole
 * number from 0 to k - 1.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { UNITS_PER_CELL } from './EffectPrimSim.js';

/** Numbers of the sparks. */
export const SPARK = {
	every: 4,
	perPrim: 4,
	scatter: 11,
	height: 6,
	spin: -5,
	fadeIn: 15,
	fadeInEnd: 10,
	fadeOut: 3,
	color: [150, 150, 250]
};

/** Ticks of the effect on which sparks are left, by effect id. */
export const SPARK_WINDOWS = {
	543: { from: 0, to: 80 },
	546: { from: 40, to: 120 }
};

/** Sprite pixels to a unit. */
export const PX_PER_UNIT = 7;

const r = (random, k) => Math.floor(random() * k);

/**
 * The sparks one effect leaves, in the order the client makes them: for each
 * spark, size r(10), x r(11), z r(11), rise r(20).
 *
 * @param {number} effectId 543 or 546
 * @param {function} [random] returns a number in [0, 1)
 * @return {Array<object>} spawn tick, slot k, offsets (units), rise, size
 */
export function planSparks(effectId, random = Math.random) {
	const window = SPARK_WINDOWS[effectId];
	const sparks = [];
	for (let tick = window.from; tick <= window.to; tick += SPARK.every) {
		for (let k = 0; k < SPARK.perPrim; k++) {
			const size = 2 + r(random, 10) * 0.1;
			const x = r(random, SPARK.scatter) - 5;
			const z = r(random, SPARK.scatter) - 5;
			const rise = r(random, 20) * 0.01 + 0.1;
			sparks.push({ spawn: tick, k, x, z, rise, size });
		}
	}
	return sparks;
}

/**
 * The spark's alpha after `n` updates.
 *
 * @param {number} n
 * @return {number} 0-135, below 0 when it is gone
 */
export function sparkAlpha(n) {
	if (n <= 1) {
		return 0;
	}
	if (n <= SPARK.fadeInEnd) {
		return SPARK.fadeIn * (n - 1);
	}
	return SPARK.fadeIn * (SPARK.fadeInEnd - 1) - SPARK.fadeOut * (n - SPARK.fadeInEnd);
}

/** Ticks a spark lives: until its alpha goes under 0. */
export const SPARK_LIFE = (() => {
	let n = 1;
	while (sparkAlpha(n) >= 0) {
		n++;
	}
	return n;
})();

/**
 * Spark `spark` on tick `age` of its own (0 on its first draw, after one
 * update), or null once it is gone, as offsets in cells from where it was
 * left (x and y on the map, z up), its side in sprite pixels, turn in
 * degrees, picture (0 pok1, 1 pok3) and alpha (0-255).
 *
 * @param {object} spark from planSparks
 * @param {number} age ticks
 * @return {{x: number, y: number, z: number, size: number, angle: number, texture: number, alpha: number}|null}
 */
export function sparkAt(spark, age) {
	const n = Math.floor(age) + 1;
	const alpha = sparkAlpha(n);
	if (alpha < 0) {
		return null;
	}
	const flash = 36 - 7 * spark.k;
	return {
		x: spark.x / UNITS_PER_CELL,
		y: spark.z / UNITS_PER_CELL,
		z: (SPARK.height + spark.rise * n) / UNITS_PER_CELL,
		size: spark.size * Math.SQRT2 * PX_PER_UNIT,
		angle: (((SPARK.spin * n) % 360) + 360) % 360,
		texture: n === flash - 1 || n === flash ? 1 : 0,
		alpha
	};
}
