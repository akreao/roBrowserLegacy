/**
 * tests/ui/Trade.zenyInput.test.js
 *
 * The zeny box takes digits only, shows commas and caps at 1 billion, like the official one.
 */
import { afterEach, expect, it, vi } from 'vitest';
import PACKET from 'Network/PacketStructure.js';
import Session from 'Engine/SessionStorage.js';

const state = vi.hoisted(() => ({ hooks: new Map(), sent: [], inventory: new Map(), storage: new Map() }));
vi.stubGlobal('localStorage', {
	getItem: key => state.storage.get(key) ?? null,
	setItem: (key, value) => state.storage.set(key, String(value)),
	removeItem: key => state.storage.delete(key)
});
vi.mock('Core/Client.js', () => ({ default: { loadFile: (_path, done) => done?.('') } }));
vi.mock('DB/DBManager.js', () => ({
	default: {
		INTERFACE_PATH: '',
		getItemInfo: () => ({ identifiedResourceName: 'item', unidentifiedResourceName: 'item' }),
		getMessage: id => String(id),
		getItemName: item => String(item.ITID)
	}
}));
vi.mock('Network/NetworkManager.js', () => ({
	default: {
		sendPacket: packet => state.sent.push(Array.from(new Uint8Array(packet.build().buffer))),
		hookPacket: (type, callback) => state.hooks.set(type, callback)
	}
}));
vi.mock('Renderer/Renderer.js', () => ({ default: { width: 1200, height: 800 } }));
vi.mock('UI/CursorManager.js', () => ({ default: { setType() {}, ACTION: { DEFAULT: 0 } } }));
vi.mock('Renderer/EntityManager.js', () => ({ default: { setOverEntity() {} } }));
vi.mock('UI/Scrollbar.js', () => ({ default: {} }));
vi.mock('UI/UIManager.js', () => ({ default: { addComponent: component => component, showMessageBox: vi.fn() } }));
vi.mock('UI/Components/Inventory/Inventory.js', () => ({
	default: {
		removeItem(index) {
			const item = state.inventory.get(index);
			state.inventory.delete(index);
			return item;
		}
	}
}));
vi.mock('UI/Components/ItemInfo/ItemInfo.js', () => ({ default: {} }));
vi.mock('UI/Components/ChatBox/ChatBox.js', () => ({
	default: { addText() {}, TYPE: { ERROR: 1 }, FILTER: { PUBLIC_LOG: 1 } }
}));

const Trade = (await import('UI/Components/Trade/Trade.js')).default;
const TradeEngine = (await import('Engine/MapEngine/Trade.js')).default;
const receive = (type, packet) => state.hooks.get(type)(packet);
afterEach(() => {
	Trade.remove();
	Session.Entity = null;
});

it('reads a typed amount with commas and offers all of it', async () => {
	TradeEngine();
	Session.Entity = { money: 5000000 };
	receive(PACKET.ZC.ACK_EXCHANGE_ITEM2, { result: 3, GID: 2000002, level: 1 });
	const root = Trade.getRoot();
	const input = root.querySelector('.zeny.send');
	const { default: UIManager } = await import('UI/UIManager.js');

	input.value = '1000000';
	input.dispatchEvent(new Event('input'));
	expect(input.value).toBe('1,000,000');
	expect(UIManager.showMessageBox).not.toHaveBeenCalled();

	input.value = '1,000,000a';
	input.dispatchEvent(new Event('input'));
	expect(input.value).toBe('1,000,000');
	expect(UIManager.showMessageBox).toHaveBeenLastCalledWith('602', 'ok');

	input.value = '2000000000';
	input.dispatchEvent(new Event('input'));
	expect(input.value).toBe('1,000,000,000');
	expect(UIManager.showMessageBox).toHaveBeenLastCalledWith('2467', 'ok');

	// Typing a digit inside the number keeps the caret after it
	input.value = '1,2034,567';
	input.setSelectionRange(4, 4);
	input.dispatchEvent(new Event('input'));
	expect(input.value).toBe('12,034,567');
	expect(input.selectionStart).toBe(4);

	// Clearing the box leaves "0" selected, so typing 5 gives 5, not 50
	input.value = '';
	input.dispatchEvent(new Event('input'));
	expect(input.value).toBe('0');
	expect([input.selectionStart, input.selectionEnd]).toEqual([0, 1]);

	input.value = '1,234,567';
	state.sent.length = 0;
	root.querySelector('.ok.enabled').click();
	// 0x00e8 index 0, amount 1234567 (0x0012d687)
	expect(state.sent[0]).toEqual([0xe8, 0, 0, 0, 0x87, 0xd6, 0x12, 0]);
});
