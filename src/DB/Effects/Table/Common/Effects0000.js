/**
 * @module DB/Effects/Table/Common/Effects0000
 *
 * Effects 0000 to 99 of the effect table that no single class's skills
 * use: shared rows, monsters, items, statuses. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep rows in effect ID order.
 */

import LockOnTarget from 'Renderer/Effects/LockOnTarget.js';
import IceSpikes from 'Renderer/Effects/IceSpikes.js';
import { planShards as planIceShards, SHARDS as ICE_SHARDS } from 'Renderer/Effects/IceSpikesSim.js';

export default {
	0: [
		{
			//EF_HIT1	Regular hit
			type: '3D',
			duplicate: 4,
			timeBetweenDupli: 0,
			file: 'effect/pok3.tga',
			duration: 300,
			alphaMax: 0.8,
			alphaMin: 0.3,
			fadeIn: true,
			fadeOut: true,
			poszStart: 1,
			posxStart: 0,
			posyStart: 0,
			posxEndRand: 2,
			posyEndRand: 2,
			poszEndRand: 2,
			zIndex: 1,
			size: 10,
			red: 1,
			green: 1,
			blue: 1,
			sizeRand: 20,
			sizeSmooth: true,
			attachedEntity: false,
			sparkling: true
		}
	],

	1: [
		{
			alphaMax: 12,
			angleRand: [0, 35],
			attachedEntity: false,
			duration: 250,
			durationRand: [200, 350],
			fadeOut: true,
			fade: true,
			file: 'effect/lens1.tga',
			sizeEndX: 1,
			sizeRandEndY: [250, 300],
			sizeRandStartX: [25, 40],
			sizeRandStartY: [10, 10],
			circlePattern: true,
			circleOuterSizeRand: [5, 6],
			circleInnerSize: 2.2,
			type: '2D',
			overlay: true,
			zIndex: 1,
			wav: 'effect/ef_hit2'
		},
		{
			alphaMax: 12,
			angleRand: [50, 85],
			attachedEntity: false,
			duration: 250,
			durationRand: [200, 350],
			fadeOut: true,
			fade: true,
			file: 'effect/lens2.tga',
			sizeEndX: 1,
			sizeRandEndY: [250, 300],
			sizeRandStartX: [25, 40],
			sizeRandStartY: [10, 10],
			circlePattern: true,
			circleOuterSizeRand: [5, 6],
			circleInnerSize: 2.2,
			type: '2D',
			overlay: true,
			zIndex: 1
		},
		{
			alphaMax: 12,
			angleRand: [100, 135],
			attachedEntity: false,
			duration: 250,
			durationRand: [200, 350],
			fadeOut: true,
			fade: true,
			file: 'effect/lens1.tga',
			sizeEndX: 1,
			sizeRandEndY: [250, 300],
			sizeRandStartX: [25, 40],
			sizeRandStartY: [10, 10],
			circlePattern: true,
			circleOuterSizeRand: [5, 6],
			circleInnerSize: 2.2,
			type: '2D',
			overlay: true,
			zIndex: 1
		},
		{
			alphaMax: 12,
			angleRand: [150, 185],
			attachedEntity: false,
			duration: 250,
			durationRand: [200, 350],
			fadeOut: true,
			fade: true,
			file: 'effect/lens2.tga',
			sizeEndX: 1,
			sizeRandEndY: [250, 300],
			sizeRandStartX: [25, 40],
			sizeRandStartY: [10, 10],
			circlePattern: true,
			circleOuterSizeRand: [5, 6],
			circleInnerSize: 2.2,
			type: '2D',
			overlay: true,
			zIndex: 1
		},
		{
			alphaMax: 12,
			angleRand: [200, 235],
			attachedEntity: false,
			duration: 250,
			durationRand: [200, 350],
			fadeOut: true,
			fade: true,
			file: 'effect/lens1.tga',
			sizeEndX: 1,
			sizeRandEndY: [250, 300],
			sizeRandStartX: [25, 40],
			sizeRandStartY: [10, 10],
			circlePattern: true,
			circleOuterSizeRand: [5, 6],
			circleInnerSize: 2.2,
			type: '2D',
			overlay: true,
			zIndex: 1
		},
		{
			alphaMax: 12,
			angleRand: [255, 290],
			attachedEntity: false,
			duration: 250,
			durationRand: [200, 350],
			fadeOut: true,
			fade: true,
			file: 'effect/lens2.tga',
			sizeEndX: 1,
			sizeRandEndY: [250, 300],
			sizeRandStartX: [25, 40],
			sizeRandStartY: [10, 10],
			circlePattern: true,
			circleOuterSizeRand: [5, 6],
			circleInnerSize: 2.2,
			type: '2D',
			overlay: true,
			zIndex: 1
		},
		{
			alphaMax: 12,
			angleRand: [300, 335],
			attachedEntity: false,
			duration: 250,
			durationRand: [200, 350],
			fadeOut: true,
			fade: true,
			file: 'effect/lens1.tga',
			sizeEndX: 1,
			sizeRandEndY: [250, 300],
			sizeRandStartX: [25, 40],
			sizeRandStartY: [10, 10],
			circlePattern: true,
			circleOuterSizeRand: [5, 6],
			circleInnerSize: 2.2,
			type: '2D',
			overlay: true,
			zIndex: 1
		},
		{
			alphaMax: 12,
			angleRand: [340, 360],
			attachedEntity: false,
			duration: 250,
			durationRand: [200, 350],
			fadeOut: true,
			fade: true,
			file: 'effect/lens2.tga',
			sizeEndX: 1,
			sizeRandEndY: [250, 300],
			sizeRandStartX: [25, 40],
			sizeRandStartY: [10, 10],
			circlePattern: true,
			circleOuterSizeRand: [5, 6],
			circleInnerSize: 2.2,
			type: '2D',
			overlay: true,
			zIndex: 1
		}
	],

	2: [
		{
			//EF_HIT3	Melee Skill Hit
			type: 'CYLINDER',
			textureName: 'lens2',
			angleX: -90,
			posZ: 1,
			rotateWithCamera: true,
			bottomSize: 0.37,
			topSize: 1,
			height: 4,
			animation: 1,
			fade: true,
			duration: 150,
			alphaMax: 0.8,
			wav: 'effect/ef_hit3',
			attachedEntity: true
		},
		{
			type: 'CYLINDER',
			textureName: 'lens2',
			angleX: -90,
			posZ: 1,
			rotateWithCamera: true,
			bottomSize: 0.37,
			topSize: 0.37,
			height: 4,
			animation: 1,
			fade: true,
			duration: 150,
			alphaMax: 0.8,
			wav: 'effect/ef_hit3',
			attachedEntity: true
		}
	],

	3: [
		{
			//EF_HIT4	Melee Skill Hit
			type: 'CYLINDER',
			textureName: 'lens2',
			angleX: -90,
			posZ: 1,
			rotateWithCamera: true,
			bottomSize: 0.15,
			topSize: 1,
			height: 4,
			animation: 1,
			fade: true,
			duration: 150,
			alphaMax: 0.8,
			wav: 'effect/ef_hit4',
			attachedEntity: true
		}
	],

	4: [
		{
			//EF_HIT5	Melee Skill Hit
			alphaMax: 1,
			angle: 90,
			attachedEntity: false,
			duration: 400,
			fadeOut: true,
			file: 'effect/lens2.tga',
			posz: 1,
			rotate: true,
			sizeEndY: 200,
			sizeStartY: 10,
			sizeX: 15,
			toAngle: 0,
			type: '3D',
			wav: 'effect/ef_hit5'
		},
		{
			alphaMax: 1,
			angle: 180,
			attachedEntity: false,
			duration: 400,
			fadeOut: true,
			file: 'effect/lens2.tga',
			posz: 1,
			rotate: true,
			sizeEndY: 200,
			sizeStartY: 10,
			sizeX: 15,
			toAngle: 90,
			type: '3D',
			wav: 'effect/ef_hit5'
		}
	],

	5: [
		{
			//EF_HIT6	Melee Skill Hit
			alphaMax: 1,
			angle: 90,
			attachedEntity: false,
			duration: 400,
			fadeOut: true,
			file: 'effect/lens2.tga',
			posz: 1,
			rotate: true,
			sizeEndY: 150,
			sizeStartY: 10,
			sizeX: 10,
			toAngle: 0,
			type: '2D',
			overlay: true,
			wav: 'effect/ef_hit6'
		},
		{
			alphaMax: 1,
			angle: 180,
			attachedEntity: false,
			duration: 400,
			fadeOut: true,
			file: 'effect/lens2.tga',
			posz: 1,
			rotate: true,
			sizeEndY: 150,
			sizeStartY: 10,
			sizeX: 10,
			toAngle: 90,
			type: '2D',
			overlay: true,
			wav: 'effect/ef_hit6'
		}
	],

	6: [
		{
			//portal - entering the new map	//EF_ENTRY	Being Warped
			//type: 'FUNC',
			//file: 'effect/ring_blue',
			alphaMax: 0.62,
			animation: 1,
			attachedEntity: false,
			blendMode: 8,
			bottomSize: 0.9,
			duration: 500,
			fade: true,
			height: 7.5,
			rotate: true,
			textureName: 'ring_blue',
			topSize: 0.9,
			type: 'CYLINDER',
			wav: 'effect/ef_portal'
		},
		{
			alphaMax: 0.62,
			animation: 1,
			attachedEntity: true,
			blendMode: 8,
			bottomSize: 0.85,
			duration: 500,
			fade: true,
			height: 8,
			rotate: true,
			textureName: 'ring_blue',
			topSize: 0.85,
			type: 'CYLINDER'
		},
		{
			alphaMax: 0.8,
			animation: 1,
			attachedEntity: true,
			blendMode: 8,
			bottomSize: 0.9,
			duration: 500,
			fade: true,
			height: 1,
			rotate: true,
			textureName: 'ring_blue',
			topSize: 1.5,
			type: 'CYLINDER'
		}
	],

	7: [
		{
			//EF_EXIT	Item Heal effect
			alphaMax: 0.2,
			animation: 1,
			attachedEntity: true,
			blendMode: 2,
			bottomSize: 0.95,
			duration: 2000,
			fade: true,
			height: 10,
			textureName: 'alpha_down',
			topSize: 0.95,
			type: 'CYLINDER',
			wav: '_heal_effect'
		},
		{
			alphaMax: 0.8,
			attachedEntity: true,
			blendMode: 2,
			duration: 1000,
			delayOffset: 400,
			duplicate: 6,
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
			timeBetweenDupli: 80,
			type: '3D',
			zIndex: 1
		},
		{
			alphaMax: 0.8,
			attachedEntity: true,
			blendMode: 2,
			duration: 900,
			delayLate: 200,
			duplicate: 3,
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
			sparkling: true,
			sparkNumber: 2,
			timeBetweenDupli: 200,
			type: '3D',
			zIndex: 1
		}
	],

	8: [
		{
			//EF_WARP	Yellow Ripple Effect
			alphaMax: 0.8,
			animation: 4,
			attachedEntity: true,
			bottomSize: 10,
			duration: 1000,
			duplicate: 4,
			fade: true,
			height: 0,
			posZ: 0.1,
			textureName: 'ring_yellow',
			timeBetweenDupli: 300,
			topSize: 13,
			type: 'CYLINDER'
		}
	],

	12: [
		{
			//EF_BEGINSPELL	Yellow cast aura
			type: 'CYLINDER',
			alphaMax: 0.8,
			blendMode: 2,
			animation: 2,
			attachedEntity: true,
			bottomSize: 1,
			//duration: 1000,
			fade: true,
			height: 4,
			rotate: false,
			textureName: 'ring_yellow',
			topSize: 5,
			wav: 'effect/ef_beginspell'
		}
	],

	13: [
		{
			//EF_GLASSWALL	Blue Box
			type: 'STR',
			file: 'effect/safetywall',
			wav: 'effect/ef_glasswall',
			attachedEntity: false
		}
	],

	14: [
		{
			//EF_HEALSP	Blue restoring effect
			alphaMax: 0.2,
			animation: 1,
			attachedEntity: true,
			blendMode: 2,
			bottomSize: 0.95,
			duration: 2000,
			fade: true,
			height: 10,
			rotate: true,
			red: 0.1,
			green: 0.5,
			blue: 1,
			textureName: 'ring_blue',
			topSize: 0.95,
			type: 'CYLINDER',
			wav: '_heal_effect'
		},
		{
			alphaMax: 0.8,
			attachedEntity: true,
			blendMode: 2,
			duration: 1000,
			delayOffset: 400,
			duplicate: 6,
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
			red: 0.1,
			green: 0.5,
			blue: 1,
			timeBetweenDupli: 80,
			type: '3D',
			zIndex: 1
		},
		{
			alphaMax: 0.8,
			attachedEntity: true,
			blendMode: 2,
			duration: 900,
			delayLate: 200,
			duplicate: 3,
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
			sparkling: true,
			sparkNumber: 2,
			red: 0.1,
			green: 0.5,
			blue: 1,
			timeBetweenDupli: 200,
			type: '3D',
			zIndex: 1
		}
	],

	16: [
		{
			//hide and monster body relocation sound	//EF_BASH	Hide
			type: 'CYLINDER',
			textureName: 'alpha_down',
			alphaMax: 0.6,
			duration: 1000,
			rotate: true,
			fade: true,
			angleX: -90,
			fixedPerspective: true,
			posZ: 1.5,
			height: 0,
			bottomSize: 0.1,
			topSize: 2,
			animation: 2,
			zIndex: 1,
			wav: 'effect/ef_bash',
			attachedEntity: true
		},
		{
			type: 'CYLINDER',
			textureName: 'alpha_center',
			alphaMax: 0.6,
			duration: 1000,
			duplicate: 10,
			timeBetweenDupli: 0,
			totalCircleSides: 30,
			circleSides: 1,
			rotate: true,
			fade: true,
			angleX: -90,
			angleZRandom: 360,
			fixedPerspective: true,
			posZ: 1.5,
			height: 0,
			bottomSize: 0.01,
			topSize: 2.5,
			animation: 2,
			zIndex: 1.1,
			attachedEntity: true
		},
		{
			type: 'CYLINDER',
			textureName: 'alpha_center',
			alphaMax: 0.6,
			duration: 1000,
			duplicate: 8,
			timeBetweenDupli: 0,
			totalCircleSides: 30,
			circleSides: 1,
			rotate: true,
			fade: true,
			angleX: -90,
			angleZRandom: 360,
			fixedPerspective: true,
			posZ: 1.5,
			height: 0,
			bottomSize: 0.01,
			topSize: 4,
			animation: 2,
			zIndex: 1.2,
			attachedEntity: true
		}
	],

	// 19: [{}],	//EF_HIDING	Invalid Effect ID Popup in client

	20: [
		{
			//EF_PATTACK	Envenom/Poison
			alphaMax: 1,
			attachedEntity: true,
			blue: 1,
			duration: 1000,
			duplicate: 10,
			fadeIn: true,
			fadeOut: true,
			file: 'effect/pok1.tga',
			green: 0.7,
			posxRand: 1,
			posyRand: 1,
			poszEnd: 5,
			poszStart: 0,
			red: 1,
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

	22: [
		{
			//EF_SIGHT	Sight
			type: '3D',
			shadowTexture: true,
			alphaMax: 0.5,
			attachedEntity: true,
			blendMode: 8,
			duration: 12200,
			duplicate: 10,
			timeBetweenDupli: 0,
			nbOfRotation: 10,
			posx: -2,
			posz: 4,
			playSprite: true,
			rotateLate: 0.9,
			rotateLateDelta: -0.1,
			rotatePosX: 3,
			rotatePosY: 3,
			rotationClockwise: true,
			size: 30,
			sizeDelta: 10
		},
		{
			type: '3D',
			spriteName: 'sight',
			alphaMax: 123 / 255,
			alphaMaxDelta: 3 / 255,
			attachedEntity: true,
			blendMode: 8,
			duration: 12200,
			duplicate: 10,
			timeBetweenDupli: 0,
			nbOfRotation: 10,
			posx: -2,
			posz: 4,
			playSprite: true,
			rotateLate: 0.9,
			rotateLateDelta: -0.1,
			rotatePosX: 3,
			rotatePosY: 3,
			rotationClockwise: true,
			size: 60,
			sizeDelta: 20
		},
		{
			wav: 'effect/ef_sight'
		}
	],

	28: [
		{
			//EF_FROSTDIVER2	Frost Diver hit, on the target: 8 wide ice spikes bursting from the feet
			//(IceSpikesSim.js)
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				this.add(
					new IceSpikes(
						Params.Init.ownerEntity.position,
						Params.Inst.startTick,
						planIceShards(),
						ICE_SHARDS.life
					),
					Params
				);
			}
		},
		{
			wav: 'effect/ef_frostdiver2',
			attachedEntity: true
		}
	],

	32: [
		{
			//EF_NAPALMBEAT	Small clustered explosions
			//type: 'FUNC',
			//file: 'effect/Ao1ß1', // Uses up to Ao1ß8 , so eight files for an animated explosion
			wav: 'effect/ef_napalmbeat',
			attachedEntity: true
		}
	],

	33: [
		{
			//EF_RUWACH	//ruwach
			type: '3D',
			shadowTexture: true,
			alphaMax: 0.5,
			attachedEntity: true,
			blendMode: 8,
			duration: 12200,
			duplicate: 8,
			timeBetweenDupli: 0,
			nbOfRotation: 8,
			posx: -2,
			rotateLate: 0.7,
			rotateLateDelta: -0.1,
			rotatePosX: 3,
			rotatePosY: 3,
			rotationClockwise: true,
			size: 0.4,
			sizeDelta: 0.15
		},
		{
			type: '3D',
			spriteName: 'particle2',
			alphaMax: 0.07,
			alphaMaxDelta: 0.07,
			attachedEntity: true,
			blendMode: 2,
			red: 0,
			green: 1,
			blue: 1,
			duration: 12200,
			duplicate: 10,
			timeBetweenDupli: 0,
			nbOfRotation: 8,
			posx: -2,
			posz: 2,
			rotateLate: 0.7,
			rotateLateDelta: -0.1,
			rotatePosX: 3,
			rotatePosY: 3,
			rotationClockwise: true,
			size: 80,
			sizeDelta: 30
		},
		{
			wav: 'effect/ef_ruwach'
		}
	],

	34: [
		{
			//EF_TELEPORTATION	Old Map Exit Animation (unused)
			type: 'CYLINDER',
			alphaMax: 0.5,
			animation: 5,
			attachedEntity: true,
			blendMode: 8,
			bottomSize: 0.8,
			duration: 1000,
			fade: true,
			red: 1,
			green: 1,
			blue: 1,
			height: 35,
			rotate: true,
			textureName: 'ring_blue',
			topSize: 0.7,
			wav: 'effect/ef_teleportation'
		}
	],

	35: [
		{
			//warp portal casting before unit appear	//EF_READYPORTAL	Old Warp Portal (unused)
			alphaMax: 0.6,
			animation: 0,
			attachedEntity: true,
			blue: 1,
			bottomSize: 0.6,
			duration: 25000,
			fade: true,
			green: 0.7,
			height: 15,
			red: 0.7,
			rotate: true,
			textureName: 'alpha_down',
			topSize: 0.6,
			type: 'CYLINDER',
			wav: 'effect/ef_readyportal'
		}
	],

	43: [
		{
			//EF_INCAGIDEX	Dex + Agi Up
			alphaMax: 1,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			file: 'effect/dex_agi_up.bmp',
			poszEnd: 3,
			poszStart: 0.4,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 100,
			sizeY: 45,
			type: '3D',
			wav: 'effect/ef_incagidex',
			zIndex: 10
		}
	],

	44: [
		{
			//EF_SMOKE	Little fog Smoke (prontera chimneys)
			/*type: 'SPR',
			file: '\xb1\xbc\xb6\xd2\xbf\xac\xb1\xe2',
			attachedEntity: false*/

			type: '3D',
			spriteName: '\xb1\xbc\xb6\xd2\xbf\xac\xb1\xe2',

			duplicate: 10,
			timeBetweenDupli: 1000,

			duration: 10000,
			alphaMax: 0.8,
			fadeOut: true,
			fadeIn: false,

			poszStart: 0,
			poszEnd: 20,
			poszSmooth: false,

			posxStartRand: 0,
			posxEndRand: 3,
			posxSmooth: true,

			sizeStart: 70,
			sizeEnd: 300,
			sizeSmooth: true,

			angle: -90,
			toAngle: 0,
			rotate: true,
			rotateWithCamera: true,
			repeat: true,
			delayFrame: 100,

			param0_Func: function (e, v) {
				e.posxEnd = 0.5 + v * 0.01;
				e.size = e.size * (1 + Math.sin(v * 0.5) * 0.5);
			},

			param1_Func: function (e, v) {
				if (v < 5) {
					e.alpha = 1.0;
				}
				e.alpha = e.alpha * (0.9 + Math.random() * 0.1);
			}
		}
	],

	45: [
		{
			// This one is almost invisible, but there are some small white thingies flying around	//EF_FIREFLY	Faint Little Ball Things.
			type: 'FUNC',
			//file: 'sprite/AIANA®/particle1',
			attachedEntity: true
		}
	],

	47: [
		{
			//EF_TORCH	Torch
			type: '3D', // C++: PP_3DPARTICLE
			absoluteSpriteName: 'data/sprite/\xc0\xcc\xc6\xd1\xc6\xae/torch_01', // PT_USEORGARGB
			attachedEntity: true, // C++: m_pos = m_master->m_pos
			playSprite: true,
			duration: 600, // 6 frames 100delay each
			posz: 0.8, // C++: m_deltaPos2.y = -10
			posx: 0.1, // finetune
			size: 100, // C++: m_size (m_param[0]) 1.0f
			angle: 270,
			rotateToTarget: true,
			repeat: true
		}
	],

	49: [
		{
			//EF_FIREHIT	Firebolt/Wall Hits
			type: 'STR',
			file: 'firehit%d',
			wav: 'effect/ef_firehit',
			rand: [1, 3],
			attachedEntity: true
		}
	],

	50: [
		{
			//EF_FIRESPLASHHIT	Spinning Fire Thing
			type: '2D',
			overlay: true,
			duration: 500,
			file: 'effect/firering.tga',
			sizeStart: 10,
			sizeEnd: 300,
			angle: 0,
			toAngle: -360,
			rotate: true,
			fadeOut: true,
			posz: 1,
			attachedEntity: true
		}
	],

	51: [
		{
			// water hit	//EF_COLDHIT	Ice Elemental Hit
			wav: '_hit_fist%d',
			rand: [3, 4],
			attachedEntity: true
		} /*, {
			type: '2D',
			alphaMax: 1,
			angle: 0,
			angleDelta: 40,
			attachedEntity: false,
			duration: 140,
			duplicates: 9,
			fadeOut: true,
			file: 'effect/ice.tga',
			offsetxEnd: 3,
			offsetxStart: 0.5,
			size: 100,
			timeBetweenDupli: 0
		}*/
	],

	52: [
		{
			//EF_WINDHIT	Wind Elemental Hit
			type: 'STR',
			file: 'windhit%d',
			wav: '_hit_fist%d',
			rand: [1, 3],
			attachedEntity: true
		}
	],

	53: [
		{
			//EF_POISONHIT	Puff of Purpulish Smoke?
			type: 'SPR',
			file: 'poisonhit',
			wav: 'effect/ef_poisonattack',
			attachedEntity: false
		}
	],

	54: [
		{
			//EF_BEGINSPELL2	Cast Initiation Aura (Water Element)
			alphaMax: 0.2,
			animation: 1,
			attachedEntity: true,
			blendMode: 2,
			blue: 1,
			bottomSize: 1,
			//duration: 900,
			fade: true,
			green: 0.5,
			height: 30,
			red: 0.5,
			rotate: true,
			textureName: 'ring_blue',
			topSize: 1,
			type: 'CYLINDER'
		},
		{
			alphaMax: 0.2,
			animation: 1,
			attachedEntity: true,
			blendMode: 2,
			blue: 1,
			bottomSize: 1,
			//duration: 900,
			fade: true,
			green: 0.5,
			height: 1,
			red: 0.5,
			rotate: true,
			textureName: 'ring_blue',
			topSize: 1.3,
			type: 'CYLINDER'
		},
		{
			alphaMax: 0.6,
			animation: 2,
			attachedEntity: true,
			blendMode: 2,
			blue: 1,
			bottomSize: 1,
			//duration: 900,
			fade: true,
			green: 0.5,
			height: 3,
			red: 0.5,
			rotate: true,
			textureName: 'ring_blue',
			topSize: 4,
			type: 'CYLINDER',
			wav: 'effect/ef_beginspell'
		}
	],

	55: [
		{
			//EF_BEGINSPELL3	Cast Initiation Aura (Fire Element)
			alphaMax: 0.3,
			animation: 1,
			attachedEntity: true,
			blendMode: 2,
			blue: 0.4,
			bottomSize: 1,
			//duration: 900,
			fade: true,
			green: 0.4,
			height: 30,
			red: 1,
			rotate: true,
			textureName: 'ring_red',
			topSize: 1,
			type: 'CYLINDER'
		},
		{
			alphaMax: 0.7,
			animation: 1,
			attachedEntity: true,
			blendMode: 2,
			blue: 0.4,
			bottomSize: 1,
			//duration: 900,
			fade: true,
			green: 0.4,
			height: 2,
			red: 1,
			rotate: true,
			textureName: 'ring_red',
			topSize: 1.3,
			type: 'CYLINDER'
		},
		{
			alphaMax: 0.7,
			animation: 2,
			attachedEntity: true,
			blendMode: 2,
			blue: 0.4,
			bottomSize: 1,
			//duration: 900,
			fade: true,
			green: 0.4,
			height: 3,
			red: 1,
			rotate: true,
			textureName: 'ring_red',
			topSize: 4,
			type: 'CYLINDER',
			wav: 'effect/ef_beginspell'
		}
	],

	56: [
		{
			//EF_BEGINSPELL4	Cast Initiation Aura (Wind Element)
			alphaMax: 0.3,
			animation: 1,
			attachedEntity: true,
			blendMode: 2,
			blue: 0.6,
			bottomSize: 1,
			//duration: 900,
			fade: true,
			green: 1,
			height: 30,
			red: 0.6,
			rotate: true,
			textureName: 'ring_white',
			topSize: 1,
			type: 'CYLINDER'
		},
		{
			alphaMax: 0.6,
			animation: 1,
			attachedEntity: true,
			blendMode: 2,
			blue: 0.6,
			bottomSize: 1,
			//duration: 900,
			fade: true,
			green: 1,
			height: 2,
			red: 0.6,
			rotate: true,
			textureName: 'ring_white',
			topSize: 1.3,
			type: 'CYLINDER'
		},
		{
			alphaMax: 0.6,
			animation: 2,
			attachedEntity: true,
			blendMode: 2,
			blue: 0.6,
			bottomSize: 1,
			//duration: 900,
			fade: true,
			green: 1,
			height: 3,
			red: 0.6,
			rotate: true,
			textureName: 'ring_white',
			topSize: 4,
			type: 'CYLINDER',
			wav: 'effect/ef_beginspell'
		}
	],

	57: [
		{
			//EF_BEGINSPELL5	Cast Initiation Aura (Earth Element)
			alphaMax: 0.5,
			animation: 1,
			attachedEntity: true,
			blendMode: 0,
			blue: 1,
			bottomSize: 1,
			//duration: 900,
			fade: true,
			green: 1,
			height: 30,
			red: 1,
			rotate: true,
			textureName: 'ring_yellow',
			topSize: 1,
			type: 'CYLINDER'
		},
		{
			alphaMax: 1,
			animation: 1,
			attachedEntity: true,
			blendMode: 0,
			blue: 1,
			bottomSize: 1.1,
			//duration: 900,
			fade: true,
			green: 1,
			height: 3,
			red: 1,
			rotate: true,
			textureName: 'ring_yellow',
			topSize: 1.2,
			type: 'CYLINDER'
		},
		{
			alphaMax: 1,
			animation: 2,
			attachedEntity: true,
			blendMode: 0,
			blue: 1,
			bottomSize: 1,
			//duration: 900,
			fade: true,
			green: 1,
			height: 3,
			red: 1,
			rotate: true,
			textureName: 'ring_yellow',
			topSize: 4,
			type: 'CYLINDER',
			wav: 'effect/ef_beginspell'
		}
	],

	58: [
		{
			//EF_BEGINSPELL6	Cast Initiation Aura (Holy Element)
			alphaMax: 0.8,
			animation: 2,
			attachedEntity: true,
			blendMode: 2,
			blue: 1,
			bottomSize: 1,
			//duration: 900,
			fade: true,
			green: 1,
			height: 4,
			red: 1,
			rotate: true,
			textureName: 'ring_white',
			topSize: 5,
			type: 'CYLINDER',
			wav: 'effect/ef_beginspell'
		}
	],

	59: [
		{
			//EF_BEGINSPELL7	Cast Initiation Aura (Poison Element)
			alphaMax: 0.3,
			animation: 1,
			attachedEntity: true,
			blendMode: 2,
			blue: 0.8,
			bottomSize: 1,
			//duration: 900,
			fade: true,
			green: 0.8,
			height: 30,
			red: 0.8,
			rotate: true,
			textureName: 'ring_purple',
			topSize: 1,
			type: 'CYLINDER'
		},
		{
			alphaMax: 0.7,
			animation: 1,
			attachedEntity: true,
			blendMode: 2,
			blue: 0.8,
			bottomSize: 1,
			//duration: 900,
			fade: true,
			green: 0.8,
			height: 3,
			red: 0.8,
			rotate: true,
			textureName: 'ring_purple',
			topSize: 1.3,
			type: 'CYLINDER'
		},
		{
			alphaMax: 0.7,
			animation: 2,
			attachedEntity: true,
			blendMode: 2,
			blue: 0.8,
			bottomSize: 1,
			//duration: 900,
			fade: true,
			green: 0.8,
			height: 3,
			red: 0.8,
			rotate: true,
			textureName: 'ring_purple',
			topSize: 4,
			type: 'CYLINDER',
			wav: 'effect/ef_beginspell'
		}
	],

	60: [
		{
			//EF_LOCKON	Cast target circle
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				this.add(new LockOnTarget(Params.Init.ownerEntity, Params.Inst.startTick, Params.Inst.endTick), Params);
			}
		}
	],

	61: [
		{
			//EF_WARPZONE	Old Warp Portal (NPC Warp, unused)
			alphaMax: 0.3,
			animation: 3,
			attachedEntity: true,
			blendMode: 2,
			blue: 1,
			bottomSize: 2,
			duration: 2800,
			fade: true,
			green: 0.5,
			height: 1.1,
			red: 0.5,
			rotate: true,
			textureName: 'ring_blue',
			topSize: 3.3,
			type: 'CYLINDER'
		},
		{
			alphaMax: 0.3,
			animation: 3,
			attachedEntity: true,
			blendMode: 2,
			blue: 1,
			bottomSize: 1.9,
			duration: 2800,
			fade: true,
			green: 0.5,
			height: 1.1,
			red: 0.5,
			rotate: true,
			textureName: 'ring_blue',
			topSize: 3.2,
			type: 'CYLINDER'
		},
		{
			alphaMax: 1,
			attachedEntity: true,
			blue: 1,
			duration: 1000,
			duplicate: 3,
			fadeIn: true,
			fadeOut: true,
			file: 'effect/pok1.tga',
			green: 1,
			posxStartRand: 3,
			posxStartRandMiddle: 0,
			posyStartRand: 3,
			posyStartRandMiddle: 0,
			poszEndRand: 2,
			poszEndRandMiddle: 2,
			poszStart: 0,
			red: 1,
			size: 100,
			sizeRand: 17,
			type: '3D',
			zIndex: 1
		}
	],

	64: [
		{
			//EF_ARROWSHOT	Something Like Puruple/Yellow Light Bullet
			type: 'STR',
			file: 'arrowshot',
			attachedEntity: true
		}
	],

	65: [
		{
			//EF_INVENOM	Something Like Absorb of Power
			type: 'STR',
			file: 'invenom',
			wav: 'effect/thief_invenom',
			attachedEntity: true
		}
	],

	68: [
		{
			//EF_MVP	MVP Banner
			type: 'STR',
			file: 'mvp',
			wav: 'effect/st_mvp',
			attachedEntity: true
		}
	],

	77: [
		{
			//EF_RESURRECTION	Resurrection
			type: 'STR',
			file: 'resurrection',
			wav: 'effect/priest_resurrection',
			min: 'resurrection_min',
			attachedEntity: true
		}
	],

	81: [
		{
			// default skill sound?	//EF_PIERCE	Skill hit
			wav: 'effect/ef_bash',
			attachedEntity: true
		}
	],

	82: [
		{
			//turn undead caster	//EF_TURNUNDEAD	Turn Undead
			//type: 'FUNC',
			wav: 'effect/ef_bash',
			attachedEntity: true
		}
	]
};
