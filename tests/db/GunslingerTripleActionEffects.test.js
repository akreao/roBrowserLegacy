import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Triple Action (GS_TRIPLEACTION 502): 648 on the target as each damage packet arrives (sound on tick 25, sprite from tick 30 at 2 ticks a frame), hit flash 0 once per packet.
// Spec: effect-port/gunslinger-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function row(id) {
	const table = effectTableSource().replace(/\r\n/g, '\n');
	const start = table.indexOf(`\n\t${id}: [`);
	expect(start).toBeGreaterThan(0);
	const text = table.slice(table.indexOf('[', start), table.indexOf('\n\t],', start) + 3);
	return vm.runInNewContext(`(${text})`);
}

describe('Triple Action effects', () => {
	it('plays where and when the official client plays it', () => {
		expect(read('DB/Skills/SkillEffect.js')).toContain('SkillEffect[SK.GS_TRIPLEACTION] = { damageEffectIdOnTarget: 648, hitEffectId: 0, hitEffectOnce: true };');
	});

	it('plays the sound on tick 25 and the sprite from tick 30, 2 ticks a frame', () => {
		const parts = row(648);
		const wav = parts.find(p => p.wav);
		const spr = parts.find(p => p.type === 'SPR');
		expect(wav.delayWav).toBe(417);
		expect(spr.wav).toBeUndefined();
		expect(spr.delayStart).toBe(500);
		expect(spr.delayFrame).toBe(33);
	});
});
