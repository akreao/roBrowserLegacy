/**
 * @module DB/Effects/Table/ef_ske
 *
 * The effect table's named ef_ske_* rows. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep a skill's rows together.
 */

import { spawnSkySunBursts } from 'DB/Effects/SkySunEffect.js';
import Renderer from 'Renderer/Renderer.js';

export default {
	// Rising Sun (EFST_RISING_SUN): a sun burst when the status starts,
	// then a sun circle under the caster until it ends. See StatusEffectTable.js.
	ef_ske_rising_sun_00: [
		{
			type: 'STR',
			file: 'sky_emperor/ske_rising_sun/ske_rising_sun_00',
			texturePath: 'sky_emperor/ske_rising_sun/',
			min: 'sky_emperor/ske_rising_sun/min_ske_rising_sun_00',
			wav: 'effect/sky_emperor/ske_rising_sun_moon',
			yOffset: 13,
			renderBeforeEntities: true,
			attachedEntity: true
		}
	],

	ef_ske_rising_sun_01: [
		{
			type: 'STR',
			file: 'sky_emperor/ske_rising_sun/ske_rising_sun_01',
			texturePath: 'sky_emperor/ske_rising_sun/',
			min: 'sky_emperor/ske_rising_sun/min_ske_rising_sun_01',
			repeat: true,
			delayStart: 336,
			yOffset: 13,
			renderBeforeEntities: true,
			attachedEntity: true
		}
	],

	// Noon Sun (EFST_NOON_SUN), Rising Sun's second stage: same pattern.
	ef_ske_rising_sun_02: [
		{
			type: 'STR',
			file: 'sky_emperor/ske_rising_sun/ske_rising_sun_02',
			texturePath: 'sky_emperor/ske_rising_sun/',
			min: 'sky_emperor/ske_rising_sun/min_ske_rising_sun_02',
			wav: 'effect/sky_emperor/ske_rising_sun_moon',
			yOffset: 13,
			renderBeforeEntities: true,
			attachedEntity: true
		}
	],

	ef_ske_rising_sun_03: [
		{
			type: 'STR',
			file: 'sky_emperor/ske_rising_sun/ske_rising_sun_03',
			texturePath: 'sky_emperor/ske_rising_sun/',
			min: 'sky_emperor/ske_rising_sun/min_ske_rising_sun_03',
			repeat: true,
			delayStart: 656,
			yOffset: 13,
			renderBeforeEntities: true,
			attachedEntity: true
		}
	],

	// Sunset Sun (EFST_SUNSET_SUN), Rising Sun's third stage: same pattern.
	ef_ske_rising_sun_04: [
		{
			type: 'STR',
			file: 'sky_emperor/ske_rising_sun/ske_rising_sun_04',
			texturePath: 'sky_emperor/ske_rising_sun/',
			min: 'sky_emperor/ske_rising_sun/min_ske_rising_sun_04',
			wav: 'effect/sky_emperor/ske_rising_sun_moon',
			yOffset: 13,
			renderBeforeEntities: true,
			attachedEntity: true
		}
	],

	ef_ske_rising_sun_05: [
		{
			type: 'STR',
			file: 'sky_emperor/ske_rising_sun/ske_rising_sun_05',
			texturePath: 'sky_emperor/ske_rising_sun/',
			min: 'sky_emperor/ske_rising_sun/min_ske_rising_sun_05',
			repeat: true,
			delayStart: 656,
			yOffset: 13,
			renderBeforeEntities: true,
			attachedEntity: true
		}
	],

	// Noon Blast (SKE_NOON_BLAST), from the client's own effect folders.
	ef_ske_noon_blast: [
		{
			type: 'STR',
			file: 'sky_emperor/ske_noon_blast/ske_noon_blast',
			texturePath: 'sky_emperor/ske_noon_blast/',
			min: 'sky_emperor/ske_noon_blast/min_ske_noon_blast',
			wav: 'effect/sky_emperor/ske_noon_blast',
			attachedEntity: true,
			yOffset: 13
		}
	],

	// Sunset Blast (SKE_SUNSET_BLAST), from the client's own effect folders.
	ef_ske_sunset_blast: [
		{
			type: 'STR',
			file: 'sky_emperor/ske_sunset_blast/sunset_blast',
			texturePath: 'sky_emperor/ske_sunset_blast/',
			min: 'sky_emperor/ske_sunset_blast/min_sunset_blast',
			wav: 'effect/sky_emperor/ske_sunset_blast',
			attachedEntity: true,
			yOffset: 10
		}
	],

	// Sunset Blast's six small blasts, 32 ms apart, each on the ground within about 3 cells of the target.
	ef_ske_sunset_blast_small: [
		{
			type: 'STR',
			file: 'sky_emperor/ske_sunset_blast/sunset_blast_small',
			texturePath: 'sky_emperor/ske_sunset_blast/',
			min: 'sky_emperor/ske_sunset_blast/min_sunset_blast_small',
			wav: 'effect/sky_emperor/ske_sunset_blast_small',
			yOffset: 10,
			duplicate: 6,
			timeBetweenDupli: 32,
			groundScatter: 15
		}
	],

	// Rising Moon (SKE_RISING_MOON) stances. Each stance plays a burst when it
	// starts, then loops its emblem on the caster until it ends (StatusEffectTable.js).
	// RISING_MOON
	ef_ske_rising_moon_00: [
		{
			type: 'STR',
			file: 'sky_emperor/ske_rising_moon/ske_rising_moon_00',
			texturePath: 'sky_emperor/ske_rising_moon/',
			min: 'sky_emperor/ske_rising_moon/min_ske_rising_moon_00',
			wav: 'effect/sky_emperor/ske_rising_sun_moon',
			yOffset: 13,
			renderBeforeEntities: true,
			attachedEntity: true
		}
	],

	ef_ske_rising_moon_01: [
		{
			type: 'STR',
			file: 'sky_emperor/ske_rising_moon/ske_rising_moon_01',
			texturePath: 'sky_emperor/ske_rising_moon/',
			min: 'sky_emperor/ske_rising_moon/min_ske_rising_moon_01',
			repeat: true,
			delayStart: 336,
			yOffset: 13,
			renderBeforeEntities: true,
			attachedEntity: true
		}
	],

	// MIDNIGHT_MOON
	ef_ske_rising_moon_02: [
		{
			type: 'STR',
			file: 'sky_emperor/ske_rising_moon/ske_rising_moon_02',
			texturePath: 'sky_emperor/ske_rising_moon/',
			min: 'sky_emperor/ske_rising_moon/min_ske_rising_moon_02',
			wav: 'effect/sky_emperor/ske_rising_sun_moon',
			yOffset: 13,
			renderBeforeEntities: true,
			attachedEntity: true
		}
	],

	ef_ske_rising_moon_03: [
		{
			type: 'STR',
			file: 'sky_emperor/ske_rising_moon/ske_rising_moon_03',
			texturePath: 'sky_emperor/ske_rising_moon/',
			min: 'sky_emperor/ske_rising_moon/min_ske_rising_moon_03',
			repeat: true,
			delayStart: 656,
			yOffset: 13,
			renderBeforeEntities: true,
			attachedEntity: true
		}
	],

	// DAWN_MOON
	ef_ske_rising_moon_04: [
		{
			type: 'STR',
			file: 'sky_emperor/ske_rising_moon/ske_rising_moon_04',
			texturePath: 'sky_emperor/ske_rising_moon/',
			min: 'sky_emperor/ske_rising_moon/min_ske_rising_moon_04',
			wav: 'effect/sky_emperor/ske_rising_sun_moon',
			yOffset: 13,
			renderBeforeEntities: true,
			attachedEntity: true
		}
	],

	ef_ske_rising_moon_05: [
		{
			type: 'STR',
			file: 'sky_emperor/ske_rising_moon/ske_rising_moon_05',
			texturePath: 'sky_emperor/ske_rising_moon/',
			min: 'sky_emperor/ske_rising_moon/min_ske_rising_moon_05',
			repeat: true,
			delayStart: 656,
			yOffset: 13,
			renderBeforeEntities: true,
			attachedEntity: true
		}
	],

	// Midnight Kick (SKE_MIDNIGHT_KICK): EZ2 effect "ske_midnight_kick", played once on the caster when the skill is used.
	ef_ske_midnight_kick: [
		{
			type: 'STR',
			file: 'sky_emperor/ske_midnight_kick/ske_midnight_kick',
			texturePath: 'sky_emperor/ske_midnight_kick/',
			min: 'sky_emperor/ske_midnight_kick/min_ske_midnight_kick',
			wav: 'effect/sky_emperor/ske_midnight_kick',
			attachedEntity: true,
			yOffset: 10
		}
	],

	// Dawn Break (SKE_DAWN_BREAK): EZ2 effect "ske_dawn_break", played once on the
	// caster when the skill is used (PosY 7).
	ef_ske_dawn_break: [
		{
			type: 'STR',
			file: 'sky_emperor/ske_dawn_break/ske_dawn_break',
			texturePath: 'sky_emperor/ske_dawn_break/',
			min: 'sky_emperor/ske_dawn_break/min_ske_dawn_break',
			wav: 'effect/sky_emperor/ske_dawn_break',
			attachedEntity: true,
			renderBeforeEntities: true,
			yOffset: 7
		}
	],

	// Twinkling Galaxy (SKE_TWINKLING_GALAXY): the field, official effect 2349.
	// Drops a star at a random point of the field every 18 ticks (300 ms).
	// Field width by skill level: 13, 13, 11, 11, 9 cells.
	ef_ske_twinkling_galaxy_field: [
		{
			type: 'AREA_SPAWN',
			spawnEffectId: 'ef_ske_twinkling_galaxy_star',
			interval: 300,
			areaByLevel: [13, 13, 11, 11, 9]
		}
	],

	// One Twinkling Galaxy star: the falling star, its landing on the floor, and the Star Cannon sound.
	ef_ske_twinkling_galaxy_star: [
		{
			type: 'STR',
			file: 'sky_emperor/ske_twinkling_galaxy/twinkling_galaxy_bottom/ske_twinkling_galaxy_bottom',
			texturePath: 'sky_emperor/ske_twinkling_galaxy/twinkling_galaxy_bottom/',
			min: 'sky_emperor/ske_twinkling_galaxy/twinkling_galaxy_bottom/min_ske_twinkling_galaxy_bottom',
			renderBeforeEntities: true
		},
		{
			type: 'STR',
			file: 'sky_emperor/ske_twinkling_galaxy/twinkling_galaxy/ske_twinkling_galaxy03',
			texturePath: 'sky_emperor/ske_twinkling_galaxy/twinkling_galaxy/',
			min: 'sky_emperor/ske_twinkling_galaxy/twinkling_galaxy/min_ske_twinkling_galaxy03',
			wav: 'effect/sky_emperor/ske_star_cannon'
		}
	],

	// Star Burst (SKE_STAR_BURST), from the client's own effect folders.
	ef_ske_star_burst: [
		{
			wav: 'effect/sky_emperor/ske_star_burst',
			attachedEntity: true
		}
	],

	// Star Cannon (SKE_STAR_CANNON): the ground unit, official effect 2350.
	// Drops a star at a random point every 18 ticks (300 ms) while the unit exists.
	// Area width by skill level: 13, 13, 11, 11, 9 cells.
	ef_ske_star_cannon_field: [
		{
			type: 'AREA_SPAWN',
			spawnEffectId: 'ef_ske_star_cannon_star',
			interval: 300,
			areaByLevel: [13, 13, 11, 11, 9]
		}
	],

	// One Star Cannon star: the falling star, its landing on the floor, and its sound.
	ef_ske_star_cannon_star: [
		{
			type: 'STR',
			file: 'sky_emperor/ske_star_cannon/star_cannon/ske_star_cannon',
			texturePath: 'sky_emperor/ske_star_cannon/star_cannon/',
			min: 'sky_emperor/ske_star_cannon/star_cannon/min_ske_star_cannon',
			wav: 'effect/sky_emperor/ske_star_cannon'
		},
		{
			type: 'STR',
			file: 'sky_emperor/ske_star_cannon/star_cannon_bottom/ske_star_cannon_bottom',
			texturePath: 'sky_emperor/ske_star_cannon/star_cannon_bottom/',
			min: 'sky_emperor/ske_star_cannon/star_cannon_bottom/min_ske_star_cannon_bottom',
			renderBeforeEntities: true
		}
	],

	// All in the Sky (SKE_ALL_IN_THE_SKY), from the client's own effect folders.
	ef_ske_all_in_the_sky: [
		{
			type: 'STR',
			file: 'sky_emperor/ske_all_in_the_sky/ske_all_in_the_sky',
			texturePath: 'sky_emperor/ske_all_in_the_sky/',
			min: 'sky_emperor/ske_all_in_the_sky/min_ske_all_in_the_sky',
			wav: 'effect/sky_emperor/ske_all_in_the_sky',
			attachedEntity: true,
			xOffset: 1,
			yOffset: 3
		}
	],

	// Enchanting Sky (SKE_ENCHANTING_SKY): shown by the Sky Enchant status, as in the
	// official client. Burst with the sound when the status starts (EZ2 ske_enchanting_sky_00).
	// Both parts are floor effects (EZ2 IsFloor), drawn under the player.
	ef_ske_enchanting_sky: [
		{
			type: 'STR',
			file: 'sky_emperor/ske_enchanting_sky/ske_enchanting_sky_00',
			texturePath: 'sky_emperor/ske_enchanting_sky/',
			min: 'sky_emperor/ske_enchanting_sky/min_ske_enchanting_sky_00',
			wav: 'effect/sky_emperor/ske_enchanting_sky',
			yOffset: 13,
			renderBeforeEntities: true,
			attachedEntity: true
		}
	],

	// Enchanting Sky loop while the status lasts (EZ2 ske_enchanting_sky_01): starts 320 ms
	// in, where the burst ends, and replays until the status ends.
	ef_ske_enchanting_sky_loop: [
		{
			type: 'STR',
			file: 'sky_emperor/ske_enchanting_sky/ske_enchanting_sky_01',
			texturePath: 'sky_emperor/ske_enchanting_sky/',
			min: 'sky_emperor/ske_enchanting_sky/min_ske_enchanting_sky_01',
			delayStart: 320,
			repeat: true,
			yOffset: 13,
			renderBeforeEntities: true,
			attachedEntity: true
		}
	],

	// Sky Sun (SKE_SKY_SUN), as the official client plays it: the sun on the
	// caster, then six small bursts scattered around them (SkySunEffect.js).
	// Offsets and draw order follow DBManager.mergeEz2Effects for the EZ2 rows.
	ef_ske_sky_sun: [
		{
			type: 'STR',
			file: 'sky_emperor/ske_sky_sun/sky_sun/sky_sun',
			texturePath: 'sky_emperor/ske_sky_sun/sky_sun/',
			min: 'sky_emperor/ske_sky_sun/sky_sun/min_sky_sun',
			wav: 'effect/sky_emperor/ske_sky_sun',
			yOffset: 10,
			renderBeforeEntities: true,
			attachedEntity: true
		},
		{
			type: 'FUNC',
			func: spawnSkySunBursts
		}
	],

	// Sky Sun (SKE_SKY_SUN), on each target hit.
	ef_ske_sky_sun_hit: [
		{
			type: 'STR',
			file: 'sky_emperor/ske_sky_sun/sky_sun_hit/sky_sun_hit',
			texturePath: 'sky_emperor/ske_sky_sun/sky_sun_hit/',
			min: 'sky_emperor/ske_sky_sun/sky_sun_hit/min_sky_sun_hit',
			yOffset: 8,
			attachedEntity: true
		}
	],

	// Sky Moon (SKE_SKY_MOON), as the official client plays it (EZ2 effects
	// sky_moon, sky_moon_bottom): on the target once when the skill is used.
	ef_ske_sky_moon: [
		{
			type: 'STR',
			file: 'sky_emperor/ske_sky_moon/sky_moon/sky_moon',
			texturePath: 'sky_emperor/ske_sky_moon/sky_moon/',
			min: 'sky_emperor/ske_sky_moon/sky_moon/min_sky_moon',
			wav: 'effect/sky_emperor/ske_sky_moon',
			yOffset: 10,
			attachedEntity: true
		},
		{
			type: 'STR',
			file: 'sky_emperor/ske_sky_moon/sky_moon_bottom/sky_moon_bottom',
			texturePath: 'sky_emperor/ske_sky_moon/sky_moon_bottom/',
			min: 'sky_emperor/ske_sky_moon/sky_moon_bottom/min_sky_moon_bottom',
			yOffset: 10,
			renderBeforeEntities: true,
			attachedEntity: true
		}
	],

	// Sky Moon cast (EZ2 sky_moon_cast, sky_moon_cast_bottom): on the caster,
	// looping until the cast time ends.
	ef_ske_sky_moon_cast: [
		{
			type: 'STR',
			file: 'sky_emperor/ske_sky_moon/sky_moon_cast/sky_moon_cast',
			texturePath: 'sky_emperor/ske_sky_moon/sky_moon_cast/',
			min: 'sky_emperor/ske_sky_moon/sky_moon_cast/min_sky_moon_cast',
			wav: 'effect/ef_beginspell',
			soundLoop: false,
			castLoop: true,
			yOffset: 10,
			attachedEntity: true
		},
		{
			type: 'STR',
			file: 'sky_emperor/ske_sky_moon/sky_moon_cast_bottom/sky_moon_cast_bottom',
			texturePath: 'sky_emperor/ske_sky_moon/sky_moon_cast_bottom/',
			min: 'sky_emperor/ske_sky_moon/sky_moon_cast_bottom/min_sky_moon_cast_bottom',
			castLoop: true,
			yOffset: 10,
			renderBeforeEntities: true,
			attachedEntity: true
		}
	],

	// Sky Moon hit (EZ2 sky_moon_hit): on each damaged target.
	ef_ske_sky_moon_hit: [
		{
			type: 'STR',
			file: 'sky_emperor/ske_sky_moon/sky_moon_hit/sky_moon_hit',
			texturePath: 'sky_emperor/ske_sky_moon/sky_moon_hit/',
			min: 'sky_emperor/ske_sky_moon/sky_moon_hit/min_sky_moon_hit',
			wav: 'effect/sky_emperor/ske_sky_moon_hit',
			yOffset: 8,
			attachedEntity: true
		}
	],

	// Star Light Kick (SKE_STAR_LIGHT_KICK), as the official client plays it when
	// the skill is used: the falling star and the ground ring, both on the target
	// and following it. yOffset keeps the EZ2 rows' PosY (13 and 11).
	ef_ske_star_light_kick: [
		{
			type: 'STR',
			file: 'sky_emperor/ske_star_light_kick/star_light_kick/star_light_kick',
			texturePath: 'sky_emperor/ske_star_light_kick/star_light_kick/',
			min: 'sky_emperor/ske_star_light_kick/star_light_kick/min_star_light_kick',
			wav: 'effect/sky_emperor/ske_star_light_kick',
			attachedEntity: true,
			yOffset: 13
		},
		{
			type: 'STR',
			file: 'sky_emperor/ske_star_light_kick/star_light_kick_bottom/star_light_kick_bottom',
			texturePath: 'sky_emperor/ske_star_light_kick/star_light_kick_bottom/',
			min: 'sky_emperor/ske_star_light_kick/star_light_kick_bottom/min_star_light_kick_bottom',
			renderBeforeEntities: true,
			attachedEntity: true,
			yOffset: 11
		}
	],

	// Star Light Kick (SKE_STAR_LIGHT_KICK), official effect 2426 on the caster. It
	// draws nothing: 5 ticks in (60 Hz clock) it holds the caster on frame 5 of the
	// skill motion, the kick pose, and 35 ticks in it lets them go back to their stance,
	// unless something else moved them in between. Same pose as Flying Kick (457).
	ef_ske_star_light_kick_caster: [
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const entity = Params.Init.ownerEntity;
				const start = Params.Inst.startTick - Renderer.tick;
				const POSE_AT = 83; // 5 ticks
				const RELEASE_AT = 583; // 35 ticks
				let posed = false;

				if (!(entity.ACTION.SKILL >= 0)) {
					return;
				}

				entity.animations.add(function (tick) {
					const t = tick - start;
					if (!posed) {
						if (t < POSE_AT) {
							return false;
						}
						if (entity.action === entity.ACTION.DIE || entity.action === entity.ACTION.SIT) {
							return true;
						}
						entity.setAction({
							action: entity.ACTION.SKILL,
							frame: 5,
							repeat: false,
							play: false,
							next: false
						});
						posed = true;
						return false;
					}
					if (t < RELEASE_AT) {
						return false;
					}
					// Only let go of our own pose: walking, getting hit or dying in between wins.
					// Back to the combat stance, or standing for sprites without one.
					if (entity.action === entity.ACTION.SKILL && entity.animation.play === false && !entity.animation.next) {
						entity.setAction({
							action: entity.ACTION.READYFIGHT >= 0 ? entity.ACTION.READYFIGHT : entity.ACTION.IDLE,
							frame: 0,
							repeat: true,
							play: true,
							next: false
						});
					}
					return true;
				});
			}
		}
	],

	// Star Light Kick (SKE_STAR_LIGHT_KICK), on each target hit, with its own sound.
	ef_ske_star_light_kick_hit: [
		{
			type: 'STR',
			file: 'sky_emperor/ske_star_light_kick/star_light_kick_hit/star_light_kick_hit',
			texturePath: 'sky_emperor/ske_star_light_kick/star_light_kick_hit/',
			min: 'sky_emperor/ske_star_light_kick/star_light_kick_hit/min_star_light_kick_hit',
			wav: 'effect/sky_emperor/ske_star_light_kick_hit',
			attachedEntity: true,
			yOffset: 7
		}
	]
};
