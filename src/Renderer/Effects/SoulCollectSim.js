/**
 * Renderer/Effects/SoulCollectSim.js
 *
 * Numbers for the official client's soul energy orbs (effect 1225), without
 * any WebGL, so they can be tested on their own. A Soul Reaper or Soul Ascetic
 * gets its soul energy count from ZC_SOULENERGY (0x0b73).
 *
 * As the official client draws them:
 *
 *  - One orb per soul, of which only the newest five show. Each is two
 *    camera-facing quads of soul_collect.bmp, both additive: a coloured base
 *    and a white overlay half its size.
 *  - The look goes by the soul's tier (index / 5): size 2 then 3.5 in green,
 *    alpha at most 150; size 3.5 then 5.5 in red, alpha at most 255.
 *  - Alpha rises 2 a tick from the moment an orb shows, up to its cap.
 *  - Orb i of n sits at (360 / min(n, 5)) * (i mod 5) + phase degrees, 10 units
 *    out from the actor on the ground plane and 10 units up. The phase gains
 *    0.5 degrees a tick.
 *  - The count is updated in place: orbs already shown keep their alpha.
 *
 * Units are the client's: world units (5 to a cell, negative height is up),
 * ticks (60 a second), degrees.
 */

import { PRIM_TICK_MS, UNITS_PER_CELL } from './EffectPrimSim.js';

export { PRIM_TICK_MS as SOUL_TICK_MS, UNITS_PER_CELL };

const DEG = Math.PI / 180;

/** The effect id the client keeps on a soul-energy actor. */
export const SOUL_COLLECT_EFFECT = 1225;

/** Jobs the client draws soul energy for: Soul Reaper, baby Soul Reaper, Soul Ascetic. */
export const SOUL_ENERGY_JOBS = [4240, 4242, 4303];

/** Texture under data/texture/effect/. */
export const TEXTURE = 'soul_collect/soul_collect.bmp';

/** How many of the newest souls show. */
export const SHOWN = 5;

/** Distance from the actor and height (negative is up), world units. */
export const RADIUS = 10;
export const HEIGHT = -10;

/** Degrees the ring turns a tick. */
export const TURN = 0.5;

/** Alpha gained a tick (out of 255). */
export const FADE_STEP = 2;

/** Size, colour and alpha cap of the base quad, by tier (soul index / 5). */
export const TIERS = [
	{ size: 2.0, rgb: [0, 255, 0], cap: 150 },
	{ size: 3.5, rgb: [0, 255, 0], cap: 150 },
	{ size: 3.5, rgb: [255, 0, 0], cap: 255 },
	{ size: 5.5, rgb: [255, 0, 0], cap: 255 }
];

/** The overlay quad: this fraction of the base size, white, alpha up to 255. */
export const OVERLAY = { scale: 0.5, rgb: [255, 255, 255], cap: 255 };

/**
 * Look of soul `index`'s base quad.
 *
 * @param {number} index 0 for the first soul
 * @returns {{size: number, rgb: number[], cap: number}}
 */
export function soulLook(index) {
	return TIERS[Math.min(Math.floor(index / SHOWN), TIERS.length - 1)];
}

/**
 * Whether soul `index` of `count` shows (only the newest five do).
 */
export function soulShown(index, count) {
	return index >= count - SHOWN && index < count;
}

/**
 * Alpha after `ticks` ticks shown (1 on the first), capped.
 */
export function soulAlpha(ticks, cap) {
	return Math.max(0, Math.min(cap, FADE_STEP * ticks));
}

/**
 * Ring phase, degrees, on tick `ticks` of the effect (1 on the first).
 */
export function ringPhase(ticks) {
	return ((ticks - 1) * TURN) % 360;
}

/**
 * Where soul `index` of `count` sits, relative to the actor's feet, in world
 * units: x and z on the ground plane, y the height (negative is up).
 */
export function soulOffset(index, count, phase) {
	const step = 360 / Math.min(count, SHOWN);
	const angle = (step * (index % SHOWN) + phase) * DEG;
	return { x: Math.cos(angle) * RADIUS, y: HEIGHT, z: Math.sin(angle) * RADIUS };
}
