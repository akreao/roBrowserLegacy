/**
 * Core/PerfProbe.js
 *
 * Opt-in performance probe: frame time, draw calls per frame, map load time
 * and startup-to-login time, with a small on-screen overlay.
 *
 * Off unless the page opts in, with `localStorage.roPerf = '1'` or `?perf=1`
 * in the URL. Off, every hook below is one boolean test and nothing else: the
 * WebGL context is not wrapped, no overlay is made, and `window.roPerf` does
 * not exist.
 *
 * On, `window.roPerf` gives:
 *   stats()        frame statistics since the last reset(), plus the marks
 *   reset()        start a new measurement window
 *   marks          { login, maps: [{ map, loadMs, firstFrameMs }] }
 *   overlay(bool)  show or hide the overlay (shown by default)
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/**
 * Whether the page asked for the probe
 *
 * @return {boolean}
 */
function readEnabled() {
	try {
		if (typeof window === 'undefined') {
			return false;
		}
		if (/[?&]perf=1(&|$)/.test(window.location.search)) {
			return true;
		}
		return window.localStorage.getItem('roPerf') === '1';
	} catch (_e) {
		return false;
	}
}

/**
 * Frames kept per window: ten minutes at 60 fps
 */
const MAX_FRAMES = 36000;

/**
 * A frame slower than this (ms, frame to frame) counts as a hitch
 */
const HITCH_MS = 50;

const DRAW_CALLS = ['drawArrays', 'drawElements', 'drawArraysInstanced', 'drawElementsInstanced', 'drawRangeElements'];

const _interval = new Float32Array(MAX_FRAMES); // frame start to frame start
const _work = new Float32Array(MAX_FRAMES); // time spent inside the render loop
const _draws = new Uint32Array(MAX_FRAMES);
let _count = 0;
let _windowStart = 0;

let _frameStart = 0;
let _lastFrameStart = 0;
let _frameDraws = 0;
let _frameVertices = 0;
let _totalVertices = 0;

let _gl = null;
let _overlay = null;
let _overlayTimer = 0;

let _mapStart = 0;
let _mapName = '';
let _mapReady = 0;

const _marks = {
	login: null,
	maps: []
};

/**
 * Percentile of a sorted array
 *
 * @param {Float32Array|Array} sorted ascending
 * @param {number} p 0..100
 * @return {number}
 */
function percentile(sorted, p) {
	if (!sorted.length) {
		return 0;
	}
	const index = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1);
	return sorted[Math.max(0, index)];
}

/**
 * avg / p50 / p95 / p99 / max of the first `count` values
 *
 * @param {Float32Array|Uint32Array} values
 * @param {number} count
 * @return {object}
 */
function summarize(values, count) {
	const sorted = Float64Array.from(values.subarray(0, count)).sort();
	let sum = 0;
	for (let i = 0; i < count; ++i) {
		sum += sorted[i];
	}
	const round = v => Math.round(v * 100) / 100;
	return {
		avg: round(count ? sum / count : 0),
		p50: round(percentile(sorted, 50)),
		p95: round(percentile(sorted, 95)),
		p99: round(percentile(sorted, 99)),
		max: round(count ? sorted[count - 1] : 0)
	};
}

/**
 * Wrap the context's draw calls to count them
 *
 * @param {WebGLRenderingContext} gl
 */
function wrapContext(gl) {
	for (const name of DRAW_CALLS) {
		const original = gl[name];
		if (typeof original !== 'function') {
			continue;
		}
		// drawArrays(mode, first, count); drawElements(mode, count, ...);
		// drawRangeElements(mode, start, end, count, ...)
		const countArg =
			name === 'drawArrays' || name === 'drawArraysInstanced' ? 2 : name === 'drawRangeElements' ? 3 : 1;
		gl[name] = function () {
			_frameDraws++;
			_frameVertices += arguments[countArg] | 0;
			return original.apply(gl, arguments);
		};
	}
}

/**
 * Build the overlay element
 */
function makeOverlay() {
	_overlay = document.createElement('div');
	_overlay.id = 'roPerfOverlay';
	_overlay.style.cssText =
		'position:fixed;top:4px;right:4px;z-index:100000;pointer-events:none;' +
		'font:11px/1.3 monospace;color:#cfc;background:rgba(0,0,0,0.6);padding:3px 6px;white-space:pre;';
	document.body.appendChild(_overlay);
	_overlayTimer = setInterval(updateOverlay, 500);
}

/**
 * Refresh the overlay from the last second of frames
 */
