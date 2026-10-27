import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Chain Crush Combo (CH_CHAINCRUSH, 372): as the damage packet arrives the official client
// launches 263 and 512 on the caster (512 aimed at the target); every hit plays the hit
// flash 0, the first one also 1. Spec: effect-port/monk-skills.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Chain Crush Combo effects', () => {
	it('plays 263 and 512 on the caster at packet arrival, 0 on each hit and 1 on the first', () => {
		expect(source).toMatch(
			/SkillEffect\[SK\.CH_CHAINCRUSH\] = \{ damageEffectIdOnCaster: \[263, 512\], hitEffectId: 0, firstHitEffectId: 1 \};/
		);
	});
});
