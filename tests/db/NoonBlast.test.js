import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Noon Blast, as the official client plays it: one EZ2 effect, ske_noon_blast,
// on the target when the use-skill packet reports success. The damage packets
// that follow (one per enemy in the splash) show damage only, so the blast must
// not be tied to them. Like the client's other EZ2 effects it follows the actor it
// is played on, raised by the row's PosY 13.
//
// Read as text: the tables import the renderer, which does not load without a canvas.
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const skillEffect = read('DB/Skills/SkillEffect.js');
const effectTable = read('DB/Effects/EffectTable.js');

function entry(id) {
	const start = effectTable.indexOf(`\n\t${id}: [`);
	expect(start, `${id} is defined`).toBeGreaterThan(-1);
	return effectTable.slice(start, effectTable.indexOf('\n\t],', start));
}

describe('Noon Blast', () => {
	it('plays only from the successful use-skill packet, on the target', () => {
		const line = skillEffect.split('\n').find(l => l.startsWith('SkillEffect[SK.SKE_NOON_BLAST] ='));
		expect(line).toContain("successEffectId: 'ef_ske_noon_blast'");
		expect(line).not.toMatch(/\b(effectId|hitEffectId|effectIdOnCaster):/);
	});

	it('uses the EZ2 row: the STR, its light version, the sound, following the target, PosY 13', () => {
		const e = entry('ef_ske_noon_blast');
		expect(e).toContain("file: 'sky_emperor/ske_noon_blast/ske_noon_blast'");
		expect(e).toContain("min: 'sky_emperor/ske_noon_blast/min_ske_noon_blast'");
		expect(e).toContain("wav: 'effect/sky_emperor/ske_noon_blast'");
		expect(e).toContain('attachedEntity: true');
		expect(e).toContain('yOffset: 13');
		expect(e).not.toMatch(/xOffset|delayStart|delayOffset|repeat/);
	});

	it('is not mapped again as a plain effect when the client EZ2 table loads', () => {
		const db = read('DB/DBManager.js');
		const start = db.indexOf('function loadBSONFile(');
		const end = db.indexOf('function loadAttendanceFile(');
		expect(start).toBeGreaterThan(-1);
		expect(end).toBeGreaterThan(start);
		// The client's EZ2STREffect row for the skill.
		const Ez2streffect = {
			ske_noon_blast: {
				FilePath: 'SKY_EMPEROR\\SKE_NOON_BLAST\\ske_noon_blast.str',
				SoundPath: 'effect\\SKY_EMPEROR\\ske_noon_blast.wav',
				PosX: 0,
				PosY: 13,
				IsFloor: false,
				StartDelayTime: 0
			}
		};
		const context = vm.createContext({ console: { log() {} }, Ez2streffect, SKID: { SKE_NOON_BLAST: 5466 } });
		vm.runInContext(db.slice(start, end), context);
		const EffectTable = { ef_ske_noon_blast: [{ type: 'STR', file: 'sky_emperor/ske_noon_blast/ske_noon_blast' }] };
		const SkillEffect = { 5466: { successEffectId: 'ef_ske_noon_blast' } };
		context.mergeEz2Effects(EffectTable, SkillEffect);
		expect({ ...SkillEffect[5466] }).toEqual({ successEffectId: 'ef_ske_noon_blast' });
	});
});
