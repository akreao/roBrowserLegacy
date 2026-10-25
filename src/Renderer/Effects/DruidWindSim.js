/**
 * Renderer/Effects/DruidWindSim.js
 *
 * How the official client places the Druid wind skills' effects (kRO
 * 2026-02-11), without any WebGL, so it can be tested on its own. Angles are
 * the client's screen angle from one actor to another (degrees clockwise from
 * screen right, ScreenDirection.screenAngle); distances are its world units
 * (5 to a cell); delays are in ms.
 *
 *  - quadrant: which quarter of the screen the target is in, seen from the
 *    caster: 0 below (60-120 degrees), 1 left, 2 above, 3 right.
 *  - raptorHit: a Wereraptor attack hit on the target. The art points right;
 *    it is turned to the attack's angle, and mirrored (and turned back half a
 *    circle) when the target is left or above, so it stays upright.
 *  - lowFlight: Low Flight's swoop on the target, the up-down art for a target
 *    below or above, the sideways art for one left or right, mirrored to match.
 *  - hailShots: Sharpen Hail's shots, five waves 200 ms apart of five to seven
 *    shots each, scattered around the target.
 *  - gustSpray: Sharpen Gust's spray of attack_02 copies, a wedge three rows
 *    deep ahead of the caster toward the target.
 */

/** A turn on screen, kept in 0..359. */
function wrap(degrees) {
	return (((Math.trunc(degrees) + 360) % 360) + 360) % 360;
}

/**
 * Quarter of the screen for a screen angle.
 *
 * @param {number} angle degrees clockwise from screen right
 * @returns {number} 0 below, 1 left, 2 above, 3 right, -1 none
 */
export function quadrant(angle) {
	if (angle > 60 && angle <= 120) {
		return 0;
	}
	if (angle > 120 && angle <= 240) {
		return 1;
	}
	if (angle > 240 && angle <= 300) {
		return 2;
	}
	if ((angle > 300 && angle <= 360) || (angle >= 0 && angle <= 60)) {
		return 3;
	}
	return -1;
}

/**
 * A Wereraptor attack hit on the target (attack_00, attack_01).
 *
 * @param {number} angle screen angle, caster to target
 * @returns {{flipX: boolean, screenTurn: number}|null} null when no quarter
 */
export function raptorHit(angle) {
	const q = quadrant(angle);
	if (q < 0) {
		return null;
	}
	const flipX = q === 1 || q === 2;
	return { flipX, screenTurn: wrap(angle + (flipX ? -180 : 0)) };
}

/**
 * Low Flight's swoop on the target.
 *
 * @param {number} angle screen angle, caster to target
 * @returns {{art: string, flipX: boolean, flipY: boolean, screenTurn: number}|null}
 *   art is 'vertical' or 'horizontal'
 */
export function lowFlight(angle) {
	const q = quadrant(angle);
	if (q < 0) {
		return null;
	}
	if (q === 0 || q === 2) {
		// Below: mirrored top to bottom and turned back three quarters
		const below = q === 0;
		return { art: 'vertical', flipX: false, flipY: below, screenTurn: wrap(angle + (below ? -270 : -90)) };
	}
	// Right: mirrored side to side; left: turned back half a circle
	const right = q === 3;
	return { art: 'horizontal', flipX: right, flipY: false, screenTurn: wrap(angle + (right ? 0 : -180)) };
}

/** Sharpen Hail: waves, the time between them, and how far a shot strays. */
export const HAIL_WAVES = 5;
export const HAIL_WAVE_MS = 200;
export const HAIL_STEP = 4;

/**
 * Sharpen Hail's shots around the target.
 *
 * @param {function} rand returns a non-negative integer, like C's rand()
 * @returns {Array<{dx: number, dy: number, delay: number}>} dx along the
 *   world's x, dy the height (negative is up), world units
 */
export function hailShots(rand) {
	const shots = [];
	for (let wave = 0; wave < HAIL_WAVES; wave++) {
		const count = Math.max(5, rand() % 8);
		for (let k = 0; k < count; k++) {
			const delay = wave * HAIL_WAVE_MS + Math.round((k * HAIL_WAVE_MS) / count);
			const away = rand() % 2 === 1;
			const b = rand() % 6;
			const a = rand() % 6;
			const sign = away ? -1 : 1;
			shots.push({ dx: sign * a * HAIL_STEP, dy: sign * b * HAIL_STEP, delay });
		}
	}
	return shots;
}

/** Sharpen Gust's spray: reach and spacing (world units), row start times. */
export const GUST_REACH = 35;
export const GUST_SPACING = 7.5;
export const GUST_ROW_MS = [150, 275, 400];
export const GUST_JITTER = [0, 0.1, -0.1];

/**
 * Sharpen Gust's attack_02 copies, ahead of the caster toward the target.
 *
 * @param {number[]} from caster's world position [x, height, z]
 * @param {number[]} to target's world position [x, height, z]
 * @param {function} rand returns a non-negative integer, like C's rand()
 * @returns {Array<{x: number, y: number, z: number, delay: number, scale: number}>}
 */
export function gustSpray(from, to, rand) {
	const dx = to[0] - from[0];
	const dy = to[1] - from[1];
	const dz = to[2] - from[2];
	const length = Math.hypot(dx, dy, dz);
	if (!length) {
		return [];
	}
	// Ahead, GUST_REACH long; across, flat on the ground, GUST_SPACING long
	const ax = (dx / length) * GUST_REACH;
	const ay = (dy / length) * GUST_REACH;
	const az = (dz / length) * GUST_REACH;
	const across = Math.hypot(az, ax) || 1;
	const cx = (-az / across) * GUST_SPACING;
	const cz = (ax / across) * GUST_SPACING;

	const copies = [];
	GUST_ROW_MS.forEach((rowMs, row) => {
		const ahead = (row + 1) / GUST_ROW_MS.length;
		const count = 1 + 2 * row;
		for (let j = 0; j < count; j++) {
			if (rand() % 2 !== 0) {
				continue; // half of them are left out
			}
			const jitter = GUST_JITTER[rand() % 3];
			const side = j - row;
			const delay = (rand() % 101) + rowMs;
			const scale = Math.max(7, rand() % 11) * 0.1;
			copies.push({
				x: from[0] + ax * (ahead + jitter) + cx * side,
				y: from[1] + ay * (ahead + jitter),
				z: from[2] + az * (ahead + jitter) + cz * side,
				delay,
				scale
			});
		}
	});
	return copies;
}

/**
 * Low Flight's start, ms: the caster's current motion played through
 * (frames x motion speed in 25 ms units), as the client counts it in 16 ms
 * steps.
 *
 * @param {number} frames frames in the caster's current action
 * @param {number} motionSpeed ACT units of 25 ms
 */
export function lowFlightDelay(frames, motionSpeed) {
	return Math.max(0, frames * motionSpeed * 16);
}
