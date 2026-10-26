/**
 * DB/Effects/ShieldBoomerangEffect.js
 *
 * Effect 249 (EF_SHIELDBOOMERANG), Shield Boomerang's shield, as the official
 * client draws it: thrown from the caster at the target's position as the
 * damage packet arrives, spinning, it flies out, swings round and comes back
 * fading, with three fainter copies trailing it. Motion in
 * Renderer/Effects/ShieldBoomerangSim.js. Spec: effect-port/crusader-skills.md.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { PRIM_TICK_MS, UNITS_PER_CELL } from 'Renderer/Effects/EffectPrimSim.js';
import { SHIELD, SHIELD_TEXTURE, planBoomerang, shieldAt, trailAt } from 'Renderer/Effects/ShieldBoomerangSim.js';

/** roBrowser 3D size units across one official unit (35 to a cell). */
const SIZE_PER_UNIT = 35 / UNITS_PER_CELL;

/**
 * The 3D effect drawing the shield (copy -1) or trailing copy i.
 *
 * @param {object} plan from planBoomerang, in units from the caster
 * @param {number} copy
 * @return {object}
 */
export function shieldEffect(plan, copy) {
	return {
		type: '3D',
		file: SHIELD_TEXTURE,
		alphaMax: 1,
		attachedEntity: false,
		duration: (plan.last + 1) * PRIM_TICK_MS,
		zIndex: 1,
		track(age) {
			const k = Math.floor(age);
			const p = copy < 0 ? shieldAt(plan, k) : trailAt(plan, copy, k);
			if (!p || p.alpha < 1) {
				return null;
			}
			return {
				x: p.x / UNITS_PER_CELL,
				y: p.y / UNITS_PER_CELL,
				z: p.up / UNITS_PER_CELL,
				size: 2 * SHIELD.half * SIZE_PER_UNIT,
				alpha: p.alpha / 255,
				angle: p.angle
			};
		}
	};
}

/** EffectTable row for 249. */
export const shieldBoomerangEffect = [
	{
		//EF_SHIELDBOOMERANG	Shield Boomerang, from the caster at the target as the damage packet arrives
		wav: 'effect/cru_shield boomerang',
		attachedEntity: true
	},
	{
		type: 'FUNC',
		attachedEntity: true,
		func: function (Params) {
			const caster = Params.Init.ownerEntity.position;
			const target = Params.Init.otherEntity && Params.Init.otherEntity.position;
			if (!target) {
				return;
			}
			const at = [caster[0], caster[1], caster[2]];
			const plan = planBoomerang(
				[0, 0, 0],
				[0, 1, 2].map(i => (target[i] - caster[i]) * UNITS_PER_CELL)
			);
			[-1, 0, 1, 2].forEach((copy, i) => {
				this.spamEffect({
					effect: shieldEffect(plan, copy),
					Inst: { effectID: 249, duplicateID: i, startTick: Params.Inst.startTick },
					Init: Object.assign({}, Params.Init, { position: at })
				});
			});
		}
	}
];
