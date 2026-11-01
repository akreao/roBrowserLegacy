import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Silentium (AB_SILENTIUM 2057): use packet (result set): 87 (Lex Divina) on the target.
// kRO 2025-07-16, spec: effect-port/arch-bishop-skills.md.

describe('Silentium plays Lex Divina on each target', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.AB_SILENTIUM]).toEqual({ successEffectId: 87 });
	});
});
