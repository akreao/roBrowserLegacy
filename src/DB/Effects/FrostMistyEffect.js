/**
 * DB/Effects/FrostMistyEffect.js
 *
 * Frost Misty's effect 726 (EF_FROSTMYSTY) as the official client (kRO
 * 2025-07-16) plays it at the cell: its sound on tick 10, a blue glow and
 * falling-up snow. Motion in Renderer/Effects/FrostMistySim.js, spec in
 * effect-port/frost-misty.md. Spread into EffectTable.js.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { PRIM_TICK_MS } from 'Renderer/Effects/EffectPrimSim.js';
import { GLOW, GLOW_LIFE, SNOW, ringAt, planSnow, flakeAt } from 'Renderer/Effects/FrostMistySim.js';
import { SPARK_LIFE } from 'Renderer/Effects/ReadySparkSim.js';

/** The glow's picture, and the snow's two. */
export const GLOW_TEXTURE = 'effect/freeze_a.bmp';
export const SNOW_TEXTURES = ['effect/E9_snow03.tga', 'effect/E9_snow02.tga'];

const SNOW_COLOR = SNOW.color.map(c => c / 255);

/**
 * The 3D effect drawing ring j of the glow.
 *
 * @param {number} j 1-10
 * @return {object}
 */
export function glowRingEffect(j) {
	return {
		type: '3D',
		fileList: [GLOW_TEXTURE],
		sharedTexture: true,
		alphaMax: 1,
		blendMode: 2,
		attachedEntity: false,
		duration: GLOW_LIFE * PRIM_TICK_MS,
		zIndex: 1,
		track(age) {
			const ring = ringAt(j, age);
			if (!ring) {
				return null;
			}
			return {
				x: 0,
				y: 0,
				z: ring.z,
				size: ring.size,
				angle: 0,
				color: ring.color.map(c => c / 255),
				alpha: ring.alpha / 255
			};
		}
	};
}

/**
 * The 3D effect drawing one flake. It starts on the flake's own tick.
 *
 * @param {object} flake from planSnow
 * @return {object}
 */
export function flakeEffect(flake) {
	return {
		type: '3D',
		fileList: SNOW_TEXTURES,
		sharedTexture: true,
		alphaMax: 1,
		blendMode: 2,
		attachedEntity: false,
		duration: SPARK_LIFE * PRIM_TICK_MS,
		zIndex: 1,
		track(age) {
			const p = flakeAt(flake, age);
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
				color: SNOW_COLOR,
				alpha: p.alpha / 255
			};
		}
	};
}

export default {
	726: [
		{
			//EF_FROSTMYSTY	   Frost Misty: its sound on tick 10
			wav: 'effect/t_\xbf\xa1\xb3\xca\xc1\xf6\xb9\xe6\xc3\xe2', // effect/t_에너지방출
			delayWav: Math.round(10 * PRIM_TICK_MS),
			attachedEntity: false
		},
		{
			// the blue glow and the snow, each part on its own tick
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				const parts = [];
				for (let j = 1; j <= GLOW.rings; j++) {
					parts.push({ effect: glowRingEffect(j), spawn: 0 });
				}
				planSnow().forEach(flake => parts.push({ effect: flakeEffect(flake), spawn: flake.spawn }));
				parts.forEach(({ effect, spawn }, i) => {
					this.spamEffect({
						effect,
						Inst: {
							effectID: 726,
							duplicateID: i,
							startTick: Params.Inst.startTick + spawn * PRIM_TICK_MS
						},
						Init: Params.Init
					});
				});
			}
		}
	]
};
