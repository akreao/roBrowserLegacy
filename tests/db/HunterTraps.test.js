import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Hunter traps as the official client (kRO 2020-12-29) plays them. When a trap
// goes off the server turns its unit into a used trap (UNT_USED_TRAPS, 0x8c);
// the client then plays the trap's own effect once where it stands. The damage
// comes from the trap unit, so each hit only gets the hit flash (effect 0).
//
// Read as text: the tables import the renderer, which does not load without a canvas.
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const skillEffect = read('DB/Skills/SkillEffect.js');

const UNT_USED_TRAPS = 0x8c;

function skillRow(name) {
	const start = skillEffect.indexOf(`SkillEffect[SK.${name}] =`);
	expect(start, name).toBeGreaterThan(-1);
	const text = skillEffect.slice(skillEffect.indexOf('{', start), skillEffect.indexOf('};', start) + 1);
	return JSON.parse(JSON.stringify(vm.runInNewContext(`(${text})`)));
}

function effectRow(id) {
	const source = read('DB/Effects/EffectTable.js');
	const start = source.indexOf(`\n\t${id}: [`);
	expect(start, `${id} is defined`).toBeGreaterThan(-1);
	const end = source.indexOf('\n\t],', start);
	return vm.runInNewContext(`(${source.slice(start, end + 3).trim().replace(/^\w+:/, '').replace(/,$/, '')})`);
}

function triggers() {
	const source = read('DB/Skills/SkillUnit.js');
	const start = source.indexOf('export const SkillUnitTrigger = {};');
	expect(start).toBeGreaterThan(-1);
	const lines = source.slice(start).split('\n').filter(line => line.startsWith('SkillUnitTrigger['));
	const SU = vm.runInNewContext(`(${read('DB/Skills/SkillUnitConst.js').match(/\{[\s\S]*\}/)[0]})`);
	const EC = vm.runInNewContext(`(${read('DB/Effects/EffectConst.js').match(/\{[\s\S]*\}/)[0]})`);
	const table = {};
	vm.runInNewContext(lines.join('\n'), { SkillUnitTrigger: table, SU, EC });
	return { table, SU };
}

function loadEffectManager(entities) {
	const source = read('Renderer/EffectManager.js')
		.replace(/^import .*;$/gm, '')
		.replace('export default EffectManager;', 'this.EffectManager = EffectManager;');
	const { table, SU } = triggers();
	const context = vm.createContext({
		console,
		Math,
		Number,
		Float32Array,
		SU,
		SkillUnit: {},
		SkillUnitEnd: {},
		SkillUnitTrigger: table,
		SkillEffect: {},
		Preferences: { effect: true },
		Renderer: { tick: 1000 },
		EntityManager: { get: uid => entities[uid] || null }
	});
	vm.runInContext(source, context);
	const spammed = [];
	context.EffectManager.spam = params => spammed.push(JSON.parse(JSON.stringify(params)));
	return { EffectManager: context.EffectManager, spammed, SU };
}

describe('a trap going off', () => {
	it('plays the trap effect once at the trap when its unit turns into a used trap', () => {
		const trap = { skillUnitId: 0x8f, position: [10, 20, 1] };
		const { EffectManager, spammed } = loadEffectManager({ 7: trap });
		EffectManager.spamSkillUnitTrigger(7, UNT_USED_TRAPS);
		EffectManager.spamSkillUnitTrigger(7, UNT_USED_TRAPS);
		expect(spammed).toEqual([{ effectId: 106, position: [10, 20, 1] }]);
		expect(trap.skillUnitId).toBe(UNT_USED_TRAPS);
	});

	it('plays nothing for other looks or traps without an effect', () => {
		const skid = { skillUnitId: 0x90, position: [1, 1, 0] };
		const mine = { skillUnitId: 0x8f, position: [1, 1, 0] };
		const { EffectManager, spammed } = loadEffectManager({ 1: skid, 2: mine });
		EffectManager.spamSkillUnitTrigger(1, UNT_USED_TRAPS);
		EffectManager.spamSkillUnitTrigger(2, 0x88);
		expect(spammed).toEqual([]);
		expect(mine.skillUnitId).toBe(0x8f);
	});
});

describe('Blast Mine', () => {
	it('blasts at the trap (106, sound on tick 20); each hit gets the hit flash only', () => {
		expect(triggers().table[0x8f]).toEqual([106]);
		expect(skillRow('HT_BLASTMINE')).toEqual({ hitEffectId: [0] });
		expect(effectRow(106)).toEqual([
			{ type: 'STR', file: 'blastmine', wav: 'effect/hunter_blastmine', delayWav: 333, attachedEntity: false }
		]);
	});
});

describe('Claymore Trap', () => {
	it('explodes at the trap (107); each hit gets the hit flash only', () => {
		expect(triggers().table[0x98]).toEqual([107]);
		expect(skillRow('HT_CLAYMORETRAP')).toEqual({ hitEffectId: [0] });
	});
});

describe('Freezing Trap', () => {
	it('freezes at the trap (108); each hit gets the hit flash only', () => {
		expect(triggers().table[0x97]).toEqual([108]);
		expect(skillRow('HT_FREEZINGTRAP')).toEqual({ hitEffectId: [0] });
	});
});

describe('Sandman', () => {
	it('puts SandMan.str at the trap (139, silent); the sleep has no hit effect', () => {
		expect(triggers().table[0x95]).toEqual([139]);
		expect(skillRow('HT_SANDMAN')).toEqual({});
		expect(effectRow(139)).toEqual([{ type: 'STR', file: 'sandman', attachedEntity: false }]);
	});
});

describe('Flasher', () => {
	it('flashes at the trap (99); a hit gets the hit flash only', () => {
		expect(triggers().table[0x96]).toEqual([99]);
		expect(skillRow('HT_FLASHER')).toEqual({ hitEffectId: [0] });
	});
});

describe('Land Mine', () => {
	it('plays nothing at the cell or on the target, only the hit flash per hit', () => {
		expect(skillRow('HT_LANDMINE')).toEqual({ hitEffectId: [0] });
		// Stepped on, the unit turns into a used trap: no effect of its own.
		expect(triggers().table[0x93]).toBeUndefined();
	});
});
