import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Sonic Wave (RK_SONICWAVE 2002): no use effect; when the damage arrives the official client plays
// 기공포.wav and launches 832 and 1678 (new_sonicwave, not ported) on the caster.
// kRO 2025-07-16, spec: effect-port/rune-knight-skills.md.

describe('Sonic Wave', () => {
	it('plays 832 (the sound) on the caster as the hit lands, nothing on use', () => {
		expect(SkillEffect[SK.RK_SONICWAVE]).toMatchObject({ hitEffectIdOnCaster: 832 });
		expect(EffectTable[832][0].wav).toBe('effect/\xb1\xe2\xb0\xf8\xc6\xf7');
	});
});
