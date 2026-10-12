import { describe, it, expect, vi, beforeEach } from 'vitest';

// Every file the loader asks for, and a way to answer each one by hand.
const files = vi.hoisted(() => ({ asked: [], pending: new Map() }));

vi.mock('Core/FileManager.js', () => ({
	default: {
		filesAlias: {},
		load(name, callback) {
			files.asked.push(name);
			files.pending.set(name, callback);
		}
	}
}));

import MapLoader from 'Loaders/MapLoader.js';

const model = {
	instances: [],
	createInstance() {},
	hasAnimation: () => false,
	compile: () => ({ meshes: [], textures: [] })
};

const world = {
	files: { gat: 'map.gat', gnd: 'map.gnd' },
	models: [{ filename: 'a.rsm' }, { filename: 'b.rsm' }, { filename: 'a.rsm' }],
	water: { level: 0, waveHeight: 0 },
	compile: () => ({})
};

const ground = {
	version: 1.7,
	width: 1,
	height: 1,
	textures: ['t1.bmp', 't2.bmp'],
	compile: () => ({ textures: ['t1.bmp', 't2.bmp'], waterVertCount: 0 })
};

const altitude = { compile: () => ({}) };

function answer(name, data) {
	const callback = files.pending.get(name);
	expect(callback, `${name} was not asked for`).toBeTypeOf('function');
	files.pending.delete(name);
	callback(data);
}

const settle = () => new Promise(resolve => setTimeout(resolve, 0));

describe('MapLoader', () => {
	beforeEach(() => {
		files.asked.length = 0;
		files.pending.clear();
	});

	it('asks for the ground and the models with the altitude, and still hands them on in order', async () => {
		const loader = new MapLoader();
		const order = [];
		loader.ondata = type => order.push(type);
		loader.onload = ok => order.push(`done:${ok}`);
		loader.load('map.rsw');

		answer('data\\map.rsw', world);
		await settle();
		expect(files.asked).toEqual([
			'data\\map.rsw',
			'data\\map.gnd',
			'data\\model\\a.rsm',
			'data\\model\\b.rsm',
			'data\\map.gat'
		]);

		// The ground arrives first, but is not used before the altitude.
		answer('data\\map.gnd', ground);
		await settle();
		expect(order).toEqual([]);

		answer('data\\map.gat', altitude);
		await settle();
		expect(order).toEqual(['MAP_ALTITUDE']);
		// Its textures were asked for once, not again by the texture step.
		expect(files.asked.filter(name => name.startsWith('data\\texture\\'))).toEqual([
			'data\\texture\\t1.bmp',
			'data\\texture\\t2.bmp'
		]);

		answer('data\\model\\a.rsm', { ...model });
		answer('data\\model\\b.rsm', { ...model });
		answer('data\\texture\\t1.bmp', 'blob:t1');
		answer('data\\texture\\t2.bmp', 'blob:t2');
		await settle();
		await settle();

		expect(order).toEqual(['MAP_ALTITUDE', 'MAP_WORLD', 'MAP_GROUND', 'MAP_MODELS', 'done:true']);
		expect(new Set(files.asked).size).toBe(files.asked.length);
	});

	it('stops at a missing altitude without using the ground', async () => {
		const loader = new MapLoader();
		const order = [];
		loader.ondata = type => order.push(type);
		loader.onload = (ok, error) => order.push(`done:${ok}:${error}`);
		loader.load('map.rsw');

		answer('data\\map.rsw', world);
		await settle();
		answer('data\\map.gnd', ground);
		answer('data\\map.gat', null);
		await settle();

		expect(order).toEqual(['done:false:Can\'t find file "map.gat" !']);
		expect(files.asked.some(name => name.startsWith('data\\texture\\'))).toBe(false);
	});
});
