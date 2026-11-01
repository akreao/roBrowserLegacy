import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Marsh of Abyss (WL_MARSHOFABYSS 2205): use packet (result set): 729 and 466 EF_SPINEDBODY2 on the target
// (T_돌려차기.wav at tick 5, the target's body spins from tick 14).
// kRO 2025-07-16, spec: effect-port/warlock-skills.md.

describe('Marsh of Abyss on success only', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.WL_MARSHOFABYSS]).toEqual({ successEffectId: [729, 466] });
		expect(EffectTable[466]).toBeDefined();
	});
});
