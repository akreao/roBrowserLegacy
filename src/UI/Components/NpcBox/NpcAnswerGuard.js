/**
 * UI/Components/NpcBox/NpcAnswerGuard.js
 *
 * The official client ignores an NPC "Next" or menu OK that comes within
 * 300 ms of the previous one (UISayDialogWnd and UIChooseWnd share one
 * GetTickCount stamp), so a double-click or a held Enter cannot run through
 * dialog pages the player has not seen.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

let _last = -Infinity;

/**
 * @param {number} [now] - current time in ms
 * @return {boolean} true when the answer may go to the server
 */
export function takeNpcAnswer(now = performance.now()) {
	if (now - _last < 300) {
		return false;
	}
	_last = now;
	return true;
}

/**
 * Test helper: forget the last answer.
 */
export function resetNpcAnswer() {
	_last = -Infinity;
}
