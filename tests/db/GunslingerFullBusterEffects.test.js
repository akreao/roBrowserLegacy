import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Full Buster (GS_FULLBUSTER 519): 584 on the caster as each damage packet arrives (sprite at 4 ticks a frame, effect\\풀버스터.wav on tick 5), hit flash 0 once per packet.
// Spec: effect-port/gunslinger-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function row(id) {
	const table = read('DB/Effects/EffectTable.js');
	const start = table.indexOf(`\n\t${id}: [`);
	expect(start).toBeGreaterThan(0);
	const text = table.slice(table.indexOf('[', start), table.indexOf('\n\t],', start) + 3);
	return vm.runInNewContext(`(${text})`);
}

describe('Full Buster effects', () => {
	it('plays where and when the official client plays it', () => {
		expect(read('DB/Skills/SkillEffect.js')).toContain('SkillEffect[SK.GS_FULLBUSTER] = { damageEffectIdOnCaster: 584, hitEffectId: 0, hitEffectOnce: true };');
	});

	it('runs the sprite at 4 ticks a frame and plays its sound on tick 5', () => {
		const [spr] = row(584);
		expect(spr.wav).toBe('effect/\xc7\xae\xb9\xf6\xbd\xba\xc5\xcd');
		expect(spr.delayWav).toBe(83);
		expect(spr.delayFrame).toBe(67);
	});
});
