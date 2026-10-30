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
 * Effect 493 (Enchant Deadly Poison, on the caster) is the same kind of
 * particles from a helper of its own (EDP_BUBBLES), the enchant sound six
 * times and the caster flickering magenta: see edpEffect below and
 * effect-port/assassin-cross-skills.md.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { PRIM_TICK_MS } from 'Renderer/Effects/EffectPrimSim.js';
import { DETOX, EDP_BUBBLES, planBubbles } from 'Renderer/Effects/DetoxBubbleSim.js';
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

/** Effect 493's lifetime in ticks, and the ticks its enchant sound plays on. */
export const EDP_LIFE = 120;
export const EDP_SOUND_TICKS = [0, 5, 11, 18, 26, 40];

/**
 * EffectTable rows for 493 (EF_EDP), on the caster when Enchant Deadly Poison
 * succeeds: a particle3 particle every 3 ticks for its 120 ticks (40), a bit
 * faster and smaller than Enchant Poison's; assasin_enchantpoison.wav on ticks
 * 0, 5, 11, 18, 26 and 40. The caster's magenta flicker (CasterMarks.js) is
 * added by the table entry itself.
 *
 * @return {Array<object>}
 */
export function edpEffect() {
	const count = Math.ceil(EDP_LIFE / EDP_BUBBLES.every);
	return [
		{
			//EF_EDP	poison particles rising around the caster, one every 3 ticks
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				planBubbles(Math.random, count, EDP_BUBBLES).forEach((bubble, i) => {
					this.spamEffect({
						effect: detoxBubbleEffect(bubble, 'particle3'),
						Inst: {
							effectID: 493,
							duplicateID: i,
							startTick: Params.Inst.startTick + bubble.spawn * PRIM_TICK_MS
						},
						Init: Params.Init
					});
				});
			}
		},
		...EDP_SOUND_TICKS.map(tick => ({
			wav: 'effect/assasin_enchantpoison',
			delayWav: tick * PRIM_TICK_MS,
			attachedEntity: true
		}))
	];
}
