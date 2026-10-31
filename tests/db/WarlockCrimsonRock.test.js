import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Crimson Rock (WL_CRIMSONROCK 2211): damage arrival: crimson_r.wav, 1274 + 1275 on the target.
// kRO 2025-07-16, spec: effect-port/warlock-skills.md.

describe('Crimson Rock explosion when the damage arrives', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.WL_CRIMSONROCK]).toEqual({ arrivalEffectIdOnTarget: ['ef_wl_crimsonrock_sound', 1274, 1275] });
		expect(EffectTable[1274][0].file).toBe('new_crimsonrock/new_crimsonrock/new_crimsonrock');
		expect(EffectTable.ef_wl_crimsonrock_sound).toEqual([{ wav: 'crimson_r', attachedEntity: true }]);
	});
});
