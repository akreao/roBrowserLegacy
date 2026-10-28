import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { STONE, VENOM_KNIFE, planThrow, stoneAt, trailAt } from '../../src/Renderer/Effects/ThrownStoneSim.js';
import { throwVenomKnifeEffect, stoneEffect } from '../../src/DB/Effects/ThrowStoneEffect.js';

// Throw Venom Knife (AS_VENOMKNIFE, skill 1004): effect 600 thrown from the caster at the target as
// the damage packet arrives; the Throw Stone flight with the knife's numbers: 8 x 8 units, tinted
// (255, 200, 255), 3 units a tick, an arc of 1 unit, turned 330 degrees at first and spinning 45 a
// tick. No hit flash (skills from 493 up have none). Spec: effect-port/assassin-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Throw Venom Knife effect', () => {
	it('throws 600 from the caster per damage packet, with no hit effect', () => {
		expect(skills).toMatch(/SkillEffect\[SK\.AS_VENOMKNIFE\] = \{ damageEffectIdOnCaster: 600 \};/);
	});

	it('keeps the stone numbers it does not change', () => {
		expect(VENOM_KNIFE).toMatchObject({ lift: STONE.lift, moveUntil: 1.05, fade: 20, trail: [150, 25, 25] });
		expect(VENOM_KNIFE).toMatchObject({ speed: 3, arc: 1, spin: 45, startAngle: 330, half: 4 });
		expect(STONE).toMatchObject({ speed: 2, arc: 10, spin: 10, startAngle: 0, half: 2 });
	});

	it('flies 3 units a tick in a 1 unit arc, spinning 45 degrees from 330', () => {
		const t = planThrow([0, 0, 0], [30, 0, 0], VENOM_KNIFE);
		expect(t.ticks).toBe(11);
		expect(stoneAt(t, 0)).toMatchObject({ x: 0, up: 8, alpha: 255, angle: 330 });
		expect(stoneAt(t, 2).angle).toBe(60);
		const mid = stoneAt(t, 5);
		expect(mid.x).toBe(15);
		expect(mid.up).toBeCloseTo(8 + Math.sin((Math.PI * 5) / 11), 6);
		expect(trailAt(t, 0, 3).alpha).toBe(105);
	});

	it('draws the knife 8 units across, tinted, from the caster', () => {
		const t = planThrow([0, 0, 0], [30, 0, 0], VENOM_KNIFE);
		const e = stoneEffect(t, -1);
		expect(e.file).toBe(VENOM_KNIFE.texture);
		expect([e.red, e.green, e.blue]).toEqual([1, 200 / 255, 1]);
		expect(e.track(0).size).toBeCloseTo(8 * 7, 6);
	});

	it('spawns the knife and three trailing copies as 600', () => {
		const spawned = [];
		const [row] = throwVenomKnifeEffect;
		row.func.call(
			{ spamEffect: p => spawned.push(p) },
			{
				Inst: { startTick: 0 },
				Init: { ownerEntity: { position: [10, 10, 0] }, otherEntity: { position: [14, 10, 0] } }
			}
		);
		expect(spawned).toHaveLength(4);
		expect(spawned.every(p => p.Inst.effectID === 600)).toBe(true);
	});
});
