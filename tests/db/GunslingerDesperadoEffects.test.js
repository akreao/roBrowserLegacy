import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Desperado (GS_DESPERADO 516): 637 once on the caster (sprite at 4 ticks a frame, sound on tick 10); its unit's hits play nothing.
// Spec: effect-port/gunslinger-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function row(id) {
	const table = effectTableSource().replace(/\r\n/g, '\n');
	const start = table.indexOf(`\n\t${id}: [`);
	expect(start).toBeGreaterThan(0);
	const text = table.slice(table.indexOf('[', start), table.indexOf('\n\t],', start) + 3);
	return vm.runInNewContext(`(${text})`);
}

describe('Desperado effects', () => {
	it('plays where and when the official client plays it', () => {
		expect(read('DB/Skills/SkillEffect.js')).toContain('SkillEffect[SK.GS_DESPERADO] = { groundEffectIdByLevel: [637] };');
	});

	it('runs the sprite at 4 ticks a frame and plays its sound on tick 10', () => {
		const [spr] = row(637);
		expect(spr.attachedEntity).toBe(true);
		expect(spr.delayWav).toBe(167);
		expect(spr.delayFrame).toBe(67);
	});
});
