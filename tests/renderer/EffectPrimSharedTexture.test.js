import { describe, it, expect, vi } from 'vitest';

// EffectPrim shares one texture per file between its instances (Meteor Assault
// draws 32 purpleslash quads at once): one load, and the last user deletes it.

const loads = [];
vi.mock('Core/Client.js', () => ({
	default: { loadFile: (path, onload) => loads.push({ path, onload }) }
}));
vi.mock('Utils/WebGL.js', () => ({
	default: { texture: (gl, buffer, done) => done({ id: buffer }), createShaderProgram: () => ({}) }
}));
vi.mock('Renderer/SpriteRenderer.js', () => ({ default: {} }));

const { default: EffectPrim } = await import('Renderer/Effects/EffectPrim.js');

function glStub() {
	return {
		deleted: [],
		createBuffer: () => ({}),
		deleteBuffer() {},
		deleteTexture(t) {
			this.deleted.push(t);
		}
	};
}

const effect = { prim: 'quad', texture: 'purpleslash', frames: 10 };
const make = () => new EffectPrim(effect, { position: [0, 0, 0], startTick: 0 }, null);

describe('EffectPrim shared textures', () => {
	it('loads a file once for many primitives and deletes it after the last one', () => {
		const gl = glStub();
		const prims = Array.from({ length: 32 }, make);
		prims.forEach(p => p.init(gl));
		expect(loads).toHaveLength(1);
		expect(loads[0].path).toBe('data/texture/effect/purpleslash.tga');

		loads[0].onload('tex');
		expect(prims.every(p => p.ready && p.texture === prims[0].texture)).toBe(true);

		prims.slice(0, 31).forEach(p => p.free(gl));
		expect(gl.deleted).toHaveLength(0);
		prims[31].free(gl);
		expect(gl.deleted).toEqual([{ id: 'tex' }]);
	});

	it('loads it again once every user is gone', () => {
		const gl = glStub();
		make().init(gl);
		expect(loads).toHaveLength(2);
	});
});
