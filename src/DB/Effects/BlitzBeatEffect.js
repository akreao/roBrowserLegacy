/**
 * DB/Effects/BlitzBeatEffect.js
 *
 * Effect 115 (EF_BLITZBEAT), Blitz Beat's hit on its target, as the official
 * client draws it (kRO 2025-07-16, 0xba4960): 10 ac_center2.tga streaks at
 * once, then from tick 36 one magic_green cone band every 3 ticks for each
 * hit of the damage packet, and two sounds. Numbers in BlitzBeatSim.js.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { PRIM_TICK_MS, facingAngle } from 'Renderer/Effects/EffectPrimSim.js';
import { CONE, SOUNDS, coneTicks } from 'Renderer/Effects/BlitzBeatSim.js';
import BlitzStreaks from 'Renderer/Effects/BlitzStreaks.js';

const r = (random, k) => Math.floor(random() * k);

/**
 * One cone band. The client turns it by the target's facing angle, lays it
 * level, places it 0-2 whole units along the map's x and raises it 1-11.
 *
 * @param {number} yaw degrees, the target's facing angle
 * @param {function} [random] returns a number in [0, 1)
 * @return {object} PRIM effect description
 */
export function blitzBeatBand(yaw, random = Math.random) {
	return {
		type: 'PRIM',
		prim: 'cone',
		texture: 'magic_green',
		attachedEntity: true,
		duration: CONE.life * PRIM_TICK_MS,
		frames: CONE.life,
		yaw: yaw,
		pitch: -90,
		offsetX: Math.floor((r(random, 10) + 1) / 5),
		// 12 - (r + 1) / 2 up, and one unit back down along the tilted axis
		height: 11 - Math.floor((r(random, 20) + 1) / 2),
		baseRadius: 0.5,
		topRadius: 1.5,
		coneHeight: 3.5,
		driftStart: 2,
		drift: 0.4,
		driftAccel: -(0.4 / CONE.life) * 0.5,
		fadeOutFrame: CONE.life / 2
	};
}

/** EffectTable rows for 115. The damage packet's hit count arrives as Params.Init.hitCount. */
export const blitzBeatEffect = [
	{
		//EF_BLITZBEAT	streaks and one cone band per hit (official primitives 16 and 13)
		type: 'FUNC',
		attachedEntity: true,
		func: function (Params) {
			const owner = Params.Init.ownerEntity;
			const start = Params.Inst.startTick;
			this.add(new BlitzStreaks(owner, start), Params);
			const yaw = facingAngle(owner && owner.direction);
			coneTicks(Params.Init.hitCount).forEach((tick, i) => {
				this.spamEffect({
					effect: blitzBeatBand(yaw),
					Inst: { effectID: 115, duplicateID: i, startTick: start + tick * PRIM_TICK_MS },
					Init: Params.Init
				});
			});
		}
	},
	...SOUNDS.map(sound => ({
		wav: sound.wav,
		delayWav: sound.tick * PRIM_TICK_MS,
		attachedEntity: true
	}))
];
