/**
 * @module DB/Effects/Table/Jobs/Thief/AssassinCross
 *
 * The Thief line's AssassinCross effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

export default {
	//357: [{}],	//EF_MINI_TETRIS	   (Nothing)
	//358: [{}],	//EF_GHOST	   Niflheim Ghost
	//359: [{}],	//EF_BAT	   Niflheim Bat Slow
	//360: [{}],	//EF_BAT2	   Niflheim Bat Fast

	361: [
		{
			//EF_SOULBREAKER	   Soul Destroyer
			type: '3D',
			file: 'effect/purpleslash.tga',
			alphaMax: 0.4,
			duration: 500,
			fadeIn: true,
			fadeOut: true,
			zIndex: 10,
			toSrc: true,
			rotateWithCamera: true,
			rotateToTarget: true,
			angle: 90,
			posz: 2,
			sizeStart: 100,
			sizeEnd: 200,
			wav: 'effect/\xb1\xe2\xb0\xf8\xc6\xf7',
			attachedEntity: true
		}
	],

	//408: [{}],	//EF_BABY	   Mom, Dad, I love you! (Baby Skill)

	409: [
		{
			//EF_SOULBREAKER2	   Meteor Assault
			wav: 'effect/\xb8\xde\xc5\xd7\xbf\xc0\x20\xbe\xee\xbd\xe4\xc6\xae'
		},
		{
			type: '3D',
			file: 'effect/purpleslash.tga',
			alphaMax: 0.6,
			duration: 500,
			fadeOut: true,
			zIndex: 10,
			sizeStart: 100,
			sizeEnd: 200,
			posxStart: -1,
			posxEnd: -5,
			posyStart: 0,
			posyEnd: 0,
			rotateWithCamera: true,
			angle: 0
		},
		{
			type: '3D',
			file: 'effect/purpleslash.tga',
			alphaMax: 0.6,
			duration: 500,
			fadeOut: true,
			zIndex: 10,
			sizeStart: 100,
			sizeEnd: 200,
			posxStart: -0.7,
			posxEnd: -3.53,
			posyStart: -0.7,
			posyEnd: -3.53,
			rotateWithCamera: true,
			angle: -45
		},
		{
			type: '3D',
			file: 'effect/purpleslash.tga',
			alphaMax: 0.6,
			duration: 500,
			fadeOut: true,
			zIndex: 10,
			sizeStart: 100,
			sizeEnd: 200,
			posxStart: 0,
			posxEnd: 0,
			posyStart: -1,
			posyEnd: -5,
			rotateWithCamera: true,
			angle: -90
		},
		{
			type: '3D',
			file: 'effect/purpleslash.tga',
			alphaMax: 0.6,
			duration: 500,
			fadeOut: true,
			zIndex: 10,
			sizeStart: 100,
			sizeEnd: 200,
			posxStart: 0.7,
			posxEnd: 3.53,
			posyStart: -0.7,
			posyEnd: -3.53,
			rotateWithCamera: true,
			angle: -135
		},
		{
			type: '3D',
			file: 'effect/purpleslash.tga',
			alphaMax: 0.6,
			duration: 500,
			fadeOut: true,
			zIndex: 10,
			sizeStart: 100,
			sizeEnd: 200,
			posxStart: 1,
			posxEnd: 5,
			posyStart: 0,
			posyEnd: 0,
			rotateWithCamera: true,
			angle: -180
		},
		{
			type: '3D',
			file: 'effect/purpleslash.tga',
			alphaMax: 0.6,
			duration: 500,
			fadeOut: true,
			zIndex: 10,
			sizeStart: 100,
			sizeEnd: 200,
			posxStart: 0.7,
			posxEnd: 3.53,
			posyStart: 0.7,
			posyEnd: 3.53,
			rotateWithCamera: true,
			angle: -225
		},
		{
			type: '3D',
			file: 'effect/purpleslash.tga',
			alphaMax: 0.6,
			duration: 500,
			fadeOut: true,
			zIndex: 10,
			sizeStart: 100,
			sizeEnd: 200,
			posxStart: 0,
			posxEnd: 0,
			posyStart: 1,
			posyEnd: 5,
			rotateWithCamera: true,
			angle: -270
		},
		{
			type: '3D',
			file: 'effect/purpleslash.tga',
			alphaMax: 0.6,
			duration: 500,
			fadeOut: true,
			zIndex: 10,
			sizeStart: 100,
			sizeEnd: 200,
			posxStart: -0.7,
			posxEnd: -3.53,
			posyStart: 0.7,
			posyEnd: 3.53,
			rotateWithCamera: true,
			angle: -315
		}
	],

	493: [
		{
			// edp	//EF_EDP	Enchant Deadly Poison
			wav: 'effect/assasin_cloaking',
			//blinking
			attachedEntity: true
		}
	]
};
