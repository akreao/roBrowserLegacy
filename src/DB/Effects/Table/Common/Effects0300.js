/**
 * @module DB/Effects/Table/Common/Effects0300
 *
 * Effects 0300 to 399 of the effect table that no single class's skills
 * use: shared rows, monsters, items, statuses. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep rows in effect ID order.
 */

import SakuraWeatherEffect from 'Renderer/Effects/SakuraWeatherEffect.js';
import Camera from 'Renderer/Camera.js';
import Poison from 'Renderer/Effects/PoisonEffect.js';
import Blind from 'Renderer/Effects/Shaders/Blind.js';

export default {
	//299: [{}],	//EF_THROWITEM2	   (Nothing)

	300: [
		{
			//EF_CHEMICALPROTECTION	   Chemical Protection
			wav: 'apocalips_attack'
		}
	],

	303: [
		{
			//EF_CHEMICAL2
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const start = Params.Inst.startTick + 132;
				Camera.setQuake(start);
			}
		}
	],

	304: [
		{
			//teleportation animation	//EF_TELEPORTATION2	Teleportation Animation
			alphaMax: 0.5,
			animation: 5,
			attachedEntity: true,
			blendMode: 2,
			blue: 1,
			bottomSize: 0.3,
			duration: 1500,
			fade: true,
			green: 0.6,
			height: 35,
			red: 0.6,
			rotate: true,
			textureName: 'ring_blue',
			topSize: 0.3,
			type: 'CYLINDER',
			wav: 'effect/ef_teleportation'
		},
		{
			alphaMax: 0.5,
			animation: 5,
			attachedEntity: true,
			blendMode: 2,
			blue: 1,
			bottomSize: 0.6,
			duration: 1500,
			fade: true,
			green: 0.6,
			height: 25,
			red: 0.6,
			rotate: true,
			textureName: 'ring_blue',
			topSize: 0.8,
			type: 'CYLINDER'
		},
		{
			alphaMax: 0.5,
			animation: 5,
			attachedEntity: true,
			blendMode: 2,
			blue: 1,
			bottomSize: 0.8,
			duration: 1500,
			fade: true,
			green: 0.6,
			height: 13,
			red: 0.6,
			rotate: true,
			textureName: 'ring_blue',
			topSize: 1,
			type: 'CYLINDER'
		},
		{
			alphaMax: 0.5,
			animation: 5,
			attachedEntity: true,
			blendMode: 2,
			blue: 1,
			bottomSize: 1,
			duration: 1500,
			fade: true,
			green: 0.6,
			height: 5,
			red: 0.6,
			rotate: true,
			textureName: 'ring_blue',
			topSize: 1.3,
			type: 'CYLINDER'
		}
	],

	305: [
		{
			//potion success	//EF_PHARMACY_OK	Pharmacy Success
			type: 'STR',
			file: 'p_success',
			wav: 'effect/p_success',
			attachedEntity: true
		}
	],

	306: [
		{
			//potion failed	//EF_PHARMACY_FAIL	Pharmacy Failed
			type: 'STR',
			file: 'p_failed',
			wav: 'effect/p_failed',
			attachedEntity: true
		}
	],

	314: [
		{
			//EF_EXIT2	   Old Map Exit effect (Unused)
			alphaMax: 0.3,
			animation: 1,
			attachedEntity: true,
			blendMode: 2,
			blue: 1,
			bottomSize: 0.3,
			duration: 1500,
			fade: true,
			green: 0.5,
			height: 35,
			red: 0.5,
			rotate: true,
			textureName: 'ring_blue',
			topSize: 0.3,
			type: 'CYLINDER',
			wav: 'effect/ef_teleportation'
		},
		{
			alphaMax: 0.3,
			animation: 1,
			attachedEntity: true,
			blendMode: 2,
			blue: 1,
			bottomSize: 0.4,
			duration: 1500,
			fade: true,
			green: 0.5,
			height: 23,
			red: 0.5,
			rotate: true,
			textureName: 'ring_blue',
			topSize: 0.6,
			type: 'CYLINDER'
		},
		{
			alphaMax: 0.3,
			animation: 1,
			attachedEntity: true,
			blendMode: 2,
			blue: 1,
			bottomSize: 0.5,
			duration: 1500,
			fade: true,
			green: 0.5,
			height: 5,
			red: 0.5,
			rotate: true,
			textureName: 'ring_blue',
			topSize: 0.7,
			type: 'CYLINDER'
		}
	],

	315: [
		{
			//EF_GLASSWALL2	Safety Wall
			attachedEntity: true,
			file: 'safetywall',
			repeat: false,
			type: 'STR',
			wav: 'effect/ef_glasswall'
		},
		{
			alphaMax: 0.4,
			animation: 0,
			attachedEntity: true,
			blendMode: 2,
			blue: 0.5,
			bottomSize: 0.6,
			duration: 50000,
			fade: true,
			green: 0.1,
			height: 7,
			red: 0.5,
			rotate: true,
			textureName: 'alpha_down',
			topSize: 0.6,
			type: 'CYLINDER'
		},
		{
			alphaMax: 0.4,
			animation: 0,
			attachedEntity: true,
			blendMode: 2,
			blue: 0.5,
			bottomSize: 0.65,
			duration: 50000,
			delayOffset: 50,
			fade: true,
			green: 0.1,
			height: 6,
			red: 0.5,
			rotate: true,
			textureName: 'alpha_down',
			topSize: 0.65,
			type: 'CYLINDER'
		},
		{
			alphaMax: 0.4,
			animation: 0,
			attachedEntity: true,
			blendMode: 2,
			blue: 0.5,
			bottomSize: 0.7,
			duration: 50000,
			delayOffset: 100,
			fade: true,
			green: 0.1,
			height: 7,
			red: 0.5,
			rotate: true,
			textureName: 'alpha_down',
			topSize: 0.7,
			type: 'CYLINDER'
		}
	],

	316: [
		{
			//Warp Portal Animation 1	//EF_READYPORTAL2	Warp Portal Animation 1
			alphaMax: 0.4,
			animation: 4,
			attachedEntity: true,
			blendMode: 2,
			renderBeforeEntities: true,
			blue: 1,
			bottomSize: 2.4,
			duration: 500,
			fadeOut: true,
			green: 0.6,
			height: 0.1,
			posZ: 0.1,
			red: 0.6,
			rotate: true,
			textureName: 'ring_blue',
			repeat: true,
			repeatDelay: -300,
			topSize: 3.9,
			wav: 'effect/ef_readyportal',
			type: 'CYLINDER'
		}
	],

	317: [
		{
			//Warp Portal Animation 2	//EF_PORTAL2	Warp Portal Animation 2
			alphaMax: 0.4,
			animation: 4,
			attachedEntity: true,
			blendMode: 2,
			renderBeforeEntities: true,
			blue: 1,
			bottomSize: 2.4,
			duration: 500,
			fadeOut: true,
			green: 0.6,
			height: 0.1,
			posZ: 0.1,
			red: 0.6,
			rotate: true,
			textureName: 'ring_blue',
			repeat: true,
			repeatDelay: -300,
			topSize: 3.9,
			wav: 'effect/ef_readyportal',
			type: 'CYLINDER'
		},
		{
			alphaMax: 0.3,
			animation: 0,
			attachedEntity: true,
			blendMode: 2,
			blue: 1,
			bottomSize: 0.6,
			duration: 25000,
			fade: true,
			green: 0.6,
			height: 15,
			red: 0.6,
			rotate: true,
			textureName: 'ring_blue',
			topSize: 0.6,
			wav: 'effect/ef_portal',
			type: 'CYLINDER'
		},
		{
			alphaMax: 0.3,
			animation: 0,
			attachedEntity: true,
			blendMode: 2,
			blue: 1,
			bottomSize: 0.8,
			duration: 25000,
			fade: true,
			green: 0.6,
			height: 13,
			red: 0.6,
			rotate: true,
			textureName: 'ring_blue',
			topSize: 0.8,
			type: 'CYLINDER'
		},
		{
			alphaMax: 0.5,
			animation: 0,
			attachedEntity: true,
			blendMode: 2,
			blue: 1,
			bottomSize: 1,
			duration: 25000,
			fade: true,
			green: 0.6,
			height: 1,
			posZ: 2,
			red: 0.6,
			rotate: true,
			totalCircleSides: 20,
			circleSides: 10,
			repeatTextureX: 2,
			textureName: 'alpha1',
			topSize: 1,
			type: 'CYLINDER'
		}
	],

	soulink_caster_effect: [
		{
			// todo
			wav: 'effect/\x74\x5f\xba\xae\xc6\xa8\xb1\xe8',
			attachedEntity: false
		}
	],

	320: [
		{
			//EF_HEAL3	   Offensive Heal
			alphaMax: 0.2,
			animation: 1,
			attachedEntity: true,
			blendMode: 2,
			blue: 1,
			bottomSize: 0.95,
			duration: 1000,
			fade: true,
			green: 1,
			height: 10,
			red: 1,
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
			blue: 1,
			bottomSize: 1,
			duration: 1000,
			fade: true,
			green: 1,
			height: 9,
			red: 1,
			rotate: true,
			textureName: 'ring_white',
			topSize: 1,
			type: 'CYLINDER'
		},
		{
			alphaMax: 0.8,
			attachedEntity: true,
			blendMode: 2,
			blue: 1,
			duration: 1000,
			delayOffset: 400,
			duplicate: 10,
			fadeIn: true,
			fadeOut: true,
			file: 'effect/pok3.tga',
			green: 1,
			posxRand: 1.5,
			posyRand: 1.5,
			poszEndRand: 3,
			poszEndRandMiddle: 6,
			poszStart: 0,
			red: 1,
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
			blue: 1,
			duration: 900,
			delayLate: 200,
			duplicate: 5,
			fadeIn: true,
			fadeOut: true,
			file: 'effect/pok3.tga',
			green: 1,
			posxRand: 1,
			posyRand: 1,
			poszEnd: 6,
			poszStartRand: 1,
			poszStartRandMiddle: 0,
			red: 1,
			size: 9,
			sizeRand: 2,
			sparkling: true,
			sparkNumber: 2,
			timeBetweenDupli: 50,
			type: '3D',
			zIndex: 1
		}
	],

	321: [
		{
			//EF_WARPZONE2	   Warp NPC
			alphaMax: 0.4,
			animation: 3,
			renderBeforeEntities: true,
			attachedEntity: true,
			blendMode: 2,
			bottomSize: 2,
			duration: 4000,
			duplicate: 4,
			timeBetweenDupli: 1000,
			fade: true,
			red: 0.5,
			green: 0.5,
			blue: 1,
			height: 1.1,
			repeat: true,
			rotate: false,
			textureName: 'ring_blue',
			topSize: 3.3,
			type: 'CYLINDER'
		},
		{
			alphaMax: 0.4,
			animation: 3,
			renderBeforeEntities: true,
			attachedEntity: true,
			blendMode: 2,
			bottomSize: 1.9,
			duration: 4000,
			duplicate: 4,
			timeBetweenDupli: 1000,
			fade: true,
			red: 0.5,
			green: 0.5,
			blue: 1,
			height: 1.1,
			repeat: true,
			rotate: false,
			textureName: 'ring_blue',
			topSize: 3.2,
			type: 'CYLINDER'
		},
		{
			alphaMax: 1.0,
			attachedEntity: true,
			blendMode: 2,
			renderBeforeEntities: true,
			duration: 1000,
			duplicate: 5,
			timeBetweenDupli: 300,
			fadeIn: true,
			fadeOut: true,
			file: 'effect/pok1.tga',
			red: 0.9,
			green: 1,
			blue: 0.9,
			posxStartRand: 3,
			posxStartRandMiddle: 0,
			posyStartRand: 3,
			posyStartRandMiddle: 0,
			poszEndRand: 2,
			poszEndRandMiddle: 2,
			poszStart: 0,
			repeat: true,
			size: 50,
			type: '3D',
			zIndex: 1
		}
	],
	//326: [{}],	//EF_FOOT	   Chase Walk Left Foot
	//327: [{}],	//EF_FOOT2	   Chse Walk Right Foot

	328: [
		{
			//EF_BEGINASURA	   Monk Asura Strike
			type: 'CYLINDER',
			textureName: 'ring_white',
			fade: true,
			animation: 2,
			attachedEntity: true,
			blendMode: 2,
			bottomSize: 1,
			topSize: 4.5,
			height: -4,
			duration: 800
		},
		{
			type: 'CYLINDER',
			textureName: 'ring_white',
			fade: true,
			animation: 2,
			attachedEntity: true,
			blendMode: 2,
			bottomSize: 1,
			topSize: 2.5,
			height: -4,
			duration: 800
		},
		// asura1 — phase 1: appear + shrink
		{
			type: '3D',
			file: 'effect/asura1.tga',
			alphaMax: 1,
			attachedEntity: true,
			duration: 1200,
			duplicate: 3,
			timeBetweenDupli: 150,
			alphaMaxDelta: -0.25,
			fadeIn: true,
			sizeStart: 250,
			sizeEnd: 120,
			sizeSmooth: true,
			posx: -6.0,
			posy: 0,
			posz: 4,
			overlay: true,
			red: 0.1,
			green: 0.1,
			blue: 0.1,
			delayStart: 0
		},
		// asura1 — phase 2: grow-back + fade out
		{
			type: '3D',
			file: 'effect/asura1.tga',
			alphaMax: 1,
			attachedEntity: true,
			duration: 400,
			fadeOut: true,
			sizeStart: 120,
			sizeEnd: 200,
			posx: -6.0,
			posy: 0,
			posz: 4,
			overlay: true,
			red: 0.1,
			green: 0.1,
			blue: 0.1,
			delayStart: 1200
		},
		// asura2 — phase 1
		{
			type: '3D',
			file: 'effect/asura2.tga',
			alphaMax: 1,
			attachedEntity: true,
			duration: 1200,
			duplicate: 3,
			timeBetweenDupli: 150,
			alphaMaxDelta: -0.25,
			fadeIn: true,
			sizeStart: 250,
			sizeEnd: 120,
			sizeSmooth: true,
			posx: -3.6,
			posy: 0,
			posz: 4,
			overlay: true,
			red: 0.1,
			green: 0.1,
			blue: 0.1,
			delayStart: 100
		},
		// asura2 — phase 2
		{
			type: '3D',
			file: 'effect/asura2.tga',
			alphaMax: 1,
			attachedEntity: true,
			duration: 400,
			fadeOut: true,
			sizeStart: 120,
			sizeEnd: 200,
			posx: -3.6,
			posy: 0,
			posz: 4,
			overlay: true,
			red: 0.1,
			green: 0.1,
			blue: 0.1,
			delayStart: 1300
		},
		// asura3 — phase 1
		{
			type: '3D',
			file: 'effect/asura3.tga',
			alphaMax: 1,
			attachedEntity: true,
			duration: 1200,
			duplicate: 3,
			timeBetweenDupli: 150,
			alphaMaxDelta: -0.25,
			fadeIn: true,
			sizeStart: 250,
			sizeEnd: 120,
			sizeSmooth: true,
			posx: -1.2,
			posy: 0,
			posz: 4,
			overlay: true,
			red: 0.1,
			green: 0.1,
			blue: 0.1,
			delayStart: 200
		},
		// asura3 — phase 2
		{
			type: '3D',
			file: 'effect/asura3.tga',
			alphaMax: 1,
			attachedEntity: true,
			duration: 400,
			fadeOut: true,
			sizeStart: 120,
			sizeEnd: 200,
			posx: -1.2,
			posy: 0,
			posz: 4,
			overlay: true,
			red: 0.1,
			green: 0.1,
			blue: 0.1,
			delayStart: 1400
		},
		// asura4 — phase 1
		{
			type: '3D',
			file: 'effect/asura4.tga',
			alphaMax: 1,
			attachedEntity: true,
			duration: 1200,
			duplicate: 3,
			timeBetweenDupli: 150,
			alphaMaxDelta: -0.25,
			fadeIn: true,
			sizeStart: 250,
			sizeEnd: 120,
			sizeSmooth: true,
			posx: 1.2,
			posy: 0,
			posz: 4,
			overlay: true,
			red: 0.1,
			green: 0.1,
			blue: 0.1,
			delayStart: 300
		},
		// asura4 — phase 2
		{
			type: '3D',
			file: 'effect/asura4.tga',
			alphaMax: 1,
			attachedEntity: true,
			duration: 400,
			fadeOut: true,
			sizeStart: 120,
			sizeEnd: 200,
			posx: 1.2,
			posy: 0,
			posz: 4,
			overlay: true,
			red: 0.1,
			green: 0.1,
			blue: 0.1,
			delayStart: 1500
		},
		// asura5 — phase 1
		{
			type: '3D',
			file: 'effect/asura5.tga',
			alphaMax: 1,
			attachedEntity: true,
			duration: 1200,
			duplicate: 3,
			timeBetweenDupli: 150,
			alphaMaxDelta: -0.25,
			fadeIn: true,
			sizeStart: 250,
			sizeEnd: 120,
			sizeSmooth: true,
			posx: 3.6,
			posy: 0,
			posz: 4,
			overlay: true,
			red: 0.1,
			green: 0.1,
			blue: 0.1,
			delayStart: 400
		},
		// asura5 — phase 2
		{
			type: '3D',
			file: 'effect/asura5.tga',
			alphaMax: 1,
			attachedEntity: true,
			duration: 400,
			fadeOut: true,
			sizeStart: 120,
			sizeEnd: 200,
			posx: 3.6,
			posy: 0,
			posz: 4,
			overlay: true,
			red: 0.1,
			green: 0.1,
			blue: 0.1,
			delayStart: 1600
		},
		// asura6 — phase 1
		{
			type: '3D',
			file: 'effect/asura6.tga',
			alphaMax: 1,
			attachedEntity: true,
			duration: 1200,
			duplicate: 3,
			timeBetweenDupli: 150,
			alphaMaxDelta: -0.25,
			fadeIn: true,
			sizeStart: 250,
			sizeEnd: 120,
			sizeSmooth: true,
			posx: 6.0,
			posy: 0,
			posz: 4,
			overlay: true,
			red: 0.1,
			green: 0.1,
			blue: 0.1,
			delayStart: 500
		},
		// asura6 — phase 2
		{
			type: '3D',
			file: 'effect/asura6.tga',
			alphaMax: 1,
			attachedEntity: true,
			duration: 400,
			fadeOut: true,
			sizeStart: 120,
			sizeEnd: 200,
			posx: 6.0,
			posy: 0,
			posz: 4,
			overlay: true,
			red: 0.1,
			green: 0.1,
			blue: 0.1,
			delayStart: 1700
		}
	],

	//330: [{}],	//EF_HITLINE	   Combo Finish

	331: [
		{
			//EF_HPTIME	   Natural HP Regeneration
			type: '3D',
			duplicate: 12,
			file: 'effect/pok1.tga',
			delay: 500,
			timeBetweenDupli: 10,
			alphaMax: 0.8,
			fadeOut: true,
			fadeIn: true,
			zIndex: 1,
			size: 30,
			sizeRand: 20,
			red: 0.9,
			green: 1,
			blue: 0.9,
			blendMode: 2,
			poszStartRand: 1.5,
			poszStartRandMiddle: 2,
			poszEndRandMiddle: 5,
			poszEndRand: 1,
			sparkling: true,
			sparkNumberRand: [3, 6],
			posxRand: 0.6,
			posyRand: 0.6,
			attachedEntity: true
		},
		{
			wav: '_heal_effect'
		}
	],

	332: [
		{
			//EF_SPTIME	   Natural SP Regeneration
			type: '3D',
			duplicate: 12,
			file: 'effect/pok1.tga',
			delay: 500,
			timeBetweenDupli: 10,
			alphaMax: 0.8,
			fadeOut: true,
			fadeIn: true,
			zIndex: 1,
			size: 30,
			sizeRand: 20,
			red: 0.9,
			green: 0.9,
			blue: 1,
			blendMode: 2,
			poszStartRand: 1.5,
			poszStartRandMiddle: 2,
			poszEndRandMiddle: 5,
			poszEndRand: 1,
			sparkling: true,
			sparkNumberRand: [3, 6],
			posxRand: 0.6,
			posyRand: 0.6,
			attachedEntity: true
		},
		{
			wav: 'effect/\xc8\xed\xb1\xe2'
		}
	],

	333: [
		{
			//EF_MAPLE	   Autumn Leaves
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				SakuraWeatherEffect.startOrRestart(Params);
			}
		}
	],

	334: [
		{
			//EF_BLIND	   Blind
			type: 'FUNC',
			attachedEntity: false,
			wav: '_blind',
			func: function (Params) {
				Blind.setActive(true);
			}
			/*file: 'effect/fullb.tga',
			file: 'effect/white02.bmp',*/
		}
	],

	335: [
		{
			//EF_POISON	   Poison
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				Poison.setActive(true);
			}
		}
	],

	336: [
		{
			//kyrie eleison / parrying	(when target blocked dmg)	//EF_GUARD	Kyrie Eleison/Parrying Shield
			wav: 'effect/kyrie_guard',
			attachedEntity: true
		},
		{
			type: 'CYLINDER',
			textureName: 'guardk',
			blendMode: 2,
			duration: 600,
			fade: true,
			totalCircleSides: 8,
			circleSides: 5,
			repeatTextureX: 5,
			angleY: 112.5,
			bottomSize: 1.5,
			topSize: 1,
			height: 0.7,
			posZ: 2.14,
			alphaMax: 0.6,
			red: 0.91,
			green: 1.0,
			blue: 0.9,
			rotateWithSource: true,
			attachedEntity: true
		},
		{
			type: 'CYLINDER',
			textureName: 'guardk',
			blendMode: 2,
			duration: 600,
			fade: true,
			totalCircleSides: 8,
			circleSides: 5,
			repeatTextureX: 5,
			angleY: 112.5,
			bottomSize: 1.5,
			topSize: 1.5,
			height: 1.14,
			posZ: 1,
			alphaMax: 0.6,
			red: 0.91,
			green: 1.0,
			blue: 0.9,
			rotateWithSource: true,
			attachedEntity: true
		},
		{
			type: 'CYLINDER',
			textureName: 'guardk',
			blendMode: 2,
			duration: 600,
			fade: true,
			totalCircleSides: 8,
			circleSides: 5,
			repeatTextureX: 5,
			angleY: 112.5,
			bottomSize: 1,
			topSize: 1.5,
			height: 0.7,
			posZ: 0.3,
			alphaMax: 0.6,
			red: 0.91,
			green: 1.0,
			blue: 0.9,
			rotateWithSource: true,
			attachedEntity: true
		}
	],

	337: [
		{
			//EF_JOBLVUP50	Class Change
			type: 'STR',
			file: 'joblvup',
			attachedEntity: true
		}
	],

	//340: [{}],	//EF_CALLZONE	   (Nothing)
	//341: [{}],	//EF_PORTAL3	   Wedding Warp Portal
	//342: [{}],	//EF_COUPLECASTING	   Wedding Skill
	//343: [{}],	//EF_HEARTCASTING	   Another Merry Skill

	344: [
		{
			//EF_ENTRY2	   Character map entry effect
			alphaMax: 0.5,
			animation: 5,
			attachedEntity: true,
			blendMode: 2,
			blue: 1,
			bottomSize: 0.3,
			duration: 1500,
			fade: true,
			green: 0.6,
			height: 35,
			red: 0.6,
			rotate: true,
			textureName: 'ring_blue',
			topSize: 0.3,
			type: 'CYLINDER',
			wav: 'effect/ef_portal'
		},
		{
			alphaMax: 0.5,
			animation: 5,
			attachedEntity: true,
			blendMode: 2,
			blue: 1,
			bottomSize: 0.6,
			duration: 1500,
			fade: true,
			green: 0.6,
			height: 25,
			red: 0.6,
			rotate: true,
			textureName: 'ring_blue',
			topSize: 0.8,
			type: 'CYLINDER'
		},
		{
			alphaMax: 0.5,
			animation: 5,
			attachedEntity: true,
			blendMode: 2,
			blue: 1,
			bottomSize: 0.8,
			duration: 1500,
			fade: true,
			green: 0.6,
			height: 13,
			red: 0.6,
			rotate: true,
			textureName: 'ring_blue',
			topSize: 1,
			type: 'CYLINDER'
		},
		{
			alphaMax: 0.5,
			animation: 5,
			attachedEntity: true,
			blendMode: 2,
			blue: 1,
			bottomSize: 1,
			duration: 1500,
			fade: true,
			green: 0.6,
			height: 5,
			red: 0.6,
			rotate: true,
			textureName: 'ring_blue',
			topSize: 1.3,
			type: 'CYLINDER'
		}
	],

	//345: [{}],	//EF_SAINTWING	   Wings (Animated)
	//346: [{}],	//EF_SPHEREWIND	   Like Moonlight But Blue

	347: [
		{
			//EF_COLORPAPER	   Wedding Ceremony
			wav: 'effect/wedding'
		}
	],

	//348: [{}],	//EF_LIGHTSPHERE	   Like 1000 Blade trepassing
	349: [{ type: 'WATERFALL', variant: 'large', vertical: false }], // EF_WATERFALL
	350: [{ type: 'WATERFALL', variant: 'large', vertical: true }], // EF_WATERFALL_90
	351: [{ type: 'WATERFALL', variant: 'small', vertical: false }], // EF_WATERFALL_SMALL
	352: [{ type: 'WATERFALL', variant: 'small', vertical: true }], // EF_WATERFALL_SMALL_90
	353: [{ type: 'WATERFALL', variant: 'dark-large', vertical: false }], // EF_WATERFALL_T2
	354: [{ type: 'WATERFALL', variant: 'dark-large', vertical: true }], // EF_WATERFALL_T2_90
	355: [{ type: 'WATERFALL', variant: 'dark-small', vertical: false }], // EF_WATERFALL_SMALL_T2
	356: [{ type: 'WATERFALL', variant: 'dark-small', vertical: true }], // EF_WATERFALL_SMALL_T2

	362: [
		{
			//EF_LEVEL99_4	   Trancendant Level 99 Aura 1
			//effect\\whitelight.tga
			//Level99_3(1)
		}
	],

	363: [
		{
			//EF_VALLENTINE	Valentine Day Heart With Wings
			type: 'SPR',
			file: 'vallentine',
			wav: 'effect/vallentine',
			attachedEntity: true
		}
	],

	371: [
		{
			//EF_ANGEL	Level Up
			type: 'STR',
			file: 'angel',
			wav: 'levelup',
			attachedEntity: true
		}
	],

	372: [
		{
			//EF_DEVIL	Death
			type: 'STR',
			file: 'devil',
			attachedEntity: true
		}
	],

	373: [
		{
			//EF_DRAGONSMOKE	House Smoke
			type: 'SPR',
			file: 'poisonhit',
			attachedEntity: true
		}
	],

	//381: [{}],	//EF_LIGHTSPHERE2	   Blue Starburst (Unknown use)

	382: [
		{
			//EF_LIGHTBLADE	(Nothing)
			type: 'SPR',
			file: '\xc7\xd1\xba\xb9\xc3\xb5\xbb\xe7',
			head: true,
			attachedEntity: true
		}
	],

	//395: [{}],	//EF_LINELINK3	   Marionette Control (Sound Effect)
	//396: [{}],	//EF_PINKBODY	   Marionette Control (Visual Effect)

	397: [
		{
			//EF_LEVEL99_5	   Trancended 99 Aura (Middle)
			//effect\\ring_blue.tga
			//Level99
		}
	],

	398: [
		{
			//EF_LEVEL99_6	   Trancended 99 Aura (Bottom)
			//effect\\pikapika2.bmp
			//Level99_2
		}
	]
};
