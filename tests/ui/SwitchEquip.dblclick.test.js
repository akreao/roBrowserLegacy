/**
 * tests/ui/SwitchEquip.dblclick.test.js
 *
 * Double-clicking an item of the swap window takes it out of the set;
 * Ctrl+double-click wears that one item (0x0ace), as in the official client.
 */
import { expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ sendPacket: vi.fn() }));

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
vi.mock('Engine/SessionStorage.js', () => ({ default: {} }));
vi.mock('Renderer/Renderer.js', () => ({ default: { render: vi.fn(), stop: vi.fn() } }));
vi.mock('Renderer/Camera.js', () => ({ default: {} }));
vi.mock('Renderer/SpriteRenderer.js', () => ({ default: {} }));
vi.mock('Renderer/Entity/Entity.js', () => ({ default: class {} }));
vi.mock('UI/Components/ItemInfo/ItemInfo.js', () => ({ default: {} }));
vi.mock('UI/Components/Equipment/Equipment.js', () => ({ default: { getCurrentTabId: () => 'general' } }));
vi.mock('UI/Components/Inventory/Inventory.js', () => ({ default: {} }));

HTMLCanvasElement.prototype.getContext = function () {
	return { canvas: this, clearRect() {} };
};

const { default: SwitchEquip } = await import('UI/Components/SwitchEquip/SwitchEquip.js');
const { default: PACKET } = await import('Network/PacketStructure.js');

it('removes on double-click and wears the one item on Ctrl+double-click', () => {
	SwitchEquip.init();
	SwitchEquip.onRemoveSwitchEquip = vi.fn();
	SwitchEquip.equip({ index: 9, ITID: 1101 }, 2, true);
	const item = SwitchEquip.getRoot().querySelector('.item[data-index="9"]');

	item.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
	expect(SwitchEquip.onRemoveSwitchEquip).toHaveBeenCalledWith(9);
	expect(mocks.sendPacket).not.toHaveBeenCalled();

	item.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, ctrlKey: true }));
	expect(SwitchEquip.onRemoveSwitchEquip).toHaveBeenCalledTimes(1);
	const pkt = mocks.sendPacket.mock.calls[0][0];
	expect(pkt).toBeInstanceOf(PACKET.CZ.REQ_ONESWITCH);
	expect(pkt.index).toBe(9);
	expect([...new Uint8Array(pkt.build().buffer)]).toEqual([0xce, 0x0a, 9, 0]);
});

it('drags a set item out as coming from SwitchEquip, and ignores it dropped back', () => {
	SwitchEquip.onAddSwitchEquip = vi.fn();
	SwitchEquip.equip({ index: 12, ITID: 2301, type: 4, IsIdentified: true }, 16, true);
	const item = SwitchEquip.getRoot().querySelector('.item[data-index="12"]');
	expect(item.getAttribute('draggable')).toBe('true');
	let payload;
	const start = new Event('dragstart', { bubbles: true });
	Object.defineProperty(start, 'dataTransfer', { value: { setData: (_t, v) => (payload = v), setDragImage() {} } });
	item.dispatchEvent(start);
	expect(JSON.parse(payload)).toMatchObject({ type: 'item', from: 'SwitchEquip', data: { index: 12 } });

	const drop = new Event('drop', { bubbles: true });
	Object.defineProperty(drop, 'dataTransfer', { value: { getData: () => payload } });
	SwitchEquip.getRoot().querySelector('.panel').dispatchEvent(drop);
	expect(SwitchEquip.onAddSwitchEquip).not.toHaveBeenCalled();
});

it('does not drag worn gear that the swap window only shows greyed', () => {
	SwitchEquip.equip({ index: 13, ITID: 2302, type: 4, IsIdentified: true }, 32, false);
	const item = SwitchEquip.getRoot().querySelector('.item[data-index="13"]');
	expect(item.getAttribute('draggable')).toBe('false');
	let payload;
	const start = new Event('dragstart', { bubbles: true, cancelable: true });
	Object.defineProperty(start, 'dataTransfer', { value: { setData: (_t, v) => (payload = v), setDragImage() {} } });
	item.dispatchEvent(start);
	expect(payload).toBeUndefined();
	expect(start.defaultPrevented).toBe(true);
});
