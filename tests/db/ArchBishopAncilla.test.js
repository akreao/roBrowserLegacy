import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Ancilla (AB_ANCILLA 2039): cast aura 441; use packet (result set): AB_ancilla.wav and 441 on the target.
// kRO 2025-07-16, spec: effect-port/arch-bishop-skills.md.

describe('Ancilla plays its blue aura and sound on success only', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.AB_ANCILLA]).toEqual({ castAuraEffectId: 441, successEffectId: 'ef_ancilla' });
		const [sound, aura] = EffectTable.ef_ancilla;
		expect(sound).toEqual({ wav: 'effect/ab_ancilla', attachedEntity: true });
		expect(aura).toMatchObject({ type: 'CYLINDER', textureName: 'ring_blue', duration: 1000 });
		expect(aura).toMatchObject(Object.fromEntries(Object.entries(EffectTable[441][0]).filter(([k]) => k !== 'wav')));
	});
});
