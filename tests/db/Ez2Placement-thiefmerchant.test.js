import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Shadow Cross, Abyss Chaser, Meister and Biolo: hand-written STR rows placed as the kRO client places them, from
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
	['ef_abc_abyss_dagger_hit', 'abyss_dagger/abyss_dagger_hit/abyss_dagger_hit', 0, 5, false],
	['ef_abc_abyss_flame', 'abyss_chaser/abc_abyss_flame/abyss_flame/abyss_flame', 0, 10, false],
	['ef_abc_abyss_flame_cast', 'abyss_chaser/abc_abyss_flame/abyss_flame_cast/abyss_flame_cast', 0, 10, false],
	['ef_abc_abyss_flame_cast', 'abyss_chaser/abc_abyss_flame/abyss_flame_cast_bottom/abyss_flame_cast_bottom', 0, 10, true],
	['ef_abc_abyss_flame_hit', 'abyss_chaser/abc_abyss_flame/abyss_flame_hit/abyss_flame_hit', 0, 6, false],
	['ef_abc_chasing_break', 'abyss_chaser/abc_chasing_break/chasing_break/chasing_break', 0, 5, false],
	['ef_abc_chasing_shot_cast', 'abyss_chaser/abc_chasing_shot/chasing_shot_cast/chasing_shot_cast', 0, 12, false],
	['ef_abc_chasing_shot_cast', 'abyss_chaser/abc_chasing_shot/chasing_shot_cast_bottom/chasing_shot_cast_bottom', 0, 12, false],
	['ef_abc_chasing_shot_hit', 'abyss_chaser/abc_chasing_shot/chasing_shot_hit/chasing_shot_hit', 0, 5, false],
	['ef_bo_dust_explosion', 'biolo/bo_dust_explosion/dust_explosion/dust_explosion', 0, 0, false],
	['ef_bo_dust_explosion_hit', 'biolo/bo_dust_explosion/dust_explosion_hit/dust_explosion_hit', 0, 12, false],
	['ef_bo_dust_explosion_hit', 'biolo/bo_dust_explosion/dust_explosion_hit_bottom/dust_explosion_hit_bottom', 0, 12, true],
	['ef_bo_explosive_powder', 'biolo/explosive_powder/explosive_powder/explosive_powder', 0, 10, false],
	['ef_bo_mayhemic_thorns', 'biolo/mayhemic_thorns/mayhemic_thorns/mayhemic_thorns', 0, 10, true],
	['ef_bo_mayhemic_thorns', 'biolo/mayhemic_thorns/mayhemic_thorns_bottom/mayhemic_thorns_bottom', 0, 10, true],
	['ef_bo_mystery_powder', 'biolo/bo_mystery_powder/mistery_powder/mistery_powder', 0, 5, false],
	['ef_bo_mystery_powder_hit', 'biolo/bo_mystery_powder/mistery_powder_hit/mistery_powder_hit', 0, 10, false],
	['ef_mt_axe_stomp_hit', 'new_axe_stomp/new_axe_stomp_hit/new_axe_stomp_hit', 0, 11, false],
	['ef_mt_energy_cannonade', 'meister/mt_energy_cannonade/energy_cannonade/energy_cannonade', 0, 5, false],
	['ef_mt_energy_cannonade_cast', 'meister/mt_energy_cannonade/energy_cannonade_cast/energy_cannonade_cast', 0, 11, true],
	['ef_mt_energy_cannonade_cast', 'meister/mt_energy_cannonade/energy_cannonade_cast_bottom/energy_cannonade_cast_bottom', 0, 11, true],
	['ef_mt_energy_cannonade_hit', 'meister/mt_energy_cannonade/energy_cannonade_hit/energy_cannonade_hit', 0, 5, false],
	['ef_mt_mighty_smash', 'meister/mighty_smash/mighty_smash/mighty_smash', 0, 10, true],
	['ef_mt_powerful_swing', 'meister/mt_powerful_swing/powerful_swing/powerful_swing', 0, 0, false],
	['ef_mt_powerful_swing', 'meister/mt_powerful_swing/powerful_swing_bottom/powerful_swing_bottom', 0, 0, true],
	['ef_mt_powerful_swing_hit', 'meister/mt_powerful_swing/powerful_swing_hit/powerful_swing_hit', 0, 11, false],
	['ef_mt_rush_strike', 'meister/mt_rush_strike/rush_strike/rush_strike', 0, 11, false],
	['ef_mt_rush_strike', 'meister/mt_rush_strike/rush_strike_bottom/rush_strike_bottom', 0, 11, true],
	['ef_mt_spark_blaster', 'meister/spark_blaster/spark_blaster/spark_blaster', 0, 10, false],
	['ef_mt_spark_blaster', 'meister/spark_blaster/spark_blaster_bottom/spark_blaster_bottom', 0, 10, true],
	['ef_mt_triple_laser', 'meister/triple_laser/triple_laser/triple_laser', 0, 13, false],
	['ef_shc_cross_slash', 'shadow_cross/shc_cross_slash/cross_slash/cross_slash', 0, 11, false],
	['ef_shc_dancing_knife_cast', 'shadow_cross/shc_dancing_knife/dancing_knife_cast/dancing_knife_cast', 0, 7, false],
	['ef_shc_dancing_knife_cast', 'shadow_cross/shc_dancing_knife/dancing_knife_cast_bottom/dancing_knife_cast_bottom', 0, 7, true],
	['ef_shc_enchanting_shadow', 'shadow_cross/shc_enchanting_shadow/enchanting_shadow/enchanting_shadow', 0, 10, false],
	['ef_shc_enchanting_shadow', 'shadow_cross/shc_enchanting_shadow/enchanting_shadow_bottom/enchanting_shadow_bottom', 0, 10, true],
	['ef_shc_impact_crater', 'shadow_cross/shc_impact_crater/impact_crater/impact_crater', 0, 11, false],
	['ef_shc_impact_crater', 'shadow_cross/shc_impact_crater/impact_crater_bottom/impact_crater_bottom', 0, 11, true],
	['ef_shc_impact_crater_hit', 'shadow_cross/shc_impact_crater/impact_crater_hit/impact_crater_hit', 0, 5, true],
	['ef_shc_shadow_exceed_cast', 'shadow_cross/shc_shadow_exceed/shadow_exceed_cast/shadow_exceed_cast', 0, 11, false]
];

describe('Shadow Cross, Abyss Chaser, Meister and Biolo EZ2 placement', () => {
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
