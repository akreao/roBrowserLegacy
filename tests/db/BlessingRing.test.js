import { describe, expect, it } from 'vitest';
import EffectTable from 'DB/Effects/EffectTable.js';
import { createPrimState, advancePrim } from 'Renderer/Effects/EffectPrimSim.js';

// Blessing (effect 42), kRO 2025-07-16 (0xba43f0): a flat disc of alpha_down.tga, radius 10, tinted (32, 176, 232),
// alpha +100 / 30 a tick to 100, fading out over the last 30 of 150 ticks.

describe('Blessing ring', () => {
	const ring = EffectTable[42].find(part => part.type === 'PRIM');

	it('is a tinted alpha_down disc with the sound', () => {
		expect(ring).toMatchObject({
			prim: 'ring',
			texture: 'alpha_down',
			radius: 10,
			width: 10,
			color: [32, 176, 232],
			frames: 150,
			wav: 'effect/ef_blessing'
		});
		expect(EffectTable[42].some(part => part.file === 'effect/pok2.tga')).toBe(false);
	});

	it('fades in to 100 over 30 ticks and out over the last 30', () => {
		const state = createPrimState(ring);
		advancePrim(state, 30);
		expect(state.alpha).toBeCloseTo(100);
		advancePrim(state, 120);
		expect(state.alpha).toBeCloseTo(100);
		advancePrim(state, 150);
		expect(state.alpha).toBeCloseTo(0);
	});
});
