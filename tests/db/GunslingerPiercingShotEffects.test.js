import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Piercing Shot (GS_PIERCINGSHOT 514): 623 on the caster as each damage packet arrives (effect\\피어싱샷.wav on tick 28), hit flash 0 once per packet.
// Spec: effect-port/gunslinger-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function row(id) {
	const table = read('DB/Effects/EffectTable.js');
	const start = table.indexOf(`\n\t${id}: [`);
	expect(start).toBeGreaterThan(0);
	const text = table.slice(table.indexOf('[', start), table.indexOf('\n\t],', start) + 3);
	return vm.runInNewContext(`(${text})`);
}

describe('Piercing Shot effects', () => {
	it('plays where and when the official client plays it', () => {
		expect(read('DB/Skills/SkillEffect.js')).toContain('SkillEffect[SK.GS_PIERCINGSHOT] = { damageEffectIdOnCaster: 623, hitEffectId: 0, hitEffectOnce: true };');
	});

	it('plays its sound on tick 28', () => {
		const [sound] = row(623);
		expect(sound.wav).toBe('effect/\xc7\xc7\xbe\xee\xbd\xcc\xbc\xa6');
		expect(sound.delayWav).toBe(467);
	});
});
