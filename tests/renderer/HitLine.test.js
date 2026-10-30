import { describe, expect, it, vi } from 'vitest';
import {
	HITLINE,
	planHitLines,
	sweptTicks,
	headAngle,
	trailAngles,
	lineAlpha,
	arcPoint,
	coreColor
} from 'Renderer/Effects/HitLineSim.js';
import { segmentVertices } from 'Renderer/Effects/HitLine.js';
import { hitLine4Effect } from 'DB/Effects/HitLineEffect.js';
import EffectTable from 'DB/Effects/EffectTable.js';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';

// EF_HITLINE4 (429), kRO 2025-07-16: 0xbf0000 with mode 3 makes primitive 100 (update 0xb46b50 case 100,
// draw 0xb73800) on ticks 6-9, four lines each.

vi.mock('Core/Client.js', () => ({
	default: {
		loadFile(path, onload, onerror) {
			onerror();
		}
	}
}));

const fixed = v => () => v;

describe('Kick hit lines (429)', () => {
	it('is played on the target by Prominence Kick and Estun', () => {
		expect(EffectTable[429]).toBe(hitLine4Effect);
		expect(SkillEffect[SK.SJ_PROMINENCEKICK].damageEffectIdOnTarget).toContain(429);
		expect(SkillEffect[SK.SL_STUN].damageEffectIdOnTarget).toBe(429);
	});

	it('makes 16 lines on ticks 6 to 9 with the client numbers', () => {
		const low = planHitLines(fixed(0));
		expect(low).toHaveLength(16);
		expect(low.map(l => l.spawn)).toEqual([6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9]);
		expect(low[0]).toEqual({ spawn: 6, wait: 0, alpha: 125, heading: 0, radius: 6, stretch: 0.8 });
		const high = planHitLines(fixed(0.999))[0];
		expect(high).toMatchObject({ wait: 30, alpha: 245, heading: 359, radius: 11 });
		expect(high.stretch).toBeCloseTo(1.4);
	});

	it('waits, then turns its head 6 degrees a tick to 180', () => {
		const line = { spawn: 6, wait: 3 };
		expect(sweptTicks(line, 5)).toBe(0);
		expect(sweptTicks(line, 8)).toBe(0);
		expect(sweptTicks(line, 9)).toBe(1);
		expect(sweptTicks(line, 6 + HITLINE.primLife)).toBe(0);
		expect(headAngle(1)).toBe(6);
		expect(headAngle(40)).toBe(180);
		expect(trailAngles(3)).toEqual([18, 18, 12, 6, 0]);
		expect(trailAngles(40)).toEqual([180, 180, 180, 180, 180]);
	});

	it('fades by 5 a tick after sweeping 35 ticks', () => {
		const line = { alpha: 200 };
		expect(lineAlpha(line, 0)).toBe(0);
		expect(lineAlpha(line, 35)).toBe(200);
		expect(lineAlpha(line, 36)).toBe(195);
		expect(lineAlpha(line, 100)).toBe(0);
	});

	it('sweeps a half arc out along its heading', () => {
		const line = { heading: 90, radius: 10, stretch: 1 };
		expect(arcPoint(line, 0)).toEqual([0, -0, 0]);
		const mid = arcPoint(line, 90);
		expect(mid[0]).toBeCloseTo(0);
		expect(mid[1]).toBeCloseTo(-10);
		expect(mid[2]).toBeCloseTo(10);
		const end = arcPoint(line, 180);
		expect(end[1]).toBeCloseTo(0);
		expect(end[2]).toBeCloseTo(20);
	});

	it('greys its segments from 105 by 30', () => {
		expect([0, 1, 2, 3].map(i => coreColor(i)[0])).toEqual([105, 135, 165, 195]);
	});

	it('builds a triangular tube 5 units up', () => {
		const v = segmentVertices([0, 0, 0], [0, 0, 5], 90, 0.05);
		expect(v).toHaveLength(HITLINE.sides * 4 * 5);
		// first vertex: start, side 0 (across the line, level), 5 units up (client y down, in cells)
		expect(v[1]).toBeCloseTo(-1);
		expect(v[0]).toBeCloseTo(-0.01);
		// the end ring sits at the end point
		expect(v[12]).toBeCloseTo(1);
	});

	it('adds one renderer that runs out', async () => {
		const added = [];
		const owner = { position: [3, 4, 0] };
		hitLine4Effect[0].func.call({ add: e => added.push(e) }, { Inst: { startTick: 0 }, Init: { ownerEntity: owner } });
		expect(added).toHaveLength(1);
		expect(hitLine4Effect[0].duration).toBeGreaterThan(200 * (1000 / 60));
		const line = added[0];
		line.init({});
		expect(line.ready).toBe(true);
		line.render({}, 1000);
		expect(line.needCleanUp).toBeFalsy();
		line.render({}, 300 * (1000 / 60));
		expect(line.needCleanUp).toBe(true);
	});
});
