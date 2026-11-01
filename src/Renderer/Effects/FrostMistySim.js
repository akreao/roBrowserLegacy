/**
 * Renderer/Effects/FrostMistySim.js
 *
 * Frost Misty's look (effect 726, EF_FROSTMYSTY) as the official client
 * (kRO 2025-07-16) draws it, without any WebGL, so it can be tested on its
 * own. Spec: effect-port/frost-misty.md.
 *
 * - A blue glow: ten camera-facing squares of freeze_a.bmp, 30 units above
 *   the cell, ring j (1-10) reaching 3 (10 - j) units further than the
 *   middle one. The glow starts 24 units from its middle to a corner and
 *   grows 1% a tick. Each ring brightens 13 a tick to its own cap (70, 90 ...
 *   for rings 1-9) for 19 ticks, then rings 1-9 fade 5 a tick; ring 10 stays
 *   at 247 until tick 100, then fades too (and the glow grows 1% more a tick
 *   while it does). Rings 1-9 are tinted (5, 5, 255), ring 10 (55, 55, 255).
 * - Snow: on ticks 0, 8 ... 96 four flakes (effect/E9_snow03.tga, flake k
 *   shows E9_snow02.tga on its updates 35 - 7k and 36 - 7k), each up to 40
 *   units from the cell in any direction, 6-36 units up, rising 0.1-0.29 a
 *   tick and turning 5 degrees a tick, fading in and out like the blue
 *   sparks of ReadySparkSim.js (same primitive), tinted (150, 150, 250).
 *
 * Everything is drawn adding light. Units are the client's, 5 to a cell;
 * ticks are 60 a second. r(k) is a whole number from 0 to k - 1.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { UNITS_PER_CELL } from './EffectPrimSim.js';
import { sparkAlpha, PX_PER_UNIT } from './ReadySparkSim.js';

/** The blue glow. */
export const GLOW = {
	rings: 10,
	height: 30,
	size: 24,
	spacing: 3,
	growth: 1.01,
	fadeIn: 13,
	fadeInEnd: 19,
	fadeOut: 5,
	lastRingHold: 100,
	color: [5, 5, 255],
	lastRingColor: [55, 55, 255]
};

/** The snow. */
export const SNOW = {
	every: 8,
	last: 96,
	perBurst: 4,
	reach: 41,
	height: 6,
	heightRange: 31,
	spin: -5,
	color: [150, 150, 250]
};

const r = (random, k) => Math.floor(random() * k);
const DEG = Math.PI / 180;

/**
 * Ring j's alpha after `n` updates.
 *
 * @param {number} j 1-10
 * @param {number} n
 * @return {number} 0-247
 */
export function ringAlpha(j, n) {
	const peak = Math.min(GLOW.fadeIn * GLOW.fadeInEnd, 50 + 20 * j);
	if (n < GLOW.fadeInEnd + 1) {
		return Math.min(GLOW.fadeIn * Math.max(n, 0), peak);
	}
	const fadeFrom = j === GLOW.rings ? GLOW.lastRingHold : GLOW.fadeInEnd;
	return Math.max(0, peak - GLOW.fadeOut * Math.max(0, n - fadeFrom));
}

/**
 * The glow's middle ring size (middle to corner, units) after `n` updates.
 *
 * @param {number} n
 * @return {number}
 */
export function glowSize(n) {
	const peak = GLOW.fadeIn * GLOW.fadeInEnd;
	const extra = Math.min(Math.max(n - GLOW.lastRingHold, 0), Math.ceil(peak / GLOW.fadeOut) - 1);
	return GLOW.size * Math.pow(GLOW.growth, n + extra);
}

/**
 * Ring j of the glow on tick `age` (0 on its first draw), or null when it
 * is not seen: height in cells, side in sprite pixels, colour (0-255) and
 * alpha (0-255).
 *
 * @param {number} j 1-10
 * @param {number} age ticks
 * @return {{z: number, size: number, color: Array<number>, alpha: number}|null}
 */
export function ringAt(j, age) {
	const n = Math.floor(age) + 1;
	const alpha = ringAlpha(j, n);
	if (alpha <= 0) {
		return null;
	}
	const half = glowSize(n) + GLOW.spacing * (GLOW.rings - j);
	return {
		z: GLOW.height / UNITS_PER_CELL,
		size: half * Math.SQRT2 * PX_PER_UNIT,
		color: j === GLOW.rings ? GLOW.lastRingColor : GLOW.color,
		alpha
	};
}

/** Ticks the glow lasts: until ring 10 is gone. */
export const GLOW_LIFE = (() => {
	let n = 1;
	while (ringAlpha(GLOW.rings, n) > 0 || n <= GLOW.fadeInEnd) {
		n++;
	}
	return n;
})();

/**
 * The flakes, in the order the client makes them: for each, size r(6),
 * reach r(41), direction r(360), height r(31), rise r(20).
 *
 * @param {function} [random] returns a number in [0, 1)
 * @return {Array<object>} spawn tick, slot k, offsets (units), height, rise, size
 */
export function planSnow(random = Math.random) {
	const flakes = [];
	for (let tick = 0; tick <= SNOW.last; tick += SNOW.every) {
		for (let k = 0; k < SNOW.perBurst; k++) {
			const size = 1.5 + r(random, 6) * 0.1;
			const reach = r(random, SNOW.reach);
			const direction = r(random, 360) * DEG;
			const height = SNOW.height + r(random, SNOW.heightRange);
			const rise = r(random, 20) * 0.01 + 0.1;
			flakes.push({
				spawn: tick,
				k,
				x: reach * Math.cos(direction),
				z: reach * Math.sin(direction),
				height,
				rise,
				size
			});
		}
	}
	return flakes;
}

/**
 * Flake `flake` on tick `age` of its own (0 on its first draw), or null once
 * it is gone: offsets in cells from the cell (x and y on the map, z up), side
 * in sprite pixels, turn in degrees, picture (0 E9_snow03, 1 E9_snow02) and
 * alpha (0-255).
 *
 * @param {object} flake from planSnow
 * @param {number} age ticks
 * @return {{x: number, y: number, z: number, size: number, angle: number, texture: number, alpha: number}|null}
 */
export function flakeAt(flake, age) {
	const n = Math.floor(age) + 1;
	const alpha = sparkAlpha(n);
	if (alpha < 0) {
		return null;
	}
	const flash = 36 - 7 * flake.k;
	return {
		x: flake.x / UNITS_PER_CELL,
		y: flake.z / UNITS_PER_CELL,
		z: (flake.height + flake.rise * n) / UNITS_PER_CELL,
		size: flake.size * Math.SQRT2 * PX_PER_UNIT,
		angle: (((SNOW.spin * n) % 360) + 360) % 360,
		texture: n === flash - 1 || n === flash ? 1 : 0,
		alpha
	};
}
