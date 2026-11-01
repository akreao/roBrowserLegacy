/**
 * DB/Effects/DetoxifyEffect.js
 *
 * Effect 21 (EF_DETOXICATION) as the official client draws it:
 * EF_Detoxication.wav and 20 particle2 bubbles, one every 5 ticks, rising
 * around the target (one every 15 ticks, 7 in all, under /mineffect).
 * Motion in Renderer/Effects/DetoxBubbleSim.js.
 * Spec: effect-port/thief-skills.md.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import Preferences from 'Preferences/Map.js';
import { PRIM_TICK_MS, UNITS_PER_CELL } from 'Renderer/Effects/EffectPrimSim.js';
import { DETOX, DETOX_LOW, planBubbles, bubbleAt } from 'Renderer/Effects/DetoxBubbleSim.js';

/**
 * The 3D effect drawing one bubble, following the target. It starts on the
 * bubble's own tick, so its age is the bubble's age.
 *
 * @param {object} bubble from planBubbles
 * @param {string} [spriteName] the sprite under data/sprite/이팩트
 * @param {number} [lowEvery] under /mineffect only bubbles spawned on a multiple of this many ticks are drawn,
 *   decided when the bubble starts, as the client asks the option on each spawn tick
 * @return {object}
 */
export function detoxBubbleEffect(bubble, spriteName = 'particle2', lowEvery = 0) {
	let hidden = null;
	return {
		type: '3D',
		spriteName: spriteName,
		alphaMax: 1,
		attachedEntity: true,
		duration: DETOX.life * PRIM_TICK_MS,
		zIndex: 1,
		track(age) {
			if (hidden === null) {
				hidden = !!(lowEvery && Preferences.mineffect && bubble.spawn % lowEvery !== 0);
			}
			if (hidden) {
				return null;
			}
			const p = bubbleAt(bubble, age);
			if (!p) {
				return null;
			}
			return {
				x: p.x / UNITS_PER_CELL,
				y: p.y / UNITS_PER_CELL,
				z: p.up / UNITS_PER_CELL,
				size: p.scale * 100,
				alpha: p.alpha / 255,
				angle: p.angle
			};
		}
	};
}

/** EffectTable row for 21. */
export const detoxifyEffect = [
	{
		//EF_DETOXICATION	Detoxify, on the target when it succeeds
		type: 'FUNC',
		attachedEntity: true,
		func: function (Params) {
			// The client's low-effects mode (/mineffect) spawns one bubble every 15 ticks
			planBubbles().forEach((bubble, i) => {
				this.spamEffect({
					effect: detoxBubbleEffect(bubble, 'particle2', DETOX_LOW.every),
					Inst: {
						effectID: 21,
						duplicateID: i,
						startTick: Params.Inst.startTick + bubble.spawn * PRIM_TICK_MS
					},
					Init: Params.Init
				});
			});
		}
	},
	{
		wav: 'effect/ef_detoxication',
		attachedEntity: true
	}
];
