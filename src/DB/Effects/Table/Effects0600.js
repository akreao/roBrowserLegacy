/**
 * @module DB/Effects/Table/Effects0600
 *
 * Effects 600 to 699 of the effect table. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep rows in effect ID order.
 */

import Camera from 'Renderer/Camera.js';
import SightBlasterEffect from 'DB/Effects/SightBlasterEffect.js';
import CloseConfineEffect from 'DB/Effects/CloseConfineEffect.js';
import SongEffects from 'Renderer/Effects/Songs.js';
import CloudWeatherEffect from 'Renderer/Effects/CloudWeatherEffect.js';
import SpiritSphere from 'Renderer/Effects/SpiritSphere.js';
import { ninjaThrowEffects, throwVenomKnifeEffect } from 'DB/Effects/ThrowStoneEffect.js';
import StreakLines from 'Renderer/Effects/StreakLines.js';

/** Textures of the 2025 streak builder's variants (0xbdf6e0). */
const STREAK_LINE3 = { line3: 'line3.tga', line3y: 'line3y.tga' };
const EvillandEffects = SongEffects.EvillandEffects;

export default {
	600: [
		// EF_THROWITEM6: Throw Venom Knife's knife, the Throw Stone flight with the knife's numbers (ThrowStoneEffect.js)
		...throwVenomKnifeEffect
	],

	// 601 EF_SIGHT2, Sight Blaster's ring of Sight sprites: SightBlasterEffect.js.
	//602: [{}],	//EF_QUAKEBODY4	   Close Confine (Grab Effect)

	603: [
		{
			//EF_FIREHIT2	Spinning fire ball (like 50, but smaller)
			type: 'STR',
			file: 'firehit%d',
			rand: [1, 3],
			attachedEntity: true
		}
	],

	604: [
		{
			//EF_NPC_STOP2	Close Confine, on both actors while the status is on (StatusEffectTable):
			// silent, 12 ticks a frame, stays on its last frame
			type: 'SPR',
			file: 'cconfine',
			attachedEntity: true,
			delayFrame: 200,
			stopAtEnd: true
		}
	],

	//605: [{}],	//EF_NPC_STOP2_DEL	   (Nothing)

	606: [
		{
			//EF_FVOICE	   Pang Voice (Visual Effect)
			type: 'SPR',
			file: 'fvoice',
			wav: 'amon_ra_die01'
		}
	],

	607: [
		{
			//EF_WINK	   Wink of Charm (Visual Effect)
			type: 'SPR',
			file: 'wink'
		}
	],

	608: [
		{
			//EF_COOKING_OK	Cooking Success
			type: 'STR',
			file: 'cook_suc',
			wav: '_heal_effect',
			attachedEntity: true
		}
	],

	609: [
		{
			//EF_COOKING_FAIL	Cooking Failed
			type: 'STR',
			file: 'cook_fail',
			wav: 'caramel_die',
			attachedEntity: true
		}
	],

	//610: [{ file: 'effect/success.bmp' }],	//EF_TEMP_OK	   Success
	//611: [{ file: 'effect/failed.bmp' }],	//EF_TEMP_FAIL	   Failed

	612: [
		{
			//EF_HAPGYEOK	Korean Words and /no1 Emoticon
			type: 'SPR',
			file: '\xc7\xd5\xb0\xdd\x5f',
			attachedEntity: true
		},
		{
			type: 'STR',
			file: 'itempokjuk',
			wav: 'effect/itempokjuk',
			attachedEntity: true
		}
	],

	// EF_THROWITEM7, Throw Shuriken: the client's thrown item with its trail (ThrowStoneEffect.js)
	613: ninjaThrowEffects[613],

	// EF_THROWITEM8, Throw Kunai: the client's thrown item with its trail (ThrowStoneEffect.js)
	614: ninjaThrowEffects[614],

	// EF_THROWITEM9, Throw Huuma Shuriken: the client's thrown item with its trail (ThrowStoneEffect.js)
	615: ninjaThrowEffects[615],

	// EF_THROWITEM10, Throw Zeny: the client's thrown item with its trail (ThrowStoneEffect.js)
	616: ninjaThrowEffects[616],

	//617: [{}],	//EF_BUNSINJYUTSU	   Illusionary Shadow

	618: [
		// EF_KOUENKA	Flaming Petals: official effect 618 (effect-port/ninja-skills.md), on the
		// target as the damage packet arrives: EF_FireArrow1-3.wav (random each) on ticks 12-15.
		// No STR; the fire hit is the skill's hit effect 49. Not ported: the sakura01 petal
		// sprites (prim 124) and the alpha_center rings (prim 89).
		{
			wav: 'effect/ef_firearrow%d',
			rand: [1, 3],
			delayWav: 12 * (1000 / 60)
		},
		{
			wav: 'effect/ef_firearrow%d',
			rand: [1, 3],
			delayWav: 13 * (1000 / 60)
		},
		{
			wav: 'effect/ef_firearrow%d',
			rand: [1, 3],
			delayWav: 14 * (1000 / 60)
		},
		{
			wav: 'effect/ef_firearrow%d',
			rand: [1, 3],
			delayWav: 15 * (1000 / 60)
		}
	],

	619: [
		// EF_HYOUSENSOU	Freezing Spear: official effect 619 (effect-port/ninja-skills.md), on the
		// target as the damage packet arrives. The client draws it with Earth Spike's code (79):
		// the same spikes and camera shake, in effect/ice.tga, with one EF_IceArrow1-3.wav;
		// its spikes live 240 ticks. So these are 79's rows with the ice texture. No STR.
		{
			//Main spike
			type: 'QuadHorn',
			textureFile: 'effect/ice.tga',
			attachedEntity: false,
			duration: 4000,
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
			textureFile: 'effect/ice.tga',
			attachedEntity: false,
			duration: 4000,
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
			textureFile: 'effect/ice.tga',
			attachedEntity: false,
			duration: 4000,
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
			textureFile: 'effect/ice.tga',
			attachedEntity: false,
			duration: 4000,
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
			textureFile: 'effect/ice.tga',
			attachedEntity: false,
			duration: 4000,
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
			wav: 'effect/ef_icearrow%d',
			rand: [1, 3],
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

	//620: [{}],	//EF_BOTTOM_SUITON	   Water Escape Technique

	621: [
		{
			//EF_STIN4	Wind Blade: official effect 621 (effect-port/ninja-skills.md), on the caster as
			// the damage packet arrives: 풍인.wav at the start. Not ported: one set of 270바람.tga
			// blades (prim 125) per hit, flying at the target.
			wav: 'effect/\xc7\xb3\xc0\xce'
		}
	],

	622: [
		{
			//EF_THUNDERSTORM2	Lightning Jolt: official effect 622 (effect-port/ninja-skills.md)
			// The 썬더스톰 sprite (no STR), action 0, 2 ticks a frame, once, 2.5 times its size,
			// 4.5 units (31 px) up; EF_ThunderStorm.wav at the start.
			type: 'SPR',
			file: '\xbd\xe3\xb4\xf5\xbd\xba\xc5\xe8',
			wav: 'effect/ef_thunderstorm',
			delayFrame: 2 * (1000 / 60),
			scale: 2.5,
			yOffset: -31
		}
	],

	623: [
		{
			//EF_CHEMICAL4	Piercing Shot. Official client: the sound on tick 28. See effect-port/gunslinger-skills.md.
			wav: 'effect/\xc7\xc7\xbe\xee\xbd\xcc\xbc\xa6', // 피어싱샷
			delayWav: 467, // tick 28
			attachedEntity: true
		},
		{
			// On tick 0, 8 green streak sets along the shot: the 2025 builder 0xbdf6e0 with variants 20 and 21,
			// four times (StreakLinesSim.createVariantSets).
			type: 'FUNC',
			func: function (Params) {
				const caster = Params.Init.ownerEntity;
				const target = Params.Init.otherEntity;
				if (!caster || !target || target === caster) {
					return;
				}
				this.add(
					new StreakLines(caster.position, target.position, Params.Inst.startTick, STREAK_LINE3, [
						20, 21, 20, 21, 20, 21, 20, 21
					]),
					Params
				);
			}
		}
	],
	624: [
		{
			//EF_STIN5	First Wind: official effect 624 (effect-port/ninja-skills.md), on the caster as
			// the damage packet arrives, aimed at the target: t_바람방출.wav on tick 1. Not ported:
			// the 270바람.tga wind (prim 126) on ticks 0-4.
			wav: 'effect/t_\xb9\xd9\xb6\xf7\xb9\xe6\xc3\xe2',
			delayWav: 1000 / 60
		}
	],
	//625: [{}],	//EF_MADNESS_BLUE	   Madness Canceller
	//626: [{}],	//EF_MADNESS_RED	   Adjustment

	627: [
		{
			//EF_RG_COIN3	   Disarm. Official client: the sound on tick 21; also two thrown item
			// icons (prim 43), not ported. See effect-port/gunslinger-skills.md.
			wav: 'effect/\xb5\xf0\xbd\xba\xbe\xcf', // 디스암
			delayWav: 350, // tick 21
			attachedEntity: true
		}
	],

	628: [
		{
			//dust	//EF_BASH3D5	   Dust. Official client: effect\더스트샷.wav on tick 0, then six alpha_center sets.
			wav: 'effect/\xb4\xf5\xbd\xba\xc6\xae\xbc\xa6', // 더스트샷
			attachedEntity: true
		},
		{
			type: 'CYLINDER',
			textureName: 'alpha_center',
			alphaMax: 0.6,
			duration: 175,
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

	629: [
		{
			//EF_CHOOKGI3	   (Nothing) - Used for spirit spheres (gunslinger classes)
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const spiritNum = Params.Init.spiritNum || 0;
				const Spheres = new SpiritSphere(Params.Init.ownerEntity, spiritNum, true);
				this.add(Spheres, Params);
			}
		}
	],

	630: [
		{
			//EF_KIRIKAGE	Shadow Slash: official effect 630 (effect-port/ninja-skills.md)
			// 그림자베기 action 0 or 4 at random, 4 ticks a frame, once; its sound at the start.
			type: 'SPR',
			file: '\xb1\xd7\xb8\xb2\xc0\xda\xba\xa3\xb1\xe2',
			wav: 'effect/\xb1\xd7\xb8\xb2\xc0\xda\xba\xa3\xb1\xe2',
			frame: [0, 4],
			delayFrame: 4 * (1000 / 60),
			attachedEntity: true
		}
	],

	631: [
		{
			//EF_TATAMI	Flip Tatami unit: official effect 631 (effect-port/ninja-skills.md)
			// 다다미 (not 다다미 뒤집기) action 0, 6 ticks a frame, once, 6 units (42 px) up, on
			// each unit. No sound here: the skill's use packet plays it (ef_flip_tatami_sound).
			type: 'SPR',
			file: '\xb4\xd9\xb4\xd9\xb9\xcc',
			delayFrame: 6 * (1000 / 60),
			yOffset: -42,
			repeat: false,
			attachedEntity: true
		}
	],

	// Flip Tatami (NJ_TATAMIGAESHI): the official client plays 다다미뒤집기.wav when the skill works.
	ef_flip_tatami_sound: [
		{
			wav: 'effect/\xb4\xd9\xb4\xd9\xb9\xcc\xb5\xda\xc1\xfd\xb1\xe2'
		}
	],

	632: [
		{
			//EF_KASUMIKIRI	Haze Slasher: official effect 632 (effect-port/ninja-skills.md)
			// 안개베기 action 0 or 2 at random, 4 ticks a frame, once; its sound at the start.
			type: 'SPR',
			file: '\xbe\xc8\xb0\xb3\xba\xa3\xb1\xe2',
			wav: 'effect/\xbe\xc8\xb0\xb3\xba\xa3\xb1\xe2',
			frame: [0, 2],
			delayFrame: 4 * (1000 / 60),
			attachedEntity: true
		}
	],

	633: [
		{
			//EF_ISSEN	Final Strike: official effect 633 (effect-port/ninja-skills.md)
			// 일섬 action 0, 2 ticks a frame, once, 6 units (42 px) up; its sound at the start.
			type: 'SPR',
			file: '\xc0\xcf\xbc\xb6',
			wav: 'effect/\xc0\xcf\xbc\xb6',
			delayFrame: 2 * (1000 / 60),
			yOffset: -42,
			attachedEntity: true
		}
	],

	634: [
		{
			//EF_KAEN	Blaze Shield unit: official effect 634 (effect-port/ninja-skills.md)
			// 화염진 action 0, looping while the unit stands, 1 unit (7 px) up. The client relaunches
			// it every 23 ticks at 3-7 ticks a frame (random); drawn here at the mean, 5 ticks.
			type: 'SPR',
			file: '\xc8\xad\xbf\xb0\xc1\xf8',
			delayFrame: 5 * (1000 / 60),
			yOffset: -7,
			repeat: true,
			attachedEntity: true
		},
		{
			// The client plays 화염진.wav when a unit appears, 1 time in 8.
			wav: 'effect/\xc8\xad\xbf\xb0\xc1\xf8',
			wavChance: 1 / 8
		}
	],

	635: [
		{
			//EF_BAKU	Dragon Fire Formation
			type: 'STR',
			file: 'fire dragon',
			wav: 'effect/\xc6\xf8\xbf\xb0\xb7\xe6',
			attachedEntity: false
		}
	],

	// Watery Evasion (NJ_SUITON): the official client plays 수둔.wav from the ground packet. The units'
	// water (620, EF_BOTTOM_SUITON: ring_blue.tga ripples, prim 36) is not ported yet.
	ef_watery_evasion_sound: [
		{
			wav: 'effect/\xbc\xf6\xb5\xd0'
		}
	],

	636: [
		{
			//EF_HYOUSYOURAKU	Falling Ice Pillar
			type: 'STR',
			file: 'icy',
			wav: 'effect/\xba\xf9\xc1\xa4\xb6\xf4',
			attachedEntity: false
		}
	],

	637: [
		{
			//EF_DESPERADO	Desperado. Official client: sprite from tick 0 at 4 ticks a frame, sound on tick 10.
			type: 'SPR',
			file: '\xb5\xa5\xbd\xba\xc6\xe4\xb6\xf3\xb5\xb5',
			wav: 'effect/\xb5\xa5\xbd\xba\xc6\xe4\xb6\xf3\xb5\xb5',
			delayWav: 167, // tick 10
			delayFrame: 67, // 4 ticks
			attachedEntity: true
		}
	],

	638: [
		{
			//EF_LIGHTNING_S	Ground Drift grenade. Official client: looping sprite on the unit.
			type: 'SPR',
			file: '\xb6\xf3\xc0\xcc\xc6\xae\xb4\xd7\xbd\xba\xc7\xc7\xbe\xee',
			attachedEntity: true
		}
	],

	639: [
		{
			//EF_BLIND_S	Ground Drift grenade. Official client: looping sprite on the unit.
			type: 'SPR',
			file: '\xba\xed\xb6\xf3\xc0\xce\xb5\xe5\xbd\xba\xc7\xc7\xbe\xee',
			attachedEntity: true
		}
	],

	640: [
		{
			//EF_POISON_S	Ground Drift grenade. Official client: looping sprite on the unit.
			type: 'SPR',
			file: '\xc6\xf7\xc0\xcc\xc1\xf0\xbd\xba\xc7\xc7\xbe\xee',
			attachedEntity: true
		}
	],

	641: [
		{
			//EF_FREEZING_S	Ground Drift grenade. Official client: looping sprite on the unit.
			type: 'SPR',
			file: '\xc7\xc1\xb8\xae\xc2\xa1\xbd\xba\xc7\xc7\xbe\xee',
			attachedEntity: true
		}
	],

	642: [
		{
			//EF_FLARE_S	Ground Drift grenade. Official client: looping sprite on the unit.
			type: 'SPR',
			file: '\xc7\xc3\xb7\xb9\xbe\xee\xbd\xba\xc7\xc7\xbe\xee',
			attachedEntity: true
		}
	],

	643: [
		{
			//EF_RAPIDSHOWER	Rapid Shower. Official client: sprite from tick 0 at 4 ticks a frame, sound on tick 20.
			type: 'SPR',
			file: '\xb7\xa1\xc7\xc7\xb5\xe5\xbb\xfe\xbf\xf6',
			wav: 'effect/\xb7\xa1\xc7\xc7\xb5\xe5\xbb\xfe\xbf\xf6',
			delayWav: 333, // tick 20
			delayFrame: 67, // 4 ticks
			attachedEntity: true
		}
	],

	644: [
		{
			//EF_MAGICALBULLET	Magic Bullet. Official client: sprite and sound on tick 0, 2 ticks a frame.
			type: 'SPR',
			file: '\xb8\xc5\xc1\xf6\xc4\xc3\xba\xd2\xb8\xb4',
			wav: 'effect/\xb8\xc5\xc1\xf6\xc4\xc3\xba\xed\xb8\xb4',
			delayFrame: 33, // 2 ticks
			attachedEntity: true
		}
	],

	645: [
		{
			//EF_SPREADATTACK	Spread Attack. Official client: sprite from tick 0 at 4 ticks a frame, no sound.
			type: 'SPR',
			file: '\xbd\xba\xc7\xc1\xb7\xb9\xb5\xe5',
			delayFrame: 67, // 4 ticks
			attachedEntity: true,
			direction: true
		}
	],

	646: [
		{
			//EF_TRACKCASTING	Tracking (Shown While Casting)
			type: 'STR',
			file: '\xc6\xae\xb7\xa2\xc5\xb7',
			attachedEntity: true
		}
	],

	647: [
		{
			//EF_TRACKING	Tracking. Official client: 2 ticks a frame, no sound.
			type: 'SPR',
			file: '\xc6\xae\xb7\xa1\xc5\xb7',
			delayFrame: 33, // 2 ticks
			attachedEntity: true
		}
	],

	648: [
		{
			//EF_TRIPLEACTION	Triple Action. Official client: the sound on tick 25, the sprite from
			// tick 30 at 2 ticks a frame. See effect-port/gunslinger-skills.md.
			wav: 'effect/\xc6\xae\xb8\xae\xc7\xc3\xbe\xd7\xbc\xc7', // 트리플액션
			delayWav: 417, // tick 25
			attachedEntity: true
		},
		{
			type: 'SPR',
			file: '\xc6\xae\xb8\xae\xc7\xc3\xbe\xd7\xbc\xc7',
			delayStart: 500, // tick 30
			delayFrame: 33, // 2 ticks
			attachedEntity: true
		}
	],

	649: [
		{
			//EF_BULLSEYE	Bull's Eye
			type: 'STR',
			file: '\xba\xd2\xbd\xba\xbe\xc6\xc0\xcc', //oO1o3AAI
			attachedEntity: true
		}
	],

	//650: [{}],	//EF_MAP_MAGICZONE	   Ice Cave Level 4 Circle
	//651: [{}],	//EF_MAP_MAGICZONE2	   Ice Cave Level 4 Big Circle
	//652: [{}],	//EF_DAMAGE1	   Like Regeneration Number but Red with a Sound
	//653: [{}],	//EF_DAMAGE1_2	   Like Regeneration Number but Red
	//654: [{}],	//EF_DAMAGE1_3	   Like Regeneration Number but Purple
	//655: [{}],	//EF_UNDEADBODY	   Mobs Skill (Change Undead Element)
	//656: [{}],	//EF_UNDEADBODY_DEL	   Last animation before Change Undead Element finish
	//657: [{}],	//EF_GREEN_NUMBER	   (Nothing)
	//658: [{}],	//EF_BLUE_NUMBER	   (Nothing)
	//659: [{}],	//EF_RED_NUMBER	   (Nothing)
	//660: [{}],	//EF_PURPLE_NUMBER	   (Nothing)
	//661: [{}],	//EF_BLACK_NUMBER	   (Nothing)
	//662: [{}],	//EF_WHITE_NUMBER	   (Nothing)
	//663: [{}],	//EF_YELLOW_NUMBER	   (Nothing)
	//664: [{}],	//EF_PINK_NUMBER	   (Nothing)
	//665: [{}],	//EF_BUBBLE_DROP	   Little Blue Ball Falling From the Sky

	666: [
		{
			//Earthquake	//EF_NPC_EARTHQUAKE	Earthquake
			type: 'SPR',
			file: '\xbe\xee\xbd\xba\xc4\xf9\xc0\xcc\xc5\xa9',
			wav: 'effect/earth_quake',
			attachedEntity: true
		},
		{
			type: 'FUNC',
			attachedEntity: true,
			duplicate: 3,
			timeBetweenDupli: 35,
			func: function (Params) {
				const start = Params.Inst.startTick;
				Camera.setQuake(start);
			}
		}
	],

	//667: [{}],	//EF_DA_SPACE	   (Nothing)

	668: [
		{
			//EF_DRAGONFEAR	Dragonfear
			type: 'STR',
			file: 'dragon_h',
			wav: 'effect/dragonfear',
			attachedEntity: true
		},
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const start = Params.Inst.startTick;
				Camera.setQuake(start);
			}
		}
	],

	669: [
		{
			//wide bleeding	//EF_BLEEDING	Wide Bleeding
			type: 'STR',
			file: 'wideb',
			wav: 'effect/wideb',
			attachedEntity: true
		}
	],

	670: [
		{
			//EF_WIDECONFUSE	Dragon fear (Visual Effect)
			type: 'STR',
			file: 'dfear',
			wav: 'effect/dragonfear',
			attachedEntity: true
		}
	],

	671: [
		{
			//EF_BOTTOM_RUNNER	   The Japan Earth Symbol (like 'Seven Wind Lv1', but on the ground)
			file: 'effect/hanmoon1.tga'
		}
	],

	672: [
		{
			//EF_BOTTOM_TRANSFER	   The Japan Wind Symbol (like 'Seven Wind Lv2', but on the ground)
			file: 'effect/hanmoon2.tga'
		}
	],

	//673: [{}],	//EF_CRYSTAL_BLUE	   Map turns Blue (like Soul Link)

	674: [
		{
			// evil land
			type: 'FUNC',
			attachedEntity: false,
			//file: 'status-curse',
			func: function (Params) {
				const self = this;
				EvillandEffects.forEach(function (effect) {
					self.add(new effect(Params.Inst.position, Params.Inst.startTick), Params);
				});
			}
		}
	],

	675: [
		{
			//EF_GUARD3	   Like Parrying/Kyrie Eleison barrier but Yellow with small Cross in every barrier piece
			wav: 'effect/kyrie_guard',
			attachedEntity: true
		}
	],

	677: [
		{
			//EF_CRITICALWOUND	Critical Wounds/Bleeding Attack
			type: 'STR',
			file: 'cwound',
			attachedEntity: true
		}
	],

	//678: [{}],	//EF_GREEN99_3	   White 99 Aura Bubbles
	//679: [{}],	//EF_GREEN99_5	   Green Aura (Middle)
	//680: [{}],	//EF_GREEN99_6	   Green Aura (Bottom)
	//681: [{}],	//EF_MAPSPHERE	   Dimensional Gorge Map Effect

	682: [
		{
			//EF_POK_LOVE	   I Love You Banner
			type: 'SPR',
			file: '\xc6\xf8\xc1\xd7\x5f\xb7\xaf\xba\xea',
			attachedEntity: true
		},
		{
			type: 'STR',
			file: 'itempokjuk',
			wav: 'effect/itempokjuk',
			attachedEntity: true
		}
	],
	683: [
		{
			//EF_POK_WHITE	   Happy White Day Banner
			type: 'SPR',
			file: '\xc6\xf8\xc1\xd7\x5f\xc8\x5f\xc0\xcc\xc6\xae\xb5\xa5\xc0\xcc',
			attachedEntity: true
		},
		{
			type: 'STR',
			file: 'itempokjuk',
			wav: 'effect/itempokjuk',
			attachedEntity: true
		}
	],
	684: [
		{
			//EF_POK_VALEN	   Happy Valentine Day Banner
			type: 'SPR',
			file: '\xc6\xf8\xc1\xd7\x5f\xb9\xdf\xb7\xbb\xc5\xb8\xc0\xce',
			attachedEntity: true
		},
		{
			type: 'STR',
			file: 'itempokjuk',
			wav: 'effect/itempokjuk',
			attachedEntity: true
		}
	],
	685: [
		{
			//EF_POK_BIRTH	   Happy Birthday Banner
			type: 'SPR',
			file: '\xc6\xf8\xc1\xd7\x5f\xbb\xfd\xc0\xcf',
			attachedEntity: true
		},
		{
			type: 'STR',
			file: 'itempokjuk',
			wav: 'effect/itempokjuk',
			attachedEntity: true
		}
	],
	686: [
		{
			//EF_POK_CHRISTMAS	   Merry Christmas Banner
			type: 'SPR',
			file: '\xc6\xf8\xc1\xd7\x5f\xc5\xa9\xb8\xae\xbd\xba\xb8\xb6\xbd\xba',
			attachedEntity: true
		},
		{
			type: 'STR',
			file: 'itempokjuk',
			wav: 'effect/itempokjuk',
			attachedEntity: true
		}
	],
	//687: [{}],	//EF_MAP_MAGICZONE3	   Cast Circle-Like effect 1
	//688: [{}],	//EF_MAP_MAGICZONE4	   Cast Circle-Like effect 2
	//689: [{}],	//EF_DUST	   Endless Tower Map Effect
	//690: [{}],	//EF_TORCH_RED	   Burning Flame (Red)
	//691: [{}],	//EF_TORCH_GREEN	   Burning Flame (Green)
	//692: [{}],	//EF_MAP_GHOST	   Unknown Aura Bubbles (Small ghosts)
	//693: [{}],	//EF_GLOW1	   Translucent yellow circle
	//694: [{}],	//EF_GLOW2	   Translucent green circle
	//695: [{}],	//EF_GLOW4	   Rotating green light
	//696: [{}],	//EF_TORCH_PURPLE	   The same of 690 and 691 but Blue/Purple

	697: [
		{
			//EF_CLOUD7	   (Night Clouds [Dark Blue])
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				CloudWeatherEffect.startOrRestart(Params);
			}
		}
	],

	698: [
		{
			//EF_CLOUD8	   (Sunset Clouds [Orange])
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				CloudWeatherEffect.startOrRestart(Params);
			}
		}
	],

	699: [
		{
			//EF_FLOWERLEAF	Fall of powder from the sky and raise of some leaf
			type: 'STR',
			file: 'flower_leaf',
			attachedEntity: true
		}
	],

	// Sight Blaster's ring (601), held while the status is on: SightBlasterEffect.js.
	...SightBlasterEffect,

	// Close Confine on its target (quake, red flicker): CloseConfineEffect.js.
	...CloseConfineEffect
};