function updateOverlay() {
	if (!_overlay) {
		return;
	}
	const now = performance.now();
	let frames = 0;
	let work = 0;
	let worst = 0;
	let draws = 0;
	let elapsed = 0;
	for (let i = _count - 1; i >= 0 && elapsed < 1000; --i) {
		frames++;
		elapsed += _interval[i];
		work += _work[i];
		draws += _draws[i];
		worst = Math.max(worst, _interval[i]);
	}
	const last = _marks.maps[_marks.maps.length - 1];
	_overlay.textContent =
		(frames ? Math.round((frames * 1000) / Math.max(elapsed, 1)) : 0) +
		' fps  ' +
		(frames ? (elapsed / frames).toFixed(1) : '-') +
		' ms (max ' +
		worst.toFixed(0) +
		')\n' +
		'work ' +
		(frames ? (work / frames).toFixed(1) : '-') +
		' ms  draws ' +
		(frames ? Math.round(draws / frames) : 0) +
		'\n' +
		(last ? last.map + ' load ' + Math.round(last.loadMs) + ' ms' : '') +
		(_marks.login !== null ? '  login ' + Math.round(_marks.login) + ' ms' : '') +
		(now - _lastFrameStart > 1000 ? '\n(no frames)' : '');
}

class PerfProbe {
	/**
	 * @type {boolean} decided once, at load
	 */
	static enabled = readEnabled();

	/**
	 * Count draw calls on this context (once per context)
	 *
	 * @param {WebGLRenderingContext} gl
	 */
	static attach(gl) {
		if (!PerfProbe.enabled || !gl || _gl === gl) {
			return;
		}
		_gl = gl;
		wrapContext(gl);
		if (!_overlay) {
			makeOverlay();
		}
	}

	/**
	 * Called by the render loop before a frame's work
	 *
	 * @param {number} now rAF timestamp
	 */
	static frameStart(now) {
		_frameStart = performance.now();
		if (_lastFrameStart && _count < MAX_FRAMES) {
			_interval[_count] = now - _lastFrameStart;
		}
		_lastFrameStart = now;
		_frameDraws = 0;
		_frameVertices = 0;
	}

	/**
	 * Called by the render loop after a frame's work
	 */
	static frameEnd() {
		if (!_frameStart) {
			return;
		}
		// The first frame of a window has no interval: it is not stored
		if (_interval[_count] > 0 && _count < MAX_FRAMES) {
			_work[_count] = performance.now() - _frameStart;
			_draws[_count] = _frameDraws;
			_totalVertices += _frameVertices;
			_count++;
			_interval[_count] = 0;
		}
		if (_mapReady) {
			const map = _marks.maps[_marks.maps.length - 1];
			map.firstFrameMs = Math.round((performance.now() - _mapStart) * 10) / 10;
			_mapReady = 0;
		}
	}

	/**
	 * A map started loading
	 *
	 * @param {string} name
	 */
	static mapStart(name) {
		_mapStart = performance.now();
		_mapName = name;
		// The render loop stops while a map loads: that gap is not a frame
		_lastFrameStart = 0;
	}

	/**
	 * A map finished loading and is about to be drawn
	 */
	static mapReady() {
		if (!_mapStart) {
			return;
		}
		_marks.maps.push({
			map: _mapName,
			loadMs: Math.round((performance.now() - _mapStart) * 10) / 10,
			firstFrameMs: null
		});
		_mapReady = 1;
	}

	/**
	 * The login window was shown; the first time is the startup time
	 */
	static loginShown() {
		if (_marks.login === null) {
			_marks.login = Math.round(performance.now());
		}
	}

	/**
	 * Start a new measurement window
	 */
	static reset() {
		_count = 0;
		_interval[0] = 0;
		_lastFrameStart = 0;
		_totalVertices = 0;
		_windowStart = performance.now();
	}

	/**
	 * Frame statistics since the last reset
	 *
	 * @return {object}
	 */
	static stats() {
		const seconds = (performance.now() - _windowStart) / 1000;
		const draws = summarize(_draws, _count);
		let hitches = 0;
		for (let i = 0; i < _count; ++i) {
			if (_interval[i] > HITCH_MS) {
				hitches++;
			}
		}
		const memory = performance.memory;
		return {
			frames: _count,
			seconds: Math.round(seconds * 10) / 10,
			fps: Math.round((_count / Math.max(seconds, 0.001)) * 10) / 10,
			frameMs: summarize(_interval, _count),
			workMs: summarize(_work, _count),
			drawCalls: draws,
			verticesPerFrame: _count ? Math.round(_totalVertices / _count) : 0,
			hitches,
			heapMB: memory ? Math.round(memory.usedJSHeapSize / 1048576) : null,
			marks: JSON.parse(JSON.stringify(_marks))
		};
	}

	/**
	 * Show or hide the overlay
	 *
	 * @param {boolean} show
	 */
	static overlay(show) {
		if (show && !_overlay && _gl) {
			makeOverlay();
		} else if (!show && _overlay) {
			clearInterval(_overlayTimer);
			_overlay.remove();
			_overlay = null;
		}
	}
}

if (PerfProbe.enabled) {
	PerfProbe.reset();
	window.roPerf = {
		stats: PerfProbe.stats,
		reset: PerfProbe.reset,
		overlay: PerfProbe.overlay,
		get marks() {
			return JSON.parse(JSON.stringify(_marks));
		}
	};
}

/**
 * Export
 */
export default PerfProbe;
