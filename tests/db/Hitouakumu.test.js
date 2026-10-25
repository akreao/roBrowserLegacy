import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import shuffledGrid from '../../src/Renderer/Effects/ShuffledGrid.js';
import spinSets, { SPIN_SLOT } from '../../src/Renderer/Effects/SpinSets.js';

// Kunai - Nightmare, as the official client plays it: when the use-skill packet
// succeeds, the floor burst at the caster, then all three blade files. Each is a
// set of 15-19 copies: copy i of n turned clockwise i x 360 / n degrees plus a
// random 0 .. floor(360 / n) - 1, started in a 32 ms slot taken from a shuffle of
// 0 .. n - 1, set k 10 slots after set k - 1.
//
// Read as text: the tables import the renderer, which does not load without a canvas.
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const skillEffect = read('DB/Skills/SkillEffect.js');
const effectTable = read('DB/Effects/EffectTable.js');

const SETS = ['ef_ss_hitouakumu_00', 'ef_ss_hitouakumu_01', 'ef_ss_hitouakumu_02'];
const ROW = { successEffectId: 'ef_ss_hitouakumu', successEffectSpinSets: SETS };

function entry(id) {
	const start = effectTable.indexOf(`\n\t${id}: [`);
	expect(start, `${id} is defined`).toBeGreaterThan(-1);
	return effectTable.slice(start, effectTable.indexOf('\n\t],', start));
}

function skillRow() {
	const start = skillEffect.indexOf('SkillEffect[SK.SS_HITOUAKUMU] =');
	expect(start).toBeGreaterThan(-1);
	return skillEffect.slice(start, skillEffect.indexOf('}; //Kunai - Nightmare', start));
}

function loadEffectManager(skillTable, entities) {
	const source = read('Renderer/EffectManager.js')
		.replace(/^import .*;$/gm, '')
		.replace('export default EffectManager;', 'this.EffectManager = EffectManager;');
	const context = vm.createContext({
		console,
		Math,
		Number,
		Float32Array,
		SU: {},
		SkillUnit: {},
		SkillEffect: skillTable,
		shuffledGrid,
		spinSets,
		SPIN_SLOT,
		Renderer: { tick: 1000 },
		EntityManager: { get: id => entities[id] }
	});
	vm.runInContext(source, context);
	const spammed = [];
	context.EffectManager.spam = params => spammed.push(params);
	return { EffectManager: context.EffectManager, spammed };
}

describe('spinSets', () => {
	it('fans 15-19 copies per set all round, in shuffled 32 ms slots, sets 10 slots apart', () => {
		expect(SPIN_SLOT).toBe(32);
		for (let run = 0; run < 50; run++) {
			const copies = spinSets(3);
			for (let set = 0; set < 3; set++) {
				const mine = copies.filter(c => c.set === set);
				const n = mine.length;
				expect(n).toBeGreaterThanOrEqual(15);
				expect(n).toBeLessThanOrEqual(19);
				const step = 360 / n;
				mine.forEach((c, i) => {
					expect(c.turn).toBeGreaterThanOrEqual(i * step);
					expect(c.turn).toBeLessThan(i * step + Math.floor(step));
					expect(Math.abs(Math.round(c.turn - i * step) - (c.turn - i * step))).toBeLessThan(1e-9);
				});
				const slots = mine.map(c => c.slot - 10 * set).sort((a, b) => a - b);
				expect(slots).toEqual(Array.from({ length: n }, (_, i) => i));
			}
		}
	});

	it('uses the edges of the random ranges', () => {
		// random() always 0: 15 copies, no jitter
		const low = spinSets(1, () => 0);
		expect(low).toHaveLength(15);
		expect(low.map(c => c.turn)).toEqual(Array.from({ length: 15 }, (_, i) => i * 24));
		// random() just under 1: 19 copies, jitter up to floor(360 / 19) - 1 = 17
		const high = spinSets(1, () => 0.999999);
		expect(high).toHaveLength(19);
		expect(high[0].turn).toBe(17);
	});
});

