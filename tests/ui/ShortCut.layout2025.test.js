import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

// kRO 2025 UIShortCutWnd: a frame every 33px, - and + buttons at the right of
// the last row, + past the last row hides the bar.
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
	return { MockGUIComponent };
});

vi.mock('DB/DBManager.js', () => ({ default: { INTERFACE_PATH: '', UpdateOwnerName: {}, getItemName: () => '' } }));
vi.mock('DB/Skills/SkillInfo.js', () => ({ default: { 19: { Name: 'mg_firebolt', SkillName: 'Fire Bolt' } } }));
vi.mock('Core/Client.js', () => ({ default: { loadFile: (path, cb) => cb(path.endsWith('shortcut_frame.bmp') ? 'frame.png' : 'icon.png') } }));
vi.mock('Core/Preferences.js', () => ({ default: { get: (_name, def) => ({ ...def, save: vi.fn() }) } }));
vi.mock('Core/Configs.js', () => ({ default: { get: (_k, d) => d } }));
vi.mock('Engine/SessionStorage.js', () => ({ default: {} }));
vi.mock('Renderer/Renderer.js', () => ({ default: { tick: 0, width: 1200, height: 800 } }));
vi.mock('Controls/MouseEventHandler.js', () => ({ default: { screen: { x: 0, y: 0 } } }));
vi.mock('Controls/KeyEventHandler.js', () => ({ default: { toReadableKey: k => String(k) } }));
vi.mock('Network/PacketVerManager.js', () => ({ default: { value: 20221005 } }));
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


function slots() {
	const list = [];
	for (let i = 0; i < 38; i++) {
		list.push({ isSkill: 0, ID: 0, count: 0 });
	}
	return list;
}

describe('ShortCut 2025 window', () => {
	let root;
	const click = selector => root.querySelector(selector).dispatchEvent(new MouseEvent('click', { bubbles: true }));
	const height = () => ShortCut._host.style.height;

	beforeAll(() => {
		root = ShortCut.getRoot();
		root.innerHTML = ShortCut.render();
		ShortCut.init();
		ShortCut.setList(slots());
	});

	beforeEach(() => {
		ShortCut.onShortCut({ cmd: 'EXTEND' });
		while (height() !== '34px') {
			ShortCut.onShortCut({ cmd: 'EXTEND' });
		}
	});

	it('uses the 2025 art when the client data has it', () => {
		expect(root.querySelector('#ShortCut').classList.contains('v2025')).toBe(true);
		expect(root.querySelector('.row').style.backgroundImage).toContain('frame.png');
		expect(ShortCut._host.style.width).toBe('290px');
		expect(root.querySelector('.container[data-index="12"]').style.getPropertyValue('--col')).toBe('3');
	});

	it('adds rows with +, 33px each, and hides the bar past the last one', () => {
		click('.btn-plus');
		expect(height()).toBe('67px');
		expect(root.querySelector('.btn-minus').style.top).toBe('38px');
		expect(root.querySelector('.btn-plus').style.top).toBe('53px');
		click('.btn-plus');
		click('.btn-plus');
		expect(height()).toBe('133px');
		expect(root.querySelector('.btn-plus').classList.contains('active')).toBe(true);
		click('.btn-plus');
		expect(height()).toBe('0px');
		ShortCut.onShortCut({ cmd: 'EXTEND' });
		expect(height()).toBe('34px');
	});

	it('removes rows with -, down to one', () => {
		expect(root.querySelector('.btn-minus').classList.contains('disabled')).toBe(true);
		click('.btn-plus');
		click('.btn-minus');
		expect(height()).toBe('34px');
		click('.btn-minus');
		expect(height()).toBe('34px');
	});
});
