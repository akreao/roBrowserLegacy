import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Flying Kick (TK_JUMPKICK, skill 421): as each damage packet arrives the official client plays
// 457 (EF_JUMPKICK: the flying kick sound at tick 5) on the caster and 458 (EF_QUAKEBODY2: the
// target shakes) on the target, and the hit flash 0 on every hit.
// Spec: effect-port/taekwon-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');
const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');

describe('Flying Kick effects', () => {
	it('plays the kick on the caster and shakes the target at packet arrival, with the hit flash on every hit', () => {
		expect(skills).toMatch(
			/SkillEffect\[SK\.TK_JUMPKICK\] = \{ damageEffectIdOnCaster: 457, damageEffectIdOnTarget: 458, hitEffectId: \[0\] \};/
		);
	});

	it('plays the flying kick sound on tick 5', () => {
		const row = table.slice(table.indexOf('\t457: ['), table.indexOf('\t457: [') + 300);
		expect(row).toMatch(/delayWav: 83/);
	});
});
