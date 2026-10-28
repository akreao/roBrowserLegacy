import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

let current;
vi.mock('Renderer/EntityManager.js', () => ({ default: { get: () => current } }));

import CasterMarks, { SCHEDULES, colorAt } from 'Renderer/Effects/CasterMarks.js';

// Wind Walk (SN_WINDWALK 383) as the official client (kRO 2025-07-16) plays it:
// cast aura 58 whatever the element; effect 389 on the caster from the use
// packet, only when its result is set: 윈드워크.wav on tick 0, and on ticks 5-25
// the caster drawn adding light and coloured (220, 250, 220), brought back by 8
// a channel a tick afterwards.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function entry(id) {
	const table = read('DB/Effects/EffectTable.js');
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

describe('Wind Walk on the caster (389)', () => {
	beforeEach(() => {
		current = { GID: 1, _flashColor: [1, 1, 1, 1], recalculateBlendingColor() {} };
	});

	it('lights and colours the caster on ticks 5-25 only', () => {
		const on = [];
		for (let age = 0; age < 60; age++) {
			const state = SCHEDULES[389](age);
			if (state.add) {
				on.push(age);
				expect(state.color).toEqual([220, 250, 220]);
			} else {
				expect(state.color).toBeNull();
			}
			expect(state.glow).toBe(false);
		}
		expect(on).toEqual(Array.from({ length: 21 }, (_, i) => i + 5));
	});

	it('brings the colour back by 8 a tick after tick 25', () => {
		expect(colorAt(SCHEDULES[389], 4)).toBeNull();
		expect(colorAt(SCHEDULES[389], 25)).toEqual([220, 250, 220]);
		expect(colorAt(SCHEDULES[389], 27)).toEqual([236, 255, 236]);
		expect(colorAt(SCHEDULES[389], 30)).toEqual([255, 255, 255]);
	});

	it('marks the owner', () => {
		const marks = new CasterMarks(current, 0, 200, 389);
		marks.render(null, (4 * 1000) / 60 + 1);
		expect(current._additiveBody || 0).toBe(0);
		marks.render(null, (5 * 1000) / 60 + 1);
		expect(current._additiveBody).toBe(1);
		expect(current._flashColor[1]).toBeCloseTo(250 / 255);
		marks.render(null, (26 * 1000) / 60 + 1);
		expect(current._additiveBody).toBe(0);
	});
});

describe('effect and skill rows', () => {
	it('389: the sound and the marks for 200 ticks', () => {
		const row = entry(389);
		expect(row).toContain("wav: 'effect/\\xc0\\xa9\\xb5\\xe5\\xbf\\xf6\\xc5\\xa9'");
		expect(row).toContain('200, 389');
	});

	it('casts with aura 58 and plays 389 only when the use succeeds', () => {
		expect(skillRow('SN_WINDWALK')).toEqual({ castAuraEffectId: 58, successEffectIdOnCaster: 389 });
	});
});
