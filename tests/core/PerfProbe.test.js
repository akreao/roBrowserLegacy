import { afterEach, describe, expect, it, vi } from 'vitest';

// jsdom here has no working localStorage
const store = new Map();
const localStorage = {
	getItem: key => (store.has(key) ? store.get(key) : null),
	setItem: (key, value) => store.set(key, String(value)),
	removeItem: key => store.delete(key)
};
vi.stubGlobal('localStorage', localStorage);

async function load(enabled) {
	vi.resetModules();
	delete window.roPerf;
	if (enabled) {
		localStorage.setItem('roPerf', '1');
	} else {
		localStorage.removeItem('roPerf');
	}
	return (await import('Core/PerfProbe.js')).default;
}

function makeGl() {
	const calls = [];
	return {
		calls,
		drawArrays: (...a) => calls.push(['drawArrays', ...a]),
		drawElements: (...a) => calls.push(['drawElements', ...a])
	};
}

afterEach(() => {
	localStorage.removeItem('roPerf');
	document.getElementById('roPerfOverlay')?.remove();
});

describe('PerfProbe', () => {
	it('does nothing unless the page opts in', async () => {
		const PerfProbe = await load(false);
		const gl = makeGl();
		const drawArrays = gl.drawArrays;
		PerfProbe.attach(gl);
		expect(PerfProbe.enabled).toBe(false);
		expect(gl.drawArrays).toBe(drawArrays);
		expect(window.roPerf).toBeUndefined();
		expect(document.getElementById('roPerfOverlay')).toBeNull();
	});

	it('counts draw calls and frame times per frame', async () => {
		const PerfProbe = await load(true);
		const gl = makeGl();
		PerfProbe.attach(gl);
		expect(window.roPerf).toBeDefined();

		// The first frame of a window only sets the clock
		for (let frame = 0; frame < 5; frame++) {
			PerfProbe.frameStart(1000 + frame * 20);
			gl.drawArrays(4, 0, 6);
			gl.drawElements(4, 30, 0x1403, 0);
			PerfProbe.frameEnd();
		}

		const stats = PerfProbe.stats();
		expect(stats.frames).toBe(4);
		expect(stats.frameMs.avg).toBe(20);
		expect(stats.frameMs.p99).toBe(20);
		expect(stats.drawCalls.avg).toBe(2);
		expect(stats.verticesPerFrame).toBe(36);
		expect(gl.calls).toHaveLength(10);

		PerfProbe.reset();
		expect(PerfProbe.stats().frames).toBe(0);
	});

	it('logs frames slower than 33 ms', async () => {
		const PerfProbe = await load(true);
		PerfProbe.attach(makeGl());
		for (const t of [0, 16, 32, 132, 148]) {
			PerfProbe.frameStart(1000 + t);
			PerfProbe.frameEnd();
		}
		const slow = PerfProbe.slowFrames();
		expect(slow).toHaveLength(1);
		expect(slow[0].frameMs).toBe(100);
		expect(slow[0].at).toBe(1032);
		PerfProbe.reset();
		expect(PerfProbe.slowFrames()).toHaveLength(0);
	});

	it('records map load and login marks', async () => {
		const PerfProbe = await load(true);
		PerfProbe.loginShown();
		PerfProbe.mapStart('iz_dun04.gat');
		PerfProbe.mapReady();
		PerfProbe.frameStart(1);
		PerfProbe.frameEnd();

		const { marks } = PerfProbe.stats();
		expect(marks.login).toBeTypeOf('number');
		expect(marks.maps).toHaveLength(1);
		expect(marks.maps[0].map).toBe('iz_dun04.gat');
		expect(marks.maps[0].firstFrameMs).toBeTypeOf('number');
	});
});
