import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Heaven's Drive (WZ_HEAVENDRIVE, skill 91): the official client plays 142 at the cell from the
// ground packet. The server deals the damage from the skill's units, and for unit damage the
// client plays only the standard hit flash (0) on the target, once per hit.
// Spec: effect-port/wizard-audit.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe("Heaven's Drive effects", () => {
	it('plays 142 at the cell and the hit flash per hit', () => {
		expect(source).toMatch(/SkillEffect\[SK\.WZ_HEAVENDRIVE\] = \{ effectId: 142, hitEffectId: \[0\] \};/);
	});
});
