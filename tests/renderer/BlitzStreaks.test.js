import { describe, expect, it, vi } from 'vitest';

// BlitzStreaks (Blitz Beat's streaks, effect 115): an instance whose texture
// fails to load still runs out and asks to be cleaned up.

vi.mock('Core/Client.js', () => ({
	default: {
		loadFile(path, onload, onerror) {
			onerror();
		}
	}
}));
vi.mock('Utils/WebGL.js', () => ({ default: { texture() {} } }));

const { default: BlitzStreaks } = await import('../../src/Renderer/Effects/BlitzStreaks.js');
const { PRIM_TICK_MS } = await import('../../src/Renderer/Effects/EffectPrimSim.js');

describe('BlitzStreaks', () => {
	it('is cleaned up when its texture cannot be loaded', () => {
		const streaks = new BlitzStreaks({ position: [0, 0, 0], direction: 0 }, 0, () => 0);
		streaks.init({});
		expect(streaks.ready).toBe(true);
		expect(streaks.texture).toBeUndefined();
		streaks.render({}, 5 * PRIM_TICK_MS);
		expect(streaks.needCleanUp).toBeFalsy();
		streaks.render({}, 25 * PRIM_TICK_MS);
		expect(streaks.needCleanUp).toBe(true);
	});
});
