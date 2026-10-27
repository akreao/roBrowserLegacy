import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// When the official client (kRO 2025-07-16) plays the Priest effect sounds, in ms from the
// effect's start (ticks of 1/60 s). Spec: effect-port/priest-audit.md.
//
// Read as text: the effect table imports the renderer, which does not load without a canvas.
const effectTable = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8').replace(/\r\n/g, '\n');

/** [wav, delay ms] of every layer of an effect that plays a sound */
function sounds(id) {
	const start = effectTable.indexOf(`\n\t${id}: [`);
	expect(start, `${id} is defined`).toBeGreaterThan(-1);
	const end = effectTable.indexOf('\n\t],', start);
	return effectTable
		.slice(start, end)
		.split('\n\t\t{')
		.slice(1)
		.map(layer => {
			const wav = layer.match(/wav: '([^']+)'/);
			const delay = layer.match(/delayWav: (\d+)/);
			return wav ? [wav[1], delay ? Number(delay[1]) : 0] : null;
		})
		.filter(Boolean);
}

describe('Priest effect sounds', () => {
	it('Impositio Manus (84) on tick 60', () => {
		expect(sounds(84)).toEqual([['effect/priest_impositio', 1000]]);
	});

	it('Lex Aeterna (85) on tick 15', () => {
		expect(sounds(85)).toEqual([['effect/priest_lexaeterna', 250]]);
	});

	it('Aspersio (86) on tick 70', () => {
		expect(sounds(86)).toEqual([['effect/priest_aspersio', 1167]]);
	});

	it('Lex Divina (87) on ticks 0, 20, 35, 60 and 70', () => {
		expect(sounds(87)).toEqual([0, 333, 583, 1000, 1167].map(ms => ['effect/priest_lexdivina', ms]));
	});

	it('Kyrie Eleison (112): _b on tick 0, _a on tick 15', () => {
		expect(sounds(112)).toEqual([
			['effect/priest_kyrie_eleison_b', 0],
			['effect/priest_kyrie_eleison_a', 250]
		]);
	});

	it('Slow Poison (136) is silent', () => {
		expect(sounds(136)).toEqual([]);
	});
});
