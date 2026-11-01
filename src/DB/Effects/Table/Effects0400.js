/**
 * @module DB/Effects/Table/Effects0400
 *
 * Effects 400 to 499 of the effect table. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep rows in effect ID order.
 */

import SongEffects from 'Renderer/Effects/Songs.js';
import { hitLine4Effect, hitLine5Effect, hitLine6Effect } from 'DB/Effects/HitLineEffect.js';
import SpiderWeb from 'Renderer/Effects/SpiderWeb.js';
import { slimPotionEffects, slimPitcherSound } from 'DB/Effects/SlimPotionEffect.js';
import { warmthEffect } from 'DB/Effects/WarmthEffect.js';
import { edpEffect, EDP_LIFE } from 'DB/Effects/PoisonAttackEffect.js';
import { outwardSlashEffect } from 'DB/Effects/PurpleSlashEffect.js';
import CasterMarks from 'Renderer/Effects/CasterMarks.js';
import FacingTurn from 'Renderer/Effects/FacingTurn.js';

const FogEffects = SongEffects.FogEffects;

export default {
	400: [
		{
			//joint beat caster	//EF_BASH3D4	Joint Beat
			// Official client: its sound on tick 22 (effect-port/lord-knight-skills.md).
			wav: 'effect/\xba\xf1\xc6\xae\x20\xc1\xb6\xc0\xce\xc6\xae', // ºñÆ® Á¶ÀÎÆ®
			delayWav: 22 * (1000 / 60),
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const entity = Params.Init.ownerEntity;
				entity.animations.add(function (tick) {
					// Official: Halo (Double Body) is active between state 20 and 50.
					// Scaling to ms (approx 200ms to 500ms).
					if (tick >= 150 && tick <= 500) {
						entity._enableHalo = true;
					} else {
						entity._enableHalo = false;
					}
					return tick > 600;
				});
			}
		},
		{
			type: 'CYLINDER',
			textureName: 'alpha_center',
			alphaMax: 0.6,
			duration: 175,
			delayStart: 500,
			duplicate: 6,
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
			duplicate: 6,
			delayStart: 500,
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

	charge_attack: [
		{
			//charge attack (quest-skill)
			//same effect on target like 'Bash'
			attachedEntity: true
		}
	],

	401: [
		//EF_NAPALMVALCAN	   Napalm Vulcan Sound
		// Official client: on the target, EF_NapalmBeat.wav on ticks 20, 30, 40, 50 and 60. Its
		// EF_HIT2 calls on those ticks draw nothing (that code only works on its own first tick).
		{
			wav: 'effect/ef_napalmbeat',
			delayWav: 20 * (1000 / 60),
			attachedEntity: true
		},
		{
			wav: 'effect/ef_napalmbeat',
			delayWav: 30 * (1000 / 60),
			attachedEntity: true
		},
		{
			wav: 'effect/ef_napalmbeat',
			delayWav: 40 * (1000 / 60),
			attachedEntity: true
		},
		{
			wav: 'effect/ef_napalmbeat',
			delayWav: 50 * (1000 / 60),
			attachedEntity: true
		},
		{
			wav: 'effect/ef_napalmbeat',
			delayWav: 60 * (1000 / 60),
			attachedEntity: true
		}
	],
	402: [
		//EF_PORTAL5	   Dangerous Soul Collect
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function EffectBodyColor(Params) {
				const entity = Params.Init.ownerEntity;
				entity.animations.add(function (tick) {
					const time = tick;

					if (time < 200) {
						entity._flashColor[0] = 1.0; // Red
						entity._flashColor[1] = 1.0; // Green
						entity._flashColor[2] = 0.0; // Blue
						entity._flashColor[3] = 0.1; // Alpha (10%)
						entity.recalculateBlendingColor();
						return false;
					}

					// Part 2: Smooth fade back to normal
					if (time < 800) {
						const progress = (time - 200) / 600;
						entity._flashColor[0] = 1.0;
						entity._flashColor[1] = 1.0;
						entity._flashColor[2] = 0.0 + 1.0 * progress;
						entity._flashColor[3] = 0.1 + 0.9 * progress;
						entity.recalculateBlendingColor();
						return false;
					}

					// Final reset
					entity._flashColor[0] = 1.0;
					entity._flashColor[1] = 1.0;
					entity._flashColor[2] = 1.0;
					entity._flashColor[3] = 1.0;
					entity.recalculateBlendingColor();
					return true;
				});
			}
		}
	],

	403: [
		{
			//EF_MAGICCRASHER2	   Mind Breaker
			type: 'FUNC',
			attachedEntity: true,
			func: function EffectBodyColor(Params) {
				const entity = Params.Init.ownerEntity;
				entity.animations.add(function (tick) {
					if (tick < 1000) {
						entity._flashColor[0] = Math.random();
						entity._flashColor[1] = Math.random();
						entity._flashColor[2] = Math.random();
						entity.recalculateBlendingColor();
					} else {
						entity._flashColor[0] = 1;
						entity._flashColor[1] = 1;
						entity._flashColor[2] = 1;
						entity._flashColor[3] = 1;
						entity.recalculateBlendingColor();
						return true;
					}
				});
			},
			wav: 'effect/swordman_provoke'
		}
	],

	404: [
		{
			//EF_BOTTOM_SPIDER	Fiber Lock
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				this.add(new SpiderWeb(Params.Inst.position, Params.Inst.startTick), Params);
			}
		}
	],

	'405_ground': [
		{
			//wall of fog
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				const self = this;
				FogEffects.forEach(function (effect) {
					self.add(new effect(Params.Inst.position, Params.Inst.startTick), Params);
				});
			}
		}
	],

	406: [
		{
			//EF_SOULBURN	Soul Burn
			type: 'STR',
			file: '\xbc\xd2\xbf\xef\xb9\xf8',
			attachedEntity: true
		}
	],

	407: [
		{
			//EF_SOULCHANGE	Soul Change
			type: 'STR',
			file: '\xbb\xe7\xb6\xf7\xc8\xbf\xb0\xfa',
			attachedEntity: true
		}
	],

	//408: [{}],	//EF_BABY	   Mom, Dad, I love you! (Baby Skill)

	409: [
		{
			// EF_SOULBREAKER2, Meteor Assault, on the caster when the skill succeeds (official client):
			// 메테오 어썰트.wav on tick 0; eight sets of four level purpleslash.tga slashes fly out from the
			// caster from about tick 30 (PurpleSlashEffect.js); ticks 0-10 the caster added and magenta.
			wav: 'effect/\xb8\xde\xc5\xd7\xbf\xc0\x20\xbe\xee\xbd\xe4\xc6\xae'
		},
		outwardSlashEffect,
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				this.add(new CasterMarks(Params.Init.ownerEntity, Params.Inst.startTick, 300, 409), Params);
			}
		}
	],

	//410: [{}],	//EF_RAINBOW	   Rainbow
	//411: [{}],	//EF_PEONG	   Leap
	//412: [{}],	//EF_TANJI2	   Like Throw Spirit Sphere
	//413: [{}],	//EF_PRESSEDBODY	   Axe Kick
	//414: [{}],	//EF_SPINEDBODY	   Round Kick
	//415: [{}],	//EF_KICKEDBODY	   Counter Kick
	//416: [{}],	//EF_AIRTEXTURE	   (Nothing)
	//417: [{}],	//EF_HITBODY	   Flash
	// 418 EF_DOUBLEGUMGANG, Warmth's sparks while the status is on: WarmthEffect.js.
	418: warmthEffect,
	// 419 EF_REFLECTBODY (Kaite): SoulBodyEffects.js.

	420: [
		{
			//EF_BABYBODY	Eswoo (Small) (Visual Effect)
			type: 'FUNC',
			attachedEntity: true,
			func: function EffectSmallTransition(Params) {
				const entity = Params.Init.ownerEntity;
				const xSize = entity.xSize;
				const ySize = entity.ySize;

				entity.animations.add(function (tick) {
					entity.xSize = xSize + (2.5 - xSize) * (Math.min(tick, 300) / 300);
					entity.ySize = ySize + (2.5 - ySize) * (Math.min(tick, 300) / 300);

					return tick > 300;
				});
			}
		}
	],

	421: [
		{
			//EF_BABYBODY2	Eswoo (Alt. Small) (Visual Effect)
			type: 'FUNC',
			attachedEntity: true,
			func: function EffectSmall(Params) {
				const entity = Params.Init.ownerEntity;
				entity.xSize = 2.5;
				entity.ySize = 2.5;
			}
		}
	],

	422: [
		{
			//EF_GIANTBODY	Eswoo (Normal) (Visual Effect)
			type: 'FUNC',
			attachedEntity: true,
			func: function EffectBigTransition(Params) {
				const entity = Params.Init.ownerEntity;
				const xSize = entity.xSize;
				const ySize = entity.ySize;

				entity.animations.add(function (tick) {
					entity.xSize = xSize + (7.5 - xSize) * (Math.min(tick, 300) / 300);
					entity.ySize = ySize + (7.5 - ySize) * (Math.min(tick, 300) / 300);

					return tick > 300;
				});
			}
		}
	],

	423: [
		{
			//EF_GIANTBODY2	Eswoo (Alt. Normal) (Visual Effect)
			type: 'FUNC',
			attachedEntity: true,
			func: function EffectBig(Params) {
				const entity = Params.Init.ownerEntity;
				entity.xSize = 7.5;
				entity.ySize = 7.5;
			}
		}
	],

	// 424 EF_ASURABODY (Soul Link): SoulBodyEffects.js.
	//425: [{}],	//EF_4WAYBODY	   Esma Hit (Visual Effect)

	426: [
		{
			//taekwon sprint collision effect	//EF_QUAKEBODY	Sprint Collision (Visual Effect)
			wav: 'effect/\xba\xb9\xc8\xa3\xb0\xdd', //şąČŁ°Ý
			attachedEntity: true
		}
	],

	//427: [{}],	//EF_ASURABODY_MONSTER	   (Nothing)
	//428: [{}],	//EF_HITLINE3	   (Nothing)
	// EF_HITLINE4 / 5 / 6, the kick hit lines (HitLineEffect.js, effect-port/hit-lines.md)
	429: hitLine4Effect,
	430: hitLine5Effect,
	431: hitLine6Effect,
	//432: [{}],	//EF_ELECTRIC	   Solar, Lunar and Stellar Perception (Visual Effect)
	//433: [{}],	//EF_ELECTRIC2	   Solar, Lunar and Stellar Opposition (Visual Effect)
	//434: [{}],	//EF_HITLINE7	   Taekwon Kick Hit 4
	435: [
		{
			//EF_STORMKICK	Tornado Kick, on the caster
			wav: 'effect/t_\xc8\xb8\xbf\xc0\xb8\xae\xc2\xf7\xb1\xe2', // t_회오리차기
			delayWav: 83, // tick 5
			attachedEntity: true
		},
		{
			// The caster turns 30 degrees a tick for 48 ticks (FacingTurn.js).
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				this.add(new FacingTurn(Params.Init.ownerEntity, Params.Inst.startTick), Params);
			}
		}
	],
	//436: [{}],	//EF_HALFSPHERE	   White Barrier (Unused)
	//437: [{}],	//EF_ATTACKENERGY	   White barrier 2 (Unused)
	//438: [{}],	//EF_ATTACKENERGY2	   Kaite Reflect Animation
	//439: [{}],	//EF_CHEMICAL3	   Flying Side Kick

	440: [
		{
			//EF_ASSUMPTIO2	Assumptio (Animation)
			type: 'STR',
			file: 'asum',
			wav: 'effect/\xbe\xc6\xbc\xfb\xc7\xc1\xc6\xbc\xbf\xc0',
			attachedEntity: true
		}
	],

	441: [
		{
			//EF_BLUECASTING	   Blue cast aura (Comfort skills, Star Emperor skills)
			// Same as the yellow (12) and white (58) cast auras in the official client, with ring_blue.
			alphaMax: 0.8,
			animation: 2,
			attachedEntity: true,
			blendMode: 2,
			blue: 1,
			bottomSize: 1,
			fade: true,
			green: 1,
			height: 4,
			red: 1,
			rotate: true,
			textureName: 'ring_blue',
			topSize: 5,
			type: 'CYLINDER',
			wav: 'effect/ef_beginspell'
		}
	],
	//442: [{}],	//EF_RUN	   Foot Prints caused by Sprint.
	//443: [{}],	//EF_STOPRUN	   (Nothing)

	444: [
		{
			//EF_STOPEFFECT	   Sprint Stop Animation
			wav: 'effect/t_\xc8\xbf\xb0\xfa\xc0\xbd1',
			attachedEntity: true
		}
	],

	445: [
		{
			//high jump caster	//EF_JUMPBODY	High Jump (Jump)
			wav: 'effect/t_\xc8\xb8\xc7\xc72',
			attachedEntity: true
		}
	],

	//446: [{}],	//EF_LANDBODY	   High Jump (Return Down)
	//447: [{}],	//EF_FOOT3	   Running Left Foot
	//448: [{}],	//EF_FOOT4	   Running Right Foot
	//449: [{}],	//EF_TAE_READY	   KA-Spell (1st Part)

	// Tumbling (TK_DODGE): the sound the official client plays when the skill works.
	ef_tk_dodge: [
		{
			wav: 'effect/t_\xb3\xab\xb9\xfd' // t_낙법
		}
	],

	450: [
		{
			// Dark cross	//EF_GRANDCROSS2	Darkcross
		}
	],

	451: [
		{
			//EF_SOULSTRIKE2	   Dark Strike
			alphaMax: 1,
			attachedEntity: true,
			blue: 1,
			duration: 200,
			delayLate: 250,
			//duplicate: -1,
			fadeIn: true,
			fadeOut: true,
			file: 'effect/pok3.tga',
			toSrc: true,
			green: 1,
			poszEnd: 1,
			poszSmooth: true,
			poszStartRand: 5,
			poszStartRandMiddle: 6,
			red: 1,
			size: 50,
			timeBetweenDupli: 150,
			type: '3D',
			wav: 'effect/ef_soulstrike',
			zIndex: 1
		},
		{
			type: '3D',
			duration: 250,
			duplicate: 5,
			timeBetweenDupli: 20,
			absoluteSpriteName: 'data/sprite/\xc0\xcc\xc6\xd1\xc6\xae/particle5',
			playSprite: true,
			toSrc: true,
			rotateToTarget: true,
			sizeStart: 100.0,
			sizeEnd: 500.0,
			zOffset: 3,
			arc: 4.0,
			retreat: 4.0, //soulstrike2 have a little retreat upper
			soulStrikePattern: true
		}
	],

	452: [
		{
			//EF_YUFITELHIT2	Alternative Jupitel Thunder (Hit)
			type: '3D',
			file: 'effect/pokjuk_d.bmp',
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
				'effect/twirl_soft.bmp',
				'effect/thunder_ball_b.bmp',
				'effect/twirl_soft.bmp',
				'effect/thunder_ball_c.bmp',
				'effect/twirl_soft.bmp'
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

	453: [
		{
			//EF_NPC_STOP	   Paralized
			type: 'SPR',
			file: '\xbd\xba\xc5\xe9',
			attachedEntity: true
		}
	],

	454: [
		{
			//EF_DARKCASTING	   Like Blind
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
			textureName: 'ring_black',
			topSize: 5,
			type: 'CYLINDER',
			wav: 'effect/ef_beginspell'
		}
	],

	//455: [{}],	//EF_GUMGANGNPC	   Another Warmth Lightning

	456: [
		{
			//EF_AGIUP	   Power Up
			wav: 'effect/\x6d\x6f\x6e\x5f\xc6\xf8\xb1\xe2',
			attachedEntity: true
		}
	],

	457: [
		{
			//EF_JUMPKICK	Flying Kick, on the caster
			wav: 'effect/\x74\x5f\xb3\xaf\xb6\xf3\xc2\xf7\xb1\xe2', // t_날라차기
			delayWav: 83, // tick 5
			attachedEntity: true
		}
	],

	//458: [{}],	//EF_QUAKEBODY2	   Running/Sprint (running into a wall)
	//459: [{}],	//EF_STORMKICK1	   Brown tornado that spins sprite (unused)
	//460: [{}],	//EF_STORMKICK2	   Green tornado (unused)
	//461: [{}],	//EF_STORMKICK3	   Blue tornado (unused)
	462: [
		{
			//EF_STORMKICK4	Cicada Skin Shed dodge: official effect 462 (effect-port/ninja-skills.md), sent by
			// the server when the shed blocks a hit: t_회피.wav on tick 15. Not ported: the Leap
			// dust (whitelight.tga particles, the Taekwon audit's 411 follow-up).
			wav: 'effect/t_\xc8\xb8\xc7\xc7',
			delayWav: 15 * (1000 / 60)
		}
	],
	//463: [{}],	//EF_STORMKICK5	   Kaupe Dodge Effect
	//464: [{}],	//EF_STORMKICK6	   White tornado (unused)
	//465: [{}],	//EF_STORMKICK7	   Purple tornado (unused)
	//466: [{}],	//EF_SPINEDBODY2	   Another Round Kick

	467: [
		{
			//EF_BEGINASURA1	   Warm/Mild Wind (Earth)
			wav: 'effect/t_\xb9\xd9\xb6\xf7\xb9\xe6\xc3\xe2'
		},
		{
			alphaMax: 1,
			blendMode: 2,
			red: 1.0,
			green: 1.0,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 300,
			type: '3D',
			zIndex: 10,
			file: 'effect/hanmoon1.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.7,
			green: 0.7,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 220,
			type: '3D',
			zIndex: 10,
			file: 'effect/hanmoon1.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.5,
			green: 0.5,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 350,
			type: '3D',
			zIndex: 10,
			file: 'effect/hanmoon1.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.3,
			green: 0.3,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 400,
			type: '3D',
			zIndex: 10,
			file: 'effect/hanmoon1.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.1,
			green: 0.1,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 450,
			type: '3D',
			zIndex: 10,
			file: 'effect/hanmoon1.tga'
		}
	],

	468: [
		{
			//EF_BEGINASURA2	   Warm/Mild Wind (Wind)
			wav: 'effect/t_\xb9\xd9\xb6\xf7\xb9\xe6\xc3\xe2'
		},
		{
			alphaMax: 1,
			blendMode: 2,
			red: 1.0,
			green: 1.0,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 300,
			type: '3D',
			zIndex: 10,
			file: 'effect/hanmoon2.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.7,
			green: 0.7,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 220,
			type: '3D',
			zIndex: 10,
			file: 'effect/hanmoon2.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.5,
			green: 0.5,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 350,
			type: '3D',
			zIndex: 10,
			file: 'effect/hanmoon2.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.3,
			green: 0.3,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 400,
			type: '3D',
			zIndex: 10,
			file: 'effect/hanmoon2.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.1,
			green: 0.1,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 450,
			type: '3D',
			zIndex: 10,
			file: 'effect/hanmoon2.tga'
		}
	],

	469: [
		{
			//EF_BEGINASURA3	   Warm/Mild Wind (Water)
			wav: 'effect/t_\xb9\xd9\xb6\xf7\xb9\xe6\xc3\xe2'
		},
		{
			alphaMax: 1,
			blendMode: 2,
			red: 1.0,
			green: 1.0,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 300,
			type: '3D',
			zIndex: 10,
			file: 'effect/hanmoon3.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.7,
			green: 0.7,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 220,
			type: '3D',
			zIndex: 10,
			file: 'effect/hanmoon3.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.5,
			green: 0.5,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 350,
			type: '3D',
			zIndex: 10,
			file: 'effect/hanmoon3.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.3,
			green: 0.3,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 400,
			type: '3D',
			zIndex: 10,
			file: 'effect/hanmoon3.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.1,
			green: 0.1,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 450,
			type: '3D',
			zIndex: 10,
			file: 'effect/hanmoon3.tga'
		}
	],

	470: [
		{
			//EF_BEGINASURA4	   Warm/Mild Wind (Fire)
			wav: 'effect/t_\xb9\xd9\xb6\xf7\xb9\xe6\xc3\xe2'
		},
		{
			alphaMax: 1,
			blendMode: 2,
			red: 1.0,
			green: 1.0,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 300,
			type: '3D',
			zIndex: 10,
			file: 'effect/hanmoon4.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.7,
			green: 0.7,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 220,
			type: '3D',
			zIndex: 10,
			file: 'effect/hanmoon4.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.5,
			green: 0.5,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 350,
			type: '3D',
			zIndex: 10,
			file: 'effect/hanmoon4.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.3,
			green: 0.3,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 400,
			type: '3D',
			zIndex: 10,
			file: 'effect/hanmoon4.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.1,
			green: 0.1,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 450,
			type: '3D',
			zIndex: 10,
			file: 'effect/hanmoon4.tga'
		}
	],

	471: [
		{
			//EF_BEGINASURA5	   Warm/Mild Wind (Ghost)
			wav: 'effect/t_\xb9\xd9\xb6\xf7\xb9\xe6\xc3\xe2'
		},
		{
			alphaMax: 1,
			blendMode: 2,
			red: 1.0,
			green: 1.0,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 300,
			type: '3D',
			zIndex: 10,
			file: 'effect/hanmoon7.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.7,
			green: 0.7,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 220,
			type: '3D',
			zIndex: 10,
			file: 'effect/hanmoon7.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.5,
			green: 0.5,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 350,
			type: '3D',
			zIndex: 10,
			file: 'effect/hanmoon7.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.3,
			green: 0.3,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 400,
			type: '3D',
			zIndex: 10,
			file: 'effect/hanmoon7.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.1,
			green: 0.1,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 450,
			type: '3D',
			zIndex: 10,
			file: 'effect/hanmoon7.tga'
		}
	],

	472: [
		{
			//EF_BEGINASURA6	   Warm/Mild Wind (Shadow)
			wav: 'effect/t_\xb9\xd9\xb6\xf7\xb9\xe6\xc3\xe2'
		},
		{
			alphaMax: 1,
			blendMode: 2,
			red: 1.0,
			green: 1.0,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 300,
			type: '3D',
			zIndex: 10,
			file: 'effect/hanmoon5.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.7,
			green: 0.7,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 220,
			type: '3D',
			zIndex: 10,
			file: 'effect/hanmoon5.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.5,
			green: 0.5,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 350,
			type: '3D',
			zIndex: 10,
			file: 'effect/hanmoon5.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.3,
			green: 0.3,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 400,
			type: '3D',
			zIndex: 10,
			file: 'effect/hanmoon5.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.1,
			green: 0.1,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 450,
			type: '3D',
			zIndex: 10,
			file: 'effect/hanmoon5.tga'
		}
	],

	473: [
		{
			//EF_BEGINASURA7	   Warm/Mild Wind (Holy)
			wav: 'effect/t_\xb9\xd9\xb6\xf7\xb9\xe6\xc3\xe2'
		},
		{
			alphaMax: 1,
			blendMode: 2,
			red: 1.0,
			green: 1.0,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 300,
			type: '3D',
			zIndex: 10,
			file: 'effect/hanmoon6.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.7,
			green: 0.7,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 220,
			type: '3D',
			zIndex: 10,
			file: 'effect/hanmoon6.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.5,
			green: 0.5,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 350,
			type: '3D',
			zIndex: 10,
			file: 'effect/hanmoon6.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.3,
			green: 0.3,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 400,
			type: '3D',
			zIndex: 10,
			file: 'effect/hanmoon6.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.1,
			green: 0.1,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 450,
			type: '3D',
			zIndex: 10,
			file: 'effect/hanmoon6.tga'
		}
	],

	// Taekwon Mission (TK_MISSION): the sound the official client plays when the skill works.
	ef_tk_mission: [
		{
			wav: 'effect/t_\xc7\xc7\xb8\xb5' // t_피링
		}
	],

	//474: [{}],	//EF_AURABLADE2	   (Nothing)
	//475: [{}],	//EF_DEVIL1	   Demon of The Sun Moon And Stars (Level 1)
	//476: [{}],	//EF_DEVIL2	   Demon of The Sun Moon And Stars (Level 2)
	//477: [{}],	//EF_DEVIL3	   Demon of The Sun Moon And Stars (Level 3)
	//478: [{}],	//EF_DEVIL4	   Demon of The Sun Moon And Stars (Level 4)
	//479: [{}],	//EF_DEVIL5	   Demon of The Sun Moon And Stars (Level 5)
	//480: [{}],	//EF_DEVIL6	   Demon of The Sun Moon And Stars (Level 6)
	//481: [{}],	//EF_DEVIL7	   Demon of The Sun Moon And Stars (Level 7)
	//482: [{}],	//EF_DEVIL8	   Demon of The Sun Moon And Stars (Level 8)
	//483: [{}],	//EF_DEVIL9	   Demon of The Sun Moon And Stars (Level 9)
	//484: [{}],	//EF_DEVIL10	   Demon of The Sun Moon And Stars (Level 10)
	//485: [{}],	//EF_DOUBLEGUMGANG2	   Mental Strength Lightning but White
	//486: [{}],	//EF_DOUBLEGUMGANG3	   Mental Strength Lightning
	//487: [{}],	//EF_BLACKDEVIL	   Demon of The Sun Moon And Stars Ground Effect
	// 488 EF_FLOWERCAST (Comfort): SoulBodyEffects.js.
	//489: [{}],	//EF_FLOWERCAST2	   (Nothing)
	//490: [{}],	//EF_FLOWERCAST3	   (Nothing)

	491: [
		{
			//EF_MOCHI	Element Potions
			type: 'STR',
			file: '\xc2\xfd\xbd\xd2\xb6\xb1',
			attachedEntity: true
		}
	],

	492: [
		{
			//EF_LAMADAN	Cooking Foods
			type: 'STR',
			file: 'ramadan',
			attachedEntity: true
		}
	],

	493: [
		// EF_EDP, Enchant Deadly Poison on the caster: particle3 particles every 3 ticks, the enchant
		// sound six times (PoisonAttackEffect.js)
		...edpEffect(),
		{
			// Ticks 0-80 the caster is drawn adding light and magenta on even ticks, white on odd
			// ones (CasterMarks.js)
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				this.add(new CasterMarks(Params.Init.ownerEntity, Params.Inst.startTick, EDP_LIFE, 493), Params);
			}
		}
	],

	// EF_RG_COIN2	Full Strip (ST_FULLSTRIP): on the target when it works, the strip sound on
	// ticks 1, 11, 21 and 31. The client also flings shield.bmp and sword.bmp
	// icons (prim 43), not drawn here.
	495: [1, 11, 21, 31].map(tick => ({
		wav: 'effect/\xba\xb9\xc8\xa3\xb0\xdd', // 복호격
		delayWav: Math.round((tick * 1000) / 60),
		attachedEntity: true
	})),

	//494: [{}],	//EF_SHIELDBOOMERANG2	   Throwing Tomahawk
	//495: [{}],	//EF_RG_COIN2	   Full Strip Sound

	496: [
		{
			//EF_GUARD2	  Preserve
			wav: 'effect/black_maximize_power_sword_bic'
		},
		{
			// Preserve (official client): ticks 10 to 30 the caster is drawn adding light on
			// even ticks (CasterMarks.js). Its guard shield (prim 61, a01.bmp) is not drawn here.
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				this.add(new CasterMarks(Params.Init.ownerEntity, Params.Inst.startTick, 200, 496), Params);
			}
		}
	],

	// EF_SLIM, EF_SLIM2, EF_SLIM3: Slim Potion Pitcher's red, yellow and white potions falling onto the
	// cell, from the ground packet; assulter_attack.wav at the caster (SlimPotionEffect.js, effect-port/creator-skills.md)
	497: slimPotionEffects[497],
	498: slimPotionEffects[498],
	499: slimPotionEffects[499],
	ef_slim_pitcher_sound: slimPitcherSound
};
