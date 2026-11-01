/**
 * @module DB/Effects/Table/Effects1600
 *
 * Effects 1600 to 1699 of the effect table. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep rows in effect ID order.
 */

import SonicWave from 'Renderer/Effects/SonicWave.js';
import { SET_AGES, WAVE_FRAMES, WAVE_TICK_MS } from 'Renderer/Effects/SonicWaveSim.js';

export default {
	// Sonic Wave (RK_SONICWAVE): official effect 1678 on the caster, aimed at the target, as the damage arrives.
	// On ages 0, 20 and 40 two ring sets (son_wave_01 and son_wave_00) drift from the caster to the target
	// (SonicWaveSim.js). See effect-port/sonic-wave.md.
	1678: [
		{
			type: 'FUNC',
			attachedEntity: false,
			// The rings' whole life, so sets culled off screen still expire
			duration: WAVE_FRAMES * WAVE_TICK_MS,
			func: function (Params) {
				const from = { entity: Params.Init.ownerEntity, position: Params.Inst.position };
				const to = { entity: Params.Init.otherEntity, position: Params.Inst.otherPosition };
				SET_AGES.forEach(age => {
					[1, 0].forEach(variant => {
						this.add(new SonicWave(variant, from, to, Params.Inst.startTick + age * WAVE_TICK_MS), Params);
					});
				});
			}
		}
	],

	// Chain Lightning (WL_CHAINLIGHTNING) cast, with 1636: on the caster for the cast time. See effect-port/warlock-skills.md.
	1635: [
		{
			//(1635): CEZ2STREffect, new_chainlightning\\new_chainlightning_cast\\new_chainlightning_cast.str
			type: 'STR',
			file: 'new_chainlightning/new_chainlightning_cast/new_chainlightning_cast',
			texturePath: 'new_chainlightning/new_chainlightning_cast/',
			min: 'mineffect/new_chainlightning/new_chainlightning_cast/new_chainlightning_cast',
			minTexturePath: 'mineffect/new_chainlightning/new_chainlightning_cast/',
			castLoop: true,
			wav: 'effect/ef_beginspell',
			soundLoop: false,
			attachedEntity: true
		}
	],

	// Chain Lightning (WL_CHAINLIGHTNING) cast floor, with 1635. See effect-port/warlock-skills.md.
	1636: [
		{
			//(1636): CEZ2STREffect, new_chainlightning\\new_chainlightning_cast_bottom\\new_chainlightning_cast_bottom.str
			type: 'STR',
			file: 'new_chainlightning/new_chainlightning_cast_bottom/new_chainlightning_cast_bottom',
			texturePath: 'new_chainlightning/new_chainlightning_cast_bottom/',
			min: 'mineffect/new_chainlightning/new_chainlightning_cast_bottom/new_chainlightning_cast_bottom',
			minTexturePath: 'mineffect/new_chainlightning/new_chainlightning_cast_bottom/',
			renderBeforeEntities: true,
			castLoop: true,
			attachedEntity: true
		}
	],

	// Chain Lightning (WL_CHAINLIGHTNING, WL_CHAINLIGHTNING_ATK): on the target when the damage arrives. See effect-port/warlock-skills.md.
	1638: [
		{
			//(1638): CEZ2STREffect, new_chainlightning\\new_chainlightning_target\\new_chainlightning_target.str
			type: 'STR',
			file: 'new_chainlightning/new_chainlightning_target/new_chainlightning_target',
			texturePath: 'new_chainlightning/new_chainlightning_target/',
			min: 'mineffect/new_chainlightning/new_chainlightning_target/new_chainlightning_target',
			minTexturePath: 'mineffect/new_chainlightning/new_chainlightning_target/',
			wav: 'chainlight',
			attachedEntity: true
		}
	],

	// Aimed Bolt (RA_AIMEDBOLT) cast floor: the client plays it on the caster for the cast time (no cast aura). See effect-port/ranger-skills.md.
	1649: [
		{
			//(1649): CEZ2STREffect, new_aimedbolt\\new_aimedbolt_cast_bottom\\new_aimedbolt_cast_bottom.str
			type: 'STR',
			file: 'new_aimedbolt/new_aimedbolt_cast_bottom/new_aimedbolt_cast_bottom',
			texturePath: 'new_aimedbolt/new_aimedbolt_cast_bottom/',
			min: 'mineffect/new_aimedbolt/new_aimedbolt_cast_bottom/new_aimedbolt_cast_bottom',
			minTexturePath: 'mineffect/new_aimedbolt/new_aimedbolt_cast_bottom/',
			renderBeforeEntities: true,
			castLoop: true,
			attachedEntity: true
		}
	],

	// Aimed Bolt (RA_AIMEDBOLT) target mark: on the target for the cast time. See effect-port/ranger-skills.md.
	1651: [
		{
			//(1651): CEZ2STREffect, new_aimedbolt\\new_aimedbolt_target_loop\\new_aimedbolt_target_loop.str
			type: 'STR',
			file: 'new_aimedbolt/new_aimedbolt_target_loop/new_aimedbolt_target_loop',
			texturePath: 'new_aimedbolt/new_aimedbolt_target_loop/',
			min: 'mineffect/new_aimedbolt/new_aimedbolt_target_loop/new_aimedbolt_target_loop',
			minTexturePath: 'mineffect/new_aimedbolt/new_aimedbolt_target_loop/',
			castLoop: true,
			attachedEntity: true
		}
	],

	// Aimed Bolt (RA_AIMEDBOLT) on the target as the damage arrives. See effect-port/ranger-skills.md.
	1650: [
		{
			//(1650): CEZ2STREffect, new_aimedbolt\\new_aimedbolt_target_end\\new_aimedbolt_end.str
			type: 'STR',
			file: 'new_aimedbolt/new_aimedbolt_target_end/new_aimedbolt_end',
			texturePath: 'new_aimedbolt/new_aimedbolt_target_end/',
			min: 'mineffect/new_aimedbolt/new_aimedbolt_target_end/new_aimedbolt_end',
			minTexturePath: 'mineffect/new_aimedbolt/new_aimedbolt_target_end/',
			attachedEntity: true
		}
	],

	// Aimed Bolt (RA_AIMEDBOLT) shot on the caster, facing quarter 1 (ScreenDirection.facingQuarter). See effect-port/ranger-skills.md.
	1645: [
		{
			//(1645): CEZ2STREffect, new_aimedbolt\\new_aimedbolt_attack_01clock\\new_aimedbolt_attack_01clock.str
			type: 'STR',
			file: 'new_aimedbolt/new_aimedbolt_attack_01clock/new_aimedbolt_attack_01clock',
			texturePath: 'new_aimedbolt/new_aimedbolt_attack_01clock/',
			min: 'mineffect/new_aimedbolt/new_aimedbolt_attack_01clock/new_aimedbolt_attack_01clock',
			minTexturePath: 'mineffect/new_aimedbolt/new_aimedbolt_attack_01clock/',
			attachedEntity: true
		}
	],

	// Aimed Bolt (RA_AIMEDBOLT) shot on the caster, facing quarter 0. See effect-port/ranger-skills.md.
	1646: [
		{
			//(1646): CEZ2STREffect, new_aimedbolt\\new_aimedbolt_attack_05clock\\new_aimedbolt_attack_05clock.str
			type: 'STR',
			file: 'new_aimedbolt/new_aimedbolt_attack_05clock/new_aimedbolt_attack_05clock',
			texturePath: 'new_aimedbolt/new_aimedbolt_attack_05clock/',
			min: 'mineffect/new_aimedbolt/new_aimedbolt_attack_05clock/new_aimedbolt_attack_05clock',
			minTexturePath: 'mineffect/new_aimedbolt/new_aimedbolt_attack_05clock/',
			attachedEntity: true
		}
	],

	// Aimed Bolt (RA_AIMEDBOLT) shot on the caster, facing quarter 3. See effect-port/ranger-skills.md.
	1647: [
		{
			//(1647): CEZ2STREffect, new_aimedbolt\\new_aimedbolt_attack_07clock\\new_aimedbolt_attack_07clock.str
			type: 'STR',
			file: 'new_aimedbolt/new_aimedbolt_attack_07clock/new_aimedbolt_attack_07clock',
			texturePath: 'new_aimedbolt/new_aimedbolt_attack_07clock/',
			min: 'mineffect/new_aimedbolt/new_aimedbolt_attack_07clock/new_aimedbolt_attack_07clock',
			minTexturePath: 'mineffect/new_aimedbolt/new_aimedbolt_attack_07clock/',
			attachedEntity: true
		}
	],

	// Aimed Bolt (RA_AIMEDBOLT) shot on the caster, facing quarter 2. See effect-port/ranger-skills.md.
	1648: [
		{
			//(1648): CEZ2STREffect, new_aimedbolt\\new_aimedbolt_attack_11clock\\new_aimedbolt_attack_11clock.str
			type: 'STR',
			file: 'new_aimedbolt/new_aimedbolt_attack_11clock/new_aimedbolt_attack_11clock',
			texturePath: 'new_aimedbolt/new_aimedbolt_attack_11clock/',
			min: 'mineffect/new_aimedbolt/new_aimedbolt_attack_11clock/new_aimedbolt_attack_11clock',
			minTexturePath: 'mineffect/new_aimedbolt/new_aimedbolt_attack_11clock/',
			attachedEntity: true
		}
	]
};
