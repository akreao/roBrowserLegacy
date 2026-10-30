import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Book of Dimension (SJ_BOOKOFDIMENSION, skill 2586): when the use packet has the result set, the official
// client's skilleffectinfo row plays so_elemental_shield.wav and launches 1231 (CSpriteEffect,
// 이팩트\book_of_dimension\book_of_dimension.spr at 4 ticks a frame) on the caster. kRO 2025-07-16.
// Spec: effect-port/star-emperor-soul-reaper-skills.md.

describe('Book of Dimension', () => {
	it('plays the book sprite and its sound on the caster on success', () => {
		expect(SkillEffect[SK.SJ_BOOKOFDIMENSION]).toEqual({ successEffectIdOnCaster: 'ef_sj_bookofdimension' });
		expect(EffectTable.ef_sj_bookofdimension).toEqual([
			{
				type: 'SPR',
				file: 'book_of_dimension/book_of_dimension',
				delayFrame: 67,
				stackable: true,
				wav: 'effect/so_elemental_shield',
				attachedEntity: true
			}
		]);
	});
});
