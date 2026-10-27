import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Fire Pillar (WZ_FIREPILLAR, skill 80), as the official client shows it on our server: nothing
// from the ground packet; the waiting unit (0x87) holds 138; when the pillar goes off the server
// sends the active unit (0x88), which plays FirePillarBomb.str with wizard_fire_pillar_b.wav (97)
// once; the damage comes from that unit, so each hit shows only the standard hit flash (0).
// FirePillar.str (96) is only for damage a character deals, which never happens here.
// Spec: effect-port/wizard-audit.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

describe('Fire Pillar effects', () => {
	it('plays nothing at the cell and the hit flash per unit hit', () => {
		expect(read('DB/Skills/SkillEffect.js')).toMatch(
			/SkillEffect\[SK\.WZ_FIREPILLAR\] = \{ groundEffectId: 138, hitEffectId: \[0\] \};/
		);
	});

	it('shows 138 on the waiting unit and 97 once on the active unit', () => {
		const units = read('DB/Skills/SkillUnit.js');
		expect(units).toContain('SkillUnit[SU.UNT_FIREPILLAR_WAITING] = EC.EF_FIREPILLARON;');
		expect(units).toContain('SkillUnit[SU.UNT_FIREPILLAR_ACTIVE] = EC.EF_FIREPILLARBOMB;');
		const table = read('DB/Effects/EffectTable.js');
		const start = table.indexOf('\n\t97: [');
		const bomb = table.slice(start, table.indexOf('\n\t],', start));
		expect(bomb).toContain("file: 'firepillarbomb'");
		expect(bomb).toContain('repeat: false');
	});
});
