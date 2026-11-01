import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Napalm Vulcan (HW_NAPALMVULCAN, skill 400), as the official client plays it: effect 401 on the
// target as each damage packet arrives, which plays EF_NapalmBeat.wav on ticks 20, 30, 40, 50 and
// 60 (its EF_HIT2 calls on those ticks draw nothing), and the standard hit flash (0) on every hit of
// the packet, 200 ms apart (kRO 2025-07-16). Spec: effect-port/high-wizard-audit.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const TICK = 1000 / 60;

function effect401() {
	const table = effectTableSource().replace(/\r\n/g, '\n');
	const start = table.indexOf('\n\t401: [');
	const text = table.slice(table.indexOf('[', start), table.indexOf('\n\t],', start) + 3);
	return vm.runInNewContext(`(${text})`);
}

describe('Napalm Vulcan effects', () => {
	it('plays 401 on the target at packet arrival and the hit flash on every hit', () => {
		expect(read('DB/Skills/SkillEffect.js')).toMatch(
			/SkillEffect\[SK\.HW_NAPALMVULCAN\] = \{ damageEffectIdOnTarget: 401, hitEffectId: \[0\] \};/
		);
	});

	it('plays five Napalm Beat sounds, ten ticks apart from tick 20', () => {
		const rows = effect401();
		expect(rows.every(row => row.wav === 'effect/ef_napalmbeat' && !row.type)).toBe(true);
		expect(rows.map(row => Math.round(row.delayWav / TICK))).toEqual([20, 30, 40, 50, 60]);
	});
});
