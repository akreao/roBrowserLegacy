/**
 * Renderer/Effects/RecognizedSpellSim.js
 *
 * Recognized Spell's cast look (effect 803, EF_RECOGNIZED) as the official
 * client (kRO 2025-07-16, case 0xbbb278) draws it on the caster, without any
 * WebGL, so it can be tested on its own. Spec: effect-port/warlock-skills.md.
 *
 * - On ticks 1, 31, 61 ... 271 a skill icon appears: the icon of a random
 *   Mage skill (ids 9-20) or Wizard skill (80-92), each half the time.
 * - An icon is ten camera-facing copies of itself, 40 units above the
 *   caster, copy j (1-10) reaching 10 - j units further than the middle one;
 *   the middle one starts 5 units from its middle to a corner.
 * - Copy j brightens 13 a tick to its own cap (70, 90 ... for copies 1-9)
 *   for 19 ticks; then copies 1-9 fade 5 a tick, copy 10 holds at 247 until
 *   tick 25, then fades too while the icon grows 1% a tick.
 * - Drawn untinted, normal alpha blending.
 *
 * Units are the client's, 5 to a cell; ticks are 60 a second.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { UNITS_PER_CELL } from 'Renderer/Effects/EffectPrimSim.js';

/** Sprite pixels to a unit. */
const PX_PER_UNIT = 7;

/** The icons and their copies. */
export const ICONS = {
	count: 10,
	first: 1,
	every: 30,
	mage: [9, 20],
	wizard: [80, 92],
	copies: 10,
	height: 40,
	size: 5,
	spacing: 1,
	growth: 1.01,
	fadeIn: 13,
	fadeInEnd: 19,
	fadeOut: 5,
	lastCopyHold: 25
};

/**
 * The icons: start tick and skill id, in the order the client makes them.
 *
 * @param {function} [random] returns a number in [0, 1)
 * @return {Array<{start: number, skillId: number}>}
 */
export function planIcons(random = Math.random) {
	const icons = [];
	for (let i = 0; i < ICONS.count; i++) {
		const [lo, hi] = Math.floor(random() * 2) === 0 ? ICONS.mage : ICONS.wizard;
		icons.push({
			start: ICONS.first + ICONS.every * i,
			skillId: lo + Math.floor(random() * (hi - lo + 1))
		});
	}
	return icons;
}

/**
 * Copy j's alpha after `n` updates.
 *
 * @param {number} j 1-10
 * @param {number} n
 * @return {number}
 */
export function copyAlpha(j, n) {
	const peak = Math.min(ICONS.fadeIn * ICONS.fadeInEnd, 50 + 20 * j);
	if (n < ICONS.fadeInEnd + 1) {
		return Math.min(ICONS.fadeIn * Math.max(n, 0), peak);
	}
	const fadeFrom = j === ICONS.copies ? ICONS.lastCopyHold : ICONS.fadeInEnd;
	return Math.max(0, peak - ICONS.fadeOut * Math.max(0, n - fadeFrom));
}

/**
 * The icon's middle copy size (middle to corner, units) after `n` updates.
 *
 * @param {number} n
 * @return {number}
 */
export function iconSize(n) {
	const peak = ICONS.fadeIn * ICONS.fadeInEnd;
	const grows = Math.min(Math.max(n - ICONS.lastCopyHold, 0), Math.ceil(peak / ICONS.fadeOut) - 1);
	return ICONS.size * Math.pow(ICONS.growth, grows);
}

/** Updates an icon lasts. */
export const ICON_LIFE = (() => {
	let n = 1;
	while (copyAlpha(ICONS.copies, n) > 0 || n <= ICONS.fadeInEnd) {
		n++;
	}
	return n;
})();

/**
 * Copy j of an icon on tick `age` of its own (0 on its first draw), or null:
 * height in cells, side in sprite pixels, alpha (0-255).
 *
 * @param {number} j 1-10
 * @param {number} age ticks
 * @return {{z: number, size: number, alpha: number}|null}
 */
export function copyAt(j, age) {
	const n = Math.floor(age) + 1;
	const alpha = copyAlpha(j, n);
	if (alpha <= 0) {
		return null;
	}
	const half = iconSize(n) + ICONS.spacing * (ICONS.copies - j);
	return { z: ICONS.height / UNITS_PER_CELL, size: half * Math.SQRT2 * PX_PER_UNIT, alpha };
}
