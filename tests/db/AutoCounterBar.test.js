import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const { autoCounterBarMs, AUTO_COUNTER_MS_PER_LEVEL } = await import('DB/Skills/AutoCounterBar.js');

// Auto Counter (KN_AUTOCOUNTER, skill 61), as the official client shows it: on the use packet a cast
// bar of level x 400 ms, on the player's own character only, closed by ZC_DISPEL. No effect plays for
// the stance or when the counter fires. Spec: effect-port/knight-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

describe('Auto Counter stance bar', () => {
	it('lasts 400 ms a level for the local player', () => {
		expect(AUTO_COUNTER_MS_PER_LEVEL).toBe(400);
		expect([1, 2, 3, 4, 5].map(lv => autoCounterBarMs(lv, true, 1))).toEqual([400, 800, 1200, 1600, 2000]);
	});

	it('shows nothing for other characters or a failed use', () => {
		expect(autoCounterBarMs(5, false, 1)).toBe(0);
		expect(autoCounterBarMs(5, true, 0)).toBe(0);
	});

	it('opens from the use packet, not the cast packet, and plays no 131 on the counter', () => {
		const entity = read('Engine/MapEngine/Entity.js');
		expect(entity).toContain('autoCounterBarMs(pkt.level, srcEntity === Session.Entity, pkt.result)');
		expect(entity).not.toContain('srcEntity.cast.set(1000)');
		expect(entity).not.toContain('EF_AUTOCOUNTER');
		expect(entity).not.toContain('underAutoCounter');
	});
});
