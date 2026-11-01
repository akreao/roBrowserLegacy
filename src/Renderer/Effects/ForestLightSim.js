/**
 * Renderer/Effects/ForestLightSim.js
 *
 * The official client's "forest light" columns (EF_FORESTLIGHT5, effect 719:
 * Renovatio), without any WebGL (kRO 2025-07-16: CRagEffect case 0xbbc805 calls
 * 0xbe9490(cloud11.tga, 12) on its first tick; primitive 66, update 0xb49818,
 * draw 0xb708c0). Spec: effect-port/forest-light.md.
 *
 *  - Four five-sided columns of cloud11.tga from the target up into the sky:
 *    column c runs from the target to (c + 1) x 300 units up, leaning
 *    (c + 1) x 70 units back along both map axes.
 *  - Radius 1, 1.5, 2 and 1; columns 1 and 3 swell by 0.5 sin(age / 2).
 *  - Alpha starts at 30, + 1 a tick to tick 40, holds, - 1 a tick after tick
 *    140. Column 3 starts 180 ticks old, so it only fades out.
 *  - Pale green (230, 255, 230), added. They stay where the target stood.
 *
 * Units are the client's: world units (5 to a cell), y down; ticks (60 a second); degrees.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { UNITS_PER_CELL } from 'Renderer/Effects/EffectPrimSim.js';

const DEG = Math.PI / 180;

/** Ticks the effect lives (lifetime map). */
export const FOREST_LIGHT_LIFE = 999;

/** Corners round a column (the last one closes it), 72 degrees apart. */
export const CORNERS = 6;

/** Vertices of one column: five quads of two triangles. */
export const COLUMN_VERTICES = (CORNERS - 1) * 6;

/** Colour (0-255), additive. */
export const TINT = [230, 255, 230];

/** Variant 12 (Renovatio): per-column climb and lean, start alpha, radii. */
const RISE = 300;
const LEAN = 70;
const ALPHA_START = 30;
const RADIUS = [1, 1.5, 2, 1];

/**
 * @return {Array<object>} the four columns
 */
export function createColumns() {
	return RADIUS.map((radius, c) => ({
		age: c === 3 ? 180 : 0,
		alpha: ALPHA_START,
		base: radius,
		radius,
		start: 25 * c,
		top: [-LEAN * (c + 1), -RISE * (c + 1), -LEAN * (c + 1)]
	}));
}

/**
 * One update tick of every column, as the client's primitive update.
 *
 * @param {Array<object>} columns
 */
export function stepColumns(columns) {
	columns.forEach((column, c) => {
		column.age++;
		if (column.age <= 40) {
			column.alpha++;
		} else if (column.age > 140) {
			column.alpha--;
		}
		if (column.alpha < 0) {
			column.alpha = 0;
		}
		if (c === 1 || c === 3) {
			const half = Math.trunc((column.age % 720) / 2);
			column.radius = column.base + 0.5 * Math.sin(half * DEG);
		}
	});
}

/**
 * Write one vertex in roBrowser's GL space from client units about `center`.
 */
function vertex(out, o, center, x, y, z, u, v) {
	out[o + 0] = center[0] + 0.5 + x / UNITS_PER_CELL;
	out[o + 1] = -center[2] + y / UNITS_PER_CELL;
	out[o + 2] = center[1] + 0.5 + z / UNITS_PER_CELL;
	out[o + 3] = u;
	out[o + 4] = v;
	return o + 5;
}

/**
 * Fill `out` with one column's quads: corner i on the ground (the target's
 * feet) and the same corner at the top.
 *
 * @param {Float32Array} out COLUMN_VERTICES * 5 floats from `o`
 * @param {number} o
 * @param {object} column
 * @param {Array} center where the target stood, in cells
 * @return {number} float index after the column
 */
export function buildColumn(out, o, column, center) {
	let prev = null;
	for (let i = 0; i < CORNERS; i++) {
		const angle = ((column.start + 72 * i) % 360) * DEG;
		const x = column.radius * Math.cos(angle);
		const z = column.radius * Math.sin(angle);
		const low = [x, 0, z];
		const high = [column.top[0] + x, column.top[1], column.top[2] + z];
		if (prev) {
			o = vertex(out, o, center, prev.low[0], prev.low[1], prev.low[2], 0, 0);
			o = vertex(out, o, center, low[0], low[1], low[2], 1, 0);
			o = vertex(out, o, center, high[0], high[1], high[2], 1, 1);
			o = vertex(out, o, center, high[0], high[1], high[2], 1, 1);
			o = vertex(out, o, center, prev.high[0], prev.high[1], prev.high[2], 0, 1);
			o = vertex(out, o, center, prev.low[0], prev.low[1], prev.low[2], 0, 0);
		}
		prev = { low, high };
	}
	return o;
}

/**
 * @param {Array<object>} columns
 * @return {boolean} whether every column has faded out for good
 */
export function columnsDone(columns) {
	return columns.every(column => column.age > 140 && column.alpha <= 0);
}
