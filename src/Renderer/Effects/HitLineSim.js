/**
 * Renderer/Effects/HitLineSim.js
 *
 * The official client's kick hit lines (effect 429, EF_HITLINE4: Prominence
 * Kick and Estun), without any WebGL (kRO 2025-07-16, case 0xbc6d3f calls
 * 0xbf0000 with mode 3; primitive 100: update 0xb46b50 case 100, draw
 * 0xb73800):
 *
 *  - On ticks 6, 7, 8 and 9 the effect makes a primitive of four lines
 *    (16 lines). Each line waits 0 to 30 ticks, then sweeps a half arc out
 *    from the target: its head turns 6 degrees a tick to 180, standing
 *    (angle / 90) * R units out along a random heading and R * s * sin(angle)
 *    units up, with R 6 to 11 and s 0.8 to 1.4.
 *  - It draws its head and its last three steps (four segments) 5 units up,
 *    as thin triangular tubes of white02.bmp, added: a grey core (radius
 *    0.05, 105 + 30i for segment i) and a blue glow four times as wide
 *    (0, 0, 255) at half the alpha.
 *  - Alpha starts at 125 to 245, less 10 for each segment back, and falls by
 *    5 a tick once the line has swept for 35 ticks.
 *  - The lines follow the target.
 *
 * Units are the client's: world units (5 to a cell), y down; ticks (60 a
 * second); angles in degrees.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/** Numbers of the lines. */
export const HITLINE = {
	spawnTicks: [6, 7, 8, 9],
	perPrim: 4,
	primLife: 200,
	waitRange: 31,
	alpha: 125, // + r(121)
	alphaRange: 121,
	fadeAfter: 35,
	fade: 5,
	step: 6,
	radius: 6, // + r(6)
	radiusRange: 6,
	stretch: 0.8, // + 0.1 r(7)
	stretchRange: 7,
	segments: 4,
	segmentFade: 10,
	up: 5,
	core: 0.05,
	glow: 4, // times the core
	sides: 3
};

/** Ticks until the last line is gone, from the effect's start. */
export const HITLINE_LAST_TICK = HITLINE.spawnTicks[HITLINE.spawnTicks.length - 1] + HITLINE.primLife;

const r = (random, k) => Math.floor(random() * k);

/**
 * The 16 lines of one effect, in the order the client makes them.
 *
 * @param {function} [random] returns a number in [0, 1)
 * @return {Array<object>} { spawn, wait, alpha, heading, radius, stretch }
 */
export function planHitLines(random = Math.random) {
	const out = [];
	for (const spawn of HITLINE.spawnTicks) {
		for (let j = 0; j < HITLINE.perPrim; j++) {
			const wait = r(random, HITLINE.waitRange);
			const alpha = HITLINE.alpha + r(random, HITLINE.alphaRange);
			const heading = r(random, 360);
			const radius = HITLINE.radius + r(random, HITLINE.radiusRange);
			const stretch = HITLINE.stretch + 0.1 * r(random, HITLINE.stretchRange);
			out.push({ spawn, wait, alpha, heading, radius, stretch });
		}
	}
	return out;
}

/**
 * How many ticks a line has swept by effect tick t (the client updates
 * before it draws: a primitive made on tick `spawn` has t - spawn + 1 updates).
 *
 * @param {object} line from planHitLines
 * @param {number} t effect tick
 * @return {number} 0 while it waits
 */
export function sweptTicks(line, t) {
	const updates = t - line.spawn + 1;
	if (updates < 1 || updates > HITLINE.primLife) {
		return 0;
	}
	return Math.max(0, updates - line.wait);
}

/**
 * The head's angle after c swept ticks.
 *
 * @param {number} c
 * @return {number} degrees, 0 to 180
 */
export function headAngle(c) {
	return c > 0 ? Math.min(180, HITLINE.step * c) : 0;
}

/**
 * The angles drawn: the head, then the last steps. The client copies the
 * new head into the trail, so the first segment is empty until the arc ends.
 *
 * @param {number} c swept ticks
 * @return {Array<number>} HITLINE.segments + 1 angles
 */
export function trailAngles(c) {
	const out = [headAngle(c)];
	for (let k = 1; k <= HITLINE.segments; k++) {
		out.push(headAngle(c - k + 1));
	}
	return out;
}

/**
 * The line's alpha after c swept ticks.
 *
 * @param {object} line
 * @param {number} c
 * @return {number} 0..245
 */
export function lineAlpha(line, c) {
	if (c < 1) {
		return 0;
	}
	return Math.max(0, line.alpha - HITLINE.fade * Math.max(0, c - HITLINE.fadeAfter));
}

/**
 * Where the arc stands at an angle, relative to the target.
 *
 * @param {object} line
 * @param {number} angle degrees
 * @return {Array<number>} [x, y, z], client axes (y down)
 */
export function arcPoint(line, angle) {
	const rad = Math.PI / 180;
	const out = angle > 0 ? (angle / 90) * line.radius : 0;
	return [
		Math.cos(line.heading * rad) * out,
		-line.radius * Math.sin(angle * rad) * line.stretch,
		Math.sin(line.heading * rad) * out
	];
}

/**
 * The colour of segment i's core.
 *
 * @param {number} i
 * @return {Array<number>} [r, g, b] 0..255
 */
export function coreColor(i) {
	const c = (105 + 30 * i) & 0xff;
	return [c, c, c];
}
