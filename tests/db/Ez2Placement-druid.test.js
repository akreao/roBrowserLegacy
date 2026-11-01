import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Druid: hand-written STR rows placed as the kRO client places them, from
// their ez2streffect.bson rows (PosX/PosY, IsFloor). See effect-port/ez2-placement.md.

// The effect tables import most of the renderer, so read them from their source.
const effectTable = effectTableSource().replace(/\r\n/g, '\n');

function effectEntry(name) {
	const start = effectTable.indexOf(`\n\t${name}: [`);
	expect(start, `${name} is defined`).toBeGreaterThan(-1);
	const end = effectTable.indexOf('\n\t],', start);
	return vm.runInNewContext(`(${effectTable.slice(start, end + 3).trim().replace(/^\w+:/, '').replace(/,$/, '')})`);
}

// [effect, STR file, PosX, PosY, IsFloor]
const ROWS = [
	['ef_druid_aero_sync', 'druid/at_aero_sync/aero_sync_main/aero_sync_main', 0, 10, false],
	['ef_druid_aero_sync', 'druid/at_aero_sync/aero_sync_main_bottom/aero_sync_main_bottom', 0, 10, true],
	['ef_druid_aero_sync_self', 'druid/at_aero_sync/aero_sync_sync/aero_sync_sync', 0, 15, false],
	['ef_druid_alpha_claw', 'druid/at_alpha_claw/alpha_claw/alpha_claw', 0, 10, false],
	['ef_druid_alpha_phase', 'druid/at_alpha_phase/alpha_phase/alpha_phase', 0, 15, false],
	['ef_druid_apex_phase', 'druid/at_apex_phase/apex_phase/apex_phase', 0, 13, false],
	['ef_druid_around_flower', 'druid/dr_around_flower/around_flower/around_flower', 0, 10, false],
	['ef_druid_around_flower', 'druid/dr_around_flower/around_flower_bottom/around_flower_bottom', 0, 10, true],
	['ef_druid_blood_howling', 'druid/dr_blood_howling/blood_howling/blood_howling', 0, 12, false],
	['ef_druid_chilling_blast', 'druid/at_chilling_blast/chilling_blast/chilling_blast', 0, 10, false],
	['ef_druid_chilling_blast', 'druid/at_chilling_blast/chilling_blast_bottom/chilling_blast_bottom', 0, 10, true],
	['ef_druid_chop_chop', 'druid/kr_chop_chop/chop_chop/chop_chop', 0, 7, false],
	['ef_druid_chop_chop_hit', 'druid/kr_chop_chop/chop_chop_sub/chop_chop_sub', 0, 7, false],
	['ef_druid_claw_wave', 'druid/kr_claw_wave/claw_wave/claw_wave', 0, 10, false],
	['ef_druid_cruel_bite', 'druid/dr_cruel_bite/cruel_bite/cruel_bite', 0, 10, false],
	['ef_druid_cutting_wind', 'druid/dr_cutting_wind/cutting_wind/cutting_wind', 0, 5, false],
	['ef_druid_cutting_wind_hit', 'druid/dr_cutting_wind/cutting_wind_hit/cutting_wind_hit', 0, 5, false],
	['ef_druid_double_slash', 'druid/kr_double_slash/double_slash/double_slash', 0, 10, false],
	['ef_druid_earth_drill', 'druid/kr_earth_drill/earth_drill/earth_drill', 0, 10, false],
	['ef_druid_earth_drill', 'druid/kr_earth_drill/earth_drill_bottom/earth_drill_bottom', 0, 10, true],
	['ef_druid_earth_flower', 'druid/dr_earth_flower/earth_flower/earth_flower', 0, 10, false],
	['ef_druid_earth_flower', 'druid/dr_earth_flower/earth_flower_bottom/earth_flower_bottom', 0, 10, true],
	['ef_druid_earth_stamp', 'druid/kr_earth_stamp/earth_stamp/earth_stamp', 0, 10, false],
	['ef_druid_earth_stamp', 'druid/kr_earth_stamp/earth_stamp_bottom/earth_stamp_bottom', 0, 10, true],
	['ef_druid_enrage_raptor', 'druid/dr_enrage_raptor/enrage_raptor/enrage_raptor', 0, 13, false],
	['ef_druid_enrage_wolf', 'druid/dr_enrage_wolf/enrage_wolf/enrage_wolf', 0, 10, false],
	['ef_druid_feather_sprinkle', 'druid/kr_feather_sprinkle/feather_sprinkle/feather_sprinkle', 0, 10, false],
	['ef_druid_feather_sprinkle', 'druid/kr_feather_sprinkle/feather_sprinkle_bottom/feather_sprinkle_bottom', 0, 10, false],
	['ef_druid_feral_claw', 'druid/at_feral_claw/feral_claw/feral_claw', 0, 10, false],
	['ef_druid_flicking_tonado', 'druid/dr_flicking_tonado/flicking_tonado/flicking_tonado', 0, 10, false],
	['ef_druid_flicking_tonado', 'druid/dr_flicking_tonado/flicking_tonado_bottom/flicking_tonado_bottom', 0, 10, true],
	['ef_druid_flip_flap', 'druid/at_flip_flap/flip_flap/flip_flap', 0, 10, false],
	['ef_druid_frenzy_fang', 'druid/at_frenzy_fang/frenzy_fang/frenzy_fang', 0, 10, false],
	['ef_druid_furios_storm', 'druid/at_furios_storm/furios_storm_a/furios_storm_a', 0, 10, false],
	['ef_druid_furios_storm', 'druid/at_furios_storm/furios_storm_a_bottom/furios_storm_a_bottom', 0, 10, true],
	['ef_druid_glacier_monolith_loop', 'druid/at_glacier_monolith/glacier_monolith_loop/glacier_monolith_loop', 0, 10, false],
	['ef_druid_glacier_monolith_loop', 'druid/at_glacier_monolith/glacier_monolith_loop_bottom/glacier_monolith_loop_bottom', 0, 10, true],
	['ef_druid_glacier_monolith_start', 'druid/at_glacier_monolith/glacier_monolith_start/glacier_monolith_start', 0, 10, false],
	['ef_druid_glacier_monolith_start', 'druid/at_glacier_monolith/glacier_monolith_start_bottom/glacier_monolith_start_bottom', 0, 10, true],
	['ef_druid_glacier_nova', 'druid/at_glacier_nova/glacier_nova/glacier_nova', 0, 10, false],
	['ef_druid_glacier_shard', 'druid/at_glacier_shard/glacier_shard/glacier_shard', 0, 10, false],
	['ef_druid_glacier_shard', 'druid/at_glacier_shard/glacier_shard_target/glacier_shard_target', 0, 10, false],
	['ef_druid_glacier_stomp', 'druid/at_glacier_stomp/glacier_stomp/glacier_stomp', 0, 10, false],
	['ef_druid_gravity_hole', 'druid/at_gravity_hole/gravity_hole/gravity_hole', 0, 10, false],
	['ef_druid_gravity_hole', 'druid/at_gravity_hole/gravity_hole_bottom/gravity_hole_bottom', 0, 10, true],
	['ef_druid_ground_bloom', 'druid/kr_ground_bloom/ground_bloom/ground_bloom', 0, 11.5, false],
	['ef_druid_ground_bloom', 'druid/kr_ground_bloom/ground_bloom_bottom/ground_bloom_bottom', 0, 11.5, true],
	['ef_druid_hit_raptor', 'druid/dr_hit/dr_hit_wereraptor/dr_hit_wereraptor', 0, 5, false],
	['ef_druid_hit_wolf', 'druid/dr_hit/dr_hit_werewolf/dr_hit_werewolf', 0, 5, false],
	['ef_druid_hunger', 'druid/dr_hunger/hunger/hunger', 0, 13.2, false],
	['ef_druid_hunger_target', 'druid/dr_hunger/hunger_target/hunger_target', 0, 7, false],
	['ef_druid_ice_cast', 'druid/ice_cast/ice_cast/ice_cast', 0, 10, false],
	['ef_druid_ice_cast', 'druid/ice_cast/ice_cast_bottom/ice_cast_bottom', 0, 10, true],
	['ef_druid_ice_cloud', 'druid/dr_ice_cloud/ice_cloud/ice_cloud', 0, 10, false],
	['ef_druid_ice_hit', 'druid/dr_ice_hit/ice_hit/ice_hit', 0, 5, false],
	['ef_druid_ice_pillar_loop', 'druid/kr_ice_pillar/ice_pillar_loop/ice_pillar_loop', 0, 10, false],
	['ef_druid_ice_pillar_loop', 'druid/kr_ice_pillar/ice_pillar_loop_bottom/ice_pillar_loop_bottom', 0, 10, true],
	['ef_druid_ice_pillar_start', 'druid/kr_ice_pillar/ice_pillar_start/ice_pillar_start', 0, 10, false],
	['ef_druid_ice_pillar_start', 'druid/kr_ice_pillar/ice_pillar_start_bottom/ice_pillar_start_bottom', 0, 10, true],
	['ef_druid_ice_splash', 'druid/kr_ice_splash/ice_splash/ice_splash', 0, 12, false],
	['ef_druid_ice_totem', 'druid/dr_ice_totem/ice_totem/ice_totem', 0, 10, false],
	['ef_druid_iron_howling', 'druid/kr_iron_howling/iron_howling/iron_howling', 0, 12, false],
	['ef_druid_low_flight_bottom', 'druid/dr_low_flight/low_flight_bottom/low_flight_bottom', 0, 10, true],
	['ef_druid_low_flight', 'druid/dr_low_flight/low_flight_horizon/low_flight_horizon', 0, 8, false],
	['ef_druid_low_flight_up', 'druid/dr_low_flight/low_flight_vertical/low_flight_vertical', 0, 0, false],
	['ef_druid_nasty_slash', 'druid/kr_nasty_slash/nasty_slash/nasty_slash', 0, 3, false],
	['ef_druid_nature_harmony', 'druid/at_nature_harmony/nature_harmony/nature_harmony', 0, 10, false],
	['ef_druid_nature_protection', 'druid/dr_nature_protection/nature_protection/nature_protection', 0, 12, false],
	['ef_druid_nature_shield', 'druid/dr_nature_shield/nature_shield/nature_shield', 0, 10, false],
	['ef_druid_nomercy_claw', 'druid/dr_nomercy_claw/nomercy_claw/nomercy_claw', 0, 10, false],
	['ef_druid_pinion_shot', 'druid/at_pinion_shot/pinion_shot/pinion_shot', 0, 10, false],
	['ef_druid_preening', 'druid/dr_preening/preening/preening', 0, 15, false],
	['ef_druid_primal_claw', 'druid/at_primal_claw/primal_claw/primal_claw', 0, 10, false],
	['ef_druid_pulse_of_madness', 'druid/at_pulse_of_madness/pulse_of_madness/pulse_of_madness', 0, 16, false],
	['ef_druid_roaring_charge', 'druid/at_roaring_charge/roaring_charge/roaring_charge', 0, 10, false],
	['ef_druid_roaring_charge', 'druid/at_roaring_charge/roaring_charge_bottom/roaring_charge_bottom', 0, 10, true],
	['ef_druid_roaring_charge_s', 'druid/at_roaring_charge/roaring_charge_s/roaring_charge_s', 0, 10, false],
	['ef_druid_roaring_charge_s', 'druid/at_roaring_charge/roaring_charge_s_bottom/roaring_charge_s_bottom', 0, 10, true],
	['ef_druid_roaring_piercer_g', 'druid/at_roaring_piercer/roaring_piercer_g/roaring_piercer_g', 0, 5, false],
	['ef_druid_roaring_piercer_y', 'druid/at_roaring_piercer/roaring_piercer_y/roaring_piercer_y', 0, 5, false],
	['ef_druid_savage_lunge', 'druid/at_savage_lunge/savage_lunge/savage_lunge', 0, 12, false],
	['ef_druid_savage_lunge', 'druid/at_savage_lunge/savage_lunge_bottom/savage_lunge_bottom', 0, 12, true],
	['ef_druid_sharpen_gust', 'druid/kr_sharpen_gust/sharpen_gust/sharpen_gust', 0, 5, false],
	['ef_druid_sharpen_gust', 'druid/kr_sharpen_gust/sharpen_gust_bottom/sharpen_gust_bottom', 0, 2, true],
	['ef_druid_sharpen_hail', 'druid/kr_sharpen_hail/sharpen_hail/sharpen_hail', 0, 15, false],
	['ef_druid_sharpen_hail', 'druid/kr_sharpen_hail/sharpen_hail_bottom/sharpen_hail_bottom', 0, 15, true],
	['ef_druid_sharpen_hail_shot', 'druid/kr_sharpen_hail/sharpen_hail_shot/sharpen_hail_shot', 0, 15, false],
	['ef_druid_sharpen_hail_shot', 'druid/kr_sharpen_hail/sharpen_hail_shot_bottom/sharpen_hail_shot_bottom', 0, 15, true],
	['ef_druid_shooting_feather', 'druid/dr_shooting_feather/shooting_feather/shooting_feather', 0, 10, false],
	['ef_druid_shooting_feather_hit', 'druid/dr_shooting_feather/shooting_feather_attack/shooting_feather_attack', 0, 0, false],
	['ef_druid_solid_stomp', 'druid/at_solid_stomp/solid_stomp/solid_stomp', 0, 10, false],
	['ef_druid_solid_stomp', 'druid/at_solid_stomp/solid_stomp_bottom/solid_stomp_bottom', 0, 10, true],
	['ef_druid_tempest_flap', 'druid/at_tempest_flap/tempest_flap/tempest_flap', 0, 10, false],
	['ef_druid_tempest_flap', 'druid/at_tempest_flap/tempest_flap_bottom/tempest_flap_bottom', 0, 10, true],
	['ef_druid_tempest_flap_cast', 'druid/at_tempest_flap/tempest_flap_cast/tempest_flap_cast', 0, 10, false],
	['ef_druid_terra_harvest', 'druid/at_terra_harvest/terra_harvest_yellow/terra_harvest_yellow', 0, 10, false],
	['ef_druid_terra_harvest', 'druid/at_terra_harvest/terra_harvest_yellow_bottom/terra_harvest_yellow_bottom', 0, 10, true],
	['ef_druid_terra_wave', 'druid/at_terra_wave/terra_wave/terra_wave', 0, 0, false],
	['ef_druid_terra_wave', 'druid/at_terra_wave/terra_wave_bottom/terra_wave_bottom', 0, 0, true],
	['ef_druid_thunder_cast', 'druid/thundering_cast/thundering_cast/thundering_cast', 0, 10, true],
	['ef_druid_thunder_hit_g', 'druid/thundering_attack/thundering_attack_g/thundering_attack_g', 0, 3, false],
	['ef_druid_thunder_hit_y', 'druid/thundering_attack/thundering_attack_y/thundering_attack_y', 0, 3, false],
	['ef_druid_truth_of_earth', 'druid/dr_truth_of_earth/truth_of_earth/truth_of_earth', 0, 10, false],
	['ef_druid_truth_of_earth', 'druid/dr_truth_of_earth/truth_of_earth_bottom/truth_of_earth_bottom', 0, 12, true],
	['ef_druid_truth_of_ice', 'druid/dr_truth_of_ice/truth_of_ice/truth_of_ice', 0, 10, false],
	['ef_druid_truth_of_ice', 'druid/dr_truth_of_ice/truth_of_ice_bottom/truth_of_ice_bottom', 0, 12, true],
	['ef_druid_truth_of_wind', 'druid/dr_truth_of_wind/truth_of_wind/truth_of_wind', 0, 10, false],
	['ef_druid_truth_of_wind', 'druid/dr_truth_of_wind/truth_of_wind_bottom/truth_of_wind_bottom', 0, 12, true],
	['ef_druid_wereraptor', 'druid/dr_wereraptor/wereraptor/wereraptor', 0, 10, false],
	['ef_druid_werewolf', 'druid/dr_werewolf/werewolf/werewolf', 0, 10, false],
	['ef_druid_wind_bomb', 'druid/dr_wind_bomb/wind_bomb_main/wind_bomb_main', 0, 5, false],
	['ef_druid_wind_bomb_throw', 'druid/dr_wind_bomb/wind_bomb_tornado/wind_bomb_tornado', 0, 0, false],
	['ef_druid_wind_bomb_hit', 'druid/dr_wind_bomb/wind_bomb_hit/wind_bomb_hit', 0, 5, false],
	['ef_druid_wind_veil', 'druid/kr_wind_veil/wild_veil/wild_veil', 0, 10, false],
	['ef_druid_wind_veil', 'druid/kr_wind_veil/wild_veil_bottom/wild_veil_bottom', 0, 10, true],
	['ef_druid_zephyr_link', 'druid/at_zephyr_link/zephyr_link/zephyr_link', 0, 10, false],
	['ef_druid_zephyr_link', 'druid/at_zephyr_link/zephyr_link_bottom/zephyr_link_bottom', 0, 10, true]
];

describe('Druid EZ2 placement', () => {
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
