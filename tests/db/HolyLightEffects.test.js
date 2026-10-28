import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Holy Light (AL_HOLYLIGHT, skill 156): the official client plays 0 (hit flash) and 152 (HolyHit.str)
// when the damage lands (0 on every hit, 152 with the first one), nothing on a miss. Spec: effect-port/acolyte-skills.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Holy Light effects', () => {
	it('plays 0 on every hit and 152 with the first, and nothing else', () => {
		expect(source).toMatch(/SkillEffect\[SK\.AL_HOLYLIGHT\] = \{ hitEffectId: 0, firstHitEffectId: 152 \};/);
	});
});
