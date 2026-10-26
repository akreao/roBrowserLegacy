import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
	arrowShowerEffects,
	NEIGHBOUR_CELLS,
	START_DELAY_MS,
	FLIGHT_MS
} from '../../src/DB/Effects/ArrowShowerEffects.js';
import ThreeDEffect from '../../src/Renderer/Effects/ThreeDEffect.js';

// Arrow Shower (AC_SHOWER, skill 47): arrows from the caster to the cells around a point,
// 432 ms wait, 192 ms flight, 2 cells up. Spec: effect-port/archer-skills.md.

const rows = arrowShowerEffects();
const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

function endOf(row) {
	const effect = new ThreeDEffect(
		row,
		{ position: [10, 20, 0], otherPosition: [4, 20, 0], startTick: 0, endTick: FLIGHT_MS },
		{ ownerAID: 1 }
	);
	return [effect.posxStart, effect.posyStart, effect.posxEnd, effect.posyEnd];
}

describe('Arrow Shower arrows', () => {
	it('uses the client timing', () => {
		expect(START_DELAY_MS).toBe(432);
		expect(FLIGHT_MS).toBe(192);
		for (const row of [...rows.ef_arrow_shower_ground, ...rows.ef_arrow_shower_target]) {
			expect(row.delayStart).toBe(432);
			expect(row.duration).toBe(192);
			expect(row.zOffset).toBe(2);
		}
	});

	it('aims the ground arrows at the 8 cells around the cell', () => {
		expect(rows.ef_arrow_shower_ground).toHaveLength(8);
		expect(rows.ef_arrow_shower_ground.map(endOf)).toEqual(NEIGHBOUR_CELLS.map(([x, y]) => [-6, 0, x, y]));
	});

	it('aims the damage arrows at the actor and the 8 cells around it', () => {
		expect(rows.ef_arrow_shower_target).toHaveLength(9);
		expect(endOf(rows.ef_arrow_shower_target[0])).toEqual([-6, 0, 0, 0]);
		expect(new Set(NEIGHBOUR_CELLS.map(c => c.join()))).toHaveProperty('size', 8);
	});

	it('plays them from the ground and damage packets, with 0 + 1 on each hit', () => {
		expect(source).toMatch(/groundEffectIdByLevel: \['ef_arrow_shower_ground'\],/);
		expect(source).toMatch(/damageEffectIdOnTarget: 'ef_arrow_shower_target',\r?\n\thitEffectId: \[0, 1\]\r?\n\}; \/\/Arrow Shower/);
		expect(source).toMatch(/SkillEffect\[SK\.MA_SHOWER\] = SkillEffect\[SK\.AC_SHOWER\];/);
	});
});
