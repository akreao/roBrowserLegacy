/**
 * Renderer/Effects/StasisSim.js
 *
 * Stasis's look (effect 799, EF_STASIS) on the caster as the official client
 * (kRO 2025-07-16, case 0xbbb359) plays it, without any WebGL, so it can be
 * tested on its own. Spec: effect-port/stasis.md.
 *
 * - Tick 6: effect/wl_stasis.wav.
 * - Ticks 6 to 40: the caster is drawn blue (0, 0, 255) on even ticks and
 *   untinted on odd ones; after tick 40 (blue) the client's colour recovery
 *   brings it back 8 out of 255 a tick.
 * - Six flat squares lying level on the caster, turned 45 degrees,
 *   effect/thunder_ball_0001-0006.bmp, square k (0-5) starting 10 + 4k ticks
 *   late, 5 + r(6) units up. Each starts 13 units in size (0.9 x size from
 *   its middle to a corner) and grows 7% a tick; its alpha climbs 6 a tick to
 *   60 over 10 ticks, then falls 1 a tick. Tinted (55, 55, 255), added.
 *
 * Units are the client's, 5 to a cell; ticks are 60 a second. r(k) is a whole
 * number from 0 to k - 1.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/** The sound tick. */
export const SOUND_TICK = 6;

/** The body flash. */
export const FLASH = {
	first: 6,
	last: 40,
	blue: [0, 0, 255],
	recoverStep: 8
};

/** The squares. */
export const SQUARES = {
	count: 6,
	delay: 10,
	stagger: 4,
	size: 13,
	corner: 0.9,
	growth: 1.07,
	height: 5,
	heightRange: 6,
	fadeIn: 6,
	fadeInEnd: 10,
	fadeOut: 1,
	color: [55, 55, 255]
};

/**
 * The caster's colour on tick `frame` of the effect, out of 255, or null
 * when the effect leaves it alone.
 *
 * @param {number} frame
 * @return {Array<number>|null}
 */
export function stasisBodyColor(frame) {
	if (frame < FLASH.first) {
		return null;
	}
	if (frame <= FLASH.last) {
		return frame % 2 ? [255, 255, 255] : FLASH.blue;
	}
	const back = (frame - FLASH.last) * FLASH.recoverStep;
	return FLASH.blue.map(v => Math.min(255, v + back));
}

/**
 * The squares: texture number (1-6), start tick and height (units).
 *
 * @param {function} [random] returns a number in [0, 1)
 * @return {Array<{texture: number, start: number, height: number}>}
 */
export function planSquares(random = Math.random) {
	const squares = [];
	for (let k = 0; k < SQUARES.count; k++) {
		squares.push({
			texture: k + 1,
			start: SQUARES.delay + SQUARES.stagger * k,
			height: SQUARES.height + Math.floor(random() * SQUARES.heightRange)
		});
	}
	return squares;
}

/**
 * A square's alpha after `n` updates of its own.
 *
 * @param {number} n
 * @return {number}
 */
export function squareAlpha(n) {
	if (n <= 0) {
		return 0;
	}
	if (n <= SQUARES.fadeInEnd) {
		return SQUARES.fadeIn * n;
	}
	return Math.max(0, SQUARES.fadeIn * SQUARES.fadeInEnd - SQUARES.fadeOut * (n - SQUARES.fadeInEnd));
}

/** Updates a square lasts. */
export const SQUARE_LIFE = SQUARES.fadeInEnd + (SQUARES.fadeIn * SQUARES.fadeInEnd) / SQUARES.fadeOut;

/**
 * A square on tick `frame` of its own (0 when it starts, before its first
 * update), or null when it does not show: half side (units) and alpha (0-255).
 *
 * @param {number} frame
 * @return {{size: number, alpha: number}|null}
 */
export function squareAt(frame) {
	const n = Math.floor(frame);
	const alpha = squareAlpha(n);
	if (alpha <= 0) {
		return null;
	}
	const corner = SQUARES.corner * SQUARES.size * Math.pow(SQUARES.growth, n);
	return { size: corner / Math.SQRT2, alpha };
}
