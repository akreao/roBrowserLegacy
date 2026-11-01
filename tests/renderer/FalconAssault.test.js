import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

let current;
vi.mock('Renderer/EntityManager.js', () => ({ default: { get: () => current } }));

import CasterMarks, { SCHEDULES, TURN_STEP, turnedDirection } from 'Renderer/Effects/CasterMarks.js';
import { turnedDirection as facingTurn } from 'Renderer/Effects/FacingTurn.js';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Falcon Assault (SN_FALCONASSAULT 381) as the official client (kRO 2020-12-29)
// plays it: effect 387 on the target as the damage packet arrives (no sound;
// tick 30 camera quake; ticks 30-54 the target spins 30 degrees a tick; added
// light on ticks 30-34, 40-44, 50), then once per packet the hit flash 0 and
// Blitz Beat's hit 115.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function entry(id) {
	const table = effectTableSource().replace(/\r\n/g, '\n');
	const start = table.indexOf(`\n\t${id}: [`);
	expect(start, `${id} is defined`).toBeGreaterThan(-1);
	return table.slice(start, table.indexOf('\n\t],', start)).replace(/\s+/g, ' ');
}

function skillRow(name) {
	const source = read('DB/Skills/SkillEffect.js');
	const start = source.indexOf(`SkillEffect[SK.${name}] =`);
	expect(start, name).toBeGreaterThan(-1);
	const text = source.slice(source.indexOf('{', start), source.indexOf('};', start) + 1);
	return JSON.parse(JSON.stringify(vm.runInNewContext(`(${text})`)));
}

describe('Falcon Assault on its target (387)', () => {
	beforeEach(() => {
		current = { GID: 1, direction: 2 };
	});

	it('does nothing before tick 30', () => {
		for (let age = 0; age < 30; age++) {
			expect(SCHEDULES[387](age)).toEqual({ add: false, glow: false, split: false, color: null, turn: null });
		}
	});

	it('spins 30 degrees a tick on ticks 30-54', () => {
		expect(TURN_STEP).toBe(30);
		expect(SCHEDULES[387](30).turn).toBe(30);
		expect(SCHEDULES[387](41).turn).toBe(0);
		expect(SCHEDULES[387](54).turn).toBe(30);
		expect(SCHEDULES[387](55).turn).toBeNull();
	});

	it('adds light on ticks 30-34, 40-44 and 50', () => {
		const lit = [];
		for (let age = 0; age < 60; age++) {
			if (SCHEDULES[387](age).add) {
				lit.push(age);
			}
		}
		expect(lit).toEqual([30, 31, 32, 33, 34, 40, 41, 42, 43, 44, 50]);
	});

	it('turns the way Tornado Kick turns, a step every whole 45 degrees', () => {
		for (let start = 0; start < 8; start++) {
			for (let age = 0; age < 48; age++) {
				expect(turnedDirection(start, ((age + 1) * TURN_STEP) % 360)).toBe(facingTurn(start, age));
			}
		}
	});

	it('turns the owner from where it faced and lights it', () => {
		const marks = new CasterMarks(current, 0, 55, 387);
		marks.render(null, (30 * 1000) / 60 + 1);
		expect(current._additiveBody).toBe(1);
		expect(current.direction).toBe(2);
		marks.render(null, (31 * 1000) / 60 + 1);
		expect(current.direction).toBe(1);
		marks.render(null, (35 * 1000) / 60 + 1);
		expect(current._additiveBody).toBe(0);
		expect(current.direction).toBe(turnedDirection(2, 180));
		// The last turn (750 degrees) draws the facing it started from.
		marks.render(null, (54 * 1000) / 60 + 1);
		expect(current.direction).toBe(2);
		marks.render(null, (55 * 1000) / 60 + 1);
		expect(marks.needCleanUp).toBe(true);
	});
});

describe('effect and skill rows', () => {
	it('387: quake on tick 30 and the marks for 55 ticks, no sound', () => {
		const row = entry(387);
		expect(row).toContain('Camera.setQuake(Params.Inst.startTick + 500)');
		expect(row).toContain('55, 387');
		expect(row).not.toContain('wav');
	});

	it('plays 387 on the target as the packet arrives, the hit once per packet', () => {
		expect(skillRow('SN_FALCONASSAULT')).toEqual({
			hideCastAura: true,
			damageEffectIdOnTarget: 387,
			hitEffectId: [0, 115],
			hitEffectOnce: true
		});
	});
});
