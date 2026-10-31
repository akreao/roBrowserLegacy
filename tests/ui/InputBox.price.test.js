/**
 * tests/ui/InputBox.price.test.js
 *
 * A shop price reads like the official vending price box: digits with or
 * without commas, nothing else, at most 1,000,000,000.
 */
import { beforeEach, expect, it, vi } from 'vitest';

const ui = vi.hoisted(() => ({ showMessageBox: vi.fn() }));

vi.mock('UI/GUIComponent.js', () => ({
	default: class {
		static MouseMode = { FREEZE: 'freeze' };
		constructor() {
			this._host = document.createElement('div');
		}
		getRoot() {
			return this._host;
		}
		get scale() {
			return 1;
		}
		draggable() {}
	}
}));
vi.mock('UI/UIManager.js', () => ({
	default: {
		addComponent(component) {
			component._host.innerHTML = component.render();
			return component;
		},
		showMessageBox: ui.showMessageBox
	}
}));
vi.mock('UI/Elements/Elements.js', () => ({}));
vi.mock('Renderer/Renderer.js', () => ({ default: { width: 1200, height: 800 } }));
vi.mock('DB/DBManager.js', () => ({ default: { getMessage: id => `msg ${id}` } }));

const InputBox = (await import('UI/Components/InputBox/InputBox.js')).default;
InputBox.init();

function submit(value) {
	const root = InputBox.getRoot();
	InputBox.setType('price', true, 0);
	root.querySelector('input').value = value;
	root.querySelector('ui-button').click();
}

beforeEach(() => {
	InputBox.onSubmitRequest = vi.fn();
	ui.showMessageBox.mockClear();
});

it('reads a price written with commas', () => {
	submit('1,500,000');
	expect(InputBox.onSubmitRequest).toHaveBeenCalledWith(1500000);
	expect(ui.showMessageBox).not.toHaveBeenCalled();
});

it('caps the price at one billion with the official message', () => {
	submit('3000000000');
	expect(InputBox.onSubmitRequest).toHaveBeenCalledWith(1000000000);
	expect(ui.showMessageBox).toHaveBeenCalledWith('msg 2467', 'ok');
});

it('refuses a space inside the price', () => {
	submit('1 500');
	expect(InputBox.onSubmitRequest).not.toHaveBeenCalled();
	expect(ui.showMessageBox).toHaveBeenCalledWith('msg 602', 'ok');
});

it('refuses anything but digits', () => {
	submit('12k');
	expect(InputBox.onSubmitRequest).not.toHaveBeenCalled();
	expect(ui.showMessageBox).toHaveBeenCalledWith('msg 602', 'ok');
});

it('keeps plain number boxes as they were', () => {
	const root = InputBox.getRoot();
	InputBox.setType('number', true, 0);
	root.querySelector('input').value = '42';
	root.querySelector('ui-button').click();
	expect(InputBox.onSubmitRequest).toHaveBeenCalledWith(42);
});
