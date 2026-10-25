import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import {
	REPEAT_WINDOW_MS,
	hastyFireInTheHoleEffects,
	isRepeatGroundPacket,
	waveDelay
} from 'DB/Effects/HastyFireInTheHoleEffect.js';

// Hasty Fire in the Hole, as the official client plays it: when the ground
// packet arrives, all three sizes at the target cell, one after the other.
// 5x5 at once, 7x7 18 ticks later, 9x9 18 ticks after that (the client passes
// 0, 288 and 576 ms as start delays). Each size has a top row with its own
// sound and a floor row under the characters, all at PosY 10.
//
// Read as text: the tables import the renderer, which does not load without a canvas.
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const skillEffect = read('DB/Skills/SkillEffect.js');
const TICK = 1000 / 60;
const SKID = 5411;

function row() {
	const start = skillEffect.indexOf('SkillEffect[SK.NW_HASTY_FIRE_IN_THE_HOLE] =');
	expect(start).toBeGreaterThan(-1);
	const text = skillEffect.slice(skillEffect.indexOf('{', start), skillEffect.indexOf('\n};', start) + 2);
	return vm.runInNewContext(`(${text})`, { REPEAT_WINDOW_MS });
}

function loadEffectManager(skillTable) {
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
		Renderer: { tick: 1000 },
		EntityManager: { get: () => null },
		isRepeatGroundPacket
	});
	vm.runInContext(source, context);
	const spammed = [];
	context.EffectManager.spam = params => spammed.push(params);
	return { EffectManager: context.EffectManager, spammed };
}

describe('Hasty Fire in the Hole', () => {
	it('plays 5x5, 7x7 and 9x9 in turn, 18 ticks apart, over and under the ground', () => {
		const { ef_nw_hasty_fire_in_the_hole: layers } = hastyFireInTheHoleEffects();
		expect(layers).toHaveLength(6);
		['5x5', '7x7', '9x9'].forEach((size, wave) => {
			const [top, floor] = layers.slice(wave * 2, wave * 2 + 2);
			const ticks = 1 + 18 * wave;
			for (const [layer, folder] of [
				[top, 'hasty_fire_in_the_hole'],
				[floor, 'hasty_fire_in_the_hole_bottom']
			]) {
				const path = `night_watch/nw_hasty_fire_in_the_hole/${folder}/`;
				expect(layer.type).toBe('STR');
				expect(layer.file).toBe(`${path}hasty_fire_in_the_hole_${size}`);
				expect(layer.texturePath).toBe(path);
				expect(layer.min).toBe(`${path}min_hasty_fire_in_the_hole_${size}`);
				expect(layer.xOffset).toBe(0);
				expect(layer.yOffset).toBe(10);
				expect(layer.delayStart).toBeCloseTo(ticks * TICK);
				expect(layer.attachedEntity).toBeUndefined();
			}
			expect(top.wav).toBe(`effect/night_watch/nw_hasty_fire_in_the_hole_${wave}`);
			expect(top.delayWav).toBeCloseTo(ticks * TICK);
			expect(top.renderBeforeEntities).toBeUndefined();
			expect(floor.wav).toBeUndefined();
			expect(floor.renderBeforeEntities).toBe(true);
		});
	});

	it('counts a start delay in whole ticks plus the tick the effect is made on', () => {
		expect(waveDelay(0)).toBeCloseTo(TICK);
		expect(waveDelay(288)).toBeCloseTo(19 * TICK);
		expect(waveDelay(576)).toBeCloseTo(37 * TICK);
	});

	it('plays the blast from the ground packet once, not from damage packets or resent ground packets', () => {
		const { EffectManager, spammed } = loadEffectManager({ [SKID]: row() });
		const cell = [100, 120, 0];
		// rAthena: the ground packet at 0, 300 and 600 ms, damage packets in between
		EffectManager.spamSkill(SKID, 10, cell, null, 10);
		EffectManager.spamSkill(SKID, 20, null, 1500, 10);
		EffectManager.spamSkill(SKID, 10, [...cell], null, 10);
		EffectManager.spamSkill(SKID, 10, [...cell], null, 10);
		expect(spammed.map(p => [p.effectId, p.position])).toEqual([['ef_nw_hasty_fire_in_the_hole', cell]]);
	});

	it('lets another caster, another cell, or the next cast through', () => {
		const t = 1e9;
		expect(isRepeatGroundPacket(SKID, 1, [5, 5], 700, t)).toBe(false);
		expect(isRepeatGroundPacket(SKID, 1, [5, 5], 700, t + 300)).toBe(true);
		expect(isRepeatGroundPacket(SKID, 1, [5, 5], 700, t + 600)).toBe(true);
		expect(isRepeatGroundPacket(SKID, 2, [5, 5], 700, t + 600)).toBe(false);
		expect(isRepeatGroundPacket(SKID, 1, [6, 5], 700, t + 600)).toBe(false);
		// Cooldown 1 s: the next cast
		expect(isRepeatGroundPacket(SKID, 1, [5, 5], 700, t + 1000)).toBe(false);
	});

	it('keeps the kRO effect merge from adding the sizes again', () => {
		const db = read('DB/DBManager.js');
		const start = db.indexOf('function loadBSONFile(');
		const end = db.indexOf('function loadAttendanceFile(');
		const records = {};
		['5x5', '7x7', '9x9'].forEach((size, wave) => {
			records[`hasty_fire_in_the_hole_${wave}`] = {
				FilePath: `NIGHT_WATCH\\NW_HASTY_FIRE_IN_THE_HOLE\\hasty_fire_in_the_hole\\hasty_fire_in_the_hole_${size}.str`,
				PosY: 10
			};
			records[`hasty_fire_in_the_hole_bottom_${wave}`] = {
				FilePath: `NIGHT_WATCH\\NW_HASTY_FIRE_IN_THE_HOLE\\hasty_fire_in_the_hole_bottom\\hasty_fire_in_the_hole_${size}.str`,
				PosY: 10,
				IsFloor: true
			};
		});
		const EffectTable = hastyFireInTheHoleEffects();
		const SkillEffect = { [SKID]: row() };
		const context = vm.createContext({
			console: { log() {} },
			Ez2streffect: records,
			SKID: { NW_HASTY_FIRE_IN_THE_HOLE: SKID },
			StatusEffectTable: {}
		});
		vm.runInContext(db.slice(start, end), context);
		context.mergeEz2Effects(EffectTable, SkillEffect);
		expect(SkillEffect[SKID].effectId).toBe('ef_nw_hasty_fire_in_the_hole');
		expect(Object.keys(SkillEffect[SKID]).sort()).toEqual(['effectId', 'groundRepeatWindowMs']);
	});
});
