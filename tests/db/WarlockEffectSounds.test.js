import { describe, expect, it } from 'vitest';
import EffectTable from 'DB/Effects/EffectTable.js';

// Warlock sounds, kRO 2025-07-16: each CEZ2STREffect plays its own sounds (a per-effect list, each at an age in
// ticks; all of these at age 0). The cast effects play EF_BeginSpell.wav once, not again as they loop. Tetra Vortex's
// cast aura 805 (CRagEffect) plays EF_BeginSpell.wav on its first tick.

describe('Warlock effect sounds', () => {
	it.each([1552, 1587, 1635])('cast effect %i plays EF_BeginSpell.wav once', id => {
		expect(EffectTable[id][0]).toMatchObject({ castLoop: true, wav: 'effect/ef_beginspell', soundLoop: false });
	});

	it.each([
		[1550, 'hell_in'], // Hell Inferno
		[1638, 'chainlight'], // Chain Lightning
		[1413, 'effect/g\xc5\xa9\xb7\xb9\xc0\xcc\xc1\xf6\xc0\xa7\xb5\xe5'], // Comet: effect/g크레이지위드
		[1592, 'effect/\xb8\xc5\xc1\xf7 \xc5\xa9\xb7\xa1\xbd\xac'] // Soul Expansion: effect/매직 크래쉬
	])('effect %i plays %s', (id, wav) => {
		expect(EffectTable[id][0].wav).toBe(wav);
	});

	it('Tetra Vortex cast aura 805 plays EF_BeginSpell.wav', () => {
		expect(EffectTable[805][0].wav).toBe('effect/ef_beginspell');
	});
});
