import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Clearance (AB_CLEARANCE 2052): cast aura 1560 (EF_BeginSpell.wav, two ring_white.tga rings) and 1559 for the cast time;
// use packet (result set): 1557 + 1558 on the target, 1557 with 샤프슈팅.wav and 흡기.wav.
// kRO 2025-07-16, spec: effect-port/arch-bishop-skills.md.

describe('Clearance plays the official cast rings and the new effect on success', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.AB_CLEARANCE]).toEqual({ castAuraEffectId: 1560, beginCastEffectId: 1559, successEffectId: [1557, 1558] });
		expect(EffectTable[1560][0]).toMatchObject({ type: 'FUNC', attachedEntity: true, wav: 'effect/ef_beginspell' });
		expect(EffectTable[1559][0]).toMatchObject({ file: 'new_clearence/new_clearence_cast/new_clearence_cast', castLoop: true });
		expect(EffectTable[1557].map(r => r.wav)).toEqual(['effect/\xbb\xfe\xc7\xc1\xbd\xb4\xc6\xc3', 'effect/\xc8\xed\xb1\xe2']);
		expect(EffectTable[1558][0]).toMatchObject({ file: 'new_clearence/new_clearence_bottom/new_clearence_bottom', renderBeforeEntities: true });
	});
});
