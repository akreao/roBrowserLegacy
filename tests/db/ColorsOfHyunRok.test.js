import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Colors of Hyunrok, as the official client plays it: one EZ2 effect on the
// caster when the use-skill packet reports success, picked by skill level.
// Level 1-6 set the element (water, wind, earth, fire, dark, holy), 7 resets it.
// Each row is the EZ2 row of the same name: PosY 7, following the caster.
// Its handler is built like Grenade Fragment's; the reset row has its own sound.
//
// Read as text: the tables import the renderer, which does not load without a canvas.
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const skillEffect = read('DB/Skills/SkillEffect.js');
const effectTable = effectTableSource().replace(/\r\n/g, '\n');

const ELEMENTS = ['water', 'wind', 'earth', 'fire', 'darkness', 'saint', 'reset'];
const NAMES = ELEMENTS.map(e => `ef_sh_colors_of_hyun_rok_${e}`);

function entry(id) {
	const start = effectTable.indexOf(`\n\t${id}: [`);
	expect(start, `${id} is defined`).toBeGreaterThan(-1);
	return effectTable.slice(start, effectTable.indexOf('\n\t],', start));
}

function skillRow() {
	const start = skillEffect.indexOf('SkillEffect[SK.SH_COLORS_OF_HYUN_ROK] =');
	expect(start).toBeGreaterThan(-1);
	return skillEffect.slice(start, skillEffect.indexOf('}; //Colors of Hyunrok', start));
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

describe('Colors of Hyunrok', () => {
	it('picks one file by level, on the caster, only from the successful use-skill packet', () => {
		const row = skillRow();
		expect(row).toContain('successEffectIdOnCasterByLevel: [');
		const listed = [...row.matchAll(/'(ef_sh_colors_of_hyun_rok_\w+)'/g)].map(m => m[1]);
		expect(listed).toEqual(NAMES);
		expect(row).not.toMatch(/\b(effectId|hitEffectId|effectIdOnCaster|successEffectId):/);
	});

	it('uses the EZ2 rows: STR, light version, sound, following the caster, PosY 7', () => {
		for (const e of ELEMENTS) {
			const dir = `spirit_handler/sh_colors_of_hyun_rok/colors_of_hyun_rok_${e}/`;
			const row = entry(`ef_sh_colors_of_hyun_rok_${e}`);
			expect(row).toContain(`file: '${dir}colors_of_hyun_rok_${e}'`);
			expect(row).toContain(`min: '${dir}min_colors_of_hyun_rok_${e}'`);
			expect(row).toContain(`wav: 'effect/spirit_handler/sh_colors_of_hyun_rok${e === 'reset' ? '01' : ''}'`);
			expect(row).toContain('yOffset: 7');
			expect(row).toContain('attachedEntity: true');
			expect(row).not.toMatch(/xOffset|delayStart|delayOffset|repeat|renderBeforeEntities/);
		}
		expect(effectTable).not.toContain('\n\tef_sh_colors_of_hyun_rok: [');
	});

	it('spamSkillSuccess plays the level file on the caster, and nothing without a level', () => {
		const { EffectManager, spammed } = loadEffectManager({ 5444: { successEffectIdOnCasterByLevel: NAMES } });
		for (let level = 1; level <= 7; level++) {
			spammed.length = 0;
			EffectManager.spamSkillSuccess(5444, 20, null, 10, level);
			expect(spammed.map(p => [p.effectId, p.ownerAID, p.otherAID, p.skillLevel])).toEqual([
				[NAMES[level - 1], 10, 20, level]
			]);
		}
		// The server never sends more than level 7; past the end plays the last file.
		spammed.length = 0;
		EffectManager.spamSkillSuccess(5444, 20, null, 10, 8);
		expect(spammed.map(p => p.effectId)).toEqual([NAMES[6]]);
		for (const level of [0, undefined]) {
			spammed.length = 0;
			EffectManager.spamSkillSuccess(5444, 20, null, 10, level);
			expect(spammed).toEqual([]);
		}
	});

	it('is not mapped again when the client EZ2 table loads', () => {
		const db = read('DB/DBManager.js');
		const start = db.indexOf('function loadBSONFile(');
		const end = db.indexOf('function loadAttendanceFile(');
		expect(start).toBeGreaterThan(-1);
		expect(end).toBeGreaterThan(start);
		const Ez2streffect = {};
		for (const e of ELEMENTS) {
			Ez2streffect[`colors_of_hyun_rok_${e}`] = {
				FilePath: `SPIRIT_HANDLER\\SH_COLORS_OF_HYUN_ROK\\colors_of_hyun_rok_${e}\\colors_of_hyun_rok_${e}.str`,
				SoundPath: `effect\\SPIRIT_HANDLER\\SH_COLORS_OF_HYUN_ROK${e === 'reset' ? '01' : ''}.wav`,
				PosX: 0,
				PosY: 7,
				IsFloor: false,
				StartDelayTime: 0
			};
		}
		const context = vm.createContext({
			console: { log() {} },
			Ez2streffect,
			StatusEffectTable: {},
			SKID: { SH_COLORS_OF_HYUN_ROK: 5444 }
		});
		vm.runInContext(db.slice(start, end), context);
		const EffectTable = {};
		for (const e of ELEMENTS) {
			EffectTable[`ef_sh_colors_of_hyun_rok_${e}`] = [
				{ type: 'STR', file: `spirit_handler/sh_colors_of_hyun_rok/colors_of_hyun_rok_${e}/colors_of_hyun_rok_${e}` }
			];
		}
		const SkillEffect = { 5444: { successEffectIdOnCasterByLevel: NAMES } };
		context.mergeEz2Effects(EffectTable, SkillEffect);
		expect({ ...SkillEffect[5444] }).toEqual({ successEffectIdOnCasterByLevel: NAMES });
	});
});
