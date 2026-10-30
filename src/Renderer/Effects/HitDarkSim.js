/**
 * Renderer/Effects/HitDarkSim.js
 *
 * The official client's dark hit flash (effect 180, EF_HITDARK), without any
 * WebGL (kRO 2025-07-16, 0xbb2460, played from case 0xbca2e6):
 *
 *  - One ring_blue cone band (primitive 13) opening the way the actor faces
 *    (yaw 180 - facing, pitch -90), 10 up, base radius 5, top 10, 3.5 deep.
 *    It drifts along its axis at 0.7 a tick, slowing by 0.035 a tick, lives
 *    10 ticks and fades from tick 5.
 *  - Two particle1 sparks (primitive 5) shot ahead, within 40 degrees of the
 *    band's yaw and 50 degrees above or below level, from 4 to 7 units out.
 *  - Two particle1 sparks (primitive 6) shot behind, at 140 to 220 degrees
 *    from the band's yaw, level, from 4 to 7 units out. They are thrown up at
 *    0.3 to 1.19 a tick and fall back to their height by the end of their life.
 *  - Every spark starts 10 up, lives 6 to 29 ticks, moves 0.6 to 1.49 units a
 *    tick slowing to half that by its end, is drawn at scale 0.6 to 1.59 in
 *    (20, 20, 20), added, with two trailing copies, and fades from alpha 254
 *    over its life.
 *
 * Units are the client's: world units (5 to a cell), ticks (60 a second).
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { coneToWorld } from 'Renderer/Effects/EffectPrimSim.js';

/** Numbers of the cone band. */
export const DARK_CONE = {
	life: 10,
	up: 10,
	baseRadius: 5,
	topRadius: 10,
	coneHeight: 3.5,
	drift: 0.7,
	fadeFrom: 5
};

/** Numbers of the sparks. */
export const DARK_SPARK = {
	perKind: 2,
	up: 10,
	color: [20, 20, 20],
	alpha: 254,
	trail: 3
};

const r = (random, k) => Math.floor(random() * k);

/**
 * The four sparks of one flash.
 *
 * @param {number} yaw degrees, the band's yaw (180 - facing)
 * @param {function} [random] returns a number in [0, 1)
 * @return {Array<object>} { kind (5 ahead, 6 behind), yaw, pitch, start, life, speed, throwUp, scale }
 */
export function planDarkSparks(yaw, random = Math.random) {
	const out = [];
	for (let i = 0; i < DARK_SPARK.perKind; i++) {
		const sYaw = r(random, 80) + yaw - 40;
		const pitch = r(random, 100) - 50;
		const start = r(random, 4) + 4;
		const life = r(random, 24) + 6;
		const speed = (r(random, 90) + 60) / 100;
		const scale = (r(random, 100) + 60) / 100;
		out.push({ kind: 5, yaw: sYaw, pitch, start, life, speed, throwUp: 0, scale });
	}
	for (let i = 0; i < DARK_SPARK.perKind; i++) {
		const sYaw = r(random, 80) + yaw + 140;
		const start = r(random, 4) + 4;
		const life = r(random, 24) + 6;
		const speed = (r(random, 90) + 60) / 100;
		const throwUp = (r(random, 90) + 30) / 100;
		const scale = (r(random, 100) + 60) / 100;
		out.push({ kind: 6, yaw: sYaw, pitch: 0, start, life, speed, throwUp, scale });
	}
	return out;
}

/**
 * Where a spark is after n updates (n >= 1), relative to the actor.
 *
 * @param {object} s from planDarkSparks
 * @param {number} n updates
 * @return {object} { x, y (map units), up (units), alpha (0..254) }
 */
export function darkSparkAt(s, n) {
	const rad = Math.PI / 180;
	const dir = coneToWorld(0, 0, 1, s.pitch * rad, s.yaw * rad);
	const accel = -(s.speed / s.life) * 0.5;

	// The client adds the speed's change, then steps by the speed.
	let travel = s.start;
	let speed = s.speed;
	let drop = 0; // client y: down is positive
	let v = -s.throwUp;
	const g = (2 * s.throwUp) / s.life;
	for (let k = 0; k < n; k++) {
		if (s.kind === 6) {
			v += g;
			drop += v;
		}
		speed += accel;
		if (s.kind === 6) {
			speed = Math.max(0, speed);
		}
		travel += speed;
	}

	return {
		x: dir[0] * travel,
		y: dir[2] * travel,
		up: DARK_SPARK.up - dir[1] * travel - drop,
		alpha: Math.max(0, DARK_SPARK.alpha - (DARK_SPARK.alpha / s.life) * n)
	};
}

/**
 * Alpha and scale of trail copy i (0 the spark itself).
 *
 * @param {object} s
 * @param {number} alpha the spark's alpha
 * @param {number} i
 * @return {object} { alpha, scale }
 */
export function darkTrailLook(s, alpha, i) {
	return {
		alpha: alpha - (alpha / DARK_SPARK.trail) * i,
		scale: s.scale - (s.scale / DARK_SPARK.trail) * i * 0.5
	};
}
