import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Arrow Vulcan (CG_ARROWVULCAN 394): as each damage packet arrives the official client
// launches 393 on the caster (sound on its tick 30, 500 ms); the arrow flies once per packet;
// the hit plays EF_HIT1 (0) and the hit map's EF_HIT2 (1) once per packet.
// Spec: effect-port/bard-dancer-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');
const effects = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'latin1');

describe('Arrow Vulcan effects', () => {
	it('plays 393 on the caster per damage packet, one arrow, hit flashes once', () => {
		expect(skills).toMatch(
			/SkillEffect\[SK\.CG_ARROWVULCAN\] = \{ damageEffectIdOnCaster: 393, damageEffectIdOnTarget: 'ef_arrow_projectile', hitEffectId: \[0, 1\], hitEffectOnce: true \};/
		);
	});

	it('plays the sound on tick 30', () => {
		expect(effects).toMatch(/\t393: \[\r?\n\t\t\{\r?\n\t\t\t\/\/EF_TRIPLEATTACK3[\s\S]*?delayWav: 500,\r?\n\t\t\tattachedEntity: true/);
	});
});
