/**
 * tests/ui/GUIComponentMapLoad.test.js
 *
 * The map turns Mouse.intersect on by itself when it finishes loading. A Fly
 * Wing used from the inventory warps with the pointer resting on the window,
 * so the map took the hover and the clicks through it until the pointer left
 * and came back. The next mousemove must hand the pointer back to the window.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const store = new Map();
vi.stubGlobal('localStorage', {
	getItem: key => (store.has(key) ? store.get(key) : null),
	setItem: (key, value) => store.set(key, String(value)),
	removeItem: key => store.delete(key)
});

vi.mock('UI/CursorManager.js', () => ({ default: { ACTION: { DEFAULT: 0 }, getActualType: () => 0, setType() {} } }));
vi.mock('DB/DBManager.js', () => ({ default: { INTERFACE_PATH: '' } }));
vi.mock('Core/Client.js', () => ({
	default: {
		loadFile(_path, callback) {
			callback?.('');
		},
		loadFiles(_paths, callback) {
			callback?.('', '');
		}
	}
}));
vi.mock('Renderer/Renderer.js', () => ({ default: { width: 1200, height: 800 } }));
vi.mock('Renderer/EntityManager.js', () => ({ default: { setOverEntity() {} } }));
vi.mock('UI/Scrollbar.js', () => ({ default: {} }));

const GUIComponent = (await import('UI/GUIComponent.js')).default;
const Mouse = (await import('Controls/MouseEventHandler.js')).default;
const Session = (await import('Engine/SessionStorage.js')).default;

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
	vi.clearAllTimers();
	vi.useRealTimers();
});

let seq = 0;
function hoveredWindow() {
	const component = new GUIComponent(`MapLoadWindow${++seq}`, '');
	component.render = () => '<div><button>Item</button></div>';
	component.append();
	const host = component._host;
	let hovered = false;
	const matches = host.matches.bind(host);
	host.matches = selector => (selector === ':hover' ? hovered : matches(selector));
	return {
		component,
		enter() {
			hovered = true;
			host.dispatchEvent(new Event('mouseenter'));
		},
		leave() {
			hovered = false;
			host.dispatchEvent(new Event('mouseleave'));
		}
	};
}

const move = () => window.dispatchEvent(new MouseEvent('mousemove'));

describe('a map that finishes loading under a window', () => {
	beforeEach(() => {
		Session.FreezeUI = false;
	});

	it('gives the pointer back to the window on the next mousemove', () => {
		Mouse.intersect = true;
		const inventory = hoveredWindow();
		inventory.enter();
		expect(Mouse.intersect).toBe(false);

		Mouse.intersect = true; // MapRenderer: the new map is shown
		move();
		expect(Mouse.intersect).toBe(false);

		inventory.leave();
		expect(Mouse.intersect).toBe(true);
	});

	it('also when the pointer came onto the window while the map was loading', () => {
		Mouse.intersect = false; // MapRenderer.setMap: loading
		const inventory = hoveredWindow();
		inventory.enter();

		Mouse.intersect = true;
		move();
		expect(Mouse.intersect).toBe(false);

		inventory.leave();
		expect(Mouse.intersect).toBe(true);
	});

	it('leaves the map alone once the pointer is off every window', () => {
		Mouse.intersect = true;
		const inventory = hoveredWindow();
		inventory.enter();
		inventory.leave();
		expect(Mouse.intersect).toBe(true);

		move();
		expect(Mouse.intersect).toBe(true);
	});
});
