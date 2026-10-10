/**
 * UI/Components/Roulette/RouletteLayout.js
 *
 * Board geometry and rules of the official Lucky Roulette window
 * (UIRoulletteWnd, kRO RagexeRE 2020-12-29). Pure functions, no DOM,
 * so the coordinates can be checked in tests.
 *
 * Every coordinate is in window space: (0,0) is the window's top-left
 * corner, title bar included.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/** Window size (MakeWindow 0x10D) */
export const WINDOW_WIDTH = 640;
export const WINDOW_HEIGHT = 497;

/** Rows of the board (rAthena MAX_ROULETTE_LEVEL) */
export const ROWS = 7;

/** Cells in row 0 (rAthena MAX_ROULETTE_COLUMNS); row r has COLUMNS - r */
export const COLUMNS = 9;

/** Coin counters, "%d" static texts (vf14) */
export const COUNTERS = {
	gold: { x: 575, y: 134 },
	silver: { x: 575, y: 218 },
	bronze: { x: 575, y: 302 }
};

/** Bitmap buttons (FUN_00b63c10) */
export const START_BUTTON = { x: 339, y: 398 };
export const PRIZE_BUTTON = { x: 203, y: 398 };

/** The won item, and the bonus ("addition") item (vf17) */
export const PRIZE_SLOT = { x: 189, y: 145 };
export const BONUS_SLOT = { x: 60, y: 135 };

/** Close button: UIFrameWnd's sys_close at (width - 14, 3) */
export const CLOSE_BUTTON = { x: WINDOW_WIDTH - 14, y: 3 };

/** Spin: first step delay in ms, and the factor it grows by after each lap */
export const SPIN_FIRST_DELAY = 35;
export const SPIN_DELAY_GROWTH = 1.34;

/** Full laps before the lap that stops on the prize */
export const SPIN_FULL_LAPS = 7;

/**
 * Number of cells in a row.
 *
 * @param {number} row
 * @returns {number}
 */
export function rowLength(row) {
	return COLUMNS - row;
}

/**
 * Top-left corner of an item icon (vf17): x = (col + row) * 36 + 159,
 * y = 344 - row * 40. Rows step one cell to the right as they go up.
 *
 * @param {number} row
 * @param {number} col - position inside the row
 * @returns {{x: number, y: number}}
 */
export function cellPosition(row, col) {
	return {
		x: (col + row) * 36 + 159,
		y: 344 - row * 40
	};
}

/**
 * Where the item name is shown when the cursor is over a cell (vf25).
 *
 * @param {number} row
 * @param {number} col
 * @returns {{x: number, y: number}}
 */
export function cellTooltipPosition(row, col) {
	return {
		x: (col + row) * 36 + 155,
		y: 330 - row * 40
	};
}

/**
 * The translucent 36x36 box the spin moves and leaves on the prize
 * (FUN_00b622f0, centred on ((col + row) * 36 + 173, 341 - row * 40 + 17)).
 *
 * @param {number} row
 * @param {number} col
 * @returns {{x: number, y: number, width: number, height: number}}
 */
export function highlightRect(row, col) {
	return {
		x: (col + row) * 36 + 155,
		y: 340 - row * 40,
		width: 36,
		height: 36
	};
}

/**
 * Item count text position (FUN_00ad9390): 14px further right below 1000.
 *
 * @param {number} x - icon x
 * @param {number} y - icon y
 * @param {number} count
 * @returns {{x: number, y: number}}
 */
export function countPosition(x, y, count) {
	return {
		x: x + (count < 1000 ? 14 : 0),
		y: y + 15
	};
}

/**
 * Stage arrow drawn beside the current row while the board spins or holds
 * a prize that was not a blank (vf17).
 *
 * @param {number} step
 * @returns {{x: number, y: number}}
 */
export function currentArrowPosition(step) {
	return { x: 482, y: 344 - step * 40 };
}

/**
 * Stage arrow drawn while the cursor is over Start (vf16): the row the
 * next spin plays.
 *
 * @param {number} rowOffset - nextRowOffset()
 * @param {number} step
 * @returns {{x: number, y: number}}
 */
export function nextArrowPosition(rowOffset, step) {
	return { x: 480, y: 337 - (rowOffset + step) * 40 };
}

/**
 * Rows above the current step the next spin starts on (FUN_00b63d80).
 * Holding a prize moves up one row unless it was a blank or the last
 * row; otherwise the coin used decides: bronze row 0, silver row 2,
 * gold row 4.
 *
 * @param {object} state - { step, hasPrize, losing, gold, silver, bronze }
 * @returns {number}
 */
export function nextRowOffset(state) {
	if (state.hasPrize) {
		return state.step + 1 < ROWS && !state.losing ? 1 : 0;
	}
	if (state.bronze > 0) {
		return 0;
	}
	if (state.silver >= 10) {
		return 2;
	}
	if (state.gold >= 10) {
		return 4;
	}
	return 0;
}

/**
 * Start is placed on the window when it is not spinning, the step is not
 * the last row, and there is either a prize to go on from or enough
 * coins (FUN_00b63c10).
 *
 * @param {object} state - { step, spinning, hasPrize, gold, silver, bronze }
 * @returns {boolean}
 */
export function isStartVisible(state) {
	if (state.spinning || state.step === ROWS - 1) {
		return false;
	}
	return !!state.hasPrize || state.bronze > 0 || state.silver >= 10 || state.gold >= 10;
}

/**
 * GetWinPrize is placed on the window only while a prize is held.
 *
 * @param {object} state - { hasPrize }
 * @returns {boolean}
 */
export function isPrizeButtonVisible(state) {
	return !!state.hasPrize;
}

/**
 * The spin as a list of highlight moves (FUN_00b61bf0).
 *
 * The highlight starts on the rightmost cell of the row and steps one cell
 * left every `delay` ms. On reaching the leftmost cell it jumps back to the
 * rightmost and the delay grows by 34% (truncated). After seven such laps
 * it steps left until it reaches the prize, and stops there.
 *
 * @param {number} step - the row being spun
 * @param {number} idx - the column of the prize
 * @returns {Array<{col: number, time: number}>} absolute times in ms from the start
 */
export function spinFrames(step, idx) {
	const last = rowLength(step) - 1;
	const target = Math.max(0, Math.min(idx, last));
	const frames = [{ col: last, time: 0 }];

	let lap = 0;
	let moves = 0;
	let delay = SPIN_FIRST_DELAY;
	let stamp = 0;
	let col = last;

	for (;;) {
		if (lap >= SPIN_FULL_LAPS && last - target <= moves) {
			return frames;
		}
		const time = stamp + delay;
		if (lap < SPIN_FULL_LAPS && moves >= last) {
			// Back to the rightmost cell. The move timestamp is kept, so the
			// next step comes when the longer delay has passed since the last move.
			col = last;
			moves = 0;
			lap++;
			delay = Math.trunc(delay * SPIN_DELAY_GROWTH);
		} else {
			col--;
			moves++;
			stamp = time;
		}
		frames.push({ col, time });
	}
}
