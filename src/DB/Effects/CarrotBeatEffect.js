/**
 * DB/Effects/CarrotBeatEffect.js
 *
 * Lunatic Carrot Beat's carrots (official effects 1099, and 1111 when the
 * caster has the item), played where the target stands when the use packet
 * succeeds. The client drops 2n carrot sprites around that spot, n = 3 for
 * levels 1-2, 5 for 3-4 and 7 for 5, each at a random point of a 5n-unit
 * square, the i-th one i * trunc(105 / 2n) ticks late. Each plays once at
 * 4 ticks a frame and shakes the camera when it is 48 ticks old. Without the
 * item the carrots are drawn at alpha 100 of 255.
 * Spec: effect-port/summoner-skills.md.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import Camera from 'Renderer/Camera.js';
import Events from 'Core/Events.js';

/** Official effect clock: one tick is 1/60 s. */
const TICK_MS = 1000 / 60;

/** Official units in one roBrowser cell. */
const UNITS_PER_CELL = 5;

/**
 * Carrots per side of the square for a skill level (2n carrots are dropped).
 *
 * @param {number} level
 * @return {number}
 */
export function carrotBeatSize(level) {
	if (level >= 5) {
		return 7;
	}
	if (level >= 3) {
		return 5;
	}
	return 3;
}

/**
 * Where and when each carrot falls.
 *
 * @param {number} level skill level
 * @param {function} [random] numbers in [0, 1), Math.random by default
 * @return {object[]} { x, y } offset in cells, delay in ticks
 */
export function planCarrots(level, random = Math.random) {
	const n = carrotBeatSize(level);
	const span = n * UNITS_PER_CELL;
	const half = Math.floor(span / 2);
	const step = Math.trunc(105 / (2 * n));
	const carrots = [];
	for (let i = 0; i < 2 * n; ++i) {
		const x = Math.floor(random() * span) - half;
		const y = Math.floor(random() * span) - half;
		carrots.push({ x: x / UNITS_PER_CELL, y: y / UNITS_PER_CELL, delay: i * step });
	}
	return carrots;
}

/**
 * The FUNC row dropping the carrots.
 *
 * @param {string} carrotRow EffectTable row of one carrot
 * @return {object}
 */
function carrotShower(carrotRow) {
	return {
		type: 'FUNC',
		func: function (Params) {
			const at = Params.Inst.position;
			const position = [at[0], at[1], at[2]];
			planCarrots(Params.Init.skillLevel).forEach(drop => {
				Events.setTimeout(() => {
					this.spam({
						effectId: carrotRow,
						ownerAID: Params.Init.ownerAID,
						position: [position[0] + drop.x, position[1] + drop.y, position[2]]
					});
				}, drop.delay * TICK_MS);
			});
		}
	};
}

/**
 * One carrot: the sprite once, 4 ticks a frame, and the camera shake at 48 ticks.
 *
 * @param {number} [opacity]
 * @return {object[]}
 */
function carrot(opacity) {
	const sprite = {
		type: 'SPR',
		file: 'su_lunaticcarrotbeat/su_lunaticcarrotbeat',
		delayFrame: 4 * TICK_MS
	};
	if (opacity !== undefined) {
		sprite.opacity = opacity;
	}
	return [
		sprite,
		{
			type: 'FUNC',
			func: function (Params) {
				Camera.setQuake(Params.Inst.startTick + 48 * TICK_MS);
			}
		}
	];
}

/** EffectTable rows. */
export const carrotBeatEffects = {
	ef_su_lunaticcarrotbeat: [carrotShower('ef_su_lunaticcarrotbeat_carrot')],
	ef_su_lunaticcarrotbeat_carrot: carrot(100 / 255),
	ef_su_lunaticcarrotbeat2: [carrotShower('ef_su_lunaticcarrotbeat2_carrot')],
	ef_su_lunaticcarrotbeat2_carrot: carrot()
};
