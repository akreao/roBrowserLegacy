import { describe, expect, it, vi } from 'vitest';

import JobId from 'DB/Jobs/JobConst.js';

// kRO's data.grf has only the body files for the Druid's Werewolf and
// Wereraptor forms: no garment, weapon or shield sprite is named after them.
// The ones the Druid wore must not stay drawn on the beast.
const CAPE = 2;
const AXE = 6;
const BUCKLER = 2104;
const files = new Set();

vi.mock('DB/DBManager.js', async () => {
	const DB = {
		getBodyPath: (id, sex) => `body${id}_${sex}`,
		getRobePath: (id, job, sex) => `robe${id}_${job}_${sex}`,
		getRobePathNoSex: id => `robe${id}`,
		getWeaponPath: (id, job) => `weapon${id}_${job}`,
		getWeaponViewID: id => id,
		getWeaponType: id => id,
		getWeaponTrail: (id, job) => `trail${id}_${job}`,
		getShieldPath: (id, job) => `shield${id}_${job}`,
		isShield: () => true
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

function stock() {
	files.clear();
	for (const job of [JobId.DRUID, JobId.WEREWOLF, JobId.WERERAPTOR]) {
		files.add(`body${job}_0.act`);
		files.add(`body${job}_0.spr`);
	}
	// The Druid has its own garment, weapon and shield files; the forms have none.
	files.add(`robe${CAPE}_${JobId.DRUID}_0.spr`);
	files.add(`robe${CAPE}.spr`);
	files.add(`weapon${AXE}_${JobId.DRUID}.spr`);
	files.add(`trail${AXE}_${JobId.DRUID}.spr`);
	files.add(`shield${BUCKLER}_${JobId.DRUID}.spr`);
}

function druid() {
	const e = { _job: JobId.DRUID, _sex: 0, _bodypalette: 0, costume: 0, sound: {} };
	EntityViewInit.call(e);
	e.job = JobId.DRUID;
	e.robe = CAPE;
	e.weapon = AXE;
	e.shield = BUCKLER;
	return e;
}

const EQUIP = ['robe', 'weapon', 'weapon_trail', 'shield'];

describe('EntityView equipment on a Druid form', () => {
	for (const form of ['WEREWOLF', 'WERERAPTOR']) {
		it(`draws no garment, weapon or shield on the ${form.toLowerCase()}`, () => {
			stock();
			const e = druid();
			expect(e.files.robe.spr).toBe(`robe${CAPE}_${JobId.DRUID}_0.spr`);
			expect(e.files.weapon.spr).toBe(`weapon${AXE}_${JobId.DRUID}.spr`);

			e.job_transform = JobId[form];
			expect(e.files.body.spr).toBe(`body${JobId[form]}_0.spr`);
			for (const part of EQUIP) {
				expect(e.files[part].spr, part).toBeNull();
			}
			// The equipment is still worn: only its sprites are hidden.
			expect(e.robe).toBe(CAPE);
			expect(e.weapon).toBe(AXE);
		});
	}

	it('keeps them hidden when the garment changes while transformed', () => {
		stock();
		const e = druid();
		e.job_transform = JobId.WEREWOLF;
		files.add(`robe${CAPE}_${JobId.WEREWOLF}_0.spr`);
		e.robe = CAPE;
		expect(e.files.robe.spr).toBeNull();
	});

	it('draws them again when the form ends', () => {
		stock();
		const e = druid();
		e.job_transform = JobId.WERERAPTOR;
		e.job_transform = null;
		expect(e.files.body.spr).toBe(`body${JobId.DRUID}_0.spr`);
		expect(e.files.robe.spr).toBe(`robe${CAPE}_${JobId.DRUID}_0.spr`);
		expect(e.files.weapon.spr).toBe(`weapon${AXE}_${JobId.DRUID}.spr`);
		expect(e.files.weapon_trail.spr).toBe(`trail${AXE}_${JobId.DRUID}.spr`);
		expect(e.files.shield.spr).toBe(`shield${BUCKLER}_${JobId.DRUID}.spr`);
	});
});
