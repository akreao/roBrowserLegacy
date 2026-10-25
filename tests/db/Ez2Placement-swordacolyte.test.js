import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Dragon Knight, Imperial Guard, Cardinal and Inquisitor: hand-written STR rows placed as the kRO client places them, from
// their ez2streffect.bson rows (PosX/PosY, IsFloor). See effect-port/ez2-placement.md.

// The effect tables import most of the renderer, so read them from their source.
const effectTable = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8').replace(/\r\n/g, '\n');

function effectEntry(name) {
	const start = effectTable.indexOf(`\n\t${name}: [`);
	expect(start, `${name} is defined`).toBeGreaterThan(-1);
	const end = effectTable.indexOf('\n\t],', start);
	return vm.runInNewContext(`(${effectTable.slice(start, end + 3).trim().replace(/^\w+:/, '').replace(/,$/, '')})`);
}

// [effect, STR file, PosX, PosY, IsFloor]
const ROWS = [
	['ef_cd_divinus_flos', 'cardinal/cd_divinus_flos/divinus_flos/divinus_flos', 0, 12, false],
	['ef_cd_divinus_flos', 'cardinal/cd_divinus_flos/divinus_flos_bottom/divinus_flos_bottom', 0, 12, true],
	['ef_cd_divinus_flos_cast', 'cardinal/cd_divinus_flos/divinus_flos_cast/divinus_flos_cast', 0, 10, false],
	['ef_cd_divinus_flos_cast', 'cardinal/cd_divinus_flos/divinus_flos_cast_bottom/divinus_flos_cast_bottom', 0, 10, true],
	['ef_cd_divinus_flos_hit', 'cardinal/cd_divinus_flos/divinus_flos_hit/divinus_flos_hit', 0, 6, false],
	['ef_dk_chargingpierce_cast', 'dragon_knight/dk_chargingpierce/chargingpierce_cast/chargingpierce_cast', 0, 10, false],
	['ef_dk_chargingpierce_cast', 'dragon_knight/dk_chargingpierce/chargingpierce_cast_bottom/chargingpierce_cast_bottom', 0, 8, true],
	['ef_dk_chargingpierce_hit', 'dragon_knight/dk_chargingpierce/chargingpierce_hit/chargingpierce_hit', 0, 8, false],
	['ef_dk_dragonic_breath', 'dragon_knight/dragonic_breath/dragonic_breath/dragonic_breath', 0, 10, false],
	['ef_dk_dragonic_breath', 'dragon_knight/dragonic_breath/dragonic_breath_bottom/dragonic_breath_bottom', 0, 10, true],
	['ef_dk_dragonic_breath_hit', 'dragon_knight/dragonic_breath/dragonic_breath_hit/dragonic_breath_hit', 0, 10, false],
	['ef_dk_dragonic_pierce', 'dragon_knight/dk_dragonic_pierce/dragonic_pierce_bottom/dragonic_pierce_bottom', 0, 12, true],
	['ef_dk_dragonic_pierce_cast', 'dragon_knight/dk_dragonic_pierce/dragonic_pierce_cast/dragonic_pierce_cast', 0, 5, false],
	['ef_dk_dragonic_pierce_hit', 'dragon_knight/dk_dragonic_pierce/dragonic_pierce_hit/dragonic_pierce_hit', 0, 10, false],
	['ef_dk_dragonic_pierce_hit', 'dragon_knight/dk_dragonic_pierce/dragonic_pierce_hit_bottom/dragonic_pierce_hit_bottom', 0, 10, true],
	['ef_dk_hackandslasher', 'dragon_knight/dk_hackandslasher/hackandslash/hackandslash', 0, 8, false],
	['ef_dk_hackandslasher', 'dragon_knight/dk_hackandslasher/hackandslash_bottom/hackandslash_bottom', 0, 10, true],
	['ef_dk_hackandslasher_hit', 'dragon_knight/dk_hackandslasher/hackandslash_hit/hackandslash_hit', 0, 8, false],
	['ef_dk_madness_crusher', 'dragon_knight/dk_madness_crusher/madness_crusher/madness_crusher', 0, 8, false],
	['ef_dk_madness_crusher', 'dragon_knight/dk_madness_crusher/madness_crusher_bottom/madness_crusher_bottom', 0, 8, true],
	['ef_dk_servant_w_phantom', 'dragon_knight/dk_servant_w_phantom/servant_phantom_sub/servant_phantom_sub', 0, 8, false],
	['ef_dk_servant_w_phantom', 'dragon_knight/dk_servant_w_phantom/servant_phantom_sub_bottom/servant_phantom_sub_bottom', 0, 8, true],
	['ef_dk_servantweapon_hit', 'dragon_knight/dk_servantweapon/servantweapon_hit/servantweapon_hit', 0, 8, false],
	['ef_dk_servantweapon_hit', 'dragon_knight/dk_servantweapon/servantweapon_hit_bottom/servantweapon_hit_bottom', 0, 8, true],
	['ef_dk_vigor_cast', 'dragon_knight/dk_vigor/vigor_cast/vigor_cast', 0, 10, false],
	['ef_ig_attack_stance', 'imperial_guard/ig_attack_stance/new_attack_stance/new_attack_stance/new_attack_stance', 0, 10, false],
	['ef_ig_attack_stance_cast', 'imperial_guard/ig_attack_stance/new_attack_stance/new_attack_stance_cast/new_attack_stance_cast', 0, 10, false],
	['ef_ig_attack_stance_cast', 'imperial_guard/ig_attack_stance/new_attack_stance/new_attack_stance_cast_bottom/new_attack_stance_cast_bottom', 0, 10, true],
	['ef_ig_cross_rain_cast', 'imperial_guard/ig_cross_rain/new_crossrain/new_cross_rain_cast/new_cross_rain_cast', 0, 10, false],
	['ef_ig_cross_rain_cast', 'imperial_guard/ig_cross_rain/new_crossrain/new_cross_rain_cast_bottom/new_cross_rain_cast_bottom', 0, 10, true],
	['ef_ig_grand_judgement', 'imperial_guard/ig_grand_judgement/new_grand_judgement/new_grand_judgement/new_grand_judgement', 0, 10, false],
	['ef_ig_grand_judgement', 'imperial_guard/ig_grand_judgement/new_grand_judgement/new_grand_judgement_bottom/new_grand_judgement_bottom', 0, 10, true],
	['ef_ig_grand_judgement_cast', 'imperial_guard/ig_grand_judgement/new_grand_judgement/grand_judgement_cast/grand_judgement_cast', 0, 10, false],
	['ef_ig_grand_judgement_cast', 'imperial_guard/ig_grand_judgement/new_grand_judgement/grand_judgement_cast_bottom/grand_judgement_cast_bottom', 0, 10, true],
	['ef_ig_guard_stance', 'imperial_guard/ig_guard_stance/new_guard_stance/new_guard_stance/new_guard_stance', 0, 10, false],
	['ef_ig_guard_stance_cast', 'imperial_guard/ig_guard_stance/new_guard_stance/new_guard_stance_cast/new_guard_stance_cast', 0, 10, false],
	['ef_ig_guard_stance_cast', 'imperial_guard/ig_guard_stance/new_guard_stance/new_guard_stance_cast_bottom/new_guard_stance_cast_bottom', 0, 10, true],
	['ef_ig_guardian_shield', 'imperial_guard/ig_guardian_shield/new_guardianshield/guardianshield/guardianshield', 0, 10, false],
	['ef_ig_guardian_shield', 'imperial_guard/ig_guardian_shield/new_guardianshield/guardianshield_bottom/guardianshield_bottom', 0, 10, true],
	['ef_ig_holy_shield', 'imperial_guard/ig_holy_shield/new_holy_shield/new_holy_shield/new_holy_shield', 0, 10, false],
	['ef_ig_holy_shield', 'imperial_guard/ig_holy_shield/new_holy_shield/new_holy_shield_bottom/new_holy_shield_bottom', 0, 10, true],
	['ef_ig_holy_shield_cast', 'imperial_guard/ig_holy_shield/new_holy_shield/new_holy_shield_cast/new_holy_shield_cast', 0, 10, false],
	['ef_ig_holy_shield_cast', 'imperial_guard/ig_holy_shield/new_holy_shield/new_holy_shield_cast_bottom/new_holy_shield_cast_bottom', 0, 10, true],
	['ef_ig_imperial_cross', 'imperial_guard/ig_imperial_cross/imperial_cross/imperial_cross', 0, 11, false],
	['ef_ig_imperial_pressure', 'imperial_guard/ig_imperial_pressure/imperal_pressure/imperal_pressure', 0, 10, false],
	['ef_ig_imperial_pressure', 'imperial_guard/ig_imperial_pressure/imperal_pressure_bottom/imperal_pressure_bottom', 0, 10, true],
	['ef_ig_imperial_pressure_cast', 'imperial_guard/ig_imperial_pressure/imperal_pressure_cast/imperal_pressure_cast', 0, 10, false],
	['ef_ig_judgement_cross', 'imperial_guard/ig_judgement_cross/new_judgement_cross/new_judgement_cross/new_judgement_cross', 0, 10, false],
	['ef_ig_judgement_cross', 'imperial_guard/ig_judgement_cross/new_judgement_cross/new_judgement_cross_bottom/new_judgement_cross_bottom', 0, 10, true],
	['ef_ig_judgement_cross_cast', 'imperial_guard/ig_judgement_cross/new_judgement_cross/new_judgement_cross_cast/new_judgement_cross_cast', 0, 10, false],
	['ef_ig_judgement_cross_cast', 'imperial_guard/ig_judgement_cross/new_judgement_cross/new_judgement_cross_cast_bottom/new_judgement_cross_cast_bottom', 0, 10, true],
	['ef_ig_judgement_cross_hit', 'imperial_guard/ig_judgement_cross/new_judgement_cross/new_judgement_cross_hit/new_judgement_cross_hit', 0, 5, false],
	['ef_ig_overslash', 'imperial_guard/ig_overslash/new_overslash/new_overslash/new_overslash', 0, 10, false],
	['ef_ig_overslash', 'imperial_guard/ig_overslash/new_overslash/new_overslash_bottom/new_overslash_bottom', 0, 10, true],
	['ef_ig_overslash_cast', 'imperial_guard/ig_overslash/new_overslash/overslash_cast/overslash_cast', 0, 10, false],
	['ef_ig_overslash_hit', 'imperial_guard/ig_overslash/new_overslash/new_overslash_hit/new_overslash_hit', 0, 5, false],
	['ef_ig_radiant_spear_cast', 'imperial_guard/ig_radiant_spear/radiant_spear_cast/radiant_spear_cast', 0, 11, false],
	['ef_ig_rebound_shield', 'imperial_guard/ig_rebound_shield/new_rebound_shield/new_rebound_shield/new_rebound_shield', 0, 15, false],
	['ef_ig_rebound_shield', 'imperial_guard/ig_rebound_shield/new_rebound_shield/new_rebound_shield_bottom/new_rebound_shield_bottom', 0, 15, true],
	['ef_ig_rebound_shield_cast', 'imperial_guard/ig_rebound_shield/new_rebound_shield/rebound_shield_cast/rebound_shield_cast', 0, 10, false],
	['ef_ig_rebound_shield_cast', 'imperial_guard/ig_rebound_shield/new_rebound_shield/rebound_shield_cast_bottom/rebound_shield_cast_bottom', 0, 10, true],
	['ef_ig_shield_shooting_cast', 'shield_shooting/shield_shooting_cast/shield_shooting_cast', 0, 9, false],
	['ef_ig_shield_shooting_hit', 'shield_shooting/shield_shooting_hit/shield_shooting_hit', 0, 7, false],
	['ef_ig_ultimate_sacrifice', 'imperial_guard/ig_ultimate_sacrifice/ultimatesacrifice/ultimatesacrifice', 0, 8, false],
	['ef_ig_ultimate_sacrifice', 'imperial_guard/ig_ultimate_sacrifice/ultimatesacrifice_bottom/ultimatesacrifice_bottom', 0, 10, false],
	['ef_iq_blazing_flame_blast', 'inquisitor/iq_blazing_flame_blast/blazing_flame_blast/blazing_flame_blast', 0, 10, false],
	['ef_iq_blazing_flame_blast_cast', 'inquisitor/iq_blazing_flame_blast/blazing_flame_blast_cast/blazing_flame_blast_cast', 0, 10, false],
	['ef_iq_blazing_flame_blast_cast', 'inquisitor/iq_blazing_flame_blast/blazing_flame_blast_cast_bottom/blazing_flame_blast_cast_bottom', 0, 10, true],
	['ef_iq_blazing_flame_blast_hit', 'inquisitor/iq_blazing_flame_blast/blazing_flame_blast_hit/blazing_flame_blast_hit', 0, 8, false],
	['ef_lg_rayofgenesis_hit', 'new_rayofgenesis/new_rayofgenesis_hit/new_rayofgenesis_hit', 0, 8, false]
];

describe('Dragon Knight, Imperial Guard, Cardinal and Inquisitor EZ2 placement', () => {
	it.each(ROWS)('%s %s sits at PosX %s, PosY %s, floor %s', (name, file, posX, posY, floor) => {
		const parts = effectEntry(name).filter(part => part.type === 'STR' && part.file === file);
		expect(parts.length).toBeGreaterThan(0);
		for (const part of parts) {
			expect(part.xOffset || 0).toBe(posX);
			expect(part.yOffset).toBe(posY);
			expect(!!part.renderBeforeEntities).toBe(floor);
		}
	});
});
