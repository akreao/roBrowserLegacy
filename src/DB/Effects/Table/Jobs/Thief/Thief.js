/**
 * @module DB/Effects/Table/Jobs/Thief/Thief
 *
 * The Thief line's Thief effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

export default {
	18: [
		{
			//EF_STEAL	Steal
			alphaMax: 1,
			attachedEntity: false,
			red: 1,
			green: 1,
			blue: 0.85,
			duration: 500,
			duplicate: 7,
			timeBetweenDupli: 0,
			fadeOut: true,
			file: 'effect/pok1.tga',
			posxEndRand: 3.5,
			posyEndRand: 3.5,
			poszEndRand: 1,
			poszEndRandMiddle: 3,
			sizeEnd: 10,
			sizeStart: 200,
			type: '3D',
			zIndex: 10
		},
		{
			wav: 'effect/ef_steal'
		}
	],

	21: [
		{
			//EF_DETOXICATION	Detoxify
			alphaMax: 1,
			attachedEntity: true,
			blue: 1,
			duration: 1000,
			duplicate: 10,
			fadeIn: true,
			fadeOut: true,
			file: 'effect/pok1.tga',
			green: 1,
			posxRand: 1,
			posyRand: 1,
			poszEnd: 5,
			poszStart: 0,
			red: 0.7,
			size: 100,
			sizeRand: 20,
			type: '3D',
			zIndex: 1
		},
		{
			attachedEntity: true,
			wav: 'effect/ef_detoxication' //wav: 'effect/assasin_enchantpoison',
		}
	],

	//307: [{}],	//EF_FORESTLIGHT	   Forest Light 1

	308: [
		{
			//EF_THROWITEM3	   Throw Stone
			type: '3D',
			alphaMax: 1,
			angle: 180,
			attachedEntity: true,
			duration: 200,
			fadeIn: true,
			fadeOut: true,
			file: '\xc0\xaf\xc0\xfa\xc0\xce\xc5\xcd\xc6\xe4\xc0\xcc\xbd\xba/item/\xb5\xb9.bmp',
			toSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			rotate: true,
			nbOfRotation: 0.5,
			size: 20,
			zOffset: 1,
			zIndex: 1
		}
	]
};
