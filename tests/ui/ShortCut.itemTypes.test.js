import { describe, expect, it, vi } from 'vitest';

// The official client's hotbar (UIShortCutWnd drop handler) only takes
// consumables, ammunition and gear that can be worn.
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

vi.mock('DB/DBManager.js', () => ({ default: { INTERFACE_PATH: '', UpdateOwnerName: {} } }));
vi.mock('DB/Skills/SkillInfo.js', () => ({ default: {} }));
vi.mock('Core/Client.js', () => ({ default: { loadFile: vi.fn() } }));
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
vi.mock('UI/Components/Inventory/Inventory.js', () => ({ default: { getItemById: vi.fn() } }));
vi.mock('UI/Components/SkillListMH/SkillListMH.js', () => ({ default: { homunculus: {}, mercenary: {} } }));
vi.mock('UI/Components/SkillDescription/SkillDescription.js', () => ({ default: {} }));
vi.mock('UI/Components/SkillTargetSelection/SkillTargetSelection.js', () => ({ default: {} }));
vi.mock('UI/Components/Guild/Guild.js', () => ({ default: {} }));
vi.mock('UI/Components/SkillList/SkillList.js', () => ({ default: {} }));
vi.mock('Preferences/ShortCutControls.js', () => ({ default: { ShortCuts: {} } }));

const { default: ShortCut } = await import('UI/Components/ShortCut/ShortCut.js');
const { default: ItemType } = await import('DB/Items/ItemType.js');

function fromInventory(item) {
	return ShortCut.fromDragData({ type: 'item', from: 'Inventory', data: { ITID: 501, ...item } });
}

describe('ShortCut.fromDragData from the inventory', () => {
	it.each([
		['healing', ItemType.HEALING],
		['usable', ItemType.USABLE],
		['delayed usable', ItemType.DELAYCONSUME],
		['ammunition', ItemType.AMMO]
	])('takes %s items', (_name, type) => {
		expect(fromInventory({ type })).toEqual({ isSkill: false, ID: 501, count: 0 });
	});

	it.each([
		['etc', ItemType.ETC],
		['card', ItemType.CARD],
		['pet egg', ItemType.PETEGG],
		['cash shop box', ItemType.CASH],
		['unknown kind', 9]
	])('refuses %s items', (_name, type) => {
		expect(fromInventory({ type })).toBeNull();
	});

	it.each([
		['armor', ItemType.ARMOR],
		['weapon', ItemType.WEAPON],
		['pet armor', ItemType.PETARMOR],
		['shadow gear', ItemType.SHADOWGEAR]
	])('takes %s that has an equip slot, and refuses it without one', (_name, type) => {
		expect(fromInventory({ type, location: 2 })).not.toBeNull();
		expect(fromInventory({ type, location: 0 })).toBeNull();
	});

	it('still takes skills and hotbar slots', () => {
		expect(ShortCut.fromDragData({ type: 'skill', from: 'SkillList', data: { SKID: 19, level: 5 } })).toEqual({
			isSkill: true,
			ID: 19,
			count: 5
		});
		expect(
			ShortCut.fromDragData({ type: 'item', from: 'ShortCut', data: { isSkill: false, ID: 501, count: 0 } })
		).toEqual({ isSkill: false, ID: 501, count: 0 });
	});
});
