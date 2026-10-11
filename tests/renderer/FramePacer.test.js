import { beforeEach, describe, expect, it } from 'vitest';
import FramePacer from 'Renderer/FramePacer.js';

/**
 * Drive the pacer the way Renderer._render does, with rAF firing at `hz`
 * (plus a little timestamp jitter), and return the intervals between the
 * frames it let through after the refresh rate is known.
 */
function run(hz, limit, { seconds = 2, jitter = 0.2 } = {}) {
	const refresh = 1000 / hz;
	const frames = [];
	let last = 0;
	for (let i = 0; i < hz * seconds; i++) {
		const now = 1000 + i * refresh + (i % 2 ? jitter : -jitter);
		FramePacer.sample(now);
		if (last === 0) {
			last = now;
		}
		const next = FramePacer.next(now, last, limit);
		if (next >= 0) {
			last = next;
			if (i > 40) {
				frames.push(now);
			}
		}
	}
	return frames.slice(1).map((t, i) => t - frames[i]);
}

const refreshes = (intervals, hz) => [...new Set(intervals.map(ms => Math.round(ms / (1000 / hz))))];

beforeEach(() => FramePacer.reset());

describe('FramePacer', () => {
	it('does not throttle when the limit is the refresh rate or near it', () => {
		// 60 fps on 75 Hz: every refresh, not 3 frames in 4
		expect(refreshes(run(75, 60), 75)).toEqual([1]);
		FramePacer.reset();
		expect(refreshes(run(60, 60), 60)).toEqual([1]);
	});

	it('keeps every frame the same number of refreshes', () => {
		expect(refreshes(run(120, 60), 120)).toEqual([2]);
		FramePacer.reset();
		expect(refreshes(run(144, 60), 144)).toEqual([2]); // 72 fps
		FramePacer.reset();
		expect(refreshes(run(165, 60), 165)).toEqual([2]); // 82.5 fps
		FramePacer.reset();
		expect(refreshes(run(60, 30), 60)).toEqual([2]);
		FramePacer.reset();
		expect(refreshes(run(75, 30), 75)).toEqual([2]); // 37.5 fps
	});

	it('never paces below the limit', () => {
		for (const hz of [59.94, 60, 75, 119.88, 120, 144, 165, 240]) {
			for (const limit of [30, 60, 90, 120]) {
				const refresh = 1000 / hz;
				const frames = FramePacer.refreshesPerFrame(limit, refresh);
				// 1% slack: 59.94 Hz counts as 60; a limit above the refresh
				// rate gets every refresh
				expect(hz / frames).toBeGreaterThanOrEqual(Math.min(limit, hz) * 0.99);
				// and not more refreshes per frame than that allows
				expect(hz / (frames + 1)).toBeLessThan(limit * 0.99);
			}
		}
		expect(FramePacer.refreshesPerFrame(90, 1000 / 144)).toBe(1);
		expect(FramePacer.refreshesPerFrame(60, 1000 / 119.88)).toBe(2);
		expect(FramePacer.refreshesPerFrame(60, 1000 / 59.94)).toBe(1);
	});

	it('measures the refresh interval from rAF timestamps', () => {
		run(75, 60, { seconds: 1 });
		expect(FramePacer.refreshInterval()).toBeCloseTo(1000 / 75, 0);
	});

	it('limits by time until the refresh rate is known', () => {
		FramePacer.sample(1000);
		expect(FramePacer.refreshInterval()).toBe(0);
		expect(FramePacer.next(1010, 1000, 60)).toBe(-1);
		expect(FramePacer.next(1020, 1000, 60)).toBeCloseTo(1020 - (20 % (1000 / 60)), 5);
	});

	it('ignores gaps that are not refreshes', () => {
		for (let i = 0; i < 20; i++) {
			FramePacer.sample(1000 + i * 16.667);
		}
		FramePacer.sample(5000); // a hidden tab
		expect(FramePacer.refreshInterval()).toBeCloseTo(16.667, 1);
	});
});
