/**
 * @module DB/Effects/Table/Jobs/Mage/Wizard
 *
 * The Mage line's Wizard effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

import Camera from 'Renderer/Camera.js';
import QuadHorn from 'Renderer/Effects/QuadHorn.js';
import Altitude from 'Renderer/Map/Altitude.js';

export default {
	62: [
		//EF_SIGHTRASHER	Sight Trasher
		// Direction 1: North
		{
			type: '3D',
			shadowTexture: true,
			alphaMax: 0.5,
			duplicate: 4,
			timeBetweenDupli: 100,
			sizeDelta: -60,
			duration: 800,
			attachedEntity: false,
			posxStart: 0,
			posyStart: 0,
			posxEnd: 0,
			posyEnd: -8,
			poszStart: 2,
			poszEnd: 2,
			sizeStart: 60,
			sizeEnd: 160,
			playSprite: true,
			fadeIn: true,
			fadeOut: true,
			blendMode: 8
		},
		{
			type: '3D',
			spriteName: 'sight',
			alphaMax: 123 / 255,
			alphaMaxDelta: 3 / 255,
			duplicate: 4,
			timeBetweenDupli: 100,
			sizeDelta: -60,
			duration: 800,
			attachedEntity: false,
			posxStart: 0,
			posyStart: 0,
			posxEnd: 0,
			posyEnd: -8,
			poszStart: 2,
			poszEnd: 2,
			sizeStart: 20,
			sizeEnd: 260,
			playSprite: true,
			fadeIn: true,
			fadeOut: true,
			blendMode: 8
		},
		// Direction 2: Northeast
		{
			type: '3D',
			shadowTexture: true,
			alphaMax: 0.5,
			duplicate: 4,
			timeBetweenDupli: 100,
			sizeDelta: -60,
			duration: 800,
			attachedEntity: false,
			posxStart: 0,
			posyStart: 0,
			posxEnd: 5.66,
			posyEnd: -5.66,
			poszStart: 2,
			poszEnd: 2,
			sizeStart: 60,
			sizeEnd: 160,
			playSprite: true,
			fadeIn: true,
			fadeOut: true,
			blendMode: 8
		},
		{
			type: '3D',
			spriteName: 'sight',
			alphaMax: 123 / 255,
			alphaMaxDelta: 3 / 255,
			duplicate: 4,
			timeBetweenDupli: 100,
			sizeDelta: -60,
			duration: 800,
			attachedEntity: false,
			posxStart: 0,
			posyStart: 0,
			posxEnd: 5.66,
			posyEnd: -5.66,
			poszStart: 2,
			poszEnd: 2,
			sizeStart: 20,
			sizeEnd: 260,
			playSprite: true,
			fadeIn: true,
			fadeOut: true,
			blendMode: 8
		},
		// Direction 3: East
		{
			type: '3D',
			shadowTexture: true,
			alphaMax: 0.5,
			duplicate: 4,
			timeBetweenDupli: 100,
			sizeDelta: -60,
			duration: 800,
			attachedEntity: false,
			posxStart: 0,
			posyStart: 0,
			posxEnd: 8,
			posyEnd: 0,
			poszStart: 2,
			poszEnd: 2,
			sizeStart: 60,
			sizeEnd: 160,
			playSprite: true,
			fadeIn: true,
			fadeOut: true,
			blendMode: 8
		},
		{
			type: '3D',
			spriteName: 'sight',
			alphaMax: 123 / 255,
			alphaMaxDelta: 3 / 255,
			duplicate: 4,
			timeBetweenDupli: 100,
			sizeDelta: -60,
			duration: 800,
			attachedEntity: false,
			posxStart: 0,
			posyStart: 0,
			posxEnd: 8,
			posyEnd: 0,
			poszStart: 2,
			poszEnd: 2,
			sizeStart: 20,
			sizeEnd: 260,
			playSprite: true,
			fadeIn: true,
			fadeOut: true,
			blendMode: 8
		},
		// Direction 4: Southeast
		{
			type: '3D',
			shadowTexture: true,
			alphaMax: 0.5,
			duplicate: 4,
			timeBetweenDupli: 100,
			sizeDelta: -60,
			duration: 800,
			attachedEntity: false,
			posxStart: 0,
			posyStart: 0,
			posxEnd: 5.66,
			posyEnd: 5.66,
			poszStart: 2,
			poszEnd: 2,
			sizeStart: 60,
			sizeEnd: 160,
			playSprite: true,
			fadeIn: true,
			fadeOut: true,
			blendMode: 8
		},
		{
			type: '3D',
			spriteName: 'sight',
			alphaMax: 123 / 255,
			alphaMaxDelta: 3 / 255,
			duplicate: 4,
			timeBetweenDupli: 100,
			sizeDelta: -60,
			duration: 800,
			attachedEntity: false,
			posxStart: 0,
			posyStart: 0,
			posxEnd: 5.66,
			posyEnd: 5.66,
			poszStart: 2,
			poszEnd: 2,
			sizeStart: 20,
			sizeEnd: 260,
			playSprite: true,
			fadeIn: true,
			fadeOut: true,
			blendMode: 8
		},
		// Direction 5: South
		{
			type: '3D',
			shadowTexture: true,
			alphaMax: 0.5,
			duplicate: 4,
			timeBetweenDupli: 100,
			sizeDelta: -60,
			duration: 800,
			attachedEntity: false,
			posxStart: 0,
			posyStart: 0,
			posxEnd: 0,
			posyEnd: 8,
			poszStart: 2,
			poszEnd: 2,
			sizeStart: 60,
			sizeEnd: 160,
			playSprite: true,
			fadeIn: true,
			fadeOut: true,
			blendMode: 8
		},
		{
			type: '3D',
			spriteName: 'sight',
			alphaMax: 123 / 255,
			alphaMaxDelta: 3 / 255,
			duplicate: 4,
			timeBetweenDupli: 100,
			sizeDelta: -60,
			duration: 800,
			attachedEntity: false,
			posxStart: 0,
			posyStart: 0,
			posxEnd: 0,
			posyEnd: 8,
			poszStart: 2,
			poszEnd: 2,
			sizeStart: 20,
			sizeEnd: 260,
			playSprite: true,
			fadeIn: true,
			fadeOut: true,
			blendMode: 8
		},
		// Direction 6: Southwest
		{
			type: '3D',
			shadowTexture: true,
			alphaMax: 0.5,
			duplicate: 4,
			timeBetweenDupli: 100,
			sizeDelta: -60,
			duration: 800,
			attachedEntity: false,
			posxStart: 0,
			posyStart: 0,
			posxEnd: -5.66,
			posyEnd: 5.66,
			poszStart: 2,
			poszEnd: 2,
			sizeStart: 60,
			sizeEnd: 160,
			playSprite: true,
			fadeIn: true,
			fadeOut: true,
			blendMode: 8
		},
		{
			type: '3D',
			spriteName: 'sight',
			alphaMax: 123 / 255,
			alphaMaxDelta: 3 / 255,
			duplicate: 4,
			timeBetweenDupli: 100,
			sizeDelta: -60,
			duration: 800,
			attachedEntity: false,
			posxStart: 0,
			posyStart: 0,
			posxEnd: -5.66,
			posyEnd: 5.66,
			poszStart: 2,
			poszEnd: 2,
			sizeStart: 20,
			sizeEnd: 260,
			playSprite: true,
			fadeIn: true,
			fadeOut: true,
			blendMode: 8
		},
		// Direction 7: West
		{
			type: '3D',
			shadowTexture: true,
			alphaMax: 0.5,
			duplicate: 4,
			timeBetweenDupli: 100,
			sizeDelta: -60,
			duration: 800,
			attachedEntity: false,
			posxStart: 0,
			posyStart: 0,
			posxEnd: -8,
			posyEnd: 0,
			poszStart: 2,
			poszEnd: 2,
			sizeStart: 60,
			sizeEnd: 160,
			playSprite: true,
			fadeIn: true,
			fadeOut: true,
			blendMode: 8
		},
		{
			type: '3D',
			spriteName: 'sight',
			alphaMax: 123 / 255,
			alphaMaxDelta: 3 / 255,
			duplicate: 4,
			timeBetweenDupli: 100,
			sizeDelta: -60,
			duration: 800,
			attachedEntity: false,
			posxStart: 0,
			posyStart: 0,
			posxEnd: -8,
			posyEnd: 0,
			poszStart: 2,
			poszEnd: 2,
			sizeStart: 20,
			sizeEnd: 260,
			playSprite: true,
			fadeIn: true,
			fadeOut: true,
			blendMode: 8
		},
		// Direction 8: Northwest
		{
			type: '3D',
			shadowTexture: true,
			alphaMax: 0.5,
			duplicate: 4,
			timeBetweenDupli: 100,
			sizeDelta: -60,
			duration: 800,
			attachedEntity: false,
			posxStart: 0,
			posyStart: 0,
			posxEnd: -5.66,
			posyEnd: -5.66,
			poszStart: 2,
			poszEnd: 2,
			sizeStart: 60,
			sizeEnd: 160,
			playSprite: true,
			fadeIn: true,
			fadeOut: true,
			blendMode: 8
		},
		{
			type: '3D',
			spriteName: 'sight',
			alphaMax: 123 / 255,
			alphaMaxDelta: 3 / 255,
			duplicate: 4,
			timeBetweenDupli: 100,
			sizeDelta: -60,
			duration: 800,
			attachedEntity: false,
			posxStart: 0,
			posyStart: 0,
			posxEnd: -5.66,
			posyEnd: -5.66,
			poszStart: 2,
			poszEnd: 2,
			sizeStart: 20,
			sizeEnd: 260,
			playSprite: true,
			fadeIn: true,
			fadeOut: true,
			blendMode: 8
		},
		{
			wav: 'effect/wizard_sightrasher'
		}
	],

	74: [
		{
			//EF_ICEWALL	Ice Wall
			type: 'QuadHorn',
			textureFile: 'effect/ice.tga',
			attachedEntity: false,
			height: [2.8, 3.3],
			offsetX: [0.25, 0.75],
			offsetY: [0.25, 0.75],
			offsetZ: -0.1,
			bottomSize: [0.3, 0.5],
			blendMode: 8,
			rotateY: [1, 360],
			color: [1.0, 1.0, 1.0, 1.0],
			animation: 1,
			animationSpeed: 50
		},
		{
			type: 'QuadHorn',
			textureFile: 'effect/ice.tga',
			attachedEntity: false,
			height: [2.3, 2.8],
			offsetX: [0.25, 0.75],
			offsetY: [0.25, 0.75],
			offsetZ: -0.1,
			bottomSize: [0.3, 0.5],
			blendMode: 8,
			rotateY: [1, 360],
			color: [1.0, 1.0, 1.0, 1.0],
			animation: 1,
			animationSpeed: 50
		},
		{
			type: 'QuadHorn',
			textureFile: 'effect/ice.tga',
			attachedEntity: false,
			height: [2.5, 2.9],
			offsetX: [0.25, 0.75],
			offsetY: [0.25, 0.75],
			offsetZ: -0.1,
			bottomSize: [0.3, 0.5],
			blendMode: 8,
			rotateY: [1, 360],
			color: [1.0, 1.0, 1.0, 1.0],
			animation: 1,
			animationSpeed: 50
		},
		{
			wav: 'effect/wizard_icewall'
		}
	],

	79: [
		{
			//EF_EARTHSPIKE	Earth Spike
			//Main Spike
			type: 'QuadHorn',
			textureFile: 'effect/stone.bmp',
			attachedEntity: false,
			duration: 5000,
			height: [0.95, 1.5],
			offsetX: [0.4, 0.6],
			offsetY: [0.4, 0.6],
			offsetZ: -0.1,
			bottomSize: [0.5, 0.6],
			blendMode: 1,
			rotateY: [1, 360],
			rotateZ: [-8.0, 8.0],
			color: [1.0, 1.0, 1.0, 1.0],
			animation: 3,
			animationSpeed: 120,
			animationOut: true
		},
		{
			type: 'QuadHorn',
			textureFile: 'effect/stone.bmp',
			attachedEntity: false,
			duration: 5000,
			height: [0.2, 0.4],
			offsetX: [0.0, 0.0],
			offsetY: [0.5, 0.5],
			offsetZ: -0.1,
			bottomSize: [0.1, 0.2],
			blendMode: 1,
			rotateY: [1, 360],
			rotateZ: [-15.0, 15.0],
			color: [1.0, 1.0, 1.0, 1.0],
			animation: 2,
			animationSpeed: 100,
			animationOut: true
		},
		{
			type: 'QuadHorn',
			textureFile: 'effect/stone.bmp',
			attachedEntity: false,
			duration: 5000,
			height: [0.2, 0.4],
			offsetX: [0.0, 0.5],
			offsetY: [0.5, 1.0],
			offsetZ: -0.1,
			bottomSize: [0.1, 0.2],
			blendMode: 1,
			rotateY: [1, 360],
			rotateZ: [-15.0, 15.0],
			color: [1.0, 1.0, 1.0, 1.0],
			animation: 2,
			animationSpeed: 100,
			animationOut: true
		},
		{
			type: 'QuadHorn',
			textureFile: 'effect/stone.bmp',
			attachedEntity: false,
			duration: 5000,
			height: [0.2, 0.4],
			offsetX: [1.0, 1.2],
			offsetY: [0.5, 0.8],
			offsetZ: -0.1,
			bottomSize: [0.1, 0.2],
			blendMode: 1,
			rotateY: [1, 360],
			rotateZ: [-15.0, 15.0],
			color: [1.0, 1.0, 1.0, 1.0],
			animation: 2,
			animationSpeed: 100,
			animationOut: true
		},
		{
			type: 'QuadHorn',
			textureFile: 'effect/stone.bmp',
			attachedEntity: false,
			duration: 5000,
			height: [0.2, 0.4],
			offsetX: [0.5, 0.7],
			offsetY: [0.0, -0.2],
			offsetZ: -0.1,
			bottomSize: [0.1, 0.2],
			blendMode: 1,
			rotateY: [1, 360],
			rotateZ: [-15.0, 15.0],
			color: [1.0, 1.0, 1.0, 1.0],
			animation: 2,
			animationSpeed: 100,
			animationOut: true
		},
		{
			wav: 'effect/wizard_earthspike',
			attachedEntity: false
		},
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const start = Params.Inst.startTick;
				const duration = 200;
				Camera.setQuake(start, duration);
			}
		}
	],

	89: [
		{
			//EF_STORMGUST	Storm Gust
			type: 'STR',
			file: 'stormgust',
			wav: 'effect/wizard_stormgust',
			min: 'storm_min',
			attachedEntity: true
		}
	],

	90: [
		{
			//EF_LORD	Lord of Vermilion
			type: 'STR',
			file: 'lord',
			wav: 'effect/wizard_fire_ivy',
			attachedEntity: true
		}
	],

	92: [
		{
			//EF_METEORSTORM	Meteor Storm
			type: 'STR',
			file: 'meteor%d',
			wav: 'effect/wizard_meteor',
			rand: [1, 4],
			attachedEntity: true
		},
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const start = Params.Inst.startTick + 600;
				Camera.setQuake(start);
			}
		}
	],

	93: [
		{
			//EF_YUFITEL	Jupitel Thunder (Ball)
			wav: 'effect/hunter_shockwavetrap',
			attachedEntity: false
		},
		{
			type: '3D',
			file: 'effect/thunder_center.bmp',
			duration: 200, // Aprox. 20 frames on C++
			size: 35, // widthSize 3.5f
			toSrc: true, // PT3DTEX_CHKTARGETPOS
			blendMode: 2, // RF_EMISSIVE (Aprox. Additive)
			overlay: true,
			alphaMax: 0.66 // 170/255 on C++
		},
		{
			type: '3D',
			fileList: [
				'effect/thunder_ball_a.bmp',
				'effect/thunder_ball_b.bmp',
				'effect/thunder_ball_c.bmp',
				'effect/thunder_ball_d.bmp',
				'effect/thunder_ball_e.bmp',
				'effect/thunder_ball_f.bmp'
			],
			frameDelay: 10, // m_animSpeed = 1 on C++
			duration: 200, // Aprox. 20 frames on C++
			size: 45, // widthSize 4.5f
			toSrc: true, // PT3DTEX_CHKTARGETPOS
			overlay: true,
			blendMode: 2 // RF_EMISSIVE (Aprox. Additive)
		}
	],

	94: [
		{
			//EF_YUFITELHIT	Jupitel Thunder (Hit)
			type: '3D',
			file: 'effect/thunder_pang.bmp',
			duration: 100, // Aprox. 10 frames on C++
			sizeStart: 0,
			sizeEnd: 25, // widthSpeed 2.5f (Growing up)
			blendMode: 2, // RF_EMISSIVE (Aprox. Additive)
			rotateToTarget: true,
			fadeOut: true,
			overlay: true,
			attachedEntity: true
		},
		{
			type: '3D',
			fileList: [
				'effect/thunder_plazma_blast_a.bmp',
				'effect/thunder_plazma_blast_b.bmp',
				'effect/thunder_ball_d.bmp',
				'effect/thunder_ball_e.bmp',
				'effect/thunder_ball_f.bmp'
			],
			frameDelay: 10,
			duration: 300, // duration 300 on C++ is equal to 3000ms on ROB but it's the total duration of all hits, ROB parse each
			size: 75, // widthSize 7.5f * 10
			blendMode: 2, // RF_EMISSIVE (Aprox. Additive)
			overlay: true,
			attachedEntity: true
		}
	],

	95: [
		{
			//EF_QUAGMIRE	Quagmire
			type: 'STR',
			file: 'quagmire',
			attachedEntity: false
		},
		{
			wav: 'effect/wizard_quagmire'
		}
	],

	96: [
		{
			//firepillar caster	//EF_FIREPILLAR	Fire Pillar
			type: 'STR',
			file: 'firepillar',
			wav: 'effect/wizard_fire_pillar_a',
			attachedEntity: false
		}
	],

	97: [
		{
			//firepillar target hit	//EF_FIREPILLARBOMB	Fire Pillar/Land Mine hit
			type: 'STR',
			file: 'firepillarbomb',
			wav: 'effect/wizard_fire_pillar_b',
			attachedEntity: false
		}
	],

	116: [
		{
			//EF_WATERBALL	   Fling Watersphere
			type: '3D',
			duration: 500,
			fileList: ['effect/water_out_a.bmp', 'effect/water_out_b.bmp', 'effect/water_out_c.bmp'],
			fadeOut: true,
			posxRand: 1.5,
			poszRand: 1.5,
			posyStart: 0,
			posyEnd: 3,
			posySmooth: true,
			size: 30.5,
			rotateWithCamera: true,
			blendMode: 2,
			attachedEntity: true,
			wav: 'effect/wizard_waterball_chulung'
		}
	],

	117: [
		{
			//EF_WATERBALL2	waterball moving to target
			type: '3D',
			duration: 500,
			duplicate: 20,
			timeBetweenDupli: 50,
			absoluteSpriteName: 'data/sprite/\xc0\xcc\xc6\xd1\xc6\xae/waterball',
			playSprite: true,
			fromSrc: true,
			rotateToTarget: true,
			fadeOut: true,
			size: 50.0,
			zOffsetStart: 5,
			zOffsetEnd: 0,
			arc: 7.5,
			retreat: 5.0,
			wav: 'effect/wizard_waterball_chulung'
		}
	],

	138: [
		{
			//EF_FIREPILLARON	Fire pillar
			type: 'CYLINDER',
			attachedEntity: false,
			topSize: 2.0,
			bottomSize: 1.0,
			textureName: 'magic_red',
			height: 3,
			duration: 5000,
			delayOffset: 1000,
			rotate: true
		},
		{
			type: 'CYLINDER',
			attachedEntity: false,
			topSize: 1.5,
			bottomSize: 0.7,
			textureName: 'magic_red',
			height: 5,
			duration: 5000,
			delayOffset: 1000,
			rotate: true
		},
		{
			type: 'CYLINDER',
			attachedEntity: false,
			topSize: 1.0,
			bottomSize: 0.5,
			textureName: 'magic_red',
			height: 7,
			duration: 5000,
			delayOffset: 1000,
			rotate: true
		}
	],

	142: [
		{
			//EF_HEAVENDRIVE
			type: 'FUNC',
			func: function (Params) {
				for (let i = -2; i <= 2; i++) {
					for (let j = -2; j <= 2; j++) {
						const newParams = {
							effect: {
								type: 'QuadHorn',
								textureFile: 'effect/stone.bmp',
								attachedEntity: false,
								duration: 1000,
								height: [0.75, 1.2],
								offsetX: [0.2, 0.2],
								offsetY: [0.2, 0.2],
								offsetZ: -0.1,
								bottomSize: [0.4, 0.7],
								blendMode: 1,
								rotateY: [1, 360],
								rotateZ: [-8.0, 8.0],
								color: [1.0, 1.0, 1.0, 1.0],
								animation: 3,
								animationSpeed: 250,
								animationOut: true
							},
							Init: {},
							Inst: {}
						};
						const newPos = [Params.Init.position[0] + i, Params.Init.position[1] + j];
						Object.assign(newParams.Init, Params.Init);
						newParams.Init.position = [newPos[0], newPos[1], Altitude.getCellHeight(newPos[0], newPos[1])];
						newParams.Init.duration = newParams.effect.duration;
						Object.assign(newParams.Inst, Params.Inst);
						newParams.Inst.position = [newPos[0], newPos[1], Altitude.getCellHeight(newPos[0], newPos[1])];
						newParams.Inst.duration = newParams.effect.duration;
						newParams.Inst.endTick = newParams.Inst.startTick + newParams.effect.duration;
						this.add(new QuadHorn(newParams.effect, newParams.Inst, newParams.Init), newParams);
					}
				}
			}
		},
		{
			wav: 'effect/wizard_earthspike',
			attachedEntity: false
		},
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const start = Params.Inst.startTick;
				const duration = 200;
				Camera.setQuake(start, duration);
			}
		}
	]
};
