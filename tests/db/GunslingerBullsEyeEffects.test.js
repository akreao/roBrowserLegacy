import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Bull's Eye (GS_BULLSEYE 503): 649 (불스아이.str) on the target as each damage packet arrives, hit flash 0 once per packet.
// Spec: effect-port/gunslinger-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function row(id) {
	const table = effectTableSource().replace(/\r\n/g, '\n');
	const start = table.indexOf(`\n\t${id}: [`);
	expect(start).toBeGreaterThan(0);
	const text = table.slice(table.indexOf('[', start), table.indexOf('\n\t],', start) + 3);
	return vm.runInNewContext(`(${text})`);
}

describe("Bull's Eye effects", () => {
	it('plays where and when the official client plays it', () => {
		expect(read('DB/Skills/SkillEffect.js')).toContain('SkillEffect[SK.GS_BULLSEYE] = { damageEffectIdOnTarget: 649, hitEffectId: 0, hitEffectOnce: true };');
	});

	it('is the bullseye STR, without a sound', () => {
		const parts = row(649);
		expect(parts).toHaveLength(1);
		expect(parts[0].type).toBe('STR');
		expect(parts[0].wav).toBeUndefined();
	});
});
