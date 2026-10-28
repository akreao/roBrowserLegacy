import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

vi.mock('Renderer/EntityManager.js', () => ({ default: { get: () => null } }));

import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import SC from 'DB/Status/StatusConst.js';
import StatusEffectTable from 'DB/Status/StatusEffectTable.js';
import { SCHEDULES } from 'Renderer/Effects/CasterMarks.js';

// Marionette Control (CG_MARIONETTE, skill 396) in the official client (kRO 2025-07-16): the use packet
// (result set) plays 395 (소울 체인지.wav on tick 0) and 396 on the caster and 396 on the target. 396 draws
// its actor adding light in pink (255, 89, 182) with a glow copy on every tick while it lives. Each change of
// status MARIONETTE_MASTER (caster) or MARIONETTE (target) removes every 396 on the actor and starts it
// again while the status is on. Spec: effect-port/clown-gypsy-skills.md.

const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'latin1').replace(/\r\n/g, '\n');
const row = id => {
	const start = table.indexOf(`\n\t${id}: [`);
	return table.slice(start, table.indexOf('\n\t],', start));
};

describe('Marionette Control', () => {
	it('plays 395 and 396 on the caster and 396 on the target on success', () => {
		expect(SkillEffect[SK.CG_MARIONETTE]).toEqual({ successEffectIdOnCaster: [395, 396], successEffectId: 396 });
	});

	it('395 plays the soul change sound', () => {
		expect(row(395)).toContain("wav: 'effect/\\xbc\\xd2\\xbf\\xef\\x20\\xc3\\xbc\\xc0\\xce\\xc1\\xf6'");
	});

	it('396 draws a pink added body and a glow copy on every tick', () => {
		for (const age of [0, 1, 59, 60000]) {
			expect(SCHEDULES[396](age)).toEqual({ add: true, glow: true, split: false, color: [255, 89, 182] });
		}
		expect(row(396)).toContain('new CasterMarks(Params.Init.ownerEntity, Params.Inst.startTick, 99999999, 396)');
	});

	it('the statuses keep 396 on the caster and the target until they end', () => {
		expect(StatusEffectTable[SC.MARIONETTE_MASTER]).toEqual({ restart: [396], stop: [396] });
		expect(StatusEffectTable[SC.MARIONETTE]).toEqual({ restart: [396], stop: [396] });
	});
});
