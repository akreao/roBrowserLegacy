import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Envenom (TF_POISON, skill 52): the official client plays 16 (EF_BASH) on the caster as each damage
// packet arrives, and the standard hit flash (0) on every hit with EF_HIT2 (1) on the first hit of the packet
// (kRO 2025-07-16). Spec: effect-port/thief-skills.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Envenom effects', () => {
	it('plays 16 on the caster per packet, 0 on every hit and 1 with the first', () => {
		expect(source).toMatch(
			/SkillEffect\[SK\.TF_POISON\] = \{ damageEffectIdOnCaster: 16, hitEffectId: 0, firstHitEffectId: 1 \};/
		);
	});

	it('no longer plays effect 20', () => {
		expect(source).not.toMatch(/SkillEffect\[SK\.TF_POISON\] = \{[^}]*\b20\b/);
	});
});
