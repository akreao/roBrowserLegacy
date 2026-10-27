import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Sightrasher (WZ_SIGHTRASHER, skill 81), as the official client plays it: 62 on the caster
// from the use packet when the skill works, and 62 on the caster again as each damage packet
// arrives (it is the skill's caster effect, launched for every target hit). With the damage,
// once per packet, the standard hit flash (0) and the fire hit (49).
// Spec: effect-port/wizard-audit.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Sightrasher effects', () => {
	it('plays 62 on success and per damage packet on the caster, 0 + 49 once per hit packet', () => {
		expect(source).toMatch(
			/SkillEffect\[SK\.WZ_SIGHTRASHER\] = \{ successEffectId: 62, damageEffectIdOnCaster: 62, hitEffectId: \[0, 49\], hitEffectOnce: true \};/
		);
	});
});
