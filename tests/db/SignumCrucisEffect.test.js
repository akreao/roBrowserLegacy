import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Signum Crucis (AL_CRUCIS, effect 40): the official client draws Cross.str from the start and on
// tick 30 (500 ms) plays EF_Signum.wav and EF_Bash.wav with a bash burst. Spec: effect-port/acolyte-skills.md.

const TICK = 1000 / 60;
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

// The effect table imports most of the renderer, so read entries from its source.
function effectEntry(id) {
	const source = effectTableSource().replace(/\r\n/g, '\n');
	const start = source.indexOf(`\n\t${id}: [`);
	const end = source.indexOf('\n\t],', start);
	const body = source.slice(start, end + 3).trim().replace(/^\d+:/, '').replace(/,$/, '');
	return vm.runInNewContext(`(${body})`);
}

describe('Signum Crucis (effect 40)', () => {
	const rows = effectEntry(40);

	it('draws the cross STR at once, without a sound', () => {
		const str = rows.filter(r => r.type === 'STR');
		expect(str).toEqual([expect.objectContaining({ file: 'cross' })]);
		expect(str[0].wav).toBeUndefined();
		expect(str[0].delayStart).toBeUndefined();
	});

	it('plays both sounds on tick 30', () => {
		const sounds = rows.filter(r => r.wav).map(r => [r.wav, r.delayWav]);
		expect(sounds).toEqual([
			['effect/ef_signum', Math.round(30 * TICK)],
			['effect/ef_bash', Math.round(30 * TICK)]
		]);
	});

	it('starts the bash burst (effect 16 look) on tick 30', () => {
		const burst = rows.filter(r => r.type === 'CYLINDER');
		const bash = effectEntry(16);
		expect(burst.map(r => r.textureName)).toEqual(bash.map(r => r.textureName));
		expect(burst.every(r => r.delayStart === Math.round(30 * TICK))).toBe(true);
	});
});

describe('Cylinder', () => {
	it('draws nothing before its start tick', () => {
		expect(read('Renderer/Effects/Cylinder.js')).toMatch(/render\(gl, tick\) \{\n(\t+\/\/.*\n)?\t+if \(tick < this\.startTick\) \{\n\t+return;/);
	});
});
