import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Expiatio (AB_EXPIATIO 2053): use packet (result set, known caster): 바실리카.wav.
// kRO 2025-07-16, spec: effect-port/arch-bishop-skills.md.

describe('Expiatio plays its sound on success', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.AB_EXPIATIO]).toEqual({ successEffectIdOnCaster: 'ef_ab_expiatio_sound' });
		expect(EffectTable.ef_ab_expiatio_sound).toEqual([{ wav: 'effect/\xb9\xd9\xbd\xc7\xb8\xae\xc4\xab', attachedEntity: true }]);
	});
});
