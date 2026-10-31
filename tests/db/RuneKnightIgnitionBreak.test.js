import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Ignition Break (RK_IGNITIONBREAK 2006): use packet (result set): wl_jackfrost.wav, 1624 new_ignitionbreak
// and 1625 new_ignitionbreak_bottom on the caster. Nothing from the damage packets.
// kRO 2025-07-16, spec: effect-port/rune-knight-skills.md.

describe('Ignition Break', () => {
	it('plays the two STRs and the sound on the caster on success', () => {
		expect(SkillEffect[SK.RK_IGNITIONBREAK]).toMatchObject({ successEffectIdOnCaster: 'ef_rk_ignitionbreak', castAuraEffectId: 12 });
		const [top, floor] = EffectTable.ef_rk_ignitionbreak;
		expect(top).toMatchObject({ type: 'STR', file: 'new_ignitionbreak/new_ignitionbreak/new_ignitionbreak', wav: 'effect/wl_jackfrost' });
		expect(floor).toMatchObject({ type: 'STR', file: 'new_ignitionbreak/new_ignitionbreak_bottom/new_ignitionbreak_bottom', renderBeforeEntities: true });
		expect(floor.wav).toBeUndefined();
	});
});
