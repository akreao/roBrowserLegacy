import { describe, expect, it } from 'vitest';
import { scaledLayer } from '../../src/Renderer/Entity/ScaledLayer.js';

// An effect sprite drawn at a size factor (Lightning Jolt's 2.5): its layer offset grows with it.

describe('scaledLayer', () => {
	it('scales an effect sprite layer offset with its size', () => {
		const layer = { pos: [-17, -64], scale: [1, 1], index: 0 };
		expect(scaledLayer(layer, 1)).toBe(layer);
		const big = scaledLayer(layer, 2.5);
		expect(big.pos).toEqual([-42.5, -160]);
		expect(big.index).toBe(0);
		expect(layer.pos).toEqual([-17, -64]);
	});
});
