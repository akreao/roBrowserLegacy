/**
 * @module DB/Effects/Table/ef_nw
 *
 * The effect table's named ef_nw_* rows. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep a skill's rows together.
 */

import { hastyFireInTheHoleEffects } from 'DB/Effects/HastyFireInTheHoleEffect.js';

export default {
	...hastyFireInTheHoleEffects(),

	// Intensive Aim (NW_INTENSIVE_AIM): the aim gauge. The Intensive Aim Count status
	// shows one stage per value (00 to 10), and the full glow at 10. See StatusEffectTable.js.
	ef_nw_intensive_aim_00: [
		{
			type: 'STR',
			file: 'night_watch/nw_intensive_aim/intensive_aim/intensive_aim_00',
			texturePath: 'night_watch/nw_intensive_aim/intensive_aim/',
			min: 'night_watch/nw_intensive_aim/intensive_aim/min_intensive_aim_00',
			repeat: true,
			xOffset: 8,
			yOffset: 7,
			attachedEntity: true
		}
	],

	ef_nw_intensive_aim_01: [
		{
			type: 'STR',
			file: 'night_watch/nw_intensive_aim/intensive_aim/intensive_aim_01',
			texturePath: 'night_watch/nw_intensive_aim/intensive_aim/',
			min: 'night_watch/nw_intensive_aim/intensive_aim/min_intensive_aim_01',
			wav: 'effect/night_watch/nw_intensive_aim',
			repeat: true,
			soundLoop: false,
			xOffset: 8,
			yOffset: 7,
			attachedEntity: true
		}
	],

	ef_nw_intensive_aim_02: [
		{
			type: 'STR',
			file: 'night_watch/nw_intensive_aim/intensive_aim/intensive_aim_02',
			texturePath: 'night_watch/nw_intensive_aim/intensive_aim/',
			min: 'night_watch/nw_intensive_aim/intensive_aim/min_intensive_aim_02',
			wav: 'effect/night_watch/nw_intensive_aim',
			repeat: true,
			soundLoop: false,
			xOffset: 8,
			yOffset: 7,
			attachedEntity: true
		}
	],

	ef_nw_intensive_aim_03: [
		{
			type: 'STR',
			file: 'night_watch/nw_intensive_aim/intensive_aim/intensive_aim_03',
			texturePath: 'night_watch/nw_intensive_aim/intensive_aim/',
			min: 'night_watch/nw_intensive_aim/intensive_aim/min_intensive_aim_03',
			wav: 'effect/night_watch/nw_intensive_aim',
			repeat: true,
			soundLoop: false,
			xOffset: 8,
			yOffset: 7,
			attachedEntity: true
		}
	],

	ef_nw_intensive_aim_04: [
		{
			type: 'STR',
			file: 'night_watch/nw_intensive_aim/intensive_aim/intensive_aim_04',
			texturePath: 'night_watch/nw_intensive_aim/intensive_aim/',
			min: 'night_watch/nw_intensive_aim/intensive_aim/min_intensive_aim_04',
			wav: 'effect/night_watch/nw_intensive_aim',
			repeat: true,
			soundLoop: false,
			xOffset: 8,
			yOffset: 7,
			attachedEntity: true
		}
	],

	ef_nw_intensive_aim_05: [
		{
			type: 'STR',
			file: 'night_watch/nw_intensive_aim/intensive_aim/intensive_aim_05',
			texturePath: 'night_watch/nw_intensive_aim/intensive_aim/',
			min: 'night_watch/nw_intensive_aim/intensive_aim/min_intensive_aim_05',
			wav: 'effect/night_watch/nw_intensive_aim',
			repeat: true,
			soundLoop: false,
			xOffset: 8,
			yOffset: 7,
			attachedEntity: true
		}
	],

	ef_nw_intensive_aim_06: [
		{
			type: 'STR',
			file: 'night_watch/nw_intensive_aim/intensive_aim/intensive_aim_06',
			texturePath: 'night_watch/nw_intensive_aim/intensive_aim/',
			min: 'night_watch/nw_intensive_aim/intensive_aim/min_intensive_aim_06',
			wav: 'effect/night_watch/nw_intensive_aim',
			repeat: true,
			soundLoop: false,
			xOffset: 8,
			yOffset: 7,
			attachedEntity: true
		}
	],

	ef_nw_intensive_aim_07: [
		{
			type: 'STR',
			file: 'night_watch/nw_intensive_aim/intensive_aim/intensive_aim_07',
			texturePath: 'night_watch/nw_intensive_aim/intensive_aim/',
			min: 'night_watch/nw_intensive_aim/intensive_aim/min_intensive_aim_07',
			wav: 'effect/night_watch/nw_intensive_aim',
			repeat: true,
			soundLoop: false,
			xOffset: 8,
			yOffset: 7,
			attachedEntity: true
		}
	],

	ef_nw_intensive_aim_08: [
		{
			type: 'STR',
			file: 'night_watch/nw_intensive_aim/intensive_aim/intensive_aim_08',
			texturePath: 'night_watch/nw_intensive_aim/intensive_aim/',
			min: 'night_watch/nw_intensive_aim/intensive_aim/min_intensive_aim_08',
			wav: 'effect/night_watch/nw_intensive_aim',
			repeat: true,
			soundLoop: false,
			xOffset: 8,
			yOffset: 7,
			attachedEntity: true
		}
	],

	ef_nw_intensive_aim_09: [
		{
			type: 'STR',
			file: 'night_watch/nw_intensive_aim/intensive_aim/intensive_aim_09',
			texturePath: 'night_watch/nw_intensive_aim/intensive_aim/',
			min: 'night_watch/nw_intensive_aim/intensive_aim/min_intensive_aim_09',
			wav: 'effect/night_watch/nw_intensive_aim',
			repeat: true,
			soundLoop: false,
			xOffset: 8,
			yOffset: 7,
			attachedEntity: true
		}
	],

	ef_nw_intensive_aim_10: [
		{
			type: 'STR',
			file: 'night_watch/nw_intensive_aim/intensive_aim/intensive_aim_10',
			texturePath: 'night_watch/nw_intensive_aim/intensive_aim/',
			min: 'night_watch/nw_intensive_aim/intensive_aim/min_intensive_aim_10',
			wav: 'effect/night_watch/nw_intensive_aim',
			xOffset: 8,
			yOffset: 7,
			attachedEntity: true
		}
	],

	// The full gauge: loops from 496 ms while the count is 10.
	ef_nw_intensive_aim_full: [
		{
			type: 'STR',
			file: 'night_watch/nw_intensive_aim/intensive_aim_full/intensiveaim_full',
			texturePath: 'night_watch/nw_intensive_aim/intensive_aim_full/',
			min: 'night_watch/nw_intensive_aim/intensive_aim_full/min_intensiveaim_full',
			repeat: true,
			delayStart: 496,
			xOffset: 8,
			yOffset: 7,
			attachedEntity: true
		}
	],

	// Played on the caster each time the skill is used.
	ef_nw_intensive_aim_helix: [
		{
			type: 'STR',
			file: 'night_watch/nw_intensive_aim/intensive_aim_helix/intensiveaim_helix',
			texturePath: 'night_watch/nw_intensive_aim/intensive_aim_helix/',
			min: 'night_watch/nw_intensive_aim/intensive_aim_helix/min_intensiveaim_helix',
			wav: 'effect/night_watch/nw_intensiveaim_helix',
			yOffset: 10,
			attachedEntity: true
		}
	],

	// Grenade Fragment (NW_GRENADE_FRAGMENT): one file per skill level, from the
	// EZ2 rows of the same name (PosY 10). See SkillEffect.js.
	ef_nw_grenade_fragment_water: [
		{
			type: 'STR',
			file: 'night_watch/nw_grenade_fragment/grenade_fragment_water/grenade_fragment_water',
			texturePath: 'night_watch/nw_grenade_fragment/grenade_fragment_water/',
			min: 'night_watch/nw_grenade_fragment/grenade_fragment_water/min_grenade_fragment_water',
			wav: 'effect/night_watch/nw_grenade_fragment_water',
			yOffset: 10,
			attachedEntity: true
		}
	],
	ef_nw_grenade_fragment_wind: [
		{
			type: 'STR',
			file: 'night_watch/nw_grenade_fragment/grenade_fragment_wind/grenade_fragment_wind',
			texturePath: 'night_watch/nw_grenade_fragment/grenade_fragment_wind/',
			min: 'night_watch/nw_grenade_fragment/grenade_fragment_wind/min_grenade_fragment_wind',
			wav: 'effect/night_watch/nw_grenade_fragment_wind',
			yOffset: 10,
			attachedEntity: true
		}
	],
	ef_nw_grenade_fragment_earth: [
		{
			type: 'STR',
			file: 'night_watch/nw_grenade_fragment/grenade_fragment_earth/grenade_fragment_earth',
			texturePath: 'night_watch/nw_grenade_fragment/grenade_fragment_earth/',
			min: 'night_watch/nw_grenade_fragment/grenade_fragment_earth/min_grenade_fragment_earth',
			wav: 'effect/night_watch/nw_grenade_fragment_earth',
			yOffset: 10,
			attachedEntity: true
		}
	],
	ef_nw_grenade_fragment_fire: [
		{
			type: 'STR',
			file: 'night_watch/nw_grenade_fragment/grenade_fragment_fire/grenade_fragment_fire',
			texturePath: 'night_watch/nw_grenade_fragment/grenade_fragment_fire/',
			min: 'night_watch/nw_grenade_fragment/grenade_fragment_fire/min_grenade_fragment_fire',
			wav: 'effect/night_watch/nw_grenade_fragment_fire',
			yOffset: 10,
			attachedEntity: true
		}
	],
	ef_nw_grenade_fragment_darkness: [
		{
			type: 'STR',
			file: 'night_watch/nw_grenade_fragment/grenade_fragment_darkness/grenade_fragment_darkness',
			texturePath: 'night_watch/nw_grenade_fragment/grenade_fragment_darkness/',
			min: 'night_watch/nw_grenade_fragment/grenade_fragment_darkness/min_grenade_fragment_darkness',
			wav: 'effect/night_watch/nw_grenade_fragment_darkness',
			yOffset: 10,
			attachedEntity: true
		}
	],
	ef_nw_grenade_fragment_saint: [
		{
			type: 'STR',
			file: 'night_watch/nw_grenade_fragment/grenade_fragment_saint/grenade_fragment_saint',
			texturePath: 'night_watch/nw_grenade_fragment/grenade_fragment_saint/',
			min: 'night_watch/nw_grenade_fragment/grenade_fragment_saint/min_grenade_fragment_saint',
			wav: 'effect/night_watch/nw_grenade_fragment_saint',
			yOffset: 10,
			attachedEntity: true
		}
	],
	ef_nw_grenade_fragment_reset: [
		{
			type: 'STR',
			file: 'night_watch/nw_grenade_fragment/grenade_fragment_reset/grenade_fragment_reset',
			texturePath: 'night_watch/nw_grenade_fragment/grenade_fragment_reset/',
			min: 'night_watch/nw_grenade_fragment/grenade_fragment_reset/min_grenade_fragment_reset',
			wav: 'effect/night_watch/nw_grenade_fragment_reset',
			yOffset: 10,
			attachedEntity: true
		}
	],

	// The Vigilante at Night (NW_THE_VIGILANTE_AT_NIGHT), from the client's own effect folders.
	ef_nw_the_vigilante_at_night: [
		{
			type: 'STR',
			file: 'night_watch/nw_the_vigilante_at_night/the_vigilante_at_night_bottom/the_vigilante_at_night_bottom',
			texturePath: 'night_watch/nw_the_vigilante_at_night/the_vigilante_at_night_bottom/',
			min: 'night_watch/nw_the_vigilante_at_night/the_vigilante_at_night_bottom/min_the_vigilante_at_night_bottom',
			renderBeforeEntities: true,
			yOffset: 10
		}
	],

	// Only One Bullet (NW_ONLY_ONE_BULLET), from the client's own effect folders.
	ef_nw_only_one_bullet: [
		{
			type: 'STR',
			file: 'night_watch/nw_only_one_bullet/only_one_bullet/only_one_bullet',
			texturePath: 'night_watch/nw_only_one_bullet/only_one_bullet/',
			min: 'night_watch/nw_only_one_bullet/only_one_bullet/min_only_one_bullet',
			wav: 'effect/night_watch/nw_only_one_bullet',
			yOffset: 10
		}
	],

	// Only One Bullet (NW_ONLY_ONE_BULLET), from the client's own effect folders.
	ef_nw_only_one_bullet_hit: [
		{
			type: 'STR',
			file: 'night_watch/nw_only_one_bullet/only_one_bullet_hit/only_one_bullet_hit',
			texturePath: 'night_watch/nw_only_one_bullet/only_one_bullet_hit/',
			min: 'night_watch/nw_only_one_bullet/only_one_bullet_hit/min_only_one_bullet_hit',
			wav: 'effect/NIGHT_WATCH/nw_only_one_bullet_hit',
			soundLoop: false,
			yOffset: 5
		}
	],

	// Spiral Shooting (NW_SPIRAL_SHOOTING), from the client's own effect folders.
	ef_nw_spiral_shooting: [
		{
			type: 'STR',
			file: 'night_watch/nw_spiral_shooting/spiral_shooting',
			texturePath: 'night_watch/nw_spiral_shooting/',
			min: 'night_watch/nw_spiral_shooting/min_spiral_shooting',
			wav: 'effect/night_watch/nw_spiral_shooting',
			yOffset: 10
		}
	],

	// Magazine for One (NW_MAGAZINE_FOR_ONE), from the client's own effect folders.
	ef_nw_magazine_for_one: [
		{
			type: 'STR',
			file: 'night_watch/nw_magazine_for_one/magazine_for_one',
			texturePath: 'night_watch/nw_magazine_for_one/',
			min: 'night_watch/nw_magazine_for_one/min_magazine_for_one',
			wav: 'effect/night_watch/nw_magazine_for_one',
			yOffset: 10
		}
	],

	// Wild Fire (NW_WILD_FIRE), from the client's own effect folders.
	ef_nw_wild_fire: [
		{
			type: 'STR',
			file: 'night_watch/nw_wild_fire/wild_fire/wild_fire',
			texturePath: 'night_watch/nw_wild_fire/wild_fire/',
			min: 'night_watch/nw_wild_fire/wild_fire/min_wild_fire',
			wav: 'effect/night_watch/nw_wild_fire',
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'night_watch/nw_wild_fire/wild_fire_bottom/wild_fire_bottom',
			texturePath: 'night_watch/nw_wild_fire/wild_fire_bottom/',
			min: 'night_watch/nw_wild_fire/wild_fire_bottom/min_wild_fire_bottom',
			renderBeforeEntities: true,
			yOffset: 10
		}
	],

	// Basic Grenade (NW_BASIC_GRENADE), from the client's own effect folders.
	ef_nw_basic_grenade: [
		{
			type: 'STR',
			file: 'night_watch/nw_basic_grenade/basic_grenade/basic_grenade',
			texturePath: 'night_watch/nw_basic_grenade/basic_grenade/',
			min: 'night_watch/nw_basic_grenade/basic_grenade/min_basic_grenade',
			wav: 'effect/night_watch/nw_basic_grenade',
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'night_watch/nw_basic_grenade/basic_grenade_bottom/basic_grenade_bottom',
			texturePath: 'night_watch/nw_basic_grenade/basic_grenade_bottom/',
			min: 'night_watch/nw_basic_grenade/basic_grenade_bottom/min_basic_grenade_bottom',
			renderBeforeEntities: true,
			yOffset: 10
		}
	],

	// Grenades Dropping (NW_GRENADES_DROPPING), from the client's own effect folders.
	ef_nw_grenades_dropping: [
		{
			type: 'STR',
			file: 'night_watch/nw_grenades_dropping/grenades_dropping/grenades_dropping',
			texturePath: 'night_watch/nw_grenades_dropping/grenades_dropping/',
			min: 'night_watch/nw_grenades_dropping/grenades_dropping/min_grenades_dropping'
		},
		{
			type: 'STR',
			file: 'night_watch/nw_grenades_dropping/grenades_dropping_bottom/grenades_dropping_bottom',
			texturePath: 'night_watch/nw_grenades_dropping/grenades_dropping_bottom/',
			min: 'night_watch/nw_grenades_dropping/grenades_dropping_bottom/min_grenades_dropping_bottom',
			renderBeforeEntities: true
		}
	],

	// Auto Firing Launcher (NW_AUTO_FIRING_LAUNCHER), from the client's own effect folders.
	ef_nw_auto_firing_launcher: [
		{
			type: 'STR',
			file: 'night_watch/nw_auto_firing_launcher/auto_firing_launcher/auto_firing_launcher',
			texturePath: 'night_watch/nw_auto_firing_launcher/auto_firing_launcher/',
			min: 'night_watch/nw_auto_firing_launcher/auto_firing_launcher/min_auto_firing_launcher',
			wav: 'effect/night_watch/nw_auto_firing_launcher',
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'night_watch/nw_auto_firing_launcher/auto_firing_launcher_bottom/auto_firing_launcher_bottom',
			texturePath: 'night_watch/nw_auto_firing_launcher/auto_firing_launcher_bottom/',
			min: 'night_watch/nw_auto_firing_launcher/auto_firing_launcher_bottom/min_auto_firing_launcher_bottom',
			renderBeforeEntities: true,
			yOffset: 10
		}
	],

	// Hidden Card (NW_HIDDEN_CARD), from the client's own effect folders.
	ef_nw_hidden_card: [
		{
			type: 'STR',
			file: 'night_watch/nw_hidden_card/hidden_card/hiddencard',
			texturePath: 'night_watch/nw_hidden_card/hidden_card/',
			min: 'night_watch/nw_hidden_card/hidden_card/min_hiddencard',
			wav: 'effect/night_watch/nw_hidden_card',
			yOffset: 10
		}
	],

	// Mission Bombard (NW_MISSION_BOMBARD), from the client's own effect folders.
	ef_nw_mission_bombard_hit: [
		{
			type: 'STR',
			file: 'night_watch/nw_mission_bombard/mission_bombard/mission_bombard_hit',
			texturePath: 'night_watch/nw_mission_bombard/mission_bombard/',
			min: 'night_watch/nw_mission_bombard/mission_bombard/min_mission_bombard_hit'
		}
	],

	// Mission Bombard's unit (official effect 2354): while the unit stands,
	// every 15 ticks (250 ms) three blasts land at random points of a 9x9
	// square around it, each drawn at a random size from 0.5 to 1.
	ef_nw_mission_bombard_field: [
		{
			type: 'AREA_SPAWN',
			spawnEffectId: 'ef_nw_mission_bombard_drop',
			interval: 250,
			count: 3,
			areaByLevel: [9],
			area: 9,
			scaleRange: [0.5, 1]
		}
	],

	// One blast of Mission Bombard's unit (no sound)
	ef_nw_mission_bombard_drop: [
		{
			type: 'STR',
			file: 'night_watch/nw_mission_bombard/mission_bombard/mission_bombard_hit',
			texturePath: 'night_watch/nw_mission_bombard/mission_bombard/',
			min: 'night_watch/nw_mission_bombard/mission_bombard/min_mission_bombard_hit'
		}
	],

	// Wild Shot (NW_WILD_SHOT), from the client's own effect folders.
	ef_nw_wild_shot: [
		{
			type: 'STR',
			file: 'night_watch/nw_wild_shot/wild_shot/wild_shot',
			texturePath: 'night_watch/nw_wild_shot/wild_shot/',
			min: 'night_watch/nw_wild_shot/wild_shot/min_wild_shot',
			yOffset: 5
		}
	],

	// Wild Shot (NW_WILD_SHOT), from the client's own effect folders.
	ef_nw_wild_shot_cast: [
		{
			type: 'STR',
			castLoop: true,
			attachedEntity: true,
			file: 'night_watch/nw_wild_shot/wild_shot_cast/wild_shot_cast',
			texturePath: 'night_watch/nw_wild_shot/wild_shot_cast/',
			min: 'night_watch/nw_wild_shot/wild_shot_cast/min_wild_shot_cast',
			wav: 'effect/ef_beginspell',
			soundLoop: false,
			renderBeforeEntities: true,
			yOffset: 11
		}
	],

	// Wild Shot (NW_WILD_SHOT), from the client's own effect folders.
	ef_nw_wild_shot_hit: [
		{
			type: 'STR',
			file: 'night_watch/nw_wild_shot/wild_shot_hit/wild_shot_hit',
			texturePath: 'night_watch/nw_wild_shot/wild_shot_hit/',
			min: 'night_watch/nw_wild_shot/wild_shot_hit/min_wild_shot_hit',
			wav: 'effect/NIGHT_WATCH/NW_MIDNIGHT_FALLEN_HIT',
			soundLoop: false,
			yOffset: 6
		}
	],

	// Midnight Fallen (NW_MIDNIGHT_FALLEN), from the client's own effect folders.
	ef_nw_midnight_fallen: [
		{
			type: 'STR',
			file: 'night_watch/nw_midnight_fallen/midnight_fallen_bottom/midnight_fallen_bottom',
			texturePath: 'night_watch/nw_midnight_fallen/midnight_fallen_bottom/',
			min: 'night_watch/nw_midnight_fallen/midnight_fallen_bottom/min_midnight_fallen_bottom',
			wav: 'effect/night_watch/nw_midnight_fallen',
			renderBeforeEntities: true,
			xOffset: 1,
			yOffset: 11
		}
	],

	// Midnight Fallen (NW_MIDNIGHT_FALLEN), from the client's own effect folders.
	ef_nw_midnight_fallen_cast: [
		{
			type: 'STR',
			castLoop: true,
			attachedEntity: true,
			file: 'night_watch/nw_midnight_fallen/midnight_fallen_cast_bottom/midnight_fallen_cast_bottom',
			texturePath: 'night_watch/nw_midnight_fallen/midnight_fallen_cast_bottom/',
			min: 'night_watch/nw_midnight_fallen/midnight_fallen_cast_bottom/min_midnight_fallen_cast_bottom',
			wav: 'effect/ef_beginspell',
			soundLoop: false,
			renderBeforeEntities: true,
			xOffset: 1,
			yOffset: 11
		}
	]
};
