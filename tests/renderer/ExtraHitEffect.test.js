import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// extraHitEffectId: the official client's multi-hit loop (kRO 2025-07-16) gives some skills their own
// effects on the hits after the first. Crimson Rock: 1298 with every later hit (none under /mineffect).
// Comet: 1416 + 1417 with the 2nd, 4th, 6th ... hit. Splash targets get none. Spec: effect-port/warlock-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function loadEffectManager(skillTable) {
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
		Renderer: { tick: 1000 },
		EntityManager: { get: () => null }
	});
	vm.runInContext(source, context);
	const spammed = [];
	context.EffectManager.spam = params => spammed.push(params);
	return { EffectManager: context.EffectManager, spammed };
}

const hits = (table, count, splash = false) => {
	const { EffectManager, spammed } = loadEffectManager(table);
	for (let i = 0; i < count; i++) {
		EffectManager.spamSkillHit(1, 20, 1000 + 200 * i, 10, i, splash, count);
	}
	return spammed.map(p => [p.effectId, p.ownerAID, p.startTick]);
};

describe('extraHitEffectId', () => {
	it('plays on every hit after the first', () => {
		expect(hits({ 1: { extraHitEffectId: 1298 } }, 3)).toEqual([
			[1298, 20, 1200],
			[1298, 20, 1400]
		]);
	});

	it('plays on every other later hit, from the 2nd', () => {
		expect(hits({ 1: { extraHitEffectId: [1416, 1417], extraHitEffectEvery: 2 } }, 5)).toEqual([
			[1416, 20, 1200],
			[1417, 20, 1200],
			[1416, 20, 1600],
			[1417, 20, 1600]
		]);
	});

	it('plays nothing on a splash target', () => {
		expect(hits({ 1: { extraHitEffectId: 1298 } }, 3, true)).toEqual([]);
	});

	it('is used by Crimson Rock and Comet', () => {
		expect(SkillEffect[SK.WL_CRIMSONROCK].extraHitEffectId).toBe(1298);
		expect(SkillEffect[SK.WL_COMET]).toMatchObject({ extraHitEffectId: [1416, 1417], extraHitEffectEvery: 2 });
		expect(EffectTable[1298][0]).toMatchObject({
			file: 'new_crimsonrock/new_crimsonrock_sub_explosion/new_crimsonrock_sub_explosion',
			minSkip: true
		});
		expect(EffectTable[1416][0].min).toBe('mineffect/new_comet/new_comet_sub_explosion/new_comet_sub_explosion');
		expect(EffectTable[1417][0]).toMatchObject({
			min: 'mineffect/new_comet/new_comet_sub_explosion_bottom/new_comet_sub_explosion_bottom',
			renderBeforeEntities: true
		});
	});
});
