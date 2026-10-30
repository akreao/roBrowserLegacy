/**
 * DB/Effects/WarmthEffect.js
 *
 * Effect 418 (EF_DOUBLEGUMGANG) as the official client (kRO 2025-07-16) keeps
 * it on a Star Gladiator while a Warmth status is on: eight red sparks flashing
 * 4 units around the body (WarmthSparkSim.js). StatusEffectTable.js starts it
 * with the status and removes it when the status ends.
 *
 * Each launch makes its own sparks, drawn as three added copies each.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { WARMTH, WARMTH_LAYERS, PX_PER_UNIT, WarmthSparks } from 'Renderer/Effects/WarmthSparkSim.js';

/** Long enough that a held look does not restart in play (the status removes it). */
const HELD_MS = 60 * 60 * 1000;

/** The five pictures a spark picks from. */
export const WARMTH_TEXTURES = [
	'effect/super1.bmp',
	'effect/super2.bmp',
	'effect/super3.bmp',
	'effect/super4.bmp',
	'effect/super5.bmp'
];

/**
 * The row drawing one copy of one spark.
 *
 * @param {WarmthSparks} sparks this launch's sparks
 * @param {number} index spark 0-7
 * @param {object} layer from WARMTH_LAYERS
 * @return {object} effect table row
 */
export function warmthSparkRow(sparks, index, layer) {
	const size = 2 * WARMTH.half * layer.scale * PX_PER_UNIT;
	const color = layer.color.map(c => c / 255);
	return {
		type: '3D',
		fileList: WARMTH_TEXTURES,
		alphaMax: 1,
		blendMode: 2,
		attachedEntity: true,
		duration: HELD_MS,
		zIndex: 1,
		track(age) {
			const p = sparks.at(index, age);
			return { x: p.x, y: p.y, z: p.z, size, alpha: p.alpha / 255, texture: p.texture, color };
		}
	};
}

/** EffectTable row for 418. */
export const warmthEffect = [
	{
		//EF_DOUBLEGUMGANG	Warmth sparks, held while the status is on
		type: 'FUNC',
		attachedEntity: true,
		func: function (Params) {
			const sparks = new WarmthSparks();
			let n = 0;
			for (let i = 0; i < WARMTH.groups * WARMTH.sparks; i++) {
				WARMTH_LAYERS.forEach(layer => {
					this.spamEffect({
						effect: warmthSparkRow(sparks, i, layer),
						Inst: { effectID: 418, duplicateID: n++, startTick: Params.Inst.startTick },
						Init: Params.Init
					});
				});
			}
		}
	}
];
