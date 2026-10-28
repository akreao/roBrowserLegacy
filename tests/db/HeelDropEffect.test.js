import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Heel Drop (TK_DOWNKICK, skill 415): as each damage packet arrives the official client plays
// 413 (EF_PRESSEDBODY: sound at tick 5, the target pressed down from tick 17) on the target.
// The first hit lands 300 ms after attackMT; every hit plays the hit flash 0, 200 ms apart.
// Spec: effect-port/taekwon-skills.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Heel Drop effects', () => {
	it('presses the target at packet arrival and hits 300 ms late with the hit flash on every hit', () => {
		expect(source).toMatch(
			/SkillEffect\[SK\.TK_DOWNKICK\] = \{ damageEffectIdOnTarget: 413, hitEffectId: \[0\], hitDelay: 300 \};/
		);
	});
});
