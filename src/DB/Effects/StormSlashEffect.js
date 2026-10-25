/**
 * DB/Effects/StormSlashEffect.js
 *
 * Storm Slash (DK_STORMSLASH), played like the official client: the stage
 * art matches the skill level (stormslash_1 to stormslash_5), on the caster.
 * The art starts a little after the cast, later for a slower attack motion,
 * and one slash sound plays per level, a quarter second apart.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import Client from 'Core/Client.js';
import SoundManager from 'Audio/SoundManager.js';
import Events from 'Core/Events.js';

/** Stages the client ships art for. */
export const STAGE_COUNT = 5;

/** Official ticks run at 60 Hz. */
const TICK_MS = 1000 / 60;

/** One slash sound every 15 ticks. */
export const SOUND_GAP_MS = 15 * TICK_MS;

/** Slash sounds dk_stormslash1 to dk_stormslash4, one picked at random each time. */
export const SOUND_VARIANTS = 4;

/** Motion speed used when the caster's sprite is not loaded: a 100 ms frame. */
const DEFAULT_MOTION_SPEED = 4;

/**
 * The caster's motion speed in ACT units (one unit is 25 ms of frame delay).
 *
 * @param {object} entity caster
 * @return {number}
 */
export function motionSpeed(entity) {
	if (entity && entity.animation && entity.animation.speed > 0) {
		return entity.animation.speed / 25;
	}
	const file = entity && entity.files && entity.files.body && entity.files.body.act;
	const act = file ? Client.loadFile(file) : null;
	if (act && act.actions && act.actions.length) {
		const action = act.actions[(entity.action * 8) % act.actions.length];
		if (action && action.delay > 0) {
			return action.delay / 25;
		}
	}
	return DEFAULT_MOTION_SPEED;
}

/**
 * How long after the cast the stage art starts: motion speed x 50 + 30 ms,
 * counted in whole ticks, plus the tick the effect is created on.
 *
 * @param {number} speed motion speed in ACT units
 * @return {number} ms
 */
export function startDelay(speed) {
	const ms = Math.trunc(speed * 50 + 30);
	return (Math.trunc(ms / 16) + 1) * TICK_MS;
}

/**
 * delayStart of a stage layer, worked out from its caster.
 *
 * @param {object} Params effect params
 * @return {number} ms
 */
export function stageDelay(Params) {
	return startDelay(motionSpeed(Params.Init.ownerEntity));
}

/**
 * The art for one stage.
 *
 * @param {number} stage 1 to 5
 * @return {object} STR layer
 */
export function stageLayer(stage) {
	return {
		type: 'STR',
		file: 'dragon_knight/dk_stormslash/stormslash/stormslash_' + stage,
		min: 'dragon_knight/dk_stormslash/stormslash/min_stormslash_' + stage,
		texturePath: 'dragon_knight/dk_stormslash/stormslash/',
		fallback: ['stormslash/stormslash/stormslash_' + stage],
		yOffset: 8,
		delayStart: stageDelay,
		attachedEntity: true
	};
}

/**
 * Sound layer for one stage: as many slash sounds as the stage number.
 *
 * @param {number} stage 1 to 5
 * @param {function} [random] returns a number in [0, 1)
 * @return {object} FUNC layer
 */
export function soundLayer(stage, random = Math.random) {
	return {
		type: 'FUNC',
		attachedEntity: true,
		func: function StormSlashSounds(Params) {
			const position = Params.Init.ownerEntity.position;
			for (let i = 0; i < stage; ++i) {
				const n = 1 + Math.floor(random() * SOUND_VARIANTS);
				Events.setTimeout(function () {
					SoundManager.playPosition('effect/dk_stormslash' + n + '.wav', position);
				}, i * SOUND_GAP_MS);
			}
		}
	};
}

/**
 * EffectTable rows ef_dk_stormslash_1 to ef_dk_stormslash_5.
 *
 * @return {object}
 */
export function stormSlashEffects() {
	const rows = {};
	for (let stage = 1; stage <= STAGE_COUNT; ++stage) {
		rows['ef_dk_stormslash_' + stage] = [stageLayer(stage), soundLayer(stage)];
	}
	return rows;
}

/** SkillEffect field: the stage names, indexed by skill level - 1. */
export const STAGE_EFFECTS = Array.from({ length: STAGE_COUNT }, (_, k) => 'ef_dk_stormslash_' + (k + 1));

export default { STAGE_COUNT, SOUND_GAP_MS, motionSpeed, startDelay, stageDelay, stormSlashEffects, STAGE_EFFECTS };
