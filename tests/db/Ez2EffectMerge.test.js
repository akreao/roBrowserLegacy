import { describe, it } from 'vitest';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

const sourceRoot = process.env.EFFECT_SOURCE_ROOT || join(process.cwd(), 'src');

// mergeEz2Effects over `records`, with `SkillEffect` as the hand-written rows.
function merge(records, EffectTable, SkillEffect, StatusEffectTable = {}) {
	const db = readFileSync(join(sourceRoot, 'DB/DBManager.js'), 'utf8');
	const start = db.indexOf('function loadBSONFile(');
	const end = db.indexOf('function loadAttendanceFile(');
	assert.ok(start >= 0 && end > start, 'BSON merge source boundaries');
	const context = vm.createContext({
		console: { log() {} },
		Ez2streffect: records,
		SKID: { DR_CUTTING_WIND: 6542, SKE_RISING_MOON: 5468 },
		StatusEffectTable
	});
	vm.runInContext(db.slice(start, end), context);
	context.mergeEz2Effects(EffectTable, SkillEffect);
	return SkillEffect;
}

describe('kRO effect table merged into skills', () => {
	const records = {
		cutting_wind: { FilePath: 'DRUID\\DR_CUTTING_WIND\\cutting_wind\\cutting_wind.str' },
		cutting_wind_hit: { FilePath: 'DRUID\\DR_CUTTING_WIND\\cutting_wind_hit\\cutting_wind_hit.str' }
	};

	it('does not add a file the skill already plays', () => {
		const EffectTable = {
			ef_cutting_wind: [{ type: 'STR', file: 'druid/dr_cutting_wind/cutting_wind/cutting_wind' }],
			ef_cutting_wind_hit: [{ type: 'STR', file: 'druid/dr_cutting_wind/cutting_wind_hit/cutting_wind_hit' }]
		};
		const skills = merge(records, EffectTable, {
			6542: { effectIdOnCaster: 'ef_cutting_wind', hitEffectId: 'ef_cutting_wind_hit' }
		});
		assert.deepEqual({ ...skills[6542] }, { effectIdOnCaster: 'ef_cutting_wind', hitEffectId: 'ef_cutting_wind_hit' });
	});

	it('still maps the files of a skill with no row of its own', () => {
		const skills = merge(records, {}, {});
		assert.equal(skills[6542].effectId, 'cutting_wind');
		assert.equal(skills[6542].hitEffectId, 'cutting_wind_hit');
	});

	it('does not add a file a status already plays', () => {
		const moon = {
			ske_rising_moon_01: { FilePath: 'SKY_EMPEROR\\SKE_RISING_MOON\\ske_rising_moon_01.str', IsFloor: true }
		};
		const EffectTable = {
			ef_ske_rising_moon_01: [{ type: 'STR', file: 'sky_emperor/ske_rising_moon/ske_rising_moon_01' }]
		};
		const skills = merge(moon, EffectTable, {}, { 1388: { start: [], loop: ['ef_ske_rising_moon_01'] } });
		assert.equal(skills[5468], undefined);
		assert.equal(merge(moon, EffectTable, {})[5468].groundEffectId, 'ske_rising_moon_01');
	});

	it('draws floor effects under the characters and the rest over them', () => {
		const EffectTable = {};
		merge(
			{
				cutting_wind: { FilePath: 'DRUID\\DR_CUTTING_WIND\\cutting_wind\\cutting_wind.str', PosY: 10 },
				cutting_wind_bottom: {
					FilePath: 'DRUID\\DR_CUTTING_WIND\\cutting_wind_bottom\\cutting_wind_bottom.str',
					IsFloor: true,
					PosX: -5,
					PosY: 12
				}
			},
			EffectTable,
			{}
		);
		assert.equal(EffectTable.cutting_wind[0].renderBeforeEntities, false);
		assert.equal(EffectTable.cutting_wind_bottom[0].renderBeforeEntities, true);
		assert.equal(EffectTable.cutting_wind[0].yOffset, 10);
		assert.equal(EffectTable.cutting_wind_bottom[0].xOffset, -5);
		assert.equal(EffectTable.cutting_wind_bottom[0].yOffset, 12);
	});

	it('does not add a file the skill plays from an older folder', () => {
		const EffectTable = {
			ef_cutting_wind: [{ type: 'STR', file: 'cutting_wind/cutting_wind/cutting_wind' }]
		};
		const skills = merge(records, EffectTable, { 6542: { effectIdOnCaster: 'ef_cutting_wind' } });
		assert.equal(skills[6542].effectId, undefined);
		assert.equal(skills[6542].hitEffectId, 'cutting_wind_hit');
	});

	it('keeps a floor layer that shares its file name with the top layer', () => {
		const skills = merge(
			{
				cutting_wind_1: { FilePath: 'DRUID\\DR_CUTTING_WIND\\cutting_wind\\cutting_wind_7x7.str' },
				cutting_wind_bottom_1: {
					FilePath: 'DRUID\\DR_CUTTING_WIND\\cutting_wind_bottom\\cutting_wind_7x7.str',
					IsFloor: true
				}
			},
			{},
			{}
		);
		assert.equal(skills[6542].effectId, 'cutting_wind_1');
		assert.equal(skills[6542].groundEffectId, 'cutting_wind_bottom_1');
	});

	it('does not attach endless loops to a skill', () => {
		const EffectTable = {};
		const skills = merge(
			{
				cutting_wind_start: { FilePath: 'DRUID\\DR_CUTTING_WIND\\cutting_wind_start.str' },
				cutting_wind_loop: { FilePath: 'DRUID\\DR_CUTTING_WIND\\cutting_wind_loop.str', IsInfinite: true }
			},
			EffectTable,
			{}
		);
		assert.equal(skills[6542].effectId, 'cutting_wind_start');
		// Still in the effect table, for a status or a hand-written row to use
		assert.equal(EffectTable.cutting_wind_loop[0].repeat, true);
	});
});
