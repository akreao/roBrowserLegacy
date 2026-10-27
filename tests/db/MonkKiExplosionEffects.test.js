import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Ki Explosion (MO_BALKYOUNG, 1016): the official client plays no effect of its own and no
// hit flash; the hit plays 2 (its hit-map effect). 514 is not used for it.
// Spec: effect-port/monk-skills.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Ki Explosion effects', () => {
	it('plays 2 on the hit and nothing else', () => {
		expect(source).toMatch(/SkillEffect\[SK\.MO_BALKYOUNG\] = \{ hitEffectId: 2 \};/);
	});
});
