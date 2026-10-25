import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Typhoon Wing, as the official client plays it: when the ground-skill packet
// arrives, one EZ2 effect (top layer plus floor layer) at the target cell.
// Level 1-5 plays the 5x5 size, level 6 and up the 7x7 size.
// Each row is the EZ2 row of the same name: PosY 10.
//
// Read as text: the tables import the renderer, which does not load without a canvas.
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const skillEffect = read('DB/Skills/SkillEffect.js');
const effectTable = read('DB/Effects/EffectTable.js');

const SKID = 6557;
const CAST = 'ef_druid_typhoon_wing_cast';
const BY_LEVEL = [...Array(5).fill('ef_druid_typhoon_wing_5x5'), 'ef_druid_typhoon_wing_7x7'];

function entry(id) {
	const start = effectTable.indexOf(`\n\t${id}: [`);
	expect(start, `${id} is defined`).toBeGreaterThan(-1);
	return effectTable
		.slice(start, effectTable.indexOf('\n\t],', start))
		.split('\n\t\t{')
		.slice(1);
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

describe('Typhoon Wing', () => {
	it('picks the size by level, only from the ground packet', () => {
		const start = skillEffect.indexOf('SkillEffect[SK.KR_TYPHOON_WING] =');
		expect(start).toBeGreaterThan(-1);
		const row = skillEffect.slice(start, skillEffect.indexOf('\n', start));
		const list = row.match(/groundEffectIdByLevel: \[([^\]]+)\]/);
		expect(list).not.toBeNull();
		expect([...list[1].matchAll(/'(\w+)'/g)].map(m => m[1])).toEqual(BY_LEVEL);
		expect(row).not.toMatch(/\b(effectId|effectIdOnCaster|successEffectId|groundEffectId):/);
		expect(read('Engine/MapEngine/Skill.js')).toContain(
			'EffectManager.spamSkill(pkt.SKID, pkt.AID, position, null, pkt.AID, pkt.level);'
		);
	});

	it('uses the EZ2 rows: top and floor STR, light version, sound on top, PosY 10', () => {
		for (const size of ['5x5', '7x7']) {
			const name = `typhoon_wing_${size}`;
			const dir = `druid/kr_typhoon_wing/${name}`;
			const [top, floor, extra] = entry(`ef_druid_${name}`);
			expect(extra).toBeUndefined();
			expect(top).toContain(`file: '${dir}/${name}'`);
			expect(top).toContain(`min: '${dir}/min_${name}'`);
			expect(top).toContain("wav: 'effect/druid/kr_typhoon_wing'");
			expect(top).not.toContain('renderBeforeEntities');
			expect(floor).toContain(`file: '${dir}_bottom/${name}_bottom'`);
			expect(floor).toContain(`min: '${dir}_bottom/min_${name}_bottom'`);
			expect(floor).toContain('renderBeforeEntities: true');
			expect(floor).not.toContain('wav:');
			for (const layer of [top, floor]) {
				expect(layer).toContain('yOffset: 10');
				expect(layer).not.toMatch(/xOffset|delayStart|delayOffset|repeat|attachedEntity/);
			}
		}
		expect(effectTable).not.toMatch(/\n\tef_druid_typhoon_wing: \[/);
	});

	it('spamSkill plays 5x5 at the cell below level 6 and 7x7 from 6, nothing from damage packets or without a level', () => {
		const { EffectManager, spammed } = loadEffectManager({ [SKID]: { groundEffectIdByLevel: BY_LEVEL } });
		const cell = [100, 120, 0];
		for (let level = 1; level <= 10; level++) {
			spammed.length = 0;
			EffectManager.spamSkill(SKID, 10, cell, null, 10, level);
			const size = level < 6 ? '5x5' : '7x7';
			expect(spammed.map(p => [p.effectId, p.ownerAID, p.position, p.skillLevel])).toEqual([
				[`ef_druid_typhoon_wing_${size}`, 10, cell, level]
			]);
		}
		spammed.length = 0;
		EffectManager.spamSkill(SKID, 20, null, 1500, 10);
		EffectManager.spamSkill(SKID, 20, null, 1500, 10, 5);
		EffectManager.spamSkill(SKID, 10, cell, null, 10, 0);
		EffectManager.spamSkill(SKID, 10, cell, null, 10);
		expect(spammed).toEqual([]);
	});

	it('casts with the green untinted cast circle (client effect 56) instead of the element aura', () => {
		const start = skillEffect.indexOf('SkillEffect[SK.KR_TYPHOON_WING] =');
		const row = skillEffect.slice(start, skillEffect.indexOf('\n', start));
		expect(row).toContain(`castAuraEffectId: '${CAST}'`);
		expect(row).not.toMatch(/hideCastAura|beginCastEffectId/);
		const [circle, extra] = entry(CAST);
		expect(extra).toBeUndefined();
		expect(circle).toContain("type: 'FUNC'");
		expect(circle).toContain('attachedEntity: true');
		// castLoop: removed when the cast is cancelled (EffectManager.removeCastLoops)
		expect(circle).toContain('castLoop: true');
		expect(circle).toContain("wav: 'effect/ef_beginspell'");
		expect(circle.replace(/\s+/g, ' ')).toContain(
			"new CastCircle( Params.Init.ownerEntity.position, Params.Inst.startTick, Params.Init.duration, 'magic_green.tga' )"
		);
		// the cast aura is replaced by castAuraEffectId and lasts the cast time
		const entity = read('Engine/MapEngine/Entity.js');
		expect(entity).toContain('EF_Init_Par.effectId = SkillEffect[pkt.SKID].castAuraEffectId;');
		expect(entity).toContain('EffectManager.removeCastLoops(entity.GID);');
	});

	it('is not mapped again when the client EZ2 table loads', () => {
		const db = read('DB/DBManager.js');
		const start = db.indexOf('function loadBSONFile(');
		const end = db.indexOf('function loadAttendanceFile(');
		expect(start).toBeGreaterThan(-1);
		expect(end).toBeGreaterThan(start);
		const Ez2streffect = {};
		const EffectTable = {};
		for (const size of ['5x5', '7x7']) {
			for (const part of ['', '_bottom']) {
				const name = `typhoon_wing_${size}${part}`;
				Ez2streffect[name] = {
					FilePath: `DRUID\\KR_TYPHOON_WING\\${name}\\${name}.str`,
					SoundPath: part ? '' : 'effect\\DRUID\\KR_TYPHOON_WING.wav',
					PosX: 0,
					PosY: 10,
					IsFloor: !!part,
					StartDelayTime: 0
				};
			}
			const name = `typhoon_wing_${size}`;
			EffectTable[`ef_druid_${name}`] = [
				{ type: 'STR', file: `druid/kr_typhoon_wing/${name}/${name}` },
				{ type: 'STR', file: `druid/kr_typhoon_wing/${name}_bottom/${name}_bottom` }
			];
		}
		const context = vm.createContext({
			console: { log() {} },
			Ez2streffect,
			StatusEffectTable: {},
			SkillUnit: {},
			SkillUnitEnd: {},
			SKID: { KR_TYPHOON_WING: SKID }
		});
		vm.runInContext(db.slice(start, end), context);
		const SkillEffect = { [SKID]: { castAuraEffectId: CAST, groundEffectIdByLevel: BY_LEVEL } };
		context.mergeEz2Effects(EffectTable, SkillEffect);
		expect({ ...SkillEffect[SKID] }).toEqual({ castAuraEffectId: CAST, groundEffectIdByLevel: BY_LEVEL });
	});
});
