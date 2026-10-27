import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Flip Tatami (NJ_TATAMIGAESHI, skill 527): the official client plays 다다미뒤집기.wav when the use
// packet succeeds, and each Tatami unit (0xbc) shows 631 once: 다다미 action 0, 6 ticks a frame,
// 6 units up, no sound. Spec: effect-port/ninja-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');
const units = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillUnit.js'), 'utf8');
const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');
const row = id => table.slice(table.indexOf(`\t${id}: [`), table.indexOf('\t],', table.indexOf(`\t${id}: [`)));

describe('Flip Tatami', () => {
	it('plays the flip sound when the skill works', () => {
		expect(skills).toContain("SkillEffect[SK.NJ_TATAMIGAESHI] = { successEffectId: 'ef_flip_tatami_sound' };");
		expect(row('ef_flip_tatami_sound')).toContain(
			"wav: 'effect/\\xb4\\xd9\\xb4\\xd9\\xb9\\xcc\\xb5\\xda\\xc1\\xfd\\xb1\\xe2'"
		);
	});

	it('shows 다다미 once on each unit, 6 ticks a frame, 6 units up, silent', () => {
		expect(units).toContain('SkillUnit[SU.UNT_TATAMIGAESHI] = EC.EF_TATAMI;');
		const r = row(631);
		expect(r).toContain("file: '\\xb4\\xd9\\xb4\\xd9\\xb9\\xcc',");
		expect(r).toContain('delayFrame: 6 * (1000 / 60),');
		expect(r).toContain('yOffset: -42,');
		expect(r).toContain('repeat: false,');
		expect(r).not.toContain('wav:');
	});
});
