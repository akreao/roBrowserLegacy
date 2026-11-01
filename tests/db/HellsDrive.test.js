import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import shuffledGrid from '../../src/Renderer/Effects/ShuffledGrid.js';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Hell's Drive, as the official client plays it: when the use-skill packet
// succeeds, n spots on an n x n grid around the target (one cell apart, one per
// row and column), 32 ms apart; each spot is the floor layer plus one of three
// blasts at random. n is 3 at level 1-3, 5 at 4-6, 7 at 7-9, 9 at 10.
//
// Read as text: the tables import the renderer, which does not load without a canvas.
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const skillEffect = read('DB/Skills/SkillEffect.js');
const effectTable = effectTableSource().replace(/\r\n/g, '\n');

const BLASTS = ['ef_hn_hells_drive_00', 'ef_hn_hells_drive_01', 'ef_hn_hells_drive_02'];
const IDS = ['ef_hn_hells_drive_bottom', BLASTS];
const SIZES = [3, 3, 3, 5, 5, 5, 7, 7, 7, 9];
const ROW = { successEffectGridIds: IDS, successEffectGridSizeByLevel: SIZES, successEffectGridStep: 32 };

function entry(id) {
	const start = effectTable.indexOf(`\n\t${id}: [`);
	expect(start, `${id} is defined`).toBeGreaterThan(-1);
	return effectTable.slice(start, effectTable.indexOf('\n\t],', start));
}

function skillRow() {
	const start = skillEffect.indexOf('SkillEffect[SK.HN_HELLS_DRIVE] =');
	expect(start).toBeGreaterThan(-1);
	return skillEffect.slice(start, skillEffect.indexOf("}; //Hell's Drive", start));
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
		Renderer: { tick: 1000 },
		EntityManager: { get: id => entities[id] }
	});
	vm.runInContext(source, context);
	const spammed = [];
	context.EffectManager.spam = params => spammed.push(params);
	return { EffectManager: context.EffectManager, spammed };
}

describe('shuffledGrid', () => {
	it('puts one spot in each row and column, centred, one cell apart', () => {
		for (const n of [3, 5, 7, 9]) {
			for (let run = 0; run < 20; run++) {
				const spots = shuffledGrid(n);
				const half = (n - 1) / 2;
				expect(spots).toHaveLength(n);
				const range = Array.from({ length: n }, (_, i) => i - half);
				expect(spots.map(s => s[0]).sort((a, b) => a - b)).toEqual(range);
				expect(spots.map(s => s[1]).sort((a, b) => a - b)).toEqual(range);
			}
		}
	});

	it('pairs the two shuffles in order', () => {
		// random() always 0: each shuffle moves the front element to the back in turn
		expect(shuffledGrid(3, () => 0)).toEqual([
			[0, 0],
			[1, 1],
			[-1, -1]
		]);
	});
});

