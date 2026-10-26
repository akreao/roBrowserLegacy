import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Holy Light (AL_HOLYLIGHT, skill 156): the official client plays 0 (hit flash) and 152 (HolyHit.str)
// once when the damage lands, nothing on a miss. Spec: effect-port/acolyte-skills.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Holy Light effects', () => {
	it('plays 0 and 152 once on the hit, and nothing else', () => {
		expect(source).toMatch(/SkillEffect\[SK\.AL_HOLYLIGHT\] = \{ hitEffectId: \[0, 152\], hitEffectOnce: true \};/);
	});
});
