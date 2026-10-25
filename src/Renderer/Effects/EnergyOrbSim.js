/**
 * Renderer/Effects/EnergyOrbSim.js
 *
 * Motion of the official client's spirit charm orbs, without any WebGL, so it
 * can be tested on its own. A Kagerou/Oboro (and Shinkiro/Shiranui) gets one
 * orb per charm from ZC_SPIRITS_ATTRIBUTE; the element picks the effect id and
 * with it the texture and size (effects 735 to 738).
 *
 * As the official client draws them:
 *
 *  - Orb i of n starts at floor(360 / n) * i degrees around the actor, with a
 *    random phase (0..359) and a random bob speed (0, 1 or 2).
 *  - Every tick the ring turns 0.75 degrees and each phase moves by its bob
 *    speed. Radius 8 + 0.6 sin(phase), height -12 + 0.6 sin(phase) * bob,
 *    size * (1 + 0.1 sin(phase)).
 *  - The ring turns with the camera: angle 0 is screen right, 90 away from
 *    the camera, so the orbs keep their place on screen when the camera turns.
 *  - Each orb is two camera-facing quads of the same texture: a back quad with
 *    normal blending, 0.1 * size larger, and an additive front quad.
 *  - Both fade in together: alpha gains 1 a tick for the first 201 ticks.
 *
 * Units are the client's: world units (5 to a cell, negative height is up),
 * ticks (60 a second), degrees.
 */

import { PRIM_TICK_MS, UNITS_PER_CELL } from './EffectPrimSim.js';

export { PRIM_TICK_MS as ORB_TICK_MS, UNITS_PER_CELL };

const DEG = Math.PI / 180;

/** Charm element (ZC_SPIRITS_ATTRIBUTE type) to orb effect id. */
export const CHARM_ORB_EFFECTS = { 1: 737, 2: 738, 3: 735, 4: 736 };

/** Every charm orb effect id; a new charm packet removes all of them first. */
export const ALL_CHARM_ORB_EFFECTS = [735, 736, 737, 738];

/** Texture (under data/texture/effect/) and size of each orb effect. */
export const ORB_LOOKS = {
	735: { texture: 'FireOrb.bmp', size: 2.3 },
	736: { texture: 'LightningOrb.bmp', size: 2.3 },
	737: { texture: 'WaterOrb.bmp', size: 1.3 },
	738: { texture: 'StoneOrb.bmp', size: 2.3 }
};

/** Ticks the orbs take to fade in; alpha ends at this value out of 255. */
export const FADE_TICKS = 201;

/** Degrees the ring turns a tick. */
export const TURN = 0.75;

/** Distance from the actor and height (negative is up), world units. */
export const RADIUS = 8;
export const HEIGHT = -12;

/** How far sin(phase) moves radius and height, world units. */
export const WOBBLE = 0.6;

/** How much sin(phase) grows the size, and how much larger the back quad is. */
export const PULSE = 0.1;
export const BACK_GROW = 0.1;

/**
 * The orbs for `count` charms, at their start angles with a random phase and bob.
 *
 * @param {number} count
 * @param {function} [random] returns 0 <= x < 1
 * @return {Array<{angle: number, phase: number, bob: number}>}
 */
export function createOrbs(count, random = Math.random) {
	const orbs = [];
	const n = Math.max(0, Math.floor(count) || 0);
	if (!n) {
		return orbs;
	}
	const step = Math.floor(360 / n);
	for (let i = 0; i < n; i++) {
		orbs.push({
			angle: step * i,
			phase: Math.floor(random() * 360),
			bob: Math.floor(random() * 3)
		});
	}
	return orbs;
}

/**
 * Alpha (0..255) after `ticks` ticks; the first drawn frame is tick 1.
 *
 * @param {number} ticks
 * @return {number}
 */
export function orbAlpha(ticks) {
	return Math.max(0, Math.min(ticks, FADE_TICKS));
}

/**
 * Where an orb is after `ticks` ticks, in the camera-turned frame.
 *
 * @param {{angle: number, phase: number, bob: number}} orb
 * @param {number} ticks
 * @param {number} size the look's orb size
 * @return {{angle: number, phase: number, x: number, y: number, z: number, front: number, back: number}}
 *   angle and phase in whole degrees; x toward screen right, z away from the
 *   camera, y height (negative is up), all world units; front and back are the
 *   quads' half widths.
 */
export function orbAt(orb, ticks, size) {
	let angle = orb.angle + TURN * ticks;
	angle -= Math.floor(angle / 360) * 360;
	const turn = Math.floor(angle);
	const phase = (((orb.phase + orb.bob * ticks) % 360) + 360) % 360;
	const wave = Math.sin(phase * DEG);
	const radius = RADIUS + WOBBLE * wave;
	const front = size + size * PULSE * wave;
	return {
		angle: turn,
		phase,
		x: radius * Math.cos(turn * DEG),
		y: HEIGHT + WOBBLE * wave * orb.bob,
		z: radius * Math.sin(turn * DEG),
		front,
		back: front + size * BACK_GROW
	};
}

/**
 * Screen right and away-from-camera directions on the ground, from the view matrix.
 *
 * @param {mat4} modelView view matrix (gl-matrix, column-major)
 * @param {Float32Array} right out: screen right, GL world
 * @param {Float32Array} away out: away from the camera, GL world
 */
export function cameraFrame(modelView, right, away) {
	// Rows of the view rotation are the camera's axes in world space
	let x = modelView[0];
	let z = modelView[8];
	let length = Math.hypot(x, z) || 1;
	right[0] = x / length;
	right[1] = 0;
	right[2] = z / length;

	// The camera looks down, so its up axis leans away from it over the ground
	x = modelView[1];
	z = modelView[9];
	length = Math.hypot(x, z);
	if (length < 1e-6) {
		// Camera level with the ground: away is a quarter turn from right
		away[0] = -right[2];
		away[2] = right[0];
	} else {
		away[0] = x / length;
		away[2] = z / length;
	}
	away[1] = 0;
}
