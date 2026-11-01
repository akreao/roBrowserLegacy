import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Unlimit (RA_UNLIMIT 5002): on success CSkillAction_RA_UNLIMIT launches the EZ2 effects unlimit and unlimit_bottom
// on the caster (RANGER/UNLIMIT/..., PosY 12, effect/ra_unlimit.wav on the top one).
// kRO 2025-07-16, spec: effect-port/ranger-skills.md.

describe('Unlimit plays the official unlimit effect on success only', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.RA_UNLIMIT]).toEqual({ successEffectIdOnCaster: 'ef_ra_unlimit' });
		const [top, bottom] = EffectTable.ef_ra_unlimit;
		expect(top).toMatchObject({ type: 'STR', file: 'ranger/unlimit/unlimit/unlimit', min: 'ranger/unlimit/unlimit/min_unlimit', wav: 'effect/ra_unlimit', yOffset: 12 });
		expect(bottom).toMatchObject({ file: 'ranger/unlimit/unlimit_bottom/unlimit_bottom', min: 'ranger/unlimit/unlimit_bottom/min_unlimit_bottom', yOffset: 12, renderBeforeEntities: true });
		expect(bottom.wav).toBeUndefined();
	});
});
