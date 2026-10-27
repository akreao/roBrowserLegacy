/**
 * Renderer/Effects/LandProtectorSim.js
 *
 * Numbers of the official client's Land Protector ground tile (effect 242,
 * primitive 39 with aaa copy.bmp), without any WebGL, so they can be tested.
 *
 * As the official client draws it, under every cell of the unit:
 *
 *  - One flat quad 2 units above the ground, its corners on the four world
 *    axes (a diamond; the texture turned 45 degrees). It does not turn.
 *  - Corner distance from the cell centre: 5.6 + 0.7 (1 + sin(a deg)) units
 *    (1.12 to 1.4 cells); `a` starts at a random whole degree and grows 3 a
 *    tick, so the tile breathes every 2 seconds, out of step with its neighbours.
 *  - White, alpha 100 of 255, additive blending (the texture's black adds nothing).
 *
 * Units are the client's: world units (5 to a cell), ticks (60 a second), degrees.
 */

import { PRIM_TICK_MS, UNITS_PER_CELL } from './EffectPrimSim.js';

export { PRIM_TICK_MS as LAND_PROTECTOR_TICK_MS };

export const LAND_PROTECTOR = {
	size: 7, // the primitive's size
	base: 0.8, // of the size, always
	breathe: 0.1, // of the size, times (1 + sin)
	step: 3, // degrees a tick
	lift: 2, // units above the ground
	alpha: 100 // of 255
};

/**
 * Corner distance from the cell centre, in cells, on tick `t` (1 on the first).
 *
 * @param {number} start start angle, whole degrees
 * @param {number} t
 * @return {number}
 */
export function cornerDistance(start, t) {
	const { size, base, breathe, step } = LAND_PROTECTOR;
	const a = ((start + step * t) % 360) * (Math.PI / 180);
	return (size * base + size * breathe * (1 + Math.sin(a))) / UNITS_PER_CELL;
}

/** Height above the ground, in cells. */
export const LIFT_CELLS = LAND_PROTECTOR.lift / UNITS_PER_CELL;

/** Alpha, 0 to 1. */
export const ALPHA = LAND_PROTECTOR.alpha / 255;
