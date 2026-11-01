/**
 * @module DB/Effects/Table/Effects1100
 *
 * Effects 1100 to 1199 of the effect table. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep rows in effect ID order.
 */

import LightSphereEffect from 'DB/Effects/LightSphereEffect.js';
import CasterMarks from 'Renderer/Effects/CasterMarks.js';
import { PRIM_TICK_MS } from 'Renderer/Effects/EffectPrimSim.js';

export default {
	1120: [
		{
			//Ground Drift grenade (neutral). Official client: looping sprite on the unit.
			type: 'SPR',
			file: '\xb1\xd7\xb6\xf3\xbf\xee\xb5\xe5\xb5\xe5\xb8\xae\xc7\xc1\xc6\xae', // 그라운드드리프트
			attachedEntity: true
		}
	],

	1130: [
		{
			//EF_BAKURETSU_HADOU - Hat effect example (SPR)
			type: 'SPR',
			file: 'bakuretsu_hadou/bakuretsu_hadou',
			texturePath: 'bakuretsu_hadou/',
			attachedEntity: true,
			repeat: true,
			head: true,
			yOffset: -50
		}
	],

	1111: [
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function EffectBodyColor(Params) {
				const entity = Params.Init.ownerEntity;
				entity._flashColor[0] = 1.0;
				entity._flashColor[1] = 0.0;
				entity._flashColor[2] = 0.0;
				entity._flashColor[3] = 0.0;
				entity.recalculateBlendingColor();

				entity.animations.add(function (tick) {
					entity._flashColor[3] = 0.0 + tick / 100;
					entity.recalculateBlendingColor();
					if (tick > 300) {
						entity._flashColor[0] = 1.0;
						entity._flashColor[1] = 1.0;
						entity._flashColor[2] = 1.0;
						entity._flashColor[3] = 1.0;
						entity.recalculateBlendingColor();
						return true;
					}
				});
			}
		}
	],

	1186: [
		{
			type: 'STR',
			file: 'new_dropitem/dropitem_pink/dropitem_pink/dropitem_pink',
			texturePath: 'new_dropitem/dropitem_pink/dropitem_pink/',
			renderBeforeEntities: true
		},
		{
			type: 'STR',
			file: 'new_dropitem/dropitem_pink/dropitem_pink_bottom/dropitem_pink_bottom',
			texturePath: 'new_dropitem/dropitem_pink/dropitem_pink_bottom/',
			renderBeforeEntities: true
		},
		{
			wav: 'effect/drop_pink'
		}
	],
	1189: [
		{
			type: 'STR',
			file: 'new_dropitem/dropitem_yellow/dropitem_yellow/dropitem_yellow',
			texturePath: 'new_dropitem/dropitem_yellow/dropitem_yellow/'
		},
		{
			type: 'STR',
			file: 'new_dropitem/dropitem_yellow/dropitem_yellow_bottom/dropitem_yellow_bottom',
			texturePath: 'new_dropitem/dropitem_yellow/dropitem_yellow_bottom/'
		},
		{
			wav: 'effect/drop_yellow'
		}
	],
	1190: [
		{
			type: 'STR',
			file: 'new_dropitem/dropitem_purple/dropitem_purple/dropitem_purple',
			texturePath: 'new_dropitem/dropitem_purple/dropitem_purple/'
		},
		{
			type: 'STR',
			file: 'new_dropitem/dropitem_purple/dropitem_purple_bottom/dropitem_purple_bottom',
			texturePath: 'new_dropitem/dropitem_purple/dropitem_purple_bottom/'
		},
		{
			wav: 'effect/drop_purple'
		}
	],

	// Chase Walk's cast aura (official client): EF_BeginSpell.wav, and for the cast time the
	// caster turns round faster and faster while it can be seen; no ring (CasterMarks.js).
	1195: [
		{
			type: 'FUNC',
			attachedEntity: true,
			castLoop: true,
			wav: 'effect/ef_beginspell',
			func: function (Params) {
				this.add(
					new CasterMarks(
						Params.Init.ownerEntity,
						Params.Inst.startTick,
						Math.round(Params.Init.duration / PRIM_TICK_MS),
						1195
					),
					Params
				);
			}
		}
	],

	// H_MINE status: the mine on the actor while the status is on (official effect 1139, kept alive
	// while its owner lives, removed when the status ends).
	1139: [
		{
			//EF_H_MINE
			type: 'STR',
			file: 'rl_h_mine/mine',
			texturePath: 'rl_h_mine/',
			repeat: true,
			attachedEntity: true
		}
	],

	// Rich's Coin (RL_RICHS_COIN): official effect 1134, launched on the caster when the use packet has
	// the result set (skilleffectinfo effectID). See effect-port/rebellion-skills.md.
	1134: [
		{
			//EF_RICHS_COIN_A
			type: 'STR',
			file: 'rl_richs_coin_a/reachs',
			texturePath: 'rl_richs_coin_a/',
			attachedEntity: true
		}
	],

	// ANTI_M_BLAST status: official effect 1136 on the actor while the status is on (kept alive while its
	// owner lives, removed when the status ends).
	1136: [
		{
			//EF_ANTI_M_BLAST
			type: 'STR',
			file: 'rl_anti_material/anti',
			texturePath: 'rl_anti_material/',
			repeat: true,
			attachedEntity: true
		}
	],

	// Light of the Sun / Moon / Stars spheres (1197-1199, CLightSphereEffect): LightSphereEffect.js.
	...LightSphereEffect
};
