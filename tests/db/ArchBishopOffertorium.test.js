import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Offertorium (AB_OFFERTORIUM 5011): use packet (result set, known caster): 1047 on the caster.
// kRO 2025-07-16, spec: effect-port/arch-bishop-skills.md.

describe('Offertorium plays its effect on the caster on success only', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.AB_OFFERTORIUM]).toEqual({ successEffectIdOnCaster: 1047 });
	});
});
