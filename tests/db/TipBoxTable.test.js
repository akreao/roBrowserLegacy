/**
 * tests/db/TipBoxTable.test.js
 *
 * The tip box table: how System/tipbox.lub's main() fills it, the tip the
 * window opens on at random, the title search, and the title lines.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import TipBoxTable from 'DB/TipBox/TipBoxTable.js';

beforeEach(() => TipBoxTable.reset());

/**
 * Register tips the way ROenglishRE's tipbox.lub main() does: AddTip,
 * AddImgcoord, AddPageEx (once with effect -1 when a tip has no markers),
 * then AddPage per page.
 */
function register(add, tips) {
	for (const [id, tip] of Object.entries(tips)) {
		add.AddTip(Number(id), tip.Title, tip.Search, tip.Image);
		add.AddImgcoord(Number(id), tip.Imgcoord.Position, tip.Imgcoord.Size);
		if (!tip.PageEX) {
			add.AddPageEx(Number(id), -1, 0, 0, 0, 0, 0, 0, 0);
		} else {
			for (const v of tip.PageEX) {
				add.AddPageEx(Number(id), v.EffectNum, v.Twinkle, v.StartX, v.StartY, v.DistX, v.DistY, v.MoveTime);
			}
		}
		for (const page of tip.Page) {
			add.AddPage(Number(id), page);
		}
	}
}

// Taken from ROenglishRE's SystemEN/tipbox.lub
const TIPS = {
	1: {
		Title: 'Tip Box',
		Search: 1,
		Image: '\xc0\xaf\xc0\xfa\xc0\xce\xc5\xcd\xc6\xe4\xc0\xcc\xbd\xba\\tipbox\\tip00001',
		Imgcoord: { Position: 5, Size: 100 },
		Page: ['You can open the tip box by typing /tip, pressing Alt+D keys, or click the Tipbox icon.']
	},
	2: {
		Title: 'Help: Command List#/h',
		Search: 1,
		Image: '\xc0\xaf\xc0\xfa\xc0\xce\xc5\xcd\xc6\xe4\xc0\xcc\xbd\xba\\tipbox\\tip00002',
		Imgcoord: { Position: 5, Size: 100 },
		Page: ['You can view useful commands used in Ragnarok by typing /h.']
	},
	3: {
		Title: 'Character: HP',
		Search: 1,
		Image: '\xc0\xaf\xc0\xfa\xc0\xce\xc5\xcd\xc6\xe4\xc0\xcc\xbd\xba\\tipbox\\tip00003',
		Imgcoord: { Position: 5, Size: 100 },
		Page: ["Indicates the character's health."],
		PageEX: [
			{ EffectNum: 3, Twinkle: 1, StartX: 100, StartY: 60, DistX: 0, DistY: 0, MoveTime: 0 },
			{ EffectNum: 3, Twinkle: 1, StartX: 120, StartY: 265, DistX: 0, DistY: 0, MoveTime: 0 }
		]
	},
	999: {
		Title: 'Hidden',
		Search: 0,
		Image: '',
		Imgcoord: { Position: 5, Size: 100 },
		Page: ['Not found by a search.']
	},
	1000: {
		Title: 'Tipbox: Info',
		Search: 1,
		Image: '',
		Imgcoord: { Position: 5, Size: 100 },
		Page: ['With the Tipbox you might find answers to your questions.', 'Second page']
	}
};

describe('TipBoxTable', () => {
	it('keeps what each call registers', () => {
		register(
			{
				AddTip: TipBoxTable.addTip.bind(TipBoxTable),
				AddImgcoord: TipBoxTable.addImgCoord.bind(TipBoxTable),
				AddPageEx: TipBoxTable.addPageEx.bind(TipBoxTable),
				AddPage: TipBoxTable.addPage.bind(TipBoxTable)
			},
			TIPS
		);

		expect(TipBoxTable.size).toBe(5);
		expect(TipBoxTable.get(1)).toMatchObject({ id: 1, title: 'Tip Box', search: true, position: 5, size: 100 });
		// Effect -1 is a tip without markers
		expect(TipBoxTable.get(1).effects).toEqual([]);
		expect(TipBoxTable.get(3).effects).toEqual([
			{ effect: 3, twinkle: true, x: 100, y: 60, distX: 0, distY: 0, moveTime: 0 },
			{ effect: 3, twinkle: true, x: 120, y: 265, distX: 0, distY: 0, moveTime: 0 }
		]);
		expect(TipBoxTable.get(1000).pages).toEqual([
			'With the Tipbox you might find answers to your questions.',
			'Second page'
		]);
		expect(TipBoxTable.get(999).search).toBe(false);
		expect(TipBoxTable.get(4)).toBeNull();
	});

	it('opens on a searchable tip under 1000, at random', () => {
		register(
			{
				AddTip: TipBoxTable.addTip.bind(TipBoxTable),
				AddImgcoord: TipBoxTable.addImgCoord.bind(TipBoxTable),
				AddPageEx: TipBoxTable.addPageEx.bind(TipBoxTable),
				AddPage: TipBoxTable.addPage.bind(TipBoxTable)
			},
			TIPS
		);

		expect(TipBoxTable.randomCandidates().sort((a, b) => a - b)).toEqual([1, 2, 3]);
		expect(TipBoxTable.randomTip(() => 0)).toBe(1);
		expect(TipBoxTable.randomTip(() => 0.99)).toBe(3);
	});

	it('has no tip to open on when the table is empty', () => {
		expect(TipBoxTable.randomTip()).toBeNull();
	});

	it('finds searchable tips by title, in id order, ignoring case', () => {
		register(
			{
				AddTip: TipBoxTable.addTip.bind(TipBoxTable),
				AddImgcoord: TipBoxTable.addImgCoord.bind(TipBoxTable),
				AddPageEx: TipBoxTable.addPageEx.bind(TipBoxTable),
				AddPage: TipBoxTable.addPage.bind(TipBoxTable)
			},
			TIPS
		);

		expect(TipBoxTable.search('tip').map(tip => tip.id)).toEqual([1, 1000]);
		expect(TipBoxTable.search('CHARACTER').map(tip => tip.id)).toEqual([3]);
		expect(TipBoxTable.search('hidden')).toEqual([]);
		expect(TipBoxTable.search('   ')).toEqual([]);
	});

	it("splits a title into the window's two lines at '#'", () => {
		expect(TipBoxTable.titleLines('Help: Command List#/h')).toEqual(['Help: Command List', '/h']);
		expect(TipBoxTable.titleLines('Tip Box')).toEqual(['Tip Box']);
		expect(TipBoxTable.titleLines('a#b#c')).toEqual(['a', 'b']);
		expect(TipBoxTable.titleLines('')).toEqual([]);
	});
});

