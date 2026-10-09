import { beforeEach, describe, expect, it, vi } from 'vitest';

// The merge window: ticking stacks, Ctrl+click, the two-stack minimum and the
// cell grid, with GUIComponent stubbed.
const mocks = vi.hoisted(() => {
	class MockGUIComponent {
		constructor(name) {
			this.name = name;
			this._host = document.createElement('div');
			this.__active = false;
		}

		getRoot() {
			return this._host;
		}

		append() {
			this.__active = true;
			this.onAppend();
		}

		remove() {
			this.__active = false;
			this.onRemove();
		}

		draggable() {}
	}
	MockGUIComponent.MouseMode = { STOP: 1 };

	// index -> item; 2 and 5 are Red Potions, 7 an Apple
	const items = {
		2: { index: 2, ITID: 501, count: 10, IsIdentified: true },
		5: { index: 5, ITID: 501, count: 4, IsIdentified: true },
		7: { index: 7, ITID: 512, count: 3, IsIdentified: true }
	};

	return { MockGUIComponent, items };
});

vi.mock('DB/DBManager.js', () => ({
	default: {
		INTERFACE_PATH: '',
		getMessage: (id, text) => text,
		getItemInfo: () => ({ identifiedResourceName: 'r', unidentifiedResourceName: 'r' }),
		getItemName: item => String(item.ITID)
	}
}));
vi.mock('Core/Client.js', () => ({ default: { loadFile: vi.fn() } }));
vi.mock('Core/Preferences.js', () => ({ default: { get: (_k, def) => ({ ...def, save: vi.fn() }) } }));
vi.mock('Controls/KeyEventHandler.js', () => ({ default: { ESCAPE: 27 } }));
vi.mock('UI/Elements/Elements.js', () => ({}));
vi.mock('UI/GUIComponent.js', () => ({ default: mocks.MockGUIComponent }));
vi.mock('UI/Components/Inventory/Inventory.js', () => ({
	default: { getUI: () => ({ getItemByIndex: index => mocks.items[index] }) }
}));
vi.mock('UI/UIManager.js', () => ({
	default: {
		addComponent(component) {
			component.getRoot().innerHTML = component.render();
			component.init();
			return component;
		}
	}
}));

const { default: MergeItem } = await import('UI/Components/MergeItem/MergeItem.js');

function click(index, ctrlKey = false) {
	MergeItem.getRoot()
		.querySelector(`.cell[data-index="${index}"]`)
		.dispatchEvent(new MouseEvent('click', { bubbles: true, ctrlKey }));
}

describe('Merge window', () => {
	beforeEach(() => {
		MergeItem.onMerge = vi.fn();
		MergeItem.onCancel = vi.fn();
		MergeItem.onError = vi.fn();
		MergeItem.open([2, 5, 7]);
	});

	it('draws a cell per stack, five to a row', () => {
		const cells = [...MergeItem.getRoot().querySelectorAll('.cell')];

		expect(cells.map(cell => cell.dataset.index)).toEqual(['2', '5', '7']);
		expect(cells[2].style.left).toBe('70px');
		expect(MergeItem._host.style.width).toBe('195px');
		expect(MergeItem._host.style.height).toBe('155px');
	});

	it('ticks and unticks a stack on click', () => {
		click(2);
		click(7);
		expect(MergeItem.getSelected()).toEqual([2, 7]);

		click(7);
		expect(MergeItem.getSelected()).toEqual([2]);
	});

	it('ticks every stack of an item with Ctrl, and unticks the others', () => {
		click(7);
		click(5, true);

		expect(MergeItem.getSelected()).toEqual([2, 5]);
	});

	it('needs two stacks to merge', () => {
		click(2);
		MergeItem.getRoot().querySelector('.ok').dispatchEvent(new MouseEvent('click'));

		expect(MergeItem.onError).toHaveBeenCalledWith('Select the items to merge.');
		expect(MergeItem.onMerge).not.toHaveBeenCalled();

		click(5);
		MergeItem.getRoot().querySelector('.ok').dispatchEvent(new MouseEvent('click'));

		expect(MergeItem.onMerge).toHaveBeenCalledWith([2, 5]);
	});

	it('closes and tells the server on cancel', () => {
		MergeItem.getRoot().querySelector('.cancel').dispatchEvent(new MouseEvent('click'));

		expect(MergeItem.__active).toBe(false);
		expect(MergeItem.onCancel).toHaveBeenCalledTimes(1);
	});
});
