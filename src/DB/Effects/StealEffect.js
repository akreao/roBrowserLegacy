/**
 * DB/Effects/StealEffect.js
 *
 * Effect 18 (EF_STEAL) as the official client draws it: EF_Steal.wav and 10
 * particle7 sparks thrown out from the target, falling back as they shrink.
 * Motion in Renderer/Effects/StealSparkSim.js. Spec: effect-port/thief-skills.md.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { PRIM_TICK_MS, UNITS_PER_CELL } from 'Renderer/Effects/EffectPrimSim.js';
import { STEAL, planSparks, sparkAt } from 'Renderer/Effects/StealSparkSim.js';

/**
 * The 3D effect drawing one spark, following the target.
 *
 * @param {object} spark from planSparks
 * @return {object}
 */
export function stealSparkEffect(spark) {
	return {
		type: '3D',
		spriteName: 'particle7',
		alphaMax: 1,
		attachedEntity: true,
		duration: STEAL.life * PRIM_TICK_MS,
		zIndex: 1,
		track(age) {
			const p = sparkAt(spark, age);
			if (!p) {
				return null;
			}
			return {
				x: p.x / UNITS_PER_CELL,
				y: p.y / UNITS_PER_CELL,
				z: p.up / UNITS_PER_CELL,
				size: p.scale * 100,
				alpha: p.alpha / 255
			};
		}
	};
}

/** EffectTable row for 18. */
export const stealEffect = [
	{
		//EF_STEAL	Steal, on the target when it succeeds
		type: 'FUNC',
		attachedEntity: true,
		func: function (Params) {
			planSparks().forEach((spark, i) => {
				this.spamEffect({
					effect: stealSparkEffect(spark),
					Inst: { effectID: 18, duplicateID: i, startTick: Params.Inst.startTick },
					Init: Params.Init
				});
			});
		}
	},
	{
		wav: 'effect/ef_steal',
		attachedEntity: true
	}
];
