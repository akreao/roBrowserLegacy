import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Jack Frost (WL_JACKFROST 2204): cast aura 1449 + 1446; use packet: jack_frost.wav (and ten 801s, not ported);
// hit-map effect 51 with the first hit, no hit flash.
// kRO 2025-07-16, spec: effect-port/warlock-skills.md.

describe('Jack Frost cast circle, sound and cold hit as the official client plays them', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.WL_JACKFROST]).toEqual({ castAuraEffectId: 1449, beginCastEffectId: 1446, successEffectIdOnCaster: 'ef_jackfrost', firstHitEffectId: 51 });
		expect(EffectTable.ef_jackfrost[0]).toMatchObject({ wav: 'jack_frost' });
	});
});
