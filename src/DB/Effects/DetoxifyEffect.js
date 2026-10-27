/**
 * DB/Effects/DetoxifyEffect.js
 *
 * Effect 21 (EF_DETOXICATION) as the official client draws it:
 * EF_Detoxication.wav and 20 particle2 bubbles, one every 5 ticks, rising
 * around the target. Motion in Renderer/Effects/DetoxBubbleSim.js.
 * Spec: effect-port/thief-skills.md.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { PRIM_TICK_MS, UNITS_PER_CELL } from 'Renderer/Effects/EffectPrimSim.js';
import { DETOX, planBubbles, bubbleAt } from 'Renderer/Effects/DetoxBubbleSim.js';

/**
 * The 3D effect drawing one bubble, following the target. It starts on the
 * bubble's own tick, so its age is the bubble's age.
 *
 * @param {object} bubble from planBubbles
 * @param {string} [spriteName] the sprite under data/sprite/이팩트
 * @return {object}
 */
export function detoxBubbleEffect(bubble, spriteName = 'particle2') {
	return {
		type: '3D',
		spriteName: spriteName,
		alphaMax: 1,
		attachedEntity: true,
		duration: DETOX.life * PRIM_TICK_MS,
		zIndex: 1,
		track(age) {
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
			planBubbles().forEach((bubble, i) => {
				this.spamEffect({
					effect: detoxBubbleEffect(bubble),
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
