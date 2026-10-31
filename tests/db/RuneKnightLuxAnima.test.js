import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Lux Anima (RK_LUXANIMA 5005): use packet (result set): 1044 on the caster.
// kRO 2025-07-16, spec: effect-port/rune-knight-skills.md.

describe('Lux Anima', () => {
	it('plays the official use effects on success', () => {
		expect(SkillEffect[SK.RK_LUXANIMA]).toMatchObject({ successEffectIdOnCaster: 1044 });
	});
});
