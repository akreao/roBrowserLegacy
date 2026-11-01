/**
 * @module DB/Effects/Table/Jobs/Swordman/Paladin
 *
 * The Swordman line's Paladin effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

import Camera from 'Renderer/Camera.js';
import SongEffects from 'Renderer/Effects/Songs.js';

const GospelEffects = SongEffects.GospelEffects;

export default {
	//364: [{}],	//EF_VALLENTINE2	   Valentine Day Heart

	365: [
		{
			//EF_PRESSURE	   Gloria Domini
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
			file: 'effect/cross_old.bmp',
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
			file: 'effect/cross_old.bmp'
		},
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const start = Params.Inst.startTick + 500;
				Camera.setQuake(start);
			}
		}
	],

	366: [
		{
			//martyr's reckoning	//EF_BASH3D	   Martyr's Reckoning
			wav: 'effect/bash3d', // incorrect wav name
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const entity = Params.Init.ownerEntity;
				entity.animations.add(function (tick) {
					// Official: Halo (Double Body) is active between tick 20 and 40.
					entity._enableHalo = tick >= 150 && tick <= 450;

					if (tick >= 150 && tick <= 450) {
						// SetArgb(-1, 255, 200, 200) -> Light Red
						entity._flashColor[0] = 1.0;
						entity._flashColor[1] = 0.78;
						entity._flashColor[2] = 0.78;
						entity._flashColor[3] = 1.0;
						entity.recalculateBlendingColor();
					} else {
						entity._flashColor[0] = 1.0;
						entity._flashColor[1] = 1.0;
						entity._flashColor[2] = 1.0;
						entity._flashColor[3] = 1.0;
						entity.recalculateBlendingColor();
					}
					return tick > 500;
				});
			}
		},
		{
			type: 'CYLINDER',
			textureName: 'alpha_center',
			alphaMax: 0.6,
			duration: 175,
			delayStart: 200,
			duplicate: 5,
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
			duplicate: 5,
			delayStart: 200,
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

	370: [
		{
			//EF_BOTTOM_GOSPEL	Gospel Map Unit
			wav: 'effect/\xb0\xa1\xbd\xba\xc6\xe7', //°ˇ˝şĆç
			attachedEntity: true
		}
	],

	'370_ground': [
		{
			// Gospel
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				const self = this;
				GospelEffects.forEach(function (effect) {
					self.add(new effect(Params.Inst.position, Params.Inst.startTick), Params);
				});
			}
		}
	]
};
