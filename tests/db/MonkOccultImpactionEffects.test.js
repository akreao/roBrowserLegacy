import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Occult Impaction (MO_INVESTIGATE, 266): the official client plays 267 (mon_침투경.wav)
// on the caster as the damage packet arrives, and the hit flash 0 on the target.
// Its sparks (264) are not ported yet. Spec: effect-port/monk-skills.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Occult Impaction effects', () => {
	it('plays 267 on the caster at packet arrival and 0 on the hit', () => {
		expect(source).toMatch(
			/SkillEffect\[SK\.MO_INVESTIGATE\] = \{ damageEffectIdOnCaster: 267, hitEffectId: 0 \};/
		);
	});
});
