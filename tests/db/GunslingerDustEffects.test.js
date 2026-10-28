import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Dust (GS_DUST 518): 628 on the target as each damage packet arrives (effect\\더스트샷.wav on tick 0), hit flash 0 once per packet.
// Spec: effect-port/gunslinger-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function row(id) {
	const table = read('DB/Effects/EffectTable.js');
	const start = table.indexOf(`\n\t${id}: [`);
	expect(start).toBeGreaterThan(0);
	const text = table.slice(table.indexOf('[', start), table.indexOf('\n\t],', start) + 3);
	return vm.runInNewContext(`(${text})`);
}

describe('Dust effects', () => {
	it('plays where and when the official client plays it', () => {
		expect(read('DB/Skills/SkillEffect.js')).toContain('SkillEffect[SK.GS_DUST] = { damageEffectIdOnTarget: 628, hitEffectId: 0, hitEffectOnce: true };');
	});

	it('plays the dust shot sound', () => {
		const [sound] = row(628);
		expect(sound.wav).toBe('effect/\xb4\xf5\xbd\xba\xc6\xae\xbc\xa6');
	});
});
