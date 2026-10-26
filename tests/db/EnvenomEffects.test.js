import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Envenom (TF_POISON, skill 52): the official client plays 16 (EF_BASH) on the caster as each damage
// packet arrives, and on the hit the standard hit flash (0) and EF_HIT2 (1) once per packet.
// Spec: effect-port/thief-skills.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Envenom effects', () => {
	it('plays 16 on the caster per packet and 0 + 1 once per hit packet', () => {
		expect(source).toMatch(
			/SkillEffect\[SK\.TF_POISON\] = \{ damageEffectIdOnCaster: 16, hitEffectId: \[0, 1\], hitEffectOnce: true \};/
		);
	});

	it('no longer plays effect 20', () => {
		expect(source).not.toMatch(/SkillEffect\[SK\.TF_POISON\] = \{[^}]*\b20\b/);
	});
});
