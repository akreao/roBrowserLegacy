/**
 * DB/Effects/GunslingerBodyEffects.js
 *
 * Effect table entries for the Gunslinger body glows, spread into
 * EffectTable.js. Each makes its owner's own sprite glow while it lives
 * (BodyMotion.js), as the official client (kRO 2020-12-29) plays them.
 * Lifetimes are the client's, in ticks of 1/60 s. See
 * effect-port/gunslinger-skills.md.
 *
 * - 548 EF_RED_HIT (Fling, on the target): red glow fading in and out over 17 ticks;
 * - 625 EF_MADNESS_BLUE (Madness Canceller): blue glow on one tick in four, for 1 s;
 * - 626 EF_MADNESS_RED (Adjustment, Gatling Fever): the same in red.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import BodyMotion from 'Renderer/Effects/BodyMotion.js';

/**
 * The body glow of effect `effectId`, for `frames` ticks.
 *
 * @param {number} effectId
 * @param {number} frames
 * @return {object} effect table entry
 */
function bodyGlow(effectId, frames) {
	return {
		type: 'FUNC',
		attachedEntity: true,
		func: function (Params) {
			this.add(new BodyMotion(Params.Init.ownerEntity, Params.Inst.startTick, effectId, frames), Params);
		}
	};
}

export default {
	//EF_RED_HIT	Fling
	548: [bodyGlow(548, 60)],

	//EF_MADNESS_BLUE	Madness Canceller
	625: [bodyGlow(625, 60)],

	//EF_MADNESS_RED	Adjustment, Gatling Fever
	626: [bodyGlow(626, 60)]
};
