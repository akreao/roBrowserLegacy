import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Drain Life (WL_DRAINLIFE 2210): hit-map effect 216 with the first hit of each damage packet, no hit flash.
// kRO 2025-07-16, spec: effect-port/warlock-skills.md.

describe('Drain Life blood drain with the first hit', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.WL_DRAINLIFE]).toEqual({ hitEffectIdOnCaster: 216, hitEffectOnce: true });
		expect(EffectTable[216]).toBeDefined();
	});
});
