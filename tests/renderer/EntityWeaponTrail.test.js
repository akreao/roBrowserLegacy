import { describe, expect, it, vi } from 'vitest';

import JobId from 'DB/Jobs/JobConst.js';

// Each job has trail sprites (_검광) for some weapon types only: kRO has a Sage
// dagger trail and no Sage book trail. A book then draws no trail, not the one
// of the dagger held before it.
const DAGGER = 1;
const BOOK = 15;
const files = new Set();
// Trail sprites that answer only when the test says so, to load out of order
const held = [];
let holdTrails = false;

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
		loadFile: vi.fn((path, onLoad, onError) => {
			if (holdTrails && path.startsWith('trail') && onLoad) {
				held.push(() => (files.has(path) ? onLoad() : onError && onError()));
				return;
			}
			return files.has(path) ? onLoad && onLoad() : onError && onError();
		})
	}
}));
vi.mock('DB/Monsters/ShadowTable.js', () => ({ default: {} }));
vi.mock('Network/PacketVerManager.js', () => ({ default: { value: 20221005 } }));
vi.mock('Renderer/GR2/GR2ModelRenderer.js', () => ({ default: {} }));
vi.mock('Renderer/Entity/EntityAction.js', () => ({ default: vi.fn() }));

const { default: EntityViewInit } = await import('Renderer/Entity/EntityView.js');

function wielder(job) {
	const e = { _job: job, _sex: 0, _bodypalette: 0, costume: 0, sound: {} };
	EntityViewInit.call(e);
	e.job = job;
	return e;
}
const sage = () => wielder(JobId.SAGE);

describe('EntityView weapon trail', () => {
	files.add(`weapon${DAGGER}_${JobId.SAGE}.spr`);
	files.add(`weapon${BOOK}_${JobId.SAGE}.spr`);
	files.add(`trail${DAGGER}_${JobId.SAGE}.spr`);
	files.add(`weapon${DAGGER}_${JobId.WIZARD}.spr`);
	files.add(`body${JobId.WIZARD}_0.spr`);
	files.add(`body${JobId.WIZARD}_0.act`);

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

	it('drops the old trail when the new weapon has no sprite at all', () => {
		const e = sage();
		e.weapon = DAGGER;
		e.weapon = 1234;
		expect(e.files.weapon_trail.spr).toBeNull();
	});

	it('ignores a trail that finishes loading after a job change', () => {
		const e = sage();
		holdTrails = true;
		e.weapon = DAGGER;
		// Same dagger, a job with no dagger trail, before the Sage trail answers
		e.job = JobId.WIZARD;
		holdTrails = false;
		held.splice(0).forEach(done => done());
		expect(e.files.weapon.spr).toBe(`weapon${DAGGER}_${JobId.WIZARD}.spr`);
		expect(e.files.weapon_trail.spr).toBeNull();
	});
});
