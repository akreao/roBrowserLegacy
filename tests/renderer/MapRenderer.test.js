import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
	soundManager: { stop: vi.fn() },
	bgm: { stop: vi.fn(), play: vi.fn() },
	uiManager: { removeComponents: vi.fn(), showErrorBox: vi.fn(() => ({ ui: { css: vi.fn() } })) },
	background: {
		remove: vi.fn(callback => callback()),
		setLoading: vi.fn(),
		setPercent: vi.fn()
	},
	cursor: {
		ACTION: { DEFAULT: 0 },
		setType: vi.fn()
	},
	mouse: { intersect: true },
	renderer: {
		stop: vi.fn(),
		getContext: vi.fn(() => ({})),
		render: vi.fn(),
		init: vi.fn(),
		show: vi.fn()
	},
	entityManager: { free: vi.fn() },
	effectManager: { free: vi.fn(), init: vi.fn() },
	screenEffects: { init: vi.fn(), startMapflagEffect: vi.fn() },
	sky: { setUpCloudData: vi.fn(), init: vi.fn() },
	damage: { free: vi.fn(), init: vi.fn() },
	joystickUI: { onRestore: vi.fn() },
	signboards: { free: vi.fn() },
	thread: { hook: vi.fn(), send: vi.fn() }
}));

vi.mock('Core/Thread.js', () => ({ default: mocks.thread }));
vi.mock('Audio/SoundManager.js', () => ({ default: mocks.soundManager }));
vi.mock('Audio/BGM.js', () => ({ default: mocks.bgm }));
vi.mock('DB/DBManager.js', () => ({ default: { getMap: () => null } }));
vi.mock('UI/UIManager.js', () => ({ default: mocks.uiManager }));
vi.mock('UI/Background.js', () => ({ default: mocks.background }));
vi.mock('UI/CursorManager.js', () => ({ default: mocks.cursor }));
vi.mock('Engine/SessionStorage.js', () => ({ default: {} }));
vi.mock('Core/MemoryManager.js', () => ({ default: {} }));
vi.mock('Controls/MouseEventHandler.js', () => ({ default: mocks.mouse }));
vi.mock('Renderer/Renderer.js', () => ({ default: mocks.renderer }));
vi.mock('Renderer/Camera.js', () => ({ default: {} }));
vi.mock('Renderer/EntityManager.js', () => ({ default: mocks.entityManager }));
vi.mock('Renderer/Map/GridSelector.js', () => ({ default: {} }));
vi.mock('Renderer/Map/Ground.js', () => ({ default: {} }));
vi.mock('Renderer/Map/Altitude.js', () => ({ default: {} }));
vi.mock('Renderer/Map/Water.js', () => ({ default: {} }));
vi.mock('Renderer/Map/Models.js', () => ({ default: {} }));
vi.mock('Renderer/Map/AnimatedModels.js', () => ({ default: {} }));
vi.mock('Renderer/Map/OccluderFade.js', () => ({ default: {} }));
vi.mock('Renderer/GR2/GR2ModelRenderer.js', () => ({ default: {} }));
vi.mock('Renderer/Map/Sounds.js', () => ({ default: {} }));
vi.mock('Renderer/Map/Effects.js', () => ({ default: {} }));
vi.mock('Renderer/SpriteRenderer.js', () => ({ default: { init: vi.fn() } }));
vi.mock('Renderer/EffectManager.js', () => ({ default: mocks.effectManager }));
vi.mock('Renderer/SignboardManager.js', () => ({ default: mocks.signboards }));
vi.mock('Renderer/ScreenEffectManager.js', () => ({ default: mocks.screenEffects }));
vi.mock('Renderer/Effects/Sky.js', () => ({ default: mocks.sky }));
vi.mock('Renderer/Effects/Damage.js', () => ({ default: mocks.damage }));
vi.mock('Preferences/Graphics.js', () => ({ default: {} }));
vi.mock('Preferences/Map.js', () => ({ default: { useFog: true } }));
vi.mock('Utils/gl-matrix.js', () => ({ default: { mat4: {} } }));
vi.mock('Network/PacketVerManager.js', () => ({ default: {} }));
vi.mock('UI/Components/JoystickUI/JoystickUI.js', () => ({ default: mocks.joystickUI }));
vi.mock('Renderer/Effects/PostProcess.js', () => ({ default: { isRegistered: () => true } }));
vi.mock('Renderer/Effects/Shaders/Bloom.js', () => ({ default: {} }));
vi.mock('Renderer/Effects/Shaders/VerticalFlip.js', () => ({ default: {} }));
vi.mock('Renderer/Effects/Shaders/GaussianBlur.js', () => ({ default: {} }));
vi.mock('Renderer/Effects/Shaders/CAS.js', () => ({ default: {} }));
vi.mock('Renderer/Effects/Shaders/FXAA.js', () => ({ default: {} }));
vi.mock('Renderer/Effects/Shaders/Vibrance.js', () => ({ default: {} }));
vi.mock('Renderer/Effects/Shaders/Cartoon.js', () => ({ default: {} }));
vi.mock('Renderer/Effects/Shaders/Blind.js', () => ({ default: {} }));
vi.mock('Renderer/Effects/Shaders/Upsampling.js', () => ({ default: {} }));
vi.mock('Utils/WebGL.js', () => ({ default: { detectBadWebGL: () => false } }));

const { default: MapRenderer } = await import('Renderer/MapRenderer.js');

