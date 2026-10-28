/**
 * DB/Effects/CloseConfineEffect.js
 *
 * Effect table entries for Close Confine (RG_CLOSECONFINE), spread into
 * EffectTable.js, as the official client (kRO 2020-12-29) plays them. See
 * effect-port/rogue-skills.md.
 *
 * - 602 EF_QUAKEBODY4, on the target when the skill works, for 60 ticks:
 *   ef_hit6.wav on tick 20; after tick 20 the target's body quakes
 *   (BodyMotion.js) and flickers red (250, 50, 50) on even ticks and white on
 *   odd ones (CasterMarks.js).
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import BodyMotion from 'Renderer/Effects/BodyMotion.js';
import CasterMarks from 'Renderer/Effects/CasterMarks.js';
import { PRIM_TICK_MS } from 'Renderer/Effects/EffectPrimSim.js';

/** Lifetime of 602 in ticks of 1/60 s. */
const FRAMES = 60;

export default {
	602: [
		{
			//EF_QUAKEBODY4	Close Confine, on the target
			wav: 'effect/ef_hit6',
			delayWav: Math.round(20 * PRIM_TICK_MS),
			attachedEntity: true
		},
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				this.add(new BodyMotion(Params.Init.ownerEntity, Params.Inst.startTick, 602, FRAMES), Params);
			}
		},
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				this.add(new CasterMarks(Params.Init.ownerEntity, Params.Inst.startTick, FRAMES, 602), Params);
			}
		}
	]
};
