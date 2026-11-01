/**
 * @module DB/Effects/Table/Jobs/Swordman/RoyalGuard
 *
 * The Swordman line's RoyalGuard effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

import Events from 'Core/Events.js';

export default {
	//890: [{}],	//EF_SPINMOVE	   Rotation
	//891: [{}],	//EF_FIREBALL4	   Magic shots [S]
	//892: [{}],	//EF_TRIPLEATTACK4	   Fastness with hitting sound[S]
	//893: [{}],	//EF_CHEMICAL3S	   Blue-white light passing by
	//894: [{}],	//EF_GROUNDSHAKE	   (Nothing)
	//895: [{}],	//EF_DQ9_CHARGE	   Big wheel of flat light beams
	//896: [{}],	//EF_DQ9_CHARGE2	   Still sun shaped lightning aura
	//897: [{}],	//EF_DQ9_CHARGE3	   Animated sun shaped lightning aura
	//898: [{}],	//EF_DQ9_CHARGE4	   Animated, curvy sun shaped lightning aura
	//899: [{}],	//EF_BLUELINE	   White/red light shots from below
	//900: [{}],	//EF_SELFSCROLL	   Animated, slow curvy sun shaped lightning aura
	//901: [{}],	//EF_SPR_LIGHTPRINT	   Explosion
	//902: [{}],	//EF_PNG_TEST	   Floating bedtable texture
	//903: [{}],	//EF_BEGINSPELL_YB	   Castish flamey cone
	//904: [{}],	//EF_CHEMICAL2DASH4	   Yellow/pink lights passing by
	//905: [{}],	//EF_GROUNDSHAKE2	   Expanding circle

	906: [
		{
			//EF_PRESSURE2	   Shield Press (falling shield)
			type: '3D',
			alphaMax: 0.6,
			attachedEntity: true,
			blendMode: 2,
			duration: 500,
			rotate: true,
			angle: 0,
			toAngle: -611,
			poszStart: 20,
			poszEnd: 5,
			size: 100,
			zIndex: 1,
			file: 'effect/shield.bmp',
			wav: 'effect/\xc7\xc1\xb7\xb9\xbc\xc5'
		},
		{
			type: '3D',
			alphaMax: 0.6,
			attachedEntity: true,
			blendMode: 2,
			duration: 500,
			delayOffset: 501,
			fadeOut: true,
			angle: -611,
			posz: 5,
			size: 100,
			zIndex: 1,
			file: 'effect/shield.bmp',
			delayWav: 500,
			wav: 'effect/lg_shieldpress'
		}
	],

	//907: [{}],	//EF_RG_COIN7	   Chainy, metalish sound [S]

	908: [
		{
			//EF_PRIMECHARGE2	   Prestige (sphere of yellow particles)
			wav: 'effect/lg_prestige'
		}
	],

	909: [
		{
			//EF_PRIMECHARGE3	   Banding (sphere of red particles)
			wav: 'effect/lg_banding'
		}
	],

	910: [
		{
			//EF_PRIMECHARGE4	   Inspiration (sphere of blue particles)
			wav: 'effect/lg_inspiration'
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

	// Cannon Spear (LG_CANNONSPEAR), from the client's own effect folders.
	ef_lg_cannonspear: [
		{
			type: 'STR',
			file: 'new_cannon_spear/new_cannon_spear_bottom/new_cannon_spear_bottom',
			texturePath: 'new_cannon_spear/new_cannon_spear_bottom/',
			renderBeforeEntities: true,
			wav: 'effect/lg_cannonspear'
		}
	],

	// Banishing Point (LG_BANISHINGPOINT), from the client's own effect folders.
	ef_lg_banishingpoint_cast: [
		{
			type: 'STR',
			file: 'new_banishingpoint/new_banishingpoint_cast/new_banishingpoint_cast',
			texturePath: 'new_banishingpoint/new_banishingpoint_cast/',
			wav: 'effect/lg_banishingpoint'
		},
		{
			type: 'STR',
			file: 'new_banishingpoint/new_banishingpoint_cast_bottom/new_banishingpoint_cast_bottom',
			texturePath: 'new_banishingpoint/new_banishingpoint_cast_bottom/',
			renderBeforeEntities: true
		}
	],

	// Over Brand (LG_OVERBRAND), from the client's own effect folders.
	ef_lg_overbrand_cast: [
		{
			type: 'STR',
			file: 'new_overbrand/new_overbrand_cast/new_overbrand_cast',
			texturePath: 'new_overbrand/new_overbrand_cast/',
			wav: 'effect/lg_overbrand'
		},
		{
			type: 'STR',
			file: 'new_overbrand/new_overbrand_cast_bottom/new_overbrand_cast_bottom',
			texturePath: 'new_overbrand/new_overbrand_cast_bottom/',
			renderBeforeEntities: true
		}
	],

	// Over Brand (LG_OVERBRAND), from the client's own effect folders.
	ef_lg_overbrand_hit: [
		{
			type: 'STR',
			file: 'new_overbrand/new_overbrand_hit/new_overbrand_hit',
			texturePath: 'new_overbrand/new_overbrand_hit/'
		}
	],

	// Ray of Genesis (LG_RAYOFGENESIS), from the client's own effect folders.
	ef_lg_rayofgenesis: [
		{
			type: 'STR',
			file: 'new_rayofgenesis/new_rayofgenesis/new_rayofgenesis',
			texturePath: 'new_rayofgenesis/new_rayofgenesis/',
			wav: 'effect/lg_rayofgenesis'
		}
	],

	// Ray of Genesis (LG_RAYOFGENESIS), from the client's own effect folders.
	ef_lg_rayofgenesis_cast: [
		{
			type: 'STR',
			file: 'new_rayofgenesis/new_rayofgenesis_cast/new_rayofgenesis_cast',
			texturePath: 'new_rayofgenesis/new_rayofgenesis_cast/'
		},
		{
			type: 'STR',
			file: 'new_rayofgenesis/new_rayofgenesis_cast_bottom/new_rayofgenesis_cast_bottom',
			texturePath: 'new_rayofgenesis/new_rayofgenesis_cast_bottom/',
			renderBeforeEntities: true
		}
	],

	// Ray of Genesis (LG_RAYOFGENESIS), from the client's own effect folders.
	ef_lg_rayofgenesis_hit: [
		{
			type: 'STR',
			file: 'new_rayofgenesis/new_rayofgenesis_hit/new_rayofgenesis_hit',
			texturePath: 'new_rayofgenesis/new_rayofgenesis_hit/'
		}
	],

	// Earth Drive (LG_EARTHDRIVE), from the client's own effect folders.
	ef_lg_earthdrive: [
		{
			type: 'STR',
			file: 'new_earthdrive/new_earthdrive/new_earthdrive',
			texturePath: 'new_earthdrive/new_earthdrive/',
			wav: 'effect/lg_earthdrive'
		},
		{
			type: 'STR',
			file: 'new_earthdrive/new_earthdrive_bottom/new_earthdrive_bottom',
			texturePath: 'new_earthdrive/new_earthdrive_bottom/',
			renderBeforeEntities: true
		}
	],

	// Overbrand Brandish (LG_OVERBRAND_BRANDISH), from the client's own effect folders.
	ef_lg_overbrand_brandish_cast: [
		{
			type: 'STR',
			file: 'new_overbrand/new_overbrand_cast/new_overbrand_cast',
			texturePath: 'new_overbrand/new_overbrand_cast/'
		},
		{
			type: 'STR',
			file: 'new_overbrand/new_overbrand_cast_bottom/new_overbrand_cast_bottom',
			texturePath: 'new_overbrand/new_overbrand_cast_bottom/',
			renderBeforeEntities: true
		}
	],

	// Overbrand Brandish (LG_OVERBRAND_BRANDISH), from the client's own effect folders.
	ef_lg_overbrand_brandish_hit: [
		{
			type: 'STR',
			file: 'new_overbrand/new_overbrand_hit/new_overbrand_hit',
			texturePath: 'new_overbrand/new_overbrand_hit/'
		}
	],

	// Overbrand Plus Attack (LG_OVERBRAND_PLUSATK), from the client's own effect folders.
	ef_lg_overbrand_plusatk_cast: [
		{
			type: 'STR',
			file: 'new_overbrand/new_overbrand_cast/new_overbrand_cast',
			texturePath: 'new_overbrand/new_overbrand_cast/'
		},
		{
			type: 'STR',
			file: 'new_overbrand/new_overbrand_cast_bottom/new_overbrand_cast_bottom',
			texturePath: 'new_overbrand/new_overbrand_cast_bottom/',
			renderBeforeEntities: true
		}
	],

	// Overbrand Plus Attack (LG_OVERBRAND_PLUSATK), from the client's own effect folders.
	ef_lg_overbrand_plusatk_hit: [
		{
			type: 'STR',
			file: 'new_overbrand/new_overbrand_hit/new_overbrand_hit',
			texturePath: 'new_overbrand/new_overbrand_hit/'
		}
	]
};
