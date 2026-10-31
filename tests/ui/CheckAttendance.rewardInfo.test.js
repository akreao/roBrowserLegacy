/**
 * tests/ui/CheckAttendance.rewardInfo.test.js
 *
 * Right-clicking an attendance reward shows its description, like the official window.
 */
import { expect, it, vi } from 'vitest';

const info = vi.hoisted(() => ({ append: vi.fn(), setItem: vi.fn(), remove: vi.fn(), uid: -1 }));

vi.mock('UI/GUIComponent.js', () => ({
	default: class {
		static processDataAttrs() {}
		constructor() {
			this._host = document.createElement('div');
		}
		getRoot() {
			return this._host;
		}
		draggable() {}
	}
}));
vi.mock('UI/UIManager.js', () => ({
	default: {
		addComponent(component) {
			component._host.innerHTML = component.render();
			return component;
		}
	}
}));
vi.mock('UI/Elements/Elements.js', () => ({}));
vi.mock('UI/Components/ItemInfo/ItemInfo.js', () => ({ default: info }));
vi.mock('Core/Preferences.js', () => ({ default: { get: (_key, def) => def } }));
vi.mock('Renderer/Renderer.js', () => ({ default: { width: 1200, height: 800 } }));
vi.mock('Network/NetworkManager.js', () => ({ default: { sendPacket: vi.fn() } }));
vi.mock('DB/DBManager.js', () => ({
	default: {
		getCheckAttendanceInfo: () => ({
			Rewards: Array.from({ length: 20 }, (_, i) => ({ item_id: i === 4 ? 503 : 500 + i, quantity: i + 1 }))
		}),
		getItemInfo: () => ({}),
		getMessage: () => ''
	}
}));

const CheckAttendance = (await import('UI/Components/CheckAttendance/CheckAttendance.js')).default;

it('opens the description of the right-clicked reward', () => {
	CheckAttendance.init();
	const root = CheckAttendance.getRoot();
	const list = root.querySelector('.days-list') || root;
	list.insertAdjacentHTML('beforeend', '<li id="attendance_day_3" class="attendance-item"><div class="item"></div></li>');

	root.querySelector('#attendance_day_3 .item').dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));

	expect(info.append).toHaveBeenCalledOnce();
	expect(info.setItem).toHaveBeenCalledWith({ ITID: 503, IsIdentified: true, count: 4 });

	// A second right-click on the same reward closes it
	root.querySelector('#attendance_day_3 .item').dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
	expect(info.remove).toHaveBeenCalledOnce();
	expect(info.append).toHaveBeenCalledOnce();

	// Another day with the same item shows that day's reward
	list.insertAdjacentHTML('beforeend', '<li id="attendance_day_4" class="attendance-item"><div class="item"></div></li>');
	info.uid = 503;
	root.querySelector('#attendance_day_3 .item').dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
	root.querySelector('#attendance_day_4 .item').dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
	expect(info.setItem).toHaveBeenLastCalledWith({ ITID: 503, IsIdentified: true, count: 5 });
	expect(info.remove).toHaveBeenCalledOnce();
});
