/**
 * Renderer/Effects/SonicWaveSim.js
 *
 * Motion and geometry of the official client's Sonic Wave rings (effect 1678,
 * RK_SONICWAVE), without any WebGL, so it can be tested on its own. Spec:
 * effect-port/sonic-wave.md.
 *
 * On effect ages 0, 20 and 40 the client builds two ring sets aimed from the
 * caster at the target, one with son_wave_01.tga (variant 1) and one with
 * son_wave_00.tga (variant 0). A set holds four rings, ring i starting 8 i
 * ticks after the set:
 *
 *  - a band of 21 points on a 315 degree arc that starts at heading + 195 (the
 *    gap faces the caster), standing on a foot circle of radius 6 - 0.1 i
 *    (variant 0) or 9 - 0.1 i (variant 1) and leaning out 70 - 5 i degrees from
 *    the ground;
 *  - point j's height is 30 (variant 0) or 20 (variant 1) times a taper
 *    (0.4 to 0.9 over the five points at each end), times sin(6 age) while
 *    age <= 15;
 *  - alpha + 25 a tick to age 9 (cap 250, 125 in the low-effects mode), then
 *    - 10 a tick; below 0 the ring starts over with the lean 20 lower and the
 *    foot 0.4 smaller, and stops once the lean is 40 or less;
 *  - the ring drifts 0.75 units a tick along the heading, across restarts.
 *
 * Drawn white with normal alpha blending.
 *
 * Units are the client's: world units (5 to a cell), ticks (60 a second), degrees.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { PRIM_TICK_MS, UNITS_PER_CELL } from './EffectPrimSim.js';

export { PRIM_TICK_MS as WAVE_TICK_MS };

const DEG = Math.PI / 180;

/** Points along a band. */
const POINTS = 21;

/** Degrees between two points (315 / 20, whole). */
const STEP = 15;

/** The arc, degrees. */
const ARC = 315;

/** Arc start, degrees from the heading. */
export const ARC_START = 195;

/** Ages of the effect (ticks) at which a pair of ring sets is built. */
export const SET_AGES = [0, 20, 40];

/** Ticks between two rings of a set. */
export const RING_DELAY = 8;

/** Drift along the heading, units a tick. */
export const DRIFT = 0.75;

/** The two textures, by variant. */
export const WAVE_TEXTURES = [
	'data/texture/effect/new_sonicwave/new_sonicwave/son_wave_00.tga',
	'data/texture/effect/new_sonicwave/new_sonicwave/son_wave_01.tga'
];

/** Band width (point height before the taper) and foot radius, by variant. */
const WIDTH = [30, 20];
const FOOT = [6, 9];

/** Height share of the points at each end of the band. */
const TAPER = [0.4, 0.5, 0.6, 0.7, 0.8, 0.9];

/** Number of vertices of one ring (triangles, 5 floats each). */
export const RING_VERTICES = Math.floor(ARC / STEP) * 6;

/**
 * Height share of point j (0 to 20).
 *
 * @param {number} j
 * @return {number}
 */
export function taper(j) {
	const k = Math.min(j, POINTS - 1 - j);
	return k < TAPER.length ? TAPER[k] : 1;
}

/**
 * Run ring `i` of a set of `variant` tick by tick, as the client's update does.
 *
 * @param {number} i ring 0 to 3
 * @param {number} variant 0 (son_wave_00) or 1 (son_wave_01)
 * @param {boolean} [lowEffects] the client's low-effects mode (/mineffect)
 * @return {Array<object|null>} state after the update of set tick t (1 on the first),
 *   index t; null while the ring has not started or has stopped
 */
export function simulateRing(i, variant, lowEffects = false) {
	const states = [null];
	const cap = lowEffects ? 125 : 250;
	let age = -RING_DELAY * i;
	let alpha = 0;
	let lean = 70 - 5 * i;
	let foot = FOOT[variant] - 0.1 * i;
	let drift = 0;
	let active = true;

	for (let t = 1; active; t++) {
		age++;
		if (age <= 0) {
			states.push(null);
			continue;
		}
		drift += DRIFT;
		if (age < 10) {
			alpha = Math.min(cap, alpha + 25);
		} else {
			alpha -= 10;
			if (alpha < 0) {
				alpha = 0;
				age = 0;
				lean -= 20;
				foot -= 0.4;
				if (lean <= 40) {
					active = false;
				}
			}
		}
		states.push(active ? { age, alpha, lean, foot, drift } : null);
	}
	return states;
}

/**
 * Height of point j of a ring at `age`, in world units.
 *
 * @param {number} variant
 * @param {number} j 0 to 20
 * @param {number} age
 * @return {number}
 */
export function pointHeight(variant, j, age) {
	let h = WIDTH[variant] * taper(j);
	if (age <= 15) {
		h *= Math.sin(6 * age * DEG);
	}
	return Math.max(0, h);
}

/**
 * Write one vertex in roBrowser's GL space, from client units about `center`.
 */
function vertex(out, o, center, x, y, up, u, v) {
	out[o + 0] = center[0] + 0.5 + x / UNITS_PER_CELL;
	out[o + 1] = -center[2] - up / UNITS_PER_CELL;
	out[o + 2] = center[1] + 0.5 + y / UNITS_PER_CELL;
	out[o + 3] = u;
	out[o + 4] = v;
	return o + 5;
}

/**
 * Fill `out` with one ring's triangles.
 *
 * @param {Float32Array} out RING_VERTICES * 5 floats from `o`
 * @param {number} o first float to write
 * @param {object} state from simulateRing
 * @param {number} variant
 * @param {number} heading degrees, client convention (atan2(dz, dx))
 * @param {Array} center the set's position, in cells
 * @return {number} float index after the ring
 */
export function buildRing(out, o, state, variant, heading, center) {
	const lean = Math.cos(state.lean * DEG);
	const rise = Math.sin(state.lean * DEG);
	const dx = state.drift * Math.cos(heading * DEG);
	const dy = state.drift * Math.sin(heading * DEG);
	const start = heading + ARC_START;

	let prev = null;
	for (let n = 0, a = 0; a <= ARC; n++, a += STEP) {
		const j = Math.min(n, POINTS - 1);
		const angle = (start + a) * DEG;
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);
		const h = pointHeight(variant, j, state.age);
		const point = {
			fx: state.foot * cos + dx,
			fy: state.foot * sin + dy,
			tx: (state.foot + h * lean) * cos + dx,
			ty: (state.foot + h * lean) * sin + dy,
			up: h * rise
		};
		if (prev) {
			const u0 = (j - 1) / 21;
			const u1 = j / 21;
			o = vertex(out, o, center, prev.fx, prev.fy, 0, u0, 1);
			o = vertex(out, o, center, point.fx, point.fy, 0, u1, 1);
			o = vertex(out, o, center, point.tx, point.ty, point.up, u1, 0);

			o = vertex(out, o, center, prev.tx, prev.ty, prev.up, u0, 0);
			o = vertex(out, o, center, point.tx, point.ty, point.up, u1, 0);
			o = vertex(out, o, center, prev.fx, prev.fy, 0, u0, 1);
		}
		prev = point;
	}
	return o;
}

/**
 * The client's heading from one cell position to another, degrees 0..360
 * (the map's y taken as the client's z).
 *
 * @param {Array} from
 * @param {Array} to
 * @return {number}
 */
export function headingTo(from, to) {
	const angle = Math.atan2(to[1] - from[1], to[0] - from[0]) / DEG;
	return (angle + 360) % 360;
}
