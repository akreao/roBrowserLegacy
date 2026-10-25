import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Fourth-job skills whose art the client's data has and the effect tables did
// not use (tracking list: Flux159/ragnarokoffline.app#309). Hasty Fire in the
// Hole had no effect at all (now HastyFireInTheHole.test.js); Enchanting Sky and Dark Dragon - Nightmare drew only
// their sound.
//
// Read as text: the effect tables import the renderer, which does not load
// without a canvas, and what is being checked is what the tables say.
const read = file => readFileSync(join(process.cwd(), 'src/DB', file), 'utf8').replace(/\r\n/g, '\n');
const effectTable = read('Effects/EffectTable.js');
const skillEffect = read('Skills/SkillEffect.js');

// The layers of one effect: its source text, split at each `{` that opens one.
function effect(id) {
	const start = effectTable.indexOf(`\n\t${id}: [`);
	expect(start, `${id} is defined`).toBeGreaterThan(-1);
	const end = effectTable.indexOf('\n\t],', start);
	return effectTable
		.slice(start, end)
		.split('\n\t\t{')
		.slice(1)
		.map(layer => ({
			text: layer,
			str: /type: 'STR'/.test(layer),
			get: key => (layer.match(new RegExp(`${key}: '([^']+)'`)) || [])[1]
		}));
}

describe('fourth-job effects mapped to the art the client has', () => {
	it('draws Enchanting Sky and Dark Dragon - Nightmare, not just their sound', () => {
		// Enchanting Sky is drawn by its status (EnchantingSky.test.js): a burst, then a loop.
		expect(skillEffect).toMatch(/SkillEffect\[SK\.SS_ANKOKURYUUAKUMU\] = \{ effectId: 'ef_ss_ankokuryuuakumu'[, }]/);
		expect(effect('ef_ske_enchanting_sky').filter(layer => layer.str)).toHaveLength(1);
		expect(effect('ef_ske_enchanting_sky_loop').filter(layer => layer.str)).toHaveLength(1);
		expect(effect('ef_ss_ankokuryuuakumu').filter(layer => layer.str)).toHaveLength(2);
	});

	it('keeps their sounds', () => {
		expect(effect('ef_ske_enchanting_sky').some(layer => layer.get('wav') === 'effect/sky_emperor/ske_enchanting_sky')).toBe(true);
		expect(
			effect('ef_ss_ankokuryuuakumu').some(layer => layer.get('wav') === 'effect/shinkiro_shiranui/ss_ankokuryuuakumu')
		).toBe(true);
	});

	it('gives every layer a file, its texture folder and a lighter version', () => {
		for (const id of [
			'ef_ske_enchanting_sky',
			'ef_ske_enchanting_sky_loop',
			'ef_ss_ankokuryuuakumu'
		]) {
			for (const layer of effect(id).filter(l => l.str)) {
				const file = layer.get('file');
				const folder = file.slice(0, file.lastIndexOf('/') + 1);
				expect(layer.get('texturePath'), `${id} ${file}`).toBe(folder);
				expect(layer.get('min'), `${id} ${file}`).toBe(`${folder}min_${file.slice(folder.length)}`);
			}
		}
	});
});
