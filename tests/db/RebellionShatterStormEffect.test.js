import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import SkillEffect from '../../src/DB/Skills/SkillEffect.js';
import SK from '../../src/DB/Skills/SkillConst.js';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Shatter Storm (RL_S_STORM, skill 2557): the official client's skilleffectinfo row plays
// RL_S_STORM.wav and launches 1078 (RL_STORM\S_STORM.str) on the target as each damage packet
// arrives. No hit flash. kRO 2025-07-16. Spec: effect-port/rebellion-skills.md.

const table = effectTableSource();

describe('Shatter Storm', () => {
	it('plays its effect on the target as each damage packet arrives', () => {
		expect(SkillEffect[SK.RL_S_STORM]).toEqual({ damageEffectIdOnTarget: 'ef_s_storm' });
	});

	it('loads the STR from the client folder', () => {
		const at = table.indexOf('\tef_s_storm: [');
		const row = table.slice(at, at + 250);
		expect(row).toContain("file: 'rl_storm/s_storm'");
		expect(row).toContain("texturePath: 'rl_storm/'");
		expect(row).toContain("wav: 'effect/RL_S_STORM'");
	});
});
