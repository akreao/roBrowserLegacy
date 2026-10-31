/**
 * tests/ui/BigMap.test.js
 *
 * The memo map: projection of cells onto the 512 px map, and memo points that
 * the player places, names and deletes (up to 20 per map).
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import htmlText from 'UI/Components/BigMap/BigMap.html?raw';

const mocks = vi.hoisted(() => ({
	altitude: { width: 200, height: 100 },
	prompt: vi.fn(),
	navigation: { show: vi.fn(), setNaviInfo: vi.fn(), uid: null },
	npcs: {},
	data: { mapName: 'prontera', towninfo: [], party: [], guild: [], markers: [] },
	input: { append: vi.fn(), remove: vi.fn(), setType: vi.fn(), onSubmitRequest: null, root: null }
}));

vi.mock('UI/GUIComponent.js', () => ({
	default: class {
		constructor(name) {
			this.name = name;
			this._host = document.createElement('div');
			this._host.innerHTML = htmlText;
		}
		getRoot() {
			return this._host;
		}
		draggable() {}
		append() {
			this.__active = true;
			this.onAppend?.();
		}
		remove() {
			this.__active = false;
			this.onRemove?.();
		}
	}
}));
vi.mock('UI/UIManager.js', () => ({
	default: {
		addComponent: c => c,
		showPromptBox: mocks.prompt,
		getComponent: name => (name === 'Navigation' ? mocks.navigation : null)
	}
}));
vi.mock('Renderer/EntityManager.js', () => ({ default: { get: id => mocks.npcs[id] || null } }));
vi.mock('DB/DBManager.js', () => ({ default: { INTERFACE_PATH: '', getMessage: (_id, text) => text } }));
vi.mock('Core/Client.js', () => ({ default: { loadFile: vi.fn() } }));
vi.mock('Core/Preferences.js', () => ({ default: { get: (_key, def) => Object.assign(def, { save: vi.fn() }) } }));
vi.mock('Engine/SessionStorage.js', () => ({ default: { Entity: null } }));
vi.mock('Renderer/Renderer.js', () => ({ default: { width: 1200, height: 800, render: vi.fn(), stop: vi.fn() } }));
vi.mock('Renderer/Map/Altitude.js', () => ({ default: mocks.altitude }));
vi.mock('UI/Components/InputBox/InputBox.js', () => {
	const root = document.createElement('div');
	root.innerHTML = '<div class="text"></div>';
	mocks.input.getRoot = () => root;
	return { default: mocks.input };
});

HTMLCanvasElement.prototype.getContext = function () {
	return { clearRect() {}, drawImage() {}, fillRect() {}, beginPath() {}, arc() {}, fill() {}, stroke() {} };
};

const { default: BigMap, toCanvas, toCell, MAX_MEMOS } = await import('UI/Components/BigMap/BigMap.js');

BigMap.setSource(() => mocks.data);
BigMap.init();

function clickMap(px, py) {
	const canvas = BigMap.getRoot().querySelector('canvas');
	canvas.getBoundingClientRect = () => ({ left: 0, top: 0, width: 512, height: 512 });
	canvas.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: px, clientY: py }));
}

beforeEach(() => {
	for (const memo of BigMap.getMemos('prontera').slice()) {
		BigMap.removeMemo('prontera', 0);
	}
	mocks.prompt.mockReset();
	mocks.navigation.show.mockReset();
	mocks.navigation.setNaviInfo.mockReset();
	Object.assign(mocks.data, { towninfo: [], markers: [] });
});

describe('marks', () => {
	// cell 100,50 sits at 256,256 on the 512 map
	it('starts the navigation to a clicked facility', () => {
		mocks.data.towninfo = [{ Name: 'Kafra Employee', X: 100, Y: 50, Type: 6 }];
		clickMap(258, 255);
		expect(mocks.navigation.show).toHaveBeenCalled();
		expect(mocks.navigation.setNaviInfo).toHaveBeenCalledWith('prontera,100,50', 'Kafra Employee');
	});

	it('starts the navigation to a clicked quest NPC, by its name', () => {
		mocks.npcs[110] = { display: { name: 'Quest Giver' } };
		mocks.data.markers = [{ key: 110, x: 100, y: 50, color: 'rgb(255,0,0)' }];
		clickMap(256, 256);
		expect(mocks.navigation.setNaviInfo).toHaveBeenCalledWith('prontera,100,50', 'Quest Giver');
	});

	it('names the boss mark on hover and does nothing on click', () => {
		mocks.data.markers = [{ key: 'mvp', x: 100, y: 50, color: 'rgb(255,0,0)' }];
		clickMap(256, 256);
		expect(mocks.navigation.setNaviInfo).not.toHaveBeenCalled();
		const canvas = BigMap.getRoot().querySelector('canvas');
		canvas.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 256, clientY: 256 }));
		expect(BigMap.getRoot().querySelector('.memo-tip').textContent).toBe('Boss Monster');
	});

	it('lets a memo point win over a facility under it', () => {
		mocks.data.towninfo = [{ Name: 'Kafra Employee', X: 100, Y: 50, Type: 6 }];
		BigMap.addMemo('prontera', 100, 50, 'Kafra');
		clickMap(256, 256);
		expect(mocks.prompt).toHaveBeenCalled();
		expect(mocks.navigation.setNaviInfo).not.toHaveBeenCalled();
	});
});

describe('projection', () => {
	it('fits the longer side to 512 px and centres the other', () => {
		// 200 x 100 cells: 2.56 px per cell, the map 256 px tall in the middle
		expect(toCanvas(0, 0)).toEqual([0, 384]);
		expect(toCanvas(200, 100)).toEqual([512, 128]);
		expect(toCell(256, 256)).toEqual([100, 50]);
	});
});

describe('memo points', () => {
	it('places a named memo where the map is clicked in memo mode', () => {
		BigMap.getRoot().querySelector('.memo').click();
		clickMap(256, 256);
		expect(mocks.input.append).toHaveBeenCalled();
		expect(mocks.input.getRoot().querySelector('.text').textContent).toBe('Record content');
		mocks.input.onSubmitRequest('  Kafra   west  ');
		expect(BigMap.getMemos('prontera')).toEqual([{ x: 100, y: 50, text: 'Kafra west' }]);
	});

	it('asks before deleting a memo point clicked outside memo mode', () => {
		BigMap.addMemo('prontera', 100, 50, 'Kafra');
		clickMap(256, 256);
		const [text, , , onYes] = mocks.prompt.mock.calls[0];
		expect(text).toBe('Do you want to delete it?');
		onYes();
		expect(BigMap.getMemos('prontera')).toEqual([]);
	});

	it('places memo names in on-screen pixels when the map is drawn smaller', () => {
		BigMap.addMemo('prontera', 190, 50, 'Far east');
		const canvas = BigMap.getRoot().querySelector('canvas');
		canvas.getBoundingClientRect = () => ({ left: 0, top: 0, width: 256, height: 256 });
		const tip = BigMap.getRoot().querySelector('.memo-tip');
		Object.defineProperty(tip, 'offsetWidth', { configurable: true, value: 60 });
		// cell 190,50 is at 486,256 on the 512 map, 243,128 on screen
		canvas.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 243, clientY: 128 }));
		expect(tip.style.display).toBe('block');
		expect(tip.style.left).toBe('175px');
		expect(tip.style.top).toBe('120px');
	});

	it('ignores right-clicks on the map', () => {
		BigMap.addMemo('prontera', 100, 50, 'Kafra');
		const canvas = BigMap.getRoot().querySelector('canvas');
		canvas.getBoundingClientRect = () => ({ left: 0, top: 0, width: 512, height: 512 });
		canvas.dispatchEvent(new MouseEvent('click', { bubbles: true, button: 2, clientX: 256, clientY: 256 }));
		expect(mocks.prompt).not.toHaveBeenCalled();
	});

	it('keeps at most 20 per map and cuts the text to 30 characters', () => {
		for (let i = 0; i < MAX_MEMOS + 1; i++) {
			BigMap.addMemo('prontera', i + 1, 1, `memo ${i}`);
		}
		expect(BigMap.getMemos('prontera')).toHaveLength(20);
		BigMap.removeMemo('prontera', 0);
		BigMap.addMemo('prontera', 5, 5, 'x'.repeat(40));
		expect(BigMap.getMemos('prontera').at(-1).text).toHaveLength(30);
	});
});
