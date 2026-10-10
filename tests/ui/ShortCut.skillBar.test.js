import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
	class MockGUIComponent {
		constructor(name) {
			this.name = name;
			this._host = document.createElement('div');
			this.magnet = {};
			this.scale = 1;
		}

		getRoot() {
			return this._host;
		}

		draggable() {}

		prepare() {}
	}

	const items = {
		501: { ITID: 501, count: 7, IsIdentified: true }
	};

	return {
		MockGUIComponent,
		items,
		preferences: { x: 0, y: 0, size: 1, skillbar: 0, save: vi.fn() },
		packetver: { value: 20221005 },
		config: { enableRenewalShortCut: true }
	};
});

vi.mock('DB/DBManager.js', () => ({
	default: {
		INTERFACE_PATH: 'data/texture/',
		UpdateOwnerName: {},
		getMessage: id => `msg${id}`,
		getItemInfo: () => ({ identifiedResourceName: 'red_potion' }),
		getItemName: item => `item${item.ITID}`
	}
}));
vi.mock('DB/Items/ItemType.js', () => ({ default: { WEAPON: 4, ARMOR: 5, SHADOWGEAR: 12 } }));
vi.mock('DB/Skills/SkillInfo.js', () => ({ default: { 28: { Name: 'al_heal', SkillName: 'Heal' } } }));
vi.mock('DB/Skills/SkillConst.js', () => ({ default: {} }));
vi.mock('Core/Client.js', () => ({
	default: {
		loadFile(_path, callback) {
			callback?.('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBA==');
		}
	}
}));
vi.mock('Core/Preferences.js', () => ({ default: { get: () => mocks.preferences } }));
vi.mock('Core/Configs.js', () => ({ default: { get: (key, def) => (key in mocks.config ? mocks.config[key] : def) } }));
vi.mock('Engine/SessionStorage.js', () => ({ default: {} }));
vi.mock('Renderer/Renderer.js', () => ({ default: { width: 1200, height: 800, tick: 0 } }));
vi.mock('Network/PacketVerManager.js', () => ({ default: mocks.packetver }));
vi.mock('UI/GUIComponent.js', () => ({ default: mocks.MockGUIComponent }));
vi.mock('UI/UIManager.js', () => ({
	default: {
		addComponent(component) {
			component.prepare();
			component.getRoot().innerHTML = component.render();
			component.init();
			return component;
		}
	}
}));
vi.mock('UI/Components/ItemInfo/ItemInfo.js', () => ({ default: {} }));
vi.mock('UI/Components/Inventory/Inventory.js', () => ({
	default: { getUI: () => ({ getItemById: id => mocks.items[id] }) }
}));
vi.mock('UI/Components/SkillListMH/SkillListMH.js', () => ({
	default: { mercenary: {}, homunculus: {} }
}));
vi.mock('UI/Components/SkillDescription/SkillDescription.js', () => ({ default: {} }));
vi.mock('UI/Components/SkillTargetSelection/SkillTargetSelection.js', () => ({ default: { remove: vi.fn() } }));
vi.mock('UI/Components/Guild/Guild.js', () => ({ default: {} }));
vi.mock('UI/Components/SkillList/SkillList.js', () => ({
	default: { getUI: () => ({ getSkillById: id => (id === 28 ? { level: 10 } : null) }) }
}));
vi.mock('Preferences/ShortCutControls.js', () => ({ default: { ShortCuts: {} } }));
vi.mock('Controls/KeyEventHandler.js', () => ({ default: { toReadableKey: key => String(key) } }));

let ShortCut = (await import('UI/Components/ShortCut/ShortCut.js')).default;

const root = () => ShortCut.getRoot();
const slot = index => root().querySelector(`.container[data-index="${index}"]`);
const click = selector => root().querySelector(selector).dispatchEvent(new MouseEvent('click'));
const empty = () => Array.from({ length: 38 }, () => ({ isSkill: 0, ID: 0, count: 0 }));

function list(index, entry) {
	const out = empty();
	out[index] = entry;
	return out;
}

