import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

// The official client's hotbar (UIShortCutWnd mouse move handler, msgstringtable
// 184 "%s %s: %d") shows an item's count after its name.
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
	return { MockGUIComponent, items: {} };
});

vi.mock('DB/DBManager.js', () => ({
	default: {
		INTERFACE_PATH: '',
		UpdateOwnerName: {},
		getItemName: item => item.name,
		getItemInfo: () => ({ identifiedResourceName: 'x' })
	}
}));
vi.mock('DB/Skills/SkillInfo.js', () => ({ default: { 19: { Name: 'mg_firebolt', SkillName: 'Fire Bolt' } } }));
vi.mock('Core/Client.js', () => ({ default: { loadFile: (_path, cb) => cb('icon.png') } }));
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
vi.mock('UI/Components/Inventory/Inventory.js', () => ({ default: { getItemById: id => mocks.items[id] } }));
vi.mock('UI/Components/SkillListMH/SkillListMH.js', () => ({ default: { homunculus: {}, mercenary: {} } }));
vi.mock('UI/Components/SkillDescription/SkillDescription.js', () => ({ default: {} }));
vi.mock('UI/Components/SkillTargetSelection/SkillTargetSelection.js', () => ({ default: {} }));
vi.mock('UI/Components/Guild/Guild.js', () => ({ default: {} }));
vi.mock('UI/Components/SkillList/SkillList.js', () => ({ default: { getSkillById: () => ({ level: 10 }) } }));
vi.mock('Preferences/ShortCutControls.js', () => ({ default: { ShortCuts: {} } }));

const { default: ShortCut } = await import('UI/Components/ShortCut/ShortCut.js');

const FIREBOLT = 19;

function slots() {
	const list = [];
	for (let i = 0; i < 38; i++) {
		list.push({ isSkill: 0, ID: 0, count: 0 });
	}
	return list;
}

describe('ShortCut item tooltip', () => {
	beforeAll(() => {
		ShortCut.getRoot().innerHTML = ShortCut.render();
		ShortCut.init();
	});

	beforeEach(() => {
		mocks.items[501] = { ITID: 501, name: 'Red Potion', count: 12, type: 0, IsIdentified: 1 };
		mocks.items[1201] = { ITID: 1201, name: 'Knife', count: 1, type: 5, IsIdentified: 1 };
		const list = slots();
		list[0] = { isSkill: 0, ID: 501, count: 0 };
		list[1] = { isSkill: 1, ID: FIREBOLT, count: 10 };
		list[2] = { isSkill: 0, ID: 1201, count: 0 };
		ShortCut.setList(list);
	});

	function tooltip(index) {
		return ShortCut.getRoot().querySelector(`.container[data-index="${index}"]`).getAttribute('data-tooltip');
	}

	it('puts the count after an item name, and keeps it current', () => {
		expect(tooltip(0)).toBe('Red Potion: 12');
		mocks.items[501].count = 7;
		ShortCut.setElement(false, 501, 7);
		expect(tooltip(0)).toBe('Red Potion: 7');
	});

	it('drops the item from the tooltip when the last one is gone', () => {
		mocks.items[501].count = 0;
		ShortCut.setElement(false, 501, 0);
		expect(tooltip(0)).toBeNull();
	});

	it('shows equipment as one', () => {
		expect(tooltip(2)).toBe('Knife: 1');
	});

	it('leaves skill names as they were', () => {
		expect(tooltip(1)).toBe('Fire Bolt');
	});

	it('keeps the count when the hotkeys are redrawn', () => {
		ShortCut.updateAllTooltips();
		expect(tooltip(0)).toBe('Red Potion: 12');
	});
});
