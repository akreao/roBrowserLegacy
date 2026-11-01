/**
 * @module DB/Effects/Table/Jobs/Mage/Warlock
 *
 * The Mage line's Warlock effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

import Camera from 'Renderer/Camera.js';

export default {
	//723: [{}],	//EF_CHIMTO2	   Hundred Spear (sound effect)
	//724: [{}],	//EF_WINDCUTTER	   Green version of Detecting
	//725: [{}],	//EF_DETECT2	   Oratorio (like Detecting)
	726: [
		{
			//EF_FROSTMYSTY	   Frost Misty (blue vapor and bubbles)
			wav: 'effect/t_\xbf\xa1\xb3\xca\xc1\xf6\xb9\xe6\xc3\xe2'
		}
	],

	727: [
		{
			//EF_CRIMSON_STR	Crimson Rock
			type: 'STR',
			file: 'crimson_r',
			wav: 'effect/crimson_r',
			attachedEntity: true
		}
	],

	728: [
		{
			//EF_HELL_STR	Small fire (part of Hell Inferno)
			type: 'STR',
			file: 'hell_in',
			attachedEntity: true
		}
	],

	729: [
		{
			//EF_SPR_MASH	   Marsh of Abyss (like Close Confine)
			type: 'SPR',
			file: 'mashofa'
		}
	],

	732: [
		{
			//EF_EARTHWALL	   Spike from the ground
			type: 'QuadHorn',
			textureFile: 'effect/stone.bmp',
			attachedEntity: false,
			duration: 1000,
			height: [0.75, 1.2],
			offsetX: [0.2, 0.2],
			offsetY: [0.2, 0.2],
			offsetZ: -0.1,
			bottomSize: [0.4, 0.9],
			blendMode: 1,
			rotateY: [1, 360],
			rotateZ: [-8.0, 8.0],
			color: [1.0, 1.0, 1.0, 1.0],
			animation: 3,
			animationSpeed: 250,
			animationOut: true,
			wav: 'effect/wizard_earthspike'
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

	//733: [{}],	//EF_SOULBREAKER4	   Fluffy Ball flying by

	734: [
		{
			//EF_CHAINL_STR	Chain Lightning
			type: 'STR',
			file: 'chainlight',
			wav: 'effect/chainlight',
			attachedEntity: true
		}
	],

	//796: [{}],	//EF_GTHUNDER	   Spinning blue triangles
	//797: [{}],	//EF_STONERING	   Stapo
	//798: [{}],	//EF_INTIMIDATE2	   Red triangles (like Intimidate)
	799: [
		{
			//EF_STASIS	   Stasis (expanding blue mist) [S]
			wav: 'effect/wl_stasis'
		}
	],
	//800: [{}],	//EF_REDLINE	   Hell Inferno (red lights)
	//801: [{}],	//EF_FROSTDIVER3	   Jack Frost unit (ice spikes)

	802: [
		//EF_BOTTOM_BASILICA2	   White Imprison
		// F1=0, GI[0] - Alpha 65, Height 12.5
		{
			type: 'CYLINDER',
			textureName: 'alpha_down',
			totalCircleSides: 4,
			circleSides: 4,
			bottomSize: 2.2,
			topSize: 2.2,
			height: 3.0,
			alphaMax: 65 / 255,
			blendMode: 2,
			rotateWithCamera: true,
			duration: 20000,
			attachedEntity: true
		},
		{
			// F1=0, GI[1] - Alpha 65, Height 12.9
			type: 'CYLINDER',
			textureName: 'alpha_down',
			totalCircleSides: 4,
			circleSides: 4,
			bottomSize: 2.25,
			topSize: 2.25,
			height: 3.1,
			alphaMax: 65 / 255,
			blendMode: 2,
			rotateWithCamera: true,
			angleY: 10,
			duration: 20000,
			attachedEntity: true
		},
		{
			// F1=0, GI[2] - Alpha 15, Distance 0
			type: 'CYLINDER',
			textureName: 'alpha_down',
			totalCircleSides: 4,
			circleSides: 4,
			bottomSize: 2.3,
			topSize: 2.3,
			height: 3.0,
			alphaMax: 15 / 255,
			blendMode: 2,
			rotateWithCamera: true,
			duration: 20000,
			attachedEntity: true
		},
		{
			// F1=0, GI[3] - Alpha 15, Distance 53.2
			type: 'CYLINDER',
			textureName: 'alpha_down',
			totalCircleSides: 4,
			circleSides: 4,
			bottomSize: 2.3,
			topSize: 2.3,
			height: 3.0,
			alphaMax: 15 / 255,
			blendMode: 2,
			rotateWithCamera: true,
			angleY: 53.2,
			duration: 20000,
			attachedEntity: true
		},
		{
			wav: 'effect/wl_whiteimprison'
		}
	],

	803: [
		{
			//EF_RECOGNIZED	   Recognized Spell
			wav: 'effect/wl_recognizedspell'
		}
	],

	804: [
		{
			//EF_TETRA	   Tetra Vortex [S]
			wav: 'effect/wl_tetravortex'
		}
	],

	805: [
		{
			//EF_TETRACASTING	   Tetra Vortex cast animation (blinking colors)
			type: 'FUNC',
			attachedEntity: true,
			func: function EffectBodyColor(Params) {
				const entity = Params.Init.ownerEntity;
				entity.animations.add(function (tick) {
					if (!entity.cast.display) {
						//we don't know cast time here so.. let's hack
						entity._flashColor[0] = 1.0;
						entity._flashColor[1] = 1.0;
						entity._flashColor[2] = 1.0;
						entity._flashColor[3] = 1.0;
						entity.recalculateBlendingColor();
						return true;
					}
					entity._flashColor[0] = Math.random();
					entity._flashColor[1] = Math.random();
					entity._flashColor[2] = Math.random();
					entity._flashColor[3] = 0.5 + Math.random() / 2;
					entity.recalculateBlendingColor();
				});
			}
		}
	],

	1048: [
		{
			//EF_WL_TELEKINESIS_INTENSE
			type: 'STR',
			file: 'wl_telekinesis_intense',
			wav: 'effect/wl_telekinesis_intense',
			attachedEntity: true
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

	// Soul Expansion (WL_SOULEXPANSION), from the client's own effect folders.
	ef_wl_soulexpansion_cast: [
		{
			type: 'STR',
			file: 'new_soulexpansion/new_soulexpansion_cast/new_soulexpansion_cast',
			texturePath: 'new_soulexpansion/new_soulexpansion_cast/'
		},
		{
			type: 'STR',
			file: 'new_soulexpansion/new_soulexpansion_cast_bottom/new_soulexpansion_cast_bottom',
			texturePath: 'new_soulexpansion/new_soulexpansion_cast_bottom/',
			renderBeforeEntities: true
		}
	],

	// Soul Expansion (WL_SOULEXPANSION), from the client's own effect folders.
	ef_wl_soulexpansion_hit: [
		{
			type: 'STR',
			file: 'new_soulexpansion/new_soulexpansion_hit/new_soulexpansion_hit',
			texturePath: 'new_soulexpansion/new_soulexpansion_hit/'
		},
		{
			type: 'STR',
			file: 'new_soulexpansion/new_soulexpansion_hit_bottom/new_soulexpansion_hit_bottom',
			texturePath: 'new_soulexpansion/new_soulexpansion_hit_bottom/',
			renderBeforeEntities: true
		}
	],

	// Hell Inferno (WL_HELLINFERNO), from the client's own effect folders.
	ef_wl_hellinferno: [
		{
			type: 'STR',
			file: 'new_hellinferno/new_hellinferno/new_hellinferno',
			texturePath: 'new_hellinferno/new_hellinferno/'
		},
		{
			type: 'STR',
			file: 'new_hellinferno/new_hellinferno_bottom/new_hellinferno_bottom',
			texturePath: 'new_hellinferno/new_hellinferno_bottom/',
			renderBeforeEntities: true
		}
	],

	// Hell Inferno (WL_HELLINFERNO), from the client's own effect folders.
	ef_wl_hellinferno_cast: [
		{
			type: 'STR',
			file: 'new_hellinferno/new_hellinferno_cast_bottom/new_hellinferno_cast_bottom',
			texturePath: 'new_hellinferno/new_hellinferno_cast_bottom/',
			renderBeforeEntities: true
		}
	],

	// Comet (WL_COMET), from the client's own effect folders.
	ef_wl_comet: [
		{
			type: 'STR',
			file: 'new_comet/new_comet/new_comet',
			texturePath: 'new_comet/new_comet/'
		},
		{
			type: 'STR',
			file: 'new_comet/new_comet_bottom/new_comet_bottom',
			texturePath: 'new_comet/new_comet_bottom/',
			renderBeforeEntities: true
		}
	],

	// Comet (WL_COMET), from the client's own effect folders.
	ef_wl_comet_cast: [
		{
			type: 'STR',
			file: 'new_comet/new_comet_cast/new_comet_cast',
			texturePath: 'new_comet/new_comet_cast/'
		},
		{
			type: 'STR',
			file: 'new_comet/new_comet_cast_bottom/new_comet_cast_bottom',
			texturePath: 'new_comet/new_comet_cast_bottom/',
			renderBeforeEntities: true
		}
	],

	// Chain Lightning (WL_CHAINLIGHTNING), from the client's own effect folders.
	ef_wl_chainlightning_cast: [
		{
			type: 'STR',
			file: 'new_chainlightning/new_chainlightning_cast/new_chainlightning_cast',
			texturePath: 'new_chainlightning/new_chainlightning_cast/'
		},
		{
			type: 'STR',
			file: 'new_chainlightning/new_chainlightning_cast_bottom/new_chainlightning_cast_bottom',
			texturePath: 'new_chainlightning/new_chainlightning_cast_bottom/',
			renderBeforeEntities: true
		}
	],

	// Tetra Vortex Fire (WL_TETRAVORTEX_FIRE), from the client's own effect folders.
	ef_wl_tetravortex_fire: [
		{
			type: 'STR',
			file: 'mineffect/new_tetravortex/new_tetravortex_fire/new_tetravortex_fire',
			texturePath: 'mineffect/new_tetravortex/new_tetravortex_fire/'
		}
	],

	// Tetra Vortex Water (WL_TETRAVORTEX_WATER), from the client's own effect folders.
	ef_wl_tetravortex_water: [
		{
			type: 'STR',
			file: 'mineffect/new_tetravortex/new_tetravortex_water/new_tetravortex_water',
			texturePath: 'mineffect/new_tetravortex/new_tetravortex_water/'
		}
	],

	// Tetra Vortex Wind (WL_TETRAVORTEX_WIND), from the client's own effect folders.
	ef_wl_tetravortex_wind: [
		{
			type: 'STR',
			file: 'mineffect/new_tetravortex/new_tetravortex_wind/new_tetravortex_wind',
			texturePath: 'mineffect/new_tetravortex/new_tetravortex_wind/'
		}
	],

	// Summon Attack Fire (WL_SUMMON_ATK_FIRE), from the client's own effect folders.
	ef_wl_summon_atk_fire: [
		{
			type: 'STR',
			file: 'fire',
			texturePath: ''
		}
	]
};
