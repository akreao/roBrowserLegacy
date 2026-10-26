/**
 * DB/Effects/SandAttackEffect.js
 *
 * Effect 310 (EF_SPRINKLESAND), Sand Attack's sand, as the official client
 * draws it: 80 small additive grains rising from the ground around the target.
 * Motion in Renderer/Effects/SandGrainSim.js. Spec: effect-port/thief-skills.md.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { PRIM_TICK_MS, UNITS_PER_CELL } from 'Renderer/Effects/EffectPrimSim.js';
import { planGrains, grainAt, SAND_COLOR, SAND_LAST_TICK, SAND_TEXTURE } from 'Renderer/Effects/SandGrainSim.js';

/** roBrowser 3D size units across one official unit (35 to a cell). */
const SIZE_PER_UNIT = 35 / UNITS_PER_CELL;

/**
 * The 3D effect drawing one grain.
 *
 * @param {object} grain from planGrains
 * @return {object}
 */
export function sandGrainEffect(grain) {
	return {
		type: '3D',
		file: SAND_TEXTURE,
		blendMode: 2,
		red: SAND_COLOR[0],
		green: SAND_COLOR[1],
		blue: SAND_COLOR[2],
		alphaMax: 1,
		attachedEntity: false,
		duration: (SAND_LAST_TICK + 1) * PRIM_TICK_MS,
		zIndex: 1,
		track(age) {
			const p = grainAt(grain, age);
			if (!p) {
				return null;
			}
			return {
				x: p.x / UNITS_PER_CELL,
				y: p.y / UNITS_PER_CELL,
				z: p.up / UNITS_PER_CELL,
				size: 2 * p.half * SIZE_PER_UNIT,
				alpha: p.alpha / 255,
				angle: p.angle
			};
		}
	};
}

/** EffectTable row for 310. */
export const sandAttackEffect = [
	{
		//EF_SPRINKLESAND	Sand Attack, on the target as the damage packet arrives
		type: 'FUNC',
		attachedEntity: true,
		func: function (Params) {
			const target = Params.Init.ownerEntity.position;
			const at = [target[0], target[1], target[2]];
			planGrains().forEach((grain, i) => {
				this.spamEffect({
					effect: sandGrainEffect(grain),
					Inst: { effectID: 310, duplicateID: i, startTick: Params.Inst.startTick },
					Init: Object.assign({}, Params.Init, { position: at })
				});
			});
		}
	}
];
