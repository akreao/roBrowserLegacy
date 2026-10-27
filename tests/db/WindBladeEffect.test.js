import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Wind Blade (NJ_HUUJIN, skill 540): the official client plays 621 on the caster as the damage packet
// arrives (풍인.wav at the start, then the blades); no hit effect. Spec: effect-port/ninja-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Wind Blade', () => {
	it('plays 621 on the caster as the damage packet arrives', () => {
		expect(skills).toContain('SkillEffect[SK.NJ_HUUJIN] = { damageEffectIdOnCaster: 621 };');
	});
});
