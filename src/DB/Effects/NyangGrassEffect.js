/**
 * DB/Effects/NyangGrassEffect.js
 *
 * Nyang Grass's field (official effect 1125), drawn by the client when the
 * skill's unit appears: su_nyanggrass.wav, then a square of looping
 * su_nyanggrass.str copies, one per cell, centred on the unit. The square is
 * 5 x 5 cells for levels 1-2, 7 x 7 for 3-4 and 9 x 9 for 5.
 * Spec: effect-port/summoner-skills.md.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/**
 * Side of the square, in cells, for a skill level.
 *
 * @param {number} level
 * @return {number}
 */
export function nyangGrassSize(level) {
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
 * @param {number} level
 * @return {number[][]}
 */
export function nyangGrassCells(level) {
	const size = nyangGrassSize(level);
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
				nyangGrassCells(Params.Init.skillLevel).forEach(([dx, dy]) => {
					this.spam({
						effectId: 'ef_su_nyanggrass',
						ownerAID: Params.Init.ownerAID,
						position: [at[0] + dx, at[1] + dy, at[2]],
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
