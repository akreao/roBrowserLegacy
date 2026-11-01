import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Jupitel Thunder (WZ_JUPITEL, skill 84), as the official client shows the hit: once per
// damage packet, whatever the hit count, the standard hit flash (0) and effect 94 on the
// target. 94 lives 250 ticks: a thunder_pang flash every 20 ticks (each 10 ticks long) and,
// from tick 10 to the end, a plasma blast turning one frame a tick.
// Spec: effect-port/wizard-audit.md, effect-port/jupitel-thunder.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const TICK = 1000 / 60;

function effect94() {
	const table = effectTableSource().replace(/\r\n/g, '\n');
	const start = table.indexOf('\n\t94: [');
	const text = table.slice(table.indexOf('[', start), table.indexOf('\n\t],', start) + 3);
	return vm.runInNewContext(`(${text})`);
}

describe('Jupitel Thunder hit', () => {
	it('plays 0 and 94 once per damage packet', () => {
		expect(read('DB/Skills/SkillEffect.js')).toMatch(
			/SkillEffect\[SK\.WZ_JUPITEL\] = \{ releaseEffectId: 93, hitEffectId: \[0, 94\], hitEffectOnce: true \};/
		);
	});

	it('flashes every 20 ticks for the 250 ticks of the hit', () => {
		const [pang] = effect94();
		expect(pang.file).toBe('effect/thunder_pang.bmp');
		expect(pang.duplicate).toBe(13);
		expect(Math.abs(pang.timeBetweenDupli - 20 * TICK)).toBeLessThan(0.01);
		expect(Math.round(pang.duration / TICK)).toBe(10);
		expect(12 * pang.timeBetweenDupli).toBeLessThan(250 * TICK);
	});

	it('shows the plasma blast from tick 10 to tick 250, one frame a tick', () => {
		const blast = effect94()[1];
		expect(blast.fileList[0]).toBe('effect/thunder_plazma_blast_a.bmp');
		expect(Math.round(blast.delayStart / TICK)).toBe(10);
		expect(Math.round((blast.delayStart + blast.duration) / TICK)).toBe(250);
		expect(blast.frameDelay).toBeCloseTo(TICK, 5);
		expect(blast.size).toBe(75);
	});
});
