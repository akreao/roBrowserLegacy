/**
 * DB/Effects/SoulBodyEffects.js
 *
 * Effect table entries for the Soul Linker and Star Gladiator body looks,
 * spread into EffectTable.js. Each changes how its owner's own sprite is drawn
 * while it lives (BodyMotion.js), as the official client (kRO 2025-07-16)
 * draws a player. Lifetimes are the client's, in ticks of 1/60 s.
 *
 * - 419 EF_REFLECTBODY (Kaite): body drawn at alpha 150 with four growing,
 *   fading copies around it; lasts until removed (the Kaite status, below);
 * - 424 EF_ASURABODY (Soul Link: Soul Linker spirits, Soul Reaper souls): link
 *   glow fading in over 200 ticks; lasts until the status ends;
 * - 488 EF_FLOWERCAST (Comfort): T_안락한마법.wav on tick 5 and the link glow
 *   up and down over its 400 ticks (its two rings, prim 108, not drawn yet);
 * - 542 EF_BLUEBODY (Kaupe, Kaite): blue glow over 150 ticks, lives 200;
 * - 543 EF_HATED (Kaahi, Kaizel, Comfort, Hatred): blue glow over 175 ticks,
 *   lives 500 (its prim 59 sparks are not drawn yet).
 *
 * 427 EF_ASURABODY_MONSTER (Eske) also sets the link flag, but on a player
 * it leaves the glow's alpha at whatever an earlier effect put there, so it is
 * not drawn.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import BodyMotion from 'Renderer/Effects/BodyMotion.js';
import { PRIM_TICK_MS } from 'Renderer/Effects/EffectPrimSim.js';

/**
 * The body look of effect `effectId`, for `frames` ticks.
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
	//EF_REFLECTBODY	Kaite
	419: [bodyMotion(419, Infinity)],

	//EF_ASURABODY	Soul Link
	424: [bodyMotion(424, Infinity)],

	488: [
		{
			//EF_FLOWERCAST	Comfort
			wav: 'effect/t_\xbe\xc8\xb6\xf4\xc7\xd1\xb8\xb6\xb9\xfd', // t_안락한마법
			delayWav: Math.round(5 * PRIM_TICK_MS),
			attachedEntity: true
		},
		bodyMotion(488, 400)
	],

	//EF_BLUEBODY	Kaupe, Kaite
	542: [bodyMotion(542, 200)],

	//EF_HATED	Kaahi, Kaizel, Comfort, Hatred
	543: [bodyMotion(543, 500)]
};
