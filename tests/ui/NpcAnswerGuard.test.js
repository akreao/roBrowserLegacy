/**
 * tests/ui/NpcAnswerGuard.test.js
 *
 * NPC Next and menu OK are ignored within 300 ms of the previous answer,
 * as in the official client.
 */
import { beforeEach, expect, it } from 'vitest';
import { resetNpcAnswer, takeNpcAnswer } from 'UI/Components/NpcBox/NpcAnswerGuard.js';

beforeEach(() => resetNpcAnswer());

it('lets the first answer through and drops one 299 ms later', () => {
	expect(takeNpcAnswer(1000)).toBe(true);
	expect(takeNpcAnswer(1299)).toBe(false);
});

it('lets an answer through 300 ms after the last accepted one', () => {
	expect(takeNpcAnswer(1000)).toBe(true);
	expect(takeNpcAnswer(1200)).toBe(false);
	expect(takeNpcAnswer(1300)).toBe(true);
});
