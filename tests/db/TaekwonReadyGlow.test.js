import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Taekwon stances (TK_READYSTORM 412, TK_READYDOWN 414, TK_READYTURN 416, TK_READYCOUNTER 418)
// and Tumbling (TK_DODGE 420): each time the use packet arrives the official client plays 449
// (EF_TAE_READY, a blue glow) on the caster with its ready pose. Tumbling also plays t_낙법 when it
// works. Spec: effect-port/taekwon-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');
const table = effectTableSource();

describe('Taekwon ready glow', () => {
	it('glows the caster for each stance and Tumbling', () => {
		for (const skill of ['TK_READYSTORM', 'TK_READYDOWN', 'TK_READYTURN', 'TK_READYCOUNTER', 'TK_DODGE']) {
			expect(skills).toContain(`SkillEffect[SK.${skill}].effectIdOnCaster = 449;`);
		}
	});

	it('plays the Tumbling sound when it works', () => {
		expect(skills).toContain("SkillEffect[SK.TK_DODGE].successEffectIdOnCaster = 'ef_tk_dodge';");
		expect(table).toMatch(/ef_tk_dodge: \[\s*\{\s*wav: 'effect\/t_\\xb3\\xab\\xb9\\xfd'/);
	});
});
