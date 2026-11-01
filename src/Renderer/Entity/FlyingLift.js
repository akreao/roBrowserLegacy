/**
 * Renderer/Entity/FlyingLift.js
 *
 * How high a flying body (Star Gladiator Union, option FLYING) floats.
 *
 * Official client (kRO 2025-07-16): the actor draw at 0xd37790 asks 0xc577f0
 * for a height whenever the FLYING bit is set, and moves the whole body up by
 * it, while the shadow stays on the ground. Every frame (60 per second) the
 * bob angle goes up 2 degrees, and the height is 4 * sin(angle) plus a base
 * that moves one pixel at a time:
 * - standing or walking: rises to 20, one pixel every 15 frames;
 * - sitting: rises to 100 at the same pace;
 * - anything else (attacking, casting, hurt...): drops one pixel a frame.
 * The client scales the pixels by 400 / camera distance, which keeps them
 * the size of sprite pixels; here they are sprite pixels.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import StatusConst from 'DB/Status/StatusState.js';

const DEG = Math.PI / 180;

/** Frames per second the official client steps the lift at. */
const FRAME_MS = 1000 / 60;

/** Bob amplitude, in pixels. */
export const BOB_PX = 4;

/** Base height while standing or walking, in pixels. */
export const HOVER_PX = 20;

/** Base height while sitting, in pixels. */
export const SIT_PX = 100;

/** Most frames to catch up at once, after the tab was hidden for a while. */
const MAX_STEPS = 120;

/**
 * One official frame of the lift.
 *
 * @param {{angle: number, base: number}} state
 * @param {number} target HOVER_PX, SIT_PX, or 0 to come down
 */
export function stepFlight(state, target) {
	state.angle += 2;
	if (state.angle >= 360) {
		state.angle -= 360;
	}

	if (!target) {
		if (state.base > 0) {
			state.base--;
		}
		return;
	}

	if (state.angle % 30 !== 0) {
		return;
	}
	if (state.base < target) {
		state.base++;
	} else if (state.base > target) {
		state.base--;
	}
}

/**
 * Height of the body this frame, in pixels, never below the ground.
 *
 * @param {{angle: number, base: number}} state
 * @return {number}
 */
export function flightPx(state) {
	const px = Math.trunc(Math.sin(state.angle * DEG) * BOB_PX + state.base);
	return px > 0 ? px : 0;
}

/**
 * Base height the entity's current action floats it towards.
 *
 * @param {object} entity
 * @return {number}
 */
function targetOf(entity) {
	const ACTION = entity.ACTION;
	if (!ACTION) {
		return 0;
	}
	switch (entity.action) {
		case ACTION.IDLE:
		case ACTION.WALK:
			return HOVER_PX;
		case ACTION.SIT:
			return SIT_PX;
		default:
			return 0;
	}
}

/**
 * Advance the entity's lift to `now` and return how many pixels to raise its
 * body. 0 when it is not flying.
 *
 * @param {object} entity
 * @param {number} now ms
 * @return {number}
 */
export function flyingLiftPx(entity, now) {
	if (!(entity._effectState & StatusConst.EffectState.FLYING)) {
		entity._flyTick = 0;
		return 0;
	}

	let state = entity._flight;
	if (!state) {
		state = entity._flight = { angle: 0, base: 0 };
	}

	if (!entity._flyTick) {
		entity._flyTick = now;
	}

	let steps = Math.floor((now - entity._flyTick) / FRAME_MS);
	if (steps > 0) {
		entity._flyTick += steps * FRAME_MS;
		if (steps > MAX_STEPS) {
			steps = MAX_STEPS;
			entity._flyTick = now;
		}
		const target = targetOf(entity);
		for (let i = 0; i < steps; i++) {
			stepFlight(state, target);
		}
	}

	return flightPx(state);
}
