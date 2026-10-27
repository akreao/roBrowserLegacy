import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Earth Spike (WZ_EARTHSPIKE, skill 90), as the official client plays it: the spikes (79) on
// the target as soon as the damage packet arrives, then with the damage, once per packet
// whatever the hit count, EarthHit.str (147) twice: it is both the skill's hit flash and its
// hit effect. Spec: effect-port/wizard-audit.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Earth Spike effects', () => {
	it('plays 79 at packet arrival and 147 twice once per packet', () => {
		expect(source).toMatch(
			/SkillEffect\[SK\.WZ_EARTHSPIKE\] = \{ damageEffectIdOnTarget: 79, hitEffectId: \[147, 147\], hitEffectOnce: true \};/
		);
	});
});
