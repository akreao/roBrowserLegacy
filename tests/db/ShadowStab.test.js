import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Shadow Stab, as the official client plays it: when the use-skill packet
// succeeds, EZ2 shadow_stab on the caster, turned on screen towards the
// target; then shadow_stab_hit1 on the target with each hit. The client's hit
// step always asks for hit1, so hit2 never plays.
//
// Read as text: the tables import the renderer, which does not load without a canvas.
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const skillEffect = read('DB/Skills/SkillEffect.js');
const effectTable = effectTableSource().replace(/\r\n/g, '\n');

function row() {
	const start = skillEffect.indexOf('SkillEffect[SK.SHC_SHADOW_STAB] =');
	expect(start).toBeGreaterThan(-1);
	const text = skillEffect.slice(skillEffect.indexOf('{', start), skillEffect.indexOf('\n};', start) + 2);
	return vm.runInNewContext(`(${text})`);
}

function entry(id) {
	const start = effectTable.indexOf(`\n\t${id}: [`);
	expect(start, `${id} is defined`).toBeGreaterThan(-1);
	return vm.runInNewContext(effectTable.slice(effectTable.indexOf('[', start), effectTable.indexOf('\n\t],', start) + 3));
}

const folder = 'shadow_cross/shc_shadow_stab';

describe('Shadow Stab', () => {
	it('plays the stab on the caster on success and the hit on the target per hit', () => {
		expect({ ...row() }).toEqual({
			successEffectIdOnCaster: 'ef_shc_shadow_stab',
			hitEffectId: 'ef_shc_shadow_stab_hit'
		});
	});

	it('turns the stab towards the target, at PosY 4', () => {
		const rows = entry('ef_shc_shadow_stab');
		expect(rows).toHaveLength(1);
		const [stab] = rows;
		expect(stab.file).toBe(`${folder}/shadow_stab/shadow_stab`);
		expect(stab.wav).toBe('effect/shc_shadow_stab');
		expect(stab.xOffset).toBe(0);
		expect(stab.yOffset).toBe(4);
		expect(stab.rotateToTarget).toBe(true);
		expect(stab.facing).toBe(0);
		expect(stab.attachedEntity).toBeFalsy();
	});

	it('hits with hit1 only, at PosY 5 and without a sound', () => {
		const rows = entry('ef_shc_shadow_stab_hit');
		expect(rows).toHaveLength(1);
		const [hit] = rows;
		expect(hit.file).toBe(`${folder}/shadow_stab_hit1/shadow_stab_hit1`);
		expect(hit.min).toBe(`${folder}/shadow_stab_hit1/min_shadow_stab_hit1`);
		expect(hit.fallback).toEqual(['shadow_stab/shadow_stab_hit1/shadow_stab_hit1']);
		expect(hit.wav).toBeUndefined();
		expect(hit.xOffset).toBe(0);
		expect(hit.yOffset).toBe(5);
		expect(hit.rotateToTarget).toBeUndefined();
	});

	it('keeps the kRO effect merge from adding the stab, hit1 or hit2 again', () => {
		const db = read('DB/DBManager.js');
		const start = db.indexOf('function loadBSONFile(');
		const end = db.indexOf('function loadAttendanceFile(');
		const records = {};
		for (const [name, posY] of [
			['shadow_stab', 4],
			['shadow_stab_hit1', 5],
			['shadow_stab_hit2', 5]
		]) {
			records[name] = { FilePath: `SHADOW_CROSS\\SHC_SHADOW_STAB\\${name}\\${name}.str`, PosY: posY };
		}
		const EffectTable = {};
		for (const id of ['ef_shc_shadow_stab', 'ef_shc_shadow_stab_hit']) {
			EffectTable[id] = entry(id);
		}
		const SkillEffect = { 5291: row() };
		const context = vm.createContext({
			console: { log() {} },
			Ez2streffect: records,
			SKID: { SHC_SHADOW_STAB: 5291 },
			StatusEffectTable: {},
			SkillUnit: {},
			SkillUnitEnd: {}
		});
		vm.runInContext(db.slice(start, end), context);
		context.mergeEz2Effects(EffectTable, SkillEffect);
		expect(Object.keys(SkillEffect[5291]).sort()).toEqual(['hitEffectId', 'successEffectIdOnCaster']);
		expect(SkillEffect[5291].hitEffectId).toBe('ef_shc_shadow_stab_hit');
	});
});
