import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import SkillEffect from '../../src/DB/Skills/SkillEffect.js';
import SK from '../../src/DB/Skills/SkillConst.js';
import StatusEffectTable from '../../src/DB/Status/StatusEffectTable.js';
import StatusConst from '../../src/DB/Status/StatusConst.js';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Quick Draw Shot (RL_QD_SHOT, skill 2559): the official client plays 1076 (RL_QUICK_DRAW\qd2.str) at the
// actor's position when the E_QD_SHOT_READY status starts and again when it ends. Its use packet case
// (1076 at the target, result set) is not used: rAthena sends no use packet for the skill.
// kRO 2025-07-16. Spec: effect-port/rebellion-skills.md.

const table = effectTableSource();

describe('Quick Draw Shot', () => {
	it('plays qd2.str at the actor when the ready status starts and ends', () => {
		expect(StatusEffectTable[StatusConst.E_QD_SHOT_READY]).toEqual({ start: [1076], end: [1076] });
	});

	it('has a world-placed row with the client file', () => {
		const at = table.indexOf('\n\t1076: [');
		const row = table.slice(at, table.indexOf('\n\t],', at));
		expect(row).toContain("file: 'rl_quick_draw/qd2'");
		expect(row).toContain('attachedEntity: false');
	});

	it('keeps the skill row empty', () => {
		expect(SkillEffect[SK.RL_QD_SHOT]).toEqual({});
	});
});
