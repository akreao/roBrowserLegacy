import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Meteor Storm (WZ_METEOR, skill 83), as the official client plays it: each meteor's ground
// packet launches 92 at its cell, which picks one of Meteor1-3.str (the GRF's meteor4.str is
// never used), plays wizard_meteor.wav and shakes the camera on tick 40. The server deals the
// damage from the meteor units; for unit damage the client plays only the standard hit flash
// (0), once per hit. Spec: effect-port/wizard-audit.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function entry(id) {
	const table = effectTableSource().replace(/\r\n/g, '\n');
	const start = table.indexOf(`\n\t${id}: [`);
	return table.slice(start, table.indexOf('\n\t],', start));
}

describe('Meteor Storm effects', () => {
	it('plays 92 at each meteor cell and the hit flash per hit', () => {
		expect(read('DB/Skills/SkillEffect.js')).toMatch(
			/SkillEffect\[SK\.WZ_METEOR\] = \{ effectId: 92, hitEffectId: \[0\] \};/
		);
	});

	it('picks one of three meteors and quakes on tick 40', () => {
		const meteor = entry(92);
		expect(meteor).toContain("file: 'meteor%d'");
		expect(meteor).toContain('rand: [1, 3]');
		expect(meteor).toContain('Params.Inst.startTick + 2000 / 3');
	});
});
