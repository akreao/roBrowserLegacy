import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import groundScatter from '../../src/Renderer/Effects/GroundScatter.js';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Sunset Blast, as the official client plays it: on the target of the successful
// use-skill packet, one big blast (EZ2 sunset_blast) that follows the target, and
// six small blasts (EZ2 sunset_blast_small) 32 ms apart, each left on the ground
// at the target's position plus 15 - (0..29) official units per axis.
//
// Read as text: the tables import the renderer, which does not load without a canvas.
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const skillEffect = read('DB/Skills/SkillEffect.js');
const effectTable = effectTableSource().replace(/\r\n/g, '\n');

function entry(id) {
	const start = effectTable.indexOf(`\n\t${id}: [`);
	expect(start, `${id} is defined`).toBeGreaterThan(-1);
	return effectTable.slice(start, effectTable.indexOf('\n\t],', start));
}

describe('Sunset Blast', () => {
	it('plays both parts only from the successful use-skill packet, on the target', () => {
		const line = skillEffect.split('\n').find(l => l.startsWith('SkillEffect[SK.SKE_SUNSET_BLAST] ='));
		expect(line).toContain("successEffectId: ['ef_ske_sunset_blast', 'ef_ske_sunset_blast_small']");
		expect(line).not.toMatch(/\b(effectId|hitEffectId|effectIdOnCaster):/);
	});

	it('draws the big blast once, following the target, PosY 10', () => {
		const e = entry('ef_ske_sunset_blast');
		expect(e).toContain("file: 'sky_emperor/ske_sunset_blast/sunset_blast'");
		expect(e).toContain("min: 'sky_emperor/ske_sunset_blast/min_sunset_blast'");
		expect(e).toContain("wav: 'effect/sky_emperor/ske_sunset_blast'");
		expect(e).toContain('attachedEntity: true');
		expect(e).toContain('yOffset: 10');
		expect(e).not.toMatch(/duplicate|groundScatter|delayStart|delayOffset|repeat/);
	});

	it('draws six small blasts 32 ms apart, left on the ground and scattered 15 units', () => {
		const e = entry('ef_ske_sunset_blast_small');
		expect(e).toContain("file: 'sky_emperor/ske_sunset_blast/sunset_blast_small'");
		expect(e).toContain("min: 'sky_emperor/ske_sunset_blast/min_sunset_blast_small'");
		expect(e).toContain("wav: 'effect/sky_emperor/ske_sunset_blast_small'");
		expect(e).toContain('yOffset: 10');
		expect(e).toContain('duplicate: 6');
		expect(e).toContain('timeBetweenDupli: 32');
		expect(e).toContain('groundScatter: 15');
		expect(e).not.toContain('attachedEntity');
	});

	it('scatters each axis by -14..+15 official units, in cells', () => {
		expect(groundScatter(15, () => 0)).toEqual([3, 3]);
		expect(groundScatter(15, () => 0.999999)).toEqual([-2.8, -2.8]);
		const seen = new Set();
		for (let i = 0; i < 30; i++) {
			seen.add(groundScatter(15, () => i / 30)[0]);
		}
		expect(seen.size).toBe(30);
	});

	it('is not mapped again as a plain effect when the client EZ2 table loads', () => {
		const db = read('DB/DBManager.js');
		const start = db.indexOf('function loadBSONFile(');
		const end = db.indexOf('function loadAttendanceFile(');
		expect(start).toBeGreaterThan(-1);
		expect(end).toBeGreaterThan(start);
		// The client's EZ2STREffect rows that point at Sunset Blast's files.
		const row = (file, wav) => ({
			FilePath: `SKY_EMPEROR\\SKE_SUNSET_BLAST\\${file}.str`,
			SoundPath: `effect\\SKY_EMPEROR\\${wav}.wav`,
			PosX: 0,
			PosY: 10,
			IsFloor: false,
			StartDelayTime: 0
		});
		const Ez2streffect = {
			sunset_blast: row('sunset_blast', 'ske_sunset_blast'),
			sunset_blast_small: row('sunset_blast_small', 'ske_sunset_blast_small'),
			sky_sun_small: row('sunset_blast_small', 'SKE_SKY_SUN_1')
		};
		const context = vm.createContext({
			console: { log() {} },
			Ez2streffect,
			SKID: { SKE_SUNSET_BLAST: 5467, SKE_SKY_SUN: 5502 }
		});
		vm.runInContext(db.slice(start, end), context);
		const EffectTable = {
			ef_ske_sunset_blast: [{ type: 'STR', file: 'sky_emperor/ske_sunset_blast/sunset_blast' }],
			ef_ske_sunset_blast_small: [{ type: 'STR', file: 'sky_emperor/ske_sunset_blast/sunset_blast_small' }]
		};
		const SkillEffect = { 5467: { successEffectId: ['ef_ske_sunset_blast', 'ef_ske_sunset_blast_small'] } };
		context.mergeEz2Effects(EffectTable, SkillEffect);
		expect({ ...SkillEffect[5467] }).toEqual({
			successEffectId: ['ef_ske_sunset_blast', 'ef_ske_sunset_blast_small']
		});
	});
});
