import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Refresh (RK_REFRESH 2013): use packet (result set): 538 (EF_GREENBODY) and _heal_effect.wav on the caster; cast aura 58.
// kRO 2025-07-16, spec: effect-port/rune-knight-skills.md.

describe('Refresh', () => {
	it('plays the official use effects on success', () => {
		expect(SkillEffect[SK.RK_REFRESH]).toMatchObject({ successEffectIdOnCaster: [538, 'ef_rk_refresh_sound'], castAuraEffectId: 58 });
		expect(EffectTable.ef_rk_refresh_sound).toEqual([{ wav: '_heal_effect', attachedEntity: true }]);
	});
});
