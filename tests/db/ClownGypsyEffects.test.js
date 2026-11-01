import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Clown / Gypsy skills, use packet (result set) in the official client: Moonlit Water Mill
// plays the moonlight sound (dal-bit.wav) and 394 on the caster; Longing for Freedom ac_concentration.wav and
// the white cone 843; Wand of Hermode only its sound; Tarot Card of Fate priest_slowpoison.wav
// and 500 on the target. Spec: effect-port/bard-dancer-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');
const effects = effectTableSource('latin1');

describe('Clown and Gypsy use effects', () => {
	it('plays them on success only', () => {
		expect(skills).toMatch(/SkillEffect\[SK\.CG_MOONLIT\] = \{ successEffectId: 394, groundEffectId: '394_ground' \};/);
		expect(skills).toMatch(
			/SkillEffect\[SK\.CG_LONGINGFREEDOM\] = \{ successEffectId: \['ef_longing_freedom_sound', 843\] \};/
		);
		expect(skills).toMatch(/SkillEffect\[SK\.CG_HERMODE\] = \{ successEffectId: '517_music', groundEffectId: 517 \};/);
		expect(skills).toMatch(
			/SkillEffect\[SK\.CG_TAROTCARD\] = \{ successEffectId: \['ef_tarot_card_sound', 500\], castAuraEffectId: 58 \};/
		);
	});

	it('uses the client sounds', () => {
		expect(effects).toMatch(/\t394: \[[\s\S]*?wav: 'effect\/\\xb4\\xde\\xba\\xfb',/);
		expect(effects).toMatch(/ef_longing_freedom_sound: \[\r?\n\t\t\{\r?\n\t\t\twav: 'effect\/ac_concentration'/);
		expect(effects).toMatch(/ef_tarot_card_sound: \[\r?\n\t\t\{\r?\n\t\t\twav: 'effect\/priest_slowpoison'/);
	});
});
