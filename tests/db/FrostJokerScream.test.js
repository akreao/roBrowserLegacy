import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Frost Joker (BA_FROSTJOKE 318) and Scream (DC_SCREAM 326): the official client says the
// joke or scream line (effects 295 / 296, only for the local player) from the use packet,
// when the use succeeds, not when the cast starts.
// Spec: effect-port/bard-dancer-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Frost Joker and Scream lines', () => {
	it('says the joke on a successful Frost Joker', () => {
		expect(skills).toMatch(/SkillEffect\[SK\.BA_FROSTJOKE\] = \{ successEffectId: 295 \};/);
	});

	it('says the scream on a successful Scream', () => {
		expect(skills).toMatch(/SkillEffect\[SK\.DC_SCREAM\] = \{ successEffectId: 296 \};/);
	});
});
