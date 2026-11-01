import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Lord of Vermilion (WZ_VERMILION, skill 85), as the official client plays effect 90 at the
// cell: Lord.str with wizard_meteo.wav and hunter_blastmine.wav on tick 0, hunter_blastmine.wav
// on tick 10, wizard_meteo.wav on ticks 20, 50, 80, 100, 130, 140, 180 and 200, and a camera
// quake on ticks 50, 100, 150, 200 and 250. The unit hits keep the wind hit (52).
// Spec: effect-port/wizard-audit.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const TICK = 1000 / 60;

function effect90() {
	const table = effectTableSource().replace(/\r\n/g, '\n');
	const start = table.indexOf('\n\t90: [');
	const text = table.slice(table.indexOf('[', start), table.indexOf('\n\t],', start) + 3);
	const quakes = [];
	const rows = vm.runInNewContext(`(${text})`, { Camera: { setQuake: start => quakes.push(start) } });
	return { rows, quakes };
}

describe('Lord of Vermilion effects', () => {
	it('keeps 90 at the cell and the wind hit per unit hit', () => {
		expect(read('DB/Skills/SkillEffect.js')).toMatch(
			/SkillEffect\[SK\.WZ_VERMILION\] = \{ effectId: 90, hitEffectId: 52 \};/
		);
	});

	it('plays the STR and the official sounds on their ticks', () => {
		const { rows } = effect90();
		expect(rows[0]).toMatchObject({ type: 'STR', file: 'lord' });
		expect(rows[0].wav).toBeUndefined();
		const sounds = rows.filter(row => row.wav).map(row => [Math.round(row.delayWav / TICK), row.wav]);
		expect(sounds).toEqual([
			[0, 'effect/wizard_meteo'],
			[0, 'effect/hunter_blastmine'],
			[10, 'effect/hunter_blastmine'],
			...[20, 50, 80, 100, 130, 140, 180, 200].map(t => [t, 'effect/wizard_meteo'])
		]);
	});

	it('shakes the camera every 50 ticks from tick 50 to 250', () => {
		const { rows, quakes } = effect90();
		rows.filter(row => row.type === 'FUNC').forEach(row => row.func({ Inst: { startTick: 1000 } }));
		expect(quakes.map(t => Math.round((t - 1000) / TICK))).toEqual([50, 100, 150, 200, 250]);
	});
});
