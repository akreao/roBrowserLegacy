import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Taekwon Mission (TK_MISSION, skill 493): when the skill works the official client plays
// t_피링. Spec: effect-port/taekwon-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');
const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');

describe('Taekwon Mission sound', () => {
	it('plays t_피링 on the caster when the skill works', () => {
		expect(skills).toMatch(/SkillEffect\[SK\.TK_MISSION\] = \{ successEffectIdOnCaster: 'ef_tk_mission' \};/);
		expect(table).toMatch(/ef_tk_mission: \[\s*\{\s*wav: 'effect\/t_\\xc7\\xc7\\xb8\\xb5'/);
	});
});
