import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

// kRO 2025 UIShortCutWnd: Ctrl+F12 shifts the rows of the bar shown by one
// (fcn.00d83c80 adds shift * 9 to the slot, wrapping at 36), and the server
// keeps the shift (CZ_SHORTCUTKEYBAR_ROTATE, the rotate byte of the hotkey list).
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

describe('ShortCut row shift', () => {
	beforeAll(() => {
		ShortCut.getRoot().innerHTML = ShortCut.render();
		ShortCut.init();
		ShortCut.onAppend();
	});

	beforeEach(() => {
		mocks.packetver.value = 20221005;
		ShortCut.setTab(0);
		ShortCut.onRotate = vi.fn();
	});

	it('shows the bar from the row the server says', () => {
		ShortCut.setList(slots({ 9: { isSkill: 1, ID: FIREBOLT, count: 10 }, 37: { isSkill: 1, ID: FIREBOLT, count: 1 } }), 0, 1);
		expect(ShortCut.getList()[0]).toMatchObject({ ID: FIREBOLT });
		expect(ShortCut.getList()[27]).toMatchObject({ ID: 0 });
		expect(ShortCut.toServerIndex(0)).toBe(9);
		expect(ShortCut.toServerIndex(27)).toBe(0);
		expect(ShortCut.toServerIndex(37)).toBe(37);
	});

	it('shifts by one row on Ctrl+F12, wraps after four, and tells the server', () => {
		ShortCut.setList(slots({ 9: { isSkill: 1, ID: FIREBOLT, count: 10 } }), 0, 0);
		expect(ShortCut.getList()[9]).toMatchObject({ ID: FIREBOLT });

		ShortCut.onShortCut({ cmd: 'ROTATE' });
		expect(ShortCut.getList()[0]).toMatchObject({ ID: FIREBOLT });
		expect(ShortCut.onRotate).toHaveBeenLastCalledWith(0, 1);

		ShortCut.rotate();
		ShortCut.rotate();
		expect(ShortCut.getList()[18]).toMatchObject({ ID: FIREBOLT });
		ShortCut.rotate();
		expect(ShortCut.getList()[9]).toMatchObject({ ID: FIREBOLT });
		expect(ShortCut.onRotate).toHaveBeenLastCalledWith(0, 0);
	});

	it('keeps a slot changed while shifted at its place in the list', () => {
		ShortCut.setList(slots(), 0, 1);
		ShortCut.addElement(2, true, FIREBOLT, 10);
		expect(ShortCut.toServerIndex(2)).toBe(11);
		ShortCut.rotate();
		ShortCut.rotate();
		ShortCut.rotate();
		expect(ShortCut.getList()[11]).toMatchObject({ ID: FIREBOLT });
	});

	it('keeps a shift for each bar', () => {
		ShortCut.setList(slots({ 9: { isSkill: 1, ID: FIREBOLT, count: 10 } }), 0, 1);
		ShortCut.setList(slots({ 9: { isSkill: 1, ID: FIREBOLT, count: 10 } }), 1, 0);
		ShortCut.setTab(1);
		expect(ShortCut.getList()[9]).toMatchObject({ ID: FIREBOLT });
		ShortCut.rotate();
		expect(ShortCut.onRotate).toHaveBeenLastCalledWith(1, 1);
		ShortCut.setTab(0);
		expect(ShortCut.getList()[0]).toMatchObject({ ID: FIREBOLT });
	});
});
