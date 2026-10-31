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

// Dragon Breath (RK_DRAGONBREATH 2008) and Dragon Breath - Water (RK_DRAGONBREATH_WATER 5004): each damage
// packet: the breath on the caster (05 / 01 / 11 / 07 o'clock by the caster's facing quarter, 200 ms in, not
// again while it plays), the bomb and its floor on the target (350 ms in) with 폭염룡.wav; dragon_breath.wav as
// the damage arrives. No use effect, no hit flash. kRO 2025-07-16, spec: effect-port/rune-knight-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function loadEffectManager(entities, has) {
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

const CASES = [
	[SK.RK_DRAGONBREATH, 'ef_rk_dragonbreath', 'new_dragonbreath'],
	[SK.RK_DRAGONBREATH_WATER, 'ef_rk_dragonbreath_water', 'new_dragonbreath_water']
];

describe('Dragon Breath', () => {
	it('has the official rows', () => {
		for (const [skill, key, folder] of CASES) {
			expect(SkillEffect[skill]).toMatchObject({
				damageEffectIdOnCasterByFacing: [`${key}_05`, `${key}_01`, `${key}_11`, `${key}_07`],
				damageEffectIdOnTarget: `${key}_bomb`,
				firstHitEffectId: 'ef_rk_dragonbreath_sound',
				castAuraEffectId: 12
			});
			for (const clock of ['01', '05', '07', '11']) {
				const [part, extra] = EffectTable[`${key}_${clock}`];
				expect(extra).toBeUndefined();
				const sub = `${folder}_${clock}_clock`;
				expect(part).toMatchObject({ type: 'STR', file: `${folder}/${sub}/${sub}`, delayStart: 200 });
			}
			const [bomb, floor] = EffectTable[`${key}_bomb`];
			expect(bomb).toMatchObject({ type: 'STR', file: `${folder}/${folder}_bomb/${folder}_bomb`, delayStart: 350 });
			expect(bomb.wav).toBe('effect/\xc6\xf8\xbf\xb0\xb7\xe6');
			expect(floor).toMatchObject({ file: `${folder}/${folder}_bomb_bottom/${folder}_bomb_bottom`, delayStart: 350, renderBeforeEntities: true });
		}
		expect(EffectTable.ef_rk_dragonbreath_sound).toEqual([{ wav: 'dragon_breath', attachedEntity: true }]);
	});

	it('breathes by the caster facing, once while it plays, and bombs every target', () => {
		const running = new Set();
		const { EffectManager, spammed } = loadEffectManager(
			{ 1: { direction: 7, position: [0, 0, 0] }, 2: { position: [1, 0, 0] }, 3: { position: [2, 0, 0] } },
			(aid, id) => running.has(`${aid}:${id}`)
		);
		EffectManager.spamSkillDamage(SK.RK_DRAGONBREATH, 2, 0, 1);
		running.add('1:ef_rk_dragonbreath_05');
		EffectManager.spamSkillDamage(SK.RK_DRAGONBREATH, 3, 0, 1);
		expect(spammed.map(p => [p.effectId, p.ownerAID])).toEqual([
			['ef_rk_dragonbreath_bomb', 2],
			['ef_rk_dragonbreath_05', 1],
			['ef_rk_dragonbreath_bomb', 3]
		]);
	});
});
