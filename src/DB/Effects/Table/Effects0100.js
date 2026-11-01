/**
 * @module DB/Effects/Table/Effects0100
 *
 * Effects 100 to 199 of the effect table. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep rows in effect ID order.
 */

import RainWeatherEffect from 'Renderer/Effects/RainWeather.js';
import SnowWeatherEffect from 'Renderer/Effects/SnowWeather.js';
import SakuraWeatherEffect from 'Renderer/Effects/SakuraWeatherEffect.js';
import Camera from 'Renderer/Camera.js';
import { removeTrapEffect } from 'DB/Effects/RemoveTrapEffect.js';
import QuadHorn from 'Renderer/Effects/QuadHorn.js';
import { hitDarkEffect } from 'DB/Effects/HitDarkEffect.js';
import { poisonAttackEffect } from 'DB/Effects/PoisonAttackEffect.js';
import { sonicBlowHitEffect } from 'DB/Effects/SonicBlowEffect.js';
import { blitzBeatEffect } from 'DB/Effects/BlitzBeatEffect.js';
import Altitude from 'Renderer/Map/Altitude.js';

export default {
	100: removeTrapEffect, //EF_REMOVETRAP	Remove Trap fountain (DB/Effects/RemoveTrapEffect.js)

	101: [
		{
			//EF_REPAIRWEAPON	Weapon Repair
			type: 'STR',
			file: 'repairweapon',
			attachedEntity: true
		},
		{
			// The official client plays the sound on ticks 20 (333 ms) and 55 (917 ms)
			wav: 'effect/black_weapon_repair_a',
			delayWav: 333
		},
		{
			wav: 'effect/black_weapon_repair_a',
			delayWav: 917
		}
	],

	102: [
		{
			//EF_CRASHEARTH	Hammerfall
			// The official client plays wizard_fire_pillar_b.wav on tick 30 (500 ms) and quakes the
			// screen on tick 35 (583 ms). It never loads black_hammerfall.wav.
			type: 'STR',
			file: 'crashearth',
			attachedEntity: false
		},
		{
			wav: 'effect/wizard_fire_pillar_b',
			delayWav: 500,
			attachedEntity: false
		},
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const start = Params.Inst.startTick + 35 * (1000 / 60);
				Camera.setQuake(start);
			}
		}
	],

	103: [
		{
			//EF_PERFECTION	Weapon Perfection
			type: 'STR',
			file: 'weaponperfection',
			wav: 'effect/black_weapon_perfection',
			min: 'weaponperfection_min',
			attachedEntity: true
		}
	],

	104: [
		{
			//EF_MAXPOWER	Maximize Power
			// The official client plays the circle sound on tick 0, the sword sound on ticks 40 and 47
			// (667 and 783 ms) and sword_bic on tick 65 (1083 ms).
			type: 'STR',
			file: 'maximizepower',
			min: 'maximize_min',
			wav: 'effect/black_maximize_power_circle',
			attachedEntity: true
		},
		{
			wav: 'effect/black_maximize_power_sword',
			delayWav: 667,
			attachedEntity: true
		},
		{
			wav: 'effect/black_maximize_power_sword',
			delayWav: 783,
			attachedEntity: true
		},
		{
			wav: 'effect/black_maximize_power_sword_bic',
			delayWav: 1083,
			attachedEntity: true
		}
	],

	105: [
		{
			//EF_BLASTMINE	empty
			wav: 'effect/hun_anklesnare'
		}
	],

	106: [
		{
			//EF_BLASTMINEBOMB	Blast Mine Trap
			type: 'STR',
			file: 'blastmine',
			wav: 'effect/hunter_blastmine', //hun_blastmine
			delayWav: 333, // official: the sound on tick 20
			attachedEntity: false
		}
	],

	107: [
		{
			//EF_CLAYMORE	Claymore Trap
			type: 'STR',
			file: 'claymore',
			wav: 'effect/hunter_claymoretrap',
			attachedEntity: false
		}
	],

	108: [
		{
			//EF_FREEZING	Freezing Trap
			type: 'STR',
			file: 'freezing',
			wav: 'effect/hunter_freezingtrap',
			attachedEntity: false
		}
	],

	109: [
		{
			//EF_BUBBLE	Bailaban Blue bubble Map Effect
			type: 'STR',
			file: 'bubble%d',
			rand: [1, 4],
			attachedEntity: false
		}
	],

	110: [
		{
			//EF_GASPUSH	Trap Used by Giearth
			type: 'STR',
			file: 'gaspush',
			//wav:  'se_gas_pushhh', // the anthell map already has the sounds placed, no need to add it to the effect as well
			attachedEntity: false
		}
	],

	111: [
		{
			//EF_SPRINGTRAP	Spring Trap
			type: 'STR',
			file: 'spring',
			wav: 'effect/hunter_springtrap',
			attachedEntity: false
		}
	],

	112: [
		{
			//EF_KYRIE	Kyrie Eleison
			// The official client plays priest_kyrie_eleison_b on tick 0 and _a on tick 15 (250 ms)
			type: 'STR',
			file: 'kyrie',
			wav: 'effect/priest_kyrie_eleison_b',
			min: 'kyrie_min',
			attachedEntity: true
		},
		{
			wav: 'effect/priest_kyrie_eleison_a',
			delayWav: 250
		}
	],

	113: [
		{
			//EF_MAGNUS	Magnus Exorcismus
			type: 'STR',
			file: 'magnus',
			wav: 'effect/priest_magnus',
			attachedEntity: false
		}
	],

	115: blitzBeatEffect, //EF_BLITZBEAT	Blitz Beat (DB/Effects/BlitzBeatEffect.js)

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
			// Official client: one Waterball.spr ball and one sound per launch (one per damage packet)
			type: '3D',
			duration: 500,
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

	119: [
		{
			//EF_DETECTING	Detect
			// Official client, at the cell: a level square of white fashasha.tga
			// streaks one cell up, spreading fast for 17 ticks and then slowly,
			// fading out from tick 40 to its end on tick 57 (Kunai - Nightmare's
			// flash, 812, with other timings and no tint).
			type: 'PRIM',
			prim: 'quad',
			texture: 'fashasha',
			wav: 'effect/hunter_detecting',
			attachedEntity: false,
			duration: (57 * 1000) / 60,
			frames: 57,
			height: 5,
			sizeSpeed: 1.5,
			sizeAccel: 1.5 / 14,
			sizeChangeFrame: 17,
			sizeChangeSpeed: 0.1,
			sizeChangeAccel: 0.1 / 30,
			alpha: 254,
			fadeOutFrame: 40
		}
	],

	120: [
		{
			//EF_CLOAKING	   Cloaking
			wav: 'effect/assasin_cloaking'
		}
	],

	121: [
		{
			//EF_SONICBLOW	// sonic blow caste
			type: '3D',
			blendMode: 2,
			duration: 400,
			alphaMax: 1.0,
			fadeOut: true,
			sizeStart: 100,
			sizeEnd: 300,
			file: 'effect/ring2.bmp', // Original: 'effect/alpha_center.tga',
			wav: 'effect/ef_stonecurse',
			zIndex: 10,
			attachedEntity: true
		}
	],

	122: [
		// EF_SONICBLOWHIT: assasin_sonicblow.wav and a magic_red cone band (SonicBlowEffect.js)
		...sonicBlowHitEffect
	],

	123: [
		{
			//grimtooth caster	//EF_GRIMTOOTH	Grimtooth Cast
			wav: 'effect/ef_frostdiver',
			attachedEntity: true
		},
		{
			//EF_GRIMTOOTH	stone spikes walking from the caster (the owner) toward the target: 2 units a
			//tick, a spike every 3 ticks, stopping within 2.5 units (half a cell) of the target
			type: 'TRAIL',
			attachedEntity: false,
			duration: 2500,
			speed: 24,
			interval: 50,
			sourceIsOwner: true,
			stopAtTarget: true,
			overshoot: -0.5,
			spawn: [
				{
					type: 'QuadHorn',
					textureFile: 'effect/stone.bmp',
					attachedEntity: false,
					duration: 670,
					height: [0.6, 1.0],
					offsetX: 0,
					offsetY: 0,
					offsetZ: 0,
					bottomSize: [0.05, 0.1],
					blendMode: 8,
					rotateX: [-15, 15],
					rotateY: [0, 360],
					color: [1.0, 1.0, 1.0, 1.0],
					animation: 4,
					animationSpeed: 330,
					riseDistance: 0.8,
					fadeOut: 170
				}
			]
		}
	],

	124: [
		{
			//EF_VENOMDUST	Venom Dust
			type: 'STR',
			file: 'venomdust',
			wav: 'effect/assasin_poisonreact', //effect/assasin_venomdust'
			attachedEntity: false
		}
	],

	125: [
		// Enchant Poison / Venom Splasher on the target: effect 20's particles for 250 ticks (PoisonAttackEffect.js)
		...poisonAttackEffect(125)
	],

	126: [
		{
			//EF_POISONREACT	Poison React: the STR only, no sound (the official client plays none)
			type: 'STR',
			file: 'poisonreact_1st',
			attachedEntity: true
		}
	],

	127: [
		{
			//EF_POISONREACT2	Small Posion React
			type: 'STR',
			file: 'poisonreact',
			wav: 'effect/assasin_poisonreact',
			attachedEntity: true
		}
	],

	128: [
		{
			//EF_OVERTHRUST	Over Thrust
			// The official client plays both sounds on tick 0. Its alpha_center burst (primitive 4,
			// the EF_BASH burst) is not drawn yet.
			wav: 'effect/black_overthrust',
			attachedEntity: true
		},
		{
			wav: 'effect/ef_stonecurse',
			attachedEntity: true
		}
	],

	129: [
		{
			//EF_SPLASHER	Venom Splasher burst, on each target the splash reaches; the sound on tick 10
			type: 'STR',
			file: 'venomsplasher',
			wav: 'effect/assasin_venomsplasher',
			delayWav: 10 * (1000 / 60),
			attachedEntity: true
		}
	],

	130: [
		{
			// The official client removes a running 130 before it starts a new one (knight-audit.md)
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				this.remove(null, Params.Init.ownerAID, 130);
			}
		},
		{
			//EF_TWOHANDQUICKEN	Two-Hand Quicken
			type: 'STR',
			file: 'twohand',
			wav: 'effect/knight_twohandquicken',
			head: true,
			attachedEntity: true
		}
	],

	131: [
		{
			//autocounter activate hit	//EF_AUTOCOUNTER	Auto-Counter Hit
			type: 'STR',
			file: 'autocounter',
			wav: 'effect/knight_autocounter',
			attachedEntity: true
		}
	],

	132: [
		//EF_GRIMTOOTHATK	   Grimtooth Hit
		{
			type: 'QuadHorn',
			textureFile: 'effect/stone.bmp',
			attachedEntity: false,
			duration: 15000,
			height: 2.5,
			offsetX: 0.5,
			offsetY: 0.4,
			offsetZ: -0.2,
			bottomSize: 0.15,
			blendMode: 1,
			rotateX: -15,
			rotateY: 0,
			rotateZ: 0,
			color: [1.0, 1.0, 1.0, 1.0],
			animation: 3,
			animationSpeed: 120,
			animationOut: true
		},
		{
			type: 'QuadHorn',
			textureFile: 'effect/stone.bmp',
			attachedEntity: false,
			duration: 15000,
			height: 2.5,
			offsetY: 0.5,
			bottomSize: 0.15,
			blendMode: 1,
			rotateX: 5,
			rotateY: 45,
			rotateZ: -15,
			color: [1.0, 1.0, 1.0, 1.0],
			animation: 3,
			animationSpeed: 120,
			animationOut: true
		},
		{
			type: 'QuadHorn',
			textureFile: 'effect/stone.bmp',
			attachedEntity: false,
			duration: 15000,
			height: 2.5,
			offsetX: 0.5,
			offsetY: 0.5,
			offsetZ: 0,
			bottomSize: 0.15,
			blendMode: 1,
			rotateX: 5,
			rotateY: 45,
			rotateZ: 15,
			color: [1.0, 1.0, 1.0, 1.0],
			animation: 3,
			animationSpeed: 120,
			animationOut: true
		}
	],

	133: [
		{
			//EF_FREEZE	Ice Effect (Used by NPCs)
			type: 'STR',
			file: 'freeze',
			attachedEntity: true
		}
	],

	134: [
		{
			//EF_FREEZED	Ice Effect (Used by NPCs)
			type: 'STR',
			file: 'freezed',
			attachedEntity: true
		}
	],

	135: [
		{
			//EF_ICECRASH	Ice Effect (Used by NPCs)
			type: 'STR',
			file: 'icecrash',
			attachedEntity: true
		}
	],

	136: [
		{
			//EF_SLOWPOISON	Slow Poison
			// No sound in the official client (it plays priest_slowpoison only for Tarot Card of Fate)
			type: 'STR',
			file: 'slowp',
			attachedEntity: false
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

	139: [
		{
			//EF_SANDMAN	Sandman Trap
			// No sound: the official client never plays hunter_sandman.wav
			type: 'STR',
			file: 'sandman',
			attachedEntity: false
		}
	],

	//EF_REVIVE	Ressurection Aura
	// Silent in the official client (77 plays the resurrection sound). Its look, ring_yellow cones
	// (official primitive 13) every 25 ticks, is not drawn yet: effect-port/priest-audit.md.
	140: [],

	141: [
		{
			//EF_PNEUMA	Pneuma
			type: 'STR',
			file: 'pneuma%d',
			rand: [1, 3],
			attachedEntity: false
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
	],

	143: [
		{
			//EF_SONICBLOW2	Sonic Blow (Part 2/2) - sonicblow at target
			type: 'STR',
			file: 'sonicblow',
			attachedEntity: true
		}
	],

	144: [
		{
			//EF_BRANDISH2	Brandish Spear Pre-Hit Effect
			type: 'STR',
			file: 'brandish2',
			wav: 'effect/knight_brandish_spear',
			attachedEntity: true
		}
	],

	/*145: [{	//EF_SHOCKWAVE	Shockwave Trap
			type: 'STR',
			file: 'shockwave',
			wav:  'effect/hunter_shockwavetrap',
			attachedEntity: true
		}],*/

	145: [
		{
			//EF_SHOCKWAVE	Shockwave Trap, held by the trap unit: ShockWave.str over and over, no sound
			type: 'STR',
			file: 'shockwave',
			attachedEntity: false
		}
	],

	146: [
		{
			//EF_SHOCKWAVEHIT	Shockwave Trap Hit
			type: 'STR',
			file: 'shockwavehit',
			attachedEntity: true
		}
	],

	147: [
		{
			//EF_EARTHHIT	Pierce Hit
			type: 'STR',
			file: 'earthhit',
			attachedEntity: true
		}
	],

	148: [
		{
			//EF_PIERCESELF	Pierce Cast Animation
			type: 'STR',
			file: 'pierce',
			attachedEntity: true
			// attach animation at middle of body
		}
	],

	149: [
		{
			//EF_BOWLINGSELF	Bowling Bash, on the caster as each damage packet arrives (no sound)
			type: 'STR',
			file: 'bowling',
			head: true,
			attachedEntity: true
		}
	],

	150: [
		{
			//EF_SPEARSTABSELF	Spear Stab, on the caster as each damage packet arrives (no sound)
			type: 'STR',
			file: 'spearstab',
			attachedEntity: true
			// attach animation at middle of body
		}
	],

	151: [
		{
			//EF_SPEARBMRSELF	Spear Boomerang, on the caster after the throw (80), no sound
			type: 'STR',
			file: 'spearboomerang',
			head: true,
			attachedEntity: true
		}
	],

	152: [
		{
			//turn undead hit on targer	//EF_HOLYHIT	Turn Undead
			type: 'STR',
			file: 'holyhit',
			attachedEntity: true
		}
	],

	153: [
		{
			//EF_CONCENTRATION	Increase Concentration
			type: 'STR',
			file: 'concentration',
			wav: 'effect/ac_concentration',
			attachedEntity: true
		}
	],

	154: [
		{
			//EF_REFINEOK	Refine Success
			type: 'STR',
			file: 'bs_refinesuccess',
			wav: 'effect/bs_refinesuccess',
			attachedEntity: true
		}
	],

	155: [
		{
			//EF_REFINEFAIL	Refine Fail
			type: 'STR',
			file: 'bs_refinefailed',
			wav: 'effect/bs_refinefailed',
			attachedEntity: true
		}
	],

	//156: [{}],	//EF_JOBCHANGE	   jobchange.str not found error
	//157: [{}],	//EF_LVUP	   levelup.str not found error

	158: [
		{
			//EF_JOBLVUP	Job Level Up
			type: 'STR',
			file: 'joblvup',
			attachedEntity: true
		}
	],

	//159: [{}],	//EF_TOPRANK	   PvP circle
	//160: [{}],	//EF_PARTY	   PvP Party Circle
	161: [
		{
			//EF_RAIN	Rain weather
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				RainWeatherEffect.startOrRestart(Params);
			}
		}
	],
	162: [
		{
			//EF_SNOW	Snow weather
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				SnowWeatherEffect.startOrRestart(Params);
			}
		}
	],

	163: [
		{
			//EF_SAKURA	   White Sakura Leaves
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				SakuraWeatherEffect.startOrRestart(Params);
			}
		}
	],

	//164: [{}],	//EF_STATUS_STATE	   (Nothing)

	165: [
		{
			//Comodo Fireworks Ball	//EF_BANJJAKII	Comodo Fireworks Ball
			type: 'SPR',
			file: '\xc5\xa9\xb8\xae\xbd\xba\xb8\xb6\xbd\xba',
			duration: 1000,
			attachedEntity: true
		}
	],

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
	//167: [{}],	//EF_TAMINGSUCCESS	   (Nothing)
	//168: [{}],	//EF_TAMINGFAILED	   (Nothing)

	169: [
		{
			//EF_ENERGYCOAT	Energy Coat Animation
			type: 'STR',
			file: 'energycoat',
			attachedEntity: true
		}
	],

	170: [
		{
			//EF_CARTREVOLUTION	Cart Revolution
			// Official client: the STR, and on ticks 7 and 20 the Magnum Break sound with a yellow ring and a
			// fire sphere (smaller and fainter than Magnum Break's). See effect-port/merchant-skills.md.
			type: 'STR',
			file: 'cartrevolution',
			attachedEntity: true
		},
		{
			type: 'PRIM',
			prim: 'ring',
			texture: 'ring_yellow',
			attachedEntity: false,
			delayStart: 7 * (1000 / 60),
			duration: 20 * (1000 / 60),
			frames: 20,
			radiusSpeed: 1.75,
			radiusAccel: -(1.75 / 20) * 0.5,
			width: 5,
			alpha: 0,
			alphaSpeed: 180 / 15,
			alphaMax: 180,
			fadeOutFrame: 5,
			wav: 'effect/ef_magnumbreak',
			delayWav: 7 * (1000 / 60)
		},
		{
			type: 'PRIM',
			prim: 'sphere',
			texture: '\xb4\xeb\xc6\xf8\xb9\xdf', //´ëÆø¹ß
			attachedEntity: false,
			delayStart: 7 * (1000 / 60),
			duration: 20 * (1000 / 60),
			frames: 20,
			radiusSpeed: 1.35,
			radiusAccel: -(1.35 / 20) * 0.5,
			spin: 3,
			alpha: 0,
			alphaSpeed: 240 / 7,
			alphaMax: 240,
			fadeOutFrame: 5
		},
		{
			type: 'PRIM',
			prim: 'ring',
			texture: 'ring_yellow',
			attachedEntity: false,
			delayStart: 20 * (1000 / 60),
			duration: 20 * (1000 / 60),
			frames: 20,
			radiusSpeed: 1.75,
			radiusAccel: -(1.75 / 20) * 0.5,
			width: 5,
			alpha: 0,
			alphaSpeed: 180 / 15,
			alphaMax: 180,
			fadeOutFrame: 5,
			wav: 'effect/ef_magnumbreak',
			delayWav: 20 * (1000 / 60)
		},
		{
			type: 'PRIM',
			prim: 'sphere',
			texture: '\xb4\xeb\xc6\xf8\xb9\xdf', //´ëÆø¹ß
			attachedEntity: false,
			delayStart: 20 * (1000 / 60),
			duration: 20 * (1000 / 60),
			frames: 20,
			radiusSpeed: 1.35,
			radiusAccel: -(1.35 / 20) * 0.5,
			spin: 3,
			alpha: 0,
			alphaSpeed: 240 / 7,
			alphaMax: 240,
			fadeOutFrame: 5
		}
	],

	171: [
		{
			//EF_VENOMDUST2	   Venom Dust Map Unit
			type: '3D',
			spriteName: 'particle3',
			alphaMax: 1,
			attachedEntity: true,
			duration: 100,
			size: 80,
			poszStart: 0,
			poszEnd: 0.5,
			repeat: true
		}
	],

	//172: [{}],	//EF_CHANGEDARK	   Change Element (Dark)
	//173: [{}],	//EF_CHANGEFIRE	   Change Element (Fire)
	//174: [{}],	//EF_CHANGECOLD	   Change Element (Water)
	//175: [{}],	//EF_CHANGEWIND	   Change Element (Wind)
	//176: [{}],	//EF_CHANGEFLAME	   Change Element (Fire)
	//177: [{}],	//EF_CHANGEEARTH	   Change Element (Earth)
	//178: [{}],	//EF_CHAINGEHOLY	   Change Element (Holy)
	//179: [{}],	//EF_CHANGEPOISON	   Change Element (Poison)

	// EF_HITDARK, the dark hit flash (HitDarkEffect.js)
	180: hitDarkEffect,

	181: [
		{
			//EF_MENTALBREAK	Mental Breaker
			type: 'STR',
			file: 'mentalbreak',
			attachedEntity: true
		}
	],

	182: [
		{
			//EF_MAGICALATTHIT	Magical Hit
			type: 'STR',
			file: 'magical',
			attachedEntity: true
		}
	],

	183: [
		{
			//EF_SUI_EXPLOSION	Self Destruction
			type: 'STR',
			file: 'sui_explosion',
			attachedEntity: true,
			wav: 'effect/ef_hit2'
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

	//184: [{}],	//EF_DARKATTACK	   Dark Elemental Attack

	185: [
		{
			//EF_SUICIDE	(Nothing)
			type: 'STR',
			file: 'suicide',
			attachedEntity: true
		}
	],

	186: [
		{
			//EF_COMBOATTACK1	Combo Attack 1
			type: 'STR',
			file: 'yunta_1',
			attachedEntity: true
		}
	],

	187: [
		{
			//EF_COMBOATTACK2	Combo Attack 2
			type: 'STR',
			file: 'yunta_2',
			attachedEntity: true
		}
	],

	188: [
		{
			//EF_COMBOATTACK3	Combo Attack 3
			type: 'STR',
			file: 'yunta_3',
			attachedEntity: true
		}
	],

	189: [
		{
			//EF_COMBOATTACK4	Combo Attack 4
			type: 'STR',
			file: 'yunta_4',
			attachedEntity: true
		}
	],

	190: [
		{
			//EF_COMBOATTACK5	Combo Attack 5
			type: 'STR',
			file: 'yunta_5',
			attachedEntity: true
		}
	],

	191: [
		{
			//EF_GUIDEDATTACK	Guided Attack
			type: 'STR',
			file: 'homing',
			attachedEntity: true
		}
	],

	192: [
		{
			//EF_POISONATTACK	Poison Attack
			type: 'STR',
			file: 'poison',
			attachedEntity: true
		}
	],

	193: [
		{
			//EF_SILENCEATTACK	Silence Attack
			type: 'STR',
			file: 'silence',
			attachedEntity: true
		}
	],

	194: [
		{
			//EF_STUNATTACK	Stun Attack
			type: 'STR',
			file: 'stun',
			attachedEntity: true
		}
	],

	195: [
		{
			//EF_PETRIFYATTACK	Petrify Attack
			type: 'STR',
			file: 'stonecurse',
			attachedEntity: true
		}
	],

	//196: [{}],	//EF_CURSEATTACK	   Curse Attack

	197: [
		{
			//EF_SLEEPATTACK	Sleep Attack
			type: 'STR',
			file: 'sleep',
			attachedEntity: true
		}
	],

	//198: [{}],	//EF_TELEKHIT	   (Nothing)

	199: [
		{
			//EF_PONG	Small Popping Bubble Map Effect
			type: 'STR',
			file: 'pong%d',
			rand: [1, 3],
			attachedEntity: false
		}
	]
};
