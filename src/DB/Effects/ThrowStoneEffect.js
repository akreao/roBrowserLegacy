/**
 * DB/Effects/ThrowStoneEffect.js
 *
 * Effect 308 (EF_THROWITEM3), Throw Stone's stone, as the official client draws
 * it: thrown from the caster at the target's position as the damage packet
 * arrives, in a low arc, spinning, with three fainter copies trailing it.
 * Motion in Renderer/Effects/ThrownStoneSim.js. Spec: effect-port/thief-skills.md.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { PRIM_TICK_MS, UNITS_PER_CELL } from 'Renderer/Effects/EffectPrimSim.js';
import { STONE, STONE_TEXTURE, planThrow, stoneAt, trailAt } from 'Renderer/Effects/ThrownStoneSim.js';

/** roBrowser 3D size units across one official unit (35 to a cell). */
const SIZE_PER_UNIT = 35 / UNITS_PER_CELL;

/**
 * Last update the stone shows: it stops after floor(1.05 n) updates, then fades 20 a tick.
 *
 * @param {object} t from planThrow
 * @return {number}
 */
export function lastStoneTick(t) {
	return Math.floor(STONE.moveUntil * t.ticks) + Math.ceil(255 / STONE.fade);
}

/**
 * The 3D effect drawing the stone (copy -1) or trailing copy i.
 *
 * @param {object} t from planThrow, in units from the caster
 * @param {number} copy
 * @return {object}
 */
export function stoneEffect(t, copy) {
	return {
		type: '3D',
		file: STONE_TEXTURE,
		alphaMax: 1,
		attachedEntity: false,
		duration: (lastStoneTick(t) + 1) * PRIM_TICK_MS,
		zIndex: 1,
		track(age) {
			const k = Math.floor(age);
			const p = copy < 0 ? stoneAt(t, k) : trailAt(t, copy, k);
			if (!p || p.alpha < 1) {
				return null;
			}
			return {
				x: p.x / UNITS_PER_CELL,
				y: p.y / UNITS_PER_CELL,
				z: p.up / UNITS_PER_CELL,
				size: 2 * STONE.half * SIZE_PER_UNIT,
				alpha: p.alpha / 255,
				angle: p.angle
			};
		}
	};
}

/** EffectTable row for 308. */
export const throwStoneEffect = [
	{
		//EF_THROWITEM3	Throw Stone, from the caster at the target as the damage packet arrives
		type: 'FUNC',
		attachedEntity: true,
		func: function (Params) {
			const caster = Params.Init.ownerEntity.position;
			const target = Params.Init.otherEntity && Params.Init.otherEntity.position;
			if (!target) {
				return;
			}
			const at = [caster[0], caster[1], caster[2]];
			const t = planThrow(
				[0, 0, 0],
				[0, 1, 2].map(i => (target[i] - caster[i]) * UNITS_PER_CELL)
			);
			[-1, 0, 1, 2].forEach((copy, i) => {
				this.spamEffect({
					effect: stoneEffect(t, copy),
					Inst: { effectID: 308, duplicateID: i, startTick: Params.Inst.startTick },
					Init: Object.assign({}, Params.Init, { position: at })
				});
			});
		}
	}
];
