import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Thundering Call, as the official client plays it: when the use-skill packet
// reports success, one EZ2 effect (top layer plus floor layer) on the target.
// KR_THUNDERING_CALL plays the green (g) files, KR_THUNDERING_CALL_S the yellow
// (y) ones. Level 1-6 plays the 3x3 size, level 7 and up the 5x5 size.
// Each row is the EZ2 row of the same name: PosY 10, following the target.
//
// Read as text: the tables import the renderer, which does not load without a canvas.
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const skillEffect = read('DB/Skills/SkillEffect.js');
const effectTable = effectTableSource().replace(/\r\n/g, '\n');

const SKILLS = { KR_THUNDERING_CALL: ['g', 6567], KR_THUNDERING_CALL_S: ['y', 6568] };
const byLevel = c => [...Array(6).fill(`ef_druid_thundering_call_${c}_3x3`), `ef_druid_thundering_call_${c}_5x5`];

function entry(id) {
	const start = effectTable.indexOf(`\n\t${id}: [`);
	expect(start, `${id} is defined`).toBeGreaterThan(-1);
	return effectTable
		.slice(start, effectTable.indexOf('\n\t],', start))
		.split('\n\t\t{')
		.slice(1);
}

function skillRow(name) {
	const start = skillEffect.indexOf(`SkillEffect[SK.${name}] =`);
	expect(start).toBeGreaterThan(-1);
	return skillEffect.slice(start, skillEffect.indexOf('\n', start));
}

function loadEffectManager(skillTable) {
	const source = read('Renderer/EffectManager.js')
		.replace(/^import .*;$/gm, '')
		.replace('export default EffectManager;', 'this.EffectManager = EffectManager;');
	const context = vm.createContext({ console, Math, Number, Float32Array, SU: {}, SkillUnit: {}, SkillEffect: skillTable });
	vm.runInContext(source, context);
	const spammed = [];
	context.EffectManager.spam = params => spammed.push(params);
	return { EffectManager: context.EffectManager, spammed };
}

describe('Thundering Call', () => {
	it('picks the size by level, on the target, only from the successful use-skill packet', () => {
		for (const [name, [c]] of Object.entries(SKILLS)) {
			const row = skillRow(name);
			const list = row.match(/successEffectIdOnTargetByLevel: \[([^\]]+)\]/);
			expect(list, name).not.toBeNull();
			expect([...list[1].matchAll(/'(\w+)'/g)].map(m => m[1])).toEqual(byLevel(c));
			expect(row).not.toMatch(/\b(effectId|effectIdOnCaster|successEffectId|successEffectIdOnCaster):/);
			expect(row).toContain(`hitEffectId: 'ef_druid_thunder_hit_${c}'`);
		}
	});

	it('uses the EZ2 rows: top and floor STR, light version, sound on top, following the target, PosY 10', () => {
		for (const c of ['g', 'y']) {
			for (const size of ['3x3', '5x5']) {
				const name = `thundering_call_${c}_${size}`;
				const dir = `druid/kr_thundering_call/${name}`;
				const [top, floor, extra] = entry(`ef_druid_${name}`);
				expect(extra).toBeUndefined();
				expect(top).toContain(`file: '${dir}/${name}'`);
				expect(top).toContain(`min: '${dir}/min_${name}'`);
				expect(top).toContain(`wav: 'effect/druid/kr_thundering_call_${c}'`);
				expect(top).not.toContain('renderBeforeEntities');
				expect(floor).toContain(`file: '${dir}_bottom/${name}_bottom'`);
				expect(floor).toContain(`min: '${dir}_bottom/min_${name}_bottom'`);
				expect(floor).toContain('renderBeforeEntities: true');
				expect(floor).not.toContain('wav:');
				for (const layer of [top, floor]) {
					expect(layer).toContain('yOffset: 10');
					expect(layer).toContain('attachedEntity: true');
					expect(layer).not.toMatch(/xOffset|delayStart|delayOffset|repeat/);
				}
			}
		}
		expect(effectTable).not.toMatch(/\n\tef_druid_thundering_call_[gy]: \[/);
	});

	it('spamSkillSuccess plays 3x3 on the target below level 7 and 5x5 from 7, nothing without a level or target', () => {
		const names = byLevel('g');
		const { EffectManager, spammed } = loadEffectManager({ 6567: { successEffectIdOnTargetByLevel: names } });
		for (let level = 1; level <= 10; level++) {
			spammed.length = 0;
			EffectManager.spamSkillSuccess(6567, 20, null, 10, level);
			const size = level < 7 ? '3x3' : '5x5';
			expect(spammed.map(p => [p.effectId, p.ownerAID, p.otherAID, p.skillLevel])).toEqual([
				[`ef_druid_thundering_call_g_${size}`, 20, 10, level]
			]);
		}
		for (const level of [0, undefined]) {
			spammed.length = 0;
			EffectManager.spamSkillSuccess(6567, 20, null, 10, level);
			expect(spammed).toEqual([]);
		}
		spammed.length = 0;
		EffectManager.spamSkillSuccess(6567, 0, null, 10, 5);
		expect(spammed).toEqual([]);
	});

	it('is not mapped again when the client EZ2 table loads', () => {
		const db = read('DB/DBManager.js');
		const start = db.indexOf('function loadBSONFile(');
		const end = db.indexOf('function loadAttendanceFile(');
		expect(start).toBeGreaterThan(-1);
		expect(end).toBeGreaterThan(start);
		const Ez2streffect = {};
		const EffectTable = {};
		for (const c of ['g', 'y']) {
			for (const size of ['3x3', '5x5']) {
				for (const part of ['', '_bottom']) {
					const name = `thundering_call_${c}_${size}${part}`;
					Ez2streffect[name] = {
						FilePath: `DRUID\\KR_THUNDERING_CALL\\${name}\\${name}.str`,
						SoundPath: part ? '' : `effect\\DRUID\\KR_THUNDERING_CALL_${c.toUpperCase()}.wav`,
						PosX: 0,
						PosY: 10,
						IsFloor: !!part,
						StartDelayTime: 0
					};
				}
				const name = `thundering_call_${c}_${size}`;
				EffectTable[`ef_druid_${name}`] = [
					{ type: 'STR', file: `druid/kr_thundering_call/${name}/${name}` },
					{ type: 'STR', file: `druid/kr_thundering_call/${name}_bottom/${name}_bottom` }
				];
			}
		}
		const context = vm.createContext({
			console: { log() {} },
			Ez2streffect,
			StatusEffectTable: {},
			SkillUnit: {},
			SkillUnitEnd: {},
			SKID: { KR_THUNDERING_CALL: 6567, KR_THUNDERING_CALL_S: 6568 }
		});
		vm.runInContext(db.slice(start, end), context);
		const SkillEffect = {
			6567: { successEffectIdOnTargetByLevel: byLevel('g') },
			6568: { successEffectIdOnTargetByLevel: byLevel('y') }
		};
		context.mergeEz2Effects(EffectTable, SkillEffect);
		expect({ ...SkillEffect[6567] }).toEqual({ successEffectIdOnTargetByLevel: byLevel('g') });
		expect({ ...SkillEffect[6568] }).toEqual({ successEffectIdOnTargetByLevel: byLevel('y') });
	});
});
