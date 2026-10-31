import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Stone Hard Skin (RK_STONEHARDSKIN 2015) and Fighting Spirit (RK_FIGHTINGSPIRIT 2018): use packet
// (result set): 756 and 441 on the caster; cast aura 12.
// kRO 2025-07-16, spec: effect-port/rune-knight-skills.md.

describe('Stone Hard Skin and Fighting Spirit', () => {
	it('plays 756 and the blue flash on the caster on success', () => {
		for (const sk of [SK.RK_STONEHARDSKIN, SK.RK_FIGHTINGSPIRIT]) {
			expect(SkillEffect[sk]).toMatchObject({ successEffectIdOnCaster: [756, 'ef_rk_bluecasting'], castAuraEffectId: 12 });
		}
	});
});