describe("Hell's Drive", () => {
	it('plays only from the successful use-skill packet, as a grid sized by level', () => {
		const row = skillRow();
		expect(row).toContain(
			"successEffectGridIds: ['ef_hn_hells_drive_bottom', ['ef_hn_hells_drive_00', 'ef_hn_hells_drive_01', 'ef_hn_hells_drive_02']]"
		);
		expect(row).toContain('successEffectGridSizeByLevel: [3, 3, 3, 5, 5, 5, 7, 7, 7, 9]');
		expect(row).toContain('successEffectGridStep: 32');
		expect(row).not.toMatch(/\b(effectId|hitEffectId|successEffectId|successEffectIdOnCaster):/);
		expect(effectTable).not.toContain('\n\tef_hn_hells_drive: [');
	});

	it('uses the EZ2 rows, placed on the ground (not following anyone), PosY 0', () => {
		const dir = 'hyper_novice/hn_hells_drive/';
		const bottom = entry('ef_hn_hells_drive_bottom');
		expect(bottom).toContain(`file: '${dir}hells_drive_bottom'`);
		expect(bottom).toContain('renderBeforeEntities: true');
		expect(bottom).toContain('yOffset: 0');
		expect(bottom).not.toMatch(/wav|attachedEntity|min:|delayStart|repeat|xOffset/);
		for (const n of ['00', '01', '02']) {
			const row = entry(`ef_hn_hells_drive_${n}`);
			expect(row).toContain(`file: '${dir}hells_drive_${n}'`);
			expect(row).toContain(`wav: 'effect/hyper_novice/hn_hells_drive_${n}'`);
			expect(row).toContain('yOffset: 0');
			expect(row).not.toMatch(/attachedEntity|renderBeforeEntities|min:|delayStart|repeat|xOffset/);
		}
	});

	it('spamSkillSuccess spreads floor + one blast per spot around the target, 32 ms apart', () => {
		const target = { position: [100, 200, 3] };
		const { EffectManager, spammed } = loadEffectManager({ 5458: ROW }, { 20: target });
		for (let level = 1; level <= 11; level++) {
			spammed.length = 0;
			EffectManager.spamSkillSuccess(5458, 20, null, 20, level);
			const n = SIZES[Math.min(level, 10) - 1];
			expect(spammed).toHaveLength(2 * n);
			for (let k = 0; k < n; k++) {
				const [floor, blast] = spammed.slice(2 * k, 2 * k + 2);
				expect(floor.effectId).toBe('ef_hn_hells_drive_bottom');
				expect(BLASTS).toContain(blast.effectId);
				expect(floor.position).toEqual(blast.position);
				expect(floor.startTick).toBe(1000 + 32 * k);
				expect(blast.startTick).toBe(1000 + 32 * k);
				expect(floor.position[2]).toBe(3);
			}
			const half = (n - 1) / 2;
			const xs = spammed.filter((_, i) => i % 2 === 0).map(p => p.position[0] - 100);
			const ys = spammed.filter((_, i) => i % 2 === 0).map(p => p.position[1] - 200);
			const range = Array.from({ length: n }, (_, i) => i - half);
			expect(xs.sort((a, b) => a - b)).toEqual(range);
			expect(ys.sort((a, b) => a - b)).toEqual(range);
		}
		// Nothing without a level or without the target in view
		for (const level of [0, undefined]) {
			spammed.length = 0;
			EffectManager.spamSkillSuccess(5458, 20, null, 20, level);
			expect(spammed).toEqual([]);
		}
		spammed.length = 0;
		EffectManager.spamSkillSuccess(5458, 30, null, 31, 5);
		expect(spammed).toEqual([]);
	});

	it('picks all three blasts over many spots', () => {
		const { EffectManager, spammed } = loadEffectManager({ 5458: ROW }, { 20: { position: [0, 0, 0] } });
		for (let i = 0; i < 20; i++) {
			EffectManager.spamSkillSuccess(5458, 20, null, 20, 10);
		}
		const picked = new Set(spammed.map(p => p.effectId).filter(id => id !== 'ef_hn_hells_drive_bottom'));
		expect([...picked].sort()).toEqual(BLASTS);
	});

	it('is not mapped again when the client EZ2 table loads', () => {
		const db = read('DB/DBManager.js');
		const start = db.indexOf('function loadBSONFile(');
		const end = db.indexOf('function loadAttendanceFile(');
		expect(start).toBeGreaterThan(-1);
		expect(end).toBeGreaterThan(start);
		const Ez2streffect = {};
		for (const n of ['00', '01', '02', 'bottom']) {
			Ez2streffect[`hells_drive_${n}`] = {
				FilePath: `HYPER_NOVICE\\HN_HELLS_DRIVE\\hells_drive_${n}.str`,
				SoundPath: n === 'bottom' ? '' : `effect\\HYPER_NOVICE\\hn_hells_drive_${n}.wav`,
				PosX: 0,
				PosY: 0,
				IsFloor: n === 'bottom',
				StartDelayTime: 0
			};
		}
		const context = vm.createContext({
			console: { log() {} },
			Ez2streffect,
			StatusEffectTable: {},
			SKID: { HN_HELLS_DRIVE: 5458 }
		});
		vm.runInContext(db.slice(start, end), context);
		const EffectTable = {};
		for (const n of ['00', '01', '02', 'bottom']) {
			EffectTable[`ef_hn_hells_drive_${n}`] = [{ type: 'STR', file: `hyper_novice/hn_hells_drive/hells_drive_${n}` }];
		}
		const SkillEffect = { 5458: { ...ROW } };
		context.mergeEz2Effects(EffectTable, SkillEffect);
		expect({ ...SkillEffect[5458] }).toEqual(ROW);
	});
});
