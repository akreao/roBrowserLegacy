import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

// The official client's hotbar (UIShortCutWnd drop handler) empties the slot a
// skill was dragged from when it is dropped on the bar away from any slot.
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
vi.mock('UI/Components/Inventory/Inventory.js', () => ({ default: { getItemById: () => null } }));
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

function drop(target, payload) {
	const event = new Event('drop', { bubbles: true, cancelable: true });
	event.dataTransfer = { getData: () => JSON.stringify(payload) };
	target.dispatchEvent(event);
}

describe('ShortCut drop away from a slot', () => {
	let root;

	beforeAll(() => {
		root = ShortCut.getRoot();
		root.innerHTML = ShortCut.render();
		ShortCut.init();
	});

	beforeEach(() => {
		const list = slots();
		list[3] = { isSkill: 1, ID: FIREBOLT, count: 10 };
		list[4] = { isSkill: 0, ID: 501, count: 0 };
		ShortCut.setList(list);
		ShortCut.onChange = vi.fn();
	});

	it('empties the slot a skill was dragged from', () => {
		drop(root.querySelector('.row .index'), {
			type: 'skill',
			from: 'ShortCut',
			index: 3,
			data: { isSkill: 1, ID: FIREBOLT, count: 10 }
		});

		expect(ShortCut.getList()[3]).toMatchObject({ isSkill: 0, ID: 0 });
		expect(ShortCut.onChange).toHaveBeenCalledWith(3, 0, 0, 0);
		expect(root.querySelector('.container[data-index="3"]').hasAttribute('data-tooltip')).toBe(false);
	});

	it('leaves an item dragged from the bar', () => {
		drop(root.querySelector('.row .index'), {
			type: 'item',
			from: 'ShortCut',
			index: 4,
			data: { isSkill: 0, ID: 501, count: 0 }
		});

		expect(ShortCut.getList()[4]).toMatchObject({ ID: 501 });
		expect(ShortCut.onChange).not.toHaveBeenCalled();
	});

	it('leaves the bar alone for a skill dragged from the skill window', () => {
		drop(root.querySelector('.row .index'), {
			type: 'skill',
			from: 'SkillList',
			data: { SKID: FIREBOLT, level: 10 }
		});

		expect(ShortCut.getList()[3]).toMatchObject({ ID: FIREBOLT });
		expect(ShortCut.onChange).not.toHaveBeenCalled();
	});

	it('moves a skill dropped on another slot instead of removing it', () => {
		drop(root.querySelector('.container[data-index="5"]'), {
			type: 'skill',
			from: 'ShortCut',
			index: 3,
			data: { isSkill: 1, ID: FIREBOLT, count: 10 }
		});

		expect(ShortCut.getList()[5]).toMatchObject({ ID: FIREBOLT, count: 10 });
		expect(ShortCut.getList()[3]).toMatchObject({ ID: 0 });
	});
});
