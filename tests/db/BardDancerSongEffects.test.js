import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Bard and Dancer songs, dances and ensembles: on a successful use the official client plays
// the song's sound and a bubble cone (840-845) on the caster; A Whistle, Dissonance and Ugly
// Dance have no sound. Nothing plays when the use fails.
// Spec: effect-port/bard-dancer-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');
const effects = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');

const SONGS = {
	BD_LULLABY: '[278, 845]',
	BD_RICHMANKIM: '[279, 842]',
	BD_ETERNALCHAOS: '[280, 844]',
	BD_DRUMBATTLEFIELD: '[281, 842]',
	BD_RINGNIBELUNGEN: '[282, 842]',
	BD_ROKISWEIL: '[283, 845]',
	BD_INTOABYSS: '[284, 842]',
	BD_SIEGFRIED: '[285, 842]',
	BA_DISSONANCE: '843',
	BA_WHISTLE: '844',
	BA_ASSASSINCROSS: '[287, 840]',
	BA_POEMBRAGI: '[288, 843]',
	BA_APPLEIDUN: '[289, 841]',
	DC_UGLYDANCE: '843',
	DC_HUMMING: '[291, 844]',
	DC_DONTFORGETME: '[292, 844]',
	DC_FORTUNEKISS: '[293, 840]',
	DC_SERVICEFORYOU: '[294, 840]'
};

const escape = text => text.replace(/[[\]]/g, '\\$&');

describe('Bard and Dancer song use effects', () => {
	for (const [skill, ids] of Object.entries(SONGS)) {
		it(`${skill} plays ${ids} on success only`, () => {
			const row = new RegExp(`SkillEffect\\[SK\\.${skill}\\] = \\{ successEffectId: ${escape(ids)}, groundEffectId: '\\d+_ground' \\};`);
			expect(skills).toMatch(row);
		});
	}

	it('has the purple cone 844 (variant 7)', () => {
		expect(effects).toMatch(/\t844: \[\r?\n\t\t\{\r?\n\t\t\t\/\/EF_BEGINSPELL_N7[\s\S]*?variant: 7/);
	});
});
