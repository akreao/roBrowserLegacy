/**
 * DB/Effects/ChampionMonsterEffects.js
 *
 * Effect table entries for the looks the official client gives rAthena's
 * champion monsters (DB/Monsters/MonsterSizeEffect.js), spread into
 * EffectTable.js. Swift's 240 (EF_BOTTOM_DE) is Deluge's band and is in
 * EffectTable.js. Each lasts until it is removed: the monster's effects come
 * off when it dies or leaves sight. Numbers from kRO's client 2025-07-16.
 *
 * - 544 EF_REDLIGHTBODY (Furious): the sprite drawn twice more, added, in red
 *   (BodyMotion.js), fading in over its first 80 ticks to stay at alpha 130;
 * - 620 EF_BOTTOM_SUITON (Elusive, and Watery Evasion's cells): Deluge's
 *   breathing band (prim 36) in ring_blue.tga, tinted (120, 120, 255) by the
 *   client's colour mode 14;
 * - 679 EF_GREEN99_5 (Solid): the level-99 aura's swirling bands (prim 23) in
 *   ring_white.tga, green (colour mode 7, (100, 255, 100)) where the blue
 *   aura (200) uses mode 4;
 * - 1003 EF_BLUELIGHTBODY (Ringleader): the sprite drawn twice more, added, in
 *   blue at alpha 160.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import BodyMotion from 'Renderer/Effects/BodyMotion.js';
import FieldBand from 'Renderer/Effects/FieldBand.js';
import SwirlingAura from 'Renderer/Effects/SwirlingAura.js';

/** Colour mode 14 of the client's band drawing. */
export const SUITON_COLOR = [120, 120, 255];

/** SwirlingAura's colour mode for the green aura. */
export const GREEN_AURA_MODE = 7;

/**
 * A body glow that lasts until it is removed.
 *
 * @param {number} effectId 544 or 1003
 * @return {object} effect table entry
 */
function bodyGlow(effectId) {
	return {
		type: 'FUNC',
		attachedEntity: true,
		func: function (Params) {
			this.add(new BodyMotion(Params.Init.ownerEntity, Params.Inst.startTick, effectId, Infinity), Params);
		}
	};
}

export default {
	//EF_REDLIGHTBODY	Furious champion monsters
	544: [bodyGlow(544)],

	620: [
		{
			//EF_BOTTOM_SUITON	Elusive champion monsters, Watery Evasion
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				this.add(
					new FieldBand(
						Params.Inst.position,
						Params.Inst.startTick,
						'ring_blue.tga',
						undefined,
						SUITON_COLOR
					),
					Params
				);
			}
		}
	],

	679: [
		{
			//EF_GREEN99_5	Solid champion monsters
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				this.add(
					new SwirlingAura(
						Params.Init.ownerEntity.position,
						'ring_white.tga',
						Params.Inst.startTick,
						GREEN_AURA_MODE
					),
					Params
				);
			}
		}
	],

	//EF_BLUELIGHTBODY	Ringleader champion monsters
	1003: [bodyGlow(1003)]
};
