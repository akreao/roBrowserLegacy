/**
 * DB/Effects/EnergyDrainEffect.js
 *
 * Effects 1207 and 1208 (EF_ENERGYDRAIN_BLACK) as the official client draws
 * them on an actor: particle1 souls bursting out and coming back, then a blue
 * tint on the actor. Kaute plays 1208 on the caster and 1207 on the target,
 * Soul Explosion 1208 on the target. Numbers in
 * Renderer/Effects/EnergyDrainSim.js.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { PRIM_TICK_MS, UNITS_PER_CELL } from 'Renderer/Effects/EffectPrimSim.js';
import { soulAt } from 'Renderer/Effects/SoulStrikeSim.js';
import { DRAIN, planDrain, drainTrailLook, drainTint } from 'Renderer/Effects/EnergyDrainSim.js';

/**
 * The 3D effect drawing step `i` of a drain soul's trail (0 the soul itself).
 *
 * @param {object} soul from planDrain
 * @param {number} i
 * @return {object}
 */
export function drainTrailEffect(soul, i) {
	const look = drainTrailLook(soul.scale, i);
	const shade = soul.shade / 255;
	return {
		type: '3D',
		spriteName: 'particle1',
		alphaMax: 1,
		red: shade,
		green: shade,
		blue: shade,
		attachedEntity: false,
		duration: DRAIN.life * PRIM_TICK_MS,
		zIndex: 1,
		track(age) {
			const k = Math.floor(age);
			// The client updates before it draws: k + 1 updates; the trail lags i of them.
			const n = k + 1 - i;
			if (k < 0 || k >= DRAIN.life || n < 1) {
				return null;
			}
			// No distance to cover: the soul goes out and comes back.
			const p = soulAt(soul, soul.dir, 0, n, DRAIN);
			return {
				x: p.x / UNITS_PER_CELL,
				y: p.y / UNITS_PER_CELL,
				z: p.up / UNITS_PER_CELL,
				size: look.scale * 100,
				alpha: look.alpha / 255
			};
		}
	};
}

/**
 * Tint an entity blue on ticks 50 to 80 of the effect, through its flash
 * colour, then let it come back.
 *
 * @param {Entity} entity
 */
export function startDrainTint(entity) {
	if (!entity || !entity.animations || !entity._flashColor) {
		return;
	}
	entity.animations.add(tick => {
		const [r, g, b] = drainTint(Math.floor(tick / PRIM_TICK_MS));
		entity._flashColor[0] = r;
		entity._flashColor[1] = g;
		entity._flashColor[2] = b;
		entity._flashColor[3] = 1.0;
		entity.recalculateBlendingColor();
		return r >= 1 && g >= 1 && b >= 1;
	});
}

/**
 * EffectTable rows for 1207 or 1208.
 *
 * @param {number} effectId
 * @return {Array}
 */
export function energyDrainEffect(effectId) {
	return [
		{
			//EF_ENERGYDRAIN (1207) / EF_ENERGYDRAIN_BLACK (1208): souls out and back, then a blue tint (kRO 2025 0xbe73a0)
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				planDrain(effectId).forEach((soul, s) => {
					for (let i = 0; i < DRAIN.trail; i++) {
						this.spamEffect({
							effect: drainTrailEffect(soul, i),
							Inst: {
								effectID: effectId,
								duplicateID: s * DRAIN.trail + i,
								startTick: Params.Inst.startTick + soul.spawn * PRIM_TICK_MS
							},
							Init: Params.Init
						});
					}
				});
				startDrainTint(Params.Init.ownerEntity);
			}
		}
	];
}
