import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import SkillEffect from '../../src/DB/Skills/SkillEffect.js';
import SK from '../../src/DB/Skills/SkillConst.js';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Full Chemical Protection (CR_FULLPROTECTION, skill 479): the official client launches 300
// (EF_CHEMICALPROTECTION) and then 500 (EF_CHEMICALBODY) on the target only when the use packet has the
// result set. kRO 2025-07-16. Spec: effect-port/creator-skills.md.

const table = effectTableSource();

describe('Full Chemical Protection', () => {
	it('plays 300 then 500 on the target on success only', () => {
		expect(SkillEffect[SK.CR_FULLPROTECTION]).toEqual({ successEffectId: [300, 500] });
	});

	it('has rows for both effects', () => {
		expect(table).toMatch(/\n\t300: \[/);
		expect(table).toMatch(/\n\t500: \[/);
	});
});
