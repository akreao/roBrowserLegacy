/**
 * @module DB/Effects/Table/Jobs/Merchant/Alchemist
 *
 * The Merchant line's Alchemist effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

import Camera from 'Renderer/Camera.js';

export default {
	220: [
		{
			//EF_POTION_BERSERK	Berserk Potion
			type: 'STR',
			file: '\xb9\xf6\xbc\xad\xc5\xa9',
			wav: 'effect/ac_concentration',
			attachedEntity: true
		},
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const start = Params.Inst.startTick + 200;
				const duration = 200;
				Camera.setQuake(start, duration);
			}
		}
	],

	298: [
		{
			//EF_THROWITEM	   Acid Terror Animnation
			type: '3D',
			alphaMax: 1,
			angle: 180,
			attachedEntity: true,
			duration: 300,
			fadeIn: true,
			fadeOut: true,
			file: '\xc0\xaf\xc0\xfa\xc0\xce\xc5\xcd\xc6\xe4\xc0\xcc\xbd\xba/item/\xbf\xb0\xbb\xea\xba\xb4.bmp',
			toSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			rotate: true,
			nbOfRotation: 0.5,
			size: 30,
			zOffset: 1,
			zIndex: 1
		}
	],

	//301: [{}],	//EF_POKJUK_SOUND	   Fire Works (Sound Effect) [this is needed?]

	302: [
		{
			//EF_DEMONSTRATION	Bomb
			type: 'SPR',
			file: '\xb5\xa5\xb8\xf3\xbd\xba\xc6\xae\xb7\xb9\xc0\xcc\xbc\xc7',
			attachedEntity: false
		}
	]
};
