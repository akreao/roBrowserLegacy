/**
 * @module DB/Effects/Table/Jobs/Ninja/Ninja
 *
 * The Ninja line's Ninja effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

export default {
	613: [
		{
			//EF_THROWITEM7	   Throw Shuriken
			wav: 'effect/\xb4\xd1\xc0\xda\x5f\xb4\xf8\xc1\xf6\xb1\xe2'
		},
		{
			type: '3D',
			alphaMax: 1,
			angle: 180,
			attachedEntity: true,
			duration: 200,
			fadeIn: true,
			fadeOut: true,
			file: '\xc0\xaf\xc0\xfa\xc0\xce\xc5\xcd\xc6\xe4\xc0\xcc\xbd\xba/item/\xbc\xf6\xb8\xae\xb0\xcb.bmp',
			toSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			rotate: true,
			nbOfRotation: 1,
			size: 30,
			zOffset: 1,
			zIndex: 1
		}
	],

	614: [
		{
			//EF_THROWITEM8	   Throw Kunai
			wav: 'effect/\xb4\xd1\xc0\xda\x5f\xb4\xf8\xc1\xf6\xb1\xe2'
		},
		{
			type: '3D',
			alphaMax: 1,
			angle: 180,
			attachedEntity: true,
			duration: 200,
			fadeIn: true,
			fadeOut: true,
			file: '\xc0\xaf\xc0\xfa\xc0\xce\xc5\xcd\xc6\xe4\xc0\xcc\xbd\xba/item/\xc4\xed\xb3\xaa\xc0\xcc\x5f\xb5\xb6.bmp',
			toSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			rotate: true,
			nbOfRotation: 1,
			size: 30,
			zOffset: 1,
			zIndex: 1
		}
	],

	615: [
		{
			//EF_THROWITEM9	   Throw Fumma Shuriken
			wav: 'effect/\xb4\xd1\xc0\xda\x5f\xb4\xf8\xc1\xf6\xb1\xe2'
		},
		{
			type: '3D',
			alphaMax: 1,
			angle: 180,
			attachedEntity: true,
			duration: 200,
			fadeIn: true,
			fadeOut: true,
			file: '\xc0\xaf\xc0\xfa\xc0\xce\xc5\xcd\xc6\xe4\xc0\xcc\xbd\xba/item/\xc7\xb3\xb8\xb6\x5f\xb3\xfa\xbf\xec.bmp',
			toSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			rotate: true,
			nbOfRotation: 1,
			size: 30,
			zOffset: 1,
			zIndex: 1
		}
	],

	616: [
		{
			//EF_THROWITEM10	   Throw Money
			wav: 'effect/\xb4\xd1\xc0\xda\x5f\xb4\xf8\xc1\xf6\xb1\xe2'
		},
		{
			type: '3D',
			alphaMax: 1,
			angle: 180,
			attachedEntity: true,
			duration: 200,
			fadeIn: true,
			fadeOut: true,
			file: 'effect/coin_a.bmp',
			toSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			rotate: true,
			nbOfRotation: 1,
			size: 20,
			zOffset: 1,
			zIndex: 1
		}
	],

	//617: [{}],	//EF_BUNSINJYUTSU	   Illusionary Shadow

	618: [
		{
			//EF_KOUENKA	   Crimson Fire Bolossom
			type: 'STR',
			file: 'firehit',
			wav: 'effect/ef_firearrow%d',
			rand: [1, 3],
			attachedEntity: true
		}
	],

	619: [
		{
			//EF_HYOUSENSOU	   Lightning Spear Of Ice
			type: 'STR',
			file: 'freeze',
			wav: 'effect/ef_icearrow%d',
			rand: [1, 3],
			attachedEntity: true
		}
	],

	//620: [{}],	//EF_BOTTOM_SUITON	   Water Escape Technique

	621: [
		{
			//EF_STIN4	   Wind Blade
			wav: 'effect/\xc7\xb3\xc0\xce'
		}
	],

	622: [
		{
			//EF_THUNDERSTORM2	   Lightning Crash
			type: 'STR',
			file: 'setsudan',
			wav: 'effect/ef_thunderstorm',
			attachedEntity: true
		}
	],

	630: [
		{
			//EF_KIRIKAGE	Shadow Slash
			type: 'SPR',
			file: '\xb1\xd7\xb8\xb2\xc0\xda\xba\xa3\xb1\xe2',
			wav: 'effect/\xb1\xd7\xb8\xb2\xc0\xda\xba\xa3\xb1\xe2',
			attachedEntity: true
		}
	],

	631: [
		{
			//reverse tatami map unit	//EF_TATAMI	Reverse Tatami Map Unit
			type: 'SPR',
			file: '\xb4\xd9\xb4\xd9\xb9\xcc\x20\xb5\xda\xc1\xfd\xb1\xe2',
			wav: 'effect/\xb4\xd9\xb4\xd9\xb9\xcc\xb5\xda\xc1\xfd\xb1\xe2',
			attachedEntity: true
		}
	],

	632: [
		{
			//EF_KASUMIKIRI	Mist Slash
			type: 'SPR',
			file: '\xbe\xc8\xb0\xb3\xba\xa3\xb1\xe2',
			wav: 'effect/\xbe\xc8\xb0\xb3\xba\xa3\xb1\xe2',
			attachedEntity: true
		}
	],

	633: [
		{
			//EF_ISSEN	Final Strike
			type: 'SPR',
			file: '\xc0\xcf\xbc\xb6',
			wav: 'effect/\xc0\xcf\xbc\xb6',
			attachedEntity: true
		}
	],

	634: [
		{
			//EF_KAEN	Crimson Fire Formation
			type: 'SPR',
			file: '\xc8\xad\xbf\xb0\xc1\xf8',
			repeat: true,
			attachedEntity: true
		},
		{
			wav: 'effect/\xc8\xad\xbf\xb0\xc1\xf8'
		}
	],

	635: [
		{
			//EF_BAKU	Dragon Fire Formation
			type: 'STR',
			file: 'fire dragon',
			wav: 'effect/\xc6\xf8\xbf\xb0\xb7\xe6',
			attachedEntity: false
		}
	],

	636: [
		{
			//EF_HYOUSYOURAKU	Falling Ice Pillar
			type: 'STR',
			file: 'icy',
			wav: 'effect/\xba\xf9\xc1\xa4\xb6\xf4',
			attachedEntity: false
		}
	]
};
