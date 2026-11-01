import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Kunai - Rotation, as the official client plays it: when the use-skill packet
// reports success, the EZ2 rows kunaikaiten_bottom, _00, _01 and _02 (_02 is
// _00's file again) all play, left where the caster stood, PosY 10, in four
// rounds 480 ms apart. The round delay replaces _02's own 320 ms start delay.
//
// Read as text: the tables import the renderer, which does not load without a canvas.
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const skillEffect = read('DB/Skills/SkillEffect.js');
const effectTable = effectTableSource().replace(/\r\n/g, '\n');

const DIR = 'shinkiro_shiranui/ss_kunaikaiten/';
const LAYERS = ['kunaikaiten_bottom', 'kunaikaiten_00', 'kunaikaiten_01', 'kunaikaiten_00'];

function rows() {
	const start = effectTable.indexOf('\n\tef_ss_kunaikaiten: [');
	expect(start, 'ef_ss_kunaikaiten is defined').toBeGreaterThan(-1);
	const body = effectTable.slice(start, effectTable.indexOf('\n\t],', start));
	return body.split('\n\t\t{').slice(1);
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

describe('Kunai - Rotation', () => {
	it('plays only from the successful use-skill packet, on the caster', () => {
		const start = skillEffect.indexOf('SkillEffect[SK.SS_KUNAIKAITEN] =');
		expect(start).toBeGreaterThan(-1);
		const row = skillEffect.slice(start, skillEffect.indexOf('\n', start));
		expect(row).toContain("successEffectIdOnCaster: 'ef_ss_kunaikaiten'");
		expect(row).not.toMatch(/\b(effectId|hitEffectId|effectIdOnCaster|successEffectId):/);

		const { EffectManager, spammed } = loadEffectManager({ 5486: { successEffectIdOnCaster: 'ef_ss_kunaikaiten' } });
		EffectManager.spamSkillSuccess(5486, 10, null, 10, 3);
		expect(spammed.map(p => [p.effectId, p.ownerAID])).toEqual([['ef_ss_kunaikaiten', 10]]);
	});

	it('draws all four layers, four rounds 480 ms apart, PosY 10, left in place', () => {
		const layers = rows();
		expect(layers.map(r => r.match(/file: '([^']+)'/)[1])).toEqual(LAYERS.map(l => `${DIR}${l}/${l}`));
		layers.forEach((r, i) => {
			expect(r).toContain(`min: '${DIR}${LAYERS[i]}/min_${LAYERS[i]}'`);
			expect(r).toContain('yOffset: 10');
			expect(r).toContain('duplicate: 4');
			expect(r).toContain('timeBetweenDupli: 480');
			expect(r).not.toMatch(/attachedEntity|xOffset|delayStart|delayOffset|repeat/);
		});
		// Only the floor ring carries the sound (SS_KAGEGISSEN), once per round.
		expect(layers[0]).toContain("wav: 'effect/shinkiro_shiranui/ss_kagegissen'");
		expect(layers[0]).toContain('renderBeforeEntities: true');
		layers.slice(1).forEach(r => expect(r).not.toMatch(/wav|renderBeforeEntities/));
	});

	it('is not mapped again when the client EZ2 table loads', () => {
		const db = read('DB/DBManager.js');
		const start = db.indexOf('function loadBSONFile(');
		const end = db.indexOf('function loadAttendanceFile(');
		const Ez2streffect = {};
		for (const name of ['kunaikaiten_bottom', 'kunaikaiten_00', 'kunaikaiten_01']) {
			Ez2streffect[name] = { FilePath: `SHINKIRO_SHIRANUI\\SS_KUNAIKAITEN\\${name}\\${name}.str`, PosY: 10 };
		}
		Ez2streffect.kunaikaiten_02 = {
			FilePath: 'SHINKIRO_SHIRANUI\\SS_KUNAIKAITEN\\kunaikaiten_00\\kunaikaiten_00.str',
			PosY: 10,
			StartDelayTime: 320
		};
		const context = vm.createContext({
			console: { log() {} },
			Ez2streffect,
			StatusEffectTable: {},
			SkillUnit: {},
			SkillUnitEnd: {},
			SKID: { SS_KUNAIKAITEN: 5486 }
		});
		vm.runInContext(db.slice(start, end), context);
		const EffectTable = {
			ef_ss_kunaikaiten: LAYERS.map(l => ({ type: 'STR', file: `${DIR}${l}/${l}` }))
		};
		const SkillEffect = { 5486: { successEffectIdOnCaster: 'ef_ss_kunaikaiten' } };
		context.mergeEz2Effects(EffectTable, SkillEffect);
		expect({ ...SkillEffect[5486] }).toEqual({ successEffectIdOnCaster: 'ef_ss_kunaikaiten' });
	});
});
