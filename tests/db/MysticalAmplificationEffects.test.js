import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Mystical Amplification (HW_MAGICPOWER, skill 366), as the kRO 2025-07-16 client plays it: the
// cast-aura picker keeps its default (16), and only a use packet with the result set removes and
// relaunches 382 (the actor's body flag 0x4) and plays the amplify sound. A failed use plays
// nothing. Spec: effect-port/high-wizard-audit.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

describe('Mystical Amplification effects', () => {
	it('plays its sound only on success', () => {
		expect(read('DB/Skills/SkillEffect.js')).toMatch(
			/SkillEffect\[SK\.HW_MAGICPOWER\] = \{ hideCastAura: true, beginCastEffectId: 16, successEffectIdOnCaster: 'ef_magicpower' \};/
		);
	});
});
