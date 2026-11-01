/**
 * @module DB/Effects/Table/Jobs/Archer/MinstrelWanderer
 *
 * The Archer line's MinstrelWanderer effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

export default {
	//846: [{}],	//EF_WATER_SMOKE	   (Nothing)

	847: [
		{
			//EF_DANCE1	   Gloomy Day (white/red light rays)
			wav: 'effect/\xbc\xf6\xc1\xdd\xc0\xba\xc7\xcf\xb7\xe7\xc0\xc7\xbf\xec\xbf\xef'
		}
	],

	//848: [{}],	//EF_DANCE2	   Gloomy Day (white/blue light rays)
	//849: [{}],	//EF_LINKPARTICLE	   (Nothing)
	//850: [{}],	//EF_SOULLIGHT2	   (Nothing)
	//851: [{}],	//EF_SPR_PARTICLE	   Green mushy-foggy stuff (dull)
	//852: [{}],	//EF_SPR_PARTICLE2	   Green mushy-foggy stuff (bright)
	//853: [{}],	//EF_SPR_PLANT	   Bright green flower area
	//854: [{}],	//EF_CHEMICAL_V	   Blue beam of light with notes
	//855: [{}],	//EF_SHOOTPARTICLE	   (Nothing)

	856: [
		{
			//EF_BOT_REVERB	   Reverberation (red eighth notes)
			type: '3D',
			file: 'effect/melody_b.bmp',
			red: 1,
			green: 0.6,
			blue: 0.6,
			alphaMax: 0.6,
			attachedEntity: true,
			duration: 100,
			size: 50,
			posz: 0.5,
			repeat: true
		},
		{
			wav: 'effect/reverberation'
		}
	],

	857: [
		{
			//EF_RAIN_PARTICLE	   Severe Rainstorm (falling red and blue beams)
			wav: 'effect/rainstorm'
		}
	],

	858: [
		{
			//EF_CHEMICAL_V2	   Deep Sleep Lullaby (two red beams and music notes)
			wav: 'effect/\xbe\xc8\xbd\xc4\xc0\xc7\xc0\xda\xc0\xe5\xb0\xa1'
		}
	],

	//859: [{}],	//EF_SECRA	   Holograph of text (blue)

	860: [
		{
			//EF_BOT_REVERB2	   Distorted note (blue)
			type: '3D',
			file: 'effect/melody_a.bmp',
			red: 0.6,
			green: 0.6,
			blue: 1,
			alphaMax: 0.6,
			attachedEntity: true,
			duration: 100,
			size: 50,
			posz: 0.5,
			repeat: true
		},
		{
			wav: 'effect/\xb3\xaa\xb6\xf4\xc0\xc7\xb3\xeb\xb7\xa1'
		}
	],

	861: [
		{
			//EF_CIRCLEPOWER2	   Green aura (from Circle of Life's Melody)
			wav: 'effect/\xbc\xf8\xc8\xaf\xc7\xcf\xb4\xc2\xc0\xda\xbf\xac\xc0\xc7\xbc\xd2\xb8\xae'
		}
	],

	862: [
		{
			//EF_SECRA2	   Randomize Spell (holograph of text)
			attachedEntity: true,
			wav: 'effect/ab_ancilla'
		},
		{
			alphaMax: 0.3,
			blendMode: 2,
			red: 1.0,
			green: 0.55,
			blue: 0.55,
			attachedEntity: true,
			duration: 1500,
			fadeIn: true,
			fadeOut: true,
			posz: 7,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 850,
			zIndex: 10,
			type: '3D',
			file: 'effect/priest_spell.bmp'
		},
		{
			alphaMax: 0.3,
			blendMode: 2,
			red: 1.0,
			green: 0.6,
			blue: 0.6,
			attachedEntity: true,
			duration: 1500,
			fadeIn: true,
			fadeOut: true,
			posz: 7,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 800,
			zIndex: 10,
			type: '3D',
			file: 'effect/priest_spell.bmp'
		},
		{
			alphaMax: 0.3,
			blendMode: 2,
			red: 1.0,
			green: 0.65,
			blue: 0.65,
			attachedEntity: true,
			duration: 1500,
			fadeIn: true,
			fadeOut: true,
			posz: 7,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 750,
			zIndex: 10,
			type: '3D',
			file: 'effect/priest_spell.bmp'
		},
		{
			alphaMax: 0.3,
			blendMode: 2,
			red: 1.0,
			green: 0.7,
			blue: 0.7,
			attachedEntity: true,
			duration: 1500,
			fadeIn: true,
			fadeOut: true,
			posz: 7,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 700,
			zIndex: 10,
			type: '3D',
			file: 'effect/priest_spell.bmp'
		},
		{
			alphaMax: 0.3,
			blendMode: 2,
			red: 1.0,
			green: 0.75,
			blue: 0.75,
			attachedEntity: true,
			duration: 1500,
			fadeIn: true,
			fadeOut: true,
			posz: 7,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 650,
			zIndex: 10,
			type: '3D',
			file: 'effect/priest_spell.bmp'
		},
		{
			alphaMax: 0.3,
			blendMode: 2,
			red: 1.0,
			green: 0.8,
			blue: 0.8,
			attachedEntity: true,
			duration: 1500,
			fadeIn: true,
			fadeOut: true,
			posz: 7,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 600,
			zIndex: 10,
			type: '3D',
			file: 'effect/priest_spell.bmp'
		},
		{
			alphaMax: 0.3,
			blendMode: 2,
			red: 1.0,
			green: 0.85,
			blue: 0.85,
			attachedEntity: true,
			duration: 1500,
			fadeIn: true,
			fadeOut: true,
			posz: 7,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 550,
			zIndex: 10,
			type: '3D',
			file: 'effect/priest_spell.bmp'
		},
		{
			alphaMax: 0.3,
			blendMode: 2,
			red: 1.0,
			green: 0.9,
			blue: 0.9,
			attachedEntity: true,
			duration: 1500,
			fadeIn: true,
			fadeOut: true,
			posz: 7,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 500,
			zIndex: 10,
			type: '3D',
			file: 'effect/priest_spell.bmp'
		},
		{
			alphaMax: 0.3,
			blendMode: 2,
			red: 1.0,
			green: 0.95,
			blue: 0.95,
			attachedEntity: true,
			duration: 1500,
			fadeIn: true,
			fadeOut: true,
			posz: 7,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 450,
			zIndex: 10,
			type: '3D',
			file: 'effect/priest_spell.bmp'
		},
		{
			alphaMax: 0.3,
			blendMode: 2,
			red: 1.0,
			green: 1.0,
			blue: 1.0,
			attachedEntity: true,
			duration: 1500,
			fadeIn: true,
			fadeOut: true,
			posz: 7,
			sizeEnd: 100,
			sizeSmooth: true,
			sizeStart: 400,
			zIndex: 10,
			type: '3D',
			file: 'effect/priest_spell.bmp'
		}
	],

	//863: [{}],	//EF_CHEMICAL_V3	   Dominion Impulse (two spears of light)
	//864: [{}],	//EF_ENERVATION7	   Gloomy Day (colorful lines)
	//865: [{}],	//EF_CIRCLEPOWER3	   Blue aura (from Song of Mana)

	866: [
		{
			//EF_SPR_PLANT2	   Dance with a Warg (Wargs)
			wav: 'effect/\xbf\xf6\xb1\xd7\xbf\xcd\xc7\xd4\xb2\xb2\xc3\xe3\xc0\xbb'
		}
	],

	//867: [{}],	//EF_CIRCLEPOWER4	   Yellow aura (from Dance with a Warg)

	868: [
		{
			//EF_SPR_PLANT3	   Song of Mana (Violies)
			wav: 'effect/\xb8\xb6\xb3\xaa\xc0\xc7\xb3\xeb\xb7\xa1'
		}
	],

	//869: [{}],	//EF_RG_COIN6	   Strip sound [S]

	870: [
		{
			//EF_SPR_PLANT4	   Ghostly Succubuses of fire
			wav: 'effect/\xbb\xf5\xc5\xcd\xb5\xa5\xc0\xcc\xb3\xaa\xc0\xcc\xc6\xae\xc7\xc7\xb9\xf6'
		}
	],

	//871: [{}],	//EF_CIRCLEPOWER5	   Red aura (from Lerad's Dew)

	872: [
		{
			//EF_SPR_PLANT5	   Lerad's Dew (Minerals)
			wav: 'effect/\xb7\xb9\xb6\xf3\xb5\xe5\xc0\xc7\xc0\xcc\xbd\xbd'
		}
	],

	//873: [{}],	//EF_CIRCLEPOWER6	   Stargate-wormhole stuff (bright purple)

	874: [
		{
			//EF_SPR_PLANT6	   Melody of Sink (Ktullanuxes)
			wav: 'effect/\xb8\xe1\xb7\xce\xb5\xf0\xbf\xc0\xba\xea\xbd\xcc\xc5\xa9' //'effect/\xb3\xaa\xb6\xf4\xc0\xc7\xb3\xeb\xb7\xa1'
		}
	],

	//875: [{}],	//EF_CIRCLEPOWER7	   Stargate-wormhole stuff (bright turquoise)

	876: [
		{
			//EF_SPR_PLANT7	   Warcry of Beyond (Garms)
			wav: 'effect/\xba\xf1\xbf\xe6\xb5\xe5\xbf\xc0\xba\xea\xbf\xf6\xc5\xa9\xb6\xf3\xc0\xcc'
		}
	],

	//877: [{}],	//EF_CIRCLEPOWER8	   Stargate-wormhole stuff (white)

	878: [
		{
			//EF_SPR_PLANT8	   Unlimited Humming Voice (Miyabi Ningyos)
			wav: 'effect/\xbe\xf0\xb8\xae\xb9\xcc\xc6\xbc\xb5\xe5\xc7\xe3\xb9\xd6\xba\xb8\xc0\xcc\xbd\xba'
		}
	],

	879: [
		{
			//EF_HEARTASURA	   Siren's Voice (heart-like)
			wav: 'effect/\xbc\xbc\xc0\xcc\xb7\xbb\xc0\xc7\xb8\xf1\xbc\xd2\xb8\xae'
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

	ef_metalicsound: [
		{
			wav: 'effect/metalic',
			attachedEntity: true
		}
	],

	ef_frigg_song: [
		{
			wav: 'effect/wm_frigg_song',
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

	// Metallic Sound (WM_METALICSOUND), from the client's own effect folders.
	ef_wm_metalicsound: [
		{
			type: 'STR',
			file: 'new_metalicsound/new_metalicsound/new_metalicsound',
			texturePath: 'new_metalicsound/new_metalicsound/'
		},
		{
			type: 'STR',
			file: 'new_metalicsound/new_metalicsound_bottom/new_metalicsound_bottom',
			texturePath: 'new_metalicsound/new_metalicsound_bottom/',
			renderBeforeEntities: true
		}
	],

	// Metallic Sound (WM_METALICSOUND), from the client's own effect folders.
	ef_wm_metalicsound_hit: [
		{
			type: 'STR',
			file: 'new_metalicsound/new_metalicsound_hit/new_metalicsound_hit',
			texturePath: 'new_metalicsound/new_metalicsound_hit/'
		}
	],

	// Reverberation Magic (WM_REVERBERATION_MAGIC), from the client's own effect folders.
	ef_wm_reverberation_magic_hit: [
		{
			type: 'STR',
			file: 'new_reverberation/new_reverberation_hit/new_reverberation_hit',
			texturePath: 'new_reverberation/new_reverberation_hit/'
		}
	],

	// Severe Rainstorm (WM_SEVERE_RAINSTORM), from the client's own effect folders.
	ef_wm_severe_rainstorm: [
		{
			type: 'STR',
			file: 'new_severerainstorm/new_severerainstorm/new_severerainstorm',
			texturePath: 'new_severerainstorm/new_severerainstorm/'
		}
	],

	// Severe Rainstorm (WM_SEVERE_RAINSTORM), from the client's own effect folders.
	ef_wm_severe_rainstorm_cast: [
		{
			type: 'STR',
			file: 'new_severerainstorm/new_severerainstorm_cast/new_severerainstorm_cast',
			texturePath: 'new_severerainstorm/new_severerainstorm_cast/'
		}
	],

	// Sound of Destruction (WM_SOUND_OF_DESTRUCTION), from the client's own effect folders.
	ef_wm_sound_of_destruction_cast: [
		{
			type: 'STR',
			file: 'new_soundofdestruction/new_soundofdestruction_cast/new_soundofdestruction_cast',
			texturePath: 'new_soundofdestruction/new_soundofdestruction_cast/'
		},
		{
			type: 'STR',
			file: 'new_soundofdestruction/new_soundofdestruction_cast_bottom/new_soundofdestruction_cast_bottom',
			texturePath: 'new_soundofdestruction/new_soundofdestruction_cast_bottom/',
			renderBeforeEntities: true
		}
	],

	// Unlimited Humming Voice (WM_UNLIMITED_HUMMING_VOICE), from the client's own effect folders.
	ef_wm_unlimited_humming_voice: [
		{
			type: 'STR',
			file: 'new_unlimit/new_unlimit/new_unlimit',
			texturePath: 'new_unlimit/new_unlimit/'
		},
		{
			type: 'STR',
			file: 'new_unlimit/new_unlimit_bottom/new_unlimit_bottom',
			texturePath: 'new_unlimit/new_unlimit_bottom/',
			renderBeforeEntities: true
		}
	],

	// Severe Rainstorm Melee (WM_SEVERE_RAINSTORM_MELEE), from the client's own effect folders.
	ef_wm_severe_rainstorm_melee: [
		{
			type: 'STR',
			file: 'new_severerainstorm/new_severerainstorm/new_severerainstorm',
			texturePath: 'new_severerainstorm/new_severerainstorm/'
		}
	],

	// Severe Rainstorm Melee (WM_SEVERE_RAINSTORM_MELEE), from the client's own effect folders.
	ef_wm_severe_rainstorm_melee_cast: [
		{
			type: 'STR',
			file: 'new_severerainstorm/new_severerainstorm_cast/new_severerainstorm_cast',
			texturePath: 'new_severerainstorm/new_severerainstorm_cast/'
		}
	]
};
