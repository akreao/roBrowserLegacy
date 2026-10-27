import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Back Stab (RG_BACKSTAP, skill 212): the official client plays 275 (EF_BACKSTAP) on the caster as
// each damage packet arrives, its sound on tick 20, and the standard hit flash (0) once per packet
// on the target. Spec: effect-port/rogue-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');
const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');

describe('Back Stab effects', () => {
	it('plays 275 on the caster per packet and the hit flash once per packet', () => {
		expect(skills).toContain(
			'SkillEffect[SK.RG_BACKSTAP] = { damageEffectIdOnCaster: 275, hitEffectId: [0], hitEffectOnce: true };'
		);
	});

	it('plays the Back Stab sound on tick 20', () => {
		expect(table).toMatch(/\t275: \[\s*\{[^}]*wav: 'effect\/rog_back stap',\s*delayWav: 333,/);
	});
});
