import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Cloaking (AS_CLOAKING, skill 135): the official client plays nothing when it is used (no case in
// ZC_USE_SKILL, no skilleffectinfo entry) and nothing when the cloak option bit turns on or off.
// Effect 120 (EF_CLOAKING, assasin_cloaking.wav) has no launch site. Spec: effect-port/assassin-skills.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Cloaking effects', () => {
	it('plays nothing on use', () => {
		expect(source).toMatch(/SkillEffect\[SK\.AS_CLOAKING\] = \{\};/);
	});
});
