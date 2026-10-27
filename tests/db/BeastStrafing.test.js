import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Beast Strafing (HT_POWER, skill 499): the official client (kRO 2020-12-29) has
// it in the hit map (effect 1) and gives it no hit flash (skills from 493 on);
// a character's damage packet plays the hit once, whatever the hit count. The
// arrow is the caster's bow attack, one per damage packet (as Arrow Repel).

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Beast Strafing effects', () => {
	it('plays one arrow per damage packet and effect 1 once per packet', () => {
		expect(source).toMatch(
			/SkillEffect\[SK\.HT_POWER\] = \{ damageEffectIdOnTarget: 'ef_arrow_projectile', hitEffectId: 1, hitEffectOnce: true \};/
		);
	});
});
