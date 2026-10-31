import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

// kRO 2025 UIShortCutWnd keeps two hotkey bars (ZC_SHORTCUT_KEY_LIST_V4 tab
// 0 / 1) and its "Switch Hotkey Bar" button redraws the slots from the other one.
const mocks = vi.hoisted(() => {
	class MockGUIComponent {
		constructor() {
			this._host = document.createElement('div');
			this.magnet = { TOP: false, BOTTOM: false, LEFT: false, RIGHT: false };
		}

		getRoot() {
			return this._host;
		}

		draggable() {
			return this;
		}
	}
	return { MockGUIComponent, packetver: { value: 20221005 } };
});

vi.mock('DB/DBManager.js', () => ({ default: { INTERFACE_PATH: '', UpdateOwnerName: {}, getMessage: (_id, def) => def, getItemName: () => '' } }));
vi.mock('DB/Skills/SkillInfo.js', () => ({ default: { 19: { Name: 'mg_firebolt', SkillName: 'Fire Bolt' } } }));
vi.mock('Core/Client.js', () => ({ default: { loadFile: (path, cb) => cb(path.endsWith('shortcut_frame.bmp') ? 'frame.png' : 'icon.png') } }));
vi.mock('Core/Preferences.js', () => ({ default: { get: (_name, def) => ({ ...def, save: vi.fn() }) } }));
vi.mock('Core/Configs.js', () => ({ default: { get: (_k, d) => d } }));
vi.mock('Engine/SessionStorage.js', () => ({ default: {} }));
vi.mock('Renderer/Renderer.js', () => ({ default: { tick: 0, width: 1200, height: 800 } }));
vi.mock('Controls/MouseEventHandler.js', () => ({ default: { screen: { x: 0, y: 0 } } }));
vi.mock('Controls/KeyEventHandler.js', () => ({ default: { toReadableKey: k => String(k) } }));
vi.mock('Network/PacketVerManager.js', () => ({ default: mocks.packetver }));
vi.mock('UI/UIManager.js', () => ({ default: { addComponent: component => component } }));
vi.mock('UI/GUIComponent.js', () => ({ default: mocks.MockGUIComponent }));
vi.mock('UI/Components/ItemInfo/ItemInfo.js', () => ({ default: {} }));
vi.mock('UI/Components/Inventory/Inventory.js', () => ({ default: { getItemById: () => null } }));
vi.mock('UI/Components/SkillListMH/SkillListMH.js', () => ({ default: { homunculus: {}, mercenary: {} } }));
vi.mock('UI/Components/SkillDescription/SkillDescription.js', () => ({ default: {} }));
vi.mock('UI/Components/SkillTargetSelection/SkillTargetSelection.js', () => ({ default: {} }));
vi.mock('UI/Components/Guild/Guild.js', () => ({ default: {} }));
vi.mock('UI/Components/SkillList/SkillList.js', () => ({ default: { getSkillById: () => ({ level: 10 }) } }));
vi.mock('Preferences/ShortCutControls.js', () => ({ default: { ShortCuts: {} } }));

const { default: ShortCut } = await import('UI/Components/ShortCut/ShortCut.js');

const FIREBOLT = 19;

function slots(fill) {
	const list = [];
	for (let i = 0; i < 38; i++) {
		list.push({ isSkill: 0, ID: 0, count: 0 });
	}
	Object.assign(list, fill);
	return list;
}

describe('ShortCut second hotkey bar', () => {
	let root;
	const slot = i => ShortCut.getRoot().querySelector(`.container[data-index="${i}"]`);

	beforeAll(() => {
		root = ShortCut.getRoot();
		root.innerHTML = ShortCut.render();
		ShortCut.init();
		ShortCut.onAppend();
	});

	beforeEach(() => {
		mocks.packetver.value = 20221005;
		ShortCut.setTab(0);
		ShortCut.setList(slots({ 0: { isSkill: 1, ID: FIREBOLT, count: 10 } }), 0);
		ShortCut.setList(slots({ 5: { isSkill: 1, ID: FIREBOLT, count: 3 } }), 1);
	});

	it('keeps the second bar out of sight until it is switched to', () => {
		expect(ShortCut.getTab()).toBe(0);
		expect(slot(0).querySelector('.icon')).not.toBeNull();
		expect(slot(5).querySelector('.icon')).toBeNull();
	});

	it('switches bars with the 1 / 2 button and back', () => {
		root.querySelector('.btn-bar').dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect(ShortCut.getTab()).toBe(1);
		expect(root.querySelector('.btn-bar').classList.contains('active')).toBe(true);
		expect(slot(0).querySelector('.icon')).toBeNull();
		expect(ShortCut.getList()[5]).toMatchObject({ ID: FIREBOLT });

		root.querySelector('.btn-bar').dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect(ShortCut.getTab()).toBe(0);
		expect(ShortCut.getList()[0]).toMatchObject({ ID: FIREBOLT });
	});

	it('keeps what was changed on a bar while the other one was shown', () => {
		ShortCut.addElement(8, true, FIREBOLT, 7);
		ShortCut.setTab(1);
		ShortCut.setTab(0);
		expect(ShortCut.getList()[8]).toMatchObject({ ID: FIREBOLT });
	});

	it('draws a list the server sends for the bar shown', () => {
		ShortCut.setTab(1);
		ShortCut.setList(slots({ 2: { isSkill: 1, ID: FIREBOLT, count: 1 } }), 1);
		expect(slot(2).querySelector('.icon')).not.toBeNull();
	});

	it('has one bar for servers older than the two-bar packets', () => {
		mocks.packetver.value = 20180704;
		ShortCut.setTab(1);
		expect(ShortCut.getTab()).toBe(0);
		expect(ShortCut.getList()[0]).toMatchObject({ ID: FIREBOLT });
	});
});
