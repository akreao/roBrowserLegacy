/**
 * @module DB/Effects/Table/Effects0000
 *
 * Effects 0 to 99 of the effect table. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep rows in effect ID order.
 */

import Camera from 'Renderer/Camera.js';
import LockOnTarget from 'Renderer/Effects/LockOnTarget.js';
import ColdHit from 'Renderer/Effects/ColdHit.js';
import { soulStrikeEffect } from 'DB/Effects/SoulStrikeEffect.js';
import { increaseAgilityEffect, decreaseAgilityEffect } from 'DB/Effects/AgilityEffect.js';
import { detoxifyEffect } from 'DB/Effects/DetoxifyEffect.js';
import { endureEffect } from 'DB/Effects/EndureEffect.js';
import { poisonAttackEffect } from 'DB/Effects/PoisonAttackEffect.js';
import Flasher from 'Renderer/Effects/Flasher.js';
import { stealEffect } from 'DB/Effects/StealEffect.js';
import { mammoniteEffect } from 'DB/Effects/MammoniteEffect.js';
import BoltRain from 'Renderer/Effects/BoltRain.js';
import IceSpikes from 'Renderer/Effects/IceSpikes.js';
import {
	planPath as planIcePath,
	planShards as planIceShards,
	PATH as ICE_PATH,
	SHARDS as ICE_SHARDS
} from 'Renderer/Effects/IceSpikesSim.js';
import { PRIM_TICK_MS } from 'Renderer/Effects/EffectPrimSim.js';
import { sightEffect } from 'DB/Effects/SightEffect.js';

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

	9: [
		{
			//EF_ENHANCE	Different Type of Heal
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
			type: 'CYLINDER'
		},
		{
			alphaMax: 0.8,
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
			alphaMax: 0.8,
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
		}
	],

	10: [
		// EF_COIN, Mammonite: Maemor.str and the client's 5 bouncing coins with their coin sounds (MammoniteEffect.js)
		...mammoniteEffect
	],

	11: [
		// EF_ENDURE, Endure: the client's shrinking endure.tga and alpha_down streaks (EndureEffect.js)
		...endureEffect
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
			rotate: true,
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

	15: soulStrikeEffect,

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

	17: [
		{
			//EF_MAGNUMBREAK	Magnum Break
			// Official client parts: two flat yellow rings and a fire sphere, 30 ticks at 60 a second.
			type: 'PRIM',
			prim: 'ring',
			texture: 'ring_yellow',
			attachedEntity: false,
			duration: 500,
			frames: 30,
			radiusSpeed: 1.75,
			radiusAccel: -(1.75 / 30) * 0.5,
			width: 12,
			alpha: 0,
			alphaSpeed: 254 / 15,
			fadeOutFrame: 15,
			wav: 'effect/ef_magnumbreak'
		},
		{
			type: 'PRIM',
			prim: 'sphere',
			texture: '\xb4\xeb\xc6\xf8\xb9\xdf', //´ëÆø¹ß
			attachedEntity: false,
			duration: 500,
			frames: 30,
			radiusSpeed: 1.15,
			radiusAccel: -(1.15 / 30) * 0.5,
			spin: 3,
			alpha: 0,
			alphaSpeed: 254 / 15,
			fadeOutFrame: 15
		},
		{
			type: 'PRIM',
			prim: 'ring',
			texture: 'ring_yellow',
			attachedEntity: false,
			duration: 500,
			frames: 30,
			radiusSpeed: 1.75,
			radiusAccel: -(1.75 / 30) * 0.5,
			width: 12,
			alpha: 0,
			alphaSpeed: 254 / 15,
			fadeOutFrame: 15
		}
	],

	18: [
		// EF_STEAL, Steal: the client's 10 particle7 sparks and EF_Steal.wav (StealEffect.js)
		...stealEffect
	],

	// 19: [{}],	//EF_HIDING	Invalid Effect ID Popup in client

	20: [
		// EF_PATTACK: the client's poison particles, 100 ticks (PoisonAttackEffect.js)
		...poisonAttackEffect(20)
	],

	21: [
		// EF_DETOXICATION, Detoxify: the client's 20 rising particle2 bubbles (DetoxifyEffect.js)
		...detoxifyEffect
	],

	// EF_SIGHT, Sight: the official client's orbiting sight sprite and shadow (SightEffect.js)
	22: sightEffect,

	23: [
		{
			//EF_STONECURSE	Stone Curse
			type: 'STR',
			file: 'stonecurse',
			attachedEntity: true
		}
	],

	stonecurse_sound: [
		{
			// The sound the official client plays with Stone Curse's effect 23 (not part of 23 itself)
			wav: '_stonecurse',
			attachedEntity: true
		}
	],

	24: [
		{
			//EF_FIREBALL	Fire Ball, played on the caster: the official client throws four fireball sprites at the
			//target on ticks 20, 24, 28 and 32, each flying 20 ticks from 15 units up, each with its own sound.
			//The first is plain, the next three tinted (246, 199, 76) and fainter (alpha 180, 130, 80).
			type: '3D',
			spriteName: 'fireball',
			playSprite: true,
			attachedEntity: false,
			fromSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			zOffset: 3,
			delayStart: 333,
			duration: 333,
			alphaMax: 1,
			size: 130,
			zIndex: 1
		},
		{
			type: '3D',
			spriteName: 'fireball',
			playSprite: true,
			attachedEntity: false,
			fromSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			zOffset: 3,
			delayStart: 400,
			duration: 333,
			alphaMax: 180 / 255,
			red: 246 / 255,
			green: 199 / 255,
			blue: 76 / 255,
			size: 130,
			zIndex: 1
		},
		{
			type: '3D',
			spriteName: 'fireball',
			playSprite: true,
			attachedEntity: false,
			fromSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			zOffset: 3,
			delayStart: 467,
			duration: 333,
			alphaMax: 130 / 255,
			red: 246 / 255,
			green: 199 / 255,
			blue: 76 / 255,
			size: 130,
			zIndex: 1
		},
		{
			type: '3D',
			spriteName: 'fireball',
			playSprite: true,
			attachedEntity: false,
			fromSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			zOffset: 3,
			delayStart: 533,
			duration: 333,
			alphaMax: 80 / 255,
			red: 246 / 255,
			green: 199 / 255,
			blue: 76 / 255,
			size: 130,
			zIndex: 1
		},
		{
			wav: 'effect/ef_fireball',
			delayWav: 333
		},
		{
			wav: 'effect/ef_fireball',
			delayWav: 400
		},
		{
			wav: 'effect/ef_fireball',
			delayWav: 467
		},
		{
			wav: 'effect/ef_fireball',
			delayWav: 533
		}
	],

	25: [
		{
			//EF_FIREWALL	Fire Wall
			type: 'STR',
			file: 'firewall%d',
			rand: [1, 2],
			attachedEntity: false
		},
		{
			wav: 'effect/ef_firewall'
		}
	],

	26: [
		{
			//EF_ICEARROW	Cold Bolt, on the target: one ice bolt per hit, 10 ticks apart from tick 12,
			//each opening a ring_blue ring as it lands (BoltRainSim.js, effect-port/bolts.md)
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				this.add(
					new BoltRain(Params.Init.ownerEntity.position, Params.Inst.startTick, Params.Init.hitCount, 'cold'),
					Params
				);
			}
		},
		{
			// One sound per cast, on tick 12
			wav: 'effect/ef_icearrow%d',
			rand: [1, 3],
			delayWav: 200,
			attachedEntity: true
		}
	],

	27: [
		{
			//EF_FROSTDIVER	Frost Diver, on the caster: one thin ice spike a tick along the line to the
			//target, pushing out of the ground (IceSpikesSim.js, effect-port/frost-diver.md)
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const caster = Params.Init.ownerEntity;
				const target = Params.Init.otherEntity;
				if (!target) {
					return;
				}
				const at = [caster.position[0], caster.position[1], caster.position[2]];
				const spikes = planIcePath(
					(target.position[0] - at[0]) * 5,
					(target.position[1] - at[1]) * 5
				);
				this.add(new IceSpikes(at, Params.Inst.startTick, spikes, ICE_PATH.life), Params);
			}
		}
	],

	28: [
		{
			//EF_FROSTDIVER2	Frost Diver hit, on the target: 8 wide ice spikes bursting from the feet
			//(IceSpikesSim.js, effect-port/frost-diver.md)
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				this.add(
					new IceSpikes(Params.Init.ownerEntity.position, Params.Inst.startTick, planIceShards(), ICE_SHARDS.life),
					Params
				);
			}
		},
		{
			wav: 'effect/ef_frostdiver2',
			attachedEntity: true
		}
	],

	29: [
		{
			//EF_LIGHTBOLT	Lightning Bolt (the official client plays Lightning.str only; the wind hit is 52)
			attachedEntity: true,
			duplicate: 1,
			file: 'lightning',
			type: 'STR'
		}
	],

	30: [
		{
			//EF_THUNDERSTORM	Thunder Storm
			type: 'STR',
			file: 'thunderstorm',
			wav: 'effect/magician_thunderstorm',
			attachedEntity: false
		}
	],

	31: [
		{
			//EF_FIREARROW	Fire Bolt, on the target: one fire bolt per hit, 10 ticks apart from tick 12,
			//each opening a ring_yellow ring as it lands, and a spark every 4 ticks from the newest
			//bolt (BoltRainSim.js, effect-port/bolts.md)
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const target = Params.Init.ownerEntity;
				const spark = (s, startTick) => {
					// A particle4 sprite flying from the bolt back up its line, shrinking away
					const at = [target.position[0], target.position[1], target.position[2]];
					this.spamEffect({
						effect: {
							type: '3D',
							spriteName: 'particle4',
							playSprite: true,
							attachedEntity: false,
							duration: (s.life * 1000) / 60,
							posxStart: s.start.x / 5,
							posyStart: s.start.y / 5,
							poszStart: s.start.up / 5,
							posxEnd: s.end.x / 5,
							posyEnd: s.end.y / 5,
							poszEnd: s.end.up / 5,
							sizeStart: s.scale * 100,
							sizeEnd: 1,
							alphaMax: 1,
							fadeOut: true,
							zIndex: 1
						},
						Inst: { effectID: 31, duplicateID: 0, startTick },
						Init: Object.assign({}, Params.Init, { position: at })
					});
				};
				this.add(
					new BoltRain(target.position, Params.Inst.startTick, Params.Init.hitCount, 'fire', Math.random, spark),
					Params
				);
			}
		},
		{
			// One sound per cast, on tick 12
			wav: 'effect/ef_firearrow%d',
			rand: [1, 3],
			delayWav: 200,
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

	//36: [{}],	//EF_PORTAL	//warp portal unit

	// EF_INCAGILITY / EF_DECAGILITY, Increase / Decrease AGI: the official client's picture and streaks (AgilityEffect.js)
	37: increaseAgilityEffect,

	38: decreaseAgilityEffect,

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
			// Official client: the cross STR from the start; on tick 30 (500 ms) EF_Signum.wav, EF_Bash.wav
			// and a bash burst (effect 16's look). See effect-port/acolyte-skills.md.
			type: 'STR',
			file: 'cross',
			attachedEntity: true
		},
		{
			wav: 'effect/ef_signum',
			delayWav: 500
		},
		{
			type: 'CYLINDER',
			delayStart: 500,
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
			delayWav: 500,
			attachedEntity: true
		},
		{
			type: 'CYLINDER',
			delayStart: 500,
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
			delayStart: 500,
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
			// Official client (kRO 2025-07-16, 0xba43f0): a flat prim-12 disc of alpha_down.tga, radius 10
			// (band as wide as the radius), tinted (32, 176, 232), alpha 0 rising 100 / 30 a tick to 100,
			// fading out over the last 30 of the effect's 150 ticks. Sound on tick 0.
			type: 'PRIM',
			prim: 'ring',
			texture: 'alpha_down',
			attachedEntity: true,
			duration: 2500,
			frames: 150,
			radius: 10,
			width: 10,
			color: [32, 176, 232],
			alpha: 0,
			alphaSpeed: 100 / 30,
			alphaMax: 100,
			fadeOutFrame: 120,
			wav: 'effect/ef_blessing'
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
			//EF_COLDHIT	Ice Elemental Hit: 9 ice shards flying out and two smoke puffs (ColdHit.js, kRO 2025 0xba6a80)
			type: 'FUNC',
			attachedEntity: true,
			// 32 ticks (ColdHitSim LAST_TICK + 1): also lets the manager drop it while it is culled
			duration: Math.ceil(32 * PRIM_TICK_MS),
			func: function (Params) {
				this.add(new ColdHit(Params.Inst.position, Params.Inst.startTick), Params);
			}
		},
		{
			// water hit
			wav: '_hit_fist%d',
			rand: [3, 4],
			attachedEntity: true
		}
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
			//EF_BEGINSPELL4	Cast Initiation Aura (green: the official client plays it for earth casts)
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
			//EF_BEGINSPELL5	Cast Initiation Aura (yellow: the official client plays it for wind casts)
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

	// 58 launched outside a cast (Plant Cultivation's ground packet, on the caster): the official client
	// gives it its table lifetime, 40 ticks. See effect-port/creator-skills.md.
	'58_cultivation': [
		{
			alphaMax: 0.8,
			animation: 2,
			attachedEntity: true,
			blendMode: 2,
			blue: 1,
			bottomSize: 1,
			duration: 40 * (1000 / 60),
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

	67: [
		{
			//EF_PROVOKE	Provoke
			// The official client plays the sound twice: on tick 5 (83 ms) and tick 30 (500 ms)
			type: 'STR',
			file: 'provoke',
			wav: 'effect/swordman_provoke',
			delayWav: 83,
			attachedEntity: true
		},
		{
			wav: 'effect/swordman_provoke',
			delayWav: 500
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

	69: [
		{
			//EF_SKIDTRAP	Skid Trap
			type: 'STR',
			file: 'skidtrap',
			wav: 'effect/hunter_skidtrap', // or hallucinationwalk ?
			attachedEntity: false
		}
	],

	70: [
		{
			//EF_BRANDISHSPEAR	Brandish Spear, on each target as its damage packet arrives (no sound)
			attachedEntity: false,
			file: 'brandish',
			type: 'STR'
		}
	],

	73: [
		{
			//Bowling Bash hit (official client): two upright ring_blue cone bands (primitive 13) on
			//ticks 0 and 5, the second turned 100 degrees further and fainter, and a faint flat
			//ring_yellow ring (primitive 12) slowing until tick 20, then growing slowly. No sound.
			type: 'PRIM',
			prim: 'cone',
			texture: 'ring_blue',
			attachedEntity: true,
			duration: 20 * (1000 / 60),
			frames: 20,
			facing: true,
			baseRadius: 3,
			baseSpeed: 0.5,
			baseAccel: -0.03,
			topRadius: 8,
			topSpeed: 0.5,
			topAccel: -0.03,
			coneHeight: 3.5,
			alpha: 240,
			fadeOutFrame: 10
		},
		{
			type: 'PRIM',
			prim: 'cone',
			texture: 'ring_blue',
			attachedEntity: true,
			delayStart: 5 * (1000 / 60),
			duration: 15 * (1000 / 60),
			frames: 15,
			facing: true,
			yaw: 100,
			baseRadius: 3,
			baseSpeed: 0.5,
			baseAccel: -0.03,
			topRadius: 8,
			topSpeed: 0.5,
			topAccel: -0.03,
			coneHeight: 3.5,
			alpha: 205,
			fadeOutFrame: 8
		},
		{
			type: 'PRIM',
			prim: 'ring',
			texture: 'ring_yellow',
			attachedEntity: false,
			duration: 50 * (1000 / 60),
			frames: 50,
			radius: 8,
			radiusSpeed: 0.7,
			radiusAccel: -0.7 / 30,
			radiusChangeFrame: 20,
			radiusChangeSpeed: 0.08,
			radiusChangeAccel: 0,
			width: 5,
			alpha: 45,
			fadeOutFrame: 35
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

	75: [
		{
			//EF_GLORIA	Gloria
			type: 'STR',
			file: 'gloria',
			wav: 'effect/priest_gloria',
			min: 'gloria_min',
			attachedEntity: true
		}
	],

	76: [
		{
			//EF_MAGNIFICAT	Magnificat
			type: 'STR',
			file: 'magnificat',
			wav: 'effect/priest_magnificat',
			min: 'magnificat_min',
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

	78: [
		{
			//EF_RECOVERY	Status Recovery
			type: 'STR',
			file: 'recovery',
			wav: 'effect/priest_recovery',
			attachedEntity: true
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

	80: [
		{
			//EF_SPEARBMR	Spear Boomerang, played on the caster as each damage packet arrives: the
			//official client throws four spear sprites (이팩트\창) at the target on ticks 0, 4, 8 and 12,
			//each flying 15 ticks from 15 units up, each with EF_FireBall.wav; alpha 254, 180, 130, 80.
			type: '3D',
			spriteName: '\xc3\xa2',
			playSprite: true,
			attachedEntity: false,
			fromSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			zOffset: 3,
			delayStart: 0,
			duration: 15 * (1000 / 60),
			alphaMax: 1,
			size: 100,
			zIndex: 1
		},
		{
			type: '3D',
			spriteName: '\xc3\xa2',
			playSprite: true,
			attachedEntity: false,
			fromSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			zOffset: 3,
			delayStart: 4 * (1000 / 60),
			duration: 15 * (1000 / 60),
			alphaMax: 180 / 255,
			size: 100,
			zIndex: 1
		},
		{
			type: '3D',
			spriteName: '\xc3\xa2',
			playSprite: true,
			attachedEntity: false,
			fromSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			zOffset: 3,
			delayStart: 8 * (1000 / 60),
			duration: 15 * (1000 / 60),
			alphaMax: 130 / 255,
			size: 100,
			zIndex: 1
		},
		{
			type: '3D',
			spriteName: '\xc3\xa2',
			playSprite: true,
			attachedEntity: false,
			fromSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			zOffset: 3,
			delayStart: 12 * (1000 / 60),
			duration: 15 * (1000 / 60),
			alphaMax: 80 / 255,
			size: 100,
			zIndex: 1
		},
		{
			wav: 'effect/ef_fireball',
			delayWav: 0
		},
		{
			wav: 'effect/ef_fireball',
			delayWav: 4 * (1000 / 60)
		},
		{
			wav: 'effect/ef_fireball',
			delayWav: 8 * (1000 / 60)
		},
		{
			wav: 'effect/ef_fireball',
			delayWav: 12 * (1000 / 60)
		}
	],

	81: [
		{
			//EF_PIERCE	Pierce / Spear Stab hit: one ring_yellow cone band (official primitive 13)
			//opening the way the target faces, 10 units up, drifting forward, 15 ticks. No sound.
			type: 'PRIM',
			prim: 'cone',
			texture: 'ring_yellow',
			attachedEntity: true,
			duration: 15 * (1000 / 60),
			frames: 15,
			facing: true,
			pitch: -90,
			height: 10,
			baseRadius: 6,
			topRadius: 11,
			coneHeight: 2.5,
			drift: 0.7,
			driftAccel: -(0.7 / 15) * 0.5,
			fadeOutFrame: 8
		}
	],

	82: [
		{
			//turn undead caster	//EF_TURNUNDEAD	Turn Undead
			// The official client plays EF_Bash.wav on tick 37 (617 ms). Its rings and rays are not drawn
			// yet (effect-port/priest-audit.md).
			wav: 'effect/ef_bash',
			delayWav: 617,
			attachedEntity: true
		}
	],

	83: [
		{
			//EF_SANCTUARY	Sanctuary
			type: 'STR',
			file: 'sanctuary',
			wav: 'effect/priest_sanctuary',
			attachedEntity: true
		}
	],

	84: [
		{
			//EF_IMPOSITIO	Impositio Manus
			// The official client plays the sound on tick 60 (1000 ms)
			type: 'STR',
			file: 'impositio',
			wav: 'effect/priest_impositio',
			delayWav: 1000,
			attachedEntity: true
		}
	],

	85: [
		{
			//EF_LEXAETERNA	Lex Aeterna
			// The official client plays the sound on tick 15 (250 ms)
			type: 'STR',
			file: 'lexaeterna',
			wav: 'effect/priest_lexaeterna',
			delayWav: 250,
			min: 'lexaeterna_min',
			attachedEntity: true
		}
	],

	86: [
		{
			//EF_ASPERSIO	Aspersio
			// The official client plays the sound on tick 70 (1167 ms)
			type: 'STR',
			file: 'aspersio',
			wav: 'effect/priest_aspersio',
			delayWav: 1167,
			attachedEntity: true
		}
	],

	87: [
		{
			//EF_LEXDIVINA	Lex Divina
			// The official client plays the sound five times: ticks 0, 20, 35, 60 and 70
			type: 'STR',
			file: 'lexdivina',
			wav: 'effect/priest_lexdivina',
			attachedEntity: true
		},
		{
			wav: 'effect/priest_lexdivina',
			delayWav: 333
		},
		{
			wav: 'effect/priest_lexdivina',
			delayWav: 583
		},
		{
			wav: 'effect/priest_lexdivina',
			delayWav: 1000
		},
		{
			wav: 'effect/priest_lexdivina',
			delayWav: 1167
		}
	],

	88: [
		{
			//EF_SUFFRAGIUM	Suffragium
			type: 'STR',
			file: 'suffragium',
			wav: 'effect/priest_suffragium',
			min: 'suffragium_min',
			attachedEntity: true
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
			// Official client: Lord.str with eleven sounds over its first 200 ticks and a camera
			// quake every 50 ticks from tick 50 to 250
			type: 'STR',
			file: 'lord',
			attachedEntity: true
		},
		{
			wav: 'effect/wizard_meteo',
			delayWav: 0,
			attachedEntity: true
		},
		{
			wav: 'effect/hunter_blastmine',
			delayWav: 0,
			attachedEntity: true
		},
		{
			wav: 'effect/hunter_blastmine',
			delayWav: 10 * (1000 / 60),
			attachedEntity: true
		},
		{
			wav: 'effect/wizard_meteo',
			delayWav: 20 * (1000 / 60),
			attachedEntity: true
		},
		{
			wav: 'effect/wizard_meteo',
			delayWav: 50 * (1000 / 60),
			attachedEntity: true
		},
		{
			wav: 'effect/wizard_meteo',
			delayWav: 80 * (1000 / 60),
			attachedEntity: true
		},
		{
			wav: 'effect/wizard_meteo',
			delayWav: 100 * (1000 / 60),
			attachedEntity: true
		},
		{
			wav: 'effect/wizard_meteo',
			delayWav: 130 * (1000 / 60),
			attachedEntity: true
		},
		{
			wav: 'effect/wizard_meteo',
			delayWav: 140 * (1000 / 60),
			attachedEntity: true
		},
		{
			wav: 'effect/wizard_meteo',
			delayWav: 180 * (1000 / 60),
			attachedEntity: true
		},
		{
			wav: 'effect/wizard_meteo',
			delayWav: 200 * (1000 / 60),
			attachedEntity: true
		},
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				for (let tick = 50; tick <= 250; tick += 50) {
					Camera.setQuake(Params.Inst.startTick + tick * (1000 / 60));
				}
			}
		}
	],

	91: [
		{
			//EF_BENEDICTIO	B. S. Sacramenti
			type: 'STR',
			file: 'benedictio',
			wav: 'effect/priest_benedictio',
			attachedEntity: true
		}
	],

	92: [
		{
			//EF_METEORSTORM	Meteor Storm
			// Official client: one of Meteor1-3.str at random (meteor4.str is unused), quake on tick 40
			type: 'STR',
			file: 'meteor%d',
			wav: 'effect/wizard_meteor',
			rand: [1, 3],
			attachedEntity: true
		},
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const start = Params.Inst.startTick + 2000 / 3;
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
			duration: 333, // 20 ticks of the official 60 Hz effect clock
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
			duration: 333, // 20 ticks of the official 60 Hz effect clock
			size: 45, // widthSize 4.5f
			toSrc: true, // PT3DTEX_CHKTARGETPOS
			overlay: true,
			blendMode: 2 // RF_EMISSIVE (Aprox. Additive)
		}
	],

	94: [
		{
			//EF_YUFITELHIT	Jupitel Thunder (Hit)
			// Official client: the hit lives 250 ticks; a flash starts every 20 ticks (13 in all)
			type: '3D',
			file: 'effect/thunder_pang.bmp',
			duplicate: 13,
			timeBetweenDupli: 1000 / 3, // 20 ticks
			duration: 167, // 10 ticks of the official 60 Hz effect clock
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
			frameDelay: 1000 / 60, // one frame a tick
			delayStart: 1000 / 6, // from tick 10...
			duration: 4000, // ...to the hit's end on tick 250
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
			// Official client: each launch (one per unit cell) plays the sound 1 time in 12
			wav: 'effect/wizard_quagmire',
			wavChance: 1 / 12
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
			// Official client: played once by the active Fire Pillar unit (0x88), not repeated
			type: 'STR',
			file: 'firepillarbomb',
			wav: 'effect/wizard_fire_pillar_b',
			attachedEntity: false,
			repeat: false
		}
	],

	98: [
		{
			//EF_HASTEUP	Adrenaline Rush
			// The official client plays black_adrenalinerush_a.wav on tick 0 and _b on tick 30 (500 ms).
			// Its particles (20 alpha_center sparks, 4 particle1.spr sprites) are not drawn yet.
			wav: 'effect/black_adrenalinerush_a',
			attachedEntity: true
		},
		{
			wav: 'effect/black_adrenalinerush_b',
			delayWav: 500,
			attachedEntity: true
		}
	],

	99: [
		{
			//EF_FLASHER	Flasher Trap: a camera-facing flash and 20 turning rays (Flasher.js, kRO 2025 0xbad270)
			type: 'FUNC',
			attachedEntity: false,
			// 70 ticks: also lets the manager drop it while it is culled and not drawn
			duration: Math.ceil(70 * PRIM_TICK_MS),
			func: function (Params) {
				this.add(new Flasher(Params.Inst.position, Params.Inst.startTick), Params);
			}
		},
		{
			wav: 'effect/hunter_flasher',
			attachedEntity: false
		}
	]
};
