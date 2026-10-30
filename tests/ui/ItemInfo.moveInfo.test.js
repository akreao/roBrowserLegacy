/**
 * Transfer restrictions in the item description window, as the official
 * client shows them: a link under the description that, clicked, opens a
 * small box beside the cursor listing what can't be done with the item
 * (data/ItemMoveInfoV5.txt). The fork's earlier version opened its box on
 * hover, outside the window's styles, so it never showed.
 */
import { beforeAll, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
	class MockGUIComponent {
		constructor(name) {
			this.name = name;
			this._host = document.createElement('div');
			this.ui = { show: vi.fn(), hide: vi.fn(), is: vi.fn(() => true) };
		}
		getRoot() {
			return this._host;
		}
		draggable() {}
		focus() {}
	}
	return { MockGUIComponent, setType: vi.fn() };
});

const messages = {
	2788: 'Cannot be dropped',
	2789: 'Cannot be stored',
	2790: 'Cannot be put in a cart',
	2791: 'Cannot be mailed',
	2792: 'Cannot be traded',
	2793: 'Cannot be auctioned',
	2794: 'Cannot be put in guild storage',
	2795: 'Cannot be sold to NPCs',
	2796: 'Transfer restrictions'
};

const all = {
	Drop: true,
	Exchange: true,
	Storage: true,
	Cart: true,
	NPCSale: true,
	Mail: true,
	Auction: true,
	GuildStorage: true
};
const none = Object.fromEntries(Object.keys(all).map(key => [key, false]));

const items = {
	1: { identifiedDescriptionName: 'Bound', moveInfo: all },
	2: { identifiedDescriptionName: 'Tradeable' },
	3: { identifiedDescriptionName: 'Only the auction', moveInfo: { ...none, Auction: true } },
	4: { identifiedDescriptionName: 'Two', moveInfo: { ...none, NPCSale: true, Exchange: true } }
};

// Anything else the window asks the DB for answers empty.
vi.mock('DB/DBManager.js', () => ({
	default: new Proxy(
		{
			INTERFACE_PATH: '',
			getItemInfo: id => items[id],
			getMessage: id => messages[id],
			isPetEgg: () => false,
			formatMsgToHtml: s => s,
			formatDescriptionTags: s => s
		},
		{ get: (target, key) => (key in target ? target[key] : () => '') }
	)
}));
vi.mock('Core/Client.js', () => ({ default: { loadFile() {} } }));
vi.mock('UI/GUIComponent.js', () => ({ default: mocks.MockGUIComponent }));
vi.mock('UI/UIManager.js', () => ({
	default: {
		addComponent(component) {
			component.getRoot().innerHTML = component.render();
			return component;
		}
	}
}));
vi.mock('Network/NetworkManager.js', () => ({ default: { sendPacket: vi.fn(), hookPacket: vi.fn() } }));
vi.mock('Network/PacketStructure.js', () => ({ default: { CZ: {}, ZC: {} } }));
vi.mock('UI/Components/CardIllustration/CardIllustration.js', () => ({ default: {} }));
vi.mock('UI/Components/ItemCompare/ItemCompare.js', () => ({ default: {} }));
vi.mock('UI/Components/ItemPreview/ItemPreview.js', () => ({ default: {} }));
vi.mock('UI/Components/MakeReadBook/MakeReadBook.js', () => ({ default: {} }));
vi.mock('UI/Components/Equipment/Equipment.js', () => ({ default: {} }));
vi.mock('UI/Components/Inventory/Inventory.js', () => ({ default: {} }));
vi.mock('UI/Components/Navigation/Navigation.js', () => ({ default: {} }));
vi.mock('Renderer/Renderer.js', () => ({ default: { render: vi.fn(), stop: vi.fn() } }));
vi.mock('Renderer/SpriteRenderer.js', () => ({ default: {} }));
vi.mock('Renderer/Entity/Entity.js', () => ({ default: function Entity() {} }));
vi.mock('Loaders/Sprite.js', () => ({ default: {} }));
vi.mock('Loaders/Action.js', () => ({ default: {} }));
vi.mock('UI/CursorManager.js', () => ({
	default: { ACTION: { DEFAULT: 0, CLICK: 1 }, setType: mocks.setType }
}));
vi.mock('UI/Elements/Elements.js', () => ({}));

const { default: ItemInfo } = await import('UI/Components/ItemInfo/ItemInfo.js');

