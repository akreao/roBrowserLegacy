import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { NINJA_ITEM, planThrow, stoneAt, trailAt } from '../../src/Renderer/Effects/ThrownStoneSim.js';
import { NINJA_TEXTURES, ninjaThrowEffects, stoneEffect } from '../../src/DB/Effects/ThrowStoneEffect.js';

// Throw Shuriken / Kunai / Huuma / Zeny (NJ_SYURIKEN 523 ... NJ_ZENYNAGE 526): the official client throws
// 613-616 from the caster at the target once per damage packet, as it arrives: the item image 8 units
// across, 3 units a tick, almost flat, spinning 45 degrees a tick, tinted (255, 200, 255), three
// trailing copies, no sound; no hit effect. Spec: effect-port/ninja-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');
const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');

describe('Ninja throws', () => {
	it('throw once per damage packet from the caster, with no hit effect', () => {
		[
			['NJ_SYURIKEN', 613],
			['NJ_KUNAI', 614],
			['NJ_HUUMA', 615],
			['NJ_ZENYNAGE', 616]
		].forEach(([skill, id]) => {
			expect(skills).toContain(`SkillEffect[SK.${skill}] = { damageEffectIdOnCaster: ${id} };`);
			expect(table).toContain(`${id}: ninjaThrowEffects[${id}],`);
		});
	});

	it('fly at 3 units a tick, nearly flat, spinning 45 degrees a tick from 330', () => {
		const t = planThrow([0, 0, 0], [30, 0, 0], NINJA_ITEM);
		expect(t.ticks).toBe(11);
		expect(stoneAt(t, 0)).toMatchObject({ x: 0, up: 8, alpha: 255, angle: 330 });
		expect(stoneAt(t, 1).angle).toBe(15);
		const mid = stoneAt(t, 5);
		expect(mid.x).toBeCloseTo(15);
		expect(mid.up).toBeCloseTo(8 + Math.sin((Math.PI * 5) / 11));
		expect(stoneAt(t, 11).x).toBeCloseTo(33);
		expect(stoneAt(t, 15).alpha).toBe(255 - 80);
	});

	it('trail three copies like the stone', () => {
		const t = planThrow([0, 0, 0], [30, 0, 0], NINJA_ITEM);
		expect(trailAt(t, 0, 3)).toMatchObject({ alpha: 105 });
		expect(trailAt(t, 2, 7)).toMatchObject({ alpha: 55 });
	});

	it('draw the item image 8 units across, tinted (255, 200, 255)', () => {
		const t = planThrow([0, 0, 0], [30, 0, 0], NINJA_ITEM);
		const e = stoneEffect(t, -1, NINJA_TEXTURES[614]);
		expect(e.file).toBe(NINJA_TEXTURES[614]);
		expect(e.track(5).size).toBeCloseTo(56);
		expect([e.red, e.green, e.blue]).toEqual([1, 200 / 255, 1]);
		expect(NINJA_TEXTURES[616]).toBe('effect/coin_a.bmp');
	});

	it('have no sound of their own and spawn the item and its trail at the caster', () => {
		expect(ninjaThrowEffects[613].some(row => row.wav)).toBe(false);
		const spawned = [];
		ninjaThrowEffects[615][0].func.call(
			{ spamEffect: p => spawned.push(p) },
			{
				Init: { ownerEntity: { position: [10, 20, 0] }, otherEntity: { position: [16, 20, 0] } },
				Inst: { startTick: 100 }
			}
		);
		expect(spawned).toHaveLength(4);
		expect(spawned[0].Inst.effectID).toBe(615);
		expect(spawned[0].effect.file).toBe(NINJA_TEXTURES[615]);
		expect(spawned[0].effect.track(10).x).toBeCloseTo(30 / 5);
	});
});
