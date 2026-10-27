import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Crusader support skills, as the official client's use-packet handler plays them: only when the
// packet's result is set, on the packet's source (the Crusader), except Providence on its target.
// Devotion's 251 goes on the Crusader, not on the devoted player. Spec: effect-port/crusader-skills.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

const onCaster = {
	CR_AUTOGUARD: 336,
	CR_REFLECTSHIELD: 252,
	CR_DEVOTION: 251,
	CR_DEFENDER: 222,
	CR_SPEARQUICKEN: 250
};

describe('Crusader support skill effects', () => {
	for (const [skill, effectId] of Object.entries(onCaster)) {
		it(`${skill} plays ${effectId} on the caster, only on success`, () => {
			expect(source).toMatch(
				new RegExp(`SkillEffect\\[SK\\.${skill}\\] = \\{ successEffectIdOnCaster: ${effectId} \\};`)
			);
		});
	}

	it('CR_PROVIDENCE plays 248 on the target, only on success', () => {
		expect(source).toMatch(/SkillEffect\[SK\.CR_PROVIDENCE\] = \{ successEffectId: 248 \};/);
	});
});
