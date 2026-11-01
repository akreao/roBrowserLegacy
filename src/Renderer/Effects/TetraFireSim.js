/**
 * Renderer/Effects/TetraFireSim.js
 *
 * The look of effect 804 (EF_TETRA), which the official client (kRO
 * 2025-07-16, case 0xbbb218) plays on the Tetra Vortex Fire caster, aimed at
 * the target, as the damage arrives. No WebGL, so it can be tested on its
 * own. Spec: effect-port/warlock-skills.md (804 EF_TETRA look).
 *
 * - The pillar: on ticks 0, 25, 50 and 75 a camera-facing picture over the
 *   target, R = 30 units wide and 1.732 R tall, its middle 35 units up. It
 *   plays effect/tv-1.bmp ... tv-8.bmp, a picture every 3 ticks, then holds
 *   tv-8 while its alpha (200) falls 15 every 3 ticks until it is gone.
 * - The red lines: 28 thin upright lines (7 x 4) of effect/ring_red.tga, each
 *   within 40 units of the target in a random direction. Line k starts at a
 *   random age 0-99 and shows from age 100: it rises to 120 units over 15
 *   ticks (120 sin(6 (age - 100)) degrees), holds, then from age 125 it
 *   shrinks 5 units and fades 15 alpha (from 150) a tick. It is 0.3-0.6 units
 *   across, with a band 1.5 x as wide.
 *
 * Units are the client's, 5 to a cell; ticks are 60 a second. r(k) is a
 * whole number from 0 to k - 1.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { UNITS_PER_CELL } from './EffectPrimSim.js';

/** Sprite pixels to a unit. */
const PX_PER_UNIT = 7;

/** The pillar. */
export const PILLAR = {
	ticks: [0, 25, 50, 75],
	radius: 30,
	height: 35,
	pictures: 8,
	every: 3,
	alpha: 200,
	fade: 15
};

/** The red lines. */
export const LINES = {
	count: 28,
	startRange: 100,
	reach: 41,
	show: 100,
	rise: 15,
	height: 120,
	hold: 124,
	shrink: 5,
	alpha: 150,
	fade: 15,
	band: 1.5
};

const DEG = Math.PI / 180;
const r = (random, k) => Math.floor(random() * k);

/**
 * One pillar after `n` updates: picture (0-7) and alpha, or null once it is gone.
 *
 * @param {number} n
 * @return {{picture: number, alpha: number}|null}
 */
export function pillarState(n) {
	const steps = Math.floor(Math.max(n, 0) / PILLAR.every);
	const picture = Math.min(steps, PILLAR.pictures - 1);
	const fades = Math.max(0, steps - (PILLAR.pictures - 1));
	const alpha = PILLAR.alpha - PILLAR.fade * fades;
	if (alpha < 0) {
		return null;
	}
	return { picture, alpha };
}

/**
 * A pillar on tick `age` of its own (0 when it is made): picture, size in
 * sprite pixels, height of its middle in cells and alpha (0-255), or null.
 *
 * @param {number} age ticks
 * @return {{picture: number, width: number, height: number, z: number, alpha: number}|null}
 */
export function pillarAt(age) {
	const state = pillarState(Math.floor(age));
	if (!state) {
		return null;
	}
	return {
		picture: state.picture,
		width: PILLAR.radius * PX_PER_UNIT,
		height: PILLAR.radius * Math.sqrt(3) * PX_PER_UNIT,
		z: PILLAR.height / UNITS_PER_CELL,
		alpha: state.alpha
	};
}

/**
 * The red lines, in the order the client makes them: start age r(100),
 * reach r(41), direction r(360), radius r(11).
 *
 * @param {function} [random] returns a number in [0, 1)
 * @return {Array<object>}
 */
export function planLines(random = Math.random) {
	const lines = [];
	for (let i = 0; i < LINES.count; i++) {
		const start = r(random, LINES.startRange);
		const reach = r(random, LINES.reach);
		const direction = r(random, 360) * DEG;
		const radius = r(random, 11) * 0.015 + 0.15;
		lines.push({ start, x: reach * Math.cos(direction), z: reach * Math.sin(direction), radius });
	}
	return lines;
}

/**
 * A line's height (units) and alpha at its age, or null when it does not show.
 *
 * @param {number} age the line's own age (it starts at line.start)
 * @return {{height: number, alpha: number}|null}
 */
export function lineState(age) {
	if (age < LINES.show) {
		return null;
	}
	let height = LINES.height;
	let alpha = LINES.alpha;
	if (age < LINES.show + LINES.rise + 1) {
		height = LINES.height * Math.sin(6 * (age - LINES.show) * DEG);
	} else if (age > LINES.hold) {
		const n = age - LINES.hold;
		height = Math.max(0, LINES.height - LINES.shrink * n);
		alpha = Math.max(0, LINES.alpha - LINES.fade * n);
	}
	if (height <= 0 || alpha <= 0) {
		return null;
	}
	return { height, alpha };
}

/** Ticks of the effect after which no line shows. */
export const LINES_END = LINES.hold + LINES.alpha / LINES.fade;

/**
 * Line `line` on tick `tick` of the effect: offsets in cells from the
 * target (x and y on the map, z up to its middle), size in sprite pixels
 * and alpha (0-255), or null.
 *
 * @param {object} line from planLines
 * @param {number} tick ticks since the effect started
 * @return {{x: number, y: number, z: number, width: number, height: number, alpha: number}|null}
 */
export function lineAt(line, tick) {
	const state = lineState(line.start + Math.floor(tick) + 1);
	if (!state) {
		return null;
	}
	return {
		x: line.x / UNITS_PER_CELL,
		y: line.z / UNITS_PER_CELL,
		z: state.height / 2 / UNITS_PER_CELL,
		width: 2 * line.radius * LINES.band * PX_PER_UNIT,
		height: state.height * PX_PER_UNIT,
		alpha: state.alpha
	};
}
