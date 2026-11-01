/**
 * @module DB/Effects/Table/Common/Effects0200
 *
 * Effects 0200 to 299 of the effect table that no single class's skills
 * use: shared rows, monsters, items, statuses. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep rows in effect ID order.
 */

import SwirlingAura from 'Renderer/Effects/SwirlingAura.js';
import GroundAura from 'Renderer/Effects/GroundAura.js';
import Level99Bubble from 'Renderer/Effects/Level99Bubble.js';
import SongEffects from 'Renderer/Effects/Songs.js';
import CloudWeatherEffect from 'Renderer/Effects/CloudWeatherEffect.js';
import PokJukWeatherEffect from 'Renderer/Effects/PokJukWeatherEffect.js';
import SpiritSphere from 'Renderer/Effects/SpiritSphere.js';

const DissonanceEffects = SongEffects.DissonanceEffects;
const UglyEffects = SongEffects.UglyEffects;

export default {
	200: [
		// EF_LEVEL99 - Normal level 99 Aura (Rising Cone / Swirling Band)
		// Math model from original game:
		// - Ring radius ≈ 3.9, tilt 55°, vertical amplitude 15, 315° sweep
		// - height_k(t) = H·sin(90+9(k−10))·sin(ωt), ω=1°/frame
		// - Spin adds (ec+3)°/frame
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				this.add(
					new SwirlingAura(Params.Init.ownerEntity.position, 'ring_blue.tga', Params.Inst.startTick),
					Params
				);
			}
		}
	],

	201: [
		// EF_LEVEL99_2 - Normal level 99 Aura (Bottom / Ground Ring)
		// Uses GroundAura which renders flat quads on the ground plane
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				this.add(
					new GroundAura(
						Params.Init.ownerEntity.position,
						100, // size (same as original Aura.js)
						15.0, // distance (same as original Aura.js)
						'pikapika2.bmp',
						Params.Inst.startTick
					),
					Params
				);
			}
		}
	],

	202: [
		// EF_LEVEL99_3 - Level 99 aura bubble sparkle (camera-facing diamonds)
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				// Default to blue variant (flag1 = 1) unless overridden
				let flag1 = 1;

				// Allow effect table or caller to override tint variant
				if (typeof Params.effect.flag1 !== 'undefined') {
					flag1 = Params.effect.flag1;
				} else if (Params.Inst && typeof Params.Inst.flag1 !== 'undefined') {
					flag1 = Params.Inst.flag1;
				}

				this.add(
					new Level99Bubble(Params.Init.ownerEntity.position, 'whitelight.tga', Params.Inst.startTick, flag1),
					Params
				);
			}
		}
	],

	203: [
		{
			//EF_GUMGANG	   Fury (Visual Effect)
			//super1..5.bmp
			type: '3D',
			fadeOut: true,
			duration: 2000,
			delayLate: 0,
			file: 'effect/super1.bmp',
			attachedEntity: true
		},
		{
			type: '3D',
			fadeOut: true,
			duration: 2000,
			delayLate: 400,
			file: 'effect/super2.bmp',
			attachedEntity: true
		},
		{
			type: '3D',
			fadeOut: true,
			duration: 2000,
			delayLate: 800,
			file: 'effect/super3.bmp',
			attachedEntity: true
		},
		{
			type: '3D',
			fadeOut: true,
			duration: 2000,
			delayLate: 1200,
			file: 'effect/super4.bmp',
			attachedEntity: true
		},
		{
			type: '3D',
			fadeOut: true,
			duration: 2000,
			delayLate: 1600,
			file: 'effect/super5.bmp',
			attachedEntity: true
		}
	],

	204: [
		{
			//EF_POTION1	Red Herb/Potion
			type: 'STR',
			file: '\xbb\xa1\xb0\xa3\xc6\xf7\xbc\xc7',
			attachedEntity: true
		}
	],

	205: [
		{
			//EF_POTION2	Orange Potion
			type: 'STR',
			file: '\xc1\xd6\xc8\xab\xc6\xf7\xbc\xc7',
			attachedEntity: true
		}
	],

	206: [
		{
			//EF_POTION3	Yellow Herb/Potion
			type: 'STR',
			file: '\xb3\xeb\xb6\xf5\xc6\xf7\xbc\xc7',
			attachedEntity: true
		}
	],

	207: [
		{
			//EF_POTION4	White Herb/Potion
			type: 'STR',
			file: '\xc7\xcf\xbe\xe1\xc6\xf7\xbc\xc7',
			attachedEntity: true
		}
	],

	208: [
		{
			//EF_POTION5	Blue Herb/Potion
			type: 'STR',
			file: '\xc6\xc4\xb6\xf5\xc6\xf7\xbc\xc7',
			wav: 'effect/\xc8\xed\xb1\xe2',
			attachedEntity: true
		}
	],

	209: [
		{
			//EF_POTION6	Green Herb/Potion
			type: 'STR',
			file: '\xc3\xca\xb7\xcf\xc6\xf7\xbc\xc7',
			attachedEntity: true
		}
	],

	210: [
		{
			//EF_POTION7	Yellow Circle Healing Effect
			type: 'STR',
			file: 'fruit',
			wav: '_heal_effect',
			attachedEntity: true
		}
	],

	211: [
		{
			//EF_POTION8	Blue Circle Healing Effect
			type: 'STR',
			file: 'fruit_',
			wav: 'effect/\xc8\xed\xb1\xe2',
			attachedEntity: true
		}
	],

	212: [
		{
			//EF_DARKBREATH	Dark Breath
			type: 'SPR',
			file: 'darkbreath',
			head: true,
			attachedEntity: true
		}
	],

	213: [
		{
			//EF_DEFFENDER	Defender
			type: 'STR',
			file: 'deffender',
			attachedEntity: true
		}
	],

	214: [
		{
			//EF_KEEPING	Keeping
			type: 'STR',
			file: 'keeping',
			attachedEntity: true
		}
	],

	215: [
		{
			//EF_SUMMONSLAVE
			type: 'SPR',
			file: 'smoke',
			attachedEntity: true
		}
	],

	216: [
		{
			//EF_BLOODDRAIN (Dracula / Beast Strafe)
			type: '3D',
			duration: 600,
			duplicate: 5,
			timeBetweenDupli: 0,
			absoluteSpriteName: 'data/sprite/\xc0\xcc\xc6\xd1\xc6\xae/particle1',
			playSprite: true,

			toSrc: true,
			rotateToTarget: true,

			// Blood Red
			red: 1.0,
			green: 0.4,
			blue: 0.4,

			sizeStart: 150.0,
			sizeEnd: 180.0,

			zOffsetStart: 5,
			arc: 3.0,
			retreat: 3.0,
			drainPattern: true
		}
	],

	218: [
		{
			//EF_POTION_CON	Concentration Potion
			type: 'STR',
			file: '\xc1\xfd\xc1\xdf',
			wav: 'effect/ac_concentration',
			attachedEntity: true
		}
	],

	219: [
		{
			//EF_POTION_	Awakening Potion
			type: 'STR',
			file: '\xb0\xa2\xbc\xba',
			wav: 'effect/ac_concentration',
			attachedEntity: true
		}
	],

	228: [
		{
			//EF_CHOOKGI	   (Nothing) - Used for spirit spheres (other classes)
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const spiritNum = Params.Init.spiritNum || 0;
				const Spheres = new SpiritSphere(Params.Init.ownerEntity, spiritNum, false);
				this.add(Spheres, Params);
			}
		}
	],

	229: [
		{
			//EF_CLOUD        Fog
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				CloudWeatherEffect.startOrRestart(Params);
			}
		}
	],

	230: [
		{
			//EF_CLOUD2       Normal Cloud (Under Map Gat)
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				CloudWeatherEffect.startOrRestart(Params);
			}
		}
	],

	//231: [{}],	//EF_MAPPILLAR	   Map Light Pillar Animation 1

	232: [
		{
			//EF_LINELINK	   Sacrifice (Visual Effect)
			type: '3D',
			alphaMax: 0.5,
			angle: 180,
			attachedEntity: true,
			blendMode: 2,
			red: 0.1,
			green: 0.1,
			blue: 0.9,
			duration: 100,
			fadeIn: true,
			fadeOut: true,
			file: 'effect/alpha_center.tga',
			fromSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			sizeX: 5,
			sizeY: 50,
			zOffset: 1,
			zIndex: 1
		}
	],

	233: [
		{
			//EF_CLOUD3	   Einbroch Industrial Clouds
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				CloudWeatherEffect.startOrRestart(Params);
			}
		}
	],

	254: [
		{
			//EF_STEELBODY	   Mental Strength (Visual Effect)
			wav: 'effect/mon_\xb1\xdd\xb0\xad\xba\xd2\xb1\xab'
		}
	],

	//259: [{}],	//EF_MAPPILLAR3	   Map Light Pillar Animation 3
	//260: [{}],	//EF_MAPPILLAR4	   Map Light Pillar Animation 4

	261: [
		{
			//fury / critical explosion TODO: combo sounds, super novice fury	//EF_GUMGANG2	Fury Cast Animation
			type: 'CYLINDER',
			alphaMax: 0.5,
			blendMode: 8,
			animation: 4,
			duplicate: 4,
			timeBetweenDupli: 100,
			bottomSize: 2,
			duration: 1500,
			fade: true,
			height: 2,
			rotate: true,
			textureName: 'ring_yellow',
			topSize: 5,
			attachedEntity: true
		},
		{
			wav: 'effect/mon_\xc6\xf8\xb1\xe2',
			attachedEntity: true
		}
	],

	263: [
		{
			//EF_GUMGANG3	   Raging Quadruple Blow 2
			type: 'CYLINDER',
			alphaMax: 0.3,
			blendMode: 8,
			animation: 4,
			duplicate: 4,
			timeBetweenDupli: 100,
			bottomSize: 3,
			duration: 1000,
			fade: true,
			height: 2,
			rotate: true,
			textureName: 'ring_yellow',
			topSize: 6,
			attachedEntity: true
		}
	],

	'277_ground': [
		{
			// Dissonance //\xb1\xe2\xb7\xf9.tga
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				const self = this;
				DissonanceEffects.forEach(function (effect) {
					self.add(new effect(Params.Inst.position, Params.Inst.startTick), Params);
				});
			}
		}
	],

	'290_ground': [
		{
			// Ugly
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				const self = this;
				UglyEffects.forEach(function (effect) {
					self.add(new effect(Params.Inst.position, Params.Inst.startTick), Params);
				});
			}
		}
	],

	297: [
		{
			//EF_POKJUK	   Fire Works (Visual Effect)
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				PokJukWeatherEffect.startOrRestart(Params);
			}
		}
	]
};
