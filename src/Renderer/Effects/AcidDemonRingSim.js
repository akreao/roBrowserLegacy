/**
 * Renderer/Effects/AcidDemonRingSim.js
 *
 * Motion and geometry of the official client's Acid Demonstration rings
 * (effect 537, EF_ACIDDEMON), without any WebGL, so it can be tested on its
 * own. The client builds them as one primitive (type 118) on the cast circle's
 * band layout (CastCircleSim.js), with ring_black.tga:
 *
 *  - Four bands, each a ring of strips standing on a small foot circle round
 *    the target's cell and leaning out; 21 points a band, a point's height is
 *    the band's amplitude times sin(9 j) for point j.
 *  - Every tick the three inner bands turn 4 to 6 degrees and the upright one
 *    2 or 3 (picked at random each tick). The amplitudes grow by 0.5% a tick
 *    (the upright band by 2.5%) while the heights rise with sin(tick).
 *  - All four share one alpha: +5 a tick to 80, held to tick 39, then 15 less
 *    a tick, gone from tick 45. The effect lives 200 ticks; nothing draws after.
 *  - Texture tinted (255, 50, 255) with normal alpha blending: a dark violet
 *    on the dark ring texture.
 *
 * Units are the client's: world units (5 to a cell), ticks (60 a second), degrees.
 * See effect-port/creator-skills.md.
 */

import { PRIM_TICK_MS, UNITS_PER_CELL } from './EffectPrimSim.js';

export { PRIM_TICK_MS as RING_TICK_MS };

const DEG = Math.PI / 180;

/** Points along a band. */
const POINTS = 21;

/** Heights stop rising after this tick. */
const GROW = 90;

/** The last tick with anything to draw: the alpha is 0 from tick 45. */
export const RING_FRAMES = 44;

/** Effect 537's lifetime, ticks. */
export const LIFETIME = 200;

/** Texture colour, 0-255 (the band renderer's colour mode 13). */
export const RING_COLOR = [255, 50, 255];

/**
 * The bands: foot circle radius, lean from the ground, arc, start angle,
 * starting height amplitude, amplitude growth a tick, and the range of the
 * random turn a tick (inclusive).
 */
export const RING_BANDS = [
	{ foot: 2.4, tilt: 70, arc: 315, turn: 0, height: 25, grow: 1.005, step: [4, 6] },
	{ foot: 2.7, tilt: 57, arc: 315, turn: 90, height: 22, grow: 1.005, step: [4, 6] },
	{ foot: 3.0, tilt: 45, arc: 315, turn: 180, height: 19, grow: 1.005, step: [4, 6] },
	{ foot: 2.2, tilt: 90, arc: 360, turn: 0, height: 30, grow: 1.025, step: [2, 3] }
];

/** Strips drawn per band: one between each step of the arc, plus the 315 degree bands' extra step. */
function stripsOf(band) {
	return Math.floor(band.arc / Math.floor(band.arc / (POINTS - 1)));
}

/** Number of vertices of the ring set (triangles, 5 floats each). */
export const RING_VERTICES = RING_BANDS.reduce((sum, band) => sum + stripsOf(band) * 6, 0);

/**
 * The bands' alpha (out of 255) on tick `t` (1 on the first); the same for all four.
 *
 * @param {number} t
 * @return {number}
 */
export function ringAlpha(t) {
	if (t < 1) {
		return 0;
	}
	if (t < 40) {
		return Math.min(80, 5 * Math.min(t, 19));
	}
	return Math.max(0, 80 - 15 * (t - 39));
}

/**
 * Each band's angle (degrees) on ticks 1 to `frames`, turning by a random
 * whole step each tick.
 *
 * @param {number} [frames]
 * @param {function} [random] returns [0, 1)
 * @return {number[][]} turns[b][t], t from 0 (the start angle) to frames
 */
export function planTurns(frames = RING_FRAMES, random = Math.random) {
	return RING_BANDS.map(band => {
		const turns = [band.turn];
		let angle = band.turn;
		for (let t = 1; t <= frames; t++) {
			const [lo, hi] = band.step;
			angle = (angle + lo + Math.floor(random() * (hi - lo + 1))) % 360;
			turns.push(angle);
		}
		return turns;
	});
}

/**
 * Height of point `j` of band `b` on tick `t`, in world units.
 *
 * @param {number} b
 * @param {number} j 0 to 20
 * @param {number} t tick, 1 on the first
 * @return {number}
 */
export function ringHeight(b, j, t) {
	const band = RING_BANDS[b];
	const age = Math.min(t, GROW);
	const amplitude = band.height * Math.pow(band.grow, age);
	return Math.max(0, amplitude * Math.sin(9 * j * DEG) * Math.sin(age * DEG));
}

/**
 * Write one vertex in roBrowser's GL space, from client units about `center`.
 */
function vertex(out, i, center, x, y, up, u, v) {
	out[i + 0] = center[0] + 0.5 + x / UNITS_PER_CELL;
	out[i + 1] = -center[2] - up / UNITS_PER_CELL;
	out[i + 2] = center[1] + 0.5 + y / UNITS_PER_CELL;
	out[i + 3] = u;
	out[i + 4] = v;
	return i + 5;
}

function buildBand(out, o, b, t, turn, center) {
	const band = RING_BANDS[b];
	const step = Math.floor(band.arc / (POINTS - 1));
	const lean = Math.cos(band.tilt * DEG);
	const rise = Math.sin(band.tilt * DEG);

	let prev = null;
	for (let i = 0, a = 0; a <= band.arc; i++, a += step) {
		const j = Math.min(i, POINTS - 1);
		const angle = (band.arc === 360 && j === POINTS - 1 ? turn : turn + a) * DEG;
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);
		const h = ringHeight(b, j, t);
		const point = {
			fx: band.foot * cos,
			fy: band.foot * sin,
			tx: (band.foot + h * lean) * cos,
			ty: (band.foot + h * lean) * sin,
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
 * Fill `out` with every band's triangles on tick `t`, and say where each band starts.
 *
 * @param {Float32Array} out RING_VERTICES * 5 floats
 * @param {number} t tick, 1 on the first
 * @param {number[][]} turns from planTurns
 * @param {Array} center position, in cells
 * @return {number[]} first vertex of each band, then the total
 */
export function buildRings(out, t, turns, center) {
	const starts = [];
	let o = 0;
	for (let b = 0; b < RING_BANDS.length; b++) {
		starts.push(o / 5);
		const angles = turns[b];
		o = buildBand(out, o, b, t, angles[Math.min(t, angles.length - 1)], center);
	}
	starts.push(o / 5);
	return starts;
}
