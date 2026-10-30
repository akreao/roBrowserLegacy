/**
 * Engine/MapEngine/MonsterSizeEffects.js
 *
 * The effects the official client puts on some monsters by job id
 * (DB/Monsters/MonsterSizeEffect.js): rAthena's champion monsters (Swift,
 * Solid, Furious, Elusive, Ringleader ...) and a few others. They are put on
 * the monster when it appears and kept while it is in sight.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { monsterEffects } from 'DB/Monsters/MonsterSizeEffect.js';
import EffectManager from 'Renderer/EffectManager.js';

/**
 * The job the table is looked up by: the one the entity is drawn as.
 *
 * @param {object} entity
 * @return {number}
 */
function jobOf(entity) {
	return entity._job !== undefined ? entity._job : entity.job;
}

/**
 * Put the table's effects on an entity that has just appeared, once each.
 *
 * @param {object} entity
 */
export function showMonsterEffects(entity) {
	const effects = monsterEffects(jobOf(entity));
	for (let i = 0; i < effects.length; i++) {
		if (EffectManager.has(entity.GID, effects[i])) {
			continue;
		}
		EffectManager.spam({
			effectId: effects[i],
			ownerAID: entity.GID,
			persistent: true
		});
	}
}

/**
 * Take them off again (the monster died).
 *
 * @param {object} entity
 */
export function removeMonsterEffects(entity) {
	const effects = monsterEffects(jobOf(entity));
	if (effects.length) {
		EffectManager.remove(null, entity.GID, effects);
	}
}
