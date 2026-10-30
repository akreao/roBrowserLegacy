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
 * The job the table is looked up by: the one the entity is drawn as (its
 * effective job, which a monster transformation changes).
 *
 * @param {object} entity
 * @return {number}
 */
function jobOf(entity) {
	return entity.job;
}

/**
 * Put the table's effects on an entity that has just appeared or changed
 * looks, once each. When it now looks like another job, the effects of the
 * job it looked like come off first.
 *
 * @param {object} entity
 */
export function showMonsterEffects(entity) {
	const job = jobOf(entity);
	if (entity._sizeEffectJob !== undefined && entity._sizeEffectJob !== job) {
		removeMonsterEffects(entity);
	}
	const effects = monsterEffects(job);
	if (effects.length) {
		entity._sizeEffectJob = job;
	}
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
 * Take off the effects it was given (the monster died or changed looks).
 *
 * @param {object} entity
 */
export function removeMonsterEffects(entity) {
	if (entity._sizeEffectJob === undefined) {
		return;
	}
	const effects = monsterEffects(entity._sizeEffectJob);
	delete entity._sizeEffectJob;
	EffectManager.remove(null, entity.GID, effects);
}
