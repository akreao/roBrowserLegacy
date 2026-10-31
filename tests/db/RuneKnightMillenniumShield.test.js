import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Millennium Shield (RK_MILLENNIUMSHIELD 2011): use packet (result set): 441, 749 and ef_soulstrike.wav on the caster.
// kRO 2025-07-16, spec: effect-port/rune-knight-skills.md.

describe('Millennium Shield', () => {
	it('plays the official use effects on success', () => {
		expect(SkillEffect[SK.RK_MILLENNIUMSHIELD]).toMatchObject({ successEffectIdOnCaster: ['ef_rk_bluecasting', 749, 'ef_rk_millenniumshield_sound'] });
		expect(EffectTable.ef_rk_millenniumshield_sound).toEqual([{ wav: 'effect/ef_soulstrike', attachedEntity: true }]);
	});
});
