/**
 * DB/Effects/TetraVortexEffect.js
 *
 * Tetra Vortex's four sub explosions as the official client (kRO 2025-07-16,
 * use cases 0xd118f8 / 0xd11c59 / 0xd11fb9 / 0xd12319) places them on success:
 * one copy of the element's sub explosion (1278 fire, 1279 water, 1280 wind,
 * 1281 earth) in each quarter round the target, d1 units along the map's x and
 * d2 along its y, each d = r(35) raised to 10 when below, 5 units up, with no
 * owner (they stay where they start). Quarters in order: (+x, +y), (+x, -y),
 * (-x, -y), (-x, +y). Spec: effect-port/warlock-skills.md.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { UNITS_PER_CELL } from 'Renderer/Effects/EffectPrimSim.js';

/** Signs of the four quarters, [x, y]. */
const QUARTERS = [
	[1, 1],
	[1, -1],
	[-1, -1],
	[-1, 1]
];

/** Height of the sub explosions above the target, client units. */
export const SUB_HEIGHT = 5;

/**
 * One distance: r(35), at least 10.
 *
 * @param {function} random returns a number in [0, 1)
 * @return {number} client units
 */
function distance(random) {
	return Math.max(10, Math.floor(random() * 35));
}

/**
 * Offsets of the four sub explosions, in cells.
 *
 * @param {function} [random] returns a number in [0, 1)
 * @return {Array<Array<number>>} [dx, dy, dz] each
 */
export function tetraSubOffsets(random = Math.random) {
	return QUARTERS.map(([sx, sy]) => [
		(sx * distance(random)) / UNITS_PER_CELL,
		(sy * distance(random)) / UNITS_PER_CELL,
		SUB_HEIGHT / UNITS_PER_CELL
	]);
}

/**
 * Spam the four sub explosions round the effect's position.
 *
 * @param {object} manager EffectManager
 * @param {object} Params the effect's params
 * @param {number} effectId 1278-1281
 */
export function spamTetraSubExplosions(manager, Params, effectId) {
	const position = Params.Inst.position;
	if (!position) {
		return;
	}
	tetraSubOffsets().forEach(([dx, dy, dz]) => {
		manager.spam({
			effectId,
			position: [position[0] + dx, position[1] + dy, position[2] + dz],
			startTick: Params.Inst.startTick
		});
	});
}