describe('Kunai - Nightmare', () => {
	it('plays only from the successful use-skill packet', () => {
		const row = skillRow();
		expect(row).toContain("successEffectId: 'ef_ss_hitouakumu'");
		expect(row).toContain(
			"successEffectSpinSets: ['ef_ss_hitouakumu_00', 'ef_ss_hitouakumu_01', 'ef_ss_hitouakumu_02']"
		);
		expect(row).not.toMatch(/\b(effectId|hitEffectId|successEffectIdOnCaster):/);
	});

	it('uses the EZ2 rows, placed on the ground (not following anyone), PosY 0', () => {
		const dir = 'shinkiro_shiranui/ss_hitouakumu/';
		const burst = entry('ef_ss_hitouakumu');
		expect(burst).toContain(`file: '${dir}hitouakumu/hitouakumu'`);
		expect(burst).toContain(`min: '${dir}hitouakumu/min_hitouakumu'`);
		expect(burst).toContain("wav: 'effect/shinkiro_shiranui/ss_hitouakumu'");
		expect(burst).toContain('renderBeforeEntities: true');
		expect(burst).toContain('yOffset: 0');
		expect(burst).not.toMatch(/attachedEntity|delayStart|repeat|xOffset/);
		for (const n of ['00', '01', '02']) {
			const row = entry(`ef_ss_hitouakumu_${n}`);
			expect(row).toContain(`file: '${dir}hitouakumu_${n}/hitouakumu_${n}'`);
			expect(row).toContain(`min: '${dir}hitouakumu_${n}/min_hitouakumu_${n}'`);
			expect(row).toContain('yOffset: 0');
			expect(row).not.toMatch(/wav|attachedEntity|renderBeforeEntities|delayStart|repeat|xOffset/);
		}
	});

	it('spamSkillSuccess plays the burst, then every set at the target, turned and slotted', () => {
		const caster = { position: [100, 200, 3] };
		const { EffectManager, spammed } = loadEffectManager({ 5494: ROW }, { 20: caster });
		EffectManager.spamSkillSuccess(5494, 20, null, 20, 1);
		const [burst, ...copies] = spammed;
		expect(burst).toMatchObject({ effectId: 'ef_ss_hitouakumu', ownerAID: 20 });
		expect(copies.length).toBeGreaterThanOrEqual(45);
		expect(copies.length).toBeLessThanOrEqual(57);
		SETS.forEach((id, set) => {
			const mine = copies.filter(p => p.effectId === id);
			expect(mine.length).toBeGreaterThanOrEqual(15);
			const slots = mine.map(p => (p.startTick - 1000) / 32 - 10 * set).sort((a, b) => a - b);
			expect(slots).toEqual(Array.from({ length: mine.length }, (_, i) => i));
		});
		for (const copy of copies) {
			expect(copy.position).toEqual([100, 200, 3]);
			expect(copy.position).not.toBe(caster.position);
			expect(copy.screenTurn).toBeGreaterThanOrEqual(0);
			expect(copy.screenTurn).toBeLessThan(360);
		}
		// Nothing when nobody is in view
		spammed.length = 0;
		EffectManager.spamSkillSuccess(5494, 30, null, 31, 1);
		expect(spammed.filter(p => p.screenTurn !== undefined)).toEqual([]);
	});

	it('is not mapped again when the client EZ2 table loads', () => {
		const db = read('DB/DBManager.js');
		const start = db.indexOf('function loadBSONFile(');
		const end = db.indexOf('function loadAttendanceFile(');
		expect(start).toBeGreaterThan(-1);
		expect(end).toBeGreaterThan(start);
		const Ez2streffect = {};
		for (const n of ['', '_00', '_01', '_02']) {
			Ez2streffect[`hitouakumu${n}`] = {
				FilePath: `SHINKIRO_SHIRANUI\\SS_HITOUAKUMU\\hitouakumu${n}\\hitouakumu${n}.str`,
				SoundPath: n ? '' : 'effect\\SHINKIRO_SHIRANUI\\SS_HITOUAKUMU.wav',
				PosX: 0,
				PosY: 0,
				IsFloor: !n,
				StartDelayTime: 0
			};
		}
		const context = vm.createContext({
			console: { log() {} },
			Ez2streffect,
			StatusEffectTable: {},
			SKID: { SS_HITOUAKUMU: 5494 }
		});
		vm.runInContext(db.slice(start, end), context);
		const EffectTable = {};
		for (const n of ['', '_00', '_01', '_02']) {
			EffectTable[`ef_ss_hitouakumu${n}`] = [
				{ type: 'STR', file: `shinkiro_shiranui/ss_hitouakumu/hitouakumu${n}/hitouakumu${n}` }
			];
		}
		const SkillEffect = { 5494: { ...ROW } };
		context.mergeEz2Effects(EffectTable, SkillEffect);
		expect({ ...SkillEffect[5494] }).toEqual(ROW);
	});
});

describe('StrEffect screenTurn', () => {
	const code = read('Renderer/Effects/StrEffect.js')
		.replace(/^import .*;$/gm, '')
		.replace('export default StrEffect;', 'this.StrEffect = StrEffect;');

	function rendered(props) {
		const strFile = { fps: 60, maxKey: 10, layernum: 0, layers: [] };
		const context = vm.createContext({
			Float32Array,
			Math,
			Client: { loadFile: () => strFile },
			glMatrix: { mat4: { create: () => new Float32Array(16) } }
		});
		vm.runInContext(code, context);
		const str = Object.assign(new context.StrEffect('a.str', [0, 0, 0], 0, ''), props);
		str.render(null, 50);
		return str;
	}

	it('turns the art clockwise on screen about its centre and draws it over the ground', () => {
		const str = rendered({ ez2Offset: [0, 0], screenTurn: 90 });
		expect(str.aimAngle).toBe(-90);
		expect(str.aimed).toBe(true);
		// Art 10 pixels right of the centre goes 10 pixels down the screen (STR y points down)
		const out = [0, 0];
		str.layout({ pos: [330, 240] }, 1, out);
		expect(out.map(v => Math.round(v * 1e6) / 1e6 + 0)).toEqual([0, 10]);
	});

	it('leaves an effect without a turn as it was', () => {
		const str = rendered({ ez2Offset: [0, 0] });
		expect(str.aimAngle).toBe(0);
		expect(str.aimed).toBe(false);
	});
});
