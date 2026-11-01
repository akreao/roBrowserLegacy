import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Magical Bullet (GS_MAGICALBULLET 507): 644 on the target as each damage packet arrives (sprite and sound on tick 0, 2 ticks a frame), hit flash 0 once per packet.
// Spec: effect-port/gunslinger-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function row(id) {
	const table = effectTableSource().replace(/\r\n/g, '\n');
	const start = table.indexOf(`\n\t${id}: [`);
	expect(start).toBeGreaterThan(0);
	const text = table.slice(table.indexOf('[', start), table.indexOf('\n\t],', start) + 3);
	return vm.runInNewContext(`(${text})`);
}

describe('Magical Bullet effects', () => {
	it('plays where and when the official client plays it', () => {
		expect(read('DB/Skills/SkillEffect.js')).toContain('SkillEffect[SK.GS_MAGICALBULLET] = { damageEffectIdOnTarget: 644, hitEffectId: 0, hitEffectOnce: true };');
	});

	it('runs the sprite at 2 ticks a frame with its sound at once', () => {
		const [spr] = row(644);
		expect(spr.delayFrame).toBe(33);
		expect(spr.delayWav).toBeUndefined();
	});
});
