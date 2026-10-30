/**
 * Renderer/Effects/SunStanceSim.js
 *
 * The Star Emperor stance looks (CSunStanceEffect, effects 1214-1217) as the
 * official client (kRO 2025-07-16) draws them, without any WebGL, so it can be
 * tested on its own. Spec: effect-port/star-emperor-soul-reaper-audit.md.
 *
 * Three upright pictures of 50 x 50 pixels, each 6 units (two half sides of 3)
 * across, go round the actor 8 units from it and 10 units above the ground,
 * 120 degrees apart, turning 0.02 radians a tick (a full turn in about 5.2 s).
 * Sun, Lunar and Star Stance show their own picture three times; Universal
 * Stance shows one of each (sun, lunar, star).
 *
 * Units are the client's, 5 to a cell; one unit is 7 sprite pixels.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { UNITS_PER_CELL } from './EffectPrimSim.js';

/** Numbers of the look. */
export const STANCE = {
	radius: 8,
	height: 10,
	half: 3,
	spin: 0.02,
	parts: 3
};

/** Sprite pixels to a unit. */
export const PX_PER_UNIT = 7;

/** Pictures of each effect, one per part. */
export const STANCE_TEXTURES = {
	1214: ['sun_stance', 'sun_stance', 'sun_stance'],
	1215: ['lunar_stance', 'lunar_stance', 'lunar_stance'],
	1216: ['star_stance', 'star_stance', 'star_stance'],
	1217: ['sun_stance', 'lunar_stance', 'star_stance']
};

/**
 * Where part `index` is on tick `age` (0 on the first draw), as offsets in
 * cells from the actor (x and y on the map, z up), and its size in sprite
 * pixels. The client turns each part before it places it, so the first draw
 * is already one step on.
 *
 * @param {number} index 0, 1 or 2
 * @param {number} age ticks
 * @return {{x: number, y: number, z: number, size: number}}
 */
export function stancePartAt(index, age) {
	const angle = (index * 2 * Math.PI) / STANCE.parts + STANCE.spin * (Math.floor(age) + 1);
	return {
		x: (Math.cos(angle) * STANCE.radius) / UNITS_PER_CELL,
		y: (Math.sin(angle) * STANCE.radius) / UNITS_PER_CELL,
		z: STANCE.height / UNITS_PER_CELL,
		size: 2 * STANCE.half * PX_PER_UNIT
	};
}
