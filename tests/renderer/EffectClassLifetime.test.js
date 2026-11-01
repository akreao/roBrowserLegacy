import { describe, it } from 'vitest';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// An effect class keeps its GL set-up (StrEffect's shaders) from one burst of
// effects to the next, and frees it once, when the map goes. Freeing it when
// its last effect ended made it compile its shaders again on the next one.

const sourceRoot = process.env.EFFECT_SOURCE_ROOT || join(process.cwd(), 'src');
const source = name => readFileSync(join(sourceRoot, name), 'utf8').replace(/^import .*;\r?$/gm, '');

function manager() {
	const context = vm.createContext({
		console,
		Math,
		Number,
		Float32Array,
		Session: { Entity: { position: [0, 0, 0] } },
		GraphicsSettings: { performanceMode: false },
		Renderer: { tick: 0 },
		SU: {},
		SkillEffect: {},
		SkillUnit: {},
		EffectDB: {}
	});
	vm.runInContext(
		source('Renderer/EffectManager.js').replace(
			'export default EffectManager;',
			'this.EffectManager = EffectManager; this.list = _list;'
		),
		context
	);
	return context;
}

function effectClass() {
	const counts = { init: 0, free: 0 };
	class Burst {
		static init() {
			counts.init++;
			this.ready = true;
		}
		static free() {
			counts.free++;
			this.ready = false;
		}
		static beforeRender() {}
		static afterRender() {}
		constructor() {
			this.ready = true;
		}
		render() {
			this.needCleanUp = true;
		}
	}
	return { Burst, counts };
}

describe('effect class lifetime', () => {
	it('sets a class up once across bursts and frees it with the map', () => {
		const { EffectManager, list } = manager();
		const { Burst, counts } = effectClass();
		const gl = {};

		for (let burst = 0; burst < 3; burst++) {
			EffectManager.add(new Burst(), {});
			EffectManager.render(gl, null, null, {}, 0, false);
			assert.equal(list.Burst, undefined, 'the list empties when its effect ends');
		}
		assert.deepEqual({ ...counts }, { init: 1, free: 0 });

		EffectManager.free(gl);
		assert.deepEqual({ ...counts }, { init: 1, free: 1 });

		// The next map sets it up again
		EffectManager.add(new Burst(), {});
		EffectManager.render(gl, null, null, {}, 0, false);
		assert.equal(counts.init, 2);
	});

	it('frees a class with effects still playing when the map goes', () => {
		const { EffectManager } = manager();
		const { Burst, counts } = effectClass();
		Burst.prototype.render = function () {};
		EffectManager.add(new Burst(), {});
		EffectManager.render({}, null, null, {}, 0, false);
		EffectManager.free({});
		assert.deepEqual({ ...counts }, { init: 1, free: 1 });
	});
});

describe('effect classes after a lost WebGL context', () => {
	it('sets an idle class up again once the context is restored', () => {
		const context = manager();
		const { EffectManager, Renderer } = context;
		const { Burst, counts } = effectClass();

		EffectManager.add(new Burst(), {});
		EffectManager.render({}, null, null, {}, 0, false);
		assert.deepEqual({ ...counts }, { init: 1, free: 0 });

		// Lost and restored between bursts
		Renderer.contextGeneration = 1;
		EffectManager.add(new Burst(), {});
		EffectManager.render({}, null, null, {}, 0, false);
		assert.deepEqual({ ...counts }, { init: 2, free: 1 });

		// and only once
		EffectManager.add(new Burst(), {});
		EffectManager.render({}, null, null, {}, 0, false);
		assert.deepEqual({ ...counts }, { init: 2, free: 1 });
	});

	it('keeps a class with nothing on the GPU drawing', () => {
		const { EffectManager, Renderer, list } = manager();
		let frames = 0;
		class Glow {
			static ready = true;
			static beforeRender() {}
			static afterRender() {}
			constructor() {
				this.ready = true;
			}
			render() {
				frames++;
			}
		}
		EffectManager.add(new Glow(), {});
		EffectManager.render({}, null, null, {}, 0, false);
		Renderer.contextGeneration = 1;
		EffectManager.render({}, null, null, {}, 0, false);
		assert.equal(frames, 2);
		assert.equal(list.Glow.length, 1);
	});
});
