import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Esha (SP_SHA, skill 2603): when the use packet has the result set, the official client's skilleffectinfo
// row launches 547 (EF_STIN, Estin's caster effect) on the caster, told the target's position. No hit flash.
// kRO 2025-07-16. Spec: effect-port/star-emperor-soul-reaper-skills.md.

describe('Esha', () => {
	it('plays 547 on the caster on success', () => {
		expect(SkillEffect[SK.SP_SHA]).toMatchObject({ successEffectIdOnCaster: 547 });
		expect(EffectTable[547]).toBeDefined();
	});
});
