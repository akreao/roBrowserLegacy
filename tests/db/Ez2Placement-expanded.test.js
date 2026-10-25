import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Hyper Novice, Spirit Handler, Shinkiro/Shiranui, Night Watch and Soul Ascetic: hand-written STR rows placed as the kRO client places them, from
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
	['ef_hn_breakinglimit', 'hyper_novice/hn_breakinglimit/breakinglimit/breakinglimit', 0, 12, false],
	['ef_hn_doublebowlingbash', 'hyper_novice/hn_doublebowlingbash/double_bowlingbash', 0, 10, false],
	['ef_hn_mega_sonic_blow', 'hyper_novice/hn_mega_sonic_blow/mega_sonic_blow', 0, 13, false],
	['ef_hn_meteor_storm_buster', 'hyper_novice/hn_meteor_storm_buster/meteor_storm_buster', 0, 10, false],
	['ef_hn_meteor_storm_buster', 'hyper_novice/hn_meteor_storm_buster/meteor_storm_buster_bottom', 0, 10, true],
	['ef_hn_napalm_vulcan_strike', 'hyper_novice/hn_napalm_vulcan_strike/napalm_vulcan_strike', 0, 12, false],
	['ef_hn_overcoming_crisis', 'hyper_novice/hn_overcoming_crisis/overcoming_crisis/overcoming_crisis', 0, 10, false],
	['ef_hn_overcoming_crisis', 'hyper_novice/hn_overcoming_crisis/overcoming_crisis_bottom/overcoming_crisis_bottom', 0, 10, true],
	['ef_hn_rulebreak', 'hyper_novice/hn_rulebreak/rulebreak/rulebreak', 0, 12, false],
	['ef_hn_shield_chain_rush', 'hyper_novice/hn_shield_chain_rush/shield_chain_rush', 0, 10, false],
	['ef_hn_spiral_pierce_max', 'hyper_novice/hn_spiral_pierce_max/spiral_pierce_max', 0, 5, false],
	['ef_nw_auto_firing_launcher', 'night_watch/nw_auto_firing_launcher/auto_firing_launcher/auto_firing_launcher', 0, 10, false],
	['ef_nw_auto_firing_launcher', 'night_watch/nw_auto_firing_launcher/auto_firing_launcher_bottom/auto_firing_launcher_bottom', 0, 10, true],
	['ef_nw_basic_grenade', 'night_watch/nw_basic_grenade/basic_grenade/basic_grenade', 0, 10, false],
	['ef_nw_basic_grenade', 'night_watch/nw_basic_grenade/basic_grenade_bottom/basic_grenade_bottom', 0, 10, true],
	['ef_nw_hidden_card', 'night_watch/nw_hidden_card/hidden_card/hiddencard', 0, 10, false],
	['ef_nw_magazine_for_one', 'night_watch/nw_magazine_for_one/magazine_for_one', 0, 10, false],
	['ef_nw_midnight_fallen', 'night_watch/nw_midnight_fallen/midnight_fallen_bottom/midnight_fallen_bottom', 1, 11, true],
	['ef_nw_midnight_fallen_cast', 'night_watch/nw_midnight_fallen/midnight_fallen_cast_bottom/midnight_fallen_cast_bottom', 1, 11, true],
	['ef_nw_only_one_bullet', 'night_watch/nw_only_one_bullet/only_one_bullet/only_one_bullet', 0, 10, false],
	['ef_nw_only_one_bullet_hit', 'night_watch/nw_only_one_bullet/only_one_bullet_hit/only_one_bullet_hit', 0, 5, false],
	['ef_nw_spiral_shooting', 'night_watch/nw_spiral_shooting/spiral_shooting', 0, 10, false],
	['ef_nw_the_vigilante_at_night', 'night_watch/nw_the_vigilante_at_night/the_vigilante_at_night_bottom/the_vigilante_at_night_bottom', 0, 10, true],
	['ef_nw_wild_fire', 'night_watch/nw_wild_fire/wild_fire/wild_fire', 0, 10, false],
	['ef_nw_wild_fire', 'night_watch/nw_wild_fire/wild_fire_bottom/wild_fire_bottom', 0, 10, true],
	['ef_nw_wild_shot', 'night_watch/nw_wild_shot/wild_shot/wild_shot', 0, 5, false],
	['ef_nw_wild_shot_cast', 'night_watch/nw_wild_shot/wild_shot_cast/wild_shot_cast', 0, 11, true],
	['ef_nw_wild_shot_hit', 'night_watch/nw_wild_shot/wild_shot_hit/wild_shot_hit', 0, 6, false],
	['ef_sh_blessing_of_mystical_creatures', 'spirit_handler/sh_blessing_of_mystical_creatures/blessing_of_mystical_creatures', 0, 10, false],
	['ef_sh_chul_ho_battering', 'spirit_handler/sh_chul_ho_battering/chul_ho_battering/chul_ho_battering', 0, 11, false],
	['ef_sh_chul_ho_battering', 'spirit_handler/sh_chul_ho_battering/chul_ho_battering_bottom/chul_ho_battering_bottom', 0, 10, true],
	['ef_sh_chul_ho_battering_cast', 'spirit_handler/sh_chul_ho_battering/chul_ho_battering_cast/chul_ho_battering_cast', 0, 10, false],
	['ef_sh_chul_ho_battering_hit', 'spirit_handler/sh_chul_ho_battering/chul_ho_battering_hit/chul_ho_battering_hit', 0, 5, false],
	['ef_sh_hogogong_strike', 'spirit_handler/sh_hogogong_strike/hogogong_strike', 0, 10, false],
	['ef_sh_howling_of_chul_ho', 'spirit_handler/sh_howling_of_chul_ho/howling_of_chul_ho/howling_of_chul_ho', 0, 10, false],
	['ef_sh_hyun_rok_cannon', 'spirit_handler/skid_sh_hyun_rok_cannon/hyun_rok_cannon', 0, 5, false],
	['ef_sh_hyun_rok_spirit_power', 'spirit_handler/sh_hyun_rok_spirit_power/hyun_rok_spirit_power/hyun_rok_spirit_power', 0, 10, false],
	['ef_sh_hyun_rok_spirit_power', 'spirit_handler/sh_hyun_rok_spirit_power/hyun_rok_spirit_power_bottom/hyun_rok_spirit_power_bottom', 0, 10, true],
	['ef_sh_hyun_rok_spirit_power_cast', 'spirit_handler/sh_hyun_rok_spirit_power/hyun_rok_spirit_power_cast/hyun_rok_spirit_power_cast', 0, 10, false],
	['ef_sh_hyun_rok_spirit_power_cast', 'spirit_handler/sh_hyun_rok_spirit_power/hyun_rok_spirit_power_cast_bottom/hyun_rok_spirit_power_cast_bottom', 0, 10, true],
	['ef_sh_hyun_rok_spirit_power_hit', 'spirit_handler/sh_hyun_rok_spirit_power/hyun_rok_spirit_power_hit/hyun_rok_spirit_power_hit', 0, 5, false],
	['ef_sh_ki_sul_rampage', 'spirit_handler/sh_ki_sul_rampage/ki_sul_rampage/ki_sul_rampage', 0, 12, false],
	['ef_sh_ki_sul_rampage', 'spirit_handler/sh_ki_sul_rampage/ki_sul_rampage_bottom/ki_sul_rampage_bottom', 0, 12, true],
	['ef_sh_ki_sul_water_spraying', 'spirit_handler/sh_ki_sul_water_spraying/ki_sul_water_spraying', 0, 10, false],
	['ef_sh_marine_festival_of_ki_sul', 'spirit_handler/sh_marine_festival_of_ki_sul/marine_festival_of_ki_sul/marine_festival_of_ki_sul', 0, 9, false],
	['ef_sh_marine_festival_of_ki_sul', 'spirit_handler/sh_marine_festival_of_ki_sul/marine_festival_of_ki_sul_bottom/marine_festival_of_ki_sul_bottom', 0, 9, true],
	['ef_sh_sandy_festival_of_ki_sul', 'spirit_handler/sh_sandy_festival_of_ki_sul/sandy_festival_of_ki_sul/sandy_festival_of_ki_sul', 0, 9, false],
	['ef_sh_sandy_festival_of_ki_sul', 'spirit_handler/sh_sandy_festival_of_ki_sul/sandy_festival_of_ki_sul_bottom/sandy_festival_of_ki_sul_bottom', 0, 9, true],
	['ef_sh_temporary_communion', 'spirit_handler/sh_temporary_communion/temporary_communion/temporary_communion', 0, 10, false],
	['ef_soa_circle_of_directions_and_elementals', 'soul_ascetic/soa_circle_of_directions_and_elementals/circle_directions_elements/circle_directions_elements', 0, 13, true],
	['ef_soa_exorcism_of_malicious_soul', 'soul_ascetic/soa_exorcism_of_malicious_soul/exorcism_of_malicuous_soul', 0, 13, true],
	['ef_soa_soul_gathering', 'soul_ascetic/soa_soul_gathering/soul_gathering', 0, 13, false],
	['ef_soa_soul_of_heaven_and_earth', 'soul_ascetic/soa_soul_of_heaven_and_earth/soul_of_heaven_and_earth/soul_of_heaven_and_earth', 0, 13, true],
	['ef_soa_talisman_of_black_tortoise', 'soul_ascetic/soa_talisman_of_black_tortoise/talisman_of_black_tortoise/talisman_of_black_tortoise', 0, 13, false],
	['ef_soa_talisman_of_black_tortoise', 'soul_ascetic/soa_talisman_of_black_tortoise/talisman_of_black_tortoise_bottom/talisman_of_black_tortoise_bottom', 0, 13, true],
	['ef_soa_talisman_of_blue_dragon', 'soul_ascetic/soa_talisman_of_blue_dragon/talisman_of_blue_dragon', 0, 13, false],
	['ef_soa_talisman_of_five_elements', 'soul_ascetic/soa_talisman_of_five_elements/talisman_of_the_five_elements', 0, 10, true],
	['ef_soa_talisman_of_four_bearing_god', 'soul_ascetic/soa_talisman_of_four_bearing_god/talisman_of_four_bearing_god', 0, 13, false],
	['ef_soa_talisman_of_magician', 'soul_ascetic/soa_talisman_of_magician/talisman_of_magician/talisman_of_magician', 0, 10, false],
	['ef_soa_talisman_of_magician', 'soul_ascetic/soa_talisman_of_magician/talisman_of_magician_bottom/talisman_of_magician_bottom', 0, 10, true],
	['ef_soa_talisman_of_protection', 'soul_ascetic/soa_talisman_of_protection/talisman_of_protection', 0, 10, false],
	['ef_soa_talisman_of_red_phoenix', 'soul_ascetic/soa_talisman_of_red_phoenix/talisman_of_red_phoenix/talisman_of_red_phoenix', 0, 13, false],
	['ef_soa_talisman_of_red_phoenix', 'soul_ascetic/soa_talisman_of_red_phoenix/talisman_of_red_phoenix_bottom/talisman_of_red_phoenix_bottom', 0, 13, true],
	['ef_soa_talisman_of_soul_stealing', 'soul_ascetic/soa_talisman_of_soul_stealing/talisman_of_soul_stealing', 0, 10, false],
	['ef_soa_talisman_of_warrior', 'soul_ascetic/soa_talisman_of_warrior/talisman_of_warrior', 0, 10, false],
	['ef_soa_talisman_of_white_tiger', 'soul_ascetic/soa_talisman_of_white_tiger/talisman_of_white_tiger', 0, 13, false],
	['ef_ss_akumukesu', 'shinkiro_shiranui/ss_akumukesu/akumukesu', 0, 10, false],
	['ef_ss_ankokuryuuakumu', 'shinkiro_shiranui/ss_ankokuryuuakumu/ankokuryuuakumu_00/ankokuryuuakumu_00', 0, 5, true],
	['ef_ss_ankokuryuuakumu', 'shinkiro_shiranui/ss_ankokuryuuakumu/ankokuryuuakumu_01/ankokuryuuakumu_01', 0, 5, false],
	['ef_ss_antenpou', 'shinkiro_shiranui/ss_antenpou/antenpou', 0, 5, true],
	['ef_ss_fuumakouchiku', 'shinkiro_shiranui/ss_fuumakouchiku/fuumakouchiku/fuumakouchiku', 0, 7, false],
	['ef_ss_fuumakouchiku', 'shinkiro_shiranui/ss_fuumakouchiku/new_fuumakouchiku/new_fuumakouchiku', 0, 7, false],
	['ef_ss_kageakumu', 'shinkiro_shiranui/ss_kageakumu/kageakumu', 0, 10, false],
	['ef_ss_kagegari', 'shinkiro_shiranui/ss_kagegari/kagegari', 0, 7, false],
	['ef_ss_kagegissen', 'shinkiro_shiranui/ss_kagegissen/kagegissen', 0, 7, false],
	['ef_ss_kagegissen', 'shinkiro_shiranui/ss_kagegissen/new_kagegissen/new_kagegissen', 0, 11, false],
	['ef_ss_kagegissen', 'shinkiro_shiranui/ss_kagegissen/new_kagegissen_bottom/new_kagegissen_bottom', 0, 11, true],
	['ef_ss_kagegissen_hit', 'shinkiro_shiranui/ss_kagegissen/new_kagegissen_hit/new_kagegissen_hit', 0, 7, false],
	['ef_ss_kagenomai', 'shinkiro_shiranui/ss_kagenomai/kagenomai', 0, 7, false],
	['ef_ss_kinryuuhou', 'shinkiro_shiranui/ss_kinryuuhou/kinryuuhou/kinryuuhou', 0, 5, false],
	['ef_ss_kinryuuhou_hit', 'shinkiro_shiranui/ss_kinryuuhou/kinryuuhou_hit/kinryuuhou_hit', 0, 5, false],
	['ef_ss_kunaikussetsu', 'shinkiro_shiranui/ss_kunaikussetsu/kunaikussetsu/kunaikussetsu', 0, 10, false],
	['ef_ss_kunaikussetsu', 'shinkiro_shiranui/ss_kunaikussetsu/kunaikussetsu_bottom/kunaikussetsu_bottom', 0, 10, true],
	['ef_ss_kunaiwaikyoku', 'shinkiro_shiranui/ss_kunaiwaikyoku/kunaiwaikyoku', 0, 5, false],
	['ef_ss_raidenpou', 'shinkiro_shiranui/ss_raidenpou/new_raidenpou/new_raidenpou', 0, 10, false],
	['ef_ss_raidenpou', 'shinkiro_shiranui/ss_raidenpou/new_raidenpou_bottom/new_raidenpou_bottom', 0, 10, true],
	['ef_ss_raidenpou', 'shinkiro_shiranui/ss_raidenpou/raidenpou', 0, 5, false],
	['ef_ss_raidenpou_cast', 'shinkiro_shiranui/ss_raidenpou/new_raidenpou_cast/new_raidenpou_cast', 0, 8, false],
	['ef_ss_raidenpou_hit', 'shinkiro_shiranui/ss_raidenpou/new_raidenpou_hit/new_raidenpou_hit', 0, 10, false],
	['ef_ss_reiketsuhou', 'shinkiro_shiranui/ss_reiketsuhou/reiketsuhou/reiketsuhou', 0, 5, false],
	['ef_ss_reiketsuhou', 'shinkiro_shiranui/ss_reiketsuhou/reiketsuhou_bottom/reiketsuhou_bottom', 0, 5, true],
	['ef_ss_sekienhou', 'shinkiro_shiranui/ss_sekienhou/sekienhou', 0, 5, false],
	['ef_ss_tokedasu', 'shinkiro_shiranui/ss_tokedasu/tokedasu/tokedasu', 0, 10, false]
];

describe('Hyper Novice, Spirit Handler, Shinkiro/Shiranui, Night Watch and Soul Ascetic EZ2 placement', () => {
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
