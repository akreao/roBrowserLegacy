import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Chemical Protection (AM_CP_WEAPON / SHIELD / ARMOR / HELM, skills 234-237): the official client
// launches 300 (EF_CHEMICALPROTECTION) on the target only when the use packet has the result set.
// kRO 2025-07-16. Spec: effect-port/alchemist-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Chemical Protection', () => {
	it.each(['AM_CP_WEAPON', 'AM_CP_SHIELD', 'AM_CP_ARMOR', 'AM_CP_HELM'])('%s plays 300 on success only', id => {
		expect(skills).toMatch(new RegExp(`SkillEffect\\[SK\\.${id}\\] = \\{ successEffectId: 300 \\};`));
	});
});
