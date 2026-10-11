import { beforeEach, describe, expect, it, vi } from 'vitest';

const graphics = { performanceMode: false };
vi.mock('Preferences/Graphics.js', () => ({ default: graphics }));

const { default: PostProcess } = await import('Renderer/Effects/PostProcess.js');

function makeGl() {
	const gl = {
		canvas: { width: 800, height: 600 },
		FRAMEBUFFER: 1,
		FRAMEBUFFER_COMPLETE: 2,
		COLOR_BUFFER_BIT: 4,
		DEPTH_BUFFER_BIT: 8,
		DEPTH_TEST: 16
	};
	for (const name of [
		'bindFramebuffer',
		'bindTexture',
		'bindRenderbuffer',
		'texImage2D',
		'texParameteri',
		'framebufferTexture2D',
		'framebufferRenderbuffer',
		'renderbufferStorage',
		'viewport',
		'clear',
		'deleteTexture',
		'deleteRenderbuffer',
		'deleteFramebuffer',
		'enable',
		'disable'
	]) {
		gl[name] = vi.fn();
	}
	gl.createFramebuffer = vi.fn(() => ({}));
	gl.createTexture = vi.fn(() => ({}));
	gl.createRenderbuffer = vi.fn(() => ({}));
	gl.checkFramebufferStatus = vi.fn(() => gl.FRAMEBUFFER_COMPLETE);
	gl.isTexture = gl.isRenderbuffer = gl.isFramebuffer = vi.fn(() => true);
	gl.isEnabled = vi.fn(() => true);
	return gl;
}

function makeModule(active, { activeNeedsInit = false } = {}) {
	let initialised = false;
	return {
		program: () => (initialised ? {} : null),
		isActive: () => (activeNeedsInit ? initialised && active : active),
		init: vi.fn(() => {
			initialised = true;
		}),
		clean: vi.fn(() => {
			initialised = false;
		}),
		render: vi.fn()
	};
}

let gl;
beforeEach(() => {
	gl = makeGl();
	PostProcess.clean(gl);
	gl.createFramebuffer.mockClear();
});

describe('PostProcess', () => {
	it('does not initialise a registered pass that is off, nor build buffers', () => {
		const off = makeModule(false);
		PostProcess.register(off, gl);
		PostProcess.prepare(gl);
		PostProcess.render(gl);

		expect(off.init).not.toHaveBeenCalled();
		expect(gl.createFramebuffer).not.toHaveBeenCalled();
		expect(gl.checkFramebufferStatus).not.toHaveBeenCalled();
		// The scene goes straight to the screen
		expect(gl.bindFramebuffer).toHaveBeenLastCalledWith(gl.FRAMEBUFFER, null);

		PostProcess.clean(gl);
		expect(off.clean).not.toHaveBeenCalled();
	});

	it('initialises a pass once, the first time it is active', () => {
		const pass = makeModule(true);
		PostProcess.register(pass, gl);
		expect(pass.init).not.toHaveBeenCalled();

		PostProcess.prepare(gl);
		PostProcess.render(gl);
		PostProcess.prepare(gl);
		PostProcess.render(gl);

		expect(pass.init).toHaveBeenCalledTimes(1);
		expect(pass.render).toHaveBeenCalledTimes(2);
		expect(gl.createFramebuffer).toHaveBeenCalledTimes(2); // the ping-pong pair

		PostProcess.clean(gl);
		expect(pass.clean).toHaveBeenCalledTimes(1);
	});

	it('initialises plugin passes when registered, as before', () => {
		const plugin = makeModule(true, { activeNeedsInit: true });
		PostProcess.addExternal(plugin);
		PostProcess.registerExternal(gl);
		expect(plugin.init).toHaveBeenCalledTimes(1);

		PostProcess.prepare(gl);
		PostProcess.render(gl);
		expect(plugin.render).toHaveBeenCalledTimes(1);

		PostProcess.removeExternal(plugin);
		expect(plugin.clean).toHaveBeenCalledTimes(1);
	});

	it('only resizes the buffers of initialised passes', () => {
		const on = makeModule(true);
		const off = makeModule(false);
		on.recreateFbo = vi.fn();
		off.recreateFbo = vi.fn();
		PostProcess.register(on, gl);
		PostProcess.register(off, gl);
		PostProcess.prepare(gl);

		PostProcess.recreateFbo(gl, 1024, 768);
		expect(on.recreateFbo).toHaveBeenCalledWith(gl, 1024, 768);
		expect(off.recreateFbo).not.toHaveBeenCalled();
	});
});
