/**
 * Renderer/Effects/LightSphereSim.js
 *
 * The light spheres of Light of the Sun, Moon and Stars (CLightSphereEffect,
 * effects 1197 / 1198 / 1199) as the official client (kRO 2025-07-16) draws
 * them, without any WebGL, so they can be tested on their own.
 * Spec: effect-port/star-emperor-soul-reaper-audit.md.
 *
 * Set-up (vfunc1 0xb05230, parts 0xb04d60), update (vfunc3 0xb05390), alive
 * while anything still shows (vfunc6 0xb05330):
 *
 *  - a centre: effect/thunder_center.bmp, drawn four times on top of each
 *    other, 10 units above the caster, turned to the camera. Its half side is
 *    3.5 * (1 + 0.05 sin p), p going up 2 degrees a tick. Its alpha starts at
 *    1 and goes up 1 a tick (to 255) until tick 300, then down 1 a tick;
 *  - 640 rays: effect/white02.bmp quads, 1 unit wide at the centre and coming
 *    to a point on a sphere around it, half of them flat one way and half the
 *    other. Ray i points at random angles (t, s) and reaches
 *    R = r (1 + sin q) from the centre: r starts at 1 and grows by 2% a tick
 *    up to 10, q starts at a random angle and goes up 1 or 2 degrees a tick.
 *    Alpha 40, falling 1 a tick after tick 500. Each ray takes one of two
 *    tints of its sphere's colour at random.
 *
 * The effect ends once every part's alpha is under 1 (about tick 555).
 *
 * Points are in the client's units (5 to a cell) from the caster's feet:
 * x east, z on the map's y, and y down (negative is up). Ticks are 60 a second.
 * r(k) is a whole number from 0 to k - 1.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/** Numbers of the look. */
export const SPHERE = {
	centers: 4,
	centerHalf: 3.5,
	centerPulse: 0.05,
	centerSpin: 2,
	centerFadeOut: 300,
	height: 10,
	groups: 2,
	raysPerGroup: 320,
	rayAlpha: 40,
	rayFadeOut: 500,
	rayGrowth: 1.02,
	rayMax: 10,
	rayHalfWidth: 0.5
};

/** Tints (0-255) by effect: the centre's, and the two a ray picks from. */
export const SPHERE_COLORS = {
	1197: {
		center: [255, 124, 128],
		rays: [
			[255, 124, 128],
			[255, 74, 78]
		]
	},
	1198: {
		center: [255, 255, 55],
		rays: [
			[255, 255, 155],
			[255, 255, 55]
		]
	},
	1199: {
		center: [59, 204, 255],
		rays: [
			[59, 204, 255],
			[109, 154, 255]
		]
	}
};

const r = (random, k) => Math.floor(random() * k);
const rad = deg => (deg * Math.PI) / 180;

/**
 * A fresh sphere, in the order the client sets it up: for each ray its
 * vertical angle t, its turn s, its pulse q, then its tint.
 *
 * @param {number} effectId 1197, 1198 or 1199
 * @param {function} [random] returns a number in [0, 1)
 * @return {object}
 */
export function createSphere(effectId, random = Math.random) {
	const colors = SPHERE_COLORS[effectId] || SPHERE_COLORS[1199];
	const rays = [];
	for (let group = 0; group < SPHERE.groups; group++) {
		for (let i = 0; i < SPHERE.raysPerGroup; i++) {
			const t = r(random, 360);
			const s = r(random, 360);
			const q = r(random, 360);
			const color = colors.rays[r(random, 2)];
			rays.push({ group, t, s, q, color, size: 1, alpha: SPHERE.rayAlpha, age: 0 });
		}
	}
	return {
		center: { color: colors.center, phase: 0, alpha: 1, age: 0 },
		rays,
		ticks: 0,
		random
	};
}

/**
 * One tick of the sphere (vfunc3).
 *
 * @param {object} sphere from createSphere
 */
export function stepSphere(sphere) {
	const c = sphere.center;
	c.alpha = c.age < SPHERE.centerFadeOut ? Math.min(c.alpha + 1, 255) : Math.max(c.alpha - 1, 0);
	c.phase = (c.phase + SPHERE.centerSpin) % 360;
	c.age++;

	for (const ray of sphere.rays) {
		if (ray.size < SPHERE.rayMax) {
			ray.size *= SPHERE.rayGrowth;
		}
		if (ray.age > SPHERE.rayFadeOut) {
			ray.alpha = Math.max(ray.alpha - 1, 0);
		}
		ray.q = (ray.q + 1 + r(sphere.random, 2)) % 360;
		ray.age++;
	}
	sphere.ticks++;
}

/**
 * Whether anything still shows (vfunc6).
 *
 * @param {object} sphere
 * @return {boolean}
 */
export function sphereAlive(sphere) {
	return sphere.center.alpha >= 1 || sphere.rays.some(ray => ray.alpha >= 1);
}

/**
 * The centre's half side, in units.
 *
 * @param {object} sphere
 * @return {number}
 */
export function centerHalf(sphere) {
	const sin = Math.sin(rad(sphere.center.phase));
	return SPHERE.centerHalf * sin * SPHERE.centerPulse + SPHERE.centerHalf;
}

/**
 * A ray's four corners, in client units from the caster's feet, as the
 * client lays them out: two at its point, then the two at the centre.
 *
 * @param {object} ray
 * @return {Array<Array<number>>}
 */
export function rayCorners(ray) {
	const reach = ray.size * Math.sin(rad(ray.q)) + ray.size;
	const flat = reach * Math.cos(rad(ray.t));
	const tip = [
		flat * Math.cos(rad(ray.s)),
		reach * Math.sin(rad(ray.t)) - SPHERE.height,
		flat * Math.sin(rad(ray.s))
	];
	const w = SPHERE.rayHalfWidth;
	const h = -SPHERE.height;
	const base =
		ray.group === 0
			? [
					[-w, h, 0],
					[w, h, 0]
				]
			: [
					[0, h, -w],
					[0, h, w]
				];
	return [tip, tip, base[0], base[1]];
}

/**
 * The centre on tick `age` (0 on the first draw, after one update), without
 * stepping a sphere: it has nothing random.
 *
 * @param {number} age ticks
 * @return {{half: number, alpha: number}} half side in units, alpha 0-255
 */
export function centerAt(age) {
	const n = Math.floor(age) + 1;
	const fadeOut = SPHERE.centerFadeOut;
	const alpha = n <= fadeOut ? Math.min(1 + n, 255) : Math.max(Math.min(1 + fadeOut, 255) - (n - fadeOut), 0);
	const phase = (SPHERE.centerSpin * n) % 360;
	return { half: SPHERE.centerHalf * Math.sin(rad(phase)) * SPHERE.centerPulse + SPHERE.centerHalf, alpha };
}

/** Ticks the centre shows: until its alpha is back to 0. */
export const CENTER_LIFE = SPHERE.centerFadeOut + 255;
