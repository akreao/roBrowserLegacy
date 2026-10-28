import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Ganbantein (HW_GANBANTEIN, skill 483), as the kRO 2025-07-16 client plays it: the cast-aura
// picker gives it effect 58 (EF_BEGINSPELL6) with no element swap, and the ground packet plays
// EF_FireWall.wav and the 223 funnel at the cell. Spec: effect-port/high-wizard-audit.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

describe('Ganbantein effects', () => {
	it('casts with aura 58 and plays 223 with its sound', () => {
		expect(read('DB/Skills/SkillEffect.js')).toMatch(
			/SkillEffect\[SK\.HW_GANBANTEIN\] = \{ effectId: \[223, 'ef_ganbantein_wav'\], castAuraEffectId: 58 \};/
		);
	});
});
