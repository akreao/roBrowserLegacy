import { describe, expect, it, vi } from 'vitest';
import { LINK, linkAlpha, linkWidth, linkReach, linkRing } from 'Renderer/Effects/UnityLinkSim.js';
import UnityLink, { linkTubeVertices } from 'Renderer/Effects/UnityLink.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Soul Unity's link (effect 1210), kRO 2025-07-16: 0xbf1af0 with 0, primitive 38,
// update 0xb46b50 case 0x26, draw 0xb75640.

vi.mock('Core/Client.js', () => ({
	default: {
		loadFile(path, onload, onerror) {
			onerror();
		}
	}
}));

describe('Soul Unity link', () => {
	it('fades in from 45 by 1 a tick up to tick 80', () => {
		expect(linkAlpha(0)).toBe(45);
		expect(linkAlpha(10)).toBe(55);
		expect(linkAlpha(80)).toBe(125);
		expect(linkAlpha(150)).toBe(125);
	});

	it('swells from 0.4 by sin(tick) * 0.005', () => {
		expect(linkWidth(0)).toBeCloseTo(0.4);
		expect(linkWidth(1)).toBeCloseTo(0.4 + Math.sin(Math.PI / 180) * 0.005);
		expect(linkWidth(90)).toBeGreaterThan(linkWidth(10));
		// a full turn of the sine comes back to the start
		expect(linkWidth(360)).toBeCloseTo(0.4, 6);
	});

	it('reaches the caster over 15 ticks', () => {
		expect(linkReach(0)).toBe(0);
		expect(linkReach(5)).toBeCloseTo(0.5);
		expect(linkReach(14)).toBeLessThan(1);
		expect(linkReach(15)).toBe(1);
		expect(linkReach(199)).toBe(1);
	});

	it('rings stand across the line, closed', () => {
		const ring = linkRing([1, 0], 2);
		expect(ring).toHaveLength(LINK.sides + 1);
		for (const p of ring) {
			expect(p[0]).toBeCloseTo(0);
			expect(Math.hypot(p[1], p[2])).toBeCloseTo(2);
		}
		expect(ring[0][2]).toBeCloseTo(ring[LINK.sides][2]);
		expect(ring[0][1]).toBeCloseTo(ring[LINK.sides][1]);
	});

	it('builds a quad a side from the start to the end', () => {
		const v = linkTubeVertices([3, -1, 0], [1, 0], 0.5);
		expect(v).toHaveLength(LINK.sides * 4 * 5);
		// side 0: start ring, then end ring, v 1 at the start and 0 at the end
		expect(v[0]).toBeCloseTo(0);
		expect(v[4]).toBe(1);
		expect(v[10]).toBeCloseTo(3);
		expect(v[14]).toBe(0);
		expect(v[11] - v[6]).toBeCloseTo(-1);
	});

	it('ends after 200 ticks or when an end is gone', () => {
		const a = { position: [10, 10, 0] };
		const b = { position: [14, 10, 0] };
		const link = new UnityLink(a, b, 1000);
		link.render(null, 1000 + 198 * 16.67);
		expect(link.needCleanUp).toBeFalsy();
		link.render(null, 1000 + 201 * 16.67);
		expect(link.needCleanUp).toBe(true);
		const lost = new UnityLink(a, null, 0);
		lost.render(null, 0);
		expect(lost.needCleanUp).toBe(true);
	});

	it('is effect 1210', () => {
		expect(EffectTable[1210]).toEqual([expect.objectContaining({ type: 'FUNC', attachedEntity: true })]);
		// a duration, so the effect manager can drop it while it is out of view
		expect(EffectTable[1210][0].duration).toBeGreaterThanOrEqual(200 * (1000 / 60));
	});
});
