/**
 * DB/Effects/NyangGrassEffect.js
 *
 * Nyang Grass's field (official effect 1125), drawn by the client when the
 * skill's unit appears: su_nyanggrass.wav, then a square of looping
 * su_nyanggrass.str copies, one per cell, centred on the unit. The square is
 * 5 x 5 cells for levels 1-2, 7 x 7 for 3-4 and 9 x 9 for 5. Each copy
 * stands on its own cell's ground height.
 * Spec: effect-port/summoner-skills.md.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import Altitude from 'Renderer/Map/Altitude.js';

/**
 * Side of the square, in cells, for a skill level.
 *
 * Only ZC_SKILL_ENTRY5 carries the level. Older unit packets carry the unit's
 * range instead, which the server sets from the same table (2, 3 or 4 cells
 * out from the centre), so the side is 2 * range + 1.
 *
 * @param {number} [level]
 * @param {number} [range]
 * @return {number}
 */
export function nyangGrassSize(level, range) {
	if (!(level > 0) && range > 0) {
		return 2 * Math.min(Math.max(range, 2), 4) + 1;
	}
	if (level >= 5) {
		return 9;
	}
	if (level >= 3) {
		return 7;
	}
	return 5;
}

/**
 * Cell offsets [x, y] of the copies, from the unit's cell.
 *
 * @param {number} [level]
 * @param {number} [range]
 * @return {number[][]}
 */
export function nyangGrassCells(level, range) {
	const size = nyangGrassSize(level, range);
	const half = Math.floor(size / 2);
	const cells = [];
	for (let row = 0; row < size; ++row) {
		for (let col = 0; col < size; ++col) {
			cells.push([col - half, row - half]);
		}
	}
	return cells;
}

/** EffectTable rows: the field, and the one-cell STR it spreads. */
export const nyangGrassEffects = {
	ef_su_nyanggrass_field: [
		{
			type: 'FUNC',
			wav: 'effect/su_nyanggrass',
			func: function (Params) {
				const at = Params.Inst.position;
				nyangGrassCells(Params.Init.skillLevel, Params.Init.unitRange).forEach(([dx, dy]) => {
					const x = at[0] + dx;
					const y = at[1] + dy;
					this.spam({
						effectId: 'ef_su_nyanggrass',
						ownerAID: Params.Init.ownerAID,
						position: [x, y, Altitude.getCellHeight(x, y)],
						startTick: Params.Inst.startTick,
						persistent: true
					});
				});
			}
		}
	],

	ef_su_nyanggrass: [
		{
			type: 'STR',
			file: 'su_nyanggrass/su_nyanggrass',
			texturePath: 'su_nyanggrass/'
		}
	]
};
