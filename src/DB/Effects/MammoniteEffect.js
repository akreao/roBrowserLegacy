/**
 * DB/Effects/MammoniteEffect.js
 *
 * Effect 10 (EF_COIN, Mammonite) as the official client draws it: Maemor.str
 * and, on tick 20, 5 coins thrown up from the target that bounce on the
 * ground with a coin sound. The client plays no sound when the effect starts.
 * Motion in Renderer/Effects/MammoniteCoinSim.js. Spec: effect-port/merchant-skills.md.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { PRIM_TICK_MS, UNITS_PER_CELL } from 'Renderer/Effects/EffectPrimSim.js';
import { COIN, planCoins, coinAt, coinTrailAt } from 'Renderer/Effects/MammoniteCoinSim.js';

/**
 * The 3D effect drawing one coin, or its trailing copy, following the target.
 *
 * @param {object} coin from planCoins
 * @param {boolean} [trail] the copy a tick behind
 * @return {object}
 */
export function coinEffect(coin, trail = false) {
	const at = trail ? coinTrailAt : coinAt;
	const size = (trail ? COIN.trailScale : COIN.scale) * 100;
	return {
		type: '3D',
		// 동전 (coin)
		spriteName: '\xb5\xbf\xc0\xfc',
		playSprite: true,
		sprDelay: PRIM_TICK_MS,
		alphaMax: 1,
		attachedEntity: true,
		duration: coin.life * PRIM_TICK_MS,
		zIndex: 1,
		track(age) {
			const p = at(coin, age);
			if (!p) {
				return null;
			}
			return {
				x: p.x / UNITS_PER_CELL,
				y: p.y / UNITS_PER_CELL,
				z: p.up / UNITS_PER_CELL,
				size,
				alpha: p.alpha / 255
			};
		}
	};
}

/** EffectTable row for 10. */
export const mammoniteEffect = [
	{
		//EF_COIN	Mammonite, on the target when the hit lands
		type: 'STR',
		file: 'maemor',
		min: 'memor_min',
		attachedEntity: true
	},
	{
		type: 'FUNC',
		attachedEntity: true,
		func: function (Params) {
			const startTick = Params.Inst.startTick + COIN.startTick * PRIM_TICK_MS;
			planCoins().forEach((coin, i) => {
				[false, true].forEach((trail, j) => {
					this.spamEffect({
						effect: coinEffect(coin, trail),
						Inst: { effectID: 10, duplicateID: i * 2 + j, startTick },
						Init: Params.Init
					});
				});
				coin.sounds.forEach(sound => {
					this.spamEffect({
						effect: { wav: sound.wav, attachedEntity: true },
						Inst: { effectID: 10, duplicateID: i, startTick: startTick + sound.tick * PRIM_TICK_MS },
						Init: Params.Init
					});
				});
			});
		}
	}
];
