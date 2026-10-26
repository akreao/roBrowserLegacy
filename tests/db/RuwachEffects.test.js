import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Ruwach (AL_RUWACH, skill 24): the official client plays nothing at use, and 0 (hit flash) and
// 1 (EF_HIT2) when its damage lands. Spec: effect-port/acolyte-skills.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Ruwach effects', () => {
	it('plays 0 and 1 on the hit, and nothing at use', () => {
		expect(source).toMatch(/SkillEffect\[SK\.AL_RUWACH\] = \{ hitEffectId: \[0, 1\] \};/);
	});
});
