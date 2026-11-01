/**
 * DB/Effects/HellInfernoEffect.js
 *
 * Where the official client (kRO 2025-07-16, damage arrival 0xd9199c) puts
 * Hell Inferno's four side flames (1553 + 1554): 15 units from the target at
 * 45 + 90 i degrees, i = 0..3, so on the four diagonals.
 * Spec: effect-port/warlock-skills.md.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { UNITS_PER_CELL } from 'Renderer/Effects/EffectPrimSim.js';

/** Distance of the side flames from the target, client units. */
export const SUB_DISTANCE = 15;

/**
 * Offsets of the four side flames, in cells.
 *
 * @return {Array<Array<number>>} [dx, dy] each
 */
export function hellInfernoSubOffsets() {
	const offsets = [];
	for (let i = 0; i < 4; i++) {
		const angle = ((45 + 90 * i) * Math.PI) / 180;
		offsets.push([
			(SUB_DISTANCE * Math.cos(angle)) / UNITS_PER_CELL,
			(-SUB_DISTANCE * Math.sin(angle)) / UNITS_PER_CELL
		]);
	}
	return offsets;
}
