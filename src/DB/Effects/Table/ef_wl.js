/**
 * @module DB/Effects/Table/ef_wl
 *
 * The effect table's named ef_wl_* rows. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep a skill's rows together.
 */

import { spamTetraSubExplosions } from 'DB/Effects/TetraVortexEffect.js';
import { hellInfernoSubOffsets } from 'DB/Effects/HellInfernoEffect.js';
import { jackFrostShardsEffect } from 'DB/Effects/JackFrostEffect.js';

export default {
	// Telekinesis Intense (WL_TELEKINESIS_INTENSE): the use packet's sound, on the caster. See effect-port/warlock-skills.md.
	ef_wl_telekinesis_intense_sound: [
		{
			wav: 'effect/wl_telekinesis_intense',
			attachedEntity: true
		}
	],

	// Jack Frost (WL_JACKFROST) ice shards: three of 1443-1445 round the target of each damage packet
	// (JackFrostEffect.js). See effect-port/warlock-skills.md.
	ef_wl_jackfrost_shards: jackFrostShardsEffect,

	// Recognized Spell (WL_RECOGNIZEDSPELL): the use-packet sound, on the caster. See effect-port/warlock-skills.md.
	ef_wl_recognizedspell_sound: [
		{
			wav: 'effect/wl_recognizedspell',
			attachedEntity: true
		}
	],

	// Crimson Rock (WL_CRIMSONROCK): the damage-arrival sound, on the target. See effect-port/warlock-skills.md.
	ef_wl_crimsonrock_sound: [
		{
			wav: 'crimson_r',
			attachedEntity: true
		}
	],

	// Hell Inferno (WL_HELLINFERNO) side flames: 1553 + 1554 (floor) at four points 15 units from the target,
	// at 45 + 90 i degrees, as the damage arrives; they stay where they start. See effect-port/warlock-skills.md.
	ef_wl_hellinferno_sub: [
		{
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				const position = Params.Inst.position;
				if (!position) {
					return;
				}
				hellInfernoSubOffsets().forEach(([dx, dy]) => {
					[1553, 1554].forEach(effectId => {
						this.spam({
							effectId,
							position: [position[0] + dx, position[1] + dy, position[2]],
							startTick: Params.Inst.startTick
						});
					});
				});
			}
		}
	],

	// Tetra Vortex elements (WL_TETRAVORTEX_FIRE ... _GROUND): the three use-packet sounds, on the caster. See effect-port/warlock-skills.md.
	ef_wl_tetravortex_sound: [
		{
			wav: 'effect/wizard_meteo',
			attachedEntity: true
		},
		{
			wav: 'effect/hunter_blastmine',
			attachedEntity: true
		},
		{
			wav: 'effect/wl_tetravortex',
			attachedEntity: true
		}
	],

	// Tetra Vortex Fire / Water / Wind / Earth sub explosions: four free-standing copies of 1278 / 1279 / 1280 / 1281,
	// one in each quarter round the target, 10-34 units out along each axis and 5 up (TetraVortexEffect.js).
	// See effect-port/warlock-skills.md.
	ef_wl_tetravortex_sub_fire: [
		{
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				spamTetraSubExplosions(this, Params, 1278);
			}
		}
	],

	ef_wl_tetravortex_sub_water: [
		{
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				spamTetraSubExplosions(this, Params, 1279);
			}
		}
	],

	ef_wl_tetravortex_sub_wind: [
		{
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				spamTetraSubExplosions(this, Params, 1280);
			}
		}
	],

	ef_wl_tetravortex_sub_earth: [
		{
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				spamTetraSubExplosions(this, Params, 1281);
			}
		}
	],

	// Summon Fire Ball / Lightning Ball / Water Ball / Stone: EF_BeginSpell.wav, played once as the cast starts. See effect-port/warlock-skills.md.
	ef_wl_summon_cast_sound: [
		{
			wav: 'effect/ef_beginspell',
			attachedEntity: true
		}
	]
};
