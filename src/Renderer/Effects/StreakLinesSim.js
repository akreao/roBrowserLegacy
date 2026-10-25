/**
 * Renderer/Effects/StreakLinesSim.js
 *
 * Motion and geometry of the official client's streak lines (effect
 * primitive type 56), without any WebGL, so it can be tested on its own.
 * Quill Spear's second part (effect 2442) is eight sets of them: soft
 * green streaks racing along the caster-to-target line, on both sides of it.
 *
 * Numbers are the client's: world units (5 to a roBrowser cell), ticks of
 * its 60 Hz effect clock, whole degrees. See effect-port/quill-spear-streaks.md.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/** @var {number} length of one tick of the official effect clock, in ms */
export const STREAK_TICK_MS = 1000 / 60;

/** @var {number} official world units per roBrowser cell */
export const UNITS_PER_CELL = 5;

/** @var {number} lifetime of effect 2442 and of its sets, in ticks */
export const STREAK_FRAMES = 300;

/** @var {number} streaks in one set */
export const STREAKS_PER_SET = 4;

/** @var {number} how far behind the set's position the track starts, units */
export const TRACK_BACK = 100;

/** @var {number} track length: a streak that reaches it starts again at the back */
export const TRACK_LENGTH = 200;

/** @var {number} height of the streaks above the set's position, units */
export const STREAK_HEIGHT = 6;

/** @var {number} vertices of one streak (two triangles) */
export const STREAK_VERTICES = 6;

/**
 * The client builds two rounds of these four sets, in this order.
 * side: +1 or -1, which side of the line the set's streaks run on.
 */
export const SET_ORDER = [
	{ texture: 'black', side: 1 },
	{ texture: 'black', side: -1 },
	{ texture: 'color', side: 1 },
	{ texture: 'color', side: -1 }
];

/** @var {number} rounds of SET_ORDER */
export const ROUNDS = 2;

/** Vertex colour of each tint, 0..255 grey */
export const TINT_GREY = { 125: 255, 126: 215, 127: 185 };

/**
 * Random whole number from 0 to n - 1, like the client's rand() % n
 *
 * @param {number} n
 * @return {number}
 */
export function randomInt(n) {
	return Math.floor(Math.random() * n);
}

/**
 * Direction from one ground point to another, in whole degrees (0..359), as
 * the client measures it: the smallest angle up to 180 whose cosine is at
 * most the x share, mirrored to 360 - angle when the other axis is negative.
 * Both points on the same spot give 180.
 *
 * @param {number} dx
 * @param {number} dy
 * @return {number}
 */
export function streakAngle(dx, dy) {
	const length = Math.sqrt(dx * dx + dy * dy);
	if (!(length > 0)) {
		return 180;
	}
	const c = dx / length;
	for (let a = 0; a <= 180; a++) {
		if (Math.cos((a * Math.PI) / 180) <= c + 1e-9) {
			return dy / length < 0 && a !== 0 ? 360 - a : a;
		}
	}
	return 180;
}

/**
 * One streak's starting values
 *
 * @param {number} side +1 or -1
 * @param {function} rand (n) => 0..n-1
 * @return {object}
 */
export function createStreak(side, rand = randomInt) {
	return {
		age: 0,
		alpha: 0,
		halfWidth: 0.5 + 0.1 * rand(6),
		tint: 125 + rand(3),
		offset: (15 + rand(11)) * side,
		position: rand(200),
		length: 40 + rand(31),
		speed: 1 + 0.1 * rand(11)
	};
}

/**
 * All streaks of effect 2442, in build (and draw) order
 *
 * @param {function} rand (n) => 0..n-1
 * @return {Array<object>} streaks, each with its set's texture key
 */
export function createStreakSets(rand = randomInt) {
	const streaks = [];
	for (let round = 0; round < ROUNDS; round++) {
		for (const set of SET_ORDER) {
			for (let i = 0; i < STREAKS_PER_SET; i++) {
				const streak = createStreak(set.side, rand);
				streak.texture = set.texture;
				streaks.push(streak);
			}
		}
	}
	return streaks;
}

/**
 * Advance a streak by one tick
 *
 * @param {object} streak
 */
export function stepStreak(streak) {
	streak.age++;

	// Fades in 20 a tick up to tick 10 (200)
	if (streak.age < 11) {
		streak.alpha += 20;
	}

	streak.speed += 0.05;
	streak.position += streak.speed;
	if (streak.position >= TRACK_LENGTH) {
		streak.position -= TRACK_LENGTH;
	}

	// Then fades out 2 a tick from tick 21 (0 on tick 120)
	if (streak.age > 20) {
		streak.alpha = Math.max(0, streak.alpha - 2);
	}
}

/**
 * Advance streaks up to the given tick count (never past the lifetime)
 *
 * @param {Array<object>} streaks
 * @param {number} frame ticks done
 * @return {boolean} whether anything moved
 */
export function advanceStreaks(streaks, frame) {
	const target = Math.min(frame, STREAK_FRAMES);
	let changed = false;
	for (const streak of streaks) {
		while (streak.age < target) {
			stepStreak(streak);
			changed = true;
		}
	}
	return changed;
}

/**
 * Write one vertex in roBrowser's GL space
 * (x, y on the map, up above the ground; GL keeps the map plane in x/z and points y down)
 */
function vertex(out, i, center, x, y, up, u, v) {
	out[i + 0] = center[0] + 0.5 + x / UNITS_PER_CELL;
	out[i + 1] = -center[2] - up / UNITS_PER_CELL;
	out[i + 2] = center[1] + 0.5 + y / UNITS_PER_CELL;
	out[i + 3] = u;
	out[i + 4] = v;
	return i + 5;
}

/**
 * Write one streak's quad: flat, STREAK_HEIGHT up, from position - TRACK_BACK
 * to that plus its length along the angle, offset +/- half width across
 * (across = angle - 90). U is 0 at the front end and 1 at the back;
 * V is 0 on the outer edge (offset + half width) and 1 on the inner one.
 *
 * @param {Float32Array} out
 * @param {number} o first float to write
 * @param {object} streak
 * @param {number} angle degrees
 * @param {Array} center set position, in cells
 * @return {number} next float
 */
export function buildStreak(out, o, streak, angle, center) {
	const a = (angle * Math.PI) / 180;
	const fx = Math.cos(a),
		fy = Math.sin(a);
	// angle - 90
	const ax = fy,
		ay = -fx;

	const back = streak.position - TRACK_BACK;
	const front = back + streak.length;
	const outer = streak.offset + streak.halfWidth;
	const inner = streak.offset - streak.halfWidth;

	const p = (along, across) => [fx * along + ax * across, fy * along + ay * across];
	const frontInner = p(front, inner);
	const backInner = p(back, inner);
	const backOuter = p(back, outer);
	const frontOuter = p(front, outer);
	const h = STREAK_HEIGHT;

	o = vertex(out, o, center, frontInner[0], frontInner[1], h, 0, 1);
	o = vertex(out, o, center, backInner[0], backInner[1], h, 1, 1);
	o = vertex(out, o, center, backOuter[0], backOuter[1], h, 1, 0);

	o = vertex(out, o, center, frontOuter[0], frontOuter[1], h, 0, 0);
	o = vertex(out, o, center, backOuter[0], backOuter[1], h, 1, 0);
	o = vertex(out, o, center, frontInner[0], frontInner[1], h, 0, 1);
	return o;
}
