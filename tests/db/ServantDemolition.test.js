import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

vi.mock('Core/Client.js', () => ({ default: { loadFile: () => null } }));
vi.mock('Audio/SoundManager.js', () => ({ default: {} }));
vi.mock('Core/Events.js', () => ({ default: {} }));

const { collectDelay, servantDemolitionEffects } = await import('DB/Effects/ServantDemolitionEffect.js');

// Servant Weapon: Demolition, as the official client plays it: as each damage
// packet arrives, servant_demolition_collect on the caster (motion speed x 100
// + 100 ms later) and servant_demolition_leftdown or _rightdown on the target,
// half and half at random; servant_demolition_hit on the target when the damage
// lands. All at PosY 8, attached.
//
// Read as text: the tables import the renderer, which does not load without a canvas.
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const skillEffect = read('DB/Skills/SkillEffect.js');

const STRIKES = ['ef_dk_servant_w_demol_leftdown', 'ef_dk_servant_w_demol_rightdown'];

function row() {
	const start = skillEffect.indexOf('SkillEffect[SK.DK_SERVANT_W_DEMOL] =');
	expect(start).toBeGreaterThan(-1);
	const text = skillEffect.slice(skillEffect.indexOf('{', start), skillEffect.indexOf('\n};', start) + 2);
	return vm.runInNewContext(`(${text})`);
}

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

describe('Servant Weapon: Demolition', () => {
	it('plays the gathering on the caster and one random strike on the target per damage packet', () => {
		const skill = row();
		expect(Object.keys(skill).sort()).toEqual(['damageEffectIdOnCaster', 'damageEffectIdOnTarget', 'hitEffectId']);
		expect(skill.damageEffectIdOnCaster).toBe('ef_dk_servant_w_demol_collect');
		expect(JSON.parse(JSON.stringify(skill.damageEffectIdOnTarget))).toEqual([STRIKES]);
		expect(skill.hitEffectId).toBe('ef_dk_servant_w_demol_hit');
	});

	it('picks leftdown on the lower half of the random range, rightdown on the upper', () => {
		const { EffectManager, spammed } = loadEffectManager({ 5205: row() });
		EffectManager.spamSkillDamage(5205, 20, 1500, 10, () => 0.49);
		EffectManager.spamSkillDamage(5205, 21, 1600, 10, () => 0.5);
		expect(spammed.map(p => [p.effectId, p.ownerAID, p.otherAID, p.startTick])).toEqual([
			['ef_dk_servant_w_demol_collect', 10, 20, 1500],
			['ef_dk_servant_w_demol_leftdown', 20, 10, 1500],
			['ef_dk_servant_w_demol_collect', 10, 21, 1600],
			['ef_dk_servant_w_demol_rightdown', 21, 10, 1600]
		]);
	});

	it('plays nothing for a skill without these fields', () => {
		const { EffectManager, spammed } = loadEffectManager({ 1: { hitEffectId: 'x' } });
		EffectManager.spamSkillDamage(1, 20, 0, 10);
		EffectManager.spamSkillDamage(2, 20, 0, 10);
		expect(spammed).toEqual([]);
	});

	it('starts the gathering motion speed x 100 + 100 ms after the packet, in whole ticks', () => {
		// 100 ms frames = 4 units: 500 ms, 31 ticks + 1 = 32 ticks
		expect(collectDelay(4)).toBeCloseTo((32 * 1000) / 60);
		// 25 ms frames = 1 unit: 200 ms, 12 ticks + 1
		expect(collectDelay(1)).toBeCloseTo((13 * 1000) / 60);
	});

	it('draws every row attached at PosY 8, from the 4th-job folder with the old one as fallback', () => {
		const rows = servantDemolitionEffects();
		expect(Object.keys(rows).sort()).toEqual([
			'ef_dk_servant_w_demol_collect',
			'ef_dk_servant_w_demol_hit',
			'ef_dk_servant_w_demol_leftdown',
			'ef_dk_servant_w_demol_rightdown'
		]);
		for (const [id, layers] of Object.entries(rows)) {
			expect(layers).toHaveLength(1);
			const [layer] = layers;
			const name = id.replace('ef_dk_servant_w_demol_', 'servant_demolition_');
			expect(layer.file).toBe(`dragon_knight/dk_servant_w_demol/${name}/${name}`);
			expect(layer.min).toBe(`dragon_knight/dk_servant_w_demol/${name}/min_${name}`);
			expect(layer.fallback).toEqual([`servant_demolition/${name}/${name}`]);
			expect(layer.yOffset).toBe(8);
			expect(layer.attachedEntity).toBe(true);
		}
		expect(rows.ef_dk_servant_w_demol_hit[0].wav).toBe('effect/dk_servant_w_demol');
		expect(rows.ef_dk_servant_w_demol_collect[0].wav).toBeUndefined();
		const caster = { animation: { speed: 100 } };
		expect(rows.ef_dk_servant_w_demol_collect[0].delayStart({ Init: { ownerEntity: caster } })).toBeCloseTo(
			collectDelay(4)
		);
		expect(rows.ef_dk_servant_w_demol_leftdown[0].delayStart).toBeUndefined();
	});

	it('keeps the kRO effect merge from adding any of the four rows again', () => {
		const db = read('DB/DBManager.js');
		const start = db.indexOf('function loadBSONFile(');
		const end = db.indexOf('function loadAttendanceFile(');
		const records = {};
		for (const name of ['collect', 'leftdown', 'rightdown', 'hit']) {
			records[`servant_demolition_${name}`] = {
				FilePath: `DRAGON_KNIGHT\\DK_SERVANT_W_DEMOL\\servant_demolition_${name}\\servant_demolition_${name}.str`,
				PosY: 8
			};
		}
		const EffectTable = servantDemolitionEffects();
		const SkillEffect = { 5205: row() };
		const context = vm.createContext({
			console: { log() {} },
			Ez2streffect: records,
			SKID: { DK_SERVANT_W_DEMOL: 5205 },
			StatusEffectTable: {}
		});
		vm.runInContext(db.slice(start, end), context);
		context.mergeEz2Effects(EffectTable, SkillEffect);
		expect(Object.keys(SkillEffect[5205]).sort()).toEqual([
			'damageEffectIdOnCaster',
			'damageEffectIdOnTarget',
			'hitEffectId'
		]);
	});
});
