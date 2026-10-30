import { describe, expect, it, vi } from 'vitest';
import {
	SHARD,
	PUFF,
	LAST_TICK,
	SHARD_ALPHAS,
	PUFF_ALPHAS,
	createShards,
	shardAt,
	shardTriangles,
	createPuff,
	puffAt
} from 'Renderer/Effects/ColdHitSim.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// The cold hit (effect 51), kRO 2025-07-16 0xba6a80: 9 ice.tga shards and
// two smoke.tga puffs, in screen pixels around the target.

vi.mock('Core/Client.js', () => ({
	default: {
		loadFile(path, onload, onerror) {
			onerror();
		}
	}
}));

const fixed = v => () => v;

describe('Cold hit shards', () => {
	it('are 9, every third long, from the client ranges', () => {
		const low = createShards(fixed(0));
		expect(low).toHaveLength(9);
		expect(low.map(s => s.angle)).toEqual([-15, 25, 65, 105, 145, 185, 225, 265, 305]);
		expect(low[0]).toMatchObject({ length: 100, width: 10, speed: 12.8 });
		expect(low[1]).toMatchObject({ length: 45, width: 4, speed: 4.8 });
		expect(low[0].y).toBe(-20);
		const high = createShards(fixed(0.999));
		expect(high[0]).toMatchObject({ angle: 44, length: 109, speed: 16.8 });
		expect(high[1]).toMatchObject({ length: 49, speed: 8.8 });
		// 4 pixels out along the shard's base angle, 20 up
		expect(high[0].y).toBeCloseTo(-24);
		expect(high[3].x).toBeCloseTo(Math.sin((120 * Math.PI) / 180) * 4);
	});

	it('fly out along their angle, slowing to a third', () => {
		const shard = createShards(fixed(0))[1];
		const [x0, y0] = shardAt(shard, 0);
		const [x, y] = shardAt(shard, SHARD.life);
		const travel = Math.hypot(x - x0, y - y0);
		// speed falls from 4.8 by 4.8 / 22.5 a tick
		expect(travel).toBeCloseTo(4.8 * 15 - (4.8 / 22.5) * ((15 * 16) / 2));
		// angle 25: right and up the screen
		expect(x - x0).toBeGreaterThan(0);
		expect(y - y0).toBeLessThan(0);
	});

	it('hold 200 for 5 ticks, then fade out over 10', () => {
		expect(SHARD_ALPHAS).toHaveLength(15);
		expect(SHARD_ALPHAS[4]).toBe(200);
		expect(SHARD_ALPHAS[5]).toBe(180);
		expect(SHARD_ALPHAS[14]).toBeCloseTo(0);
	});

	it('point the way they fly, the tail behind', () => {
		const shard = { angle: 0, length: 120, width: 10 };
		const [left, right] = shardTriangles(shard);
		expect(left[1]).toEqual([0, 60, 0.5, 1]);
		expect(left[2].map(v => v + 0)).toEqual([0, -60, 0.5, 0]);
		expect(left[0][0]).toBe(-5);
		expect(left[0][1]).toBeCloseTo(-10);
		expect(right[0][0]).toBe(5);
		expect(right[0][1]).toBeCloseTo(10);
	});
});

describe('Cold hit puffs', () => {
	it('start on ticks 0 and 7, drift up within 20 degrees and grow 6, then 0.5, a tick', () => {
		expect(PUFF.ticks).toEqual([0, 7]);
		const puff = createPuff(7, fixed(0));
		expect(puff).toEqual({ born: 7, angle: -20 });
		expect(puffAt(puff, 10).size).toBe(61);
		expect(puffAt(puff, 25).size).toBe(68.5);
		const up = puffAt(createPuff(0, fixed(0.5)), 20);
		expect(up.x).toBeCloseTo(0);
		expect(up.y).toBeCloseTo(-17);
	});

	it('fade out over the last 8 ticks', () => {
		expect(PUFF_ALPHAS[16]).toBe(254);
		expect(PUFF_ALPHAS[24]).toBeCloseTo(0);
		expect(LAST_TICK).toBe(31);
	});
});

describe('Cold hit effect', () => {
	it('draws on the target and keeps the hit sound', () => {
		const rows = EffectTable[51];
		expect(rows[0]).toMatchObject({ type: 'FUNC', attachedEntity: true });
		expect(rows[1]).toEqual({ wav: '_hit_fist%d', rand: [3, 4], attachedEntity: true });
	});

	it('is cleaned up after its last tick, also when its textures cannot load', async () => {
		const { default: ColdHit } = await import('Renderer/Effects/ColdHit.js');
		const { PRIM_TICK_MS } = await import('Renderer/Effects/EffectPrimSim.js');
		const hit = new ColdHit([0, 0, 0], 0, fixed(0));
		hit.init({});
		expect(hit.ready).toBe(true);
		hit.render({}, 20 * PRIM_TICK_MS);
		expect(hit.needCleanUp).toBeFalsy();
		hit.render({}, (LAST_TICK + 1) * PRIM_TICK_MS);
		expect(hit.needCleanUp).toBe(true);
	});
});
