import { describe, expect, it, vi } from 'vitest';

vi.mock('Renderer/EntityManager.js', () => ({ default: { get: () => null } }));

import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';
import { SCHEDULES } from 'Renderer/Effects/CasterMarks.js';
import { clientHeading, hundredSpearAction } from 'DB/Effects/HundredSpearEffect.js';

// Hundred Spear (RK_HUNDREDSPEAR, kRO 2025-07-16): 723 and 835 on the caster as the damage arrives.
// Spec: effect-port/hundred-spear.md.

describe('Hundred Spear', () => {
	it('plays 723 and 835 on the caster as the damage arrives', () => {
		expect(SkillEffect[SK.RK_HUNDREDSPEAR]).toMatchObject({ arrivalEffectIdOnCaster: [723, 835], castAuraEffectId: 12 });
		expect(EffectTable[723][0].wav).toBe('hundred');
	});

	it('measures the heading in whole degrees, as the client', () => {
		expect(clientHeading(1, 0)).toBe(0);
		expect(clientHeading(0, 1)).toBe(90);
		expect(clientHeading(-1, 0)).toBe(180);
		expect(clientHeading(0, -1)).toBe(270);
		expect(clientHeading(1, 1)).toBe(45);
	});

	it('turns the sprite by the direction from the target to the caster plus the camera', () => {
		// caster east of the target: heading 0 -> action 2
		expect(hundredSpearAction([5, 0, 0], [0, 0, 0], 0)).toBe(2);
		// caster north: 90 -> 1; west: 180 -> 0; south: 270 -> 3
		expect(hundredSpearAction([0, 5, 0], [0, 0, 0], 0)).toBe(1);
		expect(hundredSpearAction([-5, 0, 0], [0, 0, 0], 0)).toBe(0);
		expect(hundredSpearAction([0, -5, 0], [0, 0, 0], 0)).toBe(3);
		// the camera's turn adds
		expect(hundredSpearAction([5, 0, 0], [0, 0, 0], 100)).toBe(1);
	});

	it('draws the sprite at the target, not following anyone', () => {
		const spammed = [];
		EffectTable[723][1].func.call(
			{ spamEffect: p => spammed.push(p) },
			{
				Init: { ownerEntity: { position: [5, 0, 0] }, otherEntity: { position: [0, 0, 1] } },
				Inst: { startTick: 10 }
			}
		);
		expect(spammed).toHaveLength(1);
		expect(spammed[0].effect).toMatchObject({ type: 'SPR', file: '\xc7\xe5\xb5\xe5\xb7\xb9\xb5\xe5\xbd\xba\xc7\xc7\xbe\xee' });
		expect(spammed[0].Init.position).toEqual([0, 0, 1]);
		expect(spammed[0].Init.ownerEntity).toBeNull();
	});

	it('gives the caster a pale yellow glow from tick 20 to 100', () => {
		expect(SCHEDULES[835](19)).toEqual({ add: false, glow: false, split: false, color: null });
		expect(SCHEDULES[835](20)).toEqual({ add: false, glow: true, split: false, color: [255, 255, 150] });
		expect(SCHEDULES[835](100).glow).toBe(true);
		expect(SCHEDULES[835](101).glow).toBe(false);
	});
});
