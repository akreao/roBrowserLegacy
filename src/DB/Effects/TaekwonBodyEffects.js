/**
 * DB/Effects/TaekwonBodyEffects.js
 *
 * Effect table entries for the Taekwon body effects, spread into
 * EffectTable.js. Each changes how its owner's own sprite is drawn while it
 * lives (BodyMotion.js), some with a sound, as the official client (kRO
 * 2020-12-29) plays them. Lifetimes are the client's, in ticks of 1/60 s.
 *
 * - 413 EF_PRESSEDBODY (Heel Drop): sound at tick 5, pressed from tick 17;
 * - 414 EF_SPINEDBODY (Roundhouse splash, sent by the server): fast spin;
 * - 415 EF_KICKEDBODY (Counter Kick): two hit sounds, kicked up from tick 30;
 * - 458 EF_QUAKEBODY2 (Flying Kick): quake;
 * - 449 EF_TAE_READY (stances, Tumbling): blue glow;
 * - 466 EF_SPINEDBODY2 (Roundhouse): sound at tick 5, spin from tick 14;
 * - 1224 (Prominence Kick, on the target as the damage arrives; kRO 2025-07-16
 *   case 0xbc0798): mon_침투경.wav at tick 5, then the same spin from tick 14.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import BodyMotion from 'Renderer/Effects/BodyMotion.js';
import { PRIM_TICK_MS } from 'Renderer/Effects/EffectPrimSim.js';

/** Start of tick `n` of an effect, in ms. */
const at = n => Math.round(n * PRIM_TICK_MS);

/**
 * The body motion of effect `effectId`, for `frames` ticks.
 *
 * @param {number} effectId
 * @param {number} frames
 * @return {object} effect table entry
 */
function bodyMotion(effectId, frames) {
	return {
		type: 'FUNC',
		attachedEntity: true,
		func: function (Params) {
			this.add(new BodyMotion(Params.Init.ownerEntity, Params.Inst.startTick, effectId, frames), Params);
		}
	};
}

export default {
	413: [
		{
			//EF_PRESSEDBODY	Heel Drop
			wav: 'effect/t_\xb3\xbb\xb7\xc1\xc2\xef\xb1\xe2', // t_내려찍기
			delayWav: at(5),
			attachedEntity: true
		},
		bodyMotion(413, 50)
	],

	//EF_SPINEDBODY	Roundhouse (splash targets)
	414: [bodyMotion(414, 50)],

	415: [
		{
			//EF_KICKEDBODY	Counter Kick
			wav: 'effect/ef_hit2',
			delayWav: at(17),
			attachedEntity: true
		},
		{
			wav: 'effect/ef_hit4',
			delayWav: at(25),
			attachedEntity: true
		},
		bodyMotion(415, 100)
	],

	//EF_TAE_READY	Taekwon stances, Tumbling
	449: [bodyMotion(449, 60)],

	//EF_QUAKEBODY2	Flying Kick
	458: [bodyMotion(458, 35)],

	466: [
		{
			//EF_SPINEDBODY2	Roundhouse
			wav: 'effect/t_\xb5\xb9\xb7\xc1\xc2\xf7\xb1\xe2', // t_돌려차기
			delayWav: at(5),
			attachedEntity: true
		},
		bodyMotion(466, 50)
	],

	1224: [
		{
			// Prominence Kick
			wav: 'effect/mon_\xc4\xa7\xc5\xf5\xb0\xe6', // mon_침투경
			delayWav: at(5),
			attachedEntity: true
		},
		bodyMotion(1224, 50)
	]
};
