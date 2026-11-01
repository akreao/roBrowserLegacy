/**
 * @module DB/Effects/Table/Jobs/Gunslinger/Gunslinger
 *
 * The Gunslinger line's Gunslinger effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

export default {
	gunslinger_coin: [
		{
			// coin caster
			wav: 'effect/\xc7\xc3\xb8\xb3', //ÇĂ¸ł
			attachedEntity: true
		}
	],

	//455: [{}],	//EF_GUMGANGNPC	   Another Warmth Lightning

	456: [
		{
			//EF_AGIUP	   Power Up
			wav: 'effect/\x6d\x6f\x6e\x5f\xc6\xf8\xb1\xe2',
			attachedEntity: true
		}
	],

	584: [
		{
			//EF_M02	Full Buster
			type: 'SPR',
			file: 'm_ef02',
			attachedEntity: true,
			direction: true
		}
	],

	//623: [{}],	//EF_CHEMICAL4	   Piercing Shot
	//624: [{}],	//EF_STIN5	   Kamaitachi
	//625: [{}],	//EF_MADNESS_BLUE	   Madness Canceller
	//626: [{}],	//EF_MADNESS_RED	   Adjustment

	627: [
		{
			//EF_RG_COIN3	   Disarm (Sound Effect)
			wav: 'effect/\xb5\xf0\xbd\xba\xbe\xcf'
		}
	],

	628: [
		{
			//dust	//EF_BASH3D5	   Dust
			wav: 'effect/bash3d5', // incorrect wav name
			attachedEntity: true
		},
		{
			type: 'CYLINDER',
			textureName: 'alpha_center',
			alphaMax: 0.6,
			duration: 175,
			duplicate: 6,
			timeBetweenDupli: 0,
			totalCircleSides: 30,
			circleSides: 1,
			fade: true,
			angleX: -90,
			angleZRandom: 360,
			fixedPerspective: true,
			posZ: 1.5,
			height: 0,
			bottomSize: 0.01,
			topSize: 4.5,
			animation: 2,
			zIndex: 1.1,
			attachedEntity: true
		},
		{
			type: 'CYLINDER',
			textureName: 'alpha_center',
			alphaMax: 0.6,
			duration: 175,
			duplicate: 6,
			timeBetweenDupli: 0,
			totalCircleSides: 30,
			circleSides: 1,
			fade: true,
			angleX: -90,
			angleZRandom: 360,
			fixedPerspective: true,
			posZ: 1.5,
			height: 0,
			bottomSize: 0.01,
			topSize: 7.2,
			animation: 2,
			zIndex: 1.2,
			attachedEntity: true
		}
	],

	637: [
		{
			//EF_DESPERADO	Desperado
			type: 'SPR',
			file: '\xb5\xa5\xbd\xba\xc6\xe4\xb6\xf3\xb5\xb5',
			wav: 'effect/\xb5\xa5\xbd\xba\xc6\xe4\xb6\xf3\xb5\xb5',
			attachedEntity: true
		}
	],

	643: [
		{
			//EF_RAPIDSHOWER	Rapid Shower
			type: 'SPR',
			file: '\xb7\xa1\xc7\xc7\xb5\xe5\xbb\xfe\xbf\xf6',
			wav: 'effect/\xb7\xa1\xc7\xc7\xb5\xe5\xbb\xfe\xbf\xf6',
			attachedEntity: true
		}
	],

	644: [
		{
			//EF_MAGICALBULLET	Magic Bullet
			type: 'SPR',
			file: '\xb8\xc5\xc1\xf6\xc4\xc3\xba\xd2\xb8\xb4',
			wav: 'effect/\xb8\xc5\xc1\xf6\xc4\xc3\xba\xed\xb8\xb4',
			attachedEntity: true
		}
	],

	645: [
		{
			//EF_SPREADATTACK	Spread Attack
			type: 'SPR',
			file: '\xbd\xba\xc7\xc1\xb7\xb9\xb5\xe5',
			attachedEntity: true,
			direction: true
		}
	],

	646: [
		{
			//EF_TRACKCASTING	Tracking (Shown While Casting)
			type: 'STR',
			file: '\xc6\xae\xb7\xa2\xc5\xb7',
			attachedEntity: true
		}
	],

	647: [
		{
			//EF_TRACKING	Tracking
			type: 'SPR',
			file: '\xc6\xae\xb7\xa1\xc5\xb7',
			attachedEntity: true
		}
	],

	648: [
		{
			//EF_TRIPLEACTION	Triple Action
			type: 'SPR',
			file: '\xc6\xae\xb8\xae\xc7\xc3\xbe\xd7\xbc\xc7',
			wav: 'effect/\xc6\xae\xb8\xae\xc7\xc3\xbe\xd7\xbc\xc7',
			attachedEntity: true
		}
	],

	649: [
		{
			//EF_BULLSEYE	Bull's Eye
			type: 'STR',
			file: '\xba\xd2\xbd\xba\xbe\xc6\xc0\xcc', //oO1o3AAI
			attachedEntity: true
		}
	],

	// Increasing Accuracy (GS_INCREASING), from the client's own effect folders.
	ef_gs_increasing: [
		{
			type: 'STR',
			file: 'increasing_activity/increasing_activity/increasing_activity',
			texturePath: 'increasing_activity/increasing_activity/',
			min: 'increasing_activity/increasing_activity/min_increasing_activity'
		}
	],

	// Increasing Accuracy (GS_INCREASING), from the client's own effect folders.
	ef_gs_increasing_cast: [
		{
			type: 'STR',
			file: 'increasing_activity/increasing_activity_cast/increasing_activity_cast',
			texturePath: 'increasing_activity/increasing_activity_cast/',
			min: 'increasing_activity/increasing_activity_cast/min_increasing_activity_cast'
		},
		{
			type: 'STR',
			file: 'increasing_activity/increasing_activity_cast_bottom/increasing_activity_cast_bottom',
			texturePath: 'increasing_activity/increasing_activity_cast_bottom/',
			min: 'increasing_activity/increasing_activity_cast_bottom/min_increasing_activity_cast_bottom',
			renderBeforeEntities: true
		}
	]
};
