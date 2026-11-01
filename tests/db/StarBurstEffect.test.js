import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Star Burst (SKE_STAR_BURST) leaves the Star Burst status on its target. The
// official client draws that status as a burst of stars every 15 ticks (250 ms)
// while it lasts, cycling ske_twinkling_galaxy00..03, each with the Twinkling
// Galaxy ground ring and the Star Cannon sound, 13.5 units above the feet.
//
// Read as text: the effect tables import the renderer, which does not load
// without a canvas, and what is being checked is what the tables say.
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const effectTable = effectTableSource().replace(/\r\n/g, '\n');
const entity = read('Engine/MapEngine/Entity.js');
const skillEffect = read('DB/Skills/SkillEffect.js');

function layers(id) {
	const start = effectTable.indexOf(`\n\t${id}: [`);
	expect(start, `${id} is defined`).toBeGreaterThan(-1);
	const end = effectTable.indexOf('\n\t],', start);
	return effectTable
		.slice(start, end)
		.split('\n\t\t{')
		.slice(1)
		.map(text => {
			const str = key => (text.match(new RegExp(`${key}: '([^']+)'`)) || [])[1];
			const num = key => {
				const m = text.match(new RegExp(`${key}: (-?[\\d.]+)`));
				return m ? Number(m[1]) : undefined;
			};
			return { text, str, num };
		});
}

const TICK = 1000 / 60;
const BURST = 15 * TICK; // 250 ms

describe('Star Burst status mark', () => {
	const [g0, g1, g2, g3, bottom] = layers('ef_efst_star_burst');
	const galaxies = [g0, g1, g2, g3];

	it('cycles the four galaxy files, one per burst', () => {
		galaxies.forEach((layer, i) => {
			expect(layer.str('file')).toBe(`sky_emperor/ske_twinkling_galaxy/twinkling_galaxy/ske_twinkling_galaxy0${i}`);
			expect(layer.str('min')).toBe(`sky_emperor/ske_twinkling_galaxy/twinkling_galaxy/min_ske_twinkling_galaxy0${i}`);
			expect(layer.num('delayStart') || 0).toBeCloseTo(i * BURST, 0);
			// Each file comes back every fourth burst: plays 70 keys at 60 fps, restarts 1000 ms after it started
			expect(layer.num('duration')).toBeCloseTo((70 / 60) * 1000, 0);
			expect(layer.num('duration') + layer.num('repeatDelay')).toBeCloseTo(4 * BURST, 0);
		});
	});

	it('draws the ground ring and the Star Cannon sound on every burst', () => {
		expect(bottom.str('file')).toBe('sky_emperor/ske_twinkling_galaxy/twinkling_galaxy_bottom/ske_twinkling_galaxy_bottom');
		expect(bottom.text).toMatch(/renderBeforeEntities: true/);
		expect(bottom.str('wav')).toBe('effect/sky_emperor/ske_star_cannon');
		expect(galaxies.some(layer => layer.str('wav'))).toBe(false);
		expect(bottom.num('duration')).toBeCloseTo((79 / 60) * 1000, 0);
		expect(bottom.num('duration') + bottom.num('repeatDelay')).toBeCloseTo(BURST, 0);
	});

	it('follows the target, 13.5 units up', () => {
		for (const layer of [...galaxies, bottom]) {
			expect(layer.text).toMatch(/attachedEntity: true/);
			expect(layer.num('yOffset')).toBe(13.5);
		}
	});

	it('casts with the blue comfort aura, effect 441', () => {
		expect(skillEffect).toMatch(
			/SkillEffect\[SK\.SKE_STAR_BURST\] = \{ effectId: 'ef_ske_star_burst', castAuraEffectId: 441 \}/
		);
	});

	it('starts with the status and stops repeating when it ends', () => {
		const start = entity.indexOf('case StatusConst.STAR_BURST:');
		expect(start).toBeGreaterThan(-1);
		const body = entity.slice(start, entity.indexOf('break;', start));
		expect(body).toMatch(/effectId: 'ef_efst_star_burst', ownerAID: pkt\.AID, persistent: true/);
		expect(body).toMatch(/EffectManager\.endRepeat\(null, pkt\.AID, 'ef_efst_star_burst'\)/);
	});
});
