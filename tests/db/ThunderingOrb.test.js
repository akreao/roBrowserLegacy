import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { REPEAT_WINDOW_MS, isRepeatGroundPacket } from 'DB/Effects/HastyFireInTheHoleEffect.js';
import {
	STEP,
	TURN_FAR,
	TURN_NEAR,
	controlPoint,
	fromWorld,
	pathLeft,
	pathPoint,
	raiseOnScreen,
	throwPoint,
	toWorld
} from 'Renderer/Effects/BezierArcThrowSim.js';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Thundering Orb, as the official client plays it: from the ground packet
// only. An orb (the same for both skills) flies from 2 cells above the caster
// on screen to the cell on a quadratic Bezier, dropping 0.07 of the path each
// tick, its control point the throw turned 240 or 120 degrees about the
// vertical. 300 ms after the packet (19 ticks), the burst: green for
// KR_THUNDERING_ORB, yellow for KR_THUNDERING_ORB_S, top and floor rows at PosY 10.
//
// Read as text: the tables import the renderer, which does not load without a canvas.
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const skillEffect = read('DB/Skills/SkillEffect.js');
const effectTable = effectTableSource().replace(/\r\n/g, '\n');

function entry(id) {
	const start = effectTable.indexOf(`\n\t${id}: [`);
	expect(start, `${id} is defined`).toBeGreaterThan(-1);
	const text = effectTable.slice(effectTable.indexOf('[', start), effectTable.indexOf('\n\t],', start) + 3);
	return vm.runInNewContext(`(${text})`);
}
const TICK = 1000 / 60;
const SKILLS = { KR_THUNDERING_ORB: ['g', 6565], KR_THUNDERING_ORB_S: ['y', 6566] };
const close = (a, b) => a.forEach((v, i) => expect(v).toBeCloseTo(b[i], 5));

function row(name) {
	const start = skillEffect.indexOf(`SkillEffect[SK.${name}] =`);
	expect(start).toBeGreaterThan(-1);
	const text = skillEffect.slice(skillEffect.indexOf('{', start), skillEffect.indexOf('};', start) + 1);
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

describe('Thundering Orb', () => {
	it('throws the orb and plays its colour of the burst, from the ground packet only', () => {
		for (const [name, [c, skid]] of Object.entries(SKILLS)) {
			const skill = row(name);
			expect(skill.effectId).toEqual(['ef_druid_thundering_orb_throw', `ef_druid_thundering_orb_${c}`]);
			expect(skill.groundRepeatWindowMs).toBe(REPEAT_WINDOW_MS);
			expect(skill.hitEffectId).toBe(`ef_druid_thunder_hit_${c}`);

			const { EffectManager, spammed } = loadEffectManager({ [skid]: skill });
			const cell = [100, 120, 0];
			EffectManager.spamSkill(skid, 10, cell, null, 10); // ground packet
			EffectManager.spamSkill(skid, 20, null, 1500, 10); // damage packet
			expect(spammed.map(p => [p.effectId, p.ownerAID, p.position])).toEqual([
				['ef_druid_thundering_orb_throw', 10, cell],
				[`ef_druid_thundering_orb_${c}`, 10, cell]
			]);
		}
	});

	it('starts the burst 19 ticks late, top and floor rows at PosY 10, on the cell', () => {
		for (const c of ['g', 'y']) {
			const [top, floor] = entry(`ef_druid_thundering_orb_${c}`);
			for (const [layer, name] of [
				[top, `thundering_orb_${c}`],
				[floor, `thundering_orb_${c}_bottom`]
			]) {
				const path = `druid/kr_thundering_orb/${name}/`;
				expect(layer).toMatchObject({
					type: 'STR',
					file: path + name,
					texturePath: path,
					min: `${path}min_${name}`,
					xOffset: 0,
					yOffset: 10
				});
				expect(layer.delayStart).toBeCloseTo(19 * TICK);
				expect(layer.attachedEntity).toBeUndefined();
			}
			expect(top.wav).toBe(`effect/druid/kr_thundering_orb_${c}`);
			expect(top.delayWav).toBeCloseTo(19 * TICK);
			expect(top.renderBeforeEntities).toBeUndefined();
			expect(floor.wav).toBeUndefined();
			expect(floor.renderBeforeEntities).toBe(true);
		}
		expect(entry('ef_druid_thundering_orb_throw')).toEqual([
			{
				type: 'STR',
				file: 'druid/kr_thundering_orb/thundering_orb_orb/thundering_orb_small',
				texturePath: 'druid/kr_thundering_orb/thundering_orb_orb/',
				min: 'druid/kr_thundering_orb/thundering_orb_orb/min_thundering_orb_small',
				xOffset: 0,
				yOffset: 0,
				arcThrow: true
			}
		]);
	});

	it('drops 0.07 of the path each tick and lands after 14 drawn ticks', () => {
		expect(STEP).toBe(0.07);
		expect(pathLeft(0)).toBeCloseTo(0.93);
		expect(pathLeft(13 * TICK)).toBeCloseTo(0.02);
		expect(pathLeft(14 * TICK)).toBeLessThan(0);
	});

	it('flies a quadratic Bezier from start to end', () => {
		const start = [0, -2, 0];
		const control = [4, 0, 6];
		const end = [10, 0, 0];
		close(pathPoint(start, control, end, 1), start);
		close(pathPoint(start, control, end, 0), end);
		close(pathPoint(start, control, end, 0.5), [4.5, -0.5, 3]);
	});

	it('puts the control point beyond the end, the throw turned about the vertical', () => {
		const start = [0, -2, 0];
		const end = [10, 0, 0];
		// 10 cells along x, turned 120 degrees in the ground plane
		close(controlPoint(start, end, TURN_FAR), [10 - 5, 2, -10 * Math.sin(TURN_FAR)]);
		close(controlPoint(start, end, TURN_NEAR), [10 - 5, 2, -10 * Math.sin(TURN_NEAR)]);
	});

	it('starts 2 cells up the screen from the caster and bows by depth', () => {
		// Camera looking down -z with screen up along world -y (roBrowser's up)
		const view = new Float32Array([1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, -50, 1]);
		close(raiseOnScreen([3, 0, 4], 2, view), [3, -2, 4]);
		const caster = [0, 0, 10]; // nearer the camera
		const cell = [0, 0, 0];
		const start = [0, -2, 10];
		close(throwPoint(caster, cell, 1, view), start);
		close(throwPoint(caster, cell, 0, view), cell);
		close(throwPoint(caster, cell, 0.5, view), pathPoint(start, controlPoint(start, cell, TURN_NEAR), cell, 0.5));
		const raised = [0, -2, 0];
		close(throwPoint(cell, caster, 0.5, view), pathPoint(raised, controlPoint(raised, caster, TURN_FAR), caster, 0.5));
	});

	it('maps positions to the STR shader world and back', () => {
		close(toWorld([3, 4, 5]), [3.5, -5, 4.5]);
		close(fromWorld(toWorld([3, 4, 5])), [3, 4, 5]);
	});
});
