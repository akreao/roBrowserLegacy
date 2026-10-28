// @vitest-environment node
import { afterEach, describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import GarmentLayer from 'DB/Items/GarmentLayer.js';

// Garments go over or under the body by the client's own tables, spreditinfo/_new_biglayerdir_*.lub
// (kRO 2025-07-16 data), read the way its _New_DrawOnTop reads them: a frame listed for the job,
// action * 8 + direction draws the garment under the body, anything else over it.

const READYFIGHT = 4;
const actNum = (action, dir) => action * 8 + dir;

// Real entries: female Swordman (1) and Rune Knight (4054) in the combat stance (action 4), and the
// inheritance that sends Rune Knight (Trans) 4060 and baby Rune Knight 4096 to 4054.
const DUMP = [
	...[0, 1, 2, 3, 4, 5, 6, 7].map(d => `F 0 1 ${actNum(READYFIGHT, d)} 0.1.2.3.4.5`),
	...[0, 1, 6, 7].map(d => `F 0 4054 ${actNum(READYFIGHT, d)} 0.1.2.3.4.5`),
	'F 0 4054 0 0.1.2',
	'F 0 4054 3',
	'I 4060 4054',
	'I 4096 4054',
	'F 1 1 0 0.1.2'
].join('\n');

afterEach(() => GarmentLayer.clear());

describe('GarmentLayer', () => {
	it('answers nothing until a table is loaded, so the renderer keeps its own ordering', () => {
		expect(GarmentLayer.isLoaded()).toBe(false);
		expect(GarmentLayer.drawOnTop(0, 1, actNum(READYFIGHT, 4), 0)).toBe(null);
	});

	it('puts the garment under a Swordman in the combat stance on every facing, back ones too', () => {
		GarmentLayer.parse(DUMP);
		for (let d = 0; d < 8; d++) {
			for (let frame = 0; frame < 6; frame++) {
				expect(GarmentLayer.drawOnTop(0, 1, actNum(READYFIGHT, d), frame)).toBe(false);
			}
		}
	});

	it('follows the table per direction: a Rune Knight in the stance has it over the body facing away', () => {
		GarmentLayer.parse(DUMP);
		expect(GarmentLayer.drawOnTop(0, 4054, actNum(READYFIGHT, 0), 0)).toBe(false);
		expect(GarmentLayer.drawOnTop(0, 4054, actNum(READYFIGHT, 7), 3)).toBe(false);
		for (const d of [2, 3, 4, 5]) {
			expect(GarmentLayer.drawOnTop(0, 4054, actNum(READYFIGHT, d), 0)).toBe(true);
		}
	});

	it('only the listed frames go under; an empty list, a missing action or job means over', () => {
		GarmentLayer.parse(DUMP);
		expect(GarmentLayer.drawOnTop(0, 4054, 0, 2)).toBe(false);
		expect(GarmentLayer.drawOnTop(0, 4054, 0, 3)).toBe(true);
		expect(GarmentLayer.drawOnTop(0, 4054, 3, 0)).toBe(true);
		expect(GarmentLayer.drawOnTop(0, 4054, 99, 0)).toBe(true);
		expect(GarmentLayer.drawOnTop(0, 9999, 0, 0)).toBe(true);
	});

	it('uses the job a job inherits from, and the table of its sex (0 female, else male)', () => {
		GarmentLayer.parse(DUMP);
		expect(GarmentLayer.drawOnTop(0, 4060, actNum(READYFIGHT, 0), 0)).toBe(false);
		expect(GarmentLayer.drawOnTop(0, 4096, actNum(READYFIGHT, 4), 0)).toBe(true);
		expect(GarmentLayer.drawOnTop(1, 1, actNum(READYFIGHT, 4), 0)).toBe(true);
	});

	it('leaves a sex whose file was missing to the renderer, even with the other sex and the inheritance read', () => {
		GarmentLayer.parse('F 0 1 0 0.1.2\nI 4060 4054');
		expect(GarmentLayer.isLoaded()).toBe(true);
		expect(GarmentLayer.isLoaded(0)).toBe(true);
		expect(GarmentLayer.isLoaded(1)).toBe(false);
		expect(GarmentLayer.drawOnTop(1, 1, 0, 0)).toBe(null);
		expect(GarmentLayer.drawOnTop(0, 1, 0, 0)).toBe(false);

		GarmentLayer.clear();
		GarmentLayer.parse('I 4060 4054');
		expect(GarmentLayer.isLoaded()).toBe(false);
	});
});

const hasLua = spawnSync('lua5.1', ['-v']).status === 0;

describe.skipIf(!hasLua)('GarmentLayer dump', () => {
	it('hands over the tables, leaving out jobs the names did not resolve (-1)', () => {
		const lua = `
_New_BigLayerDir_F = { [1] = { [36] = { 0, 1, 2 }, [37] = {} } }
_New_BigLayerDir_M = { [4054] = { [32] = { 4 } } }
LAYER_ALL_TABLE_LIST = { [4060] = 4054, [-1] = 4054, [4096] = -1 }
io.write((function()
${GarmentLayer.DUMP_LUA}
end)())
assert(_New_BigLayerDir_F == nil and LAYER_ALL_TABLE_LIST == nil)`;
		const r = spawnSync('lua5.1', ['-'], { input: lua, encoding: 'utf8' });
		expect(r.stderr).toBe('');
		const lines = r.stdout.split('\n').sort();
		expect(lines).toEqual(['F 0 1 36 0.1.2', 'F 0 1 37 ', 'F 1 4054 32 4', 'I 4060 4054']);

		GarmentLayer.parse(r.stdout);
		expect(GarmentLayer.drawOnTop(0, 1, 36, 2)).toBe(false);
		expect(GarmentLayer.drawOnTop(1, 4060, 32, 4)).toBe(false);
		expect(GarmentLayer.drawOnTop(1, 4096, 32, 4)).toBe(true);
	});

	it('runs the chunk the loader runs: files through JOBID, names it lacks skipped, JOBID put back', () => {
		const dir = mkdtempSync(join(tmpdir(), 'garment-'));
		writeFileSync(
			join(dir, 'garmentlayer__new_2dlayerdir_f.lub'),
			'LAYER_ALL_TABLE_LIST = { [JOBID.JT_RUNE_KNIGHT_H] = JOBID.JT_RUNE_KNIGHT, [JOBID.JT_NOT_A_JOB] = JOBID.JT_NOVICE }'
		);
		writeFileSync(
			join(dir, 'garmentlayer__new_biglayerdir_female.lub'),
			'_New_BigLayerDir_F = { [1] = { [36] = { 0, 1 } } }'
		);
		const lua = `
JOBID = "before"
__GARMENT_JOBID = { JT_NOVICE = 0, JT_RUNE_KNIGHT = 4054, JT_RUNE_KNIGHT_H = 4060 }
io.write(assert(loadstring(${JSON.stringify(
			GarmentLayer.loadChunk(['garmentlayer__new_2dlayerdir_f.lub', 'garmentlayer__new_biglayerdir_female.lub'])
		)}))())
assert(JOBID == "before" and __GARMENT_JOBID == nil)`;
		const r = spawnSync('lua5.1', ['-'], { input: lua, encoding: 'utf8', cwd: dir });
		expect(r.stderr).toBe('');
		expect(r.stdout.split('\n').sort()).toEqual(['F 0 1 36 0.1', 'I 4060 4054']);
	});
});

describe('renderer', () => {
	const render = readFileSync(join(process.cwd(), 'src/Renderer/Entity/EntityRender.js'), 'utf8');
	const db = readFileSync(join(process.cwd(), 'src/DB/DBManager.js'), 'utf8');

	it('draws the garment under or over the body by the table, per frame', () => {
		expect(render).toMatch(/const robeOnTop = self\.robe > 0 && garmentOnTop\(self, direction\);/);
		expect(render).toMatch(/GarmentLayer\.drawOnTop\(entity\.sex, entity\.job, actNum, frame\)/);
		expect(render).toMatch(/if \(self\.robe > 0 && !robeOnTop\) \{/);
		expect(render).toMatch(/if \(self\.robe > 0 && robeOnTop\) \{/);
	});

	it('loads the three client files', () => {
		expect(db).toMatch(/loadGarmentLayers\(DB\.LUA_PATH \+ 'spreditinfo\/', onLoad\(\)\);/);
		expect(db).toMatch(/'_new_2dlayerdir_f\.lub', '_new_biglayerdir_female\.lub', '_new_biglayerdir_male\.lub'/);
	});
});
