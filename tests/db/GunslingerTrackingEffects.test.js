import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Tracking (GS_TRACKING 512): 647 on the target as each damage packet arrives (2 ticks a frame), hit flash 0 once per packet; 646 not played.
// Spec: effect-port/gunslinger-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function row(id) {
	const table = read('DB/Effects/EffectTable.js');
	const start = table.indexOf(`\n\t${id}: [`);
	expect(start).toBeGreaterThan(0);
	const text = table.slice(table.indexOf('[', start), table.indexOf('\n\t],', start) + 3);
	return vm.runInNewContext(`(${text})`);
}

describe('Tracking effects', () => {
	it('plays where and when the official client plays it', () => {
		expect(read('DB/Skills/SkillEffect.js')).toContain('SkillEffect[SK.GS_TRACKING] = { damageEffectIdOnTarget: 647, hitEffectId: 0, hitEffectOnce: true };');
	});

	it('runs the sprite at 2 ticks a frame', () => {
		const [spr] = row(647);
		expect(spr.delayFrame).toBe(33);
	});
});