describe('MapRenderer joystick restoration', () => {
	let originalOnLoad;

	beforeEach(() => {
		vi.clearAllMocks();
		originalOnLoad = MapRenderer.onLoad;
		MapRenderer.loading = false;
		MapRenderer.currentMap = 'prontera.gat';
		MapRenderer.onLoad = vi.fn();
		mocks.mouse.intersect = true;
	});

	afterEach(() => {
		MapRenderer.onLoad = originalOnLoad;
	});

	it('restores joystick polling before re-appending UI after a same-map teleport', () => {
		MapRenderer.setMap('prontera.gat');

		expect(mocks.uiManager.removeComponents).toHaveBeenCalledOnce();
		expect(mocks.joystickUI.onRestore).toHaveBeenCalledOnce();
		expect(MapRenderer.onLoad).toHaveBeenCalledOnce();
		expect(mocks.joystickUI.onRestore.mock.invocationCallOrder[0]).toBeLessThan(
			MapRenderer.onLoad.mock.invocationCallOrder[0]
		);
	});

	it('drops the signboards on a same-map teleport, since the map setup adds them again', () => {
		MapRenderer.setMap('prontera.gat');

		expect(mocks.signboards.free).toHaveBeenCalledOnce();
		expect(mocks.signboards.free.mock.invocationCallOrder[0]).toBeLessThan(
			MapRenderer.onLoad.mock.invocationCallOrder[0]
		);
	});

	it('leaves different-map restoration to the map completion lifecycle', () => {
		MapRenderer.setMap('geffen.gat');

		expect(mocks.background.setLoading).toHaveBeenCalledOnce();
		expect(mocks.joystickUI.onRestore).not.toHaveBeenCalled();
		expect(MapRenderer.onLoad).not.toHaveBeenCalled();
		expect(MapRenderer.loading).toBe(true);
		expect(MapRenderer.currentMap).toBe('geffen.gat');
	});

	it('asks the worker for the new map before the loading fade, and holds its results until the fade is done', () => {
		const free = vi.spyOn(MapRenderer, 'free').mockImplementation(() => {});
		mocks.renderer.remove = vi.fn();

		MapRenderer.setMap('geffen.gat');

		// The worker already has the map...
		const load = mocks.thread.send.mock.calls.find(([type]) => type === 'LOAD_MAP');
		expect(load[1]).toBe('geffen.rsw');
		expect(mocks.thread.send.mock.invocationCallOrder.at(-1)).toBeLessThan(
			mocks.background.setLoading.mock.invocationCallOrder[0]
		);

		// ...but what it sends back waits for the fade, then the old map is freed first.
		const hooks = Object.fromEntries(mocks.thread.hook.mock.calls);
		const onComplete = load[2];
		hooks.MAP_PROGRESS(50);
		onComplete(false, 'nope');
		expect(mocks.background.setPercent).not.toHaveBeenCalled();
		expect(mocks.uiManager.showErrorBox).not.toHaveBeenCalled();
		expect(free).not.toHaveBeenCalled();

		mocks.background.setLoading.mock.calls[0][0]();
		expect(free).toHaveBeenCalledOnce();
		expect(mocks.renderer.remove).toHaveBeenCalledOnce();
		expect(mocks.background.setPercent).toHaveBeenCalledWith(50);
		expect(mocks.uiManager.showErrorBox).toHaveBeenCalledWith('nope');
		expect(free.mock.invocationCallOrder[0]).toBeLessThan(mocks.background.setPercent.mock.invocationCallOrder[0]);

		// Results after the fade go straight through.
		hooks.MAP_PROGRESS(60);
		expect(mocks.background.setPercent).toHaveBeenLastCalledWith(60);
		free.mockRestore();
	});

	it('starts the new map behind the closing fade, and hands over the mouse once the image is gone', () => {
		vi.spyOn(MapRenderer, 'free').mockImplementation(() => {});
		mocks.renderer.remove = vi.fn();
		mocks.mouse.intersect = false;
		let reveal;
		mocks.background.remove.mockImplementationOnce(callback => (reveal = callback));

		MapRenderer.setMap('geffen.gat');
		mocks.background.setLoading.mock.calls[0][0]();
		const onComplete = mocks.thread.send.mock.calls.find(([type]) => type === 'LOAD_MAP')[2];
		onComplete(true);

		// The map is set up and drawing under the loading image...
		expect(MapRenderer.loading).toBe(false);
		expect(MapRenderer.onLoad).toHaveBeenCalledOnce();
		expect(mocks.renderer.show).toHaveBeenCalledOnce();
		expect(mocks.renderer.render).toHaveBeenCalledOnce();
		expect(MapRenderer.onLoad.mock.invocationCallOrder[0]).toBeLessThan(
			mocks.background.remove.mock.invocationCallOrder[0]
		);
		expect(mocks.mouse.intersect).toBe(false);

		// ...and a move the server sends meanwhile waits for the image to go.
		MapRenderer.setMap('payon.gat');
		expect(MapRenderer.currentMap).toBe('geffen.gat');
		expect(mocks.background.setLoading).toHaveBeenCalledOnce();

		reveal();
		expect(mocks.mouse.intersect).toBe(true);
		expect(MapRenderer.currentMap).toBe('payon.gat');
		expect(mocks.background.setLoading).toHaveBeenCalledTimes(2);
		MapRenderer.free.mockRestore();
	});
});
