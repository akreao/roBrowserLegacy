/**
 * Renderer/Effects/CirclePowerSim.js
 *
 * Motion and geometry of the official client's EF_CIRCLEPOWER2..8 effects
 * (861, 865, 867, 871, 873, 875, 877), without any WebGL, so it can be tested
 * on its own. The client plays them on an actor when a Bard or Dancer song's
 * status starts on it (and for some Minstrel and Wanderer songs).
 *
 * As the official client builds them (primitive 132):
 *
 *  - The effect lives 400 ticks and follows the actor. It builds two sets of
 *    four squares, on tick 0 and on tick 10, all in freeze_a.bmp.
 *  - Square k of a set starts 20 k ticks late. It starts 10 units across, at a
 *    random phase and a random turn, at alpha 100 (of 255).
 *  - Each tick it grows by 2% and its phase moves on a degree. Its side is
 *    size x (0.9 + 0.1 sin(phase)): it breathes a little as it grows.
 *  - It stands upright through the actor's centre line, turned to its own
 *    turn, its middle 10 units above the ground.
 *  - Once it is more than 20 units across it fades 3 alpha a tick. When it is
 *    gone it starts over (10 units, a new turn, alpha 100), unless it is older
 *    than 300 ticks: then it stops.
 *  - The variant gives the colour; the four squares of a set take four shades
 *    of it. The client draws them adding light, over everything (no depth test).
 *
 * Units are the client's: world units (5 to a cell), ticks (60 a second), degrees.
 */

import { PRIM_TICK_MS, UNITS_PER_CELL } from './EffectPrimSim.js';

export { PRIM_TICK_MS as CIRCLE_POWER_TICK_MS };

const DEG = Math.PI / 180;

/** The effect's life, in ticks. */
export const LIFE = 400;

/** The ticks the two sets of squares are built on. */
export const SET_TICKS = [0, 10];

/** Squares in a set, and how much later each starts than the one before. */
export const SQUARES = 4;
export const STAGGER = 20;

/** A square's start size and alpha, its growth a tick, and when it fades. */
export const START_SIZE = 10;
export const START_ALPHA = 100;
export const GROWTH = 1.02;
export const FADE_SIZE = 20;
export const FADE_STEP = 3;

/** A square older than this does not start over. */
export const LAST_RESTART = 300;

/** Height of a square's middle above the ground. */
export const MIDDLE = 10;

/** The shade each square of a set takes. */
export const SHADES = [105, 5, 55, 155];

/** The texture. */
export const TEXTURE = 'freeze_a.bmp';

/** Squares drawn at most: two sets of four, two triangles each. */
export const CIRCLE_POWER_VERTICES = SET_TICKS.length * SQUARES * 6;

/**
 * Square k's colour (0-255) for a variant (2 green, 3 blue, 4 yellow, 5 red,
 * 6 magenta, 7 cyan, 8 white).
 *
 * @param {number} variant
 * @param {number} k square in its set, 0-3
 * @return {number[]}
 */
export function squareColor(variant, k) {
	const v = SHADES[k];
	switch (variant) {
		case 2:
			return [v, 255, v];
		case 3:
			return [v, v, 255];
		case 4:
			return [255, 255, v];
		case 5:
			return [255, v, v];
		case 6:
			return [255, v, 255];
		case 7:
			return [v, 255, 255];
		case 8:
			return k === 3 ? [255, 255, 255] : [v, v, v];
		default:
			return [v, v, 255];
	}
}

/**
 * A new set of squares.
 *
 * @param {function} random returns [0, 1)
 * @return {Array<object>}
 */
export function createSet(random) {
	const set = [];
	for (let k = 0; k < SQUARES; k++) {
		set.push({
			k,
			active: true,
			age: 0 - STAGGER * k,
			phase: Math.floor(random() * 360),
			size: START_SIZE,
			turn: Math.floor(random() * 360),
			alpha: START_ALPHA,
			side: 0
		});
	}
	return set;
}

/**
 * Move a set of squares on by one tick.
 *
 * @param {Array<object>} set
 * @param {function} random returns [0, 1)
 */
export function stepSet(set, random) {
	for (const square of set) {
		if (!square.active) {
			continue;
		}
		square.age++;
		if (square.age <= 0) {
			continue;
		}
		square.phase = (square.phase + 1) % 360;
		square.size = Math.fround(square.size * GROWTH);
		if (square.size > FADE_SIZE) {
			square.alpha -= FADE_STEP;
			if (square.alpha < 1) {
				if (square.age > LAST_RESTART) {
					square.alpha = 0;
					square.active = false;
				} else {
					square.size = START_SIZE;
					square.turn = Math.floor(random() * 360);
					square.alpha = START_ALPHA;
				}
			}
		}
		square.side = Math.max(0, square.size * (0.1 * Math.sin(square.phase * DEG) + 0.9));
	}
}

/**
 * Whether a square shows.
 *
 * @param {object} square
 * @return {boolean}
 */
export function squareVisible(square) {
	return square.active && square.alpha > 0 && square.age > 0 && square.side > 0;
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

/**
 * Fill `out` from float `o` with one square's two triangles.
 *
 * @param {Float32Array} out
 * @param {number} o
 * @param {object} square
 * @param {Array} center actor position, in cells
 * @return {number} next float
 */
export function buildSquare(out, o, square, center) {
	const half = square.side / 2;
	const cos = Math.cos(square.turn * DEG) * half;
	const sin = Math.sin(square.turn * DEG) * half;
	const bottom = MIDDLE - half;
	const top = MIDDLE + half;
	o = vertex(out, o, center, cos, sin, bottom, 0, 1);
	o = vertex(out, o, center, -cos, -sin, bottom, 1, 1);
	o = vertex(out, o, center, -cos, -sin, top, 1, 0);
	o = vertex(out, o, center, -cos, -sin, top, 1, 0);
	o = vertex(out, o, center, cos, sin, top, 0, 0);
	o = vertex(out, o, center, cos, sin, bottom, 0, 1);
	return o;
}
