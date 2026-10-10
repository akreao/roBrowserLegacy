/**
 * tests/ui/BroadcastBalloon.test.js
 *
 * Announcements as the 2026 client shows them (UIBroadcastBalloon): up to three
 * boxes, newest at the bottom, each gone after 20 seconds, ZC_BROADCAST text
 * wrapped at 72 bytes.
 */
import { describe, expect, it, vi } from 'vitest';

const timers = [];
vi.mock('Core/Events.js', () => ({
	default: {
		setTimeout: (fn, delay) => timers.push({ fn, delay }) - 1,
		clearTimeout: id => {
			if (timers[id]) timers[id].fn = null;
		}
	}
}));
vi.mock('UI/CursorManager.js', () => ({ default: { ACTION: { DEFAULT: 0 }, setType: vi.fn(), getActualType: vi.fn() } }));
vi.mock('UI/UIManager.js', () => ({ default: { addComponent: component => component } }));

const { default: BroadcastBalloon, wrapBytes } = await import('UI/Components/BroadcastBalloon/BroadcastBalloon.js');

const lines = () =>
	Array.from(BroadcastBalloon.getRoot().querySelectorAll('.entry')).map(entry =>
		Array.from(entry.querySelectorAll('.line')).map(line => line.textContent)
	);

describe('BroadcastBalloon', () => {
	it('wraps at 72 bytes after the last space, counting non-ASCII as two', () => {
		const words = 'word '.repeat(20).trim(); // 99 bytes
		const wrapped = wrapBytes(words);
		expect(wrapped.length).toBe(2);
		expect(wrapped[0].length).toBeLessThanOrEqual(72);
		expect(wrapped[0].endsWith('word')).toBe(true);
		expect(wrapBytes('가'.repeat(40))).toEqual(['가'.repeat(36), '가'.repeat(4)]);
		expect(wrapBytes('one\ntwo')).toEqual(['one', 'two']);
	});

	it('keeps three announcements, newest at the bottom, and drops the oldest', () => {
		['first', 'second', 'third', 'fourth'].forEach(text => BroadcastBalloon.add(text, '#FFFF00'));
		expect(lines()).toEqual([['second'], ['third'], ['fourth']]);
		expect(timers.every(timer => timer.delay === 20000)).toBe(true);
	});

	it('takes each one away when its 20 seconds are up', () => {
		const live = timers.filter(timer => timer.fn);
		live[0].fn();
		expect(lines()).toEqual([['third'], ['fourth']]);
		live.slice(1).forEach(timer => timer.fn());
		expect(lines()).toEqual([]);
	});

	it('keeps ZC_BROADCAST2 on one line in its colour and size', () => {
		BroadcastBalloon.add('x '.repeat(50), '#FF0000', { wrap: false, fontSize: 14 });
		const line = BroadcastBalloon.getRoot().querySelector('.line');
		expect(lines()[0].length).toBe(1);
		expect(line.style.color).toBe('rgb(255, 0, 0)');
		expect(line.style.fontSize).toBe('14px');
	});
});
