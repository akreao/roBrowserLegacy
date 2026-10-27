import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ALPHA, LIFT_CELLS, cornerDistance } from '../../src/Renderer/Effects/LandProtectorSim.js';

// Land Protector ground tile (effect 242): the official client's primitive 39, aaa copy.bmp as
// a diamond 2 units up, corners 5.6 + 0.7 (1 + sin a) units out, a +3 a tick from a random
// start, additive at alpha 100. Spec: effect-port/sage-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

describe('Land Protector tile', () => {
	it('breathes between 1.12 and 1.4 cells every 120 ticks', () => {
		expect(cornerDistance(0, 0)).toBeCloseTo(1.26, 6);
		expect(cornerDistance(0, 30)).toBeCloseTo(1.4, 6);
		expect(cornerDistance(0, 90)).toBeCloseTo(1.12, 6);
		expect(cornerDistance(87, 1)).toBeCloseTo(1.4, 6);
		expect(cornerDistance(10, 7)).toBeCloseTo(cornerDistance(10, 127), 6);
	});

	it('floats 2 units up, additive at alpha 100', () => {
		expect(LIFT_CELLS).toBeCloseTo(0.4, 6);
		expect(ALPHA * 255).toBeCloseTo(100, 6);
		const js = read('Renderer/Effects/LPEffect.js');
		expect(js).toContain('gl.blendFunc(gl.SRC_ALPHA, gl.ONE);');
	});

	it('puts the quad corners on the world axes', () => {
		const vs = read('Renderer/Effects/LPEffect.vs');
		expect(vs).toContain('vec2(aPosition.x - aPosition.y, aPosition.x + aPosition.y) * 0.5 * uSize');
	});
});
