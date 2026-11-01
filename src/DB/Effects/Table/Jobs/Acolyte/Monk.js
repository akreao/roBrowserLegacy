/**
 * @module DB/Effects/Table/Jobs/Acolyte/Monk
 *
 * The Acolyte line's Monk effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

export default {
	166: [
		{
			//EF_MAKEBLUR Energy Coat (Visual Effect)
			type: 'FUNC',
			func: function (Params) {
				const entity = Params.Init.ownerEntity;
				if (!entity) {
					return;
				}

				entity._enableTrail = true;
				entity._blurType = 1;

				setTimeout(() => {
					entity._enableTrail = false;
				}, Params.Init.duration || 2000);
			}
		}
	],

	253: [
		{
			//EF_ABSORBSPIRITS	   Absorb Spirit Spheres
			alphaMax: 0.3,
			animation: 1,
			attachedEntity: true,
			blendMode: 2,
			red: 0.3,
			green: 0.3,
			blue: 1,
			bottomSize: 1.1,
			duration: 1500,
			fade: true,
			height: 15,
			rotate: true,
			textureName: 'ring_blue',
			topSize: 1.1,
			type: 'CYLINDER',
			wav: 'effect/\xc8\xed\xb1\xe2'
		},
		{
			alphaMax: 0.3,
			animation: 1,
			attachedEntity: true,
			blendMode: 2,
			red: 0.3,
			green: 0.3,
			blue: 1,
			bottomSize: 1,
			duration: 1500,
			fade: true,
			height: 13,
			rotate: true,
			textureName: 'ring_blue',
			topSize: 1,
			type: 'CYLINDER'
		},
		{
			alphaMax: 0.3,
			animation: 1,
			attachedEntity: true,
			blendMode: 2,
			red: 0.3,
			green: 0.3,
			blue: 1,
			bottomSize: 1.1,
			duration: 1500,
			fade: true,
			height: 2,
			rotate: true,
			textureName: 'ring_blue',
			topSize: 3,
			type: 'CYLINDER'
		},
		{
			alphaMax: 0.8,
			attachedEntity: true,
			blendMode: 2,
			red: 0.3,
			green: 0.3,
			blue: 1,
			duration: 1500,
			duplicate: 4,
			fadeIn: true,
			fadeOut: true,
			file: 'effect/pok3.tga',
			posxRand: 1.2,
			posyRand: 1.2,
			poszEndRand: 1,
			poszEndRandMiddle: 8,
			poszStart: 0,
			size: 9,
			sizeRand: 2,
			sparkling: true,
			sparkNumber: 2,
			timeBetweenDupli: 10,
			type: '3D',
			zIndex: 1
		},
		{
			alphaMax: 0.8,
			attachedEntity: true,
			blendMode: 2,
			red: 0.3,
			green: 0.3,
			blue: 1,
			duration: 1300,
			delayOffset: 400,
			duplicate: 20,
			fadeIn: true,
			fadeOut: true,
			file: 'effect/pok3.tga',
			posxRand: 1.5,
			posyRand: 1.5,
			poszEndRand: 3,
			poszEndRandMiddle: 6,
			poszStart: 0,
			size: 9,
			sizeRand: 2,
			sparkling: true,
			sparkNumber: 2,
			timeBetweenDupli: 10,
			type: '3D',
			zIndex: 1
		},
		{
			alphaMax: 0.8,
			attachedEntity: true,
			blendMode: 2,
			red: 0.3,
			green: 0.3,
			blue: 1,
			duration: 1100,
			delayLate: 200,
			duplicate: 10,
			fadeIn: true,
			fadeOut: true,
			file: 'effect/pok3.tga',
			posxRand: 1,
			posyRand: 1,
			poszEnd: 6,
			poszStartRand: 1,
			poszStartRandMiddle: 0,
			size: 9,
			sizeRand: 2,
			timeBetweenDupli: 50,
			type: '3D',
			zIndex: 1
		}
	],

	262: [
		{
			//EF_TEIHIT1	   Raging Quadruple Blow
			wav: 'effect/\x6d\x6f\x6e\x5f\xc6\xf8\xb1\xe2',
			type: '3D',
			duplicate: 12,
			timeBetweenDupli: 0,
			file: 'effect/alpha_center.tga',
			delayStart: 250,
			duration: 550,
			alphaMax: 0.8,
			fadeIn: true,
			fadeOut: true,
			posxStart: 0,
			posyStart: 0,
			posxEndRand: 40,
			posyEndRand: 40,
			sizeStartX: 10,
			sizeStartY: 150,
			sizeEndX: 10,
			sizeEndY: 150,
			blendMode: 2,
			attachedEntity: true,
			overlay: true,
			rotateToTarget: true,
			rotateWithCamera: true
		}
	],

	//264: [{}],	//EF_TEIHIT2	   (Nothing)

	265: [
		{
			//EF_TANJI	   Throw Spirit Sphere
			type: '3D',
			file: 'effect/blue_ivy.bmp',
			alphaMax: 1,
			blendMode: 2,
			duration: 150,
			toSrc: true,
			rotateWithCamera: true,
			rotateToTarget: true,
			angle: 90,
			zOffset: 1,
			size: 50,
			wav: 'effect/mon_\xc5\xba\xc1\xf6\xbd\xc5\xc5\xeb',
			attachedEntity: true
		}
	],

	266: [
		{
			//EF_TEIHIT1X	   Asura Strike (Hit)
			wav: 'effect/\x6d\x6f\x6e\x5f\xbe\xc6\xbc\xf6\xb6\xf3\x20\xc6\xd0\xc8\xb2\xb1\xc7',
			type: '3D',
			duplicate: 24,
			timeBetweenDupli: 0,
			file: 'effect/lens1.tga',
			delayStart: 100,
			duration: 550,
			alphaMax: 0.8,
			fadeIn: true,
			fadeOut: true,
			posxStart: 0,
			posyStart: 0,
			posxEndRand: 40,
			posyEndRand: 40,
			sizeStartX: 10,
			sizeStartY: 150,
			sizeEndX: 10,
			sizeEndY: 150,
			blendMode: 2,
			attachedEntity: true,
			overlay: true,
			rotateToTarget: true,
			rotateWithCamera: true
		}
	],

	267: [
		{
			//EF_CHIMTO	   Occult Impaction
			wav: 'effect/mon_\xc4\xa7\xc5\xf5\xb0\xe6'
		}
	],

	273: [
		{
			//EF_CHAINCOMBO	Raging Quadruple Blow 4
			type: 'STR',
			file: '\xbf\xac\xc8\xaf',
			wav: 'effect/mon_\xbf\xac\xc8\xaf',
			attachedEntity: true
		}
	],

	329: [
		{
			//EF_TRIPLEATTACK	   Triple Strike
			wav: 'effect/ef_hit2'
		},
		{
			wav: 'effect/ef_hit4',
			delayWav: 200
		},
		{
			wav: 'effect/ef_hit2',
			delayWav: 400
		}
	]
};
