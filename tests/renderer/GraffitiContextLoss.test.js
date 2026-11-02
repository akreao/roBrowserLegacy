import { describe, expect, it, vi } from 'vitest';

vi.mock('Core/Client.js', () => ({ default: { loadFile: vi.fn() } }));
vi.mock('Utils/Texture.js', () => ({ default: { load: vi.fn() } }));
vi.mock('Utils/WebGL.js', () => ({ default: { createShaderProgram: () => ({ uniform: {}, attribute: {} }) } }));
vi.mock('Renderer/Map/Altitude.js', () => ({
	default: { generatePlane: (x, y, size) => new Float32Array(size * size * 30) }
}));

import Graffiti from 'Renderer/Effects/Graffiti.js';

let made = 0;
const gl = {
	createBuffer: () => ({ id: ++made }),
	bindBuffer: () => {},
	bufferData: () => {},
	deleteBuffer: () => {},
	deleteTexture: () => {},
	deleteProgram: () => {}
};

// A lost WebGL context takes every graffiti's buffer and texture with it; the
// effect manager re-inits only instances marked needInit.
describe('Graffiti after a context loss', () => {
	it('drops live graffiti GL objects and asks to build them again', () => {
		Graffiti.init(gl);
		const graffiti = new Graffiti([10, 10, 0], 'Hello', 0);
		graffiti.init(gl);
		const before = graffiti.buffer;
		expect(graffiti.ready).toBe(true);

		Graffiti.free(gl);
		expect(graffiti.ready).toBe(false);
		expect(graffiti.buffer).toBe(null);
		expect(graffiti.needInit).toBe(true);

		graffiti.init(gl);
		expect(graffiti.ready).toBe(true);
		expect(graffiti.buffer).not.toBe(before);
	});
});
