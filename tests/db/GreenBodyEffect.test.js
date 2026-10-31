import { describe, expect, it } from 'vitest';
import { SCHEDULES } from 'Renderer/Effects/CasterMarks.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// 538 EF_GREENBODY (Refresh, Abundance, Phantom Thrust; kRO 2025-07-16 CRagEffect 0xbbe350, life 120): on ages 0-30 a
// glow copy every tick; even ages the actor is drawn adding light in green, odd ages white. Same as 500 in blue.

describe('EF_GREENBODY', () => {
	it('flickers green (added) and white with a glow copy to age 30', () => {
		expect(SCHEDULES[538](0)).toEqual({ add: true, glow: true, split: false, color: [0, 255, 0] });
		expect(SCHEDULES[538](1)).toEqual({ add: false, glow: true, split: false, color: [255, 255, 255] });
		expect(SCHEDULES[538](30)).toEqual({ add: true, glow: true, split: false, color: [0, 255, 0] });
		expect(SCHEDULES[538](31)).toEqual({ add: false, glow: false, split: false, color: null });
	});

	it('lives 120 ticks on its owner', () => {
		const added = [];
		EffectTable[538][0].func.call(
			{ add: e => added.push(e) },
			{ Init: { ownerEntity: null }, Inst: { startTick: 0 } }
		);
		expect(added).toHaveLength(1);
		expect(added[0].frames).toBe(120);
	});
});
