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
import QuadHorn from 'Renderer/Effects/QuadHorn.js';
import Altitude from 'Renderer/Map/Altitude.js';
import Renderer from 'Renderer/Renderer.js';

export default {
	100: [
		{
			//EF_REMOVETRAP	Yellow ball fountain
			//type: 'FUNC',
			wav: 'effect/hunter_removetrap',
			attachedEntity: false
		}
	],

	101: [
		{
			//EF_REPAIRWEAPON	Weapon Repair
			type: 'STR',
			file: 'repairweapon',
			attachedEntity: true
		},
		{
			wav: 'effect/black_weapon_repair_a',
			delayWav: 480
		},
		{
			wav: 'effect/black_weapon_repair_a',
			delayWav: 1320
		}
	],

	102: [
		{
			//EF_CRASHEARTH	Hammerfall
			type: 'STR',
			file: 'crashearth',
			wav: 'effect/black_hammerfall',
			attachedEntity: false
		},
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const start = Params.Inst.startTick + 350;
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
			type: 'STR',
			file: 'maximizepower',
			min: 'maximize_min',
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
			//kyrie caster	//EF_KYRIE	Kyrie Eleison
			type: 'STR',
			file: 'kyrie',
			wav: 'effect/priest_kyrie_eleison_a', //on target its priest_kyrie_eleison_b
			min: 'kyrie_min',
			attachedEntity: true
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

	115: [
		{
			//blitzbeat on target hit	//EF_BLITZBEAT	Blitz Beat
			wav: 'effect/hunter_blitzbeat',
			attachedEntity: true
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

	119: [
		{
			//EF_DETECTING	Detect
			wav: 'effect/hunter_detecting',
			attachedEntity: true
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
		{
			//EF_SONICBLOWHIT	   Multi hit effect
			//wav:  'effect/assasin_sonicblow' // old

			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const entity = Params.Init.ownerEntity;
				const delay = Params.Inst.startTick - Renderer.tick;

				entity.animations.add(function (tick) {
					if (tick >= delay) {
						entity.direction = (entity.direction + 2) % 8; // Spinning around
						return true;
					}
				});
			}
		}
	],

	123: [
		{
			//grimtooth caster	//EF_GRIMTOOTH	Grimtooth Cast
			wav: 'effect/ef_frostdiver',
			attachedEntity: true
		},
		{
			//EF_GRIMTOOTH	stone spikes traveling from caster past the target
			type: 'TRAIL',
			attachedEntity: false,
			duration: 2500,
			speed: 24,
			interval: 50,
			stopAtTarget: true,
			overshoot: 3,
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

	126: [
		{
			//EF_POISONREACT	Poison React
			type: 'STR',
			file: 'poisonreact_1st',
			wav: 'effect/assasin_poisonreact',
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
			wav: 'effect/black_overthrust',
			attachedEntity: true
		}
	],

	129: [
		{
			//EF_SPLASHER	Venom Splasher Explosion
			type: 'STR',
			file: 'venomsplasher',
			wav: 'effect/assasin_venomsplasher',
			attachedEntity: true
		}
	],

	130: [
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
			type: 'STR',
			file: 'slowp',
			wav: 'effect/priest_slowpoison',
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
			type: 'STR',
			file: 'sandman',
			wav: 'effect/hunter_sandman',
			attachedEntity: false
		}
	],

	140: [
		{
			//EF_REVIVE	Ressurection Aura
			wav: 'effect/priest_resurrection',
			attachedEntity: true
		}
	],

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
			type: 'SPR',
			file: 'shockwave',
			wav: 'effect/hunter_shockwavetrap',
			attachedEntity: true
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
			//EF_BOWLINGSELF	Bowling Bash
			type: 'STR',
			file: 'bowling',
			wav: '_enemy_hit_normal1', //'effect/knight_bowling_bash', fake
			head: true,
			attachedEntity: true
		}
	],

	150: [
		{
			//EF_SPEARSTABSELF	Pierce Cast Animation
			type: 'STR',
			file: 'spearstab',
			wav: '_enemy_hit_normal1',
			attachedEntity: true
			// attach animation at middle of body
		}
	],

	151: [
		{
			//spear boomerang caster	//EF_SPEARBMRSELF	Spear Boomerang Cast
			type: 'STR',
			file: 'spearboomerang',
			wav: 'effect/knight_spear_boomerang',
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
			type: 'STR',
			file: 'cartrevolution',
			wav: 'effect/ef_magnumbreak',
			attachedEntity: true
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

	//180: [{}],	//EF_HITDARK	   Dark Elemental Hit

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
