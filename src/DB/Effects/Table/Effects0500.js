/**
 * @module DB/Effects/Table/Effects0500
 *
 * Effects 500 to 599 of the effect table. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep rows in effect ID order.
 */

import Camera from 'Renderer/Camera.js';
import SongEffects from 'Renderer/Effects/Songs.js';
import Events from 'Core/Events.js';
import CloudWeatherEffect from 'Renderer/Effects/CloudWeatherEffect.js';
import MagicTarget from 'Renderer/Effects/MagicTarget.js';
import SpiritSphere from 'Renderer/Effects/SpiritSphere.js';
import { smaEffect, sma2Effect } from 'DB/Effects/SmaBlackEffect.js';
import AcidDemonRing from 'Renderer/Effects/AcidDemonRing.js';
import { RING_FRAMES, RING_TICK_MS } from 'Renderer/Effects/AcidDemonRingSim.js';
import { berserkPotionThrowEffect } from 'DB/Effects/ThrowStoneEffect.js';
import { rapidSmitingEffect } from 'DB/Effects/RapidSmitingEffect.js';
import CasterMarks from 'Renderer/Effects/CasterMarks.js';

const GravityEffects = SongEffects.GravityEffects;

export default {
	500: [
		{
			//EF_CHEMICALBODY	   Player Become Blue with Blue Aura (Tarot Card of Fate, on the target)
			// The official client draws a glow copy round the actor on ticks 0-30, and the actor flickers
			// blue (added) on even ticks and white on odd ones (CasterMarks.js). Life 120 ticks.
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				this.add(new CasterMarks(Params.Init.ownerEntity, Params.Inst.startTick, 120, 500), Params);
			}
		}
	],

	501: [
		{
			//EF_CASTSPIN	   Chase Walk Animation
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const entity = Params.Init.ownerEntity;
				const duration = 500;
				const count = 50;
				const delay = duration / count;

				for (let i = 0; i < count; i++) {
					let delta = 1;

					if (i <= 15) {
						delta = 12 * (8 / 360);
					} else if (i <= 30) {
						delta = 18 * (8 / 360);
					} else if (i <= 40) {
						delta = 24 * (8 / 360);
					} else {
						delta = 48 * (8 / 360);
					}

					Events.setTimeout(function () {
						entity.direction = Math.floor(entity.direction + delta) % 8;
					}, delay * i);
				}
			}
		}
	],

	502: [
		{
			//EF_PIERCEBODY	   Player Become Yellow with Yellow Aura
			// Spiral Pierce Max cast (official client): for the cast time, at most 141
			// ticks, the caster flickers yellow (drawn adding light) and white each
			// tick, with a glow copy round it (CasterMarks.js).
			type: 'FUNC',
			attachedEntity: true,
			castLoop: true,
			wav: 'effect/ef_beginspell',
			func: function (Params) {
				this.add(
					new CasterMarks(Params.Init.ownerEntity, Params.Inst.startTick, Params.Init.duration / 16, 502),
					Params
				);
			}
		}
	],
	503: [
		{
			//EF_SOULLINK	   Soul Link Word
			// The official client plays T_캐스팅.wav at once and T_영혼.wav on tick 145 (2417 ms).
			// Its whitelight.tga part and the soul link picture are not drawn yet.
			wav: 'effect/t_\xc4\xb3\xbd\xba\xc6\xc3',
			attachedEntity: true
		},
		{
			wav: 'effect/t_\xbf\xb5\xc8\xa5',
			delayWav: 145 * (1000 / 60),
			attachedEntity: true
		}
	],

	504: [
		{
			//EF_CHOOKGI2	   (Nothing) - Used for spirit spheres (monk classes)
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const spiritNum = Params.Init.spiritNum || 0;
				const Spheres = new SpiritSphere(Params.Init.ownerEntity, spiritNum, false);
				this.add(Spheres, Params);
			}
		}
	],

	//505: [{}],	//EF_MEMORIZE	   Memorize
	//506: [{}],	//EF_SOULLIGHT	   (Nothing)

	507: [
		{
			//Authoritative Badge	//EF_MAPAE	Authoritative Badge
			type: 'STR',
			file: 'mapae',
			wav: 'effect/mapae',
			attachedEntity: true
		}
	],

	508: [
		{
			//EF_ITEMPOKJUK	Fire Cracker
			type: 'STR',
			file: 'itempokjuk',
			wav: 'effect/itempokjuk',
			attachedEntity: true
		}
	],

	509: [
		{
			//EF_05VAL	Valentine Day Hearth (Wings)
			type: 'SPR',
			file: '05vallentine',
			attachedEntity: true
		}
	],

	510: [
		{
			//EF_BEGINASURA11	   Champion Asura Strike
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
		// asura11 — phase 1
		{
			type: '3D',
			file: 'effect/asura11.tga',
			alphaMax: 1,
			attachedEntity: true,
			duration: 1200,
			duplicate: 3,
			timeBetweenDupli: 150,
			alphaMaxDelta: -0.25,
			fadeIn: true,
			sizeStart: 300,
			sizeEnd: 150,
			sizeSmooth: true,
			posx: -8.0,
			posy: 0,
			posz: 4,
			overlay: true,
			red: 0.1,
			green: 0.1,
			blue: 0.1,
			delayStart: 0
		},
		// asura11 — phase 2
		{
			type: '3D',
			file: 'effect/asura11.tga',
			alphaMax: 1,
			attachedEntity: true,
			duration: 400,
			fadeOut: true,
			sizeStart: 150,
			sizeEnd: 250,
			posx: -8.0,
			posy: 0,
			posz: 4,
			overlay: true,
			red: 0.1,
			green: 0.1,
			blue: 0.1,
			delayStart: 1200
		},
		// asura12 — phase 1
		{
			type: '3D',
			file: 'effect/asura12.tga',
			alphaMax: 1,
			attachedEntity: true,
			duration: 1200,
			duplicate: 3,
			timeBetweenDupli: 150,
			alphaMaxDelta: -0.25,
			fadeIn: true,
			sizeStart: 300,
			sizeEnd: 150,
			sizeSmooth: true,
			posx: -4.8,
			posy: 0,
			posz: 4,
			overlay: true,
			red: 0.1,
			green: 0.1,
			blue: 0.1,
			delayStart: 100
		},
		// asura12 — phase 2
		{
			type: '3D',
			file: 'effect/asura12.tga',
			alphaMax: 1,
			attachedEntity: true,
			duration: 400,
			fadeOut: true,
			sizeStart: 150,
			sizeEnd: 250,
			posx: -4.8,
			posy: 0,
			posz: 4,
			overlay: true,
			red: 0.1,
			green: 0.1,
			blue: 0.1,
			delayStart: 1300
		},
		// asura13 — phase 1
		{
			type: '3D',
			file: 'effect/asura13.tga',
			alphaMax: 1,
			attachedEntity: true,
			duration: 1200,
			duplicate: 3,
			timeBetweenDupli: 150,
			alphaMaxDelta: -0.25,
			fadeIn: true,
			sizeStart: 300,
			sizeEnd: 150,
			sizeSmooth: true,
			posx: -1.6,
			posy: 0,
			posz: 4,
			overlay: true,
			red: 0.1,
			green: 0.1,
			blue: 0.1,
			delayStart: 200
		},
		// asura13 — phase 2
		{
			type: '3D',
			file: 'effect/asura13.tga',
			alphaMax: 1,
			attachedEntity: true,
			duration: 400,
			fadeOut: true,
			sizeStart: 150,
			sizeEnd: 250,
			posx: -1.6,
			posy: 0,
			posz: 4,
			overlay: true,
			red: 0.1,
			green: 0.1,
			blue: 0.1,
			delayStart: 1400
		},
		// asura14 — phase 1
		{
			type: '3D',
			file: 'effect/asura14.tga',
			alphaMax: 1,
			attachedEntity: true,
			duration: 1200,
			duplicate: 3,
			timeBetweenDupli: 150,
			alphaMaxDelta: -0.25,
			fadeIn: true,
			sizeStart: 300,
			sizeEnd: 150,
			sizeSmooth: true,
			posx: 1.6,
			posy: 0,
			posz: 4,
			overlay: true,
			red: 0.1,
			green: 0.1,
			blue: 0.1,
			delayStart: 300
		},
		// asura14 — phase 2
		{
			type: '3D',
			file: 'effect/asura14.tga',
			alphaMax: 1,
			attachedEntity: true,
			duration: 400,
			fadeOut: true,
			sizeStart: 150,
			sizeEnd: 250,
			posx: 1.6,
			posy: 0,
			posz: 4,
			overlay: true,
			red: 0.1,
			green: 0.1,
			blue: 0.1,
			delayStart: 1500
		},
		// asura15 — phase 1
		{
			type: '3D',
			file: 'effect/asura15.tga',
			alphaMax: 1,
			attachedEntity: true,
			duration: 1200,
			duplicate: 3,
			timeBetweenDupli: 150,
			alphaMaxDelta: -0.25,
			fadeIn: true,
			sizeStart: 300,
			sizeEnd: 150,
			sizeSmooth: true,
			posx: 4.8,
			posy: 0,
			posz: 4,
			overlay: true,
			red: 0.1,
			green: 0.1,
			blue: 0.1,
			delayStart: 400
		},
		// asura15 — phase 2
		{
			type: '3D',
			file: 'effect/asura15.tga',
			alphaMax: 1,
			attachedEntity: true,
			duration: 400,
			fadeOut: true,
			sizeStart: 150,
			sizeEnd: 250,
			posx: 4.8,
			posy: 0,
			posz: 4,
			overlay: true,
			red: 0.1,
			green: 0.1,
			blue: 0.1,
			delayStart: 1600
		},
		// asura16 — phase 1
		{
			type: '3D',
			file: 'effect/asura16.tga',
			alphaMax: 1,
			attachedEntity: true,
			duration: 1200,
			duplicate: 3,
			timeBetweenDupli: 150,
			alphaMaxDelta: -0.25,
			fadeIn: true,
			sizeStart: 300,
			sizeEnd: 150,
			sizeSmooth: true,
			posx: 8.0,
			posy: 0,
			posz: 4,
			overlay: true,
			red: 0.1,
			green: 0.1,
			blue: 0.1,
			delayStart: 500
		},
		// asura16 — phase 2
		{
			type: '3D',
			file: 'effect/asura16.tga',
			alphaMax: 1,
			attachedEntity: true,
			duration: 400,
			fadeOut: true,
			sizeStart: 150,
			sizeEnd: 250,
			posx: 8.0,
			posy: 0,
			posz: 4,
			overlay: true,
			red: 0.1,
			green: 0.1,
			blue: 0.1,
			delayStart: 1700
		}
	],
	//511: [{}],	//EF_NIGHT	   (Nothing)

	512: [
		{
			//EF_CHEMICAL2DASH	   Chain Crush Combo
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const start = Params.Inst.startTick + 132;
				Camera.setQuake(start);
			}
		}
	],

	513: [
		{
			//EF_GROUNDSAMPLE	   Area Cast
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				this.add(
					new MagicTarget(
						Params.Init.skillId,
						Params.Init.position[0],
						Params.Init.position[1],
						Params.Inst.endTick,
						Params.Init.otherEntity,
						Params.Inst.startTick
					),
					Params
				);
			}
		}
	],

	//514: [{}],	//EF_GI_EXPLOSION	   Really Big Circle

	515: [
		{
			//EF_CLOUD4	   Airplane Cloud
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				CloudWeatherEffect.startOrRestart(Params);
			}
		}
	],

	516: [
		{
			//EF_CLOUD5	   Thanathos Cloud
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				CloudWeatherEffect.startOrRestart(Params);
			}
		}
	],

	517: [
		{
			//EF_BOTTOM_HERMODE	   (Nothing)
		}
	],

	'517_music': [
		{
			wav: 'effect/\xc7\xec\xb8\xa3\xb8\xf0\xb5\xe5\xc0\xc7\x20\xc1\xf6\xc6\xce\xc0\xcc',
			attachedEntity: true
		}
	],

	// Longing for Freedom's use sound (the official client plays it with the white cone 843)
	ef_longing_freedom_sound: [
		{
			wav: 'effect/ac_concentration',
			attachedEntity: true
		}
	],

	// Tarot Card of Fate's use sound
	ef_tarot_card_sound: [
		{
			wav: 'effect/priest_slowpoison',
			attachedEntity: true
		}
	],

	//518: [{}],	//EF_CARTTER	   Cart Termination

	519: [
		{
			//speed potion	//EF_ITEMFAST	Speed Down Potion
			type: 'SPR',
			file: 'fast',
			wav: 'effect/fast',
			attachedEntity: true
		}
	],

	// EF_SHIELDBOOMERANG3, Rapid Smiting: the client's five shields through the target (RapidSmitingEffect.js)
	520: rapidSmitingEffect,

	//521: [{}],	//EF_DOUBLECASTBODY	   Player Become Red with Red Aura

	'522_ground': [
		{
			// Gravitation field
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const self = this;
				GravityEffects.forEach(function (effect) {
					self.add(new effect(Params.Inst.position, Params.Inst.startTick), Params);
				});
			}
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

	523: [
		{
			alphaMax: 1,
			attachedEntity: true,
			duration: 3000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 70,
			sizeSmooth: true,
			sizeStart: 100,
			type: '3D',
			wav: 'effect/priest_slowpoison',
			zIndex: 10,
			file: 'effect/tarot01.tga'
		}
	], //EF_TAROTCARD1	   Tarot Card of Fate (The Fool)
	524: [
		{
			alphaMax: 1,
			attachedEntity: true,
			duration: 3000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 70,
			sizeSmooth: true,
			sizeStart: 100,
			type: '3D',
			wav: 'effect/priest_slowpoison',
			zIndex: 10,
			file: 'effect/tarot02.tga'
		}
	], //EF_TAROTCARD2	   Tarot Card of Fate (The Magician)
	525: [
		{
			alphaMax: 1,
			attachedEntity: true,
			duration: 3000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 70,
			sizeSmooth: true,
			sizeStart: 100,
			type: '3D',
			wav: 'effect/priest_slowpoison',
			zIndex: 10,
			file: 'effect/tarot03.tga'
		}
	], //EF_TAROTCARD3	   Tarot Card of Fate (The High Priestess)
	526: [
		{
			alphaMax: 1,
			attachedEntity: true,
			duration: 3000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 70,
			sizeSmooth: true,
			sizeStart: 100,
			type: '3D',
			wav: 'effect/priest_slowpoison',
			zIndex: 10,
			file: 'effect/tarot04.tga'
		}
	], //EF_TAROTCARD4	   Tarot Card of Fate (The Chariot)
	527: [
		{
			alphaMax: 1,
			attachedEntity: true,
			duration: 3000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 70,
			sizeSmooth: true,
			sizeStart: 100,
			type: '3D',
			wav: 'effect/priest_slowpoison',
			zIndex: 10,
			file: 'effect/tarot05.tga'
		}
	], //EF_TAROTCARD5	   Tarot Card of Fate (Strength)
	528: [
		{
			alphaMax: 1,
			attachedEntity: true,
			duration: 3000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 70,
			sizeSmooth: true,
			sizeStart: 100,
			type: '3D',
			wav: 'effect/priest_slowpoison',
			zIndex: 10,
			file: 'effect/tarot06.tga'
		}
	], //EF_TAROTCARD6	   Tarot Card of Fate (The Lovers)
	529: [
		{
			alphaMax: 1,
			attachedEntity: true,
			duration: 3000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 70,
			sizeSmooth: true,
			sizeStart: 100,
			type: '3D',
			wav: 'effect/priest_slowpoison',
			zIndex: 10,
			file: 'effect/tarot07.tga'
		}
	], //EF_TAROTCARD7	   Tarot Card of Fate (The Wheel of Fortune)
	530: [
		{
			alphaMax: 1,
			attachedEntity: true,
			duration: 3000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 70,
			sizeSmooth: true,
			sizeStart: 100,
			type: '3D',
			wav: 'effect/priest_slowpoison',
			zIndex: 10,
			file: 'effect/tarot08.tga'
		}
	], //EF_TAROTCARD8	   Tarot Card of Fate (The Hanged Man)
	531: [
		{
			alphaMax: 1,
			attachedEntity: true,
			duration: 3000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 70,
			sizeSmooth: true,
			sizeStart: 100,
			type: '3D',
			wav: 'effect/priest_slowpoison',
			zIndex: 10,
			file: 'effect/tarot09.tga'
		}
	], //EF_TAROTCARD9	   Tarot Card of Fate (Death)
	532: [
		{
			alphaMax: 1,
			attachedEntity: true,
			duration: 3000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 70,
			sizeSmooth: true,
			sizeStart: 100,
			type: '3D',
			wav: 'effect/priest_slowpoison',
			zIndex: 10,
			file: 'effect/tarot10.tga'
		}
	], //EF_TAROTCARD10	   Tarot Card of Fate (Temperance)
	533: [
		{
			alphaMax: 1,
			attachedEntity: true,
			duration: 3000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 70,
			sizeSmooth: true,
			sizeStart: 100,
			type: '3D',
			wav: 'effect/priest_slowpoison',
			zIndex: 10,
			file: 'effect/tarot11.tga'
		}
	], //EF_TAROTCARD11	   Tarot Card of Fate (The Devil)
	534: [
		{
			alphaMax: 1,
			attachedEntity: true,
			duration: 3000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 70,
			sizeSmooth: true,
			sizeStart: 100,
			type: '3D',
			wav: 'effect/priest_slowpoison',
			zIndex: 10,
			file: 'effect/tarot12.tga'
		}
	], //EF_TAROTCARD12	   Tarot Card of Fate (The Tower)
	535: [
		{
			alphaMax: 1,
			attachedEntity: true,
			duration: 3000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 70,
			sizeSmooth: true,
			sizeStart: 100,
			type: '3D',
			wav: 'effect/priest_slowpoison',
			zIndex: 10,
			file: 'effect/tarot13.tga'
		}
	], //EF_TAROTCARD13	   Tarot Card of Fate (The Star)
	536: [
		{
			alphaMax: 1,
			attachedEntity: true,
			duration: 3000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 70,
			sizeSmooth: true,
			sizeStart: 100,
			type: '3D',
			wav: 'effect/priest_slowpoison',
			zIndex: 10,
			file: 'effect/tarot14.tga'
		}
	], //EF_TAROTCARD14	   Tarot Card of Fate (The Sun)

	537: [
		{
			//EF_ACIDDEMON	   Acid Demonstration
			// Official client: at the target's cell as each damage packet arrives. EF_FireWall.wav on tick 0,
			// four dark violet rings of ring_black.tga rising round the cell (AcidDemonRingSim.js), and the
			// screen quake on tick 5. See effect-port/creator-skills.md.
			type: 'FUNC',
			attachedEntity: false,
			// The rings' visible life (alpha 0 from tick 45), so a culled copy off screen still expires
			duration: RING_FRAMES * RING_TICK_MS,
			wav: 'effect/ef_firewall',
			func: function (Params) {
				this.add(new AcidDemonRing(Params.Inst.position, Params.Inst.startTick), Params);
				Camera.setQuake(Params.Inst.startTick + 5 * (1000 / 60));
			}
		}
	],

	538: [
		{
			//EF_GREENBODY	   Player Become Green with Green Aura (Refresh, Abundance, Phantom Thrust)
			// As 500 in green: a glow copy round the actor on ticks 0-30, and the actor flickers green (added) on
			// even ticks and white on odd ones (CasterMarks.js). Life 120 ticks. See effect-port/rune-knight-skills.md.
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				this.add(new CasterMarks(Params.Init.ownerEntity, Params.Inst.startTick, 120, 538), Params);
			}
		}
	],
	//539: [{}],	//EF_THROWITEM4	   Throw Random Bottle
	//540: [{}],	//EF_BABYBODY_BACK	   Instant Small->Normal
	// EF_THROWITEM5, Aid Berserk Potion: the client's thrown bottle (ThrowStoneEffect.js)
	541: berserkPotionThrowEffect,
	// 542 EF_BLUEBODY (Kaupe, Kaite): SoulBodyEffects.js.

	// 543 EF_HATED (Kaahi, Kaizel, Comfort, Hatred): SoulBodyEffects.js. No sound of its own.

	//544: [{}],	//EF_REDLIGHTBODY	   Warmth Red Sprite
	//545: [{}],	//EF_RO2YEAR	   Sound And... PUFF Client Crash :P
	// 546 EF_SMA_READY, blue sparks when a combo is ready: SoulBodyEffects.js.

	547: [
		{
			//EF_STIN	   Estin
			// The official client plays T_바람마법.wav on tick 10 (167 ms), on the caster.
			wav: 'effect/t_\xb9\xd9\xb6\xf7\xb8\xb6\xb9\xfd',
			delayWav: 10 * (1000 / 60),
			attachedEntity: true
		}
	],

	//548: [{}],	//EF_RED_HIT	   Instant Red Sprite
	//549: [{}],	//EF_BLUE_HIT	   Instant Blue Sprite
	//550: [{}],	//EF_QUAKEBODY3	   Another Effect like Running Hit
	// EF_SMA: a point toward the target leaving blue swirls (SmaBlackEffect.js)
	551: smaEffect,

	// EF_SMA2: one blue swirl (SmaBlackEffect.js)
	552: sma2Effect,

	553: [
		{
			//EF_STIN2	   Esma
			// The official client plays T_날라차기.wav on ticks 5, 20, 35, 50 and 65, on the caster.
			// Its 270바람.tga wind parts are not drawn yet.
			duplicate: 5,
			timeBetweenDupli: 15 * (1000 / 60),
			wav: 'effect/t_\xb3\xaf\xb6\xf3\xc2\xf7\xb1\xe2',
			delayWav: 5 * (1000 / 60),
			attachedEntity: true
		}
	],

	//554: [{}],	//EF_HITTEXTURE	   Large White Cloud

	555: [
		{
			//EF_STIN3	   Estun
			// The official client plays T_에너지방출.wav at once, on the caster.
			wav: 'effect/t_\xbf\xa1\xb3\xca\xc1\xf6\xb9\xe6\xc3\xe2',
			attachedEntity: true
		}
	],

	//556: [{}],	//EF_SMA3	   (Nothing)
	//557: [{}],	//EF_BLUEFALL	   Juperos Energy Waterfall (Horizontal)
	//558: [{}],	//EF_BLUEFALL_90	   Juperos Energy Waterfall (Vertical)
	//559: [{}],	//EF_FASTBLUEFALL	   Juperos Energy Waterfall Fast (Horizontal)
	//560: [{}],	//EF_FASTBLUEFALL_90	   Juperos Energy Waterfall Fast (Vertical)
	//561: [{}],	//EF_BIG_PORTAL	   Juperos Warp
	//562: [{}],	//EF_BIG_PORTAL2	   Juperos Warp

	563: [
		{
			//EF_SCREEN_QUAKE	   Earthquake Effect (Juperos Elevator)
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const start = Params.Inst.startTick;
				const duration = 200;
				Camera.setQuake(start, duration);
			}
		}
	],

	//564: [{}],	//EF_HOMUNCASTING	   Wedding Cast

	565: [
		{
			//EF_HFLIMOON1	Filir Moonlight Lvl 1
			type: 'STR',
			file: 'moonlight_1',
			wav: 'effect/h_moonlight_1',
			attachedEntity: true
		}
	],

	566: [
		{
			//EF_HFLIMOON2	Filir Moonlight Lvl 2
			type: 'STR',
			file: 'moonlight_2',
			wav: 'effect/h_moonlight_2',
			attachedEntity: true
		}
	],

	567: [
		{
			//EF_HFLIMOON3	Filir Moonlight Lvl 3
			type: 'STR',
			file: 'moonlight_3',
			wav: 'effect/h_moonlight_3',
			attachedEntity: true
		}
	],

	568: [
		{
			//homun?	//EF_HO_UP	Another Job Level Up
			type: 'STR',
			file: 'h_levelup',
			attachedEntity: true
		}
	],

	569: [
		{
			//EF_HAMIDEFENCE	Amistr Bulwark
			type: 'STR',
			file: 'defense',
			attachedEntity: true
		}
	],

	570: [
		{
			//EF_HAMICASTLE	Amistr Castling
			type: 'SPR',
			file: '\xc4\xb3\xbd\xbd\xb8\xb5',
			attachedEntity: true
		}
	],

	571: [
		{
			//EF_HAMIBLOOD	Amistr Bloodlust
			type: 'SPR',
			file: '\xba\xed\xb7\xaf\xb5\xe5\xb7\xaf\xbd\xba\xc6\xae',
			attachedEntity: true
		}
	],

	572: [
		{
			//EF_HATED2	   Warmth Soul
			// The official client plays T_따듯한마법.wav on tick 10 (167 ms). Its pok1 / pok3 sparks
			// (primitive 59) are not drawn yet.
			wav: 'effect/t_\xb5\xfb\xb5\xed\xc7\xd1\xb8\xb6\xb9\xfd',
			delayWav: 10 * (1000 / 60),
			attachedEntity: true
		}
	],
	//573: [{}],	//EF_TWILIGHT1	   Twilight Alchemy 1
	//574: [{}],	//EF_TWILIGHT2	   Twilight Alchemy 2
	//575: [{}],	//EF_TWILIGHT3	   Twilight Alchemy 3

	576: [
		{
			//EF_ITEM_THUNDER	Box Effect (Thunder)
			type: 'SPR',
			file: 'item_thunder',
			attachedEntity: true
		}
	],

	577: [
		{
			//EF_ITEM_CLOUD	Box Effect (Cloud)
			type: 'SPR',
			file: 'item_cloud',
			attachedEntity: true
		}
	],

	578: [
		{
			//EF_ITEM_CURSE	Box Effect (Curse)
			type: 'SPR',
			file: 'item_curse',
			attachedEntity: true
		}
	],

	579: [
		{
			//EF_ITEM_ZZZ	Box Effect (Sleep)
			type: 'SPR',
			file: 'item_zzz',
			wav: '_snore',
			attachedEntity: true
		}
	],

	580: [
		{
			//EF_ITEM_RAIN	Box Effect (Rain)
			type: 'SPR',
			file: 'item_rain',
			attachedEntity: true
		}
	],

	//581: [{}],	//EF_ITEM_LIGHT	   Box Effect (Sunlight)
	//582: [{}],	//EF_ANGEL3	   Another Super Novice/Taekwon Angel

	583: [
		{
			//EF_M01	Warmth Hit
			type: 'SPR',
			file: 'm_ef01',
			attachedEntity: true
		}
	],

	584: [
		{
			//EF_M02	Full Buster. Official client: sprite from tick 0 at 4 ticks a frame, sound on tick 5.
			type: 'SPR',
			file: 'm_ef02',
			wav: 'effect/\xc7\xae\xb9\xf6\xbd\xba\xc5\xcd', // 풀버스터
			delayWav: 83, // tick 5
			delayFrame: 67, // 4 ticks
			attachedEntity: true,
			direction: true
		}
	],

	585: [
		{
			//EF_M03	5 Medium Size Explosion
			type: 'SPR',
			file: 'm_ef03',
			attachedEntity: true
		}
	],

	586: [
		{
			//EF_M04	Somatology Lab Mobs Aura
			type: 'SPR',
			file: 'm_ef04',
			attachedEntity: true
		}
	],

	587: [
		{
			//EF_M05	Big Purple Flame
			type: 'SPR',
			file: 'm_ef05',
			wav: 'dragon_breath',
			attachedEntity: true
		}
	],

	588: [
		{
			//EF_M06	Little Red Flame
			type: 'SPR',
			file: 'm_ef06',
			attachedEntity: true
		}
	],

	589: [
		{
			//EF_M07	Eswoo
			// No sound: the official client plays Eswoo's T_슈웃.wav from the use packet.
			type: 'SPR',
			file: 'm_ef07',
			attachedEntity: true
		}
	],

	//590: [{}],	//EF_KAIZEL	   Kaizel: two parts on tick 15, not drawn yet; no sound of its own

	//591: [{}],	//EF_KAAHI	   (Nothing)

	592: [
		{
			//EF_CLOUD6
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				CloudWeatherEffect.startOrRestart(Params);
			}
		}
	],

	593: [
		{
			//EF_FOOD01	Food Effect (STR)
			type: 'STR',
			file: 'food_str',
			attachedEntity: true
		}
	],

	594: [
		{
			//EF_FOOD02	Food Effect (INT)
			type: 'STR',
			file: 'food_int',
			attachedEntity: true
		}
	],

	595: [
		{
			//EF_FOOD03	Food Effect (VIT)
			type: 'STR',
			file: 'food_vit',
			attachedEntity: true
		}
	],

	596: [
		{
			//EF_FOOD04	Food Effect (AGI)
			type: 'STR',
			file: 'food_agi',
			attachedEntity: true
		}
	],

	597: [
		{
			//EF_FOOD05	Food Effect (DEX)
			type: 'STR',
			file: 'food_dex',
			attachedEntity: true
		}
	],

	598: [
		{
			//EF_FOOD06	Food Effect (LUK)
			type: 'STR',
			file: 'food_luk',
			attachedEntity: true
		}
	],

	// Star Burst's mark on its target (EFST_STAR_BURST), as the official client draws it:
	// a burst every 250 ms while the status lasts, cycling the four galaxy files, each
	// with the ground ring and the Star Cannon sound. Each STR plays once (70 or 79 keys
	// at 60 fps), so the next burst starts before the last one ends: duration + a negative
	// repeatDelay keep the 1000 ms (galaxy) and 250 ms (ground) cadence. 13.5 units up.
	ef_efst_star_burst: [
		{
			type: 'STR',
			file: 'sky_emperor/ske_twinkling_galaxy/twinkling_galaxy/ske_twinkling_galaxy00',
			texturePath: 'sky_emperor/ske_twinkling_galaxy/twinkling_galaxy/',
			min: 'sky_emperor/ske_twinkling_galaxy/twinkling_galaxy/min_ske_twinkling_galaxy00',
			attachedEntity: true,
			yOffset: 13.5,
			duration: 1167,
			repeatDelay: -167
		},
		{
			type: 'STR',
			file: 'sky_emperor/ske_twinkling_galaxy/twinkling_galaxy/ske_twinkling_galaxy01',
			texturePath: 'sky_emperor/ske_twinkling_galaxy/twinkling_galaxy/',
			min: 'sky_emperor/ske_twinkling_galaxy/twinkling_galaxy/min_ske_twinkling_galaxy01',
			attachedEntity: true,
			yOffset: 13.5,
			delayStart: 250,
			duration: 1167,
			repeatDelay: -167
		},
		{
			type: 'STR',
			file: 'sky_emperor/ske_twinkling_galaxy/twinkling_galaxy/ske_twinkling_galaxy02',
			texturePath: 'sky_emperor/ske_twinkling_galaxy/twinkling_galaxy/',
			min: 'sky_emperor/ske_twinkling_galaxy/twinkling_galaxy/min_ske_twinkling_galaxy02',
			attachedEntity: true,
			yOffset: 13.5,
			delayStart: 500,
			duration: 1167,
			repeatDelay: -167
		},
		{
			type: 'STR',
			file: 'sky_emperor/ske_twinkling_galaxy/twinkling_galaxy/ske_twinkling_galaxy03',
			texturePath: 'sky_emperor/ske_twinkling_galaxy/twinkling_galaxy/',
			min: 'sky_emperor/ske_twinkling_galaxy/twinkling_galaxy/min_ske_twinkling_galaxy03',
			attachedEntity: true,
			yOffset: 13.5,
			delayStart: 750,
			duration: 1167,
			repeatDelay: -167
		},
		{
			type: 'STR',
			file: 'sky_emperor/ske_twinkling_galaxy/twinkling_galaxy_bottom/ske_twinkling_galaxy_bottom',
			texturePath: 'sky_emperor/ske_twinkling_galaxy/twinkling_galaxy_bottom/',
			min: 'sky_emperor/ske_twinkling_galaxy/twinkling_galaxy_bottom/min_ske_twinkling_galaxy_bottom',
			wav: 'effect/sky_emperor/ske_star_cannon',
			attachedEntity: true,
			renderBeforeEntities: true,
			yOffset: 13.5,
			duration: 1317,
			repeatDelay: -1067
		}
	],

	599: [
		{
			//EF_SHRINK	   Cast Time Sound and Flashing Animation on Player
			// Shrink (official client): EF_BeginSpell.wav on tick 5, then to tick 25 the
			// Crusader flickers yellow (drawn adding light) and white each tick (CasterMarks.js).
			type: 'FUNC',
			attachedEntity: true,
			wav: 'effect/ef_beginspell',
			delayWav: 5 * (1000 / 60),
			func: function (Params) {
				this.add(new CasterMarks(Params.Init.ownerEntity, Params.Inst.startTick, 26, 599), Params);
			}
		}
	]
};
