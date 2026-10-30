/**
 * DB/Effects/ReadySparkEffect.js
 *
 * The blue sparks the official client (kRO 2025-07-16) leaves around the
 * actor for effects 543 (EF_HATED: Kaahi, Kaizel, Comfort, Hatred) and 546
 * (EF_SMA_READY, the Star Gladiator's combo-ready status). Motion in
 * Renderer/Effects/ReadySparkSim.js.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { PRIM_TICK_MS } from 'Renderer/Effects/EffectPrimSim.js';
import { SPARK, SPARK_LIFE, planSparks, sparkAt } from 'Renderer/Effects/ReadySparkSim.js';

/** The two pictures of a spark: pok1, and pok3 for its flash. */
export const SPARK_TEXTURES = ['effect/pok1.tga', 'effect/pok3.tga'];

const COLOR = SPARK.color.map(c => c / 255);

/**
 * The 3D effect drawing one spark. It starts on the spark's own tick.
 *
 * @param {object} spark from planSparks
 * @return {object}
 */
export function sparkEffect(spark) {
	return {
		type: '3D',
		fileList: SPARK_TEXTURES,
		sharedTexture: true,
		alphaMax: 1,
		blendMode: 2,
		attachedEntity: true,
		duration: SPARK_LIFE * PRIM_TICK_MS,
		zIndex: 1,
		track(age) {
			const p = sparkAt(spark, age);
			if (!p) {
				return null;
			}
			return {
				x: p.x,
				y: p.y,
				z: p.z,
				size: p.size,
				angle: p.angle,
				texture: p.texture,
				color: COLOR,
				alpha: p.alpha / 255
			};
		}
	};
}

/**
 * The row that leaves an effect's sparks, each on its own tick.
 *
 * @param {number} effectId 543 or 546
 * @return {object} effect table row
 */
export function readySparksRow(effectId) {
	return {
		type: 'FUNC',
		attachedEntity: true,
		func: function (Params) {
			planSparks(effectId).forEach((spark, i) => {
				this.spamEffect({
					effect: sparkEffect(spark),
					Inst: {
						effectID: effectId,
						duplicateID: i,
						startTick: Params.Inst.startTick + spark.spawn * PRIM_TICK_MS
					},
					Init: Params.Init
				});
			});
		}
	};
}
