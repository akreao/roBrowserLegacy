import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import SkillEffect from '../../src/DB/Skills/SkillEffect.js';
import SK from '../../src/DB/Skills/SkillConst.js';
import StatusEffectTable from '../../src/DB/Status/StatusEffectTable.js';
import StatusConst from '../../src/DB/Status/StatusConst.js';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Anti-Material Blast (RL_AM_BLAST, skill 2569): the official client's skilleffectinfo row only plays
// RL_AM_BLAST.wav as each damage packet arrives. The ANTI_M_BLAST status keeps 1136
// (RL_anti_material\anti.str) on the actor while it is on. kRO 2025-07-16.
// Spec: effect-port/rebellion-skills.md.

const table = effectTableSource();
const row = key => {
	const at = table.indexOf(`\n\t${key}: [`);
	return table.slice(at, table.indexOf('\n\t],', at));
};

describe('Anti-Material Blast', () => {
	it('plays only its sound as each damage packet arrives', () => {
		expect(SkillEffect[SK.RL_AM_BLAST]).toEqual({ damageEffectIdOnTarget: 'ef_rl_am_blast_sound' });
		expect(row('ef_rl_am_blast_sound')).toContain("wav: 'effect/rl_am_blast'");
	});

	it('keeps anti.str on the actor while the ANTI_M_BLAST status is on', () => {
		expect(StatusEffectTable[StatusConst.ANTI_M_BLAST]).toEqual({ loop: [1136] });
		expect(row('1136')).toContain("file: 'rl_anti_material/anti'");
		expect(row('1136')).toContain('repeat: true');
	});
});
