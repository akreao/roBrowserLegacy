/**
 * DB/Effects/AgilityEffect.js
 *
 * Increase AGI (37, EF_INCAGILITY) and Decrease AGI (38, EF_DECAGILITY) as the
 * official client (kRO 2025-07-16) draws them. Spec: effect-port/agility-streaks.md.
 *
 * - The sound on tick 0.
 * - agi_up.bmp (37) rising up the screen from the feet, or slow.bmp (38)
 *   sinking from 80 px above them, fading in over 15 ticks and out over the
 *   last 15.
 * - A thin ac_center2 streak every second tick (50 in all), 2 to 8 units from
 *   the owner in a random direction: rising from the ground (37) or falling
 *   from 20 units up (38), each living 50 ticks.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { PRIM_TICK_MS, UNITS_PER_CELL } from 'Renderer/Effects/EffectPrimSim.js';

/** Sprite pixels per client unit (35 a cell). */
const PX = 35 / UNITS_PER_CELL;

/** Effect lifetime, ticks. */
export const LIFE = 100;

/** Streak numbers. */
export const STREAK = { count: 50, every: 2, life: 50, alphaMax: 200, alphaStep: 10, fadeStart: 30, halfWidth: 0.18 };

/** The two pictures' numbers, by effect. */
export const BILLBOARD = {
	37: { file: 'effect/agi_up.bmp', width: 80, height: 40, start: 0, speed: 1.5, accel: -(1.5 / LIFE) * 1.2 },
	38: { file: 'effect/slow.bmp', width: 80, height: 20, start: 80, speed: -1, accel: 1 / LIFE }
};

const r = (random, k) => Math.floor(random() * k);

/**
 * The 50 streaks of one effect.
 *
 * @param {boolean} rising 37 (true) or 38 (false)
 * @param {function} [random] returns a number in [0, 1)
 * @return {Array<object>}
 */
export function planStreaks(rising, random = Math.random) {
	const streaks = [];
	for (let i = 0; i < STREAK.count; i++) {
		const heading = (r(random, 360) * Math.PI) / 180;
		const dist = 2 + r(random, 7);
		streaks.push({
			spawn: i * STREAK.every,
			x: Math.sin(heading) * dist,
			y: Math.cos(heading) * dist,
			halfLength: (30 + r(random, 60)) / 10,
			rising,
			speed: rising ? (20 + r(random, 50)) / 100 : 0
		});
	}
	return streaks;
}

/**
 * Alpha (0-255) of a streak on its tick `age` (updated before drawing, 1 on the first).
 *
 * @param {number} age
 * @return {number}
 */
export function streakAlpha(age) {
	if (age < STREAK.fadeStart) {
		return Math.min(STREAK.alphaMax, STREAK.alphaStep * age);
	}
	return Math.max(0, (STREAK.alphaMax * (STREAK.life - age)) / (STREAK.life - STREAK.fadeStart));
}

/**
 * Height (units) of a streak's centre on its tick `age`.
 *
 * @param {object} streak
 * @param {number} age
 * @return {number}
 */
export function streakHeight(streak, age) {
	if (streak.rising) {
		return streak.speed * age;
	}
	return 20 - (0.015 * age * (age + 1)) / 2;
}

/**
 * The picture's offset up the screen (pixels) on tick `age`.
 *
 * @param {number} effectId 37 or 38
 * @param {number} age
 * @return {number}
 */
export function billboardRise(effectId, age) {
	const b = BILLBOARD[effectId];
	// speed changes before the move, each tick
	let rise = b.start;
	let speed = b.speed;
	for (let t = 1; t <= age; t++) {
		speed += b.accel;
		rise += speed;
	}
	return rise;
}

/**
 * Alpha (0-255) of the picture on tick `age`.
 *
 * @param {number} age
 * @return {number}
 */
export function billboardAlpha(age) {
	if (age < LIFE - 15) {
		return Math.min(200, (200 / 15) * age);
	}
	return Math.max(0, (200 * (LIFE - age)) / 15);
}

function streakEffect(streak) {
	return {
		type: '3D',
		file: 'effect/ac_center2.tga',
		// One texture for every streak of every cast
		sharedTexture: true,
		attachedEntity: true,
		alphaMax: 1,
		duration: STREAK.life * PRIM_TICK_MS,
		zIndex: 0,
		track(age) {
			if (age >= STREAK.life) {
				return null;
			}
			return {
				x: streak.x / UNITS_PER_CELL,
				y: streak.y / UNITS_PER_CELL,
				z: streakHeight(streak, age) / UNITS_PER_CELL,
				sizeX: 2 * STREAK.halfWidth * PX,
				sizeY: 2 * streak.halfLength * PX,
				alpha: streakAlpha(age) / 255
			};
		}
	};
}

function billboardEffect(effectId) {
	const b = BILLBOARD[effectId];
	return {
		type: '3D',
		file: b.file,
		sharedTexture: true,
		attachedEntity: true,
		alphaMax: 1,
		duration: LIFE * PRIM_TICK_MS,
		overlay: true,
		zIndex: 10,
		track(age) {
			if (age >= LIFE) {
				return null;
			}
			return {
				sizeX: b.width,
				sizeY: b.height,
				offsetY: -billboardRise(effectId, age),
				alpha: billboardAlpha(age) / 255
			};
		}
	};
}

function agilityRow(effectId, wav) {
	return [
		{ wav, attachedEntity: true },
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				this.spamEffect({
					effect: billboardEffect(effectId),
					Inst: { effectID: effectId, duplicateID: 0, startTick: Params.Inst.startTick },
					Init: Params.Init
				});
				planStreaks(effectId === 37).forEach((streak, i) => {
					this.spamEffect({
						effect: streakEffect(streak),
						Inst: {
							effectID: effectId,
							duplicateID: i + 1,
							startTick: Params.Inst.startTick + streak.spawn * PRIM_TICK_MS
						},
						Init: Params.Init
					});
				});
			}
		}
	];
}

/** EffectTable row for 37 (EF_INCAGILITY). */
export const increaseAgilityEffect = agilityRow(37, 'effect/ef_incagility');

/** EffectTable row for 38 (EF_DECAGILITY). */
export const decreaseAgilityEffect = agilityRow(38, 'effect/ef_decagility');
