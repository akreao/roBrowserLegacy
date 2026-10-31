import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { vi } from 'vitest';

vi.mock('Renderer/Camera.js', () => ({ default: { angle: [0, 0] } }));
vi.mock('Renderer/Renderer.js', () => ({ default: { width: 800, height: 600 } }));
const { facingAngle, facingQuarter } = await import('Renderer/Effects/ScreenDirection.js');

// Wind Cutter (RK_WINDCUTTER 2005): use packet (result set): 1690 new_windcutter on the caster, then
// 1692 (05clock) when the caster's facing angle is in (0, 90) or [180, 270), else 1691 (01clock).
// Each damage packet whose target is not the caster: 1693 new_windcutter_target on the target.
// Hit map: 122 on the first hit. kRO 2025-07-16, spec: effect-port/rune-knight-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function loadEffectManager(skillTable, entities, has = () => false) {
	const source = read('Renderer/EffectManager.js')
		.replace(/^import .*;$/gm, '')
		.replace('export default EffectManager;', 'this.EffectManager = EffectManager;');
	const context = vm.createContext({
		console,
		Math,
		Number,
		Float32Array,
		SU: {},
		SkillUnit: {},
		SkillEffect: skillTable,
		EntityManager: { get: aid => entities[aid] || null },
		screenAngle: () => 0,
		facingAngle,
		facingQuarter
	});
	vm.runInContext(source, context);
	const spammed = [];
	context.EffectManager.spam = params => spammed.push(params);
	context.EffectManager.has = has;
	return { EffectManager: context.EffectManager, spammed };
}

describe('facing angle', () => {
	it('is counter-clockwise from down on an unturned screen', () => {
		expect(facingAngle(0, 0)).toBe(0); // south
		expect(facingAngle(6, 0)).toBe(90); // east
		expect(facingAngle(4, 0)).toBe(180); // north
		expect(facingAngle(2, 0)).toBe(270); // west
		expect(facingAngle(7, 0)).toBe(45); // south-east
	});

	it('turns with the camera', () => {
		expect(facingAngle(0, 90)).toBe(270);
		expect(facingAngle(6, -45)).toBe(135);
	});

	it('splits into the four official quarters', () => {
		expect([0, 45, 89.9, 90, 179, 180, 269, 270, 359].map(facingQuarter)).toEqual([3, 0, 0, 1, 1, 2, 2, 3, 3]);
	});
});

describe('Wind Cutter', () => {
	it('has the official rows', () => {
		expect(SkillEffect[SK.RK_WINDCUTTER]).toMatchObject({
			successEffectIdOnCaster: 'ef_rk_windcutter',
			successEffectIdOnCasterByFacing: [
				'ef_rk_windcutter_bottom_05',
				'ef_rk_windcutter_bottom_01',
				'ef_rk_windcutter_bottom_05',
				'ef_rk_windcutter_bottom_01'
			],
			damageEffectIdOnOtherTarget: 'ef_rk_windcutter_target',
			firstHitEffectId: 122
		});
		for (const [key, file] of [
			['ef_rk_windcutter', 'new_windcutter'],
			['ef_rk_windcutter_bottom_01', 'new_windcutter_bottom_01clock'],
			['ef_rk_windcutter_bottom_05', 'new_windcutter_bottom_05clock'],
			['ef_rk_windcutter_target', 'new_windcutter_target']
		]) {
			expect(EffectTable[key]).toHaveLength(1);
			expect(EffectTable[key][0]).toMatchObject({ type: 'STR', file: `new_windcutter/${file}/${file}` });
			expect(!!EffectTable[key][0].renderBeforeEntities).toBe(file.includes('bottom'));
		}
	});

	it('picks the floor slash by the caster facing', () => {
		const pick = direction => {
			const { EffectManager, spammed } = loadEffectManager(SkillEffect, { 1: { direction, position: [0, 0, 0] } });
			EffectManager.spamSkillSuccess(SK.RK_WINDCUTTER, 1, 0, 1, 5);
			return spammed.map(p => p.effectId);
		};
		expect(pick(7)).toEqual(['ef_rk_windcutter', 'ef_rk_windcutter_bottom_05']); // south-east: 45
		expect(pick(6)).toEqual(['ef_rk_windcutter', 'ef_rk_windcutter_bottom_01']); // east: 90
		expect(pick(4)).toEqual(['ef_rk_windcutter', 'ef_rk_windcutter_bottom_05']); // north: 180
		expect(pick(0)).toEqual(['ef_rk_windcutter', 'ef_rk_windcutter_bottom_01']); // south: 0
	});

	it('plays the target slash on targets other than the caster only', () => {
		const { EffectManager, spammed } = loadEffectManager(SkillEffect, {});
		EffectManager.spamSkillDamage(SK.RK_WINDCUTTER, 2, 0, 1);
		EffectManager.spamSkillDamage(SK.RK_WINDCUTTER, 1, 0, 1);
		expect(spammed.map(p => [p.effectId, p.ownerAID])).toEqual([['ef_rk_windcutter_target', 2]]);
	});
});
