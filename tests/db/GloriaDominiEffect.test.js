import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import SkillEffect from '../../src/DB/Skills/SkillEffect.js';
import SK from '../../src/DB/Skills/SkillConst.js';
import { NONE_RANGES } from '../../src/DB/Skills/SkillMotionEffect.js';

// Gloria Domini (PA_PRESSURE, 367) as the official client (kRO 2025-07-16) plays it: the holy cast
// aura 58 whatever the packet's element; nothing on the use packet; 365 on the target as the damage
// packet arrives (the falling cross, 프레셔.wav on tick 3, a quake on tick 33); the hit flash 0.
// Spec: effect-port/paladin-skills.md.

const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8').replace(/\r\n/g, '\n');

function row(name) {
	const start = table.indexOf(`\t${name}: [`);
	expect(start).toBeGreaterThan(-1);
	return table.slice(start, table.indexOf('\n\t],', start));
}

describe('Gloria Domini', () => {
	it('plays 365 on the target as the damage packet arrives, with the holy cast aura', () => {
		expect(SkillEffect[SK.PA_PRESSURE]).toEqual({
			castAuraEffectId: 58,
			damageEffectIdOnTarget: 365,
			hitEffectId: 0
		});
	});

	it('has no caster motion effect', () => {
		expect(NONE_RANGES.some(([a, b]) => SK.PA_PRESSURE >= a && SK.PA_PRESSURE <= b)).toBe(true);
	});

	it('365: sound on tick 3, the cross falls 33 ticks turning 15 degrees a tick, quake on tick 33', () => {
		const r = row('365');
		expect(r).toMatch(/wav: 'effect\/\\xc7\\xc1\\xb7\\xb9\\xbc\\xc5',\n\t\t\tdelayWav: 50\n/);
		expect(r).toMatch(/duration: 550,\n\t\t\trotate: true,\n\t\t\tangle: 0,\n\t\t\ttoAngle: -495,/);
		expect(r).toMatch(/duration: 667,\n\t\t\tdelayOffset: 551,\n\t\t\tfadeOut: true,\n\t\t\tangle: -495,/);
		expect(r).toMatch(/Params\.Inst\.startTick \+ 550;\n\t\t\t\tCamera\.setQuake\(start\);/);
	});
});
