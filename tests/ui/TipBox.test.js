/**
 * tests/ui/TipBox.test.js
 *
 * The tip box window: the tip it opens on, its title lines and pages, links
 * to other tips, the search, and "Open on Startup".
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const loaded = [];
const state = { tipsLoaded: true };
const navigation = { show: vi.fn(), setNaviInfo: vi.fn(), uid: null };
const itemInfo = { append: vi.fn(), remove: vi.fn(), setItem: vi.fn(), uid: null };

vi.mock('UI/CursorManager.js', () => ({ default: { ACTION: { DEFAULT: 0 }, setType: vi.fn(), getActualType: vi.fn() } }));
vi.mock('DB/DBManager.js', async () => {
	const actual = (await vi.importActual('DB/DBManager.js')).default;
	return {
		default: {
			INTERFACE_PATH: 'data/texture/ui/',
			getMessage: (_id, fallback) => fallback,
			formatMsgToHtml: actual.formatMsgToHtml,
			formatDescriptionTags: actual.formatDescriptionTags,
			loadTipBox: () => Promise.resolve(state.tipsLoaded)
		}
	};
});
vi.mock('Core/Client.js', () => ({
	default: {
		loadFile(path, callback) {
			loaded.push(path);
			callback?.(`data:${path}`);
		},
		loadFiles(_paths, callback) {
			callback?.('', '');
		}
	}
}));
vi.mock('Core/Preferences.js', () => ({ default: { get: (_name, defaults) => ({ ...defaults, save: vi.fn() }) } }));
vi.mock('Renderer/Renderer.js', () => ({ default: { width: 1200, height: 800 } }));
vi.mock('Renderer/EntityManager.js', () => ({ default: { setOverEntity: vi.fn() } }));
vi.mock('UI/Scrollbar.js', () => ({ default: {} }));
vi.mock('UI/UIManager.js', () => ({
	default: {
		addComponent: component => component,
		getComponent: name => ({ Navigation: navigation, ItemInfo: itemInfo })[name]
	}
}));

const TipBoxTable = (await import('DB/TipBox/TipBoxTable.js')).default;
const TipBox = (await import('UI/Components/TipBox/TipBox.js')).default;

const root = () => TipBox.getRoot();
const text = selector => root().querySelector(selector).textContent;

function addTip(id, title, pages, { search = 1, image = '', effects = [] } = {}) {
	TipBoxTable.addTip(id, title, search, image);
	TipBoxTable.addImgCoord(id, 5, 100);
	if (!effects.length) {
		TipBoxTable.addPageEx(id, -1, 0, 0, 0, 0, 0, 0);
	}
	for (const e of effects) {
		TipBoxTable.addPageEx(id, e.effect, e.twinkle, e.x, e.y, 0, 0, 0);
	}
	for (const page of pages) {
		TipBoxTable.addPage(id, page);
	}
}

beforeEach(() => {
	loaded.length = 0;
	state.tipsLoaded = true;
	TipBoxTable.reset();
	addTip(1, 'Tip Box', ['Open it with /tip.\n<TIPBOX>View Tip List<INFO>1000</INFO></TIPBOX>'], {
		image: 'ui\\tipbox\\tip00001'
	});
	addTip(2, 'Help: Command List#/h', ['Type ^3b488c/h^000000.'], {
		image: 'ui\\tipbox\\tip00002',
		effects: [{ effect: 3, twinkle: 1, x: 100, y: 60 }]
	});
	addTip(1000, 'Tipbox: Info', ['First page', 'Second page', 'Third page']);
	addTip(1001, 'Character', ['<NAVI>[Philip]<INFO>comodo,178,80,0,101,0</INFO></NAVI> <ITEM>[Apple]<INFO>512</INFO></ITEM>']);
	addTip(1002, 'Hidden topic', ['x'], { search: 0 });
});

afterEach(() => {
	if (TipBox.__active) {
		TipBox.remove();
	}
	vi.restoreAllMocks();
});

describe('the tip box window', () => {
	it('opens on a general tip at random', async () => {
		vi.spyOn(Math, 'random').mockReturnValue(0.99);
		await TipBox.open();

		expect(TipBox.getState().tipId).toBe(2);
		expect(text('.title-line.first')).toBe('Help: Command List');
		expect(text('.title-line.second')).toBe('/h');
	});

	it('opens on the tip it is given', async () => {
		await TipBox.open(1000);

		expect(TipBox.getState().tipId).toBe(1000);
		expect(text('.title-line.first')).toBe('Tipbox: Info');
		expect(text('.title-line.second')).toBe('');
		expect(text('.page')).toBe('First page');
	});

	it('opens on a random tip when the one it is given is unknown', async () => {
		vi.spyOn(Math, 'random').mockReturnValue(0);
		await TipBox.open(4242);
		expect(TipBox.getState().tipId).toBe(1);
	});

	it('moves the text down a line for a two-line title', async () => {
		await TipBox.open(2);
		expect(root().querySelector('.page').classList.contains('two-lines')).toBe(true);

		await TipBox.open(1);
		expect(root().querySelector('.page').classList.contains('two-lines')).toBe(false);
	});

	it('pages through a tip with the arrows', async () => {
		await TipBox.open(1000);
		const prev = root().querySelector('.prev');
		const next = root().querySelector('.next');

		expect(prev.classList.contains('active')).toBe(false);
		expect(next.classList.contains('active')).toBe(true);

		next.click();
		expect(text('.page')).toBe('Second page');
		expect(prev.classList.contains('active')).toBe(true);

		next.click();
		next.click();
		expect(text('.page')).toBe('Third page');
		expect(next.classList.contains('active')).toBe(false);

		prev.click();
		expect(text('.page')).toBe('Second page');
	});

	it('formats colour codes and line breaks', async () => {
		await TipBox.open(2);
		const span = root().querySelector('.page span');
		expect(span.style.color).toBe('rgb(59, 72, 140)');
		expect(text('.page')).toBe('Type /h.');
	});

	it('follows a link to another tip', async () => {
		await TipBox.open(1);
		const link = root().querySelector('.page .tipbox-link');
		expect(link.textContent).toBe('View Tip List');

		link.click();
		expect(TipBox.getState().tipId).toBe(1000);
		expect(text('.page')).toBe('First page');
	});

	it('opens the navigation for a place and the item window for an item', async () => {
		await TipBox.open(1001);

		root().querySelector('.page .navi-link').click();
		expect(navigation.setNaviInfo).toHaveBeenCalledWith('comodo,178,80,0,101,0', '[Philip]');

		root().querySelector('.page .item-link').click();
		expect(itemInfo.setItem).toHaveBeenCalledWith({ ITID: 512, IsIdentified: true });
	});

	it("shows a tip's picture, or the no-image picture without one", async () => {
		await TipBox.open(1);
		expect(loaded).toContain('data/texture/ui/tipbox/tip00001.bmp');

		loaded.length = 0;
		await TipBox.open(1000);
		expect(loaded).toContain('data/texture/ui/tipbox/img_noImage.bmp');
	});

	it("draws a tip's markers, twinkling every 300 ms", async () => {
		vi.useFakeTimers();
		try {
			await TipBox.open(2);
			const marker = root().querySelector('.effects img');
			expect(marker.src).toBe('data:data/texture/ui/tipbox/ico_effect3.bmp');
			expect(marker.style.left).toBe('100px');
			expect(marker.style.top).toBe('60px');

			vi.advanceTimersByTime(300);
			expect(marker.classList.contains('off')).toBe(true);
			vi.advanceTimersByTime(300);
			expect(marker.classList.contains('off')).toBe(false);
		} finally {
			vi.useRealTimers();
		}
	});

	it('lists the searchable tips whose title holds the text, and shows the one clicked', async () => {
		await TipBox.open(1);
		await TipBox.search('tip');

		const rows = [...root().querySelectorAll('.results .result')];
		expect(rows.map(row => row.textContent)).toEqual(['Tip Box', 'Tipbox: Info']);
		expect(root().querySelector('.TipBox').classList.contains('searching')).toBe(true);
		expect(root().querySelector('.search-text').value).toBe('');

		rows[1].click();
		expect(TipBox.getState().tipId).toBe(1000);
		expect(root().querySelector('.TipBox').classList.contains('searching')).toBe(false);
	});

	it('says when a search finds nothing, and leaves out hidden tips', async () => {
		await TipBox.open(1);
		loaded.length = 0;
		await TipBox.search('hidden');

		expect(root().querySelectorAll('.results .result')).toHaveLength(0);
		expect(loaded).toContain('data/texture/ui/tipbox/img_NoSearchResults.bmp');
	});

	it('does nothing for an empty search', async () => {
		await TipBox.open(1);
		await TipBox.search('  ');
		expect(TipBox.getState().searching).toBe(false);
	});

	it('searches on Enter in the search bar', async () => {
		await TipBox.open(1);
		const input = root().querySelector('.search-text');
		input.value = 'character';
		input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
		await Promise.resolve();
		await Promise.resolve();

		expect(TipBox.getState().results).toEqual([1001]);
	});

	it('toggles from the menu button and Alt+D', async () => {
		TipBox.toggle();
		await Promise.resolve();
		expect(TipBox.__active).toBe(true);

		TipBox.onShortCut({ cmd: 'TOGGLE' });
		expect(TipBox.__active).toBe(false);
	});

	it('closes on its Close button', async () => {
		await TipBox.open(1);
		root().querySelector('.close-button').click();
		expect(TipBox.__active).toBe(false);
	});
});

describe('Open on Startup', () => {
	it('is on by default, and the box turns it off', async () => {
		await TipBox.open(1);
		const box = root().querySelector('.startup .checkbox');
		expect(box.classList.contains('active')).toBe(true);

		root().querySelector('.startup').click();
		expect(box.classList.contains('active')).toBe(false);

		root().querySelector('.startup').click();
		expect(box.classList.contains('active')).toBe(true);
	});

	it('opens the window on the first map of a session, and not again', async () => {
		vi.spyOn(Math, 'random').mockReturnValue(0);
		await TipBox.openAtStartup();
		expect(TipBox.__active).toBe(true);
		expect(TipBox.getState().tipId).toBe(1);

		TipBox.remove();
		await TipBox.openAtStartup();
		expect(TipBox.__active).toBe(false);
	});
});
