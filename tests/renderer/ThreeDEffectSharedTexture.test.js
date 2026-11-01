import { describe, expect, it, vi } from 'vitest';

// 2D and 3D effects: every instance of every row loads its texture file once and shares it, and
// the last instance to go deletes it. Loading a texture per cast was slow (two 2D canvases each)
// and the texture was never deleted.

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
const { default: TwoDEffect } = await import('../../src/Renderer/Effects/TwoDEffect.js');

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

	it('shares the texture of rows without `sharedTexture` too', () => {
		ThreeDEffect.free(gl);
		deleted.length = 0;
		loads.length = 0;
		const a = make({ file: 'effect/endure.tga' });
		const b = make({ file: 'effect/endure.tga' });
		a.init(gl);
		b.init(gl);
		expect(loads).toEqual(['data/texture/effect/endure.tga']);
		expect(a.texture).toBe(b.texture);
		a.free(gl);
		b.free(gl);
		expect(deleted).toEqual([a.texture]);
	});

	it('lets an instance from before the class was freed go without touching the new texture', () => {
		ThreeDEffect.free(gl);
		const old = make({ file: 'effect/endure.tga' });
		old.init(gl);
		// Context lost and restored: the class starts again while `old` is still on screen.
		ThreeDEffect.free(gl);
		deleted.length = 0;
		const fresh = make({ file: 'effect/endure.tga' });
		fresh.init(gl);
		old.free(gl);
		expect(deleted).toHaveLength(0);
		fresh.free(gl);
		expect(deleted).toEqual([fresh.texture]);
	});

	it('shares 2D effect textures and deletes them with the last instance', () => {
		TwoDEffect.free(gl);
		deleted.length = 0;
		loads.length = 0;
		const make2D = () =>
			new TwoDEffect(
				{ type: '2D', file: 'effect/ring_blue.tga', alphaMax: 1, duration: 100 },
				{ position: [0, 0, 0], startTick: 0, endTick: 100 },
				{ ownerAID: 1 }
			);
		const a = make2D();
		const b = make2D();
		a.init(gl);
		b.init(gl);
		expect(loads).toEqual(['data/texture/effect/ring_blue.tga']);
		expect(a.ready && b.ready).toBe(true);
		expect(a.texture).toBe(b.texture);
		a.free(gl);
		expect(deleted).toHaveLength(0);
		b.free(gl);
		expect(deleted).toEqual([a.texture]);
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
