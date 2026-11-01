import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Four Colors Charm (SS_FOUR_CHARM, 5499), as the official client shows it:
// one look per spirit charm element, picked from the caster's charm type
// (ZC_SPIRITS_ATTRIBUTE: 1 water, 2 earth, 3 fire, 4 wind). Each look is the
// EZ2 floor ring then the top layer (PosX 0, PosY 11). No charms, no effect.
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const effectTable = effectTableSource().replace(/\r\n/g, '\n');
const skillEffect = read('DB/Skills/SkillEffect.js');

function entry(id) {
	const start = effectTable.indexOf(`\n\t${id}: [`);
	expect(start, `${id} is defined`).toBeGreaterThan(-1);
	return effectTable.slice(start, effectTable.indexOf('\n\t],', start));
}

const LOOKS = [
	[1, 'water', 'ice'],
	[2, 'earth', 'earth'],
	[3, 'fire', 'fire'],
	[4, 'wind', 'wind']
];

// EffectManager with its imports stubbed, recording what spam() is asked to play.
function manager(SkillEffect, entities) {
	const code = read('Renderer/EffectManager.js')
		.replace(/^import .*;$/gm, '')
		.replace('export default EffectManager;', 'this.EffectManager = EffectManager;');
	const context = vm.createContext({
		console,
		Math,
		Number,
		Float32Array,
		SkillEffect,
		SU: {},
		SkillUnit: {},
		EffectDB: {},
		Session: { Entity: { position: [0, 0, 0] } },
		GraphicsSettings: { performanceMode: false },
		Renderer: { tick: 1000 },
		EntityManager: { get: aid => entities[aid] || null }
	});
	vm.runInContext(code, context);
	const played = [];
	context.EffectManager.spam = params => played.push(params);
	return { EffectManager: context.EffectManager, played };
}

const FOUR_CHARM = {
	effectIdByCharmType: {
		1: 'ef_ss_four_charm_water',
		2: 'ef_ss_four_charm_earth',
		3: 'ef_ss_four_charm_fire',
		4: 'ef_ss_four_charm_wind'
	}
};

describe('Four Colors Charm', () => {
	it('maps each charm type to its own look', () => {
		const row = skillEffect.slice(skillEffect.indexOf('SkillEffect[5499 /* SS_FOUR_CHARM */]'));
		const body = row.slice(0, row.indexOf('}; //Four Colors Charm'));
		for (const [type, name] of LOOKS) {
			expect(body).toMatch(new RegExp(`${type}: 'ef_ss_four_charm_${name}'`));
		}
		expect(body).not.toMatch(/\beffectId:/);
	});

	it.each(LOOKS)('type %i (%s): floor ring then top layer, EZ2 placement and sounds', (type, name, folder) => {
		const text = entry(`ef_ss_four_charm_${name}`);
		const dir = `shinkiro_shiranui/ss_four_charm/four_charm_${folder}`;
		const floor = text.indexOf(`file: '${dir}_bottom/four_charm_${folder}_bottom'`);
		const top = text.indexOf(`file: '${dir}/four_charm_${folder}'`);
		expect(floor).toBeGreaterThan(-1);
		expect(top).toBeGreaterThan(floor);
		const floorRow = text.slice(floor, top);
		const topRow = text.slice(top);
		expect(floorRow).toMatch(new RegExp(`min: '${dir}_bottom/min_four_charm_${folder}_bottom'`));
		expect(floorRow).toMatch(new RegExp(`wav: 'effect/shinkiro_shiranui/ss_four_charm_${name}'`));
		expect(floorRow).toMatch(/renderBeforeEntities: true/);
		expect(topRow).toMatch(new RegExp(`min: '${dir}/min_four_charm_${folder}'`));
		expect(topRow).toMatch(/wav: 'effect\/shinkiro_shiranui\/ss_four_charm',/);
		expect(topRow).not.toMatch(/renderBeforeEntities/);
		for (const part of [floorRow, topRow]) {
			expect(part).toMatch(/xOffset: 0,/);
			expect(part).toMatch(/yOffset: 11,/);
			expect(part).toMatch(/attachedEntity: true/);
		}
	});

	it.each(LOOKS)('plays only the type %i look on the caster', (type, name) => {
		const { EffectManager, played } = manager({ 5499: FOUR_CHARM }, { 7: { GID: 7, charmType: type } });
		EffectManager.spamSkill(5499, 7, null, null, 7);
		expect(played).toHaveLength(1);
		expect(played[0].effectId).toBe(`ef_ss_four_charm_${name}`);
		expect(played[0].ownerAID).toBe(7);
	});

	it('plays nothing without charms or an unknown caster', () => {
		const { EffectManager, played } = manager({ 5499: FOUR_CHARM }, { 7: { GID: 7 }, 8: { GID: 8, charmType: 0 } });
		EffectManager.spamSkill(5499, 7, null, null, 7);
		EffectManager.spamSkill(5499, 8, null, null, 8);
		EffectManager.spamSkill(5499, 9, null, null, 9);
		expect(played).toHaveLength(0);
	});
});

