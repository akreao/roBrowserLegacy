import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

vi.mock('Renderer/EntityManager.js', () => ({ default: { get: () => null } }));

import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import SC from 'DB/Status/StatusConst.js';
import StatusEffectTable from 'DB/Status/StatusEffectTable.js';
import { SCHEDULES } from 'Renderer/Effects/CasterMarks.js';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Assumptio in the official client (kRO 2025-07-16): the use packet plays 375 and 440 on the target
// when its result is set; status 110 keeps 375 on the actor while it is on; 375 draws a glow copy
// round the actor on every tick. Spec: effect-port/priest-audit.md.
const effectTable = effectTableSource().replace(/\r\n/g, '\n');

describe('Assumptio', () => {
	it('plays 375 and 440 on success', () => {
		expect(SkillEffect[SK.HP_ASSUMPTIO]).toEqual({ successEffectId: [375, 440] });
	});

	it('keeps 375 on the actor while the status is on', () => {
		expect(StatusEffectTable[SC.ASSUMPTIO]).toEqual({ loop: [375] });
	});

	it('375 draws a glow copy on every tick', () => {
		for (const age of [0, 1, 59, 6000]) {
			expect(SCHEDULES[375](age)).toEqual({ add: false, glow: true, split: false, color: null });
		}
		const start = effectTable.indexOf('\n\t375: [');
		const row = effectTable.slice(start, effectTable.indexOf('\n\t],', start));
		expect(row).toContain('new CasterMarks(Params.Init.ownerEntity, Params.Inst.startTick, 99999, 375)');
	});
});
