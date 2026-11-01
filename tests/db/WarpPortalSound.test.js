import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Warp Portal: the official client's waiting portal (unit 0x81, effect 316) plays EF_ReadyPortal.wav
// every 14 ticks; the open portal (unit 0x80, effect 317) plays EF_Portal.wav once when it appears and
// nothing else.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

// The effect table imports most of the renderer, so read entries from its source.
function effectEntry(id) {
	const source = read('DB/Effects/EffectTable.js');
	const start = source.indexOf(`\n\t${id}: [`);
	const end = source.indexOf('\n\t],', start);
	const body = source.slice(start, end + 3).trim().replace(/^\d+:/, '').replace(/,$/, '');
	return vm.runInNewContext(`(${body})`);
}

describe('Warp Portal sounds', () => {
	it('open portal (317) plays ef_portal once and no ready sound', () => {
		const rows = effectEntry(317);
		expect(rows.filter(r => r.wav).map(r => [r.wav, !!r.repeat])).toEqual([['effect/ef_portal', false]]);
	});

	it('waiting portal (316) keeps its repeating ready sound', () => {
		expect(effectEntry(316).filter(r => r.wav).map(r => r.wav)).toEqual(['effect/ef_readyportal']);
	});

	it('units still map to 317 and 316', () => {
		const units = read('DB/Skills/SkillUnit.js');
		expect(units).toMatch(/SkillUnit\[SU\.UNT_WARPPORTAL\] = EC\.EF_PORTAL2;/);
		expect(units).toMatch(/SkillUnit\[SU\.UNT_PRE_WARPPORTAL\] = EC\.EF_READYPORTAL2;/);
	});
});
