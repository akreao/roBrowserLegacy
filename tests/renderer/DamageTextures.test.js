import { describe, it } from 'vitest';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Damage numbers showing the same text share one texture, and a texture no
// number shows is kept a while for the next hit, instead of one made and
// uploaded per hit.

const sourceRoot = process.env.EFFECT_SOURCE_ROOT || join(process.cwd(), 'src');
const code = readFileSync(join(sourceRoot, 'Renderer/Effects/Damage.js'), 'utf8')
	.replace(/^import .*;\r?$/gm, '')
	.replace('export default Damage;', 'this.Damage = Damage; this.skins = _loadedSkinsData;');

function load() {
	const gl = { created: 0, deleted: 0, uploads: 0 };
	Object.assign(gl, {
		createTexture: () => ({ id: ++gl.created }),
		deleteTexture: () => gl.deleted++,
		bindTexture() {},
		texImage2D: () => gl.uploads++,
		texParameteri() {},
		generateMipmap() {}
	});
	const canvas = () => ({ width: 0, height: 0, getContext: () => ({ clearRect() {}, drawImage() {} }) });
	const Renderer = { gl };
	const PACKETVER = { value: 0 };
	const GraphicsSettings = { damageSkin: 0 };
	const SpriteRenderer = {
		position: new Float32Array(3),
		size: new Float32Array(2),
		offset: new Float32Array(2),
		color: new Float32Array(4),
		image: {},
		bind3DContext() {},
		unbind() {},
		render() {},
		runWithDepth: (a, b, c, fn) => fn()
	};
	const context = vm.createContext({
		console,
		Math,
		Float32Array,
		Map,
		Set,
		window: {},
		document: { createElement: canvas },
		Renderer,
		Configs: { get: () => false },
		GraphicsSettings,
		PACKETVER,
		Entity: { TYPE_PC: 0 },
		DB: { getWeaponHitSound: () => null, getJobHitSound: () => null },
		MapPreferences: { miss: true },
		WebGL: { toPowerOfTwo: n => 2 ** Math.ceil(Math.log2(n)) },
		SpriteRenderer,
		EffectManager: { spam() {} },
		Sound: { playPosition() {} }
	});
	vm.runInContext(code, context);
	const digit = { width: 10, height: 12 };
	context.skins[0] = {
		numbers: Object.fromEntries([...'0123456789'].map(d => [d, digit])),
		msg: { miss: { canvas: digit } },
		msgBlue: { miss: { canvas: digit } }
	};
	return { Damage: context.Damage, gl, Renderer, GraphicsSettings, PACKETVER, skins: context.skins };
}

const monster = () => ({ objecttype: 5, constructor: { TYPE_PC: 0 }, position: [0, 0, 0], GID: 1 });

describe('damage number textures', () => {
	it('makes one texture for the same number on many targets', () => {
		const { Damage, gl } = load();
		for (let i = 0; i < 40; i++) {
			Damage.add(1234, monster(), 0);
		}
		Damage.add(999, monster(), 0);
		assert.equal(gl.created, 2);
		assert.equal(gl.uploads, 2);
	});

	it('keeps a texture after its numbers go, and frees it with the map', () => {
		const { Damage, gl } = load();
		Damage.add(1234, monster(), 0);
		Damage.render(gl, null, null, {}, 10000);
		assert.equal(gl.deleted, 0, 'kept for the next hit');

		Damage.add(1234, monster(), 20000);
		assert.equal(gl.created, 1, 'the next hit uses it again');

		Damage.free(gl);
		assert.equal(gl.deleted, 1);
	});

	it('deletes the oldest unused textures past the limit', () => {
		const { Damage, gl } = load();
		for (let i = 0; i < 100; i++) {
			Damage.add(1000 + i, monster(), 0);
		}
		Damage.render(gl, null, null, {}, 10000);
		assert.equal(gl.created, 100);
		assert.equal(gl.deleted, 36, '64 kept');

		// The newest are still there
		Damage.add(1099, monster(), 20000);
		assert.equal(gl.created, 100);
		Damage.add(1000, monster(), 20000);
		assert.equal(gl.created, 101);
	});
});

describe('damage number textures, kept apart', () => {
	it('makes them again after a lost context comes back', () => {
		const { Damage, gl, Renderer } = load();
		Damage.add(1234, monster(), 0);
		Renderer.contextGeneration = 1;
		Damage.add(1234, monster(), 0);
		assert.equal(gl.created, 2);
		Damage.add(1234, monster(), 0);
		assert.equal(gl.created, 2);
	});

	it("keeps a fallback skin's texture apart from the skin shown once it loads", () => {
		const { Damage, gl, skins, GraphicsSettings, PACKETVER } = load();
		PACKETVER.value = 20230000;
		GraphicsSettings.damageSkin = 1;
		Damage.add(1234, monster(), 0); // skin 1 not loaded: drawn from skin 0
		skins[1] = { ...skins[0], numbers: { ...skins[0].numbers } };
		Damage.add(1234, monster(), 0);
		assert.equal(gl.created, 2);
	});
});
