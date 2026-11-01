/**
 * Renderer/Effects/GravitationFieldSim.js
 *
 * The official client's Gravitation Field spikes (effect 522, EF_GRAVITATION),
 * without any WebGL, so they can be tested on their own.
 * Spec: effect-port/gravitation-field.md.
 *
 * As the official client (kRO 2025-07-16) plays it:
 *
 *  - On its first tick the effect puts a 5 x 5 grid of points round itself,
 *    -10 to +10 units in steps of 5 (a point a cell, two cells out each way),
 *    and 4 spikes on each point: two of effect/stone.bmp, two of effect/ice.tga.
 *  - A spike is the same four-sided pyramid as Frost Diver's (IceSpikesSim.js):
 *    a square base (300 + r(50)) / 100 units from its middle to each side, its
 *    tip 18 units out along its axis, a fifth of the texture's U on each face.
 *    The axis leans 60 + r(40) degrees up from the ground toward a yaw of r(360).
 *  - Its base starts 10 units under the ground and shudders along the axis:
 *    speed 1.0 gaining 0.01 a tick; on ticks where age % 6 is 2 the speed
 *    becomes -1.2 (no gain), where it is 5, 1.18 (gaining 0.01). It pushes out
 *    about 2 units, then shakes back and forth about 3.6 units 10 times a second.
 *  - White, alpha-blended, alpha 20, fading in a straight line to 0 over the
 *    effect's length (the client fades a primitive that would outlive its effect).
 *
 * Units are the client's: world units (5 to a cell), ticks (60 a second), degrees.
 * r(k) is a whole number from 0 to k - 1.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { PRIM_TICK_MS } from './EffectPrimSim.js';
import { randomInt } from './IceSpikesSim.js';

export { PRIM_TICK_MS as GRAVITATION_TICK_MS };

/** The effect's textures, by spike kind. */
export const GRAVITATION_TEXTURES = ['stone.bmp', 'ice.tga'];

/** Numbers of the effect. */
export const GRAVITATION = {
	grid: [-10, -5, 0, 5, 10], // point offsets on both ground axes, units
	kinds: [0, 0, 1, 1], // the spikes on each point: two stone, two ice
	base: [300, 50], // half width (base[0] + r(base[1])) / 100
	height: 18, // tip out along the axis
	pitch: [60, 40], // pitch[0] + r(pitch[1]) up from the ground
	depth: 10, // the base starts this far under the ground
	uStep: 0.2, // texture U across each face
	alpha: 20,
	life: 250, // a spike's own life (the effect ends it first)
	speed: 1.0, // first speed along the axis...
	gain: 0.01, // ...and its gain a tick
	back: -1.2, // speed on ticks where age % 6 === 2 (no gain)
	forth: 1.18, // speed on ticks where age % 6 === 5 (gaining again)
	castDelay: 260, // ms from the ground packet to the effect
	castLength: 120, // ticks, the effect's own length (the ground packet's copy)
	unitLength: 141 // ticks, a skill unit's copy (120 plus the unit's first 21)
};

/** Spikes in one effect. */
export const GRAVITATION_SPIKES = GRAVITATION.grid.length * GRAVITATION.grid.length * GRAVITATION.kinds.length;

/**
 * Plan the effect's spikes.
 *
 * @param {function} [random] returns a number in [0, 1)
 * @return {Array} spikes (points in units relative to the effect), with their kind
 */
export function planGravitation(random = Math.random) {
	const spikes = [];
	GRAVITATION.grid.forEach(y => {
		GRAVITATION.grid.forEach(x => {
			GRAVITATION.kinds.forEach(kind => {
				spikes.push({
					x,
					y,
					kind,
					size: (GRAVITATION.base[0] + randomInt(GRAVITATION.base[1], random)) / 100,
					height: GRAVITATION.height,
					yaw: randomInt(360, random),
					pitch: GRAVITATION.pitch[0] + randomInt(GRAVITATION.pitch[1], random)
				});
			});
		});
	});
	return spikes;
}

/** How far out along its axis a spike is, by age (the same for every spike). */
const RISE = (function () {
	const rise = new Float32Array(GRAVITATION.life);
	let speed = GRAVITATION.speed;
	let gain = GRAVITATION.gain;
	let at = 0;
	for (let age = 0; age < GRAVITATION.life; ++age) {
		if (age % 6 === 2) {
			speed = GRAVITATION.back;
			gain = 0;
		} else if (age % 6 === 5) {
			speed = GRAVITATION.forth;
			gain = GRAVITATION.gain;
		}
		speed += gain;
		at += speed;
		rise[age] = at;
	}
	return rise;
})();

/**
 * Where the spikes are and how strong, at an age
 *
 * @param {number} age ticks since the effect started
 * @param {number} length the effect's length in ticks (it fades over it)
 * @return {object|null} rise (units out along the axis), alpha (0-255); null once gone
 */
export function gravitationAt(age, length) {
	if (age < 0 || age >= Math.min(length, GRAVITATION.life)) {
		return null;
	}
	const alpha = (GRAVITATION.alpha * (length - age)) / length;
	return { rise: RISE[age], alpha };
}
