import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Bomb (AM_DEMONSTRATION, skill 229): the official client plays nothing from the ground packet (229 is
// outside its switch); the skill unit 0xb1 holds 302 (EF_DEMONSTRATION) while it stands; each hit that
// lands plays the hit flash (0). kRO 2025-07-16. Spec: effect-port/alchemist-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');
const units = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillUnit.js'), 'utf8');

describe('Bomb', () => {
	it('flashes every hit and plays nothing from the ground packet', () => {
		expect(skills).toMatch(/SkillEffect\[SK\.AM_DEMONSTRATION\] = \{ hitEffectId: 0 \};/);
	});

	it('shows 302 for the skill unit', () => {
		expect(units).toMatch(/SkillUnit\[SU\.UNT_DEMONSTRATION\] = EC\.EF_DEMONSTRATION;/);
	});
});
