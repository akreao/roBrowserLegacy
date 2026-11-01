import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Cracker (GS_CRACKER 508): effect\크래커.wav when the use packet's result is set.
// Spec: effect-port/gunslinger-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function row(id) {
	const table = effectTableSource().replace(/\r\n/g, '\n');
	const start = table.indexOf(`\n\t${id}: [`);
	expect(start).toBeGreaterThan(0);
	const text = table.slice(table.indexOf('[', start), table.indexOf('\n\t],', start) + 3);
	return vm.runInNewContext(`(${text})`);
}

describe('Cracker effects', () => {
	it('plays where and when the official client plays it', () => {
		expect(read('DB/Skills/SkillEffect.js')).toContain('SkillEffect[SK.GS_CRACKER] = { successEffectIdOnCaster: \'ef_gs_cracker\' };');
	});

	it('plays the cracker sound', () => {
		const [sound] = row('ef_gs_cracker');
		expect(sound.wav).toBe('effect/\xc5\xa9\xb7\xa1\xc4\xbf');
	});
});
