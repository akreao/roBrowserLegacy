import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Radiant Spear, as the official client plays it: when the use-skill packet
// succeeds, one spear (EZ2 radiant_spear_<side>down_bottom, then
// radiant_spear_<side>down) lands where the target stands. A target on the
// right half of the screen, seen from the caster, gets leftdown; on the left
// half, rightdown.
//
// Read as text: the tables import the renderer, which does not load without a canvas.
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const skillEffect = read('DB/Skills/SkillEffect.js');
const effectTable = effectTableSource().replace(/\r\n/g, '\n');

function row() {
	const start = skillEffect.indexOf('SkillEffect[6503 /* IG_RADIANT_SPEAR */] =');
	expect(start).toBeGreaterThan(-1);
	const text = skillEffect.slice(skillEffect.indexOf('{', start), skillEffect.indexOf('\n};', start) + 2);
	return vm.runInNewContext(`(${text})`);
}

function entry(id) {
	const start = effectTable.indexOf(`\n\t${id}: [`);
	expect(start, `${id} is defined`).toBeGreaterThan(-1);
	return vm.runInNewContext(effectTable.slice(effectTable.indexOf('[', start), effectTable.indexOf('\n\t],', start) + 3));
}

const folder = 'imperial_guard/ig_radiant_spear';

describe('Radiant Spear', () => {
	it('picks the spear by the half of the screen the target is in', () => {
		const skill = row();
		expect(Object.keys(skill).sort()).toEqual(['effectIdOnCaster', 'successEffectIdOnTargetByScreenSide']);
		expect({ ...skill.successEffectIdOnTargetByScreenSide }).toEqual({
			right: 'ef_ig_radiant_spear_leftdown',
			left: 'ef_ig_radiant_spear_rightdown'
		});
	});

	for (const side of ['left', 'right']) {
		it(`draws ${side}down's floor ring, then the spear, fixed on the ground at PosY 11`, () => {
			const rows = entry(`ef_ig_radiant_spear_${side}down`);
			expect(rows).toHaveLength(2);
			const [floor, spear] = rows;
			for (const [r, name, wav] of [
				[floor, `radiant_spear_${side}down_bottom`, 'effect/lg_radiant_spear2'],
				[spear, `radiant_spear_${side}down`, 'effect/lg_radiant_spear1']
			]) {
				expect(r.type).toBe('STR');
				expect(r.file).toBe(`${folder}/${name}/${name}`);
				expect(r.min).toBe(`${folder}/${name}/min_${name}`);
				expect(r.wav).toBe(wav);
				expect(r.xOffset).toBe(0);
				expect(r.yOffset).toBe(11);
				expect(r.attachedEntity).toBe(false);
			}
			expect(floor.renderBeforeEntities).toBe(true);
			expect(spear.renderBeforeEntities).toBeUndefined();
		});
	}

	it('keeps the kRO effect merge from adding either spear again', () => {
		const db = read('DB/DBManager.js');
		const start = db.indexOf('function loadBSONFile(');
		const end = db.indexOf('function loadAttendanceFile(');
		const records = {};
		for (const name of [
			'radiant_spear_leftdown',
			'radiant_spear_leftdown_bottom',
			'radiant_spear_rightdown',
			'radiant_spear_rightdown_bottom'
		]) {
			records[name] = {
				FilePath: `IMPERIAL_GUARD\\IG_RADIANT_SPEAR\\${name}\\${name}.str`,
				IsFloor: name.endsWith('_bottom'),
				PosY: 11
			};
		}
		const EffectTable = {};
		for (const id of ['ef_ig_radiant_spear_cast', 'ef_ig_radiant_spear_leftdown', 'ef_ig_radiant_spear_rightdown']) {
			EffectTable[id] = entry(id);
		}
		const SkillEffect = { 6503: row() };
		const context = vm.createContext({
			console: { log() {} },
			Ez2streffect: records,
			SKID: { IG_RADIANT_SPEAR: 6503 },
			StatusEffectTable: {}
		});
		vm.runInContext(db.slice(start, end), context);
		context.mergeEz2Effects(EffectTable, SkillEffect);
		expect(Object.keys(SkillEffect[6503]).sort()).toEqual(['effectIdOnCaster', 'successEffectIdOnTargetByScreenSide']);
	});
});
