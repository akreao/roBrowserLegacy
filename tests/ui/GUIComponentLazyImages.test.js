/**
 * Entering the map prepares dozens of windows the player may never open.
 * Their data-* images are fetched when each window is first on screen, not
 * when it is prepared.
 */
import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ requested: [] }));

vi.mock('Core/Client.js', () => ({
	default: {
		loadFile(path, onload) {
			mocks.requested.push(path);
			onload?.(`img:${path}`);
		},
		loadFiles(files) {
			mocks.requested.push(...files);
		}
	}
}));
vi.mock('DB/DBManager.js', () => ({
	default: { INTERFACE_PATH: '', getMessage: id => (id === '7' ? 'Close' : '') }
}));
vi.mock('UI/CursorManager.js', () => ({ default: { ACTION: {}, getActualType: () => 0, setType: vi.fn() } }));
vi.mock('Renderer/Renderer.js', () => ({ default: {} }));
vi.mock('Renderer/EntityManager.js', () => ({ default: {} }));
vi.mock('UI/Scrollbar.js', () => ({ default: {} }));
vi.mock('Core/Preferences.js', () => ({ default: { get: (_k, def) => ({ ...def, save: vi.fn() }) } }));

const { default: GUIComponent } = await import('UI/GUIComponent.js');

// GUIComponent loads Client and DB itself before it handles a node
await new Promise(r => setTimeout(r, 20));

function makeWindow(name) {
	const component = new GUIComponent(name, '');
	component.render = () =>
		`<div class="bg" data-background="${name}/bg.bmp"></div>` +
		`<button class="close" data-text="7" data-hover="${name}/close_a.bmp" data-preload="${name}/extra.bmp"></button>`;
	return component;
}

const flush = () => new Promise(r => setTimeout(r, 0));
const root = component => component.getRoot();

describe('window art is fetched on first showing', () => {
	it('sets the text on prepare but fetches no image', async () => {
		mocks.requested = [];
		const win = makeWindow('lazyprep');
		win.prepare();
		await flush();
		expect(mocks.requested).toEqual([]);
		expect(root(win).querySelector('.close').textContent).toBe('Close');
	});

	it('fetches the images when the window is appended', async () => {
		mocks.requested = [];
		const win = makeWindow('lazyappend');
		win.prepare();
		win.append();
		expect(mocks.requested.sort()).toEqual(['lazyappend/bg.bmp', 'lazyappend/close_a.bmp', 'lazyappend/extra.bmp']);
		expect(root(win).querySelector('.bg').style.backgroundImage).toContain('lazyappend/bg.bmp');
		win.remove();
		win.append();
		expect(mocks.requested.length).toBe(3);
	});

	it('waits while the window is appended hidden, and fetches once it is shown', async () => {
		mocks.requested = [];
		const win = makeWindow('lazyhidden');
		win.onAppend = function () {
			this._host.style.display = 'none';
		};
		win.append();
		await flush();
		expect(mocks.requested).toEqual([]);
		win._host.style.display = '';
		await flush();
		expect(mocks.requested.length).toBe(3);
	});

	it('catches a window put on the page without append()', async () => {
		mocks.requested = [];
		const win = makeWindow('lazydirect');
		win.prepare();
		document.body.appendChild(win._host);
		await flush();
		expect(mocks.requested.length).toBe(3);
		win._host.remove();
	});
});