const root = () => ItemInfo.getRoot();
const link = () => root().querySelector('.moveinfo-label');
const box = () => root().querySelector('.moveinfo-box');
const lines = () => [...box().children].map(line => line.textContent);
const show = ITID => ItemInfo.setItem({ ITID, IsIdentified: true, type: 3 });
const click = (target, clientX = 300, clientY = 120) =>
	target.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX, clientY }));

beforeAll(() => {
	ItemInfo.init();
	// The window sits at (200, 100) on screen.
	ItemInfo._host.getBoundingClientRect = () => ({ left: 200, top: 100, right: 480, bottom: 240 });
});

describe('the transfer restrictions link', () => {
	it('is under the description of an item that has restrictions', () => {
		show(1);
		expect(link().textContent).toBe('Transfer restrictions');
		expect(link().parentElement.classList.contains('description-inner')).toBe(true);
		expect(box().style.display).not.toBe('block');
	});

	it('is not there for an item without restrictions', () => {
		show(2);
		expect(link()).toBeNull();
	});

	it('is not there when the only restriction is one the client never lists (auction)', () => {
		show(3);
		expect(link()).toBeNull();
	});

	it('turns the cursor into a hand while hovered', () => {
		show(1);
		mocks.setType.mockClear();
		link().dispatchEvent(new MouseEvent('mouseenter'));
		expect(mocks.setType).toHaveBeenLastCalledWith(1);
		link().dispatchEvent(new MouseEvent('mouseleave'));
		expect(mocks.setType).toHaveBeenLastCalledWith(0);
	});
});

describe('clicking the link', () => {
	it("lists the item's restrictions in the official client's order, without auction", () => {
		show(1);
		click(link());
		expect(box().style.display).toBe('block');
		expect(lines()).toEqual([
			'Cannot be dropped',
			'Cannot be stored',
			'Cannot be put in a cart',
			'Cannot be mailed',
			'Cannot be traded',
			'Cannot be put in guild storage',
			'Cannot be sold to NPCs'
		]);
	});

	it('lists only the restrictions this item has', () => {
		show(4);
		click(link());
		expect(lines()).toEqual(['Cannot be traded', 'Cannot be sold to NPCs']);
	});

	it('opens the box 26px right of the cursor, level with it', () => {
		show(1);
		click(link(), 300, 120);
		expect(box().style.left).toBe('126px');
		expect(box().style.top).toBe('20px');
	});

	it('again moves the one box rather than opening another', () => {
		show(1);
		click(link(), 300, 120);
		click(link(), 320, 140);
		expect(root().querySelectorAll('.moveinfo-box')).toHaveLength(1);
		expect(box().style.left).toBe('146px');
		expect(lines()).toHaveLength(7);
	});

	it('keeps the box beside the cursor when the window is drawn scaled', () => {
		show(1);
		ItemInfo.scale = 2;
		try {
			click(link(), 300, 120);
			// (100 + 26) / 2: still 26 screen pixels right of the cursor
			expect(box().style.left).toBe('63px');
			expect(box().style.top).toBe('10px');
		} finally {
			delete ItemInfo.scale;
		}
	});

	it('keeps the box on screen when it would spill past the right or bottom edge', () => {
		show(1);
		// The box would end 40px past the right edge and 10px past the bottom.
		box().getBoundingClientRect = () => ({
			left: window.innerWidth - 160,
			top: window.innerHeight - 90,
			right: window.innerWidth + 40,
			bottom: window.innerHeight + 10
		});
		try {
			click(link(), 300, 120);
			expect(box().style.left).toBe('86px');
			expect(box().style.top).toBe('10px');
		} finally {
			delete box().getBoundingClientRect;
		}
	});
});

describe('the restrictions box', () => {
	it('closes when clicked', () => {
		show(1);
		click(link());
		click(box());
		expect(box().style.display).toBe('none');
	});

	it('closes when the window shows another item', () => {
		show(1);
		click(link());
		show(4);
		expect(box().style.display).toBe('none');
	});

	it('closes with the window', () => {
		show(1);
		click(link());
		ItemInfo.onRemove();
		expect(box().style.display).toBe('none');
	});

	it('shows the messages as text, not markup', () => {
		messages[2788] = '<b>Cannot</b> be dropped';
		try {
			show(1);
			click(link());
			expect(box().children[0].textContent).toBe('<b>Cannot</b> be dropped');
			expect(box().querySelector('b')).toBeNull();
		} finally {
			messages[2788] = 'Cannot be dropped';
		}
	});
});
