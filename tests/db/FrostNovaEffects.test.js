import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Frost Nova (WZ_FROSTNOVA, skill 88), as the official client plays it: the use packet (when the
// skill works) launches the Frost Diver burst (28) on its target, the caster; each damaged target
// gets the standard hit flash (0) and 28 once per damage packet. Nothing plays the cold hit (51).
// Spec: effect-port/wizard-audit.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Frost Nova effects', () => {
	it('plays 28 on the caster on success and 0 + 28 once on each target', () => {
		expect(source).toMatch(
			/SkillEffect\[SK\.WZ_FROSTNOVA\] = \{ successEffectId: 28, hitEffectId: \[0, 28\], hitEffectOnce: true \};/
		);
	});
});
