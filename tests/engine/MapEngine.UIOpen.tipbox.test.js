/**
 * tests/engine/MapEngine.UIOpen.tipbox.test.js
 *
 * The server's request to show a tip (UI_OPEN type 5). One that arrives while
 * the map is loading would open a window the load removes again, so it waits
 * for the map, as the attendance window does.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ hooks: new Map(), renderer: { loading: false }, open: vi.fn() }));

vi.mock('Network/NetworkManager.js', () => ({
	default: { hookPacket: (struct, fn) => mocks.hooks.set(struct, fn), sendPacket: vi.fn() }
}));
vi.mock('Network/PacketStructure.js', () => ({ default: { ZC: { UI_OPEN: 'UI_OPEN', UI_OPEN_V3: 'UI_OPEN_V3' } } }));
vi.mock('Network/PacketVerManager.js', () => ({ default: { value: 20221005 } }));
vi.mock('Core/Configs.js', () => ({ default: { get: () => false } }));
vi.mock('Renderer/MapRenderer.js', () => ({ default: mocks.renderer }));
vi.mock('UI/Components/CheckAttendance/CheckAttendance.js', () => ({ default: {} }));
vi.mock('UI/Components/EnchantGrade/EnchantGrade.js', () => ({ default: {} }));
vi.mock('UI/Components/Enchant/Enchant.js', () => ({ default: {} }));
vi.mock('UI/Components/TipBox/TipBox.js', () => ({ default: { open: mocks.open } }));

const { default: UIOpen, openPendingUI } = await import('Engine/MapEngine/UIOpen.js');
UIOpen();
const onUIOpen = mocks.hooks.get('UI_OPEN');

beforeEach(() => {
	mocks.open.mockClear();
	mocks.renderer.loading = false;
	openPendingUI();
	mocks.open.mockClear();
});

describe('the server asking for a tip', () => {
	it('opens the tip box on that tip', () => {
		onUIOpen({ ui_type: 5, data: 1000 });
		expect(mocks.open).toHaveBeenCalledWith(1000);
	});

	it('waits for the map when it arrives during a map load', () => {
		mocks.renderer.loading = true;
		onUIOpen({ ui_type: 5, data: 3 });
		expect(mocks.open).not.toHaveBeenCalled();

		mocks.renderer.loading = false;
		openPendingUI();
		expect(mocks.open).toHaveBeenCalledWith(3);

		// and opens it only once
		openPendingUI();
		expect(mocks.open).toHaveBeenCalledTimes(1);
	});
});
