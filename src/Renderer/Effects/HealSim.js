/**
 * Renderer/Effects/HealSim.js
 *
 * Heal's cylinders (effects 312 EF_HEAL and 320 EF_HEAL3, the official
 * client's 0xbee690 with variant 0 / 1, kRO 2025-07-16), without any WebGL.
 * Spec: effect-port/heal.md.
 *
 * On its first tick the effect builds a primitive 60 (update 0xb57210) of two
 * upright alpha_down.tga bands round the target, drawn by the cast-aura ring
 * render (0xb61550, CastRingSim.buildRing):
 *
 *  - 312: feet 4.6 and 4.8 units out, strips 40 units long, held 60 ticks;
 *    tinted (140, 210, 140) (colour 9), added;
 *  - 320: feet 4.5 + r(100) x 0.005 and 0.2 more, strips 40 + r(20) long, held
 *    30 ticks; white (colour 5), added;
 *  - each band starts at a random angle; strip j is 0.75 L + 0.25 L sin(34 j +
 *    4 age) long (band 1: 3 age), rising with sin(age) over its first 90 ticks;
 *  - alpha + 5 a tick for 15 ticks (to 75), then - 2 a tick once held long enough.
 *
 * The sparks are ReadySparkSim's (SPARK_SETS 312 / 320).
 *
 * Units are the client's: world units (5 to a cell), ticks (60 a second), degrees.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { POINTS } from './CastRingSim.js';

const DEG = Math.PI / 180;

/** Lifetime of 312 and 320, ticks. */
export const HEAL_LIFE = 100;

/** The two kinds: hold (ticks before fading), tint (0-255). */
export const HEAL_KINDS = {
	312: { hold: 60, tint: [140, 210, 140] },
	320: { hold: 30, tint: [255, 255, 255] }
};

/**
 * @param {number} n
 * @return {number} 0..n-1
 */
export function randomInt(n) {
	return Math.floor(Math.random() * n);
}

/**
 * Build the two bands, in the client's order of random draws.
 *
 * @param {number} effectId 312 or 320
 * @param {function} [rand]
 * @return {object} a ring for CastRingSim.buildRing: { kind, bands }
 */
export function createHeal(effectId, rand = randomInt) {
	const kind = HEAL_KINDS[effectId];
	const start0 = rand(360);
	let length = 40;
	let foot = 4.6;
	if (effectId === 320) {
		length = 40 + rand(20);
		foot = 4.5 + rand(100) * 0.005;
	}
	const start1 = rand(360);
	const band = (start, footRadius) => ({
		start,
		foot: footRadius,
		lean: 90,
		length,
		age: 0,
		alpha: 0,
		points: new Array(POINTS).fill(0)
	});
	return {
		kind,
		bands: [band(start0, foot), band(start1, effectId === 320 ? foot + 0.2 : 4.8)]
	};
}

/**
 * One update tick of the bands, as the client's primitive 60 update (mode 0).
 *
 * @param {object} heal from createHeal
 */
export function stepHeal(heal) {
	heal.bands.forEach((band, u) => {
		band.age++;
		if (band.age < heal.kind.hold) {
			if (band.age < 16) {
				band.alpha = Math.min(180, band.alpha + 5);
			}
		} else {
			band.alpha = Math.max(0, band.alpha - 2);
		}
		const speed = u === 0 ? 4 : 3;
		for (let j = 0; j < POINTS; j++) {
			const phase = (34 * j + band.age * speed) % 360;
			let p = band.length * 0.25 * Math.sin(phase * DEG) + band.length * 0.75;
			if (band.age < 91) {
				p *= Math.sin(band.age * DEG);
			}
			band.points[j] = Math.max(0, p);
		}
	});
}
