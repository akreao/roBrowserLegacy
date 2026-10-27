/**
 * DB/Effects/PoisonAttackEffect.js
 *
 * Effects 20 (EF_PATTACK) and 125 as the official client draws them (one
 * function for both): assasin_enchantpoison.wav and EF_PoisonAttack.wav, then
 * a particle3 particle every 5 ticks for the effect's whole life, rising
 * around the target exactly like the Detoxify bubbles (DetoxBubbleSim.js).
 * 20 lives 100 ticks (20 particles), 125 lives 250 (50 particles).
 * 125 plays on the target when Enchant Poison or Venom Splasher succeeds.
 * Spec: effect-port/assassin-skills.md.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { PRIM_TICK_MS } from 'Renderer/Effects/EffectPrimSim.js';
import { DETOX, planBubbles } from 'Renderer/Effects/DetoxBubbleSim.js';
import { detoxBubbleEffect } from 'DB/Effects/DetoxifyEffect.js';

/** Effect lifetime in ticks (table 0xe7ac28). */
export const POISON_ATTACK_LIFE = { 20: 100, 125: 250 };

/**
 * EffectTable rows for 20 or 125.
 *
 * @param {number} effectId 20 or 125
 * @return {Array<object>}
 */
export function poisonAttackEffect(effectId) {
	const count = Math.ceil(POISON_ATTACK_LIFE[effectId] / DETOX.every);
	return [
		{
			//EF_PATTACK	poison particles rising around the target, one every 5 ticks
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				planBubbles(Math.random, count).forEach((bubble, i) => {
					this.spamEffect({
						effect: detoxBubbleEffect(bubble, 'particle3'),
						Inst: {
							effectID: effectId,
							duplicateID: i,
							startTick: Params.Inst.startTick + bubble.spawn * PRIM_TICK_MS
						},
						Init: Params.Init
					});
				});
			}
		},
		{
			wav: 'effect/assasin_enchantpoison',
			attachedEntity: true
		},
		{
			wav: 'effect/ef_poisonattack',
			attachedEntity: true
		}
	];
}
