import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// 16th Night (KO_IZAYOI, skill 3022): when the use packet has the result set, the official client's
// skilleffectinfo row plays ab_renovatio.wav and launches 999 (ez_cure.str) on the caster. Nothing at
// damage arrival (rAthena also sends a no-damage damage packet). kRO 2025-07-16.
// Spec: effect-port/kagerou-oboro-skills.md.

describe('16th Night', () => {
	it('plays ez_cure.str and its sound on the caster on success only', () => {
		expect(SkillEffect[SK.KO_IZAYOI]).toEqual({ successEffectIdOnCaster: 'ef_ko_izayoi' });
		expect(EffectTable.ef_ko_izayoi).toEqual([
			{ type: 'STR', file: 'ez_cure', texturePath: '', wav: 'effect/ab_renovatio', attachedEntity: true }
		]);
	});
});
