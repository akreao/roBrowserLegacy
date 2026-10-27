import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Quagmire (WZ_QUAGMIRE, skill 92): every unit cell (25 at level 5) launches effect 95, and the
// official client plays wizard_quagmire.wav for a launch only 1 time in 12, so a whole Quagmire
// is not 25 sounds at once. Spec: effect-port/wizard-audit.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function effect95() {
	const table = read('DB/Effects/EffectTable.js');
	const start = table.indexOf('\n\t95: [');
	const text = table.slice(table.indexOf('[', start), table.indexOf('\n\t],', start) + 3);
	return vm.runInNewContext(`(${text})`);
}

describe('Quagmire sound', () => {
	it('plays the sound 1 time in 12 per launch', () => {
		const sound = effect95().find(row => row.wav);
		expect(sound.wav).toBe('effect/wizard_quagmire');
		expect(sound.wavChance).toBeCloseTo(1 / 12, 10);
	});
});
