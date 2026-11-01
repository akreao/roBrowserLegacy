import { describe, expect, it, vi } from 'vitest';

// ThreeDEffect `sharedTexture`: many instances of one row (Endure's streaks) load their
// effect/ texture once and share it, and the class frees it when its last instance goes.

const loads = vi.hoisted(() => []);
// When `held` is an array, loads wait in it until the test runs them.
const pending = vi.hoisted(() => ({ held: null }));
vi.mock('Core/Client.js', () => ({
	default: {
		loadFile(path, onload, onerror) {
			loads.push(path);
			if (path.includes('missing')) {
				if (onerror) {
					onerror();
				}
				return;
			}
			const done = () => onload(new ArrayBuffer(4));
			if (pending.held) {
				pending.held.push(done);
			} else {
				done();
			}
		}
	}
}));
vi.mock('Utils/WebGL.js', () => ({
	default: {
		texture(gl, buffer, onload) {
			onload({ id: loads.length });
		}
	}
}));
vi.mock('Renderer/SpriteRenderer.js', () => ({ default: {} }));
vi.mock('Renderer/Camera.js', () => ({ default: { angle: [0, 0], direction: 0 } }));

const { default: ThreeDEffect } = await import('../../src/Renderer/Effects/ThreeDEffect.js');

const deleted = [];
const gl = { deleteTexture: t => deleted.push(t) };

function make(row) {
	return new ThreeDEffect(
		{ type: '3D', alphaMax: 1, size: 50, ...row },
		{ position: [0, 0, 0], startTick: 0, endTick: 100 },
		{ ownerAID: 1 }
	);
}

describe('ThreeDEffect shared textures', () => {
	it('loads a shared effect/ texture once for every instance', () => {
		loads.length = 0;
		const a = make({ file: 'effect/alpha_down.tga', sharedTexture: true });
		const b = make({ file: 'effect/alpha_down.tga', sharedTexture: true });
		a.init(gl);
		b.init(gl);
		expect(loads).toEqual(['data/texture/effect/alpha_down.tga']);
		expect(a.ready && b.ready).toBe(true);
		expect(a.texture).toBe(b.texture);
	});

	it('frees the shared textures with the class', () => {
		deleted.length = 0;
		ThreeDEffect.free(gl);
		expect(deleted).toHaveLength(1);
		loads.length = 0;
		make({ file: 'effect/alpha_down.tga', sharedTexture: true }).init(gl);
		expect(loads).toHaveLength(1);
	});

	it('keeps one load per instance for other rows', () => {
		loads.length = 0;
		make({ file: 'effect/endure.tga' }).init(gl);
		make({ file: 'effect/endure.tga' }).init(gl);
		expect(loads).toHaveLength(2);
	});

	it('deletes a shared texture when its last instance is freed, also before the class goes', () => {
		ThreeDEffect.free(gl);
		deleted.length = 0;
		loads.length = 0;
		const a = make({ file: 'effect/alpha_down.tga', sharedTexture: true });
		const b = make({ file: 'effect/alpha_down.tga', sharedTexture: true });
		a.init(gl);
		b.init(gl);
		a.free(gl);
		expect(deleted).toHaveLength(0);
		b.free(gl);
		b.free(gl);
		expect(deleted).toHaveLength(1);
		make({ file: 'effect/alpha_down.tga', sharedTexture: true }).init(gl);
		expect(loads).toHaveLength(2);
	});

	it('deletes a texture that finishes loading after its last instance was freed', () => {
		ThreeDEffect.free(gl);
		deleted.length = 0;
		pending.held = [];
		const a = make({ file: 'effect/alpha_down.tga', sharedTexture: true });
		a.init(gl);
		a.free(gl);
		expect(a.ready).toBe(false);
		const held = pending.held;
		pending.held = null;
		held.forEach(run => run());
		expect(deleted).toHaveLength(1);
	});

	it('shares every picture of a fileList, and frees them with the last instance', () => {
		ThreeDEffect.free(gl);
		deleted.length = 0;
		loads.length = 0;
		const row = { fileList: ['effect/super1.bmp', 'effect/super2.bmp'], sharedTexture: true };
		const a = make(row);
		const b = make(row);
		a.init(gl);
		b.init(gl);
		expect(loads).toEqual(['data/texture/effect/super1.bmp', 'data/texture/effect/super2.bmp']);
		expect(a.ready && b.ready).toBe(true);
		expect(a.textureList).toEqual(b.textureList);
		a.free(gl);
		expect(deleted).toHaveLength(0);
		b.free(gl);
		expect(deleted).toHaveLength(2);
	});

	it('shares a texture outside effect/ by its whole path', () => {
		ThreeDEffect.free(gl);
		loads.length = 0;
		const a = make({ file: 'ui/item/mg_coldbolt.bmp', sharedTexture: true });
		const b = make({ file: 'ui/item/mg_coldbolt.bmp', sharedTexture: true });
		a.init(gl);
		b.init(gl);
		expect(loads).toEqual(['data/texture/ui/item/mg_coldbolt.bmp']);
		expect(a.ready && b.ready).toBe(true);
	});

	it('drops an instance whose shared texture is missing', () => {
		const a = make({ file: 'ui/item/missing.bmp', sharedTexture: true });
		a.init(gl);
		expect(a.ready).toBeFalsy();
		expect(a.needCleanUp).toBe(true);
		const b = make({ fileList: ['effect/missing1.tga', 'effect/missing2.tga'], sharedTexture: true });
		b.init(gl);
		expect(b.needCleanUp).toBe(true);
	});
});
