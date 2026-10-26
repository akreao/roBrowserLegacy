import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Roundhouse (TK_TURNKICK, skill 417): as each damage packet arrives the official client plays
// 466 (EF_SPINEDBODY2: sound at tick 5, the target spun round from tick 14) on the target. The
// hit, with the hit flash 0 once, lands 300 ms after attackMT. The splash targets get 414 from
// the server. Spec: effect-port/taekwon-skills.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Roundhouse effects', () => {
	it('spins the target at packet arrival and hits 300 ms late with one hit flash', () => {
		expect(source).toMatch(
			/SkillEffect\[SK\.TK_TURNKICK\] = \{ damageEffectIdOnTarget: 466, hitEffectId: \[0\], hitEffectOnce: true, hitDelay: 300 \};/
		);
	});
});
