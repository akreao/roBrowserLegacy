import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Poison React (AS_POISONREACT, skill 139): the official client plays 126 (PoisonReact_1st.str, no
// sound) on the target when the skill succeeds; its counter attack has no hit-map effect, only the
// hit flash 0 once per packet. 127 (EF_POISONREACT2) has no launch site. Spec: effect-port/assassin-skills.md.

const read = file => readFileSync(join(process.cwd(), file), 'utf8');
const skills = read('src/DB/Skills/SkillEffect.js');

function row(id) {
	const table = read('src/DB/Effects/EffectTable.js');
	const start = table.indexOf(`\n\t${id}: [`);
	const text = table.slice(table.indexOf('[', start), table.indexOf('\n\t],', start) + 3);
	return vm.runInNewContext(`(${text})`);
}

describe('Poison React effects', () => {
	it('plays 126 on success and the hit flash once per counter attack packet', () => {
		expect(skills).toMatch(
			/SkillEffect\[SK\.AS_POISONREACT\] = \{ successEffectId: 126, hitEffectId: 0, hitEffectOnce: true \};/
		);
	});

	it('draws 126 as the STR alone, without a sound', () => {
		const rows = row(126);
		expect(rows).toHaveLength(1);
		expect(rows[0].file).toBe('poisonreact_1st');
		expect(rows[0].wav).toBeUndefined();
	});
});
