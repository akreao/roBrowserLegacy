import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import SkillEffect from '../../src/DB/Skills/SkillEffect.js';
import SK from '../../src/DB/Skills/SkillConst.js';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Flicker (RL_FLICKER, skill 2556): when the use packet has the result set, the official client's
// skilleffectinfo row plays RL_FLICKER.wav, then launches 153 (EF_CONCENTRATION) on the caster.
// kRO 2025-07-16. Spec: effect-port/rebellion-skills.md.

const table = effectTableSource();

describe('Flicker', () => {
	it('plays its sound and 153 on the caster on success only', () => {
		expect(SkillEffect[SK.RL_FLICKER]).toEqual({ successEffectIdOnCaster: ['ef_rl_flicker_sound', 153] });
	});

	it('has a sound row', () => {
		const at = table.indexOf('\tef_rl_flicker_sound: [');
		expect(at).toBeGreaterThan(0);
		expect(table.slice(at, at + 120)).toContain("wav: 'effect/rl_flicker'");
	});
});
