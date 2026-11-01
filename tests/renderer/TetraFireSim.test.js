import { describe, it, expect, vi } from 'vitest';

vi.mock('Renderer/EntityManager.js', () => ({ default: { get: () => null } }));

import EffectTable from 'DB/Effects/EffectTable.js';
import { tetraFireLook, pillarEffect, PILLAR_TEXTURES } from 'DB/Effects/TetraFireEffect.js';
import { pillarState, pillarAt, planLines, lineState, lineAt } from 'Renderer/Effects/TetraFireSim.js';

// 804 EF_TETRA (kRO 2025-07-16, case 0xbbb218): prim 140 pillar (0xc08f50, update 0xb81890, draw 0xb6e7e0) on ticks 0 / 25 /
// 50 / 75 and 7 x 4 prim 137 red lines (0xc0d0d0, update 0xb824f0, draw 0xb8c3e0). Spec: effect-port/warlock-skills.md.
describe('Tetra Vortex Fire pillar and red lines (804)', () => {
	it('plays tv-1 to tv-8, a picture every 3 ticks, then fades 15 every 3 ticks from 200', () => {
		expect([0, 2, 3, 21].map(n => pillarState(n).picture)).toEqual([0, 0, 1, 7]);
		expect(pillarState(23).alpha).toBe(200);
		expect(pillarState(24)).toEqual({ picture: 7, alpha: 185 });
		expect(pillarState(60).alpha).toBe(5);
		expect(pillarState(63)).toBeNull();
	});

	it('stands 30 units wide and 52 tall, its middle 35 units up', () => {
		const p = pillarAt(0);
		expect(p.width).toBe(210);
		expect(p.height).toBeCloseTo(30 * Math.sqrt(3) * 7);
		expect(p.z).toBe(7);
	});

	it('scatters 28 lines within 40 units, each starting at age 0-99', () => {
		const low = planLines(() => 0);
		expect(low).toHaveLength(28);
		expect(low[0]).toMatchObject({ start: 0, x: 0, z: 0, radius: 0.15 });
		const high = planLines(() => 0.999)[0];
		expect(high.start).toBe(99);
		expect(Math.hypot(high.x, high.z)).toBeCloseTo(40);
		expect(high.radius).toBeCloseTo(0.3);
	});

	it('raises a line from age 100 to 120 units at 115, holds, then shrinks and fades from 125', () => {
		expect(lineState(99)).toBeNull();
		expect(lineState(100)).toBeNull();
		expect(lineState(105).height).toBeCloseTo(60);
		expect(lineState(115)).toEqual({ height: 120, alpha: 150 });
		expect(lineState(124)).toEqual({ height: 120, alpha: 150 });
		expect(lineState(125)).toEqual({ height: 115, alpha: 135 });
		expect(lineState(134)).toBeNull();
		expect(lineAt({ start: 98, x: 5, z: 0, radius: 0.2 }, 16).height).toBeCloseTo(120 * 7);
	});

	it('is part of 804, drawn over the target', () => {
		expect(EffectTable[804]).toContain(tetraFireLook);
		expect(pillarEffect()).toMatchObject({ fileList: PILLAR_TEXTURES, blendMode: 2 });
		const spammed = [];
		tetraFireLook.func.call(
			{ spamEffect: p => spammed.push(p) },
			{ Init: { otherEntity: { position: [10, 20, 0] } }, Inst: { startTick: 0 } }
		);
		expect(spammed).toHaveLength(32);
		expect(spammed[0].Init.position).toEqual([10, 20, 0]);
		expect(spammed[3].Inst.startTick).toBeCloseTo(75 * (1000 / 60));
	});
});
