import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Hand-written STR rows that stand in for an ez2streffect.bson row play that
// row's sound, once (IsSoundLoop is false for all of them), as the official
// client does when it plays the row. Before, these rows dropped it: Wild Shot's
// cast, for one, was silent. [entry, STR file, sound], read from the bson.
//
// Read as text: the tables import the renderer, which does not load without a canvas.
const effectTable = effectTableSource().replace(/\r\n/g, '\n');

function entry(id) {
	const start = effectTable.indexOf(`\n\t${id}: [`);
	expect(start, `${id} is defined`).toBeGreaterThan(-1);
	return vm.runInNewContext(effectTable.slice(effectTable.indexOf('[', start), effectTable.indexOf('\n\t],', start) + 3));
}

const ROWS = [
	['ef_sh_chul_ho_battering_cast', 'chul_ho_battering_cast', 'effect/ef_beginspell'],
	['ef_sh_chul_ho_battering_hit', 'chul_ho_battering_hit', 'effect/SPIRIT_HANDLER/SH_CHUL_HO_BATTERING_hit'],
	['ef_sh_hyun_rok_spirit_power_cast', 'hyun_rok_spirit_power_cast', 'effect/ef_beginspell'],
	['ef_sh_hyun_rok_spirit_power_hit', 'hyun_rok_spirit_power_hit', 'effect/SPIRIT_HANDLER/SH_HYUN_ROK_SPIRIT_POWER_hit'],
	['ef_soa_talisman_of_magician', 'talisman_of_magician', 'effect/SOUL_ASCETIC/soa_talisman'],
	['ef_soa_talisman_of_magician', 'talisman_of_magician_bottom', 'effect/SOUL_ASCETIC/soa_talisman_of_magician_bottom'],
	['ef_soa_talisman_of_five_elements', 'talisman_of_the_five_elements', 'effect/SOUL_ASCETIC/soa_talisman_of_the_five_elements'],
	['ef_soa_exorcism_of_malicious_soul', 'exorcism_of_malicuous_soul', 'effect/SOUL_ASCETIC/soa_exorcism_of_malicuous_soul'],
	['ef_soa_circle_of_directions_and_elementals', 'circle_directions_elements', 'effect/SOUL_ASCETIC/soa_circle_directions_elements'],
	['ef_ss_kagenomai', 'kagenomai', 'effect/SHINKIRO_SHIRANUI/SS_KAGEGNOMAI'],
	['ef_ss_kagegissen', 'new_kagegissen', 'effect/SHINKIRO_SHIRANUI/new_ss_kagegissen_ready'],
	['ef_ss_raidenpou_cast', 'new_raidenpou_cast', 'effect/ef_beginspell'],
	['ef_ss_ankokuryuuakumu', 'ankokuryuuakumu_01', 'effect/SHINKIRO_SHIRANUI/SS_ANKOKURYUUAKUMU_1'],
	['ef_em_psychic_stream_cast', 'psychic_stream_cast', 'effect/ef_beginspell'],
	['ef_em_psychic_stream_hit', 'psychic_stream_hit', 'effect/EM_PSYCHIC_STREAM_hit'],
	['ef_mt_rush_strike', 'rush_strike_bottom', 'effect/MT_RUSH_STRIKE_2'],
	['ef_mt_energy_cannonade_cast', 'energy_cannonade_cast', 'effect/ef_beginspell'],
	['ef_mt_energy_cannonade_hit', 'energy_cannonade_hit', 'effect/MT_ENERGY_CANNONADE_HIT'],
	['ef_bo_mystery_powder_hit', 'mistery_powder_hit', 'effect/BO_MYSTERY_POWDER_hit'],
	['ef_bo_dust_explosion', 'dust_explosion', 'effect/bo_explosive_powder'],
	['ef_ig_rebound_shield_cast', 'rebound_shield_cast', 'effect/EF_BeginSpell'],
	['ef_ig_attack_stance', 'new_attack_stance', 'effect/IG_GUARD_STANCE'],
	['ef_ig_holy_shield', 'new_holy_shield', 'effect/IG_HOLY_SHIELD1'],
	['ef_ig_holy_shield_cast', 'new_holy_shield_cast', 'effect/EF_BeginSpell'],
	['ef_ig_grand_judgement_cast', 'grand_judgement_cast', 'effect/EF_BeginSpell'],
	['ef_ig_judgement_cross_cast', 'new_judgement_cross_cast', 'effect/EF_BeginSpell'],
	['ef_ig_shield_shooting_cast', 'shield_shooting_cast', 'effect/EF_BeginSpell'],
	['ef_ig_overslash_cast', 'overslash_cast', 'effect/EF_BeginSpell'],
	['ef_ig_cross_rain_cast', 'new_cross_rain_cast', 'effect/EF_BeginSpell'],
	['ef_ig_radiant_spear_cast', 'radiant_spear_cast', 'effect/ef_beginspell'],
	['ef_ig_imperial_pressure_cast', 'imperal_pressure_cast', 'effect/ef_beginspell'],
	['ef_iq_blazing_flame_blast_cast', 'blazing_flame_blast_cast', 'effect/ef_beginspell'],
	['ef_iq_blazing_flame_blast_hit', 'blazing_flame_blast_hit', 'effect/IQ_BLAZING_FLAME_BLAST_hit'],
	['ef_ag_energy_conversion_cast', 'energy_conversion_cast', 'effect/ef_beginspell'],
	['ef_cd_divinus_flos_cast', 'divinus_flos_cast', 'effect/ef_beginspell'],
	['ef_cd_divinus_flos_hit', 'divinus_flos_hit', 'effect/CD_DIVINUS_FLOS_hit'],
	['ef_dk_vigor_cast', 'vigor_cast', 'effect/DK_VIGOR'],
	['ef_dk_dragonic_breath', 'dragonic_breath_bottom', 'effect/dk_dragonic_breath_bottom'],
	['ef_dk_dragonic_pierce_cast', 'dragonic_pierce_cast', 'effect/ef_beginspell'],
	['ef_dk_dragonic_pierce_hit', 'dragonic_pierce_hit', 'effect/DK_DRAGONIC_PIERCE_hit'],
	['ef_shc_impact_crater_hit', 'impact_crater_hit', 'effect/SHC_IMPACT_CRATER'],
	['ef_shc_enchanting_shadow', 'enchanting_shadow', 'effect/EF_BeginSpell'],
	['ef_tr_mystic_symphony_cast', 'mysticsymphony_cast', 'effect/ef_beginspell'],
	['ef_tr_kvasir_sonata_cast', 'kvasirsonata_cast', 'effect/ef_beginspell'],
	['ef_tr_roseblossom_cast', 'roseblossom_cast', 'effect/ef_beginspell'],
	['ef_tr_gef_nocturn_cast', 'gef_nocturn_cast', 'effect/ef_beginspell'],
	['ef_tr_roki_capriccio_cast', 'roki_capriccio_cast', 'effect/ef_beginspell'],
	['ef_tr_ain_rhapsody_cast', 'ain_rhapsody_cast', 'effect/ef_beginspell'],
	['ef_tr_jawaii_serenade_cast', 'jawaii_serenade_cast', 'effect/ef_beginspell'],
	['ef_tr_pron_march_cast', 'pronmarch_cast', 'effect/ef_beginspell'],
	['ef_tr_rhythmical_wave', 'rhythmical_wave', 'effect/TR_RHYTHMICAL_WAVE1'],
	['ef_tr_rhythmical_wave', 'rhythmical_wave_bottom', 'effect/TR_RHYTHMICAL_WAVE2'],
	['ef_tr_rhythmical_wave_cast', 'rhythmical_wave_cast', 'effect/ef_beginspell'],
	['ef_tr_rhythmical_wave_hit', 'rhythmical_wave_hit', 'effect/TR_RHYTHMICAL_WAVE3'],
	['ef_abc_abyss_flame_cast', 'abyss_flame_cast', 'effect/ef_beginspell'],
	['ef_abc_abyss_flame_hit', 'abyss_flame_hit', 'effect/ABC_ABYSS_FLAME_hit'],
	['ef_wh_galestorm_cast', 'galestorm_cast', 'effect/EF_BeginSpell'],
	['ef_wh_crescive_bolt_cast', 'crescivebolt_cast', 'effect/EF_BeginSpell'],
	['ef_wh_wild_walk_cast', 'wild_walk_cast', 'effect/ef_beginspell'],
	['ef_nw_only_one_bullet_hit', 'only_one_bullet_hit', 'effect/NIGHT_WATCH/nw_only_one_bullet_hit'],
	['ef_nw_wild_shot_cast', 'wild_shot_cast', 'effect/ef_beginspell'],
	['ef_nw_wild_shot_hit', 'wild_shot_hit', 'effect/NIGHT_WATCH/NW_MIDNIGHT_FALLEN_HIT'],
	['ef_nw_midnight_fallen_cast', 'midnight_fallen_cast_bottom', 'effect/ef_beginspell'],
	['ef_druid_chop_chop_hit', 'chop_chop_sub', 'effect/DRUID/KR_CHOP_CHOP'],
	['ef_druid_sharpen_hail_shot', 'sharpen_hail_shot', 'effect/DRUID/KR_SHARPEN_HAIL'],
	['ef_druid_ice_pillar_loop', 'ice_pillar_loop', 'effect/DRUID/KR_ICE_PILLAR_LOOP'],
	['ef_druid_aero_sync_self', 'aero_sync_sync', 'effect/DRUID/AT_AERO_SYNC']
];

describe('EZ2 row sounds on hand-written rows', () => {
	it.each(ROWS)('%s plays %s with its sound', (id, file, wav) => {
		const row = entry(id).find(r => r.file && r.file.endsWith(`/${file}`));
		expect(row, `${id} has ${file}`).toBeDefined();
		expect(row.wav).toBe(wav);
		expect(row.soundLoop).toBe(false);
	});
});
