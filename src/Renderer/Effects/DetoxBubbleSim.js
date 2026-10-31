/**
 * Renderer/Effects/DetoxBubbleSim.js
 *
 * The official client's Detoxify bubbles (effect 21, EF_DETOXICATION), without
 * any WebGL, so they can be tested on their own. Spec: effect-port/thief-skills.md.
 *
 * As the official client plays it, on the target when Detoxify succeeds:
 *
 *  - Tick 0: effect/EF_Detoxication.wav.
 *  - Every 5 ticks from tick 0 to 95 (20 in all; in the low-effects mode every
 *    15 ticks, 0 to 90, 7 in all): one bubble (sprite particle2)
 *    living 40 ticks. It starts on the ground 2 + r(6) units from the target in
 *    a random direction, and follows the target.
 *  - It rises at (30 + r(30)) / 100 units a tick, slowing by half that over its
 *    life, and spins 3 degrees a tick. Scale (40 + r(50)) / 100.
 *  - Alpha rises from 0 to full over 10 ticks and fades out from tick 32 to 0
 *    at its end.
 *
 * The poison attack particles (effects 20 and 125, Enchant Poison and Venom
 * Splasher) are the same bubbles with the particle3 sprite, one every 5 ticks
 * for the effect's whole life: see DB/Effects/PoisonAttackEffect.js. Enchant
 * Deadly Poison's (493) are a variant of them (EDP_BUBBLES).
 *
 * Units are the client's: world units (5 to a cell), ticks (60 a second).
 * r(k) is a whole number from 0 to k - 1.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/** Numbers of the bubbles. */
export const DETOX = {
	count: 20,
	every: 5,
	life: 40,
	fadeIn: 10,
	fadeStart: 32,
	spin: 3
};

/** The low-effects mode (option 229, /mineffect): one bubble every 15 ticks while the effect's 100 ticks last. */
export const DETOX_LOW = { count: 7, every: 15 };

const r = (random, k) => Math.floor(random() * k);

/**
 * Enchant Deadly Poison's particles (effect 493): one every 3 ticks, rising
 * (30 + r(50)) / 100 units a tick, scale (20 + r(20)) / 100; the rest as above.
 */
export const EDP_BUBBLES = { every: 3, riseRand: 50, scaleBase: 20, scaleRand: 20 };

/**
 * @param {function} [random] returns a number in [0, 1)
 * @param {number} [count] how many bubbles (one every 5 ticks)
 * @param {object} [variant] other numbers: every (ticks), riseRand, scaleBase, scaleRand
 * @return {Array<object>} the bubbles, in client units
 */
export function planBubbles(random = Math.random, count = DETOX.count, variant = {}) {
	const every = variant.every || DETOX.every;
	const riseRand = variant.riseRand || 30;
	const scaleBase = variant.scaleBase || 40;
	const scaleRand = variant.scaleRand || 50;
	const bubbles = [];
	for (let i = 0; i < count; i++) {
		const heading = (r(random, 360) * Math.PI) / 180;
		const dist = 2 + r(random, 6);
		bubbles.push({
			spawn: i * every,
			x: Math.cos(heading) * dist,
			y: Math.sin(heading) * dist,
			rise: (30 + r(random, riseRand)) / 100,
			scale: (scaleBase + r(random, scaleRand)) / 100
		});
	}
	return bubbles;
}

/**
 * Alpha (0-254) after k ticks of a bubble's life.
 *
 * @param {number} k
 * @return {number}
 */
export function bubbleAlpha(k) {
	if (k >= DETOX.fadeStart) {
		return Math.max((254 * (DETOX.life - 1 - k)) / (DETOX.life - DETOX.fadeStart), 0);
	}
	return Math.min((254 / DETOX.fadeIn) * k, 254);
}

/**
 * A bubble `age` ticks after it was made, or null outside its life.
 *
 * @param {object} bubble from planBubbles
 * @param {number} age ticks since the bubble's spawn
 * @return {?object} { x, y, up } in client units from the target, scale, alpha 0-254, angle
 */
export function bubbleAt(bubble, age) {
	const k = Math.floor(age);
	if (k < 0 || k >= DETOX.life) {
		return null;
	}
	const slow = bubble.rise / DETOX.life / 2;
	return {
		x: bubble.x,
		y: bubble.y,
		up: bubble.rise * k - (slow * k * (k + 1)) / 2,
		scale: bubble.scale,
		alpha: bubbleAlpha(k),
		angle: (DETOX.spin * k) % 360
	};
}
