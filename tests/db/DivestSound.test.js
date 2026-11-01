import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Divest Weapon / Shield / Armor / Helm (RG_STRIPWEAPON 215 - RG_STRIPHELM 218): the official client
// plays the strip STR of 269-272 on the target and the sound 복호격.wav on tick 6, not t_벽튕김.wav.
// Spec: effect-port/rogue-skills.md.

const table = effectTableSource();

describe('Divest sound', () => {
	it('plays 복호격 on tick 6 with each strip STR', () => {
		for (const part of ['weapon', 'shield', 'armor', 'helm']) {
			expect(table).toMatch(
				new RegExp(`file: 'strip_${part}',\\s*wav: 'effect/\\\\xba\\\\xb9\\\\xc8\\\\xa3\\\\xb0\\\\xdd',[^\\n]*\\s*delayWav: 100,`)
			);
		}
	});
});
