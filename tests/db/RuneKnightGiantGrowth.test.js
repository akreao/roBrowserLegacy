import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Giant Growth (RK_GIANTGROWTH 2014): use packet (result set): 756 and 닌자_던지기.wav on the caster; cast aura 12.
// kRO 2025-07-16, spec: effect-port/rune-knight-skills.md.

describe('Giant Growth', () => {
	it('plays the official use effects on success', () => {
		expect(SkillEffect[SK.RK_GIANTGROWTH]).toMatchObject({ successEffectIdOnCaster: [756, 'ef_rk_ninja_throw_sound'], castAuraEffectId: 12 });
	});
});
