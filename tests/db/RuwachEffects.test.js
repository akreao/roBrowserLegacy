import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Ruwach (AL_RUWACH, skill 24): the official client plays nothing at use, and 0 (hit flash) and
// 1 (EF_HIT2) when its damage lands: 0 on every hit, 1 with the first one. Each damage packet
// plays 12 (EF_BEGINSPELL) on the caster as it arrives (motion effect, 2025-07-16 client). Spec: effect-port/acolyte-skills.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Ruwach effects', () => {
	it('plays 12 on the caster per packet, 0 on every hit and 1 with the first, and nothing at use', () => {
		expect(source).toContain(
			'SkillEffect[SK.AL_RUWACH] = { damageEffectIdOnCaster: 12, hitEffectId: 0, firstHitEffectId: 1 };'
		);
	});
});
