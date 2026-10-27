import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Counter Kick (TK_COUNTER, skill 419): as each damage packet arrives the official client plays
// 415 (EF_KICKEDBODY: two hit sounds, the target kicked up from tick 30) on the target, and
// the hit flash 0 on every hit. The Royal Guard counter slash art is not Counter Kick's.
// Spec: effect-port/taekwon-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');
const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');

describe('Counter Kick effects', () => {
	it('kicks the target up at packet arrival, with the hit flash on every hit', () => {
		expect(skills).toMatch(
			/SkillEffect\[SK\.TK_COUNTER\] = \{ damageEffectIdOnTarget: 415, hitEffectId: \[0\] \};/
		);
	});

	it('no longer plays the counter slash art', () => {
		expect(table).not.toMatch(/ef_tk_counter/);
		expect(skills).not.toMatch(/ef_tk_counter/);
	});
});
