import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';
import { hellInfernoSubOffsets } from 'DB/Effects/HellInfernoEffect.js';

// Hell Inferno (WL_HELLINFERNO 2212): no cast aura, 1552 on the caster while casting; damage arrival: 1550 + 1551
// on the target and four side flames 15 units from it on the diagonals (1553 + 1554).
// kRO 2025-07-16, spec: effect-port/warlock-skills.md.

describe('Hell Inferno cast floor and flames as the official client plays them', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.WL_HELLINFERNO]).toEqual({ hideCastAura: true, beginCastEffectId: 1552, arrivalEffectIdOnTarget: [1550, 1551, 'ef_wl_hellinferno_sub'], groundEffectId: 728 });
		expect(EffectTable[1552][0]).toMatchObject({ file: 'new_hellinferno/new_hellinferno_cast_bottom/new_hellinferno_cast_bottom', castLoop: true });
		expect(EffectTable[1550][0].file).toBe('new_hellinferno/new_hellinferno/new_hellinferno');
	});

	it('puts 1553 + 1554 at the four diagonals 15 units (3 cells) from the target', () => {
		const offsets = hellInfernoSubOffsets();
		expect(offsets).toHaveLength(4);
		for (const [dx, dy] of offsets) {
			expect(Math.hypot(dx, dy)).toBeCloseTo(3);
			expect(Math.abs(dx)).toBeCloseTo(Math.abs(dy));
		}
		const spammed = [];
		EffectTable.ef_wl_hellinferno_sub[0].func.call(
			{ spam: p => spammed.push(p) },
			{ Inst: { position: [10, 20, 0], startTick: 5 }, Init: {} }
		);
		expect(spammed.map(p => p.effectId)).toEqual([1553, 1554, 1553, 1554, 1553, 1554, 1553, 1554]);
		expect(spammed[0].position[0]).toBeCloseTo(10 + offsets[0][0]);
		expect(spammed.every(p => p.startTick === 5 && p.ownerAID === undefined)).toBe(true);
		expect(EffectTable[1553][0]).toMatchObject({ file: 'new_hellinferno/new_hellinferno_sub/new_hellinferno_sub', attachedEntity: false });
		expect(EffectTable[1554][0]).toMatchObject({ renderBeforeEntities: true, attachedEntity: false });
	});
});
