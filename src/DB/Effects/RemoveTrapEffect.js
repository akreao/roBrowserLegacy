/**
 * DB/Effects/RemoveTrapEffect.js
 *
 * Effect 100 (EF_REMOVETRAP) as the official client draws it at the trap:
 * hunter_removetrap.wav and two bursts of 12 particle1 sprites thrown up and
 * out like a fountain. Motion in Renderer/Effects/RemoveTrapSim.js.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { PRIM_TICK_MS, UNITS_PER_CELL } from 'Renderer/Effects/EffectPrimSim.js';
import { FOUNTAIN, planFountain, particleAt } from 'Renderer/Effects/RemoveTrapSim.js';

/**
 * The 3D effect drawing one particle. It starts on its burst's tick.
 *
 * @param {object} particle from planFountain
 * @return {object}
 */
export function fountainParticleEffect(particle) {
	return {
		type: '3D',
		spriteName: 'particle1',
		alphaMax: 1,
		attachedEntity: false,
		duration: FOUNTAIN.life * PRIM_TICK_MS,
		zIndex: 1,
		track(age) {
			const p = particleAt(particle, age);
			if (!p) {
				return null;
			}
			return {
				x: p.x / UNITS_PER_CELL,
				y: p.y / UNITS_PER_CELL,
				z: p.up / UNITS_PER_CELL,
				size: p.scale * 100,
				alpha: p.alpha / 255
			};
		}
	};
}

/** EffectTable rows for 100. */
export const removeTrapEffect = [
	{
		//EF_REMOVETRAP	Remove Trap: a fountain of particle1 sprites at the trap (kRO 2025 0xbcf7b0)
		type: 'FUNC',
		attachedEntity: false,
		func: function (Params) {
			planFountain().forEach((particle, i) => {
				this.spamEffect({
					effect: fountainParticleEffect(particle),
					Inst: {
						effectID: 100,
						duplicateID: i,
						startTick: Params.Inst.startTick + particle.spawn * PRIM_TICK_MS
					},
					Init: Params.Init
				});
			});
		}
	},
	{
		wav: 'effect/hunter_removetrap',
		attachedEntity: false
	}
];
