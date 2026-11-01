import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Oratio (AB_ORATIO 2046): use packet (result set): 725 on the caster: Detect's burst helper, variant 2
// (priest_benedictio.wav, the same fashasha.tga square and timing as Detect 119, no tint).
// kRO 2025-07-16, spec: effect-port/arch-bishop-skills.md.

describe('Oratio plays its burst and sound on the caster on success', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.AB_ORATIO]).toEqual({ successEffectIdOnCaster: 725 });
		const { wav, ...look } = EffectTable[725][0];
		expect(wav).toBe('effect/priest_benedictio');
		expect(look).toEqual(Object.fromEntries(Object.entries(EffectTable[119][0]).filter(([k]) => k !== 'wav')));
	});
});
