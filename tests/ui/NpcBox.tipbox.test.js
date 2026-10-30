/**
 * NPC text can link a tip as <TIPBOX>[List]<INFO>9163</INFO></TIPBOX>
 * (rAthena's npc/re/merchants/rgsr_in.txt). A click opens the tip box on it.
 */
import { describe, expect, it, vi } from 'vitest';

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
	MockGUIComponent.MouseMode = { FREEZE: 0, STOP: 1, CROSS: 2 };
	return { MockGUIComponent, tipBox: { open: vi.fn() } };
});

vi.mock('UI/GUIComponent.js', () => ({ default: mocks.MockGUIComponent }));
vi.mock('UI/UIManager.js', () => ({
	default: {
		addComponent(component) {
			component.getRoot().innerHTML = component.render();
			return component;
		}
	}
}));
vi.mock('UI/Elements/Elements.js', () => ({}));
vi.mock('Renderer/Renderer.js', () => ({ default: { width: 800, height: 600 } }));
vi.mock('UI/Components/ItemInfo/ItemInfo.js', () => ({ default: {} }));
vi.mock('UI/Components/Navigation/Navigation.js', () => ({ default: {} }));
vi.mock('UI/Components/NpcMenu/NpcMenu.js', () => ({ default: {} }));
vi.mock('UI/Components/InputBox/InputBox.js', () => ({ default: {} }));
vi.mock('UI/Components/TipBox/TipBox.js', () => ({ default: mocks.tipBox }));

const { default: NpcBox } = await import('UI/Components/NpcBox/NpcBox.js');

function say(text) {
	NpcBox.setText(text, 1);
	return NpcBox.getRoot().querySelector('.content').lastElementChild;
}

describe('NpcBox TIPBOX links', () => {
	it('links a tip, and opens the tip box on it when clicked', () => {
		NpcBox.init();
		const line = say('Modifiable items are located in <TIPBOX>[List]<INFO>9166</INFO></TIPBOX>.');
		const link = line.querySelector('.tipbox-link');
		expect(link.textContent).toBe('[List]');
		expect(link.dataset.tipboxId).toBe('9166');
		expect(line.textContent).toBe('Modifiable items are located in [List].');

		link.click();
		expect(mocks.tipBox.open).toHaveBeenCalledWith(9166);
	});

	it('keeps the link whole when a colour code is inside its text', () => {
		const line = say('Set traps in <TIPBOX>^4D4DFF[four places]^000000<INFO>8086</INFO></TIPBOX> now.');
		const link = line.querySelector('.tipbox-link');
		expect(link.textContent).toBe('[four places]');
		expect(link.querySelector('span[style]').style.color).toBe('rgb(77, 77, 255)');
		expect(line.textContent).toBe('Set traps in [four places] now.');
	});
});
