/**
 * tests/ui/SwitchEquip.render.test.js
 *
 * The swap window's character preview draws only while the window shows,
 * and keeps one character instead of making one each frame.
 */
import { beforeEach, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
	sendPacket: vi.fn(),
	session: { Entity: { GID: 150001, job: 4252, sex: 1, head: 2, headpalette: 0, bodypalette: 0 } },
	entities: [],
	inventory: { equipswitchlist: [] },
	rendered: 0
}));

vi.mock('UI/GUIComponent.js', () => ({
	default: class {
		constructor(name) {
			this.name = name;
			this._host = document.createElement('div');
		}
		getRoot() {
			return this._host;
		}
	}
}));
vi.mock('UI/UIManager.js', () => ({
	default: {
		addComponent(component) {
			component.getRoot().innerHTML = component.render();
			return component;
		}
	}
}));
vi.mock('DB/DBManager.js', () => ({
	default: { INTERFACE_PATH: '', getItemInfo: () => ({}), getItemName: () => 'Sword', getMessage: () => '' }
}));
vi.mock('Network/NetworkManager.js', () => ({ default: { sendPacket: mocks.sendPacket } }));
vi.mock('Network/PacketVerManager.js', () => ({ default: { value: 20220000 } }));
vi.mock('Core/Client.js', () => ({ default: { loadFile: vi.fn() } }));
vi.mock('Engine/SessionStorage.js', () => ({ default: mocks.session }));
vi.mock('Renderer/Renderer.js', () => ({ default: { render: vi.fn(), stop: vi.fn() } }));
vi.mock('Renderer/Camera.js', () => ({ default: {} }));
vi.mock('Renderer/SpriteRenderer.js', () => ({ default: { bind2DContext() {} } }));
vi.mock('Renderer/Entity/Entity.js', () => ({
	default: class {
		static TYPE_PC = 0;
		constructor() {
			this.effectColor = new Float32Array(4);
			this.ACTION = { IDLE: 0 };
			mocks.entities.push(this);
		}
		set(data) {
			Object.assign(this, data);
		}
		renderEntity() {
			mocks.rendered++;
		}
	}
}));
vi.mock('UI/Components/ItemInfo/ItemInfo.js', () => ({ default: {} }));
vi.mock('UI/Components/Equipment/Equipment.js', () => ({ default: { getCurrentTabId: () => 'general' } }));
vi.mock('UI/Components/Inventory/Inventory.js', () => ({ default: mocks.inventory }));

HTMLCanvasElement.prototype.getContext = function () {
	return { canvas: this, clearRect() {} };
};

const { default: SwitchEquip } = await import('UI/Components/SwitchEquip/SwitchEquip.js');
const { default: Renderer } = await import('Renderer/Renderer.js');

SwitchEquip.init();
document.body.appendChild(SwitchEquip.getRoot());

// The preview's per-frame function, as the window hands it to the renderer
SwitchEquip._host.style.display = 'none';
SwitchEquip.focus = () => {};
SwitchEquip.toggle();
const frame = Renderer.render.mock.calls[0][0];

beforeEach(() => {
	mocks.entities.length = 0;
	mocks.rendered = 0;
	mocks.session.Entity.job = 4252;
	mocks.inventory.equipswitchlist = [];
});

it('draws nothing while the window is hidden', () => {
	// Equipment hides the window by its style, leaving the render running
	SwitchEquip._host.style.display = 'none';
	frame();
	frame();
	expect(mocks.entities.length).toBe(0);
	expect(mocks.rendered).toBe(0);
	SwitchEquip._host.style.display = '';
});

it('keeps one character across frames until the look changes', () => {
	frame();
	frame();
	frame();
	expect(mocks.entities.length).toBeLessThanOrEqual(1);
	expect(mocks.rendered).toBe(6);

	mocks.session.Entity.job = 4253;
	frame();
	expect(mocks.entities.at(-1).job).toBe(4253);
});

it('draws nothing while a parent window hides it', () => {
	SwitchEquip._host.checkVisibility = () => false;
	frame();
	expect(mocks.rendered).toBe(0);
	delete SwitchEquip._host.checkVisibility;
	frame();
	expect(mocks.rendered).toBe(2);
});

it("starts a fresh character when the set's gear changes", () => {
	frame();
	const first = mocks.entities.at(-1);
	frame();
	expect(mocks.entities.at(-1)).toBe(first);

	// A headgear (HEAD_TOP, 256) put in the set
	mocks.inventory.equipswitchlist = [{ location: 256, wItemSpriteNumber: 17 }];
	frame();
	const second = mocks.entities.at(-1);
	expect(second).not.toBe(first);
	expect(second.accessory2).toBe(17);

	// and taken out again: no sprite of it left on the character drawn
	mocks.inventory.equipswitchlist = [];
	frame();
	expect(mocks.entities.at(-1)).not.toBe(second);
	expect(mocks.entities.at(-1).accessory2).toBe(0);
});
