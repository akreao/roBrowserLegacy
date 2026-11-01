import { describe, expect, it, vi } from 'vitest';
import {
	HITLINE,
	HITLINE_KINDS,
	hitLineLastTick,
	tableHeading,
	planHitLines,
	sweptTicks,
	headAngle,
	trailAngles,
	lineAlpha,
	arcPoint,
	coreColor
} from 'Renderer/Effects/HitLineSim.js';
import { segmentVertices } from 'Renderer/Effects/HitLine.js';
import { hitLine4Effect, hitLine5Effect, hitLine6Effect } from 'DB/Effects/HitLineEffect.js';
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

// EF_HITLINE5 (430, 0xbf0400) and EF_HITLINE6 (431, 0xbef9f0), both with mode 3: effect-port/hit-lines.md.
describe('Kick hit lines (430, 431)', () => {
	it('is played on the target by the Taekwon kicks and Esma', () => {
		expect(EffectTable[430]).toBe(hitLine5Effect);
		expect(EffectTable[431]).toBe(hitLine6Effect);
		expect(SkillEffect[SK.TK_TURNKICK].damageEffectIdOnTarget).toEqual([466, 429]);
		expect(SkillEffect[SK.TK_COUNTER].damageEffectIdOnTarget).toEqual([415, 430]);
		expect(SkillEffect[SK.TK_DOWNKICK].damageEffectIdOnTarget).toEqual([413, 431]);
		expect(SkillEffect[SK.SL_SMA].damageEffectIdOnTarget).toContain(431);
	});

	it('430 makes 12 lines on ticks 0 to 2, waiting 25 to 45 ticks, aimed from the caster', () => {
		const kind = HITLINE_KINDS[430];
		const low = planHitLines(fixed(0), kind, 90);
		expect(low).toHaveLength(12);
		expect(low.map(l => l.spawn)).toEqual([0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2]);
		expect(low[0]).toEqual({ spawn: 0, wait: 25, alpha: 125, heading: 30, radius: 6, stretch: 0.8 });
		const high = planHitLines(fixed(0.999), kind, 330)[0];
		expect(high).toMatchObject({ wait: 45, alpha: 245, heading: 30, radius: 12 });
		expect(kind.segments).toBe(3);
		expect(kind.core).toBe(0.06);
		expect(hitLineLastTick(kind)).toBe(202);
	});

	it('431 makes 20 lines on ticks 0 to 4, waiting 30 to 70 ticks', () => {
		const kind = HITLINE_KINDS[431];
		const low = planHitLines(fixed(0), kind);
		expect(low).toHaveLength(20);
		expect(low[19].spawn).toBe(4);
		expect(low[0]).toEqual({ spawn: 0, wait: 30, alpha: 125, heading: 0, radius: 6, stretch: 0.6 });
		const high = planHitLines(fixed(0.999), kind)[0];
		expect(high).toMatchObject({ wait: 70, radius: 11 });
		expect(high.stretch).toBeCloseTo(1.2);
		expect(kind.segments).toBe(4);
		expect(kind.core).toBe(0.07);
		expect(trailAngles(2, 3)).toEqual([12, 12, 6, 0]);
	});

	it('takes the heading with the client helper (whole degrees, 360 less below the axis)', () => {
		expect(tableHeading(1, 0)).toBe(0);
		expect(tableHeading(0, 1)).toBe(90);
		expect(tableHeading(-1, 0)).toBe(180);
		expect(tableHeading(0, -1)).toBe(270);
		expect(tableHeading(1, 1)).toBe(45);
	});

	it('aims 430 from the caster and runs out', () => {
		const added = [];
		const owner = { position: [3, 4, 0] };
		const caster = { position: [3, 0, 0] };
		hitLine5Effect[0].func.call(
			{ add: e => added.push(e) },
			{ Inst: { startTick: 0 }, Init: { ownerEntity: owner, otherEntity: caster } }
		);
		expect(added).toHaveLength(1);
		const lines = added[0];
		// the caster stands below the target: heading 90, so every line is 30 to 150
		for (const line of lines.lines) {
			expect(line.heading).toBeGreaterThanOrEqual(30);
			expect(line.heading).toBeLessThanOrEqual(150);
		}
		lines.init({});
		lines.render({}, 210 * (1000 / 60));
		expect(lines.needCleanUp).toBe(true);
	});

	it('adds one 431 renderer', () => {
		const added = [];
		hitLine6Effect[0].func.call(
			{ add: e => added.push(e) },
			{ Inst: { startTick: 0 }, Init: { ownerEntity: { position: [0, 0, 0] } } }
		);
		expect(added[0].lines).toHaveLength(20);
		expect(hitLine6Effect[0].duration).toBeGreaterThan(204 * (1000 / 60));
	});
});
