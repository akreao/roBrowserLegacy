import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Summon Fire Ball / Lightning Ball / Water Ball / Stone (WL_SUMMONFB 2222 ... WL_SUMMONSTONE 2229): cast aura 1260
// (tetra_cast.str) with EF_BeginSpell.wav; the use packet plays nothing.
// kRO 2025-07-16, spec: effect-port/warlock-skills.md.

describe('element sphere summons use the official cast aura', () => {
	it('matches the official client', () => {
		for (const sk of [SK.WL_SUMMONFB, SK.WL_SUMMONBL, SK.WL_SUMMONWB, SK.WL_SUMMONSTONE]) {
			expect(SkillEffect[sk]).toEqual({ hideCastAura: true, beginCastEffectId: [1260, 'ef_wl_summon_cast_sound'] });
		}
		expect(EffectTable[1260][0]).toMatchObject({ file: 'tetravortex/tetra_cast/tetra_cast', castLoop: true });
		expect(EffectTable.ef_wl_summon_cast_sound).toEqual([{ wav: 'effect/ef_beginspell', attachedEntity: true }]);
	});
});
