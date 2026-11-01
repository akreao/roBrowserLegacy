/**
 * Renderer/Effects/HitLineSim.js
 *
 * The official client's kick hit lines (effect 429, EF_HITLINE4: Prominence
 * Kick, Estun and Roundhouse), without any WebGL (kRO 2025-07-16, case
 * 0xbc6d3f calls 0xbf0000 with mode 3; primitive 100: update 0xb46b50 case
 * 100, draw 0xb73800). 430 (EF_HITLINE5, Counter Kick: 0xbf0400) and 431
 * (EF_HITLINE6, Heel Drop and Esma: 0xbef9f0) are the same lines with other
 * numbers (HITLINE_KINDS; effect-port/hit-lines.md):
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
	waitBase: 0,
	aimed: false,
	segmentFade: 10,
	up: 5,
	core: 0.05,
	glow: 4, // times the core
	sides: 3
};

/**
 * The three kinds, by effect id. 430 waits 25 to 45 ticks and aims its lines
 * at the target from the caster (that heading, -60 to 60 degrees); 431 waits
 * 30 to 70 ticks.
 */
export const HITLINE_KINDS = {
	429: HITLINE,
	430: {
		...HITLINE,
		spawnTicks: [0, 1, 2],
		waitBase: 25,
		waitRange: 21,
		radiusRange: 7,
		segments: 3,
		core: 0.06,
		aimed: true,
		aimRange: 121,
		aimOffset: 60
	},
	431: {
		...HITLINE,
		spawnTicks: [0, 1, 2, 3, 4],
		waitBase: 30,
		waitRange: 41,
		stretch: 0.6,
		core: 0.07
	}
};

/**
 * Ticks until a kind's last line is gone, from the effect's start.
 *
 * @param {object} [kind]
 * @return {number}
 */
export function hitLineLastTick(kind = HITLINE) {
	return kind.spawnTicks[kind.spawnTicks.length - 1] + kind.primLife;
}

/** Ticks until the last line of 429 is gone, from the effect's start. */
export const HITLINE_LAST_TICK = hitLineLastTick(HITLINE);

const r = (random, k) => Math.floor(random() * k);

/**
 * The client's heading helper (0xb46830): the first whole degree whose cosine
 * is at most dx / length, 360 less that when dz < 0.
 *
 * @param {number} dx
 * @param {number} dz
 * @return {number} degrees, 0 to 360
 */
export function tableHeading(dx, dz) {
	const length = Math.hypot(dx, dz);
	if (!(length > 0)) {
		return 180;
	}
	const c = dx / length;
	let angle = 180;
	for (let s = 0; s <= 180; s++) {
		if (Math.cos((s * Math.PI) / 180) <= c + 1e-9) {
			angle = s;
			break;
		}
	}
	return dz / length < 0 ? 360 - angle : angle;
}

/**
 * The lines of one effect, in the order the client makes them.
 *
 * @param {function} [random] returns a number in [0, 1)
 * @param {object} [kind] from HITLINE_KINDS
 * @param {number} [aim] degrees, the heading from the caster to the target (aimed kinds)
 * @return {Array<object>} { spawn, wait, alpha, heading, radius, stretch }
 */
export function planHitLines(random = Math.random, kind = HITLINE, aim = 0) {
	const out = [];
	for (const spawn of kind.spawnTicks) {
		for (let j = 0; j < kind.perPrim; j++) {
			const wait = kind.waitBase + r(random, kind.waitRange);
			const alpha = kind.alpha + r(random, kind.alphaRange);
			let heading;
			if (kind.aimed) {
				heading = (((aim + r(random, kind.aimRange) - kind.aimOffset) % 360) + 360) % 360;
			} else {
				heading = r(random, 360);
			}
			const radius = kind.radius + r(random, kind.radiusRange);
			const stretch = kind.stretch + 0.1 * r(random, kind.stretchRange);
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
 * @param {number} [segments] the kind's
 * @return {Array<number>} segments + 1 angles
 */
export function trailAngles(c, segments = HITLINE.segments) {
	const out = [headAngle(c)];
	for (let k = 1; k <= segments; k++) {
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
