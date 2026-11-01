import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';
import SkillUnit from 'DB/Skills/SkillUnit.js';
import SU from 'DB/Skills/SkillUnitConst.js';

// Epiclesis (AB_EPICLESIS 2044): no use or ground-packet effect; its unit (0xca) plays EZ2 1654 new_epiclesis_combine once
// (EF_GlassWall.wav on frame 30) and CRagEffect 1655 (rings, not ported).
// kRO 2025-07-16, spec: effect-port/arch-bishop-skills.md.

describe('Epiclesis shows the official tree once, from its skill unit', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.AB_EPICLESIS]).toEqual({});
		expect(SkillUnit[SU.UNT_EPICLESIS]).toEqual([1654, 1655]);
		expect(EffectTable[1654][0]).toMatchObject({ type: 'STR', file: 'new_epiclesis/new_epiclesis_combine/new_epiclesis_combine', min: 'mineffect/new_epiclesis/new_epiclesis_combine', minTexturePath: 'mineffect/new_epiclesis/', wav: 'effect/ef_glasswall', delayWav: 500, repeat: false });
	});
});
