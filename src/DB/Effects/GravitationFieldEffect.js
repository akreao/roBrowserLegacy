/**
 * DB/Effects/GravitationFieldEffect.js
 *
 * Effect 522 (EF_GRAVITATION), Gravitation Field's look, as the official
 * client (kRO 2025-07-16) plays it: a 5 x 5 grid of faint stone and ice spikes
 * shuddering out of the ground, and one screen shake (GravitationField.js,
 * GravitationFieldSim.js). Spec: effect-port/gravitation-field.md.
 *
 *  - Each Gravitation Field skill unit (0xb8) plays 522 on its cell once, when
 *    it appears. rAthena sends one unit a cell of the 5 x 5 field, so 25 copies
 *    overlap; their faint alpha adds up to the field's look.
 *  - The ground packet plays wizard_earthspike.wav at the cell at once, and 522
 *    there 260 ms later.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import Camera from 'Renderer/Camera.js';
import GravitationField from 'Renderer/Effects/GravitationField.js';
import { GRAVITATION, GRAVITATION_TICK_MS, planGravitation } from 'Renderer/Effects/GravitationFieldSim.js';

/**
 * Every copy asks for the shake, but the client's shake is one shake, not a sum:
 * a shake asked for within this many ms of the last one is the same shake.
 */
const SHAKE_SAME_MS = 100;
let _lastShake = -Infinity;

/**
 * Start the screen shake, once for copies that start together
 *
 * @param {number} tick
 */
export function shakeOnce(tick) {
	if (Math.abs(tick - _lastShake) < SHAKE_SAME_MS) {
		return;
	}
	_lastShake = tick;
	Camera.setQuake(tick);
}

/**
 * A row playing effect 522 at the effect's position
 *
 * @param {number} delay ms after the effect starts
 * @param {number} length the effect's length in ticks
 * @return {object} effect table row
 */
function gravitationRow(delay, length) {
	return {
		type: 'FUNC',
		attachedEntity: false,
		duration: delay + length * GRAVITATION_TICK_MS,
		func: function (Params) {
			const start = Params.Inst.startTick + delay;
			const at = Params.Inst.position;
			shakeOnce(start);
			this.add(new GravitationField([at[0], at[1], at[2]], start, planGravitation(), length), Params);
		}
	};
}

/** EffectTable row for 522: a Gravitation Field skill unit's copy, played once (units are spawned persistent). */
export const gravitationFieldEffect = [{ ...gravitationRow(0, GRAVITATION.unitLength), repeat: false }];

/** EffectTable row for Gravitation Field's ground packet: the sound, then 522 at the cell. */
export const gravitationCastEffect = [
	{
		wav: 'effect/wizard_earthspike'
	},
	gravitationRow(GRAVITATION.castDelay, GRAVITATION.castLength)
];
