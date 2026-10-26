import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Soul Strike (MG_SOULSTRIKE, skill 13): when the damage lands, the official client plays
// the standard hit flash (0) and EF_HIT2 (1) on the target, once per damage packet.
// Spec: effect-port/mage-audit.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Soul Strike hit', () => {
	it('plays 0 and 1 once per damage packet', () => {
		expect(source).toMatch(
			/SkillEffect\[SK\.MG_SOULSTRIKE\] = \{ beforeHitEffectId: 15, hitEffectId: \[0, 1\], hitEffectOnce: true \};/
		);
	});
});
