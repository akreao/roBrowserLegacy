/**
 * tests/ui/Escape.legacy.test.js
 *
 * Without `officialEscapeMenu`, roBrowser's own option menu stays: separate Graphics
 * and Sound buttons, the older pictures, and no question before the save point.
 */
import { describe, expect, it, vi } from 'vitest';

vi.mock('Core/Configs.js', () => ({ default: { get: (_key, fallback) => fallback } }));
// GUIComponent imports these lazily; mocked so they don't pull the renderer in.
vi.mock('UI/CursorManager.js', () => ({ default: { ACTION: { DEFAULT: 0 }, setType: vi.fn(), getActualType: vi.fn() } }));
vi.mock('DB/DBManager.js', () => ({ default: { INTERFACE_PATH: 'data/texture/ui/', getMessage: () => '' } }));
vi.mock('Core/Client.js', () => ({
	default: {
		loadFile(path, callback) {
			callback?.(`loaded:${path}`);
		},
		loadFiles(_paths, callback) {
			callback?.('', '');
		}
	}
}));
vi.mock('Renderer/Renderer.js', () => ({ default: { width: 1200, height: 800 } }));
vi.mock('Renderer/EntityManager.js', () => ({ default: { setOverEntity: vi.fn() } }));
vi.mock('UI/Scrollbar.js', () => ({ default: {} }));
vi.mock('UI/UIManager.js', () => ({ default: { addComponent: component => component } }));
vi.mock('UI/Components/SoundOption/SoundOption.js', () => ({ default: {} }));
vi.mock('UI/Components/GraphicsOption/GraphicsOption.js', () => ({ default: {} }));
vi.mock('UI/Components/ShortCutOption/ShortCutOption.js', () => ({ default: {} }));

const Escape = (await import('UI/Components/Escape/Escape.js')).default;
Escape.prepare();

const shown = () =>
	[...Escape.getRoot().querySelectorAll('.container button')]
		.filter(el => el.style.display !== 'none')
		.map(el => el.className);

describe('the legacy option menu', () => {
	it('shows Graphics and Sound instead of Game Settings, with the older pictures', () => {
		Escape.resetMenu();
		expect(shown()).toEqual(['charselect', 'graphics', 'sound', 'hotkey', 'exit', 'cancel']);
		const root = Escape.getRoot();
		expect(root.querySelector('.exit').dataset.background).toBe('esc_03a.bmp');
		expect(root.querySelector('.savepoint').dataset.background).toBe('esc_04a.bmp');
	});

	it('keeps character select and exit on the death menu', () => {
		Escape.showDeathMenu(false);
		expect(shown()).toEqual(['savepoint', 'charselect', 'exit', 'cancel']);
		Escape.resetMenu();
	});

	it('returns to the save point without asking', () => {
		Escape.onReturnSavePointRequest = vi.fn();
		Escape.getRoot().querySelector('.savepoint').click();
		expect(Escape.onReturnSavePointRequest).toHaveBeenCalledTimes(1);
	});
});
