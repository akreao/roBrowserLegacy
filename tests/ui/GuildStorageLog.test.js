import { describe, expect, it, vi } from 'vitest';

// The guild storage log window: All / In / Out tabs and ten rows a page, as
// the official UIGuild_Storage_Log draws them.
const mocks = vi.hoisted(() => {
	class MockGUIComponent {
		constructor(name) {
			this.name = name;
			this._host = document.createElement('div');
		}

		getRoot() {
			return this._host;
		}

		append() {}

		remove() {
			this.onRemove();
		}

		draggable() {}
	}

	return { MockGUIComponent };
});

vi.mock('DB/DBManager.js', () => ({
	default: {
		INTERFACE_PATH: '',
		getItemName: item => `Item ${item.ITID}`
	}
}));
vi.mock('Core/Client.js', () => ({ default: { loadFile: vi.fn() } }));
vi.mock('Core/Preferences.js', () => ({ default: { get: (_k, def) => ({ ...def, save: vi.fn() }) } }));
vi.mock('UI/Elements/Elements.js', () => ({}));
vi.mock('UI/GUIComponent.js', () => ({ default: mocks.MockGUIComponent }));
vi.mock('UI/UIManager.js', () => ({
	default: {
		addComponent(component) {
			component.getRoot().innerHTML = component.render();
			component.init();
			return component;
		}
	}
}));

const { default: GuildStorageLog } = await import('UI/Components/GuildStorageLog/GuildStorageLog.js');

function entries(count) {
	return Array.from({ length: count }, (_, i) => ({
		id: i,
		ITID: 500 + i,
		count: i + 1,
		action: i % 3 === 0 ? 0 : 1,
		name: `Member ${i}`,
		time: '2026-10-09 16:11:25',
		IsDamaged: i === 1 ? 1 : 0
	}));
}

function rows() {
	return [...GuildStorageLog.getRoot().querySelectorAll('.list .row')];
}

function page() {
	return GuildStorageLog.getRoot().querySelector('.page').textContent;
}

function click(selector) {
	GuildStorageLog.getRoot().querySelector(selector).click();
}

describe('guild storage log window', () => {
	it('shows the first ten entries of every tab', () => {
		GuildStorageLog.open(entries(25));

		expect(rows()).toHaveLength(10);
		expect(page()).toBe('01 / 03');
		const cells = [...rows()[1].querySelectorAll('span')].map(span => span.textContent);
		expect(cells).toEqual(['', 'Item 501', '2', 'Member 1', '2026-10-09 16:11:25']);
		expect(rows()[0].querySelector('.col-mark').getAttribute('data-mark')).toBe('out');
		expect(rows()[1].querySelector('.col-mark').getAttribute('data-mark')).toBe('in');
		expect(rows()[1].classList.contains('damaged')).toBe(true);
		expect(rows()[2].classList.contains('damaged')).toBe(false);
	});

	it('pages forward and back, and stops at either end', () => {
		GuildStorageLog.open(entries(25));

		click('.prev');
		expect(page()).toBe('01 / 03');
		click('.next');
		click('.next');
		click('.next');
		expect(page()).toBe('03 / 03');
		expect(rows()).toHaveLength(5);
		click('.prev');
		expect(page()).toBe('02 / 03');
	});

	it('lists what went in and what came out on their own tabs, from the first page', () => {
		GuildStorageLog.open(entries(25));
		click('.next');

		click('.tab[data-filter="1"]');
		expect(page()).toBe('01 / 02');
		expect(rows().every(row => row.querySelector('.col-mark').getAttribute('data-mark') === 'in')).toBe(true);

		click('.tab[data-filter="2"]');
		expect(page()).toBe('01 / 01');
		expect(rows()).toHaveLength(9);
		expect(GuildStorageLog.getRoot().querySelector('.tab.selected').getAttribute('data-filter')).toBe('2');
	});

	it('reads 01 / 01 on an empty tab', () => {
		GuildStorageLog.open([{ id: 1, ITID: 501, count: 1, action: 1, name: 'A', time: 'T' }]);
		click('.tab[data-filter="2"]');

		expect(rows()).toHaveLength(0);
		expect(page()).toBe('01 / 01');
	});
});
