/**
 * Renderer/Effects/RemoveTrapSim.js
 *
 * The official client's Remove Trap fountain (effect 100, EF_REMOVETRAP),
 * without any WebGL (kRO 2025-07-16, 0xbcf7b0):
 *
 *  - Tick 0: effect/hunter_removetrap.wav.
 *  - Ticks 0 and 7: 12 particle1 sprites each (primitive 7), living 50 ticks.
 *    Each heads out in a random direction at 0.2 units a tick, is thrown up
 *    at 2 units a tick and falls back under a gravity of 0.08 to 0.089, at
 *    scale 0.8. Alpha stays at 254 and fades out from tick 35.
 *
 * Units are the client's: world units (5 to a cell), ticks (60 a second).
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/** Numbers of the fountain. */
export const FOUNTAIN = {
	bursts: [0, 7],
	count: 12,
	life: 50,
	out: 0.2,
	throwUp: 2,
	gravity: 0.08, // + r(10) / 1000
	scale: 0.8,
	alpha: 254,
	fadeTick: 35
};

const r = (random, k) => Math.floor(random() * k);

/**
 * @param {function} [random] returns a number in [0, 1)
 * @return {Array<object>} the particles of both bursts
 */
export function planFountain(random = Math.random) {
	const out = [];
	for (const spawn of FOUNTAIN.bursts) {
		for (let i = 0; i < FOUNTAIN.count; i++) {
			const gravity = r(random, 10) / 1000 + FOUNTAIN.gravity;
			const heading = (r(random, 360) * Math.PI) / 180;
			out.push({ spawn, heading, gravity });
		}
	}
	return out;
}

/**
 * Alpha after n updates.
 *
 * @param {number} n
 * @return {number}
 */
export function fountainAlpha(n) {
	if (n <= FOUNTAIN.fadeTick) {
		return FOUNTAIN.alpha;
	}
	return Math.max(
		FOUNTAIN.alpha - (FOUNTAIN.alpha / (FOUNTAIN.life - FOUNTAIN.fadeTick)) * (n - FOUNTAIN.fadeTick),
		0
	);
}

/**
 * A particle `age` ticks after it was thrown, or null outside its life. The
 * client updates before it draws, so tick k shows k + 1 updates.
 *
 * @param {object} p from planFountain
 * @param {number} age ticks since its burst
 * @return {?object} { x, y, up } in client units from the trap, scale, alpha 0-254
 */
export function particleAt(p, age) {
	const k = Math.floor(age);
	if (k < 0 || k >= FOUNTAIN.life) {
		return null;
	}
	const n = k + 1;
	const dist = FOUNTAIN.out * n;
	return {
		x: Math.sin(p.heading) * dist,
		y: Math.cos(p.heading) * dist,
		up: FOUNTAIN.throwUp * n - (p.gravity * n * (n + 1)) / 2,
		scale: FOUNTAIN.scale,
		alpha: fountainAlpha(n)
	};
}
