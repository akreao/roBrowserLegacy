import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Spread Attack (GS_SPREADATTACK 520): 645 on the caster as each damage packet arrives (sprite at 4 ticks a frame), hit flash 0 once per packet.
// Spec: effect-port/gunslinger-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function row(id) {
	const table = effectTableSource().replace(/\r\n/g, '\n');
	const start = table.indexOf(`\n\t${id}: [`);
	expect(start).toBeGreaterThan(0);
	const text = table.slice(table.indexOf('[', start), table.indexOf('\n\t],', start) + 3);
	return vm.runInNewContext(`(${text})`);
}

describe('Spread Attack effects', () => {
	it('plays where and when the official client plays it', () => {
		expect(read('DB/Skills/SkillEffect.js')).toContain('SkillEffect[SK.GS_SPREADATTACK] = { damageEffectIdOnCaster: 645, hitEffectId: 0, hitEffectOnce: true };');
	});

	it('runs the sprite at 4 ticks a frame', () => {
		const [spr] = row(645);
		expect(spr.delayFrame).toBe(67);
	});
});
