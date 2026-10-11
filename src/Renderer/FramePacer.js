/**
 * Renderer/FramePacer.js
 *
 * Frame limiter that paces to the display. requestAnimationFrame fires once per
 * display refresh, so a limit that is not a whole divisor of the refresh rate
 * can only be met by skipping some refreshes and not others: 60 fps on a 75 Hz
 * display shows one frame in four for two refreshes, and frame times alternate
 * between 13.3 and 26.7 ms. That reads as stutter, though the average is 60.
 *
 * Instead, the refresh interval is measured from the rAF timestamps, and the
 * limit is rounded to the nearest whole divisor of the refresh rate: every
 * frame then lasts the same number of refreshes. 60 on 60 Hz and 120 Hz stays
 * 60; on 75 Hz it is 75 (no throttling); on 144 Hz, 72; on 165 Hz, 55.
 *
 * Until enough refreshes have been seen, or when the rAF rate is not steady
 * (a hidden tab, a fallback timer), the limit is applied by time, as before.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/**
 * rAF intervals kept to estimate the refresh interval
 */
const SAMPLES = 31;

/**
 * Intervals needed before the estimate is used
 */
const MIN_SAMPLES = 8;

/**
 * Intervals longer than this (ms) are not refreshes (a hidden tab, a stall)
 */
const MAX_INTERVAL = 100;

const _intervals = new Float32Array(SAMPLES);
const _sorted = new Float32Array(SAMPLES);
let _count = 0;
let _next = 0;
let _lastTick = 0;

class FramePacer {
	/**
	 * Record a rAF callback, rendered or not
	 *
	 * @param {number} now rAF timestamp (ms)
	 */
	static sample(now) {
		const interval = now - _lastTick;
		_lastTick = now;
		if (interval <= 0 || interval > MAX_INTERVAL) {
			return;
		}
		_intervals[_next] = interval;
		_next = (_next + 1) % SAMPLES;
		_count = Math.min(_count + 1, SAMPLES);
	}

	/**
	 * Measured refresh interval: the median of the recent rAF intervals,
	 * or 0 while there are too few
	 *
	 * @return {number} ms
	 */
	static refreshInterval() {
		if (_count < MIN_SAMPLES) {
			return 0;
		}
		const sorted = _sorted.subarray(0, _count);
		sorted.set(_intervals.subarray(0, _count));
		sorted.sort();
		return sorted[_count >> 1];
	}

	/**
	 * How many refreshes each frame lasts, for a limit
	 *
	 * @param {number} limit fps
	 * @param {number} refresh refresh interval (ms)
	 * @return {number} 1 or more
	 */
	static refreshesPerFrame(limit, refresh) {
		return Math.max(1, Math.round(1000 / limit / refresh));
	}

	/**
	 * Whether a frame is due, and from when the next one counts
	 *
	 * @param {number} now rAF timestamp (ms)
	 * @param {number} last value returned for the previous frame
	 * @param {number} limit fps, above 0
	 * @return {number} the new `last` when a frame is due, or -1 to skip
	 */
	static next(now, last, limit) {
		const elapsed = now - last;
		const refresh = FramePacer.refreshInterval();

		if (!refresh) {
			// By time, as before: keep to the interval grid, so the rate
			// does not drift below the limit
			const interval = 1000 / limit;
			return elapsed < interval ? -1 : now - (elapsed % interval);
		}

		// Half a refresh of tolerance absorbs rAF timestamp jitter
		const frames = FramePacer.refreshesPerFrame(limit, refresh);
		return elapsed < (frames - 0.5) * refresh ? -1 : now;
	}

	/**
	 * Forget the measured refresh rate (for tests, or a display change)
	 */
	static reset() {
		_count = 0;
		_next = 0;
		_lastTick = 0;
	}
}

/**
 * Export
 */
export default FramePacer;
