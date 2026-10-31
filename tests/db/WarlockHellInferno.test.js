import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Hell Inferno (WL_HELLINFERNO 2212): no cast aura, 1552 on the caster while casting; damage arrival: 1550 + 1551
// on the target (and four sub flames around it, not ported).
// kRO 2025-07-16, spec: effect-port/warlock-skills.md.

describe('Hell Inferno cast floor and flames as the official client plays them', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.WL_HELLINFERNO]).toEqual({ hideCastAura: true, beginCastEffectId: 1552, arrivalEffectIdOnTarget: [1550, 1551], groundEffectId: 728 });
		expect(EffectTable[1552][0]).toMatchObject({ file: 'new_hellinferno/new_hellinferno_cast_bottom/new_hellinferno_cast_bottom', castLoop: true });
		expect(EffectTable[1550][0].file).toBe('new_hellinferno/new_hellinferno/new_hellinferno');
	});
});
