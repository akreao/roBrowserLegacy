/**
 * DB/Effects/HitDarkEffect.js
 *
 * Effect 180 (EF_HITDARK), the dark hit flash of Curse Explosion and Espa, as
 * the official client draws it (kRO 2025-07-16, 0xbb2460): one ring_blue cone
 * band opening the way the target faces and four faint dark particle1 sparks,
 * two ahead and two thrown up behind. Numbers in Renderer/Effects/HitDarkSim.js.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { PRIM_TICK_MS, UNITS_PER_CELL, facingAngle } from 'Renderer/Effects/EffectPrimSim.js';
import { DARK_CONE, DARK_SPARK, planDarkSparks, darkSparkAt, darkTrailLook } from 'Renderer/Effects/HitDarkSim.js';

/** The cone band (official primitive 13), turned by the owner's facing. */
export const darkConeBand = {
	type: 'PRIM',
	prim: 'cone',
	texture: 'ring_blue',
	attachedEntity: true,
	duration: DARK_CONE.life * PRIM_TICK_MS,
	frames: DARK_CONE.life,
	facing: true,
	pitch: -90,
	height: DARK_CONE.up,
	baseRadius: DARK_CONE.baseRadius,
	topRadius: DARK_CONE.topRadius,
	coneHeight: DARK_CONE.coneHeight,
	drift: DARK_CONE.drift,
	driftAccel: -(DARK_CONE.drift / DARK_CONE.life) * 0.5,
	fadeOutFrame: DARK_CONE.fadeFrom
};

const SPARK_COLOR = DARK_SPARK.color.map(c => c / 255);

/**
 * The 3D effect drawing trail copy `i` of a spark (0 the spark itself).
 *
 * @param {object} spark from planDarkSparks
 * @param {number} i
 * @return {object}
 */
export function darkSparkRow(spark, i) {
	return {
		type: '3D',
		spriteName: 'particle1',
		alphaMax: 1,
		blendMode: 2,
		// The sprite layers take the row's tint, not the track's colour.
		red: SPARK_COLOR[0],
		green: SPARK_COLOR[1],
		blue: SPARK_COLOR[2],
		attachedEntity: true,
		duration: spark.life * PRIM_TICK_MS,
		zIndex: 1,
		track(age) {
			const k = Math.floor(age);
			// The client updates before it draws: k + 1 updates; the trail lags i of them.
			const n = k + 1 - i;
			if (k < 0 || k >= spark.life || n < 1) {
				return null;
			}
			const p = darkSparkAt(spark, n);
			const look = darkTrailLook(spark, darkSparkAt(spark, k + 1).alpha, i);
			return {
				x: p.x / UNITS_PER_CELL,
				y: p.y / UNITS_PER_CELL,
				z: p.up / UNITS_PER_CELL,
				size: look.scale * 100,
				alpha: look.alpha / 255,
				color: SPARK_COLOR
			};
		}
	};
}

/** EffectTable rows for 180. */
export const hitDarkEffect = [
	{
		//EF_HITDARK	Dark hit flash: a ring_blue cone band and four dark sparks (kRO 2025 0xbb2460)
		type: 'FUNC',
		attachedEntity: true,
		func: function (Params) {
			const owner = Params.Init.ownerEntity;
			const yaw = (180 - facingAngle(owner && owner.direction) + 360) % 360;
			const Init = Params.Init;
			const startTick = Params.Inst.startTick;
			this.spamEffect({ effect: darkConeBand, Inst: { effectID: 180, duplicateID: 0, startTick }, Init });
			planDarkSparks(yaw).forEach((spark, s) => {
				for (let i = 0; i < DARK_SPARK.trail; i++) {
					this.spamEffect({
						effect: darkSparkRow(spark, i),
						Inst: { effectID: 180, duplicateID: 1 + s * DARK_SPARK.trail + i, startTick },
						Init
					});
				}
			});
		}
	}
];
