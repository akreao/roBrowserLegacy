import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Summoner (Doram) skills: what the official client plays for each. Spec: effect-port/summoner-skills.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

function row(skill) {
	const match = source.match(new RegExp(`SkillEffect\\[SK\\.${skill}\\] = (\\{[^\\n]*\\});`));
	return match && match[1];
}

describe('Summoner skill effects', () => {
	it('Scratch plays once, on use success only', () => {
		expect(row('SU_SCRATCH')).toBe("{ successEffectId: 'ef_su_scratch' }");
	});
	it("Picky Peck plays once, on use success only", () => {
		expect(row('SU_PICKYPECK')).toBe("{ successEffectId: 'ef_su_pickypeck' }");
	});
});
