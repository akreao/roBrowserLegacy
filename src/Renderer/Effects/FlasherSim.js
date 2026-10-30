/**
 * Renderer/Effects/FlasherSim.js
 *
 * The numbers of Flasher's flash (effect 99) in the official client
 * (kRO 2025-07-16, 0xbad270), without any WebGL:
 *  - a thunder_center.bmp square facing the camera (primitive 15), 40 units
 *    across and 10 up, for 70 ticks;
 *  - 20 alpha_center.tga rays (primitive 3), thin triangles the client draws
 *    in screen pixels from a point 40 pixels above the trap, each turning and
 *    growing, for 70 ticks.
 *
 * Units: the square in the client's world units (5 to a cell), the rays in
 * screen pixels; angles in degrees.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/** The square (primitive 15). */
export const FLASH = {
	life: 70,
	half: 20, // half its side, units
	height: 10, // units up
	alphaStep: 200 / 6,
	alphaMax: 200,
	// On its 40th tick the client sets alpha back to 120 (a second keyframe, on 100, never comes).
	dipTick: 40,
	dipAlpha: 120,
	fadeTick: 60 // life - 10
};

/** The rays (primitive 3). */
export const RAY = {
	count: 20,
	life: 70,
	up: 40, // pixels above the trap
	alphaStep: 20,
	alphaMax: 200,
	fadeTick: 47 // life - life / 3
};

/**
 * Alpha of the square on each tick, as the client's alpha update leaves it.
 *
 * @return {Array} alpha after ticks 1..life
 */
export function flashAlphas() {
	const out = [];
	let alpha = 0;
	let step = FLASH.alphaStep;
	const max = FLASH.alphaMax;
	for (let age = 0; age < FLASH.life; age++) {
		if (age === FLASH.dipTick) {
			alpha = FLASH.dipAlpha;
		}
		if (age === FLASH.fadeTick) {
			step = -alpha / (FLASH.life - age);
		}
		alpha = Math.min(Math.max(alpha + step, 0), max);
		out.push(alpha);
	}
	return out;
}

/**
 * A new ray.
 *
 * @param {function} [random] returns a number in [0, 1)
 * @return {object}
 */
export function createRay(random = Math.random) {
	const r = k => Math.floor(random() * k);
	const spin = (r(60) + 10) / 10;
	return {
		age: 0,
		angle: r(360),
		spin: spin, // degrees a tick
		spinAccel: -spin / RAY.life / 1.5,
		half: (r(25) + 5) / 10, // half the angle it spans
		length: r(40) + 20, // pixels
		grow: (r(30) + 50) / 10, // pixels a tick
		alpha: 0,
		alphaStep: RAY.alphaStep
	};
}

/**
 * One tick of a ray, in the order of the client's update.
 *
 * @param {object} ray from createRay
 */
export function stepRay(ray) {
	ray.spin += ray.spinAccel;
	ray.angle += ray.spin;
	ray.length += ray.grow;
	if (ray.age === RAY.fadeTick) {
		ray.alphaStep = -ray.alpha / (RAY.life - ray.age);
	}
	ray.alpha = Math.min(Math.max(ray.alpha + ray.alphaStep, 0), RAY.alphaMax);
	ray.age++;
}

/**
 * The ray's triangle in screen pixels from its point (x right, y down): the
 * point, then the corners at angle - half and angle + half. Angle 0 points up
 * and turns clockwise.
 *
 * @param {object} ray
 * @return {Array} three [x, y]
 */
export function rayTriangle(ray) {
	const DEG = Math.PI / 180;
	const a = (ray.angle - ray.half) * DEG;
	const b = (ray.angle + ray.half) * DEG;
	return [
		[0, 0],
		[ray.length * Math.sin(a), -ray.length * Math.cos(a)],
		[ray.length * Math.sin(b), -ray.length * Math.cos(b)]
	];
}
