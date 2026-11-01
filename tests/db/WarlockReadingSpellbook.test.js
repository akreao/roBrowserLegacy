import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Reading Spellbook (WL_READING_SB 2231, WL_READING_SB_READING 5078): cast aura 58.
// kRO 2025-07-16, spec: effect-port/warlock-skills.md.

describe('Reading Spellbook white cast aura', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.WL_READING_SB]).toEqual({ castAuraEffectId: 58 });
		expect(SkillEffect[SK.WL_READING_SB_READING]).toEqual({ castAuraEffectId: 58 });
	});
});
