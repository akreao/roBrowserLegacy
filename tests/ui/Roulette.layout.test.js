import { describe, it, expect } from 'vitest';
import {
	ROWS,
	rowLength,
	cellPosition,
	highlightRect,
	nextRowOffset,
	isStartVisible,
	isPrizeButtonVisible,
	spinFrames
} from '../../src/UI/Components/Roulette/RouletteLayout.js';

describe('Roulette board layout (official UIRoulletteWnd)', () => {
	it('places cells on the stepped grid x = (col+row)*36+159, y = 344-row*40', () => {
		expect(cellPosition(0, 0)).toEqual({ x: 159, y: 344 });
		expect(cellPosition(0, 8)).toEqual({ x: 447, y: 344 });
		expect(cellPosition(6, 0)).toEqual({ x: 375, y: 104 });
		expect(cellPosition(3, 2)).toEqual({ x: 339, y: 224 });
	});

	it('right-aligns every row: the last cell of each row is in the same column', () => {
		for (let row = 0; row < ROWS; row++) {
			expect(cellPosition(row, rowLength(row) - 1).x).toBe(447);
		}
		expect(rowLength(0)).toBe(9);
		expect(rowLength(6)).toBe(3);
	});

	it('centres the 36x36 spin box on the cell', () => {
		const cell = cellPosition(2, 4);
		const box = highlightRect(2, 4);
		expect(box.x).toBe(cell.x - 4);
		expect(box.y).toBe(cell.y - 4);
		expect(box.width).toBe(36);
		expect(box.height).toBe(36);
	});
});

describe('Roulette rules', () => {
	const base = { step: 0, spinning: false, hasPrize: false, losing: false, gold: 0, silver: 0, bronze: 0 };

	it('starts bronze on row 0, silver on row 2, gold on row 4', () => {
		expect(nextRowOffset({ ...base, bronze: 1, silver: 10, gold: 10 })).toBe(0);
		expect(nextRowOffset({ ...base, silver: 10, gold: 10 })).toBe(2);
		expect(nextRowOffset({ ...base, gold: 10 })).toBe(4);
		expect(nextRowOffset({ ...base, silver: 9, gold: 9 })).toBe(0);
	});

	it('goes up one row after a prize, but not after a blank or on the last row', () => {
		expect(nextRowOffset({ ...base, hasPrize: true, step: 2 })).toBe(1);
		expect(nextRowOffset({ ...base, hasPrize: true, step: 2, losing: true })).toBe(0);
		expect(nextRowOffset({ ...base, hasPrize: true, step: 6 })).toBe(0);
	});

	it('shows Start only with coins or a prize, never while spinning or on the last row', () => {
		expect(isStartVisible(base)).toBe(false);
		expect(isStartVisible({ ...base, bronze: 1 })).toBe(true);
		expect(isStartVisible({ ...base, silver: 10 })).toBe(true);
		expect(isStartVisible({ ...base, hasPrize: true, step: 3 })).toBe(true);
		expect(isStartVisible({ ...base, bronze: 1, spinning: true })).toBe(false);
		expect(isStartVisible({ ...base, hasPrize: true, step: 6 })).toBe(false);
	});

	it('shows GetWinPrize only while a prize is held', () => {
		expect(isPrizeButtonVisible(base)).toBe(false);
		expect(isPrizeButtonVisible({ ...base, hasPrize: true })).toBe(true);
	});
});

describe('Roulette spin', () => {
	it('starts on the rightmost cell and stops on the prize', () => {
		for (let step = 0; step < ROWS; step++) {
			for (let idx = 0; idx < rowLength(step); idx++) {
				const frames = spinFrames(step, idx);
				expect(frames[0]).toEqual({ col: rowLength(step) - 1, time: 0 });
				expect(frames[frames.length - 1].col).toBe(idx);
			}
		}
	});

	it('runs seven full laps that slow down by 34% each', () => {
		const frames = spinFrames(6, 0);
		// Row 6 has 3 cells: 2 moves and a jump back per lap, then 2 moves
		expect(frames.length).toBe(1 + 7 * 3 + 2);
		expect(frames[1].time).toBe(35);
		expect(frames[2].time).toBe(70);
		// Jump back after the old delay, next move after the new one
		expect(frames[3]).toEqual({ col: 2, time: 105 });
		expect(frames[4].time).toBe(70 + 46);
	});

	it('only moves forward in time', () => {
		const frames = spinFrames(0, 5);
		for (let i = 1; i < frames.length; i++) {
			expect(frames[i].time).toBeGreaterThanOrEqual(frames[i - 1].time);
		}
	});
});
