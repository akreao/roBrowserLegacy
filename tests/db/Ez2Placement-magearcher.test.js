import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Arch Mage, Elemental Master, Windhawk and Troubadour/Trouvere: hand-written STR rows placed as the kRO client places them, from
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
	['ef_ag_energy_conversion', 'archmage/ag_energy_conversion/energy_conversion/energy_conversion', 0, 12, false],
	['ef_ag_energy_conversion_cast', 'archmage/ag_energy_conversion/energy_conversion_cast/energy_conversion_cast', 0, 11, false],
	['ef_ag_energy_conversion_cast', 'archmage/ag_energy_conversion/energy_conversion_cast_bottom/energy_conversion_cast_bottom', 0, 11, true],
	['ef_em_psychic_stream', 'elemental_master/em_psychic_stream/psychic_stream/psychic_stream', 0, 12, false],
	['ef_em_psychic_stream', 'elemental_master/em_psychic_stream/psychic_stream_bottom/psychic_stream_bottom', 0, 12, true],
	['ef_em_psychic_stream_cast', 'elemental_master/em_psychic_stream/psychic_stream_cast/psychic_stream_cast', 0, 10, false],
	['ef_em_psychic_stream_hit', 'elemental_master/em_psychic_stream/psychic_stream_hit/psychic_stream_hit', 0, 8, false],
	['ef_tr_ain_rhapsody', 'ain_rhapsody/ain_rhapsody/ain_rhapsody', 0, 14, false],
	['ef_tr_ain_rhapsody_cast', 'ain_rhapsody/ain_rhapsody_cast/ain_rhapsody_cast', 0, 9, false],
	['ef_tr_gef_nocturn', 'gef_nocturn/gef_nocturn/gef_nocturn', 0, 15, false],
	['ef_tr_gef_nocturn_cast', 'gef_nocturn/gef_nocturn_cast/gef_nocturn_cast', 0, 9, false],
	['ef_tr_gef_nocturn_cast', 'gef_nocturn/gef_nocturn_cast_bottom/gef_nocturn_cast_bottom', 0, 9, true],
	['ef_tr_jawaii_serenade', 'jawaii_serenade/jawaii_serenade/jawaii_serenade', 0, 15, false],
	['ef_tr_jawaii_serenade_cast', 'jawaii_serenade/jawaii_serenade_cast/jawaii_serenade_cast', 0, 9, false],
	['ef_tr_jawaii_serenade_cast', 'jawaii_serenade/jawaii_serenade_cast_bottom/jawaii_serenade_cast_bottom', 0, 9, true],
	['ef_tr_kvasir_sonata', '4tr_kvasirsonata/kvasirsonata/kvasirsonata', 0, 24, false],
	['ef_tr_kvasir_sonata_cast', '4tr_kvasirsonata/kvasirsonata_cast/kvasirsonata_cast', 0, 9, false],
	['ef_tr_kvasir_sonata_cast', '4tr_kvasirsonata/kvasirsonata_cast_bottom/kvasirsonata_cast_bottom', 0, 9, true],
	['ef_tr_metalic_fury', 'metalicfury/metalicfury/metalicfury', 0, 7, false],
	['ef_tr_pron_march', 'pronmarch/pronmarch/pronmarch', 0, 15, false],
	['ef_tr_pron_march_cast', 'pronmarch/pronmarch_cast/pronmarch_cast', 0, 9, false],
	['ef_tr_pron_march_cast', 'pronmarch/pronmarch_cast_bottom/pronmarch_cast_bottom', 0, 9, true],
	['ef_tr_rhythmical_wave', 'troubadour_trouvere/tr_rhythmical_wave/rhythmical_wave/rhythmical_wave', 0, 11, false],
	['ef_tr_rhythmical_wave', 'troubadour_trouvere/tr_rhythmical_wave/rhythmical_wave_bottom/rhythmical_wave_bottom', 0, 11, true],
	['ef_tr_rhythmical_wave_cast', 'troubadour_trouvere/tr_rhythmical_wave/rhythmical_wave_cast/rhythmical_wave_cast', 0, 11, false],
	['ef_tr_rhythmical_wave_cast', 'troubadour_trouvere/tr_rhythmical_wave/rhythmical_wave_cast_bottom/rhythmical_wave_cast_bottom', 0, 11, true],
	['ef_tr_rhythmical_wave_hit', 'troubadour_trouvere/tr_rhythmical_wave/rhythmical_wave_hit/rhythmical_wave_hit', 0, 11, false],
	['ef_wh_calamitygale_cast', 'windhawk/calamitygale/calumitygale_cast/calumitygale_cast', 0, 11, false],
	['ef_wh_galestorm_cast', 'galestorm/galestorm_cast/galestorm_cast', 0, 10, false],
	['ef_wh_galestorm_hit', 'galestorm/galestorm_hit/galestorm_hit', 0, 7, false],
	['ef_wh_wild_walk', 'windhawk/wh_wild_walk/wild_walk/wild_walk', 0, 10, false],
	['ef_wh_wild_walk_cast', 'windhawk/wh_wild_walk/wild_walk_cast/wild_walk_cast', 0, 10, false],
	['ef_wh_wild_walk_cast', 'windhawk/wh_wild_walk/wild_walk_cast_bottom/wild_walk_cast_bottom', 0, 10, true],
	['ef_wh_wild_walk_hit', 'windhawk/wh_wild_walk/wild_walk_hit/wild_walk_hit', 0, 5, false]
];

describe('Arch Mage, Elemental Master, Windhawk and Troubadour/Trouvere EZ2 placement', () => {
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
