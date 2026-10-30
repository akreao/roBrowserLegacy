/**
 * tests/ui/UIManager.popupColors.test.js
 *
 * The message, prompt and error popups honour ^RRGGBB colour codes, as the
 * inventory expansion prompt (msgstringtable 3561) needs.
 */
import { describe, expect, it, vi } from 'vitest';

vi.mock('UI/GUIComponent.js', () => ({ default: class { static processDataAttrs() {} } }));
vi.mock('UI/UIVersionManager.js', () => ({ default: { getUIAlias: () => null } }));

const { default: UIManager } = await import('UI/UIManager.js');

function mockPopup() {
	const shadow = document.createElement('div');
	shadow.innerHTML = '<div class="text"></div><div class="btns"></div>';
	const box = {
		_shadow: shadow,
		_host: document.createElement('div'),
		draggable: vi.fn(),
		remove: vi.fn(),
		append() {
			this.init();
		}
	};
	UIManager.components.WinPopup = { clone: () => box };
	return shadow.querySelector('.text');
}

const TEXT = 'Use ^0000FFInventory Expansion Voucher^000000 to raise 100 to 110?';

describe('UIManager popups and colour codes', () => {
	it.each([
		['showPromptBox', () => UIManager.showPromptBox(TEXT, 'ok', 'cancel')],
		['showMessageBox', () => UIManager.showMessageBox(TEXT, 'ok')],
		['showErrorBox', () => UIManager.showErrorBox(TEXT)]
	])('%s draws the codes as colours, not as text', (_name, show) => {
		const text = mockPopup();
		show();

		expect(text.textContent).toBe('Use Inventory Expansion Voucher to raise 100 to 110?');
		expect(text.textContent).not.toContain('^');
		expect(text.querySelector('span').style.color).toBe('rgb(0, 0, 255)');
	});
});
