/**
 * @module DB/Effects/Table/Effects1800
 *
 * Effects 1800 to 1899 of the effect table. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep rows in effect ID order.
 */

import Events from 'Core/Events.js';

export default {
	1869: [
		{
			type: 'STR',
			file: 'new_dropitem/dropitem_blue/dropitem_blue/dropitem_blue',
			texturePath: 'new_dropitem/dropitem_blue/dropitem_blue/'
		},
		{
			type: 'STR',
			file: 'new_dropitem/dropitem_blue/dropitem_blue_bottom/dropitem_blue_bottom',
			texturePath: 'new_dropitem/dropitem_blue/dropitem_blue_bottom/'
		},
		{
			wav: 'effect/drop_blue'
		}
	],
	1870: [
		{
			type: 'STR',
			file: 'new_dropitem/dropitem_green/dropitem_green/dropitem_green',
			texturePath: 'new_dropitem/dropitem_green/dropitem_green/'
		},
		{
			type: 'STR',
			file: 'new_dropitem/dropitem_green/dropitem_green_bottom/dropitem_green_bottom',
			texturePath: 'new_dropitem/dropitem_green/dropitem_green_bottom/'
		},
		{
			wav: 'effect/drop_green'
		}
	],
	1871: [
		{
			type: 'STR',
			file: 'new_dropitem/dropitem_red/dropitem_red/dropitem_red',
			texturePath: 'new_dropitem/dropitem_red/dropitem_red/'
		},
		{
			type: 'STR',
			file: 'new_dropitem/dropitem_red/dropitem_red_bottom/dropitem_red_bottom',
			texturePath: 'new_dropitem/dropitem_red/dropitem_red_bottom/'
		},
		{
			wav: 'effect/drop_red'
		}
	],
	1872: [
		{
			// EF_NEW_SUCCESS
			type: 'STR',
			file: 'grade_enchant/new_success/new_success',
			texturePath: 'grade_enchant/new_success/'
		}
	],
	1873: [
		{
			// EF_NEW_FAILURE
			type: 'STR',
			file: 'grade_enchant/new_failed/new_failed',
			texturePath: 'grade_enchant/new_failed/'
		}
	],
	1874: [
		{
			// EF_NEW_INTRO
			type: 'STR',
			file: 'grade_enchant/new_intro/new_intro',
			texturePath: 'grade_enchant/new_intro/'
		}
	],
	1875: [
		{
			// EF_UI_ENCHANT_INTRO_YELLOW
			type: 'STR',
			file: 'ui_enchant/ui_intro_yellow/ui_intro_yellow',
			texturePath: 'ui_enchant/ui_intro_yellow/'
		}
	],
	1876: [
		{
			// EF_UI_ENCHANT_SUCCESS
			type: 'STR',
			file: 'ui_enchant/ui_enchant_success/ui_enchant_success',
			texturePath: 'ui_enchant/ui_enchant_success/'
		}
	],
	1877: [
		{
			// EF_UI_ENCHANT_FAIL
			type: 'STR',
			file: 'ui_enchant/ui_fail/ui_enchant_fail',
			texturePath: 'ui_enchant/ui_fail/'
		}
	],
	1878: [
		{
			// EF_UI_ENCHANT_INTRO_BLUE
			type: 'STR',
			file: 'ui_enchant/ui_intro_blue/ui_intro_blue',
			texturePath: 'ui_enchant/ui_intro_blue/'
		}
	],
	1879: [
		{
			// EF_UI_ENCHANT_UP_SUCCESS
			type: 'STR',
			file: 'ui_enchant/ui_levelup_success/ui_levelup_success',
			texturePath: 'ui_enchant/ui_levelup_success/'
		}
	],
	1880: [
		{
			// EF_UI_ENCHANT_UP_FAIL
			type: 'STR',
			file: 'ui_enchant/ui_fail/ui_levelup_fail',
			texturePath: 'ui_enchant/ui_fail/'
		}
	],
	1881: [
		{
			// EF_UI_ENCHANT_INTRO_GREEN
			type: 'STR',
			file: 'ui_enchant/ui_intro_green/ui_intro_green',
			texturePath: 'ui_enchant/ui_intro_green/'
		}
	],
	1882: [
		{
			// EF_UI_ENCHANT_RESET_SUCCESS
			type: 'STR',
			file: 'ui_enchant/ui_reset_success/ui_reset_success',
			texturePath: 'ui_enchant/ui_reset_success/'
		}
	],
	1883: [
		{
			// EF_UI_ENCHANT_RESET_FAIL
			type: 'STR',
			file: 'ui_enchant/ui_fail/ui_reset_fail',
			texturePath: 'ui_enchant/ui_fail/'
		}
	],

	white_pulse: [
		{
			//type: 'FUNC',
			attachedEntity: true
		}
	],

	yellow_pulse: [
		{
			//type: 'FUNC',
			attachedEntity: true
		}
	],

	black_pulse: [
		{
			//type: 'FUNC',
			attachedEntity: true
		}
	],

	enemy_hit_normal1: [
		{
			wav: '_enemy_hit_normal1',
			attachedEntity: true
		}
	],

	ef_hit2_sound: [
		{
			wav: 'effect/ef_hit2',
			attachedEntity: true
		}
	],

	// Hatred of the Sun, Moon and Stars on success: the official client plays T_등록.wav at the player.
	sg_hate_sound: [
		{
			wav: 'effect/t_\xb5\xee\xb7\xcf',
			attachedEntity: true
		}
	],

	// Union of the Sun, Moon and Stars on success: the official client plays T_변신.wav at the player
	// (the screen quake is the separate 'quake' row).
	sg_fusion_sound: [
		{
			wav: 'effect/t_\xba\xaf\xbd\xc5',
			attachedEntity: true
		}
	],

	// Ka-spells on success: the official client plays each one's sound at the player, then the
	// skill's effects on the target (see effect-port/soul-linker-skills.md).
	sl_kaizel_sound: [
		{
			wav: 'effect/priest_resurrection',
			attachedEntity: true
		}
	],

	sl_kaahi_sound: [
		{
			wav: 'effect/t_\xba\xb8\xc1\xb6\xb8\xb6\xb9\xfd',
			attachedEntity: true
		}
	],

	sl_kaupe_sound: [
		{
			wav: 'effect/t_\xc4\xa1\xc0\xd7',
			attachedEntity: true
		}
	],

	sl_kaite_sound: [
		{
			wav: 'effect/t_\xb8\xb6\xb9\xfd\xb9\xdd\xbb\xe7',
			attachedEntity: true
		}
	],

	// Eswoo, Eske and Eska on success: the official client plays each one's sound at the player.
	sl_swoo_sound: [
		{
			wav: 'effect/t_\xbd\xb4\xbf\xf4',
			attachedEntity: true
		}
	],

	sl_ske_sound: [
		{
			wav: 'effect/t_\xb0\xf8\xb0\xdd\xb7\xc2',
			attachedEntity: true
		}
	],

	sl_ska_sound: [
		{
			wav: 'effect/t_\xb9\xe6\xbe\xee\xc7\xfc',
			attachedEntity: true
		}
	],

	ef_greed_sound: [
		{
			wav: 'effect/ef_entry',
			attachedEntity: true
		}
	],

	ef_rush_windmill: [
		{
			wav: 'effect/\xc7\xb3\xc2\xf7\xb8\xa6\xc7\xe2\xc7\xd8\xb5\xb9\xb0\xdd', //ÇłÂ÷¸¦ÇâÇŘµą°Ý
			attachedEntity: true
		},
		{
			alphaMax: 1,
			attachedEntity: true,
			duration: 1000,
			delayLate: 500,
			duplicate: 7,
			fadeOut: true,
			file: 'effect/ac_center2.tga',
			red: 0.5,
			green: 0.01,
			blue: 0.9,
			posxRand: 1.5,
			posyRand: 1,
			poszEndRand: 1,
			poszEndRandMiddle: 6,
			poszStartRand: 1,
			poszStartRandMiddle: 1,
			sizeRandY: 15,
			sizeRandYMiddle: 45,
			sizeX: 2.5,
			type: '3D',
			zIndex: 0
		},
		{
			alphaMax: 0.75,
			attachedEntity: true,
			duration: 1000,
			delayOffset: 400,
			duplicate: 3,
			fadeOut: true,
			file: 'effect/ac_center2.tga',
			posxRand: 1.5,
			posyRand: 1,
			poszEndRand: 1,
			poszEndRandMiddle: 6,
			poszStartRand: 1,
			poszStartRandMiddle: 1,
			sizeRandY: 15,
			sizeRandYMiddle: 45,
			sizeX: 2.5,
			type: '3D',
			zIndex: 0
		},
		{
			alphaMax: 1,
			attachedEntity: true,
			duration: 1000,
			duplicate: 10,
			fadeOut: true,
			file: 'effect/ac_center2.tga',
			posxRand: 1.5,
			posyRand: 1,
			poszEndRand: 1,
			poszEndRandMiddle: 6,
			poszStartRand: 1,
			poszStartRandMiddle: 1,
			sizeRandY: 15,
			sizeRandYMiddle: 45,
			sizeX: 2.5,
			type: '3D',
			zIndex: 0
		},
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function EffectBodyColor(Params) {
				const entity = Params.Init;

				entity.animations.add(function (tick) {
					if (tick < 500) {
						if (tick % 2 == 0) {
							entity._flashColor[0] = 1;
							entity._flashColor[1] = 1;
							entity._flashColor[2] = 1;
							entity._flashColor[3] = 0.4;
							entity.recalculateBlendingColor();
						} else {
							entity._flashColor[0] = 1;
							entity._flashColor[1] = 1;
							entity._flashColor[2] = 1;
							entity._flashColor[3] = 1;
							entity.recalculateBlendingColor();
						}
					} else {
						entity._flashColor[0] = 1;
						entity._flashColor[1] = 1;
						entity._flashColor[2] = 1;
						entity._flashColor[3] = 1;
						entity.recalculateBlendingColor();
						return true;
					}
				});
			}
		}
	],

	ef_swing_dance: [
		{
			wav: 'effect/\xbd\xba\xc0\xae\xb4\xed\xbd\xba',
			attachedEntity: true
		},
		{
			alphaMax: 1,
			attachedEntity: true,
			duration: 1000,
			delayLate: 500,
			duplicate: 7,
			fadeOut: true,
			file: 'effect/ac_center2.tga',
			red: 1,
			green: 0.1,
			blue: 0.5,
			posxRand: 1.5,
			posyRand: 1,
			poszEndRand: 1,
			poszEndRandMiddle: 6,
			poszStartRand: 1,
			poszStartRandMiddle: 1,
			sizeRandY: 15,
			sizeRandYMiddle: 45,
			sizeX: 2.5,
			type: '3D',
			zIndex: 0
		},
		{
			alphaMax: 0.75,
			attachedEntity: true,
			duration: 1000,
			delayOffset: 400,
			duplicate: 3,
			fadeOut: true,
			file: 'effect/ac_center2.tga',
			posxRand: 1.5,
			posyRand: 1,
			poszEndRand: 1,
			poszEndRandMiddle: 6,
			poszStartRand: 1,
			poszStartRandMiddle: 1,
			sizeRandY: 15,
			sizeRandYMiddle: 45,
			sizeX: 2.5,
			type: '3D',
			zIndex: 0
		},
		{
			alphaMax: 1,
			attachedEntity: true,
			duration: 1000,
			duplicate: 10,
			fadeOut: true,
			file: 'effect/ac_center2.tga',
			posxRand: 1.5,
			posyRand: 1,
			poszEndRand: 1,
			poszEndRandMiddle: 6,
			poszStartRand: 1,
			poszStartRandMiddle: 1,
			sizeRandY: 15,
			sizeRandYMiddle: 45,
			sizeX: 2.5,
			type: '3D',
			zIndex: 0
		},
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function EffectBodyColor(Params) {
				const entity = Params.Init.ownerEntity;

				entity.animations.add(function (tick) {
					if (tick < 500) {
						if (tick % 2 == 0) {
							entity._flashColor[0] = 1;
							entity._flashColor[1] = 0.1;
							entity._flashColor[2] = 0.5;
							entity._flashColor[3] = 0.4;
							entity.recalculateBlendingColor();
						} else {
							entity._flashColor[0] = 1;
							entity._flashColor[1] = 1;
							entity._flashColor[2] = 1;
							entity._flashColor[3] = 1;
							entity.recalculateBlendingColor();
						}
					} else {
						entity._flashColor[0] = 1;
						entity._flashColor[1] = 1;
						entity._flashColor[2] = 1;
						entity._flashColor[3] = 1;
						entity.recalculateBlendingColor();
						return true;
					}
				});
			}
		}
	],

	// Ganbantein's ground packet: the official client plays EF_FireWall.wav at the cell with effect 223.
	ef_ganbantein_wav: [
		{
			wav: 'effect/ef_firewall'
		}
	],

	// Gravitation Field's ground packet: the official client plays wizard_earthspike.wav at the cell.
	ef_gravitation_wav: [
		{
			wav: 'effect/wizard_earthspike'
		}
	],

	ef_magicpower: [
		{
			wav: 'effect/\xb8\xb6\xb9\xfd\xb7\xc2\x20\xc1\xf5\xc6\xf8',
			attachedEntity: true
		}
	],

	ef_metalicsound: [
		{
			wav: 'effect/metalic',
			attachedEntity: true
		}
	],

	ef_ancilla: [
		{
			wav: 'effect/ab_ancilla',
			attachedEntity: true
		}
	],

	ef_thorntrap: [
		{
			wav: 'effect/\xb0\xa1\xbd\xc3\xb3\xaa\xb9\xab\xb5\xa3',
			attachedEntity: true
		}
	],

	ef_banishingpoint: [
		{
			wav: 'effect/lg_banishingpoint',
			attachedEntity: true
		}
	],

	ef_cannonspear: [
		{
			wav: 'effect/lg_cannonspear',
			attachedEntity: true
		}
	],

	ef_earthdrive: [
		{
			wav: 'effect/lg_earthdrive',
			attachedEntity: true
		}
	],

	ef_exceedbreak: [
		{
			wav: 'effect/lg_exceedbreak',
			attachedEntity: true
		}
	],

	ef_hesperuslit: [
		{
			wav: 'effect/lg_hesperuslit',
			attachedEntity: true
		}
	],

	ef_kings_grace: [
		{
			wav: 'effect/lg_kings_grace',
			attachedEntity: true
		}
	],

	ef_moonslasher: [
		{
			wav: 'effect/lg_moonslasher',
			attachedEntity: true
		},
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const entity = Params.Init.ownerEntity;
				const duration = 500;
				const count = 8;
				const delay = duration / count;

				for (let i = 0; i < count; i++) {
					const delta = 1;

					Events.setTimeout(function () {
						entity.direction = Math.floor(entity.direction + delta) % 8;
					}, delay * i);
				}
			}
		}
	],

	ef_overbrand: [
		{
			wav: 'effect/lg_overbrand',
			attachedEntity: true
		}
	],

	ef_piety: [
		{
			wav: 'effect/lg_piety',
			attachedEntity: true
		}
	],

	ef_pinpointattack: [
		{
			wav: 'effect/lg_pinpointattack',
			attachedEntity: true
		}
	],

	ef_rageburst: [
		{
			wav: 'effect/lg_rageburst',
			attachedEntity: true
		}
	],

	ef_rayofgenesis: [
		{
			wav: 'effect/lg_rayofgenesis',
			attachedEntity: true
		}
	],

	ef_reflectdamage: [
		{
			wav: 'effect/lg_reflectdamage',
			attachedEntity: true
		}
	],

	ef_shieldspell: [
		{
			wav: 'effect/lg_shieldspell',
			attachedEntity: true
		}
	],

	ef_trample: [
		{
			wav: 'effect/lg_trample',
			attachedEntity: true
		}
	],

	ef_crescentelbow: [
		{
			wav: 'effect/sr_crescentelbow',
			attachedEntity: true
		}
	],

	ef_cursedcircle: [
		{
			wav: 'effect/sr_cursedcircle',
			attachedEntity: true
		}
	],

	ef_dragoncombo: [
		{
			wav: 'effect/sr_dragoncombo',
			attachedEntity: true
		}
	],

	ef_fallenempire: [
		{
			wav: 'effect/sr_fallenempire',
			attachedEntity: true
		}
	],

	ef_gateofhell: [
		{
			wav: 'effect/sr_gateofhell',
			attachedEntity: true
		}
	],

	ef_howlingoflion: [
		{
			wav: 'effect/sr_howlingoflion',
			attachedEntity: true
		}
	],

	ef_knucklearrow: [
		{
			wav: 'effect/sr_knucklearrow',
			attachedEntity: true
		}
	],

	ef_lightningwalk: [
		{
			wav: 'effect/sr_lightningwalk',
			attachedEntity: true
		}
	],

	ef_powervelocity: [
		{
			wav: 'effect/sr_powervelocity',
			attachedEntity: true
		}
	],

	ef_raisingdragon: [
		{
			wav: 'effect/sr_raisingdragon',
			attachedEntity: true
		}
	],

	ef_rampageblaster: [
		{
			wav: 'effect/sr_rampageblaster',
			attachedEntity: true
		}
	],

	ef_rideinlightning: [
		{
			wav: 'effect/sr_rideinlightning',
			attachedEntity: true
		}
	],

	ef_skynetblow: [
		{
			wav: 'effect/sr_skynetblow',
			attachedEntity: true
		}
	],

	ef_tigercannon: [
		{
			wav: 'effect/sr_tigercannon',
			attachedEntity: true
		}
	],

	ef_windmill: [
		{
			wav: 'effect/sr_windmill',
			attachedEntity: true
		},
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const entity = Params.Init.ownerEntity;
				const duration = 500;
				const count = 8;
				const delay = duration / count;

				for (let i = 0; i < count; i++) {
					const delta = 1;

					Events.setTimeout(function () {
						entity.direction = Math.floor(entity.direction + delta) % 8;
					}, delay * i);
				}
			}
		}
	]
};
