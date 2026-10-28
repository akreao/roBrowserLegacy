/**
 * DB/Effects/RapidSmitingEffect.js
 *
 * Effect 520 (EF_SHIELDBOOMERANG3), Rapid Smiting's shields, as the official
 * client draws it: on the target as the damage packet arrives,
 * cru_shield boomerang.wav and five spinning shields, 3 ticks apart, each
 * flying in from a random side through the target with three fainter copies
 * trailing it. Motion in Renderer/Effects/RapidSmitingSim.js. Spec:
 * effect-port/paladin-skills.md.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { PRIM_TICK_MS, UNITS_PER_CELL } from 'Renderer/Effects/EffectPrimSim.js';
import { trailAt } from 'Renderer/Effects/ShieldBoomerangSim.js';
import {
	SMITE,
	SMITE_TEXTURE,
	launchTick,
	planShield,
	randomHeading,
	shieldAt
} from 'Renderer/Effects/RapidSmitingSim.js';

/** roBrowser 3D size units across one official unit (35 to a cell). */
const SIZE_PER_UNIT = 35 / UNITS_PER_CELL;

/**
 * The 3D effect drawing one shield (copy -1) or its trailing copy i.
 *
 * @param {object} plan from planShield, in units from the target
 * @param {number} start effect tick the shield is launched on
 * @param {number} copy
 * @return {object}
 */
export function smiteShieldEffect(plan, start, copy) {
	return {
		type: '3D',
		file: SMITE_TEXTURE,
		alphaMax: 1,
		attachedEntity: false,
		duration: (start + plan.last + 1) * PRIM_TICK_MS,
		zIndex: 1,
		track(age) {
			const k = Math.floor(age) - start;
			if (k < 0) {
				return null;
			}
			const p = copy < 0 ? shieldAt(plan, k) : trailAt(plan, copy, k);
			if (!p || p.alpha < 1) {
				return null;
			}
			return {
				x: p.x / UNITS_PER_CELL,
				y: p.y / UNITS_PER_CELL,
				z: p.up / UNITS_PER_CELL,
				size: 2 * SMITE.half * SIZE_PER_UNIT,
				alpha: p.alpha / 255,
				angle: p.angle
			};
		}
	};
}

/** EffectTable row for 520. */
export const rapidSmitingEffect = [
	{
		//EF_SHIELDBOOMERANG3	Rapid Smiting, on the target as the damage packet arrives
		wav: 'effect/cru_shield boomerang',
		attachedEntity: true
	},
	{
		type: 'FUNC',
		attachedEntity: true,
		func: function (Params) {
			const target = Params.Init.ownerEntity && Params.Init.ownerEntity.position;
			if (!target) {
				return;
			}
			const at = [target[0], target[1], target[2]];
			for (let i = 0; i < SMITE.count; i++) {
				const plan = planShield(randomHeading());
				[-1, 0, 1, 2].forEach((copy, c) => {
					this.spamEffect({
						effect: smiteShieldEffect(plan, launchTick(i), copy),
						Inst: { effectID: 520, duplicateID: i * 4 + c, startTick: Params.Inst.startTick },
						Init: Object.assign({}, Params.Init, { position: at })
					});
				});
			}
		}
	}
];
