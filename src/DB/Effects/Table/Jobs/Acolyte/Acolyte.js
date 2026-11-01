/**
 * @module DB/Effects/Table/Jobs/Acolyte/Acolyte
 *
 * The Acolyte line's Acolyte effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

export default {
	//36: [{}],	//EF_PORTAL	//warp portal unit

	37: [
		{
			//EF_INCAGILITY	AGI Up
			alphaMax: 1,
			attachedEntity: true,
			duration: 1000,
			delayLate: 500,
			duplicate: 7,
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
			alphaMax: 1,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			file: 'effect/agi_up.bmp',
			poszEnd: 3,
			poszStart: 0.4,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 100,
			sizeY: 45,
			type: '3D',
			wav: 'effect/ef_incagility',
			overlay: true,
			zIndex: 10
		}
	],

	38: [
		{
			//EF_DECAGILITY	AGI Down
			alphaMax: 1,
			attachedEntity: true,
			duration: 1000,
			duplicate: 20,
			fadeOut: true,
			file: 'effect/ac_center2.tga',
			posxRand: 1.5,
			posyRand: 1,
			poszEndRand: 1,
			poszEndRandMiddle: 1,
			poszStartRand: 1,
			poszStartRandMiddle: 6,
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
			fadeIn: true,
			fadeOut: true,
			file: 'effect/slow.bmp',
			poszEnd: 0.4,
			poszStart: 2.8,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 100,
			sizeY: 45,
			type: '3D',
			wav: 'effect/ef_decagility',
			zIndex: 10
		}
	],

	39: [
		{
			//EF_AQUA	Aqua Benedicta
			type: 'SPR',
			file: '\xbc\xba\xbc\xf6\xb6\xdf\xb1\xe2',
			wav: 'effect/ef_aqua',
			head: true,
			attachedEntity: true
		}
	],

	40: [
		{
			//EF_SIGNUM	Signum Crucis
			type: 'STR',
			file: 'cross',
			wav: 'effect/ef_signum',
			attachedEntity: true
		}
	],

	41: [
		{
			//EF_ANGELUS	Angelus
			type: 'STR',
			file: 'angelus',
			wav: 'effect/ef_angelus',
			min: 'jong_mini',
			head: true,
			attachedEntity: true
		}
	],

	42: [
		{
			//EF_BLESSING	Blessing
			type: 'SPR',
			attachedEntity: true,
			delayFrame: 30,
			file: '\xc3\xe0\xba\xb9',
			frame: 0,
			repeat: true,
			duration: 1500,
			stackable: true,
			head: true,
			yOffset: -120
		},
		{
			alphaMax: 1,
			attachedEntity: true,
			duration: 1200,
			delayOffset: 300,
			duplicate: 6,
			fadeIn: true,
			fadeOut: true,
			posxRand: 1.2,
			posyRand: 1,
			poszEndRand: 0.5,
			poszEndRandMiddle: 1,
			poszStartRand: 2,
			poszStartRandMiddle: 5.5,
			size: 50,
			sparkling: true,
			sparkNumber: 2,
			spriteName: 'particle6',
			timeBetweenDupli: 0,
			type: '3D',
			zIndex: 1
		},
		{
			alphaMax: 1,
			attachedEntity: true,
			duration: 1200,
			delayOffset: 400,
			duplicate: 6,
			fadeIn: true,
			fadeOut: true,
			posxRand: 1.4,
			posyRand: 1.1,
			poszEndRand: 0.5,
			poszEndRandMiddle: 1,
			poszStartRand: 2,
			poszStartRandMiddle: 5.5,
			size: 50,
			spriteName: 'particle6',
			timeBetweenDupli: 0,
			type: '3D',
			zIndex: 1
		},
		{
			alphaMax: 0.3,
			attachedEntity: false,
			blendMode: 2,
			blue: 1,
			duration: 2500,
			fadeIn: true,
			fadeOut: true,
			file: 'effect/pok2.tga',
			green: 0.75,
			posx: 0,
			posy: 0,
			posz: 0,
			red: 0.1,
			size: 140,
			type: '3D',
			wav: 'effect/ef_blessing',
			zIndex: 10
		}
	],

	66: [
		{
			//EF_CURE	Cure
			type: 'STR',
			file: 'cure',
			wav: 'effect/acolyte_cure',
			min: 'cure_min',
			attachedEntity: true
		}
	],

	141: [
		{
			//EF_PNEUMA	Pneuma
			type: 'STR',
			file: 'pneuma%d',
			rand: [1, 3],
			attachedEntity: false
		}
	],

	312: [
		{
			//EF_HEAL	   Heal Effect
			alphaMax: 0.2,
			animation: 1,
			attachedEntity: true,
			blendMode: 2,
			blue: 0.7,
			bottomSize: 0.95,
			duration: 1500,
			fade: true,
			green: 1,
			height: 8,
			red: 0.7,
			rotate: true,
			textureName: 'ring_white',
			topSize: 0.95,
			type: 'CYLINDER',
			wav: '_heal_effect'
		},
		{
			alphaMax: 0.2,
			animation: 1,
			attachedEntity: true,
			blendMode: 2,
			blue: 0.7,
			bottomSize: 1,
			duration: 1500,
			fade: true,
			green: 1,
			height: 8,
			red: 0.7,
			rotate: true,
			textureName: 'ring_white',
			topSize: 1,
			type: 'CYLINDER'
		},
		{
			alphaMax: 0.6,
			attachedEntity: true,
			blendMode: 2,
			blue: 1,
			duration: 1300,
			delayOffset: 400,
			duplicate: 15,
			fadeIn: true,
			fadeOut: true,
			file: 'effect/pok3.tga',
			green: 1,
			posxRand: 1.5,
			posyRand: 1.5,
			poszEndRand: 2,
			poszEndRandMiddle: 6,
			poszStart: 0,
			red: 1,
			size: 9,
			sizeRand: 2,
			timeBetweenDupli: 10,
			type: '3D',
			zIndex: 1
		},
		{
			alphaMax: 0.6,
			attachedEntity: true,
			blendMode: 2,
			blue: 1,
			duration: 1100,
			delayLate: 200,
			duplicate: 7,
			fadeIn: true,
			fadeOut: true,
			file: 'effect/pok3.tga',
			green: 1,
			posxRand: 1,
			posyRand: 1,
			poszEnd: 5,
			poszStartRand: 1,
			poszStartRandMiddle: 0,
			red: 1,
			size: 9,
			sizeRand: 2,
			timeBetweenDupli: 50,
			type: '3D',
			zIndex: 1
		}
	]
};
