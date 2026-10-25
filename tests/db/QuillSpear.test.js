import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Quill Spear, as the official client plays it: when the use-skill packet
// reports success with a target, one EZ2 effect on the caster, turned on
// screen toward the target. AT_QUILL_SPEAR plays quill_spear_3x7 and
// AT_QUILL_SPEAR_S quill_spear_5x7, whatever the level; no sequence.
// Each row is the EZ2 row of the same name: PosY 5, following the caster.
//
// Read as text: the tables import the renderer, which does not load without a canvas.
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const skillEffect = read('DB/Skills/SkillEffect.js');
const effectTable = read('DB/Effects/EffectTable.js');

const SKILLS = { AT_QUILL_SPEAR: ['3x7', 6588], AT_QUILL_SPEAR_S: ['5x7', 6589] };

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

function loadEffectManager(skillTable, positions, angle) {
	const source = read('Renderer/EffectManager.js')
		.replace(/^import .*;$/gm, '')
		.replace('export default EffectManager;', 'this.EffectManager = EffectManager;');
	const calls = [];
	const context = vm.createContext({
		console,
		Math,
		Number,
		Float32Array,
		SU: {},
		SkillUnit: {},
		SkillEffect: skillTable,
		EntityManager: { get: aid => (positions[aid] ? { position: positions[aid] } : null) },
		screenAngle: (from, to) => {
			calls.push([from, to]);
			return angle;
		}
	});
	vm.runInContext(source, context);
	const spammed = [];
	context.EffectManager.spam = params => spammed.push(params);
	return { EffectManager: context.EffectManager, spammed, calls };
}

describe('Quill Spear', () => {
	it('plays one size per skill on the caster, aimed, only from the successful use-skill packet', () => {
		for (const [name, [size]] of Object.entries(SKILLS)) {
			const row = skillRow(name);
			expect(row).toContain(`successEffectIdOnCasterAimed: 'ef_druid_quill_spear_${size}'`);
			// The second part, effect 2442's streak lines, also on the caster (StreakLines.test.js)
			expect(row).toContain("successEffectIdOnCaster: 'ef_druid_quill_spear_line'");
			expect(row.replace("successEffectIdOnCaster: 'ef_druid_quill_spear_line'", '')).not.toMatch(/\b(effectId|effectIdOnCaster|successEffectId|successEffectIdOnCaster)\w*ByLevel|\b(effectId|effectIdOnCaster|successEffectId|successEffectIdOnCaster):/);
			expect(row).toContain("hitEffectId: 'ef_druid_hit_raptor'");
		}
	});

	it('uses the EZ2 rows: one STR, light version, sound, following the caster, PosY 5', () => {
		for (const size of ['3x7', '5x7']) {
			const name = `quill_spear_${size}`;
			const dir = `druid/at_quill_spear/${name}`;
			const [layer, extra] = entry(`ef_druid_${name}`);
			expect(extra).toBeUndefined();
			expect(layer).toContain(`file: '${dir}/${name}'`);
			expect(layer).toContain(`min: '${dir}/min_${name}'`);
			expect(layer).toContain("wav: 'effect/druid/at_quill_spear'");
			expect(layer).toContain('yOffset: 5');
			expect(layer).toContain('attachedEntity: true');
			// Turned once by the caller, not re-aimed every frame
			expect(layer).not.toMatch(/rotateToTarget|renderBeforeEntities|xOffset|delayStart|repeat/);
		}
		expect(effectTable).not.toMatch(/\n\tef_druid_quill_spear(_s)?: \[/);
	});

	it('spamSkillSuccess plays it on the caster turned by the screen angle to the target, at any level', () => {
		const positions = { 10: [1, 2, 0], 20: [5, 2, 0] };
		const { EffectManager, spammed, calls } = loadEffectManager(
			{ 6588: { successEffectIdOnCasterAimed: 'ef_druid_quill_spear_3x7' } },
			positions,
			123.5
		);
		for (const level of [1, 5, 10, undefined]) {
			spammed.length = 0;
			EffectManager.spamSkillSuccess(6588, 20, 7, 10, level);
			expect(spammed.map(p => [p.effectId, p.ownerAID, p.otherAID, p.startTick, p.screenTurn])).toEqual([
				['ef_druid_quill_spear_3x7', 10, 20, 7, 123.5]
			]);
		}
		expect(calls[0]).toEqual([positions[10], positions[20]]);
		// No target (or an unknown one): nothing, as in the client
		for (const dest of [0, 30]) {
			spammed.length = 0;
			EffectManager.spamSkillSuccess(6588, dest, 7, 10, 5);
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
		const EffectTable = {};
		for (const size of ['3x7', '5x7']) {
			const name = `quill_spear_${size}`;
			Ez2streffect[name] = {
				FilePath: `DRUID\\AT_QUILL_SPEAR\\${name}\\${name}.str`,
				SoundPath: 'effect\\DRUID\\AT_QUILL_SPEAR.wav',
				PosX: 0,
				PosY: 5,
				IsFloor: false,
				StartDelayTime: 0
			};
			EffectTable[`ef_druid_${name}`] = [{ type: 'STR', file: `druid/at_quill_spear/${name}/${name}` }];
		}
		const context = vm.createContext({
			console: { log() {} },
			Ez2streffect,
			StatusEffectTable: {},
			SkillUnit: {},
			SkillUnitEnd: {},
			SKID: { AT_QUILL_SPEAR: 6588, AT_QUILL_SPEAR_S: 6589 }
		});
		vm.runInContext(db.slice(start, end), context);
		const SkillEffect = {
			6588: { successEffectIdOnCasterAimed: 'ef_druid_quill_spear_3x7' },
			6589: { successEffectIdOnCasterAimed: 'ef_druid_quill_spear_5x7' }
		};
		context.mergeEz2Effects(EffectTable, SkillEffect);
		expect({ ...SkillEffect[6588] }).toEqual({ successEffectIdOnCasterAimed: 'ef_druid_quill_spear_3x7' });
		expect({ ...SkillEffect[6589] }).toEqual({ successEffectIdOnCasterAimed: 'ef_druid_quill_spear_5x7' });
	});
});
