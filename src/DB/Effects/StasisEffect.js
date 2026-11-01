/**
 * DB/Effects/StasisEffect.js
 *
 * Stasis's effect 799 (EF_STASIS) on the caster as the official client (kRO
 * 2025-07-16) plays it: its sound on tick 6, the caster flashing blue and six
 * growing blue squares under it. Numbers in Renderer/Effects/StasisSim.js,
 * spec in effect-port/stasis.md. Spread into EffectTable.js.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import Renderer from 'Renderer/Renderer.js';
import { PRIM_TICK_MS } from 'Renderer/Effects/EffectPrimSim.js';
import {
	SOUND_TICK,
	SQUARES,
	SQUARE_LIFE,
	stasisBodyColor,
	planSquares,
	squareAt
} from 'Renderer/Effects/StasisSim.js';

/**
 * Flash the caster through its flash colour until the colour is back, timed
 * from the effect's start.
 *
 * @param {Entity} entity
 * @param {number} startTick the effect's start
 */
export function startStasisFlash(entity, startTick) {
	if (!entity || !entity.animations || !entity._flashColor) {
		return;
	}
	// Animation ticks count from now; the effect may start later.
	const late = (startTick || Renderer.tick) - Renderer.tick;
	entity.animations.add(tick => {
		const frame = Math.floor((tick - late) / PRIM_TICK_MS);
		const color = stasisBodyColor(frame);
		if (!color) {
			return false;
		}
		entity._flashColor[0] = color[0] / 255;
		entity._flashColor[1] = color[1] / 255;
		entity._flashColor[2] = color[2] / 255;
		entity._flashColor[3] = 1.0;
		entity.recalculateBlendingColor();
		return color.every(c => c >= 255);
	});
}

/**
 * The PRIM row drawing one square, from its start tick.
 *
 * @param {object} square from planSquares
 * @return {object}
 */
export function squareEffect(square) {
	return {
		type: 'PRIM',
		prim: 'quad',
		texture: `thunder_ball_000${square.texture}.bmp`,
		attachedEntity: true,
		frames: SQUARE_LIFE + 1,
		duration: (SQUARE_LIFE + 1) * PRIM_TICK_MS,
		height: square.height,
		color: SQUARES.color,
		additive: true,
		alpha: 0,
		track(frame) {
			const p = squareAt(frame);
			return p && { alpha: p.alpha, size: p.size, yaw: 45 };
		}
	};
}

export default {
	799: [
		{
			//EF_STASIS	   Stasis: its sound on tick 6
			wav: 'effect/wl_stasis',
			delayWav: Math.round(SOUND_TICK * PRIM_TICK_MS),
			attachedEntity: true
		},
		{
			// the caster's blue flash and the six squares, each from its own tick
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				startStasisFlash(Params.Init.ownerEntity, Params.Inst.startTick);
				planSquares().forEach((square, i) => {
					this.spamEffect({
						effect: squareEffect(square),
						Inst: {
							effectID: 799,
							duplicateID: i,
							startTick: Params.Inst.startTick + square.start * PRIM_TICK_MS
						},
						Init: Params.Init
					});
				});
			}
		}
	]
};
