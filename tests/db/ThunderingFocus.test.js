import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Thundering Focus, as the official client plays it: when the use-skill packet
// reports success, one EZ2 effect on the target. KR_THUNDERING_FOCUS plays
// thundering_focus_g, KR_THUNDERING_FOCUS_S thundering_focus_y, the same at
// every level. Each is a single floor STR: PosY 10, following the target.
//
// Read as text: the tables import the renderer, which does not load without a canvas.
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const skillEffect = read('DB/Skills/SkillEffect.js');
const effectTable = read('DB/Effects/EffectTable.js');

const SKILLS = { KR_THUNDERING_FOCUS: ['g', 6563], KR_THUNDERING_FOCUS_S: ['y', 6564] };

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

describe('Thundering Focus', () => {
	it('plays its colour on the target, only from the successful use-skill packet', () => {
		for (const [name, [c]] of Object.entries(SKILLS)) {
			const row = skillRow(name);
			expect(row).toContain(`successEffectId: 'ef_druid_thundering_focus_${c}'`);
			expect(row).not.toMatch(/\b(effectId|effectIdOnCaster|successEffectIdOnCaster|\w+ByLevel):/);
			expect(row).toContain(`hitEffectId: 'ef_druid_thunder_hit_${c}'`);
		}
	});

	it('uses the EZ2 row: one floor STR, light version, sound, following the target, PosY 10', () => {
		for (const c of ['g', 'y']) {
			const name = `thundering_focus_${c}`;
			const dir = `druid/kr_thundering_focus/${name}`;
			const [layer, extra] = entry(`ef_druid_${name}`);
			expect(extra).toBeUndefined();
			expect(layer).toContain(`file: '${dir}/${name}'`);
			expect(layer).toContain(`min: '${dir}/min_${name}'`);
			expect(layer).toContain(`wav: 'effect/druid/kr_thundering_focus_${c}'`);
			expect(layer).toContain('renderBeforeEntities: true');
			expect(layer).toContain('yOffset: 10');
			expect(layer).toContain('attachedEntity: true');
			expect(layer).not.toMatch(/xOffset|delayStart|delayOffset|repeat/);
		}
	});

	it('spamSkillSuccess plays it once on the target at any level', () => {
		const { EffectManager, spammed } = loadEffectManager({ 6563: { successEffectId: 'ef_druid_thundering_focus_g' } });
		for (const level of [1, 5, 10]) {
			spammed.length = 0;
			EffectManager.spamSkillSuccess(6563, 20, null, 10, level);
			expect(spammed.map(p => [p.effectId, p.ownerAID, p.otherAID])).toEqual([['ef_druid_thundering_focus_g', 20, 10]]);
		}
	});

	it('does not get the other colour when the client EZ2 table loads', () => {
		const db = read('DB/DBManager.js');
		const start = db.indexOf('function loadBSONFile(');
		const end = db.indexOf('function loadAttendanceFile(');
		expect(start).toBeGreaterThan(-1);
		expect(end).toBeGreaterThan(start);
		const Ez2streffect = {};
		const EffectTable = {};
		for (const c of ['g', 'y']) {
			const name = `thundering_focus_${c}`;
			// Both colours sit in the KR_THUNDERING_FOCUS folder
			Ez2streffect[name] = {
				FilePath: `DRUID\\KR_THUNDERING_FOCUS\\${name}\\${name}.str`,
				SoundPath: `effect\\DRUID\\KR_THUNDERING_FOCUS_${c.toUpperCase()}.wav`,
				PosX: 0,
				PosY: 10,
				IsFloor: true,
				StartDelayTime: 0
			};
			EffectTable[`ef_druid_${name}`] = [{ type: 'STR', file: `druid/kr_thundering_focus/${name}/${name}` }];
		}
		const context = vm.createContext({
			console: { log() {} },
			Ez2streffect,
			StatusEffectTable: {},
			SkillUnit: {},
			SkillUnitEnd: {},
			SKID: { KR_THUNDERING_FOCUS: 6563, KR_THUNDERING_FOCUS_S: 6564 }
		});
		vm.runInContext(db.slice(start, end), context);
		const SkillEffect = {
			6563: { successEffectId: 'ef_druid_thundering_focus_g' },
			6564: { successEffectId: 'ef_druid_thundering_focus_y' }
		};
		context.mergeEz2Effects(EffectTable, SkillEffect);
		expect({ ...SkillEffect[6563] }).toEqual({ successEffectId: 'ef_druid_thundering_focus_g' });
		expect({ ...SkillEffect[6564] }).toEqual({ successEffectId: 'ef_druid_thundering_focus_y' });
	});
});
