/**
 * Renderer/Effects/BlinkBody.js
 *
 * The official client's blinking body (effect 1209, EF_BLINK_BODY: Soul
 * Division on the target, Soul Collect on the caster; kRO 2025-07-16, case at
 * 0xbc070d). On ticks 0 to 60 the actor is drawn (155, 155, 255) on even
 * ticks and (50, 50, 50) on odd ones; tick 60 leaves it pale blue, and the
 * client's colour recovery then brings it back by 8 out of 255 a tick.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { PRIM_TICK_MS } from 'Renderer/Effects/EffectPrimSim.js';

/** Ticks, colours (out of 255) and recovery step. */
export const BLINK = {
	last: 60,
	even: [155, 155, 255],
	odd: [50, 50, 50],
	recoverStep: 8
};

/**
 * Colour multiplier of the actor on a tick of the effect.
 *
 * @param {number} frame tick since the effect started
 * @return {Array} [r, g, b] out of 1
 */
export function blinkBodyColor(frame) {
	if (frame <= BLINK.last) {
		const c = frame % 2 ? BLINK.odd : BLINK.even;
		return [c[0] / 255, c[1] / 255, c[2] / 255];
	}
	const back = (frame - BLINK.last) * BLINK.recoverStep;
	const c = BLINK.last % 2 ? BLINK.odd : BLINK.even;
	return c.map(v => Math.min(1, (v + back) / 255));
}

/**
 * Run the blink on an entity, through its flash colour.
 *
 * @param {Entity} entity
 */
export function startBlinkBody(entity) {
	if (!entity || !entity.animations || !entity._flashColor) {
		return;
	}
	entity.animations.add(tick => {
		const frame = Math.floor(tick / PRIM_TICK_MS);
		const [r, g, b] = blinkBodyColor(frame);
		entity._flashColor[0] = r;
		entity._flashColor[1] = g;
		entity._flashColor[2] = b;
		entity._flashColor[3] = 1.0;
		entity.recalculateBlendingColor();
		return frame > BLINK.last && r >= 1 && g >= 1 && b >= 1;
	});
}
