import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import SkillEffect from '../../src/DB/Skills/SkillEffect.js';
import SK from '../../src/DB/Skills/SkillConst.js';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Banishing Buster (RL_BANISHING_BUSTER, skill 2554): the official client's skilleffectinfo row plays
// RL_BANISHING_BUSTER.wav and launches 1066 (RL_BANISHING_BUSTER\vanishing1.str) on the target as each
// damage packet arrives. No hit flash. kRO 2025-07-16. Spec: effect-port/rebellion-skills.md.

const table = effectTableSource();

describe('Banishing Buster', () => {
	it('plays its effect on the target as each damage packet arrives', () => {
		expect(SkillEffect[SK.RL_BANISHING_BUSTER]).toEqual({ damageEffectIdOnTarget: 'ef_rl_banishing_buster' });
	});

	it('has a row with the client file and sound', () => {
		const row = table.slice(table.indexOf('\tef_rl_banishing_buster: ['), table.indexOf('\tef_rl_banishing_buster: [') + 300);
		expect(row).toContain("file: 'rl_banishing_buster/vanishing1'");
		expect(row).toContain("wav: 'effect/rl_banishing_buster'");
	});
});
