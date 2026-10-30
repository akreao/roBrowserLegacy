import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import SkillEffect from '../../src/DB/Skills/SkillEffect.js';
import SK from '../../src/DB/Skills/SkillConst.js';

// Rich's Coin (RL_RICHS_COIN, skill 2552): the official client launches 1134 (RL_richs_coin_A\reachs.str)
// on the caster when the use packet has the result set (its skilleffectinfo row). kRO 2025-07-16.
// Spec: effect-port/rebellion-skills.md.

const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');

describe("Rich's Coin", () => {
	it('plays 1134 on the caster on success only', () => {
		expect(SkillEffect[SK.RL_RICHS_COIN]).toEqual({ successEffectIdOnCaster: 1134 });
	});

	it('has a row for 1134 with the client file', () => {
		expect(table).toMatch(/\n\t1134: \[\r?\n\t\t\{\r?\n\t\t\t\/\/EF_RICHS_COIN_A\r?\n\t\t\ttype: 'STR',\r?\n\t\t\tfile: 'rl_richs_coin_a\/reachs'/);
	});
});
