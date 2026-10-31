import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Enchant Blade (RK_ENCHANTBLADE 2001): when the use packet has the result set, the official client launches
// 756 and plays 닌자_던지기.wav on the caster. Nothing from other packets.
// kRO 2025-07-16, spec: effect-port/rune-knight-skills.md.

describe('Enchant Blade', () => {
	it('plays 756 and its sound on the caster on success', () => {
		expect(SkillEffect[SK.RK_ENCHANTBLADE]).toMatchObject({ successEffectIdOnCaster: [756, 'ef_rk_ninja_throw_sound'] });
		expect(EffectTable.ef_rk_ninja_throw_sound).toEqual([{ wav: 'effect/\xb4\xd1\xc0\xda_\xb4\xf8\xc1\xf6\xb1\xe2', attachedEntity: true }]);
	});
});
