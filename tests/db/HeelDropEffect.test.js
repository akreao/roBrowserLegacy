import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Heel Drop (TK_DOWNKICK, skill 415): as each damage packet arrives the official client plays
// 413 (EF_PRESSEDBODY: sound at tick 5, the target pressed down from tick 17) on the target.
// The hit, with the hit flash 0 once, lands 300 ms after attackMT.
// Spec: effect-port/taekwon-skills.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Heel Drop effects', () => {
	it('presses the target at packet arrival and hits 300 ms late with one hit flash', () => {
		expect(source).toMatch(
			/SkillEffect\[SK\.TK_DOWNKICK\] = \{ damageEffectIdOnTarget: 413, hitEffectId: \[0\], hitEffectOnce: true, hitDelay: 300 \};/
		);
	});
});
