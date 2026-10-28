import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Rapid Shower (GS_RAPIDSHOWER 515): 643 on the target as each damage packet arrives (sprite at 4 ticks a frame, sound on tick 20), hit flash 0 once per packet.
// Spec: effect-port/gunslinger-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function row(id) {
	const table = read('DB/Effects/EffectTable.js');
	const start = table.indexOf(`\n\t${id}: [`);
	expect(start).toBeGreaterThan(0);
	const text = table.slice(table.indexOf('[', start), table.indexOf('\n\t],', start) + 3);
	return vm.runInNewContext(`(${text})`);
}

describe('Rapid Shower effects', () => {
	it('plays where and when the official client plays it', () => {
		expect(read('DB/Skills/SkillEffect.js')).toContain('SkillEffect[SK.GS_RAPIDSHOWER] = { damageEffectIdOnTarget: 643, hitEffectId: 0, hitEffectOnce: true };');
	});

	it('runs the sprite at 4 ticks a frame and plays the sound on tick 20', () => {
		const [spr] = row(643);
		expect(spr.delayFrame).toBe(67);
		expect(spr.delayWav).toBe(333);
	});
});
