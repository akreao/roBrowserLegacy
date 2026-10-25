import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

vi.mock('Core/Client.js', () => ({ default: { loadFile: () => null } }));
vi.mock('Audio/SoundManager.js', () => ({ default: { playPosition: vi.fn() } }));
vi.mock('Core/Events.js', () => ({ default: { setTimeout: vi.fn() } }));

import SoundManager from 'Audio/SoundManager.js';
import Events from 'Core/Events.js';
import {
	STAGE_COUNT,
	STAGE_EFFECTS,
	SOUND_GAP_MS,
	motionSpeed,
	startDelay,
	stormSlashEffects
} from 'DB/Effects/StormSlashEffect.js';

// Storm Slash (DK_STORMSLASH) as the official client plays it (kRO 2026-02-11
// and its ez2streffect.bson): the stage that matches the skill level, on the caster.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

describe('Storm Slash stages', () => {
	const rows = stormSlashEffects();

	it('has one row per level, each drawing that stage on the caster', () => {
		expect(STAGE_COUNT).toBe(5);
		expect(Object.keys(rows)).toEqual(STAGE_EFFECTS);
		STAGE_EFFECTS.forEach((name, k) => {
			expect(rows[name][0]).toMatchObject({
				type: 'STR',
				file: `dragon_knight/dk_stormslash/stormslash/stormslash_${k + 1}`,
				texturePath: 'dragon_knight/dk_stormslash/stormslash/',
				yOffset: 8,
				attachedEntity: true
			});
		});
	});

	it('picks the stage by level in SkillEffect', () => {
		const text = read('DB/Skills/SkillEffect.js');
		const start = text.indexOf('SkillEffect[SK.DK_STORMSLASH] = {');
		const entry = text.slice(start, text.indexOf('};', start));
		STAGE_EFFECTS.forEach(name => expect(entry).toContain(`'${name}'`));
		expect(entry).toContain('successEffectIdOnCasterByLevel');
		expect(entry).not.toContain('hitEffectId');
	});

	it('starts the art motion speed x 50 + 30 ms later, in whole 60 Hz ticks', () => {
		// 4 units (100 ms frames): 230 ms, 14 ticks + 1
		expect(startDelay(4)).toBeCloseTo((15 * 1000) / 60, 6);
		expect(startDelay(2)).toBeCloseTo((9 * 1000) / 60, 6);
		expect(motionSpeed({ animation: { speed: 150 } })).toBe(6);
		expect(motionSpeed(null)).toBe(4);
		expect(rows.ef_dk_stormslash_1[0].delayStart({ Init: { ownerEntity: { animation: { speed: 100 } } } })).toBe(
			startDelay(4)
		);
	});

	it('plays one random slash sound per level, 15 ticks apart', () => {
		const position = [1, 2, 3];
		rows.ef_dk_stormslash_3[1].func({ Init: { ownerEntity: { position } } });
		expect(SOUND_GAP_MS).toBeCloseTo(250, 6);
		expect(Events.setTimeout).toHaveBeenCalledTimes(3);
		expect(Events.setTimeout.mock.calls.map(call => call[1])).toEqual([0, 1, 2].map(i => i * SOUND_GAP_MS));
		Events.setTimeout.mock.calls.forEach(call => call[0]());
		SoundManager.playPosition.mock.calls.forEach(([file, at]) => {
			expect(file).toMatch(/^effect\/dk_stormslash[1-4]\.wav$/);
			expect(at).toBe(position);
		});
	});
});

describe('EZ2 merge with the Storm Slash stages', () => {
	it('adds none of the bson stage files on top', () => {
		const db = read('DB/DBManager.js');
		const start = db.indexOf('function loadBSONFile(');
		const end = db.indexOf('function loadAttendanceFile(');
		const records = {};
		for (let n = 1; n <= 5; ++n) {
			records[`stormslash_${n}`] = {
				FilePath: `DRAGON_KNIGHT\\DK_STORMSLASH\\stormslash\\stormslash_${n}.str`,
				PosY: 8
			};
		}
		const context = vm.createContext({
			console: { log() {} },
			Ez2streffect: records,
			SKID: { DK_STORMSLASH: 5213 },
			StatusEffectTable: {}
		});
		vm.runInContext(db.slice(start, end), context);
		const SkillEffect = { 5213: { successEffectIdOnCasterByLevel: STAGE_EFFECTS.slice() } };
		context.mergeEz2Effects({ ...stormSlashEffects() }, SkillEffect);
		expect({ ...SkillEffect[5213] }).toEqual({ successEffectIdOnCasterByLevel: STAGE_EFFECTS });
	});
});
