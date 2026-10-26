import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Elemental Change (SA_ELEMENTWATER / GROUND / FIRE / WIND): the official client's use-packet
// handler shares the endows' cases, so the target shows endow 255-258 only when the packet's
// result is set. Spec: effect-port/sage-skills.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

const rows = { SA_ELEMENTFIRE: 255, SA_ELEMENTWATER: 256, SA_ELEMENTWIND: 257, SA_ELEMENTGROUND: 258 };

describe('Elemental Change effects', () => {
	for (const [skill, effectId] of Object.entries(rows)) {
		it(`${skill} plays ${effectId} on the target only on success`, () => {
			expect(source).toMatch(new RegExp(`SkillEffect\\[SK\\.${skill}\\] = \\{ successEffectId: ${effectId} \\};`));
		});
	}
});
