import { describe, expect, it, vi, beforeEach } from 'vitest';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';

let current;
vi.mock('Renderer/EntityManager.js', () => ({ default: { get: () => current } }));

import EffectTable from 'DB/Effects/EffectTable.js';
import CasterMarks, { SCHEDULES, castSpinStep, castSpinTurn, turnedDirection } from 'Renderer/Effects/CasterMarks.js';

// Chase Walk (ST_CHASEWALK, skill 389) in the official client (kRO 2025-07-16):
// - cast start: cast aura 1195 instead of the element aura. 1195 plays EF_BeginSpell.wav on tick 0
//   and, while the caster can be seen, turns its facing 12 degrees a tick on ages 0-15, 18 on 16-30,
//   24 on 31-40, then 48;
// - use packet, result set: a smoke puff (smoke.spr) where the caster stands, going into and out of hiding.
// Spec: effect-port/stalker-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Chase Walk smoke', () => {
	it('puffs smoke on the caster when the skill works', () => {
		expect(skills).toContain(
			"SkillEffect[SK.ST_CHASEWALK] = { castAuraEffectId: 1195, successEffectIdOnCaster: 'ef_chase_walk_smoke' };"
		);
	});

	it('leaves the smoke where the caster stood', () => {
		expect(EffectTable.ef_chase_walk_smoke).toEqual([{ type: 'SPR', file: 'smoke', attachedEntity: false }]);
	});
});

describe('Chase Walk cast spin (1195)', () => {
	beforeEach(() => {
		current = { GID: 1, direction: 0, isVisible: () => true };
	});

	it('turns faster and faster', () => {
		expect([0, 15, 16, 30, 31, 40, 41, 60].map(castSpinStep)).toEqual([12, 12, 18, 18, 24, 24, 48, 48]);
		expect(castSpinTurn(0)).toBe(12);
		expect(castSpinTurn(15)).toBe(192);
		// 16 x 12 + 14 x 18 = 444 degrees by the end of a 0.5 s cast
		expect(castSpinTurn(29)).toBe(444 - 360);
	});

	it('only turns the caster, no other mark', () => {
		expect(SCHEDULES[1195](20)).toEqual({
			add: false,
			glow: false,
			split: false,
			color: null,
			turn: castSpinTurn(20),
			whileVisible: true
		});
	});

	it('turns the caster from where it faced', () => {
		const marks = new CasterMarks(current, 0, 31, 1195);
		marks.render(null, (15 * 1000) / 60 + 1);
		expect(current.direction).toBe(turnedDirection(0, 192));
		marks.render(null, (29 * 1000) / 60 + 1);
		expect(current.direction).toBe(turnedDirection(0, 84));
	});

	it('does not turn a hidden caster', () => {
		current.isVisible = () => false;
		current.direction = 3;
		const marks = new CasterMarks(current, 0, 31, 1195);
		marks.render(null, (15 * 1000) / 60 + 1);
		expect(current.direction).toBe(3);
	});

	it('plays EF_BeginSpell.wav and lasts the cast', () => {
		const [row] = EffectTable[1195];
		expect(row).toMatchObject({ type: 'FUNC', attachedEntity: true, castLoop: true, wav: 'effect/ef_beginspell' });
		const added = [];
		row.func.call({ add: m => added.push(m) }, {
			Init: { ownerEntity: current, duration: 500 },
			Inst: { startTick: 0 }
		});
		// 60 ticks a second: a 0.5 s cast is 30 ticks, a 2 s cast 120
		expect(added[0].frames).toBe(30);
		row.func.call({ add: m => added.push(m) }, {
			Init: { ownerEntity: current, duration: 2000 },
			Inst: { startTick: 0 }
		});
		expect(added[1].frames).toBe(120);
	});
});
