import { describe, expect, it, vi } from 'vitest';
import {
	FOREST_LIGHT_LIFE,
	COLUMN_VERTICES,
	TINT,
	createColumns,
	stepColumns,
	buildColumn,
	columnsDone
} from 'Renderer/Effects/ForestLightSim.js';
import ForestLight from 'Renderer/Effects/ForestLight.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// EF_FORESTLIGHT5 (719, Renovatio), kRO 2025-07-16: 0xbe9490(cloud11.tga, 12) on tick 0, primitive 66
// (update 0xb49818, draw 0xb708c0). effect-port/forest-light.md.

vi.mock('Core/Client.js', () => ({ default: { loadFile() {} } }));

const run = (columns, n) => {
	for (let i = 0; i < n; i++) {
		stepColumns(columns);
	}
};

describe('Renovatio light columns (719)', () => {
	it('builds four columns, each 300 units higher and 70 further back', () => {
		const columns = createColumns();
		expect(columns.map(c => [c.age, c.alpha, c.radius, c.start])).toEqual([
			[0, 30, 1, 0],
			[0, 30, 1.5, 25],
			[0, 30, 2, 50],
			[180, 30, 1, 75]
		]);
		expect(columns[2].top).toEqual([-210, -900, -210]);
		expect(TINT).toEqual([230, 255, 230]);
		expect(FOREST_LIGHT_LIFE).toBe(999);
	});

	it('fades in to tick 40, holds, fades out after 140; the fourth only fades', () => {
		const columns = createColumns();
		run(columns, 1);
		expect(columns[0].alpha).toBe(31);
		expect(columns[3].alpha).toBe(29);
		run(columns, 39);
		expect(columns[0].alpha).toBe(70);
		expect(columns[3].alpha).toBe(0);
		run(columns, 100);
		expect(columns[0].alpha).toBe(70);
		run(columns, 70);
		expect(columns[0].alpha).toBe(0);
		expect(columnsDone(columns)).toBe(true);
	});

	it('swells columns 1 and 3 by 0.5 sin(age / 2)', () => {
		const columns = createColumns();
		run(columns, 180);
		expect(columns[1].radius).toBeCloseTo(1.5 + 0.5);
		expect(columns[0].radius).toBe(1);
	});

	it('draws five sides from the ground to the top', () => {
		const columns = createColumns();
		const out = new Float32Array(COLUMN_VERTICES * 5);
		expect(buildColumn(out, 0, columns[0], [0, 0, 0])).toBe(COLUMN_VERTICES * 5);
		// first vertex: corner 0 on the ground, radius 1 along x (in cells)
		expect(out[0]).toBeCloseTo(0.5 + 0.2);
		expect(out[1]).toBeCloseTo(0);
		// third vertex: corner 1 at the top, 300 units (60 cells) up
		expect(out[11]).toBeCloseTo(-60);
	});

	it('719 keeps the skill sound and adds the columns where the target stood', () => {
		expect(EffectTable[719][0].wav).toBe('effect/ab_renovatio');
		const added = [];
		const owner = { position: [3, 4, 0] };
		EffectTable[719][1].func.call(
			{ add: e => added.push(e) },
			{ Inst: { startTick: 0 }, Init: { ownerEntity: owner } }
		);
		const light = added[0];
		expect(light).toBeInstanceOf(ForestLight);
		owner.position[0] = 9;
		expect(light.position).toEqual([3, 4, 0]);
		light.init({ createBuffer: () => ({}) });
		light.render({}, 215 * (1000 / 60));
		expect(light.needCleanUp).toBe(true);
	});
});
