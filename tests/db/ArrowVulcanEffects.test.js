import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';

// Arrow Vulcan (CG_ARROWVULCAN 394) in the official client (kRO 2025-07-16): cast aura 58 whatever
// the element; as each damage packet arrives the client launches 393 on the caster (sound on its
// tick 30, 500 ms); the arrow flies once per packet; the hit flash (0) plays on every hit, 200 ms
// apart, and the hit map's EF_HIT2 (1) with the first hit of the packet only.
// Spec: effect-port/clown-gypsy-skills.md.

const effects = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'latin1');

describe('Arrow Vulcan effects', () => {
	it('plays 393 on the caster per damage packet, one arrow, the hit flash on every hit', () => {
		expect(SkillEffect[SK.CG_ARROWVULCAN]).toEqual({
			castAuraEffectId: 58,
			damageEffectIdOnCaster: 393,
			damageEffectIdOnTarget: 'ef_arrow_projectile',
			hitEffectId: 0,
			firstHitEffectId: 1
		});
	});

	it('plays the sound on tick 30', () => {
		expect(effects).toMatch(/\t393: \[\r?\n\t\t\{\r?\n\t\t\t\/\/EF_TRIPLEATTACK3[\s\S]*?delayWav: 500,\r?\n\t\t\tattachedEntity: true/);
	});
});
