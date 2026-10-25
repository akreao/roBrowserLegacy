/**
 * DB/Effects/HastyFireInTheHoleEffect.js
 *
 * Hasty Fire in the Hole (NW_HASTY_FIRE_IN_THE_HOLE), played like the official
 * client. When the skill lands, the client plays all three sizes of the blast
 * at the target cell, one after the other: the 5x5 art at once, the 7x7 art
 * 18 ticks (300 ms) later and the 9x9 art 18 ticks after that. Each size is
 * drawn above the ground and as a ring under the characters, with its own sound.
 *
 * rAthena sends the ground packet again for the second and third blast (the
 * official client plays all three from the first one), so repeats from the
 * same caster at the same cell are left out for a moment.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/** Official ticks run at 60 Hz. */
const TICK_MS = 1000 / 60;

const FOLDER = 'night_watch/nw_hasty_fire_in_the_hole/';

/** The three sizes, in the order they play. */
export const SIZES = ['5x5', '7x7', '9x9'];

/** Start delay the client gives each size, in ms. */
export const WAVE_DELAY_MS = [0, 288, 576];

/** How long a repeat ground packet from the same caster and cell is ignored, in ms. */
export const REPEAT_WINDOW_MS = 700;

/**
 * When a size starts: its delay counted in whole ticks, plus the tick the
 * effect is created on.
 *
 * @param {number} ms delay given by the client
 * @return {number} ms
 */
export function waveDelay(ms) {
	return (Math.trunc(ms / 16) + 1) * TICK_MS;
}

/**
 * One EZ2 row of the skill, at PosY 10.
 *
 * @param {string} folder top or floor folder
 * @param {string} size 5x5, 7x7 or 9x9
 * @param {number} delay ms
 * @return {object} STR layer
 */
function layer(folder, size, delay) {
	const path = FOLDER + folder + '/';
	return {
		type: 'STR',
		file: path + 'hasty_fire_in_the_hole_' + size,
		texturePath: path,
		min: path + 'min_hasty_fire_in_the_hole_' + size,
		xOffset: 0,
		yOffset: 10,
		delayStart: delay
	};
}

/**
 * EffectTable rows for the skill: top and floor for each size.
 *
 * @return {object}
 */
export function hastyFireInTheHoleEffects() {
	const rows = [];
	SIZES.forEach((size, wave) => {
		const delay = waveDelay(WAVE_DELAY_MS[wave]);
		rows.push(
			{
				...layer('hasty_fire_in_the_hole', size, delay),
				wav: 'effect/night_watch/nw_hasty_fire_in_the_hole_' + wave,
				delayWav: delay
			},
			{ ...layer('hasty_fire_in_the_hole_bottom', size, delay), renderBeforeEntities: true }
		);
	});
	return { ef_nw_hasty_fire_in_the_hole: rows };
}

/** Last blast per skill, caster and cell. */
const lastBlast = new Map();

/**
 * Whether a ground packet repeats one the same caster sent for the same skill
 * and cell less than windowMs ago. Remembers the packet when it does not.
 *
 * @param {number} skillId
 * @param {number} srcAID caster
 * @param {Array} position target cell
 * @param {number} windowMs
 * @param {number} [now] ms clock
 * @return {boolean}
 */
export function isRepeatGroundPacket(skillId, srcAID, position, windowMs, now = Date.now()) {
	const key = skillId + ':' + srcAID + ':' + (position ? position[0] + ',' + position[1] : '');
	const last = lastBlast.get(key);
	for (const [k, t] of lastBlast) {
		if (now - t >= windowMs) {
			lastBlast.delete(k);
		}
	}
	if (last !== undefined && now - last < windowMs) {
		return true;
	}
	lastBlast.set(key, now);
	return false;
}

export default { waveDelay, hastyFireInTheHoleEffects, isRepeatGroundPacket };