describe('spirit charm packet', () => {
	it('reads 0x08cf as AID, type, count', () => {
		const code = read('Network/PacketStructure.js');
		expect(read('Network/PacketRegister.js')).toMatch(/0x8cf: PACKET\.ZC\.SPIRITS_ATTRIBUTE,/);
		const start = code.indexOf('PACKET.ZC.SPIRITS_ATTRIBUTE = ');
		const block = code.slice(start, code.indexOf('PACKET.ZC.SPIRITS_ATTRIBUTE.size = 10;', start) + 40);
		const context = vm.createContext({ PACKET: { ZC: {} } });
		vm.runInContext(block, context);
		const values = [1234, 3, 10];
		const fp = { readULong: () => values.shift(), readShort: () => values.shift() };
		const pkt = new context.PACKET.ZC.SPIRITS_ATTRIBUTE(fp);
		expect({ ...pkt }).toEqual({ AID: 1234, type: 3, num: 10 });
		expect(context.PACKET.ZC.SPIRITS_ATTRIBUTE.size).toBe(10);
	});

	it('keeps the last element when the charms run out', () => {
		const code = read('Engine/MapEngine/Skill.js');
		const start = code.indexOf('function onSpiritCharm(');
		const fn = code.slice(start, code.indexOf('\n}\n', start) + 2);
		const entity = {};
		const context = vm.createContext({
			EntityManager: { get: aid => (aid === 7 ? entity : null) },
			EffectManager: { remove() {}, spam() {} },
			StatusState: { EffectState: { HIDE: 2, CLOAK: 4 } },
			CHARM_ORB_EFFECTS: {},
			ALL_CHARM_ORB_EFFECTS: []
		});
		vm.runInContext(fn, context);
		context.onSpiritCharm({ AID: 7, type: 2, num: 10 });
		expect(entity.charmType).toBe(2);
		context.onSpiritCharm({ AID: 7, type: 0, num: 0 });
		expect(entity.charmType).toBe(2);
		context.onSpiritCharm({ AID: 7, type: 4, num: 1 });
		expect(entity.charmType).toBe(4);
		context.onSpiritCharm({ AID: 8, type: 1, num: 10 });
		expect(code).toMatch(/hookPacket\(PACKET\.ZC\.SPIRITS_ATTRIBUTE, onSpiritCharm\)/);
	});
});

describe('EZ2 merge and Four Charm', () => {
	it('adds none of the bson Four Charm files on top of the per-element rows', () => {
		const db = read('DB/DBManager.js');
		const start = db.indexOf('function loadBSONFile(');
		const end = db.indexOf('function loadAttendanceFile(');
		const records = {};
		for (const [, , folder] of LOOKS) {
			for (const name of [`four_charm_${folder}`, `four_charm_${folder}_bottom`]) {
				records[name] = {
					FilePath: `SHINKIRO_SHIRANUI\\SS_FOUR_CHARM\\${name}\\${name}.str`,
					IsFloor: name.endsWith('_bottom'),
					PosY: 11
				};
			}
		}
		const EffectTable = {};
		for (const [, name, folder] of LOOKS) {
			const dir = `shinkiro_shiranui/ss_four_charm/four_charm_${folder}`;
			EffectTable[`ef_ss_four_charm_${name}`] = [
				{ type: 'STR', file: `${dir}_bottom/four_charm_${folder}_bottom` },
				{ type: 'STR', file: `${dir}/four_charm_${folder}` }
			];
		}
		const context = vm.createContext({
			console: { log() {} },
			Ez2streffect: records,
			SKID: { SS_FOUR_CHARM: 5499 },
			StatusEffectTable: {}
		});
		vm.runInContext(db.slice(start, end), context);
		const SkillEffect = { 5499: { effectIdByCharmType: { ...FOUR_CHARM.effectIdByCharmType } } };
		context.mergeEz2Effects(EffectTable, SkillEffect);
		expect(Object.keys(SkillEffect[5499])).toEqual(['effectIdByCharmType']);
	});
});
