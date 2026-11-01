import { describe, expect, it } from 'vitest';
import EffectTable from 'DB/Effects/EffectTable.js';

// Aura Blade (367 EF_AURABLADE), kRO 2025-07-16: on tick 0 two cast-aura rings, size 45 in ring_white.tga and size 25 in
// ring_yellow.tga, both argument 22; life 60 ticks.

describe('Aura Blade rings', () => {
	it('builds a white and a yellow ring for 60 ticks', () => {
		const added = [];
		EffectTable[367][1].func.call(
			{ add: e => added.push(e) },
			{ Init: { ownerEntity: { position: [0, 0, 0] } }, Inst: { startTick: 0 } }
		);
		expect(added).toHaveLength(1);
		const ring = added[0];
		expect(ring.textures).toEqual(['ring_white.tga', 'ring_yellow.tga']);
		expect(ring.rings).toHaveLength(2);
		expect(ring.frames).toBe(60);
		expect(EffectTable[367][0].wav).toBeDefined();
	});
});
