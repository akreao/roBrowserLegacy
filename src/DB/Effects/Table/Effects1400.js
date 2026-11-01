/**
 * @module DB/Effects/Table/Effects1400
 *
 * Effects 1400 to 1499 of the effect table. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep rows in effect ID order.
 */

import Camera from 'Renderer/Camera.js';
import { arrowShowerEffects } from 'DB/Effects/ArrowShowerEffects.js';
import { arrowFlightBetween } from 'Renderer/Effects/ArrowFlight.js';
import WarlockSphere from 'Renderer/Effects/WarlockSphere.js';
import CastCircle from 'Renderer/Effects/CastCircle.js';
import CastRing from 'Renderer/Effects/CastRing.js';
import IceSpikes from 'Renderer/Effects/IceSpikes.js';
import MapPreferences from 'Preferences/Map.js';
import { planPath as planIcePath, PATH as ICE_PATH } from 'Renderer/Effects/IceSpikesSim.js';

export default {
	1449: [
		{
			// Jack Frost Nova cast: the client's tinted cast circle in new_jackfrost/ring_ice.tga,
			// mode 2 (bluish, normal blending), for the cast time (CastCircleSim.js).
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
						'new_jackfrost/ring_ice.tga',
						2
					),
					Params
				);
			}
		}
	],

	// Jack Frost Nova cast, with 1449: the client plays new_jackfrost_cast.str for the cast time
	1446: [
		{
			type: 'STR',
			file: 'new_jackfrost/new_jackfrost_cast/new_jackfrost_cast',
			texturePath: 'new_jackfrost/new_jackfrost_cast/',
			min: 'new_jackfrost/new_jackfrost_cast/min_new_jackfrost_cast',
			castLoop: true,
			attachedEntity: true
		}
	],

	1443: [
		{
			//(1443): CEZ2STREffect, new_jackfrost\\new_jackfrost\\new_jackfrost_00.str
			type: 'STR',
			file: 'new_jackfrost/new_jackfrost/new_jackfrost_00',
			texturePath: 'new_jackfrost/new_jackfrost/',
			// 1540, under /mineffect
			min: 'mineffect/new_jackfrost/new_jackfrost_ice/new_jackfrost_00',
			minTexturePath: 'mineffect/new_jackfrost/new_jackfrost_ice/',
			attachedEntity: false
		}
	],

	1444: [
		{
			//(1444): CEZ2STREffect, new_jackfrost\\new_jackfrost\\new_jackfrost_01.str
			type: 'STR',
			file: 'new_jackfrost/new_jackfrost/new_jackfrost_01',
			texturePath: 'new_jackfrost/new_jackfrost/',
			// 1541, under /mineffect
			min: 'mineffect/new_jackfrost/new_jackfrost_ice/new_jackfrost_01',
			minTexturePath: 'mineffect/new_jackfrost/new_jackfrost_ice/',
			attachedEntity: false
		}
	],

	1445: [
		{
			//(1445): CEZ2STREffect, new_jackfrost\\new_jackfrost\\new_jackfrost_02.str
			type: 'STR',
			file: 'new_jackfrost/new_jackfrost/new_jackfrost_02',
			texturePath: 'new_jackfrost/new_jackfrost/',
			// 1542, under /mineffect
			min: 'mineffect/new_jackfrost/new_jackfrost_ice/new_jackfrost_02',
			minTexturePath: 'mineffect/new_jackfrost/new_jackfrost_ice/',
			attachedEntity: false
		}
	],

	ef_jackfrost: [
		{
			wav: 'jack_frost',
			attachedEntity: true
		},
		{
			// Official client (kRO 2025-07-16, use case 0xd1282d): ten 801 EF_FROSTDIVER3 on the caster, each a Frost
			// Diver path (builder 0xbadce0, variant 3: additive, deep blue flickering) to a point 80 units out, the
			// i-th at i x 36 + r(36) degrees; nothing under /mineffect. Effect 801 lives 150 ticks.
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const caster = Params.Init.ownerEntity;
				if (!caster || MapPreferences.mineffect) {
					return;
				}
				const at = [caster.position[0], caster.position[1], caster.position[2]];
				for (let i = 0; i < 10; i++) {
					const angle = ((i * 36 + Math.floor(Math.random() * 36)) * Math.PI) / 180;
					const spikes = planIcePath(80 * Math.cos(angle), 80 * Math.sin(angle));
					this.add(new IceSpikes(at, Params.Inst.startTick, spikes, ICE_PATH.life, { glow: true }), Params);
				}
			}
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

	// Shatter Storm (RL_S_STORM): official effect 1078 (RL_STORM\S_STORM.str) with the skilleffectinfo
	// row's RL_S_STORM.wav, on the target as each damage packet arrives. data.grf has no S_STORM.str at
	// the effect root. See effect-port/rebellion-skills.md.
	ef_s_storm: [
		{
			//EF_S_STORM (1078)
			type: 'STR',
			file: 'rl_storm/s_storm',
			texturePath: 'rl_storm/',
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

	// Secrament (AB_SECRAMENT), from the client's own effect folders.
	ef_ab_secrament: [
		{
			type: 'STR',
			file: 'new_secrament/new_secrament/new_secrament',
			texturePath: 'new_secrament/new_secrament/'
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

	1418: [
		{
			// Comet's cast aura (kRO 2025-07-16, CRagEffect 0xbc0a31): on its first tick EF_BeginSpell.wav and one
			// cast-aura ring (builder 0xbfa8b0, size 45, argument 20: tinted (10, 66, 114), additive) in
			// new_comet\\new_comet_cast_ring\\ring_rainbow.tga, for the cast time (CastRingSim.js).
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
						'new_comet/new_comet_cast_ring/ring_rainbow.tga',
						[20],
						{ sizes: [45], castTimeOnly: true }
					),
					Params
				);
			}
		}
	],

	// Comet (WL_COMET) cast floor, with 1421: on the caster for the cast time. See effect-port/warlock-skills.md.
	1415: [
		{
			//(1415): CEZ2STREffect, new_comet\\new_comet_cast_bottom\\new_comet_cast_bottom.str
			type: 'STR',
			file: 'new_comet/new_comet_cast_bottom/new_comet_cast_bottom',
			texturePath: 'new_comet/new_comet_cast_bottom/',
			renderBeforeEntities: true,
			castLoop: true,
			attachedEntity: true
		}
	],

	// Comet (WL_COMET) cast, with 1415. See effect-port/warlock-skills.md.
	1421: [
		{
			//(1421): CEZ2STREffect, new_comet\\new_comet_cast\\new_comet_cast.str
			type: 'STR',
			file: 'new_comet/new_comet_cast/new_comet_cast',
			texturePath: 'new_comet/new_comet_cast/',
			castLoop: true,
			attachedEntity: true
		}
	],

	// Comet (WL_COMET), with 1414: on each target as its damage packet arrives. See effect-port/warlock-skills.md.
	1413: [
		{
			//(1413): CEZ2STREffect, new_comet\\new_comet\\new_comet.str
			type: 'STR',
			file: 'new_comet/new_comet/new_comet',
			texturePath: 'new_comet/new_comet/',
			wav: 'effect/g\xc5\xa9\xb7\xb9\xc0\xcc\xc1\xf6\xc0\xa7\xb5\xe5', // effect/g크레이지위드
			attachedEntity: true
		}
	],

	// Comet (WL_COMET) floor, with 1413. See effect-port/warlock-skills.md.
	1414: [
		{
			//(1414): CEZ2STREffect, new_comet\\new_comet_bottom\\new_comet_bottom.str
			type: 'STR',
			file: 'new_comet/new_comet_bottom/new_comet_bottom',
			texturePath: 'new_comet/new_comet_bottom/',
			renderBeforeEntities: true,
			attachedEntity: true
		}
	],

	// Comet (WL_COMET) sub explosion, with 1417: on the target with the 2nd, 4th, 6th ... hit. See effect-port/warlock-skills.md.
	1416: [
		{
			//(1416): CEZ2STREffect, new_comet\\new_comet_sub_explosion\\new_comet_sub_explosion.str
			type: 'STR',
			file: 'new_comet/new_comet_sub_explosion/new_comet_sub_explosion',
			texturePath: 'new_comet/new_comet_sub_explosion/',
			min: 'mineffect/new_comet/new_comet_sub_explosion/new_comet_sub_explosion',
			minTexturePath: 'mineffect/new_comet/new_comet_sub_explosion/',
			attachedEntity: true
		}
	],

	// Comet (WL_COMET) sub explosion floor, with 1416. See effect-port/warlock-skills.md.
	1417: [
		{
			//(1417): CEZ2STREffect, new_comet\\new_comet_sub_explosion_bottom\\new_comet_sub_explosion_bottom.str
			type: 'STR',
			file: 'new_comet/new_comet_sub_explosion_bottom/new_comet_sub_explosion_bottom',
			texturePath: 'new_comet/new_comet_sub_explosion_bottom/',
			min: 'mineffect/new_comet/new_comet_sub_explosion_bottom/new_comet_sub_explosion_bottom',
			minTexturePath: 'mineffect/new_comet/new_comet_sub_explosion_bottom/',
			renderBeforeEntities: true,
			attachedEntity: true
		}
	]
};
