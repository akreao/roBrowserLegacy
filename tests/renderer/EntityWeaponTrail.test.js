import { describe, expect, it, vi } from 'vitest';

import JobId from 'DB/Jobs/JobConst.js';

// Each job has trail sprites (_검광) for some weapon types only: kRO has a Sage
// dagger trail and no Sage book trail. A book then draws no trail, not the one
// of the dagger held before it.
const DAGGER = 1;
const BOOK = 15;
const files = new Set();

vi.mock('DB/DBManager.js', async () => {
	const DB = {
		getBodyPath: (id, sex) => `body${id}_${sex}`,
		getWeaponPath: (id, job) => `weapon${id}_${job}`,
		getWeaponTrail: (id, job) => `trail${id}_${job}`,
		getWeaponViewID: id => id,
		getWeaponType: id => id
	};
	// Anything else the view asks for is not under test.
	return { default: new Proxy(DB, { get: (t, k) => (k in t ? t[k] : () => null) }) };
});
// Loads at once; a file that isn't there calls the error callback.
vi.mock('Core/Client.js', () => ({
	default: {
		loadFile: vi.fn((path, onLoad, onError) => (files.has(path) ? onLoad && onLoad() : onError && onError()))
	}
}));
vi.mock('DB/Monsters/ShadowTable.js', () => ({ default: {} }));
vi.mock('Network/PacketVerManager.js', () => ({ default: { value: 20221005 } }));
vi.mock('Renderer/GR2/GR2ModelRenderer.js', () => ({ default: {} }));
vi.mock('Renderer/Entity/EntityAction.js', () => ({ default: vi.fn() }));

const { default: EntityViewInit } = await import('Renderer/Entity/EntityView.js');

function sage() {
	const e = { _job: JobId.SAGE, _sex: 0, _bodypalette: 0, costume: 0, sound: {} };
	EntityViewInit.call(e);
	e.job = JobId.SAGE;
	return e;
}

describe('EntityView weapon trail', () => {
	files.add(`weapon${DAGGER}_${JobId.SAGE}.spr`);
	files.add(`weapon${BOOK}_${JobId.SAGE}.spr`);
	files.add(`trail${DAGGER}_${JobId.SAGE}.spr`);

	it('draws the trail of a weapon that has one', () => {
		const e = sage();
		e.weapon = DAGGER;
		expect(e.files.weapon_trail.spr).toBe(`trail${DAGGER}_${JobId.SAGE}.spr`);
	});

	it('drops the old trail for a weapon without one', () => {
		const e = sage();
		e.weapon = DAGGER;
		e.weapon = BOOK;
		expect(e.files.weapon.spr).toBe(`weapon${BOOK}_${JobId.SAGE}.spr`);
		expect(e.files.weapon_trail.spr).toBeNull();
		expect(e.files.weapon_trail.act).toBeNull();
	});

	it('drops the trail when the weapon is taken off', () => {
		const e = sage();
		e.weapon = DAGGER;
		e.weapon = 0;
		expect(e.files.weapon_trail.spr).toBeNull();
	});
});
