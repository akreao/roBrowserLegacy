import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

vi.mock('Renderer/EntityManager.js', () => ({ default: { get: () => null } }));

import { SCHEDULES } from 'Renderer/Effects/CasterMarks.js';
import { planOutwardSlash } from 'Renderer/Effects/PurpleSlashSim.js';
import { outwardSlashEffect } from 'DB/Effects/PurpleSlashEffect.js';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Meteor Assault (ASC_METEORASSAULT 406) as the official client (kRO
// 2025-07-16) plays it: cast aura 59; effect 409 on the caster from the use
// packet, only when its result is set: 메테오 어썰트.wav on tick 0, eight prim 92
// (four purpleslash.tga parts each) flying out at 0, 45, ... 315 degrees, the
// caster added and magenta on ticks 0-10. Spec: effect-port/assassin-cross-skills.md.

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

let seed = 3;
const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

describe('Meteor Assault (409)', () => {
	it('plays 409 on the caster when the skill succeeds, with aura 59', () => {
		expect(skillRow('ASC_METEORASSAULT')).toEqual({
			castAuraEffectId: 59,
			successEffectIdOnCaster: 409,
			hitEffectId: 0
		});
	});

	it('plays the sound, the slashes and the caster marks, and no camera-facing sprites', () => {
		const row = entry(409);
		expect(row).toContain("wav: 'effect/\\xb8\\xde\\xc5\\xd7\\xbf\\xc0\\x20\\xbe\\xee\\xbd\\xe4\\xc6\\xae'");
		expect(row).toContain('outwardSlashEffect');
		expect(row).toContain('new CasterMarks(Params.Init.ownerEntity, Params.Inst.startTick, 300, 409)');
		expect(row).not.toContain("type: '3D'");
	});

	it('lights the caster magenta on ticks 0-10, as Soul Destroyer does', () => {
		for (let age = 0; age < 20; age++) {
			expect(SCHEDULES[409](age)).toEqual(SCHEDULES[361](age));
		}
		expect(SCHEDULES[409](10).color).toEqual([255, 0, 255]);
	});

	it('keeps each set on its heading, starting 0-5 ticks later than an aimed one', () => {
		for (let k = 0; k < 8; k++) {
			const parts = planOutwardSlash(k * 45, random);
			const firsts = parts.map(part => part.frames.findIndex(Boolean));
			const delay = firsts[0] - 30;
			expect(delay).toBeGreaterThanOrEqual(0);
			expect(delay).toBeLessThanOrEqual(5);
			expect(firsts).toEqual([30, 29, 28, 27].map(f => f + delay));
			for (const part of parts) {
				for (const p of part.frames.filter(Boolean)) {
					expect(p.heading).toBe(k * 45);
				}
			}
		}
	});

	it('spawns 32 parts at the caster, eight headings 45 degrees apart', () => {
		const spawned = [];
		outwardSlashEffect.func.call(
			{ spamEffect: p => spawned.push(p) },
			{ Inst: { effectID: 409, startTick: 0, position: [0, 0, 0] }, Init: {} }
		);
		expect(spawned).toHaveLength(32);
		expect(spawned.map(p => p.Inst.duplicateID)).toEqual(Array.from({ length: 32 }, (_, i) => i));
		const yaws = new Set(
			spawned.map(p => {
				const shown = p.effect.track(45);
				return shown && shown.yaw + 90;
			})
		);
		expect([...yaws].sort((a, b) => a - b)).toEqual([0, 45, 90, 135, 180, 225, 270, 315]);
	});
});
