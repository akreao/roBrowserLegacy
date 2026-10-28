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
 * Where a shield flies through: the target's position on the tick the shield
 * is launched, taken once (by whichever of its four sprites draws first) and
 * kept for its flight, as the client does.
 *
 * @param {?object} entity the target
 * @param {number[]} base the sprites' position (the target's at packet arrival)
 * @return {object}
 */
export function launchCentre(entity, base) {
	return {
		at: null,
		offset() {
			if (!this.at) {
				const p = entity && entity.position ? entity.position : base;
				this.at = [p[0] - base[0], p[1] - base[1], p[2] - base[2]];
			}
			return this.at;
		}
	};
}

/**
 * The 3D effect drawing one shield (copy -1) or its trailing copy i.
 *
 * @param {object} plan from planShield, in units from the target
 * @param {number} start effect tick the shield is launched on
 * @param {number} copy
 * @param {?object} [centre] from launchCentre; without it the shield flies through the sprites' position
 * @return {object}
 */
export function smiteShieldEffect(plan, start, copy, centre = null) {
	return {
		type: '3D',
		file: SMITE_TEXTURE,
		sharedTexture: true,
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
			const o = centre ? centre.offset() : [0, 0, 0];
			return {
				x: o[0] + p.x / UNITS_PER_CELL,
				y: o[1] + p.y / UNITS_PER_CELL,
				z: o[2] + p.up / UNITS_PER_CELL,
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
			const entity = Params.Init.ownerEntity;
			const target = entity && entity.position;
			if (!target) {
				return;
			}
			const at = [target[0], target[1], target[2]];
			for (let i = 0; i < SMITE.count; i++) {
				const plan = planShield(randomHeading());
				const centre = launchCentre(entity, at);
				[-1, 0, 1, 2].forEach((copy, c) => {
					this.spamEffect({
						effect: smiteShieldEffect(plan, launchTick(i), copy, centre),
						Inst: { effectID: 520, duplicateID: i * 4 + c, startTick: Params.Inst.startTick },
						Init: Object.assign({}, Params.Init, { position: at })
					});
				});
			}
		}
	}
];
