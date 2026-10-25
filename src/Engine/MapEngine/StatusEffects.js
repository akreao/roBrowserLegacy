/**
 * Engine/MapEngine/StatusEffects.js
 *
 * Start and stop the effects listed in DB/Status/StatusEffectTable.js when an
 * actor's status turns on or off.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import StatusEffectTable from 'DB/Status/StatusEffectTable.js';
import EffectManager from 'Renderer/EffectManager.js';

/**
 * Every effect a row's stages can show
 *
 * @param {object} row StatusEffectTable row
 * @return {Array<string>}
 */
function stageEffects(row) {
	return [...new Set((row && row.stages ? row.stages : []).flat())];
}

/**
 * @param {number} AID actor id
 * @param {number} status status id (StatusConst)
 * @param {number} state 1 on, 0 off
 * @param {number|Array<number>} [values] the status's values (val1, val2, val3), or only its first one
 */
export function updateStatusEffects(AID, status, state, values) {
	const row = StatusEffectTable[status];
	if (!row) {
		return;
	}

	const vals = Array.isArray(values) ? values : [values];
	const value = vals[0];
	const loops = row.loop || [];
	const counted = row.counted ? row.counted.effects : [];
	const scale = row.scale;
	const play = (effectId, persistent) =>
		EffectManager.spam(
			Object.assign({ effectId, ownerAID: AID }, persistent && { persistent }, scale && { scale })
		);

	if (state == 1) {
		(row.start || []).forEach(effectId => play(effectId));
		loops.forEach(effectId => {
			if (!EffectManager.has(AID, effectId)) {
				play(effectId, true);
			}
		});
		if (row.stages) {
			stageEffects(row).forEach(effectId => EffectManager.remove(null, AID, effectId));
			(row.stages[value] || []).forEach(effectId => play(effectId));
		}
		if (row.counted) {
			// The count N (1 and up) plays the Nth effect; earlier ones keep playing
			const effectId = counted[vals[row.counted.value] - 1];
			if (effectId && !EffectManager.has(AID, effectId)) {
				play(effectId, true);
			}
		}
	} else if (state == 0) {
		loops.forEach(effectId => EffectManager.remove(null, AID, effectId));
		counted.forEach(effectId => EffectManager.remove(null, AID, effectId));
		(row.stop || []).forEach(effectId => EffectManager.remove(null, AID, effectId));
		(row.end || []).forEach(effectId => play(effectId));
		(row.clears || []).forEach(other =>
			stageEffects(StatusEffectTable[other]).forEach(effectId => EffectManager.remove(null, AID, effectId))
		);
	}
}
