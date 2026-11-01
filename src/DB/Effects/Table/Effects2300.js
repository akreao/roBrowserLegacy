/**
 * @module DB/Effects/Table/Effects2300
 *
 * Effects 2300 to 2399 of the effect table. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep rows in effect ID order.
 */

import Camera from 'Renderer/Camera.js';
import SoundManager from 'Audio/SoundManager.js';
import Events from 'Core/Events.js';
import CastCone from 'Renderer/Effects/CastCone.js';
import CastCircle from 'Renderer/Effects/CastCircle.js';
import CastRing from 'Renderer/Effects/CastRing.js';
import { arrowShowerEffects } from 'DB/Effects/ArrowShowerEffects.js';
import { arrowFlightBetween } from 'Renderer/Effects/ArrowFlight.js';
import CastFunnel from 'Renderer/Effects/CastFunnel.js';
import CasterMarks from 'Renderer/Effects/CasterMarks.js';
import WarlockSphere from 'Renderer/Effects/WarlockSphere.js';

export default {
	2367: [
		{
			// Night Watch, Soul Ascetic and Spirit Handler cast aura: the client's cast-aura ring in
			// ring_yellow.tga, argument 0 (white, additive), twice (CastRingSim.js).
			type: 'FUNC',
			attachedEntity: true,
			castLoop: true,
			wav: 'effect/ef_beginspell',
			func: function (Params) {
				this.add(
					new CastRing(
						Params.Init.ownerEntity.position,
						Params.Inst.startTick,
						Params.Init.duration,
						'ring_yellow.tga',
						[0, 0]
					),
					Params
				);
			}
		}
	],

	2368: [
		{
			// Talisman of Black Tortoise cast: the official client's bubble cone in black (variant 11, CastConeSim.js).
			type: 'FUNC',
			attachedEntity: true,
			wav: 'effect/ef_beginspell',
			func: function (Params) {
				this.add(
					new CastCone(Params.Init.ownerEntity.position, Params.Inst.startTick, Params.Init.duration, {
						variant: 11
					}),
					Params
				);
			}
		}
	],

	2369: [
		{
			// Breaking Limit, Rule Break and Talisman of Four Bearing God cast: the colour-cycling
			// ring (client primitive 139) in ring_white.tga, argument 0, twice: blue, red, green and
			// pale yellow, 25 ticks each (CastRingSim.js).
			type: 'FUNC',
			attachedEntity: true,
			castLoop: true,
			wav: 'effect/ef_beginspell',
			func: function (Params) {
				this.add(
					new CastRing(
						Params.Init.ownerEntity.position,
						Params.Inst.startTick,
						Params.Init.duration,
						'ring_white.tga',
						[0, 0],
						true
					),
					Params
				);
			}
		}
	],

	2373: [
		{
			type: 'FUNC',
			attachedEntity: true,
			castLoop: true,
			func: function (Params) {
				this.add(
					new CastFunnel(
						Params.Init.ownerEntity.position,
						Params.Inst.startTick,
						Params.Init.duration / 16,
						'ring_black.tga'
					),
					Params
				);
			}
		},
		{
			type: 'FUNC',
			attachedEntity: true,
			castLoop: true,
			func: function (Params) {
				this.add(
					new CasterMarks(Params.Init.ownerEntity, Params.Inst.startTick, Params.Init.duration / 16, 2373),
					Params
				);
			}
		}
	],

	maximize_power_sounds: [
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function MaximizePowerSounds(Params) {
				Events.setTimeout(function () {
					SoundManager.play('effect/black_maximize_power_circle.wav');
				}, 1);
				Events.setTimeout(function () {
					SoundManager.play('effect/black_maximize_power_sword.wav');
				}, 550);
				Events.setTimeout(function () {
					SoundManager.play('effect/black_maximize_power_sword.wav');
				}, 700);
				Events.setTimeout(function () {
					SoundManager.play('effect/black_maximize_power_sword_bic.wav');
				}, 950);
			}
		}
	],

	white_pulse: [
		{
			//type: 'FUNC',
			attachedEntity: true
		}
	],

	yellow_pulse: [
		{
			//type: 'FUNC',
			attachedEntity: true
		}
	],

	black_pulse: [
		{
			//type: 'FUNC',
			attachedEntity: true
		}
	],

	spear_hit_sound: [
		{
			wav: '_hit_spear',
			attachedEntity: true
		}
	],

	enemy_hit_normal1: [
		{
			wav: '_enemy_hit_normal1',
			attachedEntity: true
		}
	],

	ef_hit2_sound: [
		{
			wav: 'effect/ef_hit2',
			attachedEntity: true
		}
	],

	ef_greed_sound: [
		{
			wav: 'effect/ef_entry',
			attachedEntity: true
		}
	],

	ef_rush_windmill: [
		{
			wav: 'effect/\xc7\xb3\xc2\xf7\xb8\xa6\xc7\xe2\xc7\xd8\xb5\xb9\xb0\xdd', //ÇłÂ÷¸¦ÇâÇŘµą°Ý
			attachedEntity: true
		},
		{
			alphaMax: 1,
			attachedEntity: true,
			duration: 1000,
			delayLate: 500,
			duplicate: 7,
			fadeOut: true,
			file: 'effect/ac_center2.tga',
			red: 0.5,
			green: 0.01,
			blue: 0.9,
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
			alphaMax: 0.75,
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
		},
		{
			alphaMax: 1,
			attachedEntity: true,
			duration: 1000,
			duplicate: 10,
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
			type: 'FUNC',
			attachedEntity: true,
			func: function EffectBodyColor(Params) {
				const entity = Params.Init;

				entity.animations.add(function (tick) {
					if (tick < 500) {
						if (tick % 2 == 0) {
							entity._flashColor[0] = 1;
							entity._flashColor[1] = 1;
							entity._flashColor[2] = 1;
							entity._flashColor[3] = 0.4;
							entity.recalculateBlendingColor();
						} else {
							entity._flashColor[0] = 1;
							entity._flashColor[1] = 1;
							entity._flashColor[2] = 1;
							entity._flashColor[3] = 1;
							entity.recalculateBlendingColor();
						}
					} else {
						entity._flashColor[0] = 1;
						entity._flashColor[1] = 1;
						entity._flashColor[2] = 1;
						entity._flashColor[3] = 1;
						entity.recalculateBlendingColor();
						return true;
					}
				});
			}
		}
	],

	ef_swing_dance: [
		{
			wav: 'effect/\xbd\xba\xc0\xae\xb4\xed\xbd\xba',
			attachedEntity: true
		},
		{
			alphaMax: 1,
			attachedEntity: true,
			duration: 1000,
			delayLate: 500,
			duplicate: 7,
			fadeOut: true,
			file: 'effect/ac_center2.tga',
			red: 1,
			green: 0.1,
			blue: 0.5,
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
			alphaMax: 0.75,
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
		},
		{
			alphaMax: 1,
			attachedEntity: true,
			duration: 1000,
			duplicate: 10,
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
			type: 'FUNC',
			attachedEntity: true,
			func: function EffectBodyColor(Params) {
				const entity = Params.Init.ownerEntity;

				entity.animations.add(function (tick) {
					if (tick < 500) {
						if (tick % 2 == 0) {
							entity._flashColor[0] = 1;
							entity._flashColor[1] = 0.1;
							entity._flashColor[2] = 0.5;
							entity._flashColor[3] = 0.4;
							entity.recalculateBlendingColor();
						} else {
							entity._flashColor[0] = 1;
							entity._flashColor[1] = 1;
							entity._flashColor[2] = 1;
							entity._flashColor[3] = 1;
							entity.recalculateBlendingColor();
						}
					} else {
						entity._flashColor[0] = 1;
						entity._flashColor[1] = 1;
						entity._flashColor[2] = 1;
						entity._flashColor[3] = 1;
						entity.recalculateBlendingColor();
						return true;
					}
				});
			}
		}
	],

	ef_magicpower: [
		{
			wav: 'effect/\xb8\xb6\xb9\xfd\xb7\xc2\x20\xc1\xf5\xc6\xf8',
			attachedEntity: true
		}
	],

	ef_metalicsound: [
		{
			wav: 'effect/metalic',
			attachedEntity: true
		}
	],

	ef_ancilla: [
		{
			wav: 'effect/ab_ancilla',
			attachedEntity: true
		}
	],

	ef_thorntrap: [
		{
			wav: 'effect/\xb0\xa1\xbd\xc3\xb3\xaa\xb9\xab\xb5\xa3',
			attachedEntity: true
		}
	],

	ef_banishingpoint: [
		{
			wav: 'effect/lg_banishingpoint',
			attachedEntity: true
		}
	],

	ef_cannonspear: [
		{
			wav: 'effect/lg_cannonspear',
			attachedEntity: true
		}
	],

	ef_earthdrive: [
		{
			wav: 'effect/lg_earthdrive',
			attachedEntity: true
		}
	],

	ef_exceedbreak: [
		{
			wav: 'effect/lg_exceedbreak',
			attachedEntity: true
		}
	],

	ef_hesperuslit: [
		{
			wav: 'effect/lg_hesperuslit',
			attachedEntity: true
		}
	],

	ef_kings_grace: [
		{
			wav: 'effect/lg_kings_grace',
			attachedEntity: true
		}
	],

	ef_moonslasher: [
		{
			wav: 'effect/lg_moonslasher',
			attachedEntity: true
		},
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const entity = Params.Init.ownerEntity;
				const duration = 500;
				const count = 8;
				const delay = duration / count;

				for (let i = 0; i < count; i++) {
					const delta = 1;

					Events.setTimeout(function () {
						entity.direction = Math.floor(entity.direction + delta) % 8;
					}, delay * i);
				}
			}
		}
	],

	ef_overbrand: [
		{
			wav: 'effect/lg_overbrand',
			attachedEntity: true
		}
	],

	ef_piety: [
		{
			wav: 'effect/lg_piety',
			attachedEntity: true
		}
	],

	ef_pinpointattack: [
		{
			wav: 'effect/lg_pinpointattack',
			attachedEntity: true
		}
	],

	ef_rageburst: [
		{
			wav: 'effect/lg_rageburst',
			attachedEntity: true
		}
	],

	ef_rayofgenesis: [
		{
			wav: 'effect/lg_rayofgenesis',
			attachedEntity: true
		}
	],

	ef_reflectdamage: [
		{
			wav: 'effect/lg_reflectdamage',
			attachedEntity: true
		}
	],

	ef_shieldspell: [
		{
			wav: 'effect/lg_shieldspell',
			attachedEntity: true
		}
	],

	ef_trample: [
		{
			wav: 'effect/lg_trample',
			attachedEntity: true
		}
	],

	ef_crescentelbow: [
		{
			wav: 'effect/sr_crescentelbow',
			attachedEntity: true
		}
	],

	ef_cursedcircle: [
		{
			wav: 'effect/sr_cursedcircle',
			attachedEntity: true
		}
	],

	ef_dragoncombo: [
		{
			wav: 'effect/sr_dragoncombo',
			attachedEntity: true
		}
	],

	ef_fallenempire: [
		{
			wav: 'effect/sr_fallenempire',
			attachedEntity: true
		}
	],

	ef_gateofhell: [
		{
			wav: 'effect/sr_gateofhell',
			attachedEntity: true
		}
	],

	ef_howlingoflion: [
		{
			wav: 'effect/sr_howlingoflion',
			attachedEntity: true
		}
	],

	ef_knucklearrow: [
		{
			wav: 'effect/sr_knucklearrow',
			attachedEntity: true
		}
	],

	ef_lightningwalk: [
		{
			wav: 'effect/sr_lightningwalk',
			attachedEntity: true
		}
	],

	ef_powervelocity: [
		{
			wav: 'effect/sr_powervelocity',
			attachedEntity: true
		}
	],

	ef_raisingdragon: [
		{
			wav: 'effect/sr_raisingdragon',
			attachedEntity: true
		}
	],

	ef_rampageblaster: [
		{
			wav: 'effect/sr_rampageblaster',
			attachedEntity: true
		}
	],

	ef_rideinlightning: [
		{
			wav: 'effect/sr_rideinlightning',
			attachedEntity: true
		}
	],

	ef_skynetblow: [
		{
			wav: 'effect/sr_skynetblow',
			attachedEntity: true
		}
	],

	ef_tigercannon: [
		{
			wav: 'effect/sr_tigercannon',
			attachedEntity: true
		}
	],

	ef_windmill: [
		{
			wav: 'effect/sr_windmill',
			attachedEntity: true
		},
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const entity = Params.Init.ownerEntity;
				const duration = 500;
				const count = 8;
				const delay = duration / count;

				for (let i = 0; i < count; i++) {
					const delta = 1;

					Events.setTimeout(function () {
						entity.direction = Math.floor(entity.direction + delta) % 8;
					}, delay * i);
				}
			}
		}
	],

	ef_jackfrost: [
		{
			wav: 'effect/wl_jackfrost',
			attachedEntity: true
		},
		{
			//ice spikes traveling outward from the caster in all 8 directions
			type: 'TRAIL',
			attachedEntity: false,
			duration: 1000,
			speed: 24,
			interval: 34,
			startOffset: 1,
			angles: [0, 45, 90, 135, 180, 225, 270, 315],
			spread: [0.1, 0.4],
			spawn: [
				{
					type: 'QuadHorn',
					textureFile: 'effect/ice.tga',
					attachedEntity: false,
					duration: 670,
					height: [0.2, 1.8],
					offsetX: 0,
					offsetY: 0,
					offsetZ: 0,
					bottomSize: [0.06, 0.22],
					blendMode: 8,
					rotateX: [-15, 15],
					rotateY: [0, 360],
					color: [1.0, 1.0, 1.0, 1.0],
					animation: 4,
					animationSpeed: 330,
					riseDistance: 2.0,
					fadeOut: 170
				}
			]
		}
	],

	ef_siennaexecrate: [
		{
			wav: 'effect/wl_siennaexecrate',
			attachedEntity: true
		}
	],

	ef_frigg_song: [
		{
			wav: 'effect/wm_frigg_song',
			attachedEntity: true
		}
	],

	ef_duplelight: [
		{
			wav: 'effect/ab_duplelight',
			attachedEntity: true
		}
	],

	ef_wugbite: [
		{
			wav: 'wug_bite',
			attachedEntity: true
		}
	],

	ef_wugstrike: [
		{
			wav: 'wug_strike',
			attachedEntity: true
		}
	],

	ef_wugrider: [
		{
			wav: 'wolf_stand',
			attachedEntity: true
		}
	],

	ef_dragonbreath_water: [
		{
			type: 'SPR',
			file: 'rk_dragonbreath_water',
			wav: 'dragon_breath',
			attachedEntity: true
		}
	],

	ef_hallucinationwalk: [
		{
			wav: 'effect/hallucinationwalk',
			attachedEntity: true
		}
	],

	ef_s_storm: [
		{
			type: 'STR',
			file: 'S_STORM',
			wav: 'effect/RL_S_STORM',
			attachedEntity: true
		}
	],

	ef_firebreath: [
		{
			wav: 'effect/ef_firewall',
			attachedEntity: true
		}
	],

	ef_moonlit_serenade: [
		{
			wav: 'effect/\xb4\xde\xba\xfb\xbc\xbc\xb7\xb9\xb3\xaa\xb5\xa5',
			attachedEntity: true
		}
	],

	ef_sound_of_destruction: [
		{
			wav: 'effect/\xbb\xe7\xbf\xee\xb5\xe5\xbf\xc0\xba\xea\xb5\xf0\xbd\xba\xc6\xae\xb7\xb0\xbc\xc7',
			attachedEntity: true
		}
	],

	ef_great_echo: [
		{
			wav: 'effect/\xb1\xd7\xb7\xb9\xc0\xcc\xc6\xae\xbf\xa1\xc4\xda',
			attachedEntity: true
		}
	],

	ef_valley_of_death: [
		{
			wav: 'effect/\xbb\xe7\xb8\xc1\xc0\xc7\xb0\xf1\xc2\xa5\xb1\xe2\xbf\xa1\xbc\xad',
			attachedEntity: true
		}
	],

	ef_harmonize: [
		{
			wav: 'effect/\xc7\xcf\xb8\xf0\xb3\xaa\xc0\xcc\xc1\xee',
			attachedEntity: true
		}
	],

	ef_echo_song: [
		{
			wav: 'effect/\xb8\xde\xbe\xc6\xb8\xae\xc0\xc7\xb3\xeb\xb7\xa1',
			attachedEntity: true
		}
	],

	ef_symphony_of_lovers: [
		{
			wav: 'effect/\xbf\xac\xc0\xce\xb5\xe9\xc0\xbb\xc0\xa7\xc7\xd1\xbd\xc9\xc6\xf7\xb4\xcf',
			attachedEntity: true
		}
	],

	ef_arrow_projectile: [
		{
			// effect to show the arrow projectile (normal attack or skill with arrow projectile)
			// Official flight: 8 frames of 24 ms, shorter under 8 cells (ArrowFlight.js)
			type: '3D',
			alphaMax: 1,
			angle: 180,
			attachedEntity: true,
			duration: Params => arrowFlightBetween(Params.Inst.otherPosition, Params.Inst.position),
			fadeIn: true,
			fadeOut: true,
			absoluteSpriteName: 'data/sprite/npc/skel_archer_arrow',
			toSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			size: 100,
			zOffset: 1,
			zIndex: 1
		}
	],

	// Arrow Shower (AC_SHOWER): the client's arrows to the cells around a point, ArrowShowerEffects.js.
	...arrowShowerEffects(),

	ef_spear_projectile: [
		{
			type: '3D',
			alphaMax: 1,
			angle: 180,
			attachedEntity: true,
			duration: 140,
			fadeIn: true,
			fadeOut: true,
			spriteName: '\xc3\xa2',
			playSprite: true,
			toSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			size: 100,
			zOffset: 1,
			zIndex: 1
		}
	],

	ef_shield_projectile: [
		{
			type: '3D',
			alphaMax: 1,
			angle: 180,
			attachedEntity: true,
			duration: 140,
			fadeIn: true,
			fadeOut: true,
			file: 'effect/shield_boomerang.bmp',
			toSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			rotate: true,
			nbOfRotation: 1,
			size: 50,
			zOffset: 1,
			zIndex: 1
		}
	],

	ef_tomahawk_projectile: [
		{
			type: '3D',
			alphaMax: 1,
			angle: 180,
			attachedEntity: true,
			duration: 140,
			fadeIn: true,
			fadeOut: true,
			file: 'effect/\xc5\xe4\xb8\xb6.bmp',
			toSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			rotate: true,
			nbOfRotation: 1,
			size: 50,
			zOffset: 1,
			zIndex: 1
		}
	],

	ef_parasite_projectile: [
		{
			type: '3D',
			alphaMax: 1,
			angle: 180,
			attachedEntity: true,
			duration: 140,
			fadeIn: true,
			fadeOut: true,
			spriteName: '../npc/parasite_bullet',
			toSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			size: 100,
			zOffset: 1,
			zIndex: 1
		}
	],

	ef_stone_shooter_projectile: [
		{
			type: '3D',
			alphaMax: 1,
			angle: 180,
			attachedEntity: true,
			duration: 140,
			fadeIn: true,
			fadeOut: true,
			spriteName: '../npc/stone_shooter_bullet',
			toSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			size: 100,
			zOffset: 1,
			zIndex: 1
		}
	],

	ef_wootan_shooter_projectile: [
		{
			type: '3D',
			alphaMax: 1,
			angle: 180,
			attachedEntity: true,
			duration: 140,
			fadeIn: true,
			fadeOut: true,
			spriteName: '../npc/wootan_shooter_bullet',
			toSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			size: 100,
			zOffset: 1,
			zIndex: 1
		}
	],

	ef_peach_tree_projectile: [
		{
			type: '3D',
			alphaMax: 1,
			angle: 180,
			attachedEntity: true,
			duration: 140,
			fadeIn: true,
			fadeOut: true,
			spriteName: '../npc/peach_tree_bullet',
			toSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			size: 100,
			zOffset: 1,
			zIndex: 1
		}
	],

	ef_hermit_projectile: [
		{
			type: '3D',
			alphaMax: 1,
			angle: 180,
			attachedEntity: true,
			duration: 140,
			fadeIn: true,
			fadeOut: true,
			spriteName: '../npc/ginseng_bullet',
			toSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			size: 100,
			zOffset: 1,
			zIndex: 1
		}
	],

	ef_canon_projectile: [
		{
			type: '3D',
			alphaMax: 1,
			angle: 180,
			attachedEntity: true,
			duration: 140,
			fadeIn: true,
			fadeOut: true,
			spriteName: '../npc/canon_bullet',
			toSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			size: 100,
			zOffset: 1,
			zIndex: 1
		}
	],

	ef_canon1_projectile: [
		{
			type: '3D',
			alphaMax: 1,
			angle: 180,
			attachedEntity: true,
			duration: 140,
			fadeIn: true,
			fadeOut: true,
			spriteName: '../npc/canon_bullet_1',
			toSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			size: 100,
			zOffset: 1,
			zIndex: 1
		}
	],

	ef_canon2_projectile: [
		{
			type: '3D',
			alphaMax: 1,
			angle: 180,
			attachedEntity: true,
			duration: 140,
			fadeIn: true,
			fadeOut: true,
			spriteName: '../npc/canon_bullet_2',
			toSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			size: 100,
			zOffset: 1,
			zIndex: 1
		}
	],

	ef_canon3_projectile: [
		{
			type: '3D',
			alphaMax: 1,
			angle: 180,
			attachedEntity: true,
			duration: 140,
			fadeIn: true,
			fadeOut: true,
			spriteName: '../npc/canon_bullet_3',
			toSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			size: 100,
			zOffset: 1,
			zIndex: 1
		}
	],

	ef_tanee_projectile: [
		{
			type: '3D',
			alphaMax: 1,
			angle: 180,
			attachedEntity: true,
			duration: 140,
			fadeIn: true,
			fadeOut: true,
			spriteName: '../npc/lady_tanee_bullet',
			toSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			size: 100,
			zOffset: 1,
			zIndex: 1
		}
	],

	ef_ragged_projectile: [
		{
			type: '3D',
			alphaMax: 1,
			angle: 180,
			attachedEntity: true,
			duration: 140,
			fadeIn: true,
			fadeOut: true,
			spriteName: '../npc/ragged_zombie_bullet',
			toSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			size: 100,
			zOffset: 1,
			zIndex: 1
		}
	],

	ef_mandragora_attack: [
		{
			type: 'SPR',
			file: '../npc/mandragora_atk',
			attachedEntity: false
		}
	],

	ef_hydra_attack: [
		{
			type: 'SPR',
			file: '../npc/hydra_atk',
			attachedEntity: false
		}
	],

	ef_odium_attack: [
		{
			type: 'SPR',
			file: '../npc/tha_odium_ef',
			attachedEntity: false
		}
	],

	ef_drosera_attack: [
		{
			type: 'SPR',
			file: '../npc/drosera_bullet',
			attachedEntity: false
		}
	],

	ef_mavka_attack: [
		{
			type: 'SPR',
			file: '../npc/mavka_bullet',
			attachedEntity: false
		}
	],

	ef_entweihen_attack: [
		{
			type: 'SPR',
			file: '../npc/entweihen_bullet',
			attachedEntity: false
		}
	],

	ef_c_marker1: [
		{
			type: 'STR',
			file: 'RL_C_MAKER/deffender',
			attachedEntity: true
		},
		{
			type: 'STR',
			file: 'RL_C_MAKER/cm',
			attachedEntity: true
		},
		{
			wav: 'effect/RL_C_MARKER'
		}
	],

	ef_c_marker2: [
		{
			type: '2D',
			file: 'effect/RL_C_MAKER/ome.bmp',
			blendMode: 2,
			alphaMax: 0.8,
			duration: 500,
			posz: 5,
			sizeStart: 50,
			sizeEnd: 100,
			attachedEntity: true
		},
		{
			type: '2D',
			file: 'effect/RL_C_MAKER/ome.bmp',
			blendMode: 2,
			alphaMax: 0.8,
			delayOffset: 500,
			duration: 500,
			posz: 5,
			sizeStart: 100,
			sizeEnd: 50,
			attachedEntity: true
		}
	],

	temporary_warlock_sphere: [
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const entity = Params.Init.ownerEntity;
				const spheres = [];
				if (entity.Summon1) {
					spheres.push(entity.Summon1);
				}
				if (entity.Summon2) {
					spheres.push(entity.Summon2);
				}
				if (entity.Summon3) {
					spheres.push(entity.Summon3);
				}
				if (entity.Summon4) {
					spheres.push(entity.Summon4);
				}
				if (entity.Summon5) {
					spheres.push(entity.Summon5);
				}

				const wl_spheres = new WarlockSphere(entity, spheres);

				this.add(wl_spheres, Params);
			}
		}
	],

	quake: [
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const start = Params.Inst.startTick;
				Camera.setQuake(start);
			}
		}
	],

	quake_magnum: [
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const start = Params.Inst.startTick;
				const duration = 50;
				Camera.setQuake(start, duration);
			}
		}
	],

	ef_: [
		{
			wav: 'effect/',
			attachedEntity: true
		}
	],

	// Earlier classes: art from the client data for skills that had none.
	// Land Mine (HT_LANDMINE), from the client's own effect folders.
	ef_ht_landmine: [
		{
			type: 'STR',
			file: 'landmine',
			texturePath: ''
		}
	],

	// Suicide (SA_INSTANTDEATH), from the client's own effect folders.
	ef_sa_instantdeath: [
		{
			type: 'STR',
			file: 'suicide',
			texturePath: ''
		}
	],

	// Counter Kick (TK_COUNTER), from the client's own effect folders.
	ef_tk_counter: [
		{
			type: 'STR',
			file: 'new_counter_slash/new_counter_slash/new_counter_slash',
			texturePath: 'new_counter_slash/new_counter_slash/'
		},
		{
			type: 'STR',
			file: 'new_counter_slash/new_counter_slash_bottom/new_counter_slash_bottom',
			texturePath: 'new_counter_slash/new_counter_slash_bottom/',
			renderBeforeEntities: true
		}
	],

	// Spirit of the Assasin (SL_ASSASIN), from the client's own effect folders.
	ef_sl_assasin: [
		{
			type: 'STR',
			file: 'assasin_poisonreact',
			texturePath: ''
		},
		{
			type: 'STR',
			file: 'assasin_poisonreact_1st',
			texturePath: ''
		}
	],

	// Advanced Adrenaline Rush (BS_ADRENALINE2), from the client's own effect folders.
	ef_bs_adrenaline2: [
		{
			type: 'STR',
			file: 'adrenaline',
			texturePath: ''
		}
	],

	// Spirit of the Hunter (SL_HUNTER), from the client's own effect folders.
	ef_sl_hunter: [
		{
			type: 'STR',
			file: 'hunter_loud',
			texturePath: ''
		},
		{
			type: 'STR',
			file: 'hunter_poison',
			texturePath: ''
		},
		{
			type: 'STR',
			file: 'hunter_shockwave_blue',
			texturePath: ''
		}
	],

	// Estun (SL_STUN), from the client's own effect folders.
	ef_sl_stun: [
		{
			type: 'STR',
			file: 'stun',
			texturePath: '',
			wav: 'effect/_stun'
		}
	],

	// Increasing Accuracy (GS_INCREASING), from the client's own effect folders.
	ef_gs_increasing: [
		{
			type: 'STR',
			file: 'increasing_activity/increasing_activity/increasing_activity',
			texturePath: 'increasing_activity/increasing_activity/',
			min: 'increasing_activity/increasing_activity/min_increasing_activity'
		}
	],

	// Increasing Accuracy (GS_INCREASING), from the client's own effect folders.
	ef_gs_increasing_cast: [
		{
			type: 'STR',
			file: 'increasing_activity/increasing_activity_cast/increasing_activity_cast',
			texturePath: 'increasing_activity/increasing_activity_cast/',
			min: 'increasing_activity/increasing_activity_cast/min_increasing_activity_cast'
		},
		{
			type: 'STR',
			file: 'increasing_activity/increasing_activity_cast_bottom/increasing_activity_cast_bottom',
			texturePath: 'increasing_activity/increasing_activity_cast_bottom/',
			min: 'increasing_activity/increasing_activity_cast_bottom/min_increasing_activity_cast_bottom',
			renderBeforeEntities: true
		}
	],

	// Wind Cutter (RK_WINDCUTTER), from the client's own effect folders.
	ef_rk_windcutter: [
		{
			type: 'STR',
			file: 'new_windcutter/new_windcutter/new_windcutter',
			texturePath: 'new_windcutter/new_windcutter/'
		}
	],

	// Secrament (AB_SECRAMENT), from the client's own effect folders.
	ef_ab_secrament: [
		{
			type: 'STR',
			file: 'new_secrament/new_secrament/new_secrament',
			texturePath: 'new_secrament/new_secrament/'
		}
	],

	// Fear Breeze (RA_FEARBREEZE), from the client's own effect folders.
	ef_ra_fearbreeze: [
		{
			type: 'STR',
			file: 'new_fearbreeze/new_fearbreeze',
			texturePath: 'new_fearbreeze/'
		}
	],

	// Fatal Menace (SC_FATALMENACE), from the client's own effect folders.
	ef_sc_fatalmenace: [
		{
			type: 'STR',
			file: 'new_fatal_menace/new_fatal_menace/new_fatal_menace',
			texturePath: 'new_fatal_menace/new_fatal_menace/'
		},
		{
			type: 'STR',
			file: 'new_fatal_menace/new_fatal_menace_bottom/new_fatal_menace_bottom',
			texturePath: 'new_fatal_menace/new_fatal_menace_bottom/',
			renderBeforeEntities: true
		}
	],

	// Fatal Menace (SC_FATALMENACE), from the client's own effect folders.
	ef_sc_fatalmenace_cast: [
		{
			type: 'STR',
			file: 'new_fatal_menace/new_fatal_menace_cast/new_fatal_menace_cast',
			texturePath: 'new_fatal_menace/new_fatal_menace_cast/'
		},
		{
			type: 'STR',
			file: 'new_fatal_menace/new_fatal_menace_cast_bottom/new_fatal_menace_cast_bottom',
			texturePath: 'new_fatal_menace/new_fatal_menace_cast_bottom/',
			renderBeforeEntities: true
		}
	],

	// Reproduce (SC_REPRODUCE), from the client's own effect folders.
	ef_sc_reproduce: [
		{
			type: 'STR',
			file: 'new_reproduce/new_reproduce/new_reproduce',
			texturePath: 'new_reproduce/new_reproduce/',
			wav: 'effect/reproduce'
		},
		{
			type: 'STR',
			file: 'new_reproduce/new_reproduce_bottom/new_reproduce_bottom',
			texturePath: 'new_reproduce/new_reproduce_bottom/',
			renderBeforeEntities: true
		}
	],

	// Auto Shadow Spell (SC_AUTOSHADOWSPELL), from the client's own effect folders.
	ef_sc_autoshadowspell: [
		{
			type: 'STR',
			file: 'new_autoshadowspell/new_autoshadowspell/new_autoshadowspell',
			texturePath: 'new_autoshadowspell/new_autoshadowspell/'
		},
		{
			type: 'STR',
			file: 'new_autoshadowspell/new_autoshadowspell_bottom/new_autoshadowspell_bottom',
			texturePath: 'new_autoshadowspell/new_autoshadowspell_bottom/',
			renderBeforeEntities: true
		}
	],

	// Golem's Soul (SP_SOULGOLEM), from the client's own effect folders.
	ef_sp_soulgolem: [
		{
			type: 'STR',
			file: 'soul_golem/soul_golem',
			texturePath: 'soul_golem/'
		}
	],

	// Soul Curse (SP_SOULCURSE), from the client's own effect folders.
	ef_sp_soulcurse: [
		{
			type: 'STR',
			file: 'soul_curse/soul_curse',
			texturePath: 'soul_curse/'
		}
	],

	// Soul Revolution (SP_SOULREVOLVE), from the client's own effect folders.
	ef_sp_soulrevolve: [
		{
			type: 'STR',
			file: 'soul_revolve/soul_revolve',
			texturePath: 'soul_revolve/'
		}
	],

	// Cross Slash (KO_JYUMONJIKIRI), from the client's own effect folders.
	ef_ko_jyumonjikiri: [
		{
			type: 'STR',
			file: 'jyumonjikiri',
			texturePath: ''
		}
	],

	// Soul Cutter (KO_SETSUDAN), from the client's own effect folders.
	ef_ko_setsudan: [
		{
			type: 'STR',
			file: 'setsudan',
			texturePath: ''
		}
	],

	// Unlimited (RA_UNLIMIT), from the client's own effect folders.
	ef_ra_unlimit: [
		{
			type: 'STR',
			file: 'new_unlimit/new_unlimit/new_unlimit',
			texturePath: 'new_unlimit/new_unlimit/',
			wav: 'ra_unlimit'
		},
		{
			type: 'STR',
			file: 'new_unlimit/new_unlimit_bottom/new_unlimit_bottom',
			texturePath: 'new_unlimit/new_unlimit_bottom/',
			renderBeforeEntities: true
		}
	],

	// Help Angel (NV_HELPANGEL), from the client's own effect folders.
	// The client plays effect\priest_sanctuary.wav, then effects 1367 and 1368 (the floor ring).
	ef_nv_helpangel: [
		{
			type: 'STR',
			file: 'help_angel/help_angel/help_angel',
			texturePath: 'help_angel/help_angel/',
			wav: 'effect/priest_sanctuary'
		},
		{
			type: 'STR',
			file: 'help_angel/help_angel_bottom/help_angel_bottom',
			texturePath: 'help_angel/help_angel_bottom/',
			renderBeforeEntities: true
		}
	],

	ef_cast_circle_red: [
		{
			// Effect 55: tinted circle, ring_yellow.tga, mode 1 (reddish, additive)
			type: 'FUNC',
			attachedEntity: true,
			castLoop: true,
			wav: 'effect/ef_beginspell',
			func: function (Params) {
				this.add(
					new CastCircle(
						Params.Init.ownerEntity.position,
						Params.Inst.startTick,
						Params.Init.duration,
						'ring_yellow.tga',
						1
					),
					Params
				);
			}
		}
	],

	ef_cast_circle_violet: [
		{
			// Effect 59: untinted circle, magic_violet.tga
			type: 'FUNC',
			attachedEntity: true,
			castLoop: true,
			wav: 'effect/ef_beginspell',
			func: function (Params) {
				this.add(
					new CastCircle(
						Params.Init.ownerEntity.position,
						Params.Inst.startTick,
						Params.Init.duration,
						'magic_violet.tga'
					),
					Params
				);
			}
		}
	],

	ef_cast_circle_blue: [
		{
			// Effect 54: tinted circle, ring_blue.tga, mode 2 (bluish, normal blending)
			type: 'FUNC',
			attachedEntity: true,
			castLoop: true,
			wav: 'effect/ef_beginspell',
			func: function (Params) {
				this.add(
					new CastCircle(
						Params.Init.ownerEntity.position,
						Params.Inst.startTick,
						Params.Init.duration,
						'ring_blue.tga',
						2
					),
					Params
				);
			}
		}
	],

	ef_cast_circle_yellow: [
		{
			// Effect 57: tinted circle, ring_yellow.tga, mode 0 (white, normal blending)
			type: 'FUNC',
			attachedEntity: true,
			castLoop: true,
			wav: 'effect/ef_beginspell',
			func: function (Params) {
				this.add(
					new CastCircle(
						Params.Init.ownerEntity.position,
						Params.Inst.startTick,
						Params.Init.duration,
						'ring_yellow.tga',
						0
					),
					Params
				);
			}
		}
	]
};
