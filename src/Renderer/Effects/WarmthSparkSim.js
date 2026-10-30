/**
 * Renderer/Effects/WarmthSparkSim.js
 *
 * The Warmth sparks (effect 418, EF_DOUBLEGUMGANG) as the official client
 * (kRO 2025-07-16) draws them while a Warmth status is on, without any WebGL,
 * so they can be tested on their own. Spec: effect-port/star-gladiator-audit.md.
 *
 * On its first tick the effect calls the spawner 0xbe2c50 (2 groups, colour 2),
 * which makes one prim of type 99 (update 0xb56e70, draw 0xb6da00): two groups of four
 * sparks, each a picture from effect/super1-5.bmp drawn three times, added:
 *
 *  - a spark sits 4 units from the actor at a random angle and a random height
 *    (0-9 units at first, 3-10 after), and follows the actor;
 *  - its brightness v rises 25 a tick for 9 ticks, then falls 12 a tick; when
 *    it drops under 12 the spark starts again at 0 with a new angle, height
 *    and picture (a cycle of 27 ticks). The four sparks of a group start at
 *    40, 80, 120 and 160 so they flash in turn;
 *  - its alpha is v (no more than the group's age in ticks, so they fade in),
 *    and only its low 8 bits count, as the client packs it into a colour;
 *  - the three copies are 4, 4.8 and 8 units across, tinted (255, 100, 100),
 *    (120, 0, 0) and (120, 0, 0).
 *
 * Units are the client's, 5 to a cell; ticks are 60 a second. r(k) is a whole
 * number from 0 to k - 1.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { UNITS_PER_CELL } from './EffectPrimSim.js';

/** Numbers of the look. */
export const WARMTH = {
	groups: 2,
	sparks: 4,
	startV: [40, 80, 120, 160],
	rise: 25,
	riseTicks: 10,
	fall: 12,
	radius: 4,
	half: 2,
	textures: 5
};

/** The three copies of a spark: tint (0-255) and size factor. */
export const WARMTH_LAYERS = [
	{ color: [255, 100, 100], scale: 1 },
	{ color: [120, 0, 0], scale: 1.2 },
	{ color: [120, 0, 0], scale: 2 }
];

/** Sprite pixels to a unit. */
export const PX_PER_UNIT = 7;

const r = (random, k) => Math.floor(random() * k);

/**
 * A spark as the spawner leaves it: height r(10), picture r(5), angle r(360),
 * in that order.
 *
 * @param {function} random returns a number in [0, 1)
 * @param {number} index 0-3 in its group
 * @return {object}
 */
function newSpark(random, index) {
	const up = r(random, 10);
	const texture = r(random, WARMTH.textures);
	const angle = r(random, 360);
	return { t: 0, v: WARMTH.startV[index], up, texture, angle };
}

/**
 * One tick of a spark (0xb56e70): count up; under 10 ticks brighten, after
 * that dim, and start again once it is under 12: angle r(360), picture r(5),
 * height 3 + r(8).
 *
 * @param {object} spark
 * @param {function} random
 */
export function stepSpark(spark, random) {
	spark.t += 1;
	if (spark.t >= WARMTH.riseTicks) {
		spark.v -= WARMTH.fall;
		if (spark.v < WARMTH.fall) {
			spark.t = 0;
			spark.v = 0;
			spark.angle = r(random, 360);
			spark.texture = r(random, WARMTH.textures);
			spark.up = 3 + r(random, 8);
		}
	} else {
		spark.v += WARMTH.rise;
	}
}

/**
 * The sparks of one effect. Ask at() for ages that go forward; an earlier age
 * replays from the start.
 */
export class WarmthSparks {
	/**
	 * @param {function} [random] returns a number in [0, 1)
	 */
	constructor(random = Math.random) {
		this.random = random;
		this.reset();
	}

	reset() {
		const random = this.random;
		this.sparks = [];
		for (let g = 0; g < WARMTH.groups; g++) {
			for (let i = 0; i < WARMTH.sparks; i++) {
				this.sparks.push(newSpark(random, i));
			}
		}
		this.ticks = 0;
	}

	/**
	 * Spark `index` (0-7) on tick `age` (0 on the first draw, which comes
	 * after one update), as offsets in cells from the actor (x and y on the
	 * map, z up), picture index (0-4) and alpha (0-255).
	 *
	 * @param {number} index
	 * @param {number} age ticks
	 * @return {{x: number, y: number, z: number, texture: number, alpha: number}}
	 */
	at(index, age) {
		const updates = Math.floor(age) + 1;
		if (updates < this.ticks) {
			this.reset();
		}
		while (this.ticks < updates) {
			this.sparks.forEach(spark => stepSpark(spark, this.random));
			this.ticks++;
		}
		const spark = this.sparks[index];
		const rad = (spark.angle * Math.PI) / 180;
		const v = Math.trunc(spark.v);
		return {
			x: (Math.cos(rad) * WARMTH.radius) / UNITS_PER_CELL,
			y: (Math.sin(rad) * WARMTH.radius) / UNITS_PER_CELL,
			z: spark.up / UNITS_PER_CELL,
			texture: spark.texture,
			alpha: Math.min(v, this.ticks) & 0xff
		};
	}
}
