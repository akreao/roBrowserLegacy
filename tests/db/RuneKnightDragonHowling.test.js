import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Dragon Howling (RK_DRAGONHOWLING 2009): use packet (result set): screen quake, 731 and dragon_h.wav on the caster.
// kRO 2025-07-16, spec: effect-port/rune-knight-skills.md.

describe('Dragon Howling', () => {
	it('plays the official use effects on success', () => {
		expect(SkillEffect[SK.RK_DRAGONHOWLING]).toMatchObject({ successEffectIdOnCaster: [731, 'quake'] });
		expect(EffectTable[731][0]).toMatchObject({ type: 'STR', file: 'dragon_h', wav: 'dragon_h' });
	});
});
