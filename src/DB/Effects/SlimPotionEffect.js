/**
 * DB/Effects/SlimPotionEffect.js
 *
 * The official client's Slim Potion Pitcher potions, 497-499 (EF_SLIM,
 * EF_SLIM2, EF_SLIM3): a red, yellow or white slim potion falling onto the
 * target cell from the ground packet, with three fainter copies trailing.
 * Motion in Renderer/Effects/SlimPotionSim.js. Spec: effect-port/creator-skills.md.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { PRIM_TICK_MS, UNITS_PER_CELL } from 'Renderer/Effects/EffectPrimSim.js';
import { HALF_SIZE, LAST_UPDATE, SLIM_POTIONS, potionAt, trailAt } from 'Renderer/Effects/SlimPotionSim.js';

/** roBrowser 3D size units across one official unit (35 to a cell). */
const SIZE_PER_UNIT = 35 / UNITS_PER_CELL;

/**
 * The 3D effect drawing the potion (copy 0) or trailing copy 1-3.
 *
 * @param {number} effectID 497-499
 * @param {number} roll starting roll, degrees
 * @param {number} copy
 * @return {object}
 */
export function slimPotionPart(effectID, roll, copy) {
	const potion = SLIM_POTIONS[effectID];
	return {
		type: '3D',
		file: potion.texture,
		alphaMax: 1,
		attachedEntity: false,
		duration: (LAST_UPDATE + 1) * PRIM_TICK_MS,
		zIndex: 1,
		red: potion.color[0] / 255,
		green: potion.color[1] / 255,
		blue: potion.color[2] / 255,
		track(age) {
			// The client updates before drawing, so the first frame shows update 1.
			const k = Math.floor(age) + 1;
			const p = copy ? trailAt(roll, copy, k) : potionAt(roll, k);
			if (!p || p.alpha < 1) {
				return null;
			}
			return {
				x: 0,
				y: 0,
				z: p.up / UNITS_PER_CELL,
				size: 2 * HALF_SIZE * SIZE_PER_UNIT,
				alpha: p.alpha / 255,
				angle: p.angle
			};
		}
	};
}

/**
 * EffectTable row for 497, 498 or 499. The ground packet's sound
 * (assulter_attack.wav) rides on it, as only one of them plays per packet.
 *
 * @param {number} effectID
 * @return {Array}
 */
function slimPotionRow(effectID) {
	return [
		{
			type: 'FUNC',
			attachedEntity: false,
			wav: 'assulter_attack',
			func: function (Params) {
				const at = Params.Inst.position;
				const roll = Math.floor(Math.random() * 360);
				[0, 1, 2, 3].forEach(copy => {
					this.spamEffect({
						effect: slimPotionPart(effectID, roll, copy),
						Inst: { effectID, duplicateID: copy, startTick: Params.Inst.startTick },
						Init: Object.assign({}, Params.Init, { position: [at[0], at[1], at[2]] })
					});
				});
			}
		}
	];
}

/** EffectTable rows for 497-499. */
export const slimPotionEffects = {
	497: slimPotionRow(497),
	498: slimPotionRow(498),
	499: slimPotionRow(499)
};
