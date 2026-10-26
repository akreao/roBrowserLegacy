/**
 * DB/Effects/SonicBlowEffect.js
 *
 * Effect 122 (EF_SONICBLOWHIT), Sonic Blow's hit, as the official client draws
 * it: assasin_sonicblow.wav and one magic_red cone band (official primitive
 * 13) opening the way the target faces, 12 ticks. Spec: effect-port/assassin-skills.md.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { PRIM_TICK_MS } from 'Renderer/Effects/EffectPrimSim.js';

const r = (random, k) => Math.floor(random() * k);

/**
 * The cone band of one Sonic Blow hit. The client places it 0-2 whole units
 * along the map's x from the target and raises it 1-11 whole units, at random.
 *
 * @param {function} [random] returns a number in [0, 1)
 * @return {object} PRIM effect description
 */
export function sonicBlowHitBand(random = Math.random) {
	return {
		type: 'PRIM',
		prim: 'cone',
		texture: 'magic_red',
		attachedEntity: true,
		duration: 12 * PRIM_TICK_MS,
		frames: 12,
		facing: true,
		pitch: -90,
		offsetX: Math.floor((r(random, 10) + 1) / 4),
		height: 11 - Math.floor((r(random, 20) + 1) / 2),
		baseRadius: 4,
		topRadius: 7,
		coneHeight: 3.5,
		driftStart: 2,
		drift: 0.4,
		driftAccel: -(0.4 / 12) * 0.5,
		fadeOutFrame: 6
	};
}

/** EffectTable rows for 122. */
export const sonicBlowHitEffect = [
	{
		//EF_SONICBLOWHIT	one magic_red cone band on the target (official primitive 13)
		type: 'FUNC',
		attachedEntity: true,
		func: function (Params) {
			this.spamEffect({
				effect: sonicBlowHitBand(),
				Inst: { effectID: 122, duplicateID: 0, startTick: Params.Inst.startTick },
				Init: Params.Init
			});
		}
	},
	{
		wav: 'effect/assasin_sonicblow',
		attachedEntity: true
	}
];
