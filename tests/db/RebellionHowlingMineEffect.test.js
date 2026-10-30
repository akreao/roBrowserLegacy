import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import SkillEffect from '../../src/DB/Skills/SkillEffect.js';
import SK from '../../src/DB/Skills/SkillConst.js';
import StatusEffectTable from '../../src/DB/Status/StatusEffectTable.js';
import StatusConst from '../../src/DB/Status/StatusConst.js';

// Howling Mine (RL_H_MINE, skill 2562): the official client's skilleffectinfo row only plays RL_H_MINE.wav
// as each damage packet arrives. The mine, 1139 (RL_h_mine\mine.str), comes from the H_MINE status: kept
// on the actor while the status is on, removed when it ends. kRO 2025-07-16.
// Spec: effect-port/rebellion-skills.md.

const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');
const row = key => {
	const at = table.indexOf(`\n\t${key}: [`);
	return table.slice(at, table.indexOf('\n\t],', at));
};

describe('Howling Mine', () => {
	it('plays only the sound as each damage packet arrives', () => {
		expect(SkillEffect[SK.RL_H_MINE]).toEqual({ damageEffectIdOnTarget: 'ef_rl_h_mine' });
		expect(row('ef_rl_h_mine')).toContain("wav: 'effect/rl_h_mine'");
		expect(row('ef_rl_h_mine')).not.toContain('STR');
	});

	it('keeps the mine on the actor while the H_MINE status is on', () => {
		expect(StatusEffectTable[StatusConst.H_MINE]).toEqual({ loop: [1139] });
		expect(row('1139')).toContain("file: 'rl_h_mine/mine'");
		expect(row('1139')).toContain('repeat: true');
	});
});
