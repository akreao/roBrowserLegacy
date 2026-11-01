/**
 * @module DB/Effects/Table/Effects1500
 *
 * Effects 1500 to 1599 of the effect table. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep rows in effect ID order.
 */

import { nyangGrassEffects } from 'DB/Effects/NyangGrassEffect.js';
import { carrotBeatEffects } from 'DB/Effects/CarrotBeatEffect.js';
import CastRing from 'Renderer/Effects/CastRing.js';

export default {
	// Soul Expansion (WL_SOULEXPANSION) cast, with 1588: the client plays it on the caster for the cast time. See effect-port/warlock-skills.md.
	1587: [
		{
			//(1587): CEZ2STREffect, new_soulexpansion\\new_soulexpansion_cast\\new_soulexpansion_cast.str
			type: 'STR',
			file: 'new_soulexpansion/new_soulexpansion_cast/new_soulexpansion_cast',
			texturePath: 'new_soulexpansion/new_soulexpansion_cast/',
			min: 'mineffect/new_soulexpansion/new_soulexpansion_cast/new_soulexpansion_cast',
			minTexturePath: 'mineffect/new_soulexpansion/new_soulexpansion_cast/',
			castLoop: true,
			wav: 'effect/ef_beginspell',
			soundLoop: false,
			attachedEntity: true
		}
	],

	// Soul Expansion (WL_SOULEXPANSION) cast floor, with 1587. See effect-port/warlock-skills.md.
	1588: [
		{
			//(1588): CEZ2STREffect, new_soulexpansion\\new_soulexpansion_cast_bottom\\new_soulexpansion_cast_bottom.str
			type: 'STR',
			file: 'new_soulexpansion/new_soulexpansion_cast_bottom/new_soulexpansion_cast_bottom',
			texturePath: 'new_soulexpansion/new_soulexpansion_cast_bottom/',
			min: 'mineffect/new_soulexpansion/new_soulexpansion_cast_bottom/new_soulexpansion_cast_bottom',
			minTexturePath: 'mineffect/new_soulexpansion/new_soulexpansion_cast_bottom/',
			renderBeforeEntities: true,
			castLoop: true,
			attachedEntity: true
		}
	],

	// Soul Expansion (WL_SOULEXPANSION) hit flash: every hit. See effect-port/warlock-skills.md.
	1591: [
		{
			//(1591): CEZ2STREffect, new_soulexpansion\\new_soulexpansion_hit\\new_soulexpansion_hit.str
			type: 'STR',
			file: 'new_soulexpansion/new_soulexpansion_hit/new_soulexpansion_hit',
			texturePath: 'new_soulexpansion/new_soulexpansion_hit/',
			min: 'mineffect/new_soulexpansion/new_soulexpansion_hit/new_soulexpansion_hit',
			minTexturePath: 'mineffect/new_soulexpansion/new_soulexpansion_hit/',
			attachedEntity: true
		}
	],

	// Soul Expansion (WL_SOULEXPANSION) hit-map effect: the first hit of each damage packet. See effect-port/warlock-skills.md.
	1592: [
		{
			//(1592): CEZ2STREffect, new_soulexpansion\\new_soulexpansion_hit_bottom\\new_soulexpansion_hit_bottom.str
			type: 'STR',
			file: 'new_soulexpansion/new_soulexpansion_hit_bottom/new_soulexpansion_hit_bottom',
			texturePath: 'new_soulexpansion/new_soulexpansion_hit_bottom/',
			min: 'mineffect/new_soulexpansion/new_soulexpansion_hit_bottom/new_soulexpansion_hit_bottom',
			minTexturePath: 'mineffect/new_soulexpansion/new_soulexpansion_hit_bottom/',
			renderBeforeEntities: true,
			wav: 'effect/\xb8\xc5\xc1\xf7 \xc5\xa9\xb7\xa1\xbd\xac', // effect/매직 크래쉬
			attachedEntity: true
		}
	],

	// Hell Inferno (WL_HELLINFERNO) cast floor: on the caster for the cast time. See effect-port/warlock-skills.md.
	1552: [
		{
			//(1552): CEZ2STREffect, new_hellInferno\\new_hellInferno_cast_bottom\\new_hellInferno_cast_bottom.str
			type: 'STR',
			file: 'new_hellinferno/new_hellinferno_cast_bottom/new_hellinferno_cast_bottom',
			texturePath: 'new_hellinferno/new_hellinferno_cast_bottom/',
			min: 'mineffect/new_hellinferno/new_hellinferno_cast_bottom/new_hellinferno_cast_bottom',
			minTexturePath: 'mineffect/new_hellinferno/new_hellinferno_cast_bottom/',
			renderBeforeEntities: true,
			castLoop: true,
			wav: 'effect/ef_beginspell',
			soundLoop: false,
			attachedEntity: true
		}
	],

	// Hell Inferno (WL_HELLINFERNO), with 1551: on the target when the damage arrives. See effect-port/warlock-skills.md.
	1550: [
		{
			//(1550): CEZ2STREffect, new_hellInferno\\new_hellInferno\\new_hellInferno.str
			type: 'STR',
			file: 'new_hellinferno/new_hellinferno/new_hellinferno',
			texturePath: 'new_hellinferno/new_hellinferno/',
			min: 'mineffect/new_hellinferno/new_hellinferno/new_hellinferno',
			minTexturePath: 'mineffect/new_hellinferno/new_hellinferno/',
			wav: 'hell_in',
			attachedEntity: true
		}
	],

	// Hell Inferno (WL_HELLINFERNO) floor, with 1550. See effect-port/warlock-skills.md.
	1551: [
		{
			//(1551): CEZ2STREffect, new_hellInferno\\new_hellInferno_bottom\\new_hellInferno_bottom.str
			type: 'STR',
			file: 'new_hellinferno/new_hellinferno_bottom/new_hellinferno_bottom',
			texturePath: 'new_hellinferno/new_hellinferno_bottom/',
			min: 'mineffect/new_hellinferno/new_hellinferno_bottom/new_hellinferno_bottom',
			minTexturePath: 'mineffect/new_hellinferno/new_hellinferno_bottom/',
			renderBeforeEntities: true,
			attachedEntity: true
		}
	],

	1553: [
		{
			//(1553): CEZ2STREffect, new_hellInferno\\new_hellInferno_sub\\new_hellInferno_sub.str
			type: 'STR',
			file: 'new_hellinferno/new_hellinferno_sub/new_hellinferno_sub',
			texturePath: 'new_hellinferno/new_hellinferno_sub/',
			min: 'mineffect/new_hellinferno/new_hellinferno_sub/new_hellinferno_sub',
			minTexturePath: 'mineffect/new_hellinferno/new_hellinferno_sub/',
			attachedEntity: false
		}
	],

	1554: [
		{
			//(1554): CEZ2STREffect, new_hellInferno\\new_hellInferno_sub_bottom\\new_hellInferno_sub_bottom.str
			type: 'STR',
			file: 'new_hellinferno/new_hellinferno_sub_bottom/new_hellinferno_sub_bottom',
			texturePath: 'new_hellinferno/new_hellinferno_sub_bottom/',
			min: 'mineffect/new_hellinferno/new_hellinferno_sub_bottom/new_hellinferno_sub_bottom',
			minTexturePath: 'mineffect/new_hellinferno/new_hellinferno_sub_bottom/',
			renderBeforeEntities: true,
			attachedEntity: false
		}
	],

	// Fear Breeze (RA_FEARBREEZE): on the caster when the use packet succeeds. See effect-port/ranger-skills.md.
	1549: [
		{
			//(1549): CEZ2STREffect, new_fearbreeze\\new_fearbreeze.str
			type: 'STR',
			file: 'new_fearbreeze/new_fearbreeze',
			texturePath: 'new_fearbreeze/',
			min: 'mineffect/new_fearbreeze/new_fearbreeze',
			minTexturePath: 'mineffect/new_fearbreeze/',
			attachedEntity: true
		}
	],

	// Empty Shadow (KG_KYOMU): the skilleffectinfo row plays t_에너지방출.wav and launches 1001 (허무의그림자.str) on the
	// target as each damage packet arrives. See effect-port/kagerou-oboro-skills.md.
	ef_kg_kyomu: [
		{
			//EF_KG_KYOMU (1001)
			type: 'STR',
			file: '\xc7\xe3\xb9\xab\xc0\xc7\xb1\xd7\xb8\xb2\xc0\xda', // 허무의그림자
			texturePath: '',
			wav: 'effect/t_\xbf\xa1\xb3\xca\xc1\xf6\xb9\xe6\xc3\xe2', // t_에너지방출
			attachedEntity: true
		}
	],

	// Distorted Crescent (OB_ZANGETSU): the skilleffectinfo row plays t_따듯한마법.wav and launches 1010 (초승달2.str) on the
	// target as each damage packet arrives. See effect-port/kagerou-oboro-skills.md.
	ef_ob_zangetsu: [
		{
			//EF_ZANGETSU (1010)
			type: 'STR',
			file: '\xc3\xca\xbd\xc2\xb4\xde2', // 초승달2
			texturePath: '',
			wav: 'effect/t_\xb5\xfb\xb5\xed\xc7\xd1\xb8\xb6\xb9\xfd', // t_따듯한마법
			attachedEntity: true
		}
	],

	// Moonlight Fantasy (OB_OBOROGENSOU): the skilleffectinfo row plays sign_up.wav and launches 1011 (흐린달빛환상2.str) on the
	// target as each damage packet arrives. See effect-port/kagerou-oboro-skills.md.
	ef_ob_gensou: [
		{
			//EF_GENSOU (1011)
			type: 'STR',
			file: '\xc8\xe5\xb8\xb0\xb4\xde\xba\xfb\xc8\xaf\xbb\xf32', // 흐린달빛환상2
			texturePath: '',
			wav: 'effect/sign_up', // sign_up
			attachedEntity: true
		}
	],

	// Ominous Moonlight (OB_AKAITSUKI): the skilleffectinfo row plays t_에너지방출.wav and launches 1009 (불길한붉은달빛.str) on the
	// target as each damage packet arrives. See effect-port/kagerou-oboro-skills.md.
	ef_ob_akaitsuki: [
		{
			//EF_AKAITSUKI (1009)
			type: 'STR',
			file: '\xba\xd2\xb1\xe6\xc7\xd1\xba\xd3\xc0\xba\xb4\xde\xba\xfb', // 불길한붉은달빛
			texturePath: '',
			wav: 'effect/t_\xbf\xa1\xb3\xca\xc1\xf6\xb9\xe6\xc3\xe2', // t_에너지방출
			attachedEntity: true
		}
	],

	// Shadow Warrior (KG_KAGEMUSYA): the skilleffectinfo row plays mon_금강불괴.wav and launches 169
	// (EF_ENERGYCOAT) on the target as each damage packet arrives. See effect-port/kagerou-oboro-skills.md.
	ef_kg_kagemusya_sound: [
		{
			wav: 'effect/mon_\xb1\xdd\xb0\xad\xba\xd2\xb1\xab', // mon_금강불괴
			attachedEntity: true
		}
	],

	// Lunatic Carrot Beat (SU_LUNATICCARROTBEAT / 2): the falling carrots
	// (DB/Effects/CarrotBeatEffect.js).
	...carrotBeatEffects,

	// Nyang Grass (SU_NYANGGRASS): the field the unit draws (DB/Effects/NyangGrassEffect.js).
	...nyangGrassEffects,

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
	1556: [
		{
			// Soul of Heaven and Earth cast: the cast-aura ring in ring_blue.tga, arguments
			// 20 and 21 (two blues, additive) (CastRingSim.js).
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
						'ring_blue.tga',
						[20, 21]
					),
					Params
				);
			}
		}
	],
	1565: [
		{
			// Circle of Directions and Elementals cast: the cast-aura ring in ring_yellow.tga,
			// argument 23 (light blue, additive) (CastRingSim.js).
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
						[23, 23]
					),
					Params
				);
			}
		}
	]
};
