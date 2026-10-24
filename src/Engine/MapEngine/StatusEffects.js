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
 * @param {number} AID actor id
 * @param {number} status status id (StatusConst)
 * @param {number} state 1 on, 0 off
 */
export function updateStatusEffects(AID, status, state) {
	const row = StatusEffectTable[status];
	if (!row) {
		return;
	}

	const loops = row.loop || [];

	if (state == 1) {
		(row.start || []).forEach(effectId => EffectManager.spam({ effectId, ownerAID: AID }));
		loops.forEach(effectId => {
			if (!EffectManager.has(AID, effectId)) {
				EffectManager.spam({ effectId, ownerAID: AID, persistent: true });
			}
		});
	} else if (state == 0) {
		loops.forEach(effectId => EffectManager.remove(null, AID, effectId));
	}
}
