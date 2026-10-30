/**
 * Renderer/Effects/EnergyDrainSim.js
 *
 * The numbers of Kaute's and Soul Explosion's drain (effects 1207 and 1208,
 * EF_ENERGYDRAIN_BLACK) in the official client (kRO 2025-07-16: 0xbe73a0
 * with 1 or 2, primitive 8 as for Soul Strike), without any WebGL:
 *  - on each of ticks 0 to 4, three particle1 souls (bowing at -90, 0 and 90
 *    degrees) burst out from the actor, 10 units up, in a direction picked
 *    within 3 units, and come back to it over 60 ticks: the same flight as
 *    Soul Strike's souls with no distance to cover, a back-off of 2 and a
 *    bow of -2. Scale 1 to 1.5, a trail of 7;
 *  - 1207 is pale (200 to 254 grey), 1208 dark (20 to 119 grey);
 *  - on ticks 50 to 80 the actor is tinted blue, (c, c, 250) with
 *    c = 2 * (125 - tick), and the client's colour recovery then brings it
 *    back by 8 out of 255 a tick.
 *
 * Units are the client's: world units (5 to a cell), ticks (60 a second).
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/** Numbers of a drain soul's flight (keys as soulAt in SoulStrikeSim.js reads them). */
export const DRAIN = {
	ticks: 5,
	bows: [-90, 0, 90],
	life: 60,
	up: 10,
	back: 2,
	bow: -2,
	speedTimes: 2,
	spread: 7, // the aim is r(7) - 3 units off
	trail: 7,
	scale: 1, // + r(6) * 0.1
	alpha: 254
};

/** Grey of the souls, by effect: lowest value and range. */
export const SHADES = {
	1207: { low: 200, range: 55 },
	1208: { low: 20, range: 100 }
};

/** The blue tint on the actor. */
export const TINT = { first: 50, last: 80, blue: 250, recoverStep: 8 };

/**
 * The souls of one drain.
 *
 * @param {number} effectId 1207 or 1208
 * @param {function} [random] returns a number in [0, 1)
 * @return {Array} { spawn (tick), bow, dir: [x, y], scale, shade (0..255) }
 */
export function planDrain(effectId, random = Math.random) {
	const r = k => Math.floor(random() * k);
	const shade = SHADES[effectId] || SHADES[1207];
	const half = (DRAIN.spread - 1) / 2;
	const out = [];
	for (let spawn = 0; spawn < DRAIN.ticks; spawn++) {
		for (const bow of DRAIN.bows) {
			const dy = r(DRAIN.spread) - half;
			const dx = r(DRAIN.spread) - half;
			const length = Math.hypot(dx, dy);
			const color = shade.low + r(shade.range);
			out.push({
				spawn,
				bow,
				dir: length ? [dx / length, dy / length] : [0, 1],
				scale: DRAIN.scale + r(6) * 0.1,
				shade: color
			});
		}
	}
	return out;
}

/**
 * Alpha (0..254) and scale of trail step `i` (0 the soul itself).
 *
 * @param {number} scale the soul's own
 * @param {number} i
 * @return {object} { alpha, scale }
 */
export function drainTrailLook(scale, i) {
	return {
		alpha: DRAIN.alpha - (DRAIN.alpha / DRAIN.trail) * i,
		scale: scale - (scale / DRAIN.trail) * i * 0.5
	};
}

/**
 * The actor's colour on a tick of the effect, out of 1.
 *
 * @param {number} frame tick since the effect started
 * @return {Array} [r, g, b]
 */
export function drainTint(frame) {
	if (frame < TINT.first) {
		return [1, 1, 1];
	}
	const t = Math.min(frame, TINT.last);
	const c = (2 * (125 - t)) / 255;
	const blue = TINT.blue / 255;
	const back = (Math.max(frame - TINT.last, 0) * TINT.recoverStep) / 255;
	return [Math.min(1, c + back), Math.min(1, c + back), Math.min(1, blue + back)];
}