describe('loading System/tipbox.lub', () => {
	function loader(files, decoded, tipBoxGeneration = 0) {
		const lua = {
			ctx: {},
			mounted: [],
			mountFile(name) {
				this.mounted.push(name);
			},
			unmountFile(name) {
				this.mounted.splice(this.mounted.indexOf(name), 1);
			},
			async doFile() {},
			doStringSync(code) {
				expect(code).toBe('main()');
				register(lua.ctx, files);
			}
		};
		const source = fs.readFileSync(path.resolve(__dirname, '../../src/DB/DBManager.js'), 'utf8');
		const start = source.indexOf('function loadTipBoxFile(');
		const end = source.indexOf('/**', source.indexOf('\n}', start));
		return vm.runInNewContext(`${source.slice(start, end)}; loadTipBoxFile`, {
			Client: {
				loadFile: (filename, success, failure) =>
					filename === 'System/tipbox.lub' ? success(new ArrayBuffer(0)) : failure()
			},
			lua,
			TipBoxTable,
			Uint8Array,
			ArrayBuffer,
			String,
			userStringDecoder: {
				decode: (value, charset) => {
					decoded.push(charset || 'grf');
					return Buffer.from(value).toString('latin1');
				}
			},
			userCharpage: 'windows-1252',
			_tipBoxGeneration: tipBoxGeneration,
			console
		});
	}

	// The Lua strings reach the functions as bytes
	const bytes = text => new Uint8Array(Buffer.from(text, 'latin1'));

	it('registers every tip through the functions main() calls', async () => {
		const decoded = [];
		const files = {
			2: { ...TIPS[2], Title: bytes(TIPS[2].Title), Image: bytes(TIPS[2].Image), Page: [bytes(TIPS[2].Page[0])] },
			3: { ...TIPS[3], Title: bytes(TIPS[3].Title), Image: bytes(TIPS[3].Image), Page: [bytes(TIPS[3].Page[0])] }
		};
		const load = loader(files, decoded);

		const ok = await new Promise(resolve => load('System/tipbox.lub', null, resolve));

		expect(ok).toBe(true);
		expect(TipBoxTable.get(2).title).toBe('Help: Command List#/h');
		expect(TipBoxTable.get(2).image).toBe(TIPS[2].Image);
		expect(TipBoxTable.get(3).effects).toHaveLength(2);
		expect(TipBoxTable.get(3).pages).toEqual(["Indicates the character's health."]);
		// Text in the player's code page, the picture path in the GRF's
		expect(decoded).toEqual(['windows-1252', 'grf', 'windows-1252', 'windows-1252', 'grf', 'windows-1252']);
	});

	it('adds nothing once the player has moved on to another client', async () => {
		const files = { 2: { ...TIPS[2], Title: bytes(TIPS[2].Title), Image: bytes(''), Page: [bytes('x')] } };
		// Started for the first DB.init, finishing after the second
		const load = loader(files, [], 2);

		await new Promise(resolve => load('System/tipbox.lub', 1, resolve));
		expect(TipBoxTable.size).toBe(0);

		const current = loader(files, [], 2);
		await new Promise(resolve => current('System/tipbox.lub', 2, resolve));
		expect(TipBoxTable.size).toBe(1);
	});

	it('reports a file that is not there', async () => {
		const load = loader({}, []);
		const ok = await new Promise(resolve => load('System/tipbox.lua', null, resolve));
		expect(ok).toBe(false);
		expect(TipBoxTable.size).toBe(0);
	});
});
