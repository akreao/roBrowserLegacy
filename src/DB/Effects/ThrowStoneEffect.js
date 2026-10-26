/**
 * DB/Effects/ThrowStoneEffect.js
 *
 * Effect 308 (EF_THROWITEM3), Throw Stone's stone, as the official client draws
 * it: thrown from the caster at the target's position as the damage packet
 * arrives, in a low arc, spinning, with three fainter copies trailing it.
 * Motion in Renderer/Effects/ThrownStoneSim.js. Spec: effect-port/thief-skills.md.
 * Effect 600 (EF_THROWITEM6), Throw Venom Knife's knife, is the same flight with
 * the knife's numbers (VENOM_KNIFE). Spec: effect-port/assassin-skills.md.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { PRIM_TICK_MS, UNITS_PER_CELL } from 'Renderer/Effects/EffectPrimSim.js';
import { STONE, VENOM_KNIFE, planThrow, stoneAt, trailAt } from 'Renderer/Effects/ThrownStoneSim.js';

/** roBrowser 3D size units across one official unit (35 to a cell). */
const SIZE_PER_UNIT = 35 / UNITS_PER_CELL;

/**
 * Last update the stone shows: it stops after floor(1.05 n) updates, then fades 20 a tick.
 *
 * @param {object} t from planThrow
 * @return {number}
 */
export function lastStoneTick(t) {
	const kind = t.kind || STONE;
	return Math.floor(kind.moveUntil * t.ticks) + Math.ceil(255 / kind.fade);
}

/**
 * The 3D effect drawing the stone (copy -1) or trailing copy i.
 *
 * @param {object} t from planThrow, in units from the caster
 * @param {number} copy
 * @return {object}
 */
export function stoneEffect(t, copy) {
	const kind = t.kind || STONE;
	const tint = kind.tint || [255, 255, 255];
	return {
		type: '3D',
		file: kind.texture,
		red: tint[0] / 255,
		green: tint[1] / 255,
		blue: tint[2] / 255,
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
				size: 2 * kind.half * SIZE_PER_UNIT,
				alpha: p.alpha / 255,
				angle: p.angle
			};
		}
	};
}

/**
 * EffectTable rows for a thrown item, from the caster at the target as the
 * damage packet arrives.
 *
 * @param {number} effectId
 * @param {object} kind STONE or VENOM_KNIFE
 * @return {Array<object>}
 */
function thrownItemEffect(effectId, kind) {
	return [
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
				const t = planThrow(
					[0, 0, 0],
					[0, 1, 2].map(i => (target[i] - caster[i]) * UNITS_PER_CELL),
					kind
				);
				[-1, 0, 1, 2].forEach((copy, i) => {
					this.spamEffect({
						effect: stoneEffect(t, copy),
						Inst: { effectID: effectId, duplicateID: i, startTick: Params.Inst.startTick },
						Init: Object.assign({}, Params.Init, { position: at })
					});
				});
			}
		}
	];
}

/** EffectTable row for 308 (EF_THROWITEM3): Throw Stone's stone. */
export const throwStoneEffect = thrownItemEffect(308, STONE);

/** EffectTable row for 600 (EF_THROWITEM6): Throw Venom Knife's knife. */
export const throwVenomKnifeEffect = thrownItemEffect(600, VENOM_KNIFE);
