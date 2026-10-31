import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Frost Misty (WL_FROSTMISTY 2203): ZC_NOTIFY_GROUNDSKILL launches 726 at the cell; hit-map effect 51 with the first hit.
// kRO 2025-07-16, spec: effect-port/warlock-skills.md.

describe('Frost Misty at the cell from the ground packet, cold hit with the first hit', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.WL_FROSTMISTY]).toEqual({ groundEffectIdByLevel: [726], firstHitEffectId: 51 });
		expect(EffectTable[726]).toBeDefined();
	});
});
