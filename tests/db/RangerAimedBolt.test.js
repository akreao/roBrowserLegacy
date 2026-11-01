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

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function loadEffectManager(entities) {
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
		SkillEffect,
		EntityManager: { get: aid => entities[aid] || null },
		Renderer: { tick: 0 },
		screenAngle: () => 0,
		facingAngle,
		facingQuarter
	});
	vm.runInContext(source, context);
	const spammed = [];
	context.EffectManager.spam = params => spammed.push(params);
	context.EffectManager.has = () => false;
	return { EffectManager: context.EffectManager, spammed, context };
}

// Aimed Bolt (RA_AIMEDBOLT 2236): no cast aura; 1649 on the caster and 1651 on the target for the cast time; as each
// damage packet's damage arrives, 1650 on the target and one of 1645-1648 on the caster by its facing quarter.
// kRO 2025-07-16, spec: effect-port/ranger-skills.md.

describe('Aimed Bolt cast, target mark and shot as the official client plays them', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.RA_AIMEDBOLT]).toEqual({ hideCastAura: true, beginCastEffectId: 1649, beginCastTargetEffectId: 1651, damageEffectIdOnTarget: 'ef_arrow_projectile', arrivalEffectIdOnTarget: 1650, arrivalEffectIdOnCasterByFacing: [1646, 1645, 1648, 1647] });
		expect(EffectTable[1649][0]).toMatchObject({ file: 'new_aimedbolt/new_aimedbolt_cast_bottom/new_aimedbolt_cast_bottom', castLoop: true, renderBeforeEntities: true });
		expect(EffectTable[1651][0]).toMatchObject({ file: 'new_aimedbolt/new_aimedbolt_target_loop/new_aimedbolt_target_loop', castLoop: true });
		expect(EffectTable[1650][0].file).toBe('new_aimedbolt/new_aimedbolt_target_end/new_aimedbolt_end');
		for (const [id, clock] of [[1645, '01'], [1646, '05'], [1647, '07'], [1648, '11']]) {
			expect(EffectTable[id][0].file).toBe(`new_aimedbolt/new_aimedbolt_attack_${clock}clock/new_aimedbolt_attack_${clock}clock`);
		}

		// direction 0 faces 0 degrees (quarter 3), direction 7 faces 45 (quarter 0), 6 faces 90 (quarter 1), 4 faces 180 (quarter 2)
		for (const [direction, shot] of [[0, 1647], [7, 1646], [6, 1645], [4, 1648]]) {
			const { EffectManager, spammed } = loadEffectManager({ 1: { direction, position: [0, 0, 0] }, 2: { position: [3, 0, 0] } });
			EffectManager.spamSkillDamage(SK.RA_AIMEDBOLT, 2, 100, 1, Math.random, 1, 500);
			expect(spammed.map(p => [p.effectId, p.ownerAID, p.startTick])).toEqual([
				['ef_arrow_projectile', 2, 100],
				[1650, 2, 500],
				[shot, 1, 500]
			]);
		}

		const { EffectManager, spammed, context } = loadEffectManager({ 1: { position: [0, 0, 0] }, 2: { position: [3, 0, 0] } });
		EffectManager.spamSkillCast(SK.RA_AIMEDBOLT, 1, 1000, 2, 1500);
		expect(spammed.map(p => [p.effectId, p.ownerAID, p.castEndTick, p.castTargetOf])).toEqual([
			[1649, 1, 2500, undefined],
			[1651, 2, 2500, 1]
		]);

		// Cancelling the cast removes the caster's cast loops and the mark on its target, not other casts' loops
		const row = (ownerAID, Init = {}) => ({ _Params: { effect: { castLoop: true }, Init: { ownerAID, ...Init } } });
		const list = vm.runInContext('_list', context);
		list.cast = [row(1), row(2, { castTargetOf: 1 }), row(2), row(3, { castTargetOf: 2 })];
		EffectManager.removeCastLoops(1);
		expect(list.cast.map(r => [r._Params.Init.ownerAID, r._Params.Init.castTargetOf])).toEqual([
			[2, undefined],
			[3, 2]
		]);
	});
});
