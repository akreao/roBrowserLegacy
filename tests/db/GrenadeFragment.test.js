import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Grenade Fragment, as the official client plays it: one EZ2 effect on the
// caster when the use-skill packet reports success, picked by skill level.
// Level 1-6 set the element (water, wind, earth, fire, dark, holy), 7 resets it.
// Each row is the EZ2 row of the same name: PosY 10, following the caster.
//
// Read as text: the tables import the renderer, which does not load without a canvas.
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const skillEffect = read('DB/Skills/SkillEffect.js');
const effectTable = read('DB/Effects/EffectTable.js');

const ELEMENTS = ['water', 'wind', 'earth', 'fire', 'darkness', 'saint', 'reset'];
const NAMES = ELEMENTS.map(e => `ef_nw_grenade_fragment_${e}`);

function entry(id) {
	const start = effectTable.indexOf(`\n\t${id}: [`);
	expect(start, `${id} is defined`).toBeGreaterThan(-1);
	return effectTable.slice(start, effectTable.indexOf('\n\t],', start));
}

function skillRow() {
	const start = skillEffect.indexOf('SkillEffect[SK.NW_GRENADE_FRAGMENT] =');
	expect(start).toBeGreaterThan(-1);
	return skillEffect.slice(start, skillEffect.indexOf('}; //Grenade Fragment', start));
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

describe('Grenade Fragment', () => {
	it('picks one file by level, on the caster, only from the successful use-skill packet', () => {
		const row = skillRow();
		expect(row).toContain('successEffectIdOnCasterByLevel: [');
		const listed = [...row.matchAll(/'(ef_nw_grenade_fragment_\w+)'/g)].map(m => m[1]);
		expect(listed).toEqual(NAMES);
		expect(row).not.toMatch(/\b(effectId|hitEffectId|effectIdOnCaster|successEffectId):/);
	});

	it('uses the EZ2 rows: STR, light version, sound, following the caster, PosY 10', () => {
		for (const e of ELEMENTS) {
			const dir = `night_watch/nw_grenade_fragment/grenade_fragment_${e}/`;
			const row = entry(`ef_nw_grenade_fragment_${e}`);
			expect(row).toContain(`file: '${dir}grenade_fragment_${e}'`);
			expect(row).toContain(`min: '${dir}min_grenade_fragment_${e}'`);
			expect(row).toContain(`wav: 'effect/night_watch/nw_grenade_fragment_${e}'`);
			expect(row).toContain('yOffset: 10');
			expect(row).toContain('attachedEntity: true');
			expect(row).not.toMatch(/xOffset|delayStart|delayOffset|repeat|renderBeforeEntities/);
		}
		expect(effectTable).not.toContain('\n\tef_nw_grenade_fragment: [');
	});

	it('spamSkillSuccess plays the level file on the caster, and nothing without a level', () => {
		const { EffectManager, spammed } = loadEffectManager({ 5404: { successEffectIdOnCasterByLevel: NAMES } });
		for (let level = 1; level <= 7; level++) {
			spammed.length = 0;
			EffectManager.spamSkillSuccess(5404, 20, null, 10, level);
			expect(spammed.map(p => [p.effectId, p.ownerAID, p.otherAID, p.skillLevel])).toEqual([
				[NAMES[level - 1], 10, 20, level]
			]);
		}
		// The server never sends more than level 7; past the end plays the last file.
		spammed.length = 0;
		EffectManager.spamSkillSuccess(5404, 20, null, 10, 8);
		expect(spammed.map(p => p.effectId)).toEqual([NAMES[6]]);
		for (const level of [0, undefined]) {
			spammed.length = 0;
			EffectManager.spamSkillSuccess(5404, 20, null, 10, level);
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
			Ez2streffect[`grenade_fragment_${e}`] = {
				FilePath: `NIGHT_WATCH\\NW_GRENADE_FRAGMENT\\grenade_fragment_${e}\\grenade_fragment_${e}.str`,
				SoundPath: `effect\\NIGHT_WATCH\\nw_grenade_fragment_${e}.wav`,
				PosX: 0,
				PosY: 10,
				IsFloor: false,
				StartDelayTime: 0
			};
		}
		const context = vm.createContext({
			console: { log() {} },
			Ez2streffect,
			StatusEffectTable: {},
			SKID: { NW_GRENADE_FRAGMENT: 5404 }
		});
		vm.runInContext(db.slice(start, end), context);
		const EffectTable = {};
		for (const e of ELEMENTS) {
			EffectTable[`ef_nw_grenade_fragment_${e}`] = [
				{ type: 'STR', file: `night_watch/nw_grenade_fragment/grenade_fragment_${e}/grenade_fragment_${e}` }
			];
		}
		const SkillEffect = { 5404: { successEffectIdOnCasterByLevel: NAMES } };
		context.mergeEz2Effects(EffectTable, SkillEffect);
		expect({ ...SkillEffect[5404] }).toEqual({ successEffectIdOnCasterByLevel: NAMES });
	});
});
