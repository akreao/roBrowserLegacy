/**
 * DB/Effects/ServantDemolitionEffect.js
 *
 * Servant Weapon: Demolition (DK_SERVANT_W_DEMOL), played like the official
 * client. For every damage packet the servant swords gather on the caster
 * (servant_demolition_collect), a little later for a slower attack motion,
 * and one sword strikes down on the target: leftdown or rightdown, picked at
 * random, half and half. The hit art follows when the damage lands.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { motionSpeed } from 'DB/Effects/StormSlashEffect.js';

/** Official ticks run at 60 Hz. */
const TICK_MS = 1000 / 60;

const FOLDER = 'dragon_knight/dk_servant_w_demol/';

/**
 * How long after the damage packet the gathering starts: motion speed x 100
 * + 100 ms, counted in whole ticks, plus the tick the effect is created on.
 *
 * @param {number} speed motion speed in ACT units
 * @return {number} ms
 */
export function collectDelay(speed) {
	const ms = Math.trunc(speed * 100 + 100);
	return (Math.trunc(ms / 16) + 1) * TICK_MS;
}

/**
 * One EZ2 row of the skill, attached to its owner at PosY 8.
 *
 * @param {string} name file name, e.g. servant_demolition_collect
 * @return {object} STR layer
 */
function layer(name) {
	return {
		type: 'STR',
		file: FOLDER + name + '/' + name,
		texturePath: FOLDER + name + '/',
		min: FOLDER + name + '/min_' + name,
		fallback: ['servant_demolition/' + name + '/' + name],
		xOffset: 0,
		yOffset: 8,
		attachedEntity: true
	};
}

/**
 * EffectTable rows for the skill.
 *
 * @return {object}
 */
export function servantDemolitionEffects() {
	return {
		ef_dk_servant_w_demol_collect: [
			{
				...layer('servant_demolition_collect'),
				delayStart: Params => collectDelay(motionSpeed(Params.Init.ownerEntity))
			}
		],
		ef_dk_servant_w_demol_leftdown: [layer('servant_demolition_leftdown')],
		ef_dk_servant_w_demol_rightdown: [layer('servant_demolition_rightdown')],
		ef_dk_servant_w_demol_hit: [{ ...layer('servant_demolition_hit'), wav: 'effect/dk_servant_w_demol' }]
	};
}

export default { collectDelay, servantDemolitionEffects };
