import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Duple Light (AB_DUPLELIGHT 2054): use packet (result set): AB_duplelight.wav; 833 on the target unless it has one.
// kRO 2025-07-16, spec: effect-port/arch-bishop-skills.md.

describe('Duple Light plays its sound on success only', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.AB_DUPLELIGHT]).toEqual({ successEffectId: 'ef_duplelight' });
		expect(EffectTable.ef_duplelight[0]).toMatchObject({ wav: 'effect/ab_duplelight' });
	});
});
