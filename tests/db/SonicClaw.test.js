import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Chul Ho Sonic Claw, as the official client plays it: when the use-skill packet
// succeeds, the claw (EZ2 chul_ho_sonic_claw) and one wave on the caster. The wave
// is chul_ho_sonic_claw_wave_<clock hour>, picked by where the target is on screen.
//
// Read as text: the tables import the renderer, which does not load without a canvas.
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const skillEffect = read('DB/Skills/SkillEffect.js');
const effectTable = read('DB/Effects/EffectTable.js');

function row() {
	const start = skillEffect.indexOf('SkillEffect[SK.SH_CHUL_HO_SONIC_CLAW] =');
	expect(start).toBeGreaterThan(-1);
	const text = skillEffect.slice(skillEffect.indexOf('{', start), skillEffect.indexOf('\n};', start) + 2);
	return vm.runInNewContext(`(${text})`);
}

function entry(id) {
	const start = effectTable.indexOf(`\n\t${id}: [`);
	expect(start, `${id} is defined`).toBeGreaterThan(-1);
	return effectTable.slice(start, effectTable.indexOf('\n\t],', start));
}

const wave = n => `ef_sh_chul_ho_sonic_claw_wave_${n}`;

describe('Chul Ho Sonic Claw', () => {
	it('plays the claw and one wave on the caster, only when the use packet succeeds', () => {
		const skill = row();
		expect(Object.keys(skill).sort()).toEqual([
			'successEffectIdOnCaster',
			'successEffectIdOnCasterByScreenDirection'
		]);
		expect(skill.successEffectIdOnCaster).toBe('ef_sh_chul_ho_sonic_claw');
	});

	it('picks the wave by the official 12-sector table, clockwise from straight up', () => {
		expect([...row().successEffectIdOnCasterByScreenDirection]).toEqual(
			[12, 1, 1, 3, 5, 5, 6, 7, 7, 9, 11, 11].map(wave)
		);
	});

	it('draws the claw and every wave on the caster at PosY 10', () => {
		const claw = entry('ef_sh_chul_ho_sonic_claw');
		expect(claw).toContain("file: 'spirit_handler/sh_chul_ho_sonic_claw/chul_ho_sonic_claw/chul_ho_sonic_claw'");
		expect(claw).toContain("wav: 'effect/spirit_handler/sh_chul_ho_sonic_claw'");
		expect(claw).toContain('attachedEntity: true');
		expect(claw).toContain('yOffset: 10');
		for (const n of [12, 1, 3, 5, 6, 7, 9, 11]) {
			const e = entry(wave(n));
			expect(e).toContain(
				`file: 'spirit_handler/sh_chul_ho_sonic_claw/chul_ho_sonic_claw_wave/chul_ho_sonic_claw_wave_${n}'`
			);
			expect(e).toContain(
				`min: 'spirit_handler/sh_chul_ho_sonic_claw/chul_ho_sonic_claw_wave/min_chul_ho_sonic_claw_wave_${n}'`
			);
			expect(e).toContain('attachedEntity: true');
			expect(e).toContain('yOffset: 10');
			expect(e).not.toContain('wav:');
		}
	});

	it('keeps the kRO effect merge from adding any wave or a second claw', () => {
		const db = read('DB/DBManager.js');
		const start = db.indexOf('function loadBSONFile(');
		const end = db.indexOf('function loadAttendanceFile(');
		const records = {
			chul_ho_sonic_claw: {
				FilePath: 'SPIRIT_HANDLER\\SH_CHUL_HO_SONIC_CLAW\\chul_ho_sonic_claw\\chul_ho_sonic_claw.str',
				PosY: 10
			}
		};
		for (const n of [1, 11, 12, 3, 5, 6, 7, 9]) {
			records[`chul_ho_sonic_claw_wave_${n}`] = {
				FilePath: `SPIRIT_HANDLER\\SH_CHUL_HO_SONIC_CLAW\\chul_ho_sonic_claw_wave\\chul_ho_sonic_claw_wave_${n}.str`,
				PosY: 10
			};
		}
		const EffectTable = {};
		for (const id of ['ef_sh_chul_ho_sonic_claw', ...[12, 1, 3, 5, 6, 7, 9, 11].map(wave)]) {
			EffectTable[id] = [{ type: 'STR', file: entry(id).match(/file: '([^']+)'/)[1] }];
		}
		const SkillEffect = { 5435: row() };
		const context = vm.createContext({
			console: { log() {} },
			Ez2streffect: records,
			SKID: { SH_CHUL_HO_SONIC_CLAW: 5435 },
			StatusEffectTable: {}
		});
		vm.runInContext(db.slice(start, end), context);
		context.mergeEz2Effects(EffectTable, SkillEffect);
		expect(Object.keys(SkillEffect[5435]).sort()).toEqual([
			'successEffectIdOnCaster',
			'successEffectIdOnCasterByScreenDirection'
		]);
	});
});
