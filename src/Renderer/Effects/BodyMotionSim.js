/**
 * Renderer/Effects/BodyMotionSim.js
 *
 * The numbers of the official client's Taekwon body effects (BodyMotion.js):
 * what each effect marks on its owner on each tick, and what the marks do to
 * one layer of the owner's sprite. No rendering here.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

const DEG = Math.PI / 180;

/** Quake: each edge moves by a whole number of pixels in -QUAKE_PX..QUAKE_PX. */
export const QUAKE_PX = 5;

/** Ready glow colour (0-255). */
export const READY_COLOR = [5, 5, 255];

/**
 * Press: share of its height a layer keeps on tick n of the press.
 *
 * @param {number} n
 * @param {function} [random] returns a number in [0, 1)
 * @return {number}
 */
export function pressScale(n, random = Math.random) {
	if (n < 4) {
		return (100 - 20 * n) / 100;
	}
	if (n < 34) {
		return 0.4 - Math.floor(random() * 6) / 100;
	}
	return 1;
}

/**
 * Spin: the layer's turn in degrees on tick n (one turn over 36 ticks).
 *
 * @param {number} n
 * @return {number}
 */
export function spinAngle(n) {
	if (n < 0 || n >= 37) {
		return 0;
	}
	const angle = 180 - Math.cos(5 * n * DEG) * 180;
	return angle >= 360 ? angle - 360 : angle;
}

/**
 * Kick: how far the layer is up on tick n, as a share of its height.
 *
 * @param {number} n
 * @return {number}
 */
export function kickLift(n) {
	if (n < 0) {
		return 0;
	}
	if (n < 19) {
		return 0.3 * Math.sin(5 * n * DEG);
	}
	if (n < 21) {
		return 0.3;
	}
	if (n < 24) {
		return (23 - n) * 0.1;
	}
	return 0;
}

/**
 * Ready glow: alpha (0-255) of the two added copies on tick n, or 0.
 *
 * @param {number} n
 * @return {number}
 */
export function readyAlpha(n) {
	if (n < 0 || n > 50) {
		return 0;
	}
	if (n < 11) {
		return 15 * n;
	}
	if (n < 21) {
		return 160;
	}
	return (51 - n) * 5;
}

/**
 * What each effect marks on its owner on its tick `age` (0 on the first), or
 * null on the ticks it marks nothing.
 */
export const SCHEDULES = {
	// EF_PRESSEDBODY: press from age 17 to 50.
	413: age => (age >= 17 && age <= 50 ? { press: age - 17 } : null),
	// EF_SPINEDBODY: spin twice as fast, while age < 18.
	414: age => (age < 18 ? { spin: age * 2 } : null),
	// EF_KICKEDBODY: kick from age 30.
	415: age => (age >= 30 ? { kick: age - 30 } : null),
	// EF_QUAKEBODY: quake all along.
	426: () => ({ quake: true }),
	// EF_TAE_READY: blue glow while age < 51.
	449: age => (age < 51 ? { ready: age } : null),
	// EF_QUAKEBODY2: quake all along.
	458: () => ({ quake: true }),
	// EF_SPINEDBODY2: spin from age 14 to 49.
	466: age => (age >= 14 && age < 50 ? { spin: age - 14 } : null)
};

/**
 * One layer's quad with the owner's marks applied. Sprite pixels, y down,
 * `oy` the layer centre and `h` its height; `ox` and `w` the same across.
 *
 * @param {object[]} marks the owner's marks this tick
 * @param {number} ox
 * @param {number} oy
 * @param {number} w (negative when mirrored)
 * @param {number} h
 * @param {function} [random] returns a number in [0, 1)
 * @return {{ox: number, oy: number, w: number, h: number, angle: number}}
 */
export function applyMarks(marks, ox, oy, w, h, random = Math.random) {
	const sign = h < 0 ? -1 : 1;
	let top = oy - Math.abs(h) / 2;
	let bottom = oy + Math.abs(h) / 2;
	let left = ox - Math.abs(w) / 2;
	let right = ox + Math.abs(w) / 2;
	let angle = 0;

	for (let i = 0; i < marks.length; i++) {
		const mark = marks[i];
		if (mark.kick !== undefined) {
			const up = kickLift(mark.kick) * (bottom - top);
			top -= up;
			bottom -= up;
		}
	}
	for (let i = 0; i < marks.length; i++) {
		const mark = marks[i];
		if (mark.press !== undefined) {
			top += (bottom - top) * (1 - pressScale(mark.press, random));
		}
		if (mark.spin !== undefined) {
			angle = spinAngle(mark.spin);
		}
	}
	for (let i = 0; i < marks.length; i++) {
		if (marks[i].quake) {
			const jitter = () => Math.floor(random() * (2 * QUAKE_PX + 1)) - QUAKE_PX;
			top += jitter();
			bottom += jitter();
			left += jitter();
			right += jitter();
			break;
		}
	}

	return {
		ox: (left + right) / 2,
		oy: (top + bottom) / 2,
		w: (w < 0 ? -1 : 1) * (right - left),
		h: sign * (bottom - top),
		angle
	};
}

/**
 * Ready glow alpha (0-255) the owner's marks ask for this tick, or 0.
 *
 * @param {object[]} marks
 * @return {number}
 */
export function glowAlpha(marks) {
	let alpha = 0;
	for (let i = 0; i < marks.length; i++) {
		if (marks[i].ready !== undefined) {
			alpha = Math.max(alpha, readyAlpha(marks[i].ready));
		}
	}
	return alpha;
}

/**
 * The marks every live body effect puts on an entity this tick.
 *
 * @param {object} entity
 * @return {object[]}
 */
export function marksOf(entity) {
	const list = entity._bodyMotions;
	if (!list || !list.size) {
		return [];
	}
	const marks = [];
	list.forEach(mark => {
		if (mark) {
			marks.push(mark);
		}
	});
	return marks;
}