describe('ShortCut renewal hotbar', () => {
	beforeEach(() => {
		mocks.preferences.size = 1;
		mocks.preferences.skillbar = 0;
		ShortCut.clean();
		ShortCut.onAppend();
	});

	it('keeps the second skill bar until the switch shows it', () => {
		ShortCut.setList(list(0, { isSkill: 0, ID: 501, count: 0 }), 0);
		ShortCut.setList(list(0, { isSkill: 1, ID: 28, count: 5 }), 1);

		expect(slot(0).getAttribute('data-tooltip')).toBe('item501');
		expect(ShortCut.getSkillBar()).toBe(0);

		click('.skillbar');

		expect(ShortCut.getSkillBar()).toBe(1);
		expect(mocks.preferences.skillbar).toBe(1);
		expect(root().querySelector('.skillbar').classList.contains('active')).toBe(true);
		expect(slot(0).getAttribute('data-tooltip')).toBe('Heal');
		expect(slot(0).querySelector('.amount').textContent).toBe('5');

		click('.skillbar');

		expect(ShortCut.getSkillBar()).toBe(0);
		expect(slot(0).getAttribute('data-tooltip')).toBe('item501');
		expect(slot(0).querySelector('.amount').textContent).toBe('7');
	});

	it('shows the saved skill bar when appended', () => {
		ShortCut.setList(list(3, { isSkill: 1, ID: 28, count: 2 }), 1);
		mocks.preferences.skillbar = 1;
		ShortCut.onAppend();

		expect(ShortCut.getSkillBar()).toBe(1);
		expect(slot(3).getAttribute('data-tooltip')).toBe('Heal');
	});

	it('adds and removes rows with the plus and minus buttons', () => {
		ShortCut.setList(empty(), 0);
		const host = ShortCut._host;
		const minus = root().querySelector('.minus');
		const plus = root().querySelector('.plus');

		expect(host.style.height).toBe('33px');
		expect(minus.classList.contains('hide')).toBe(true);

		click('.plus');
		click('.plus');
		click('.plus');

		expect(host.style.height).toBe('132px');
		expect(mocks.preferences.size).toBe(4);
		expect(minus.classList.contains('hide')).toBe(false);
		expect(plus.classList.contains('active')).toBe(true);

		click('.minus');

		expect(host.style.height).toBe('99px');
		expect(plus.classList.contains('active')).toBe(false);
	});

	it('hides the bar on F12 after the fourth row', () => {
		ShortCut.setList(empty(), 0);
		const host = ShortCut._host;

		['66px', '99px', '132px', '0px', '33px'].forEach(height => {
			ShortCut.onShortCut({ cmd: 'EXTEND' });
			expect(host.style.height).toBe(height);
		});
	});
});

describe('ShortCut classic hotbar (enableRenewalShortCut off)', () => {
	beforeEach(async () => {
		mocks.config.enableRenewalShortCut = false;
		mocks.preferences.size = 1;
		mocks.preferences.skillbar = 1;
		vi.resetModules();
		ShortCut = (await import('UI/Components/ShortCut/ShortCut.js')).default;
		ShortCut.onAppend();
	});

	it('keeps the close button, the resize handle and the 34 px rows', () => {
		expect(root().querySelector('.close')).not.toBeNull();
		expect(root().querySelector('.resize')).not.toBeNull();
		expect(root().querySelector('.skillbar')).toBeNull();
		expect(ShortCut._host.style.height).toBe('34px');

		click('.close');

		expect(ShortCut._host.style.height).toBe('0px');
	});

	it('shows skill bar 1 whatever the saved choice', () => {
		ShortCut.setList(list(0, { isSkill: 0, ID: 501, count: 0 }), 0);
		ShortCut.setList(list(0, { isSkill: 1, ID: 28, count: 5 }), 1);

		expect(ShortCut.getSkillBar()).toBe(0);
		expect(slot(0).getAttribute('data-tooltip')).toBe('item501');
	});
});
