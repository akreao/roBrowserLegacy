import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import SkillEffect from '../../src/DB/Skills/SkillEffect.js';
import SK from '../../src/DB/Skills/SkillConst.js';

// Fire Dance (RL_FIREDANCE, skill 2561): the official client's skilleffectinfo row plays 데스페라도.wav and
// launches 1133 (RL_fire_dance\firedance.str) on the caster when the use packet has the result set, and
// launches 647 (EF_TRACKING) on the target as each damage packet arrives. No hit flash. kRO 2025-07-16.
// Spec: effect-port/rebellion-skills.md.

const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');

describe('Fire Dance', () => {
	it('plays the sound and firedance.str on the caster on success, 647 on each target at damage arrival', () => {
		expect(SkillEffect[SK.RL_FIREDANCE]).toEqual({
			successEffectIdOnCaster: ['ef_rl_firedance_sound', 'ef_rl_firedance'],
			damageEffectIdOnTarget: 647
		});
	});

	it('has the Desperado sound row', () => {
		const at = table.indexOf('\tef_rl_firedance_sound: [');
		expect(table.slice(at, at + 150)).toContain(
			"wav: 'effect/\\xb5\\xa5\\xbd\\xba\\xc6\\xe4\\xb6\\xf3\\xb5\\xb5'"
		);
	});
});
