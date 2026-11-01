import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Fear Breeze (RA_FEARBREEZE 2234): use packet (result set): 1549 (new_fearbreeze) on the caster.
// kRO 2025-07-16, spec: effect-port/ranger-skills.md.

describe('Fear Breeze on success only, with its /mineffect copy', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.RA_FEARBREEZE]).toEqual({ successEffectIdOnCaster: 1549 });
		expect(EffectTable[1549][0]).toMatchObject({ type: 'STR', file: 'new_fearbreeze/new_fearbreeze', min: 'mineffect/new_fearbreeze/new_fearbreeze', minTexturePath: 'mineffect/new_fearbreeze/' });
		expect(EffectTable.ef_ra_fearbreeze).toBeUndefined();
	});
});
