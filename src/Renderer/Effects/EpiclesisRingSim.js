/**
 * Renderer/Effects/EpiclesisRingSim.js
 *
 * Epiclesis's rings (effect 1655), as the official client builds them, without
 * any WebGL (kRO 2025-07-16: CRagEffect case 0xbc1953 calls 0xc0dd90(29);
 * primitive 63, update 0xb59170, drawn by the cast-aura ring render 0xb61550).
 * Spec: effect-port/epiclesis-rings.md.
 *
 *  - Every 100 ticks of the effect (0, 100, 200, ...) a new ring of three
 *    bands of ring_white.tga, lime green (177, 255, 58), added.
 *  - Band b starts at 25 b degrees, 10 b ticks late, lying almost flat (lean
 *    2 + b degrees) on a foot circle that grows 0.5 a tick from 0: rings
 *    spreading out over the ground round the tree.
 *  - Its strips are 6 long, rising with sin(9 age) over the first 10 ticks;
 *    their tips stand 2 units higher.
 *  - Alpha + 24 a tick for 10 ticks (to 120); once the foot passes 7 it fades
 *    by 8 a tick. When it is gone the band starts again from the middle, until
 *    the ring is 120 ticks old.
 *
 * Bands share CastRingSim.js's shape (start, foot, lean, points, alpha), so
 * CastRingSim.buildRing draws them.
 *
 * Units are the client's: world units (5 to a cell), ticks (60 a second), degrees.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { POINTS } from './CastRingSim.js';

const DEG = Math.PI / 180;

/** Ticks between two rings. */
export const RING_EVERY = 100;

/** A ring's bands stop starting again after this many ticks. */
export const RING_ACTIVE = 120;

/** Strip length (the client's 6.001, which also lifts the tips by 2). */
export const STRIP = 6.001;
export const LIFT = 2;

/** Colour (0-255), additive. */
export const TINT = [177, 255, 58];

const ALPHA_IN = 24;
const ALPHA_MAX = 120;
const ALPHA_OUT = 8;
const FOOT_STEP = 0.5;
const FOOT_FADE = 7;

/**
 * @return {object} a ring: { counter, bands }
 */
export function createEpiclesisRing() {
	return {
		counter: 0,
		bands: [0, 1, 2].map(b => ({
			active: true,
			start: 25 * b,
			lean: 2 + b,
			age: 0 - 10 * b,
			alpha: 0,
			foot: 0,
			lift: LIFT,
			points: new Array(POINTS).fill(0)
		}))
	};
}

/**
 * Run a ring one tick, as the client's primitive update.
 *
 * @param {object} ring
 */
export function stepEpiclesisRing(ring) {
	ring.bands.forEach((band, b) => {
		if (!band.active) {
			return;
		}
		band.age++;
		if (b === 0) {
			ring.counter++;
		}
		if (band.age <= 0) {
			return;
		}
		band.foot += FOOT_STEP;
		if (band.foot > FOOT_FADE) {
			band.alpha -= ALPHA_OUT;
			if (band.alpha < 0) {
				band.alpha = 0;
				if (ring.counter > RING_ACTIVE) {
					band.active = false;
				} else {
					band.age = 0;
					band.foot = 0;
				}
			}
		}
		if (band.age < 10) {
			band.alpha = Math.min(ALPHA_MAX, band.alpha + ALPHA_IN);
		}
		const length = band.age <= 10 ? STRIP * Math.sin(9 * band.age * DEG) : STRIP;
		band.points.fill(length);
	});
}

/**
 * @param {object} ring
 * @return {boolean} whether any band still runs
 */
export function ringRunning(ring) {
	return ring.bands.some(band => band.active);
}
