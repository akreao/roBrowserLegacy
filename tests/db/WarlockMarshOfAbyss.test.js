import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Marsh of Abyss (WL_MARSHOFABYSS 2205): use packet (result set): 729 and 466 (not ported) on the target.
// kRO 2025-07-16, spec: effect-port/warlock-skills.md.

describe('Marsh of Abyss on success only', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.WL_MARSHOFABYSS]).toEqual({ successEffectId: 729 });
	});
});
