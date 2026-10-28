import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Zen (CH_SOULCOLLECT, 401): when the cast starts the official client launches 402 on the
// caster, besides the usual cast circle; no extra 12. Spec: effect-port/monk-skills.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Zen effects', () => {
	it('plays 402 at cast start', () => {
		expect(source).toMatch(/SkillEffect\[SK\.CH_SOULCOLLECT\] = \{ beginCastEffectId: 402 \};/);
	});
});
