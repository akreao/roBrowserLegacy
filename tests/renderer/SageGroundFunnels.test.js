import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { FUNNEL, SAGE_GROUND_FUNNEL, funnelAlpha, visibleTicks } from '../../src/Renderer/Effects/CastFunnelSim.js';

// Volcano, Deluge, Violent Gale and Land Protector: the official client's ground packet plays
// 225 / 236 / 237 / 238 at the target cell, the funnel primitive (four rings opening out) in
// variant 0, which fades 2 a tick instead of 5. Spec: effect-port/sage-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function rowText(id) {
	const table = read('DB/Effects/EffectTable.js');
	const start = table.indexOf(`\n\t${id}: [`);
	expect(start).toBeGreaterThan(0);
	return table.slice(start, table.indexOf('\n\t],', start));
}

describe('Sage ground skill funnels', () => {
	it('variant 0 rises to 200 on tick 10 and loses 2 a tick, gone on tick 110', () => {
		expect({ ...SAGE_GROUND_FUNNEL, alphaDown: FUNNEL.alphaDown }).toEqual(FUNNEL);
		expect(SAGE_GROUND_FUNNEL.alphaDown).toBe(2);
		expect([1, 10, 11, 60, 109, 110, 500].map(t => funnelAlpha(t, SAGE_GROUND_FUNNEL))).toEqual([
			20, 200, 198, 100, 2, 0, 0
		]);
		expect(visibleTicks(SAGE_GROUND_FUNNEL)).toBe(110);
	});

	it('variant 4 (Nightmare Erasion) is unchanged', () => {
		expect([10, 11, 50].map(t => funnelAlpha(t))).toEqual([200, 195, 0]);
	});

	const rows = {
		SA_VOLCANO: [225, 'ring_red.tga', 310],
		SA_DELUGE: [236, 'ring_blue.tga', 1009],
		SA_VIOLENTGALE: [237, 'magic_green.tga', 1009],
		SA_LANDPROTECTOR: [238, 'ring_white.tga', 1009]
	};
	for (const [skill, [id, texture, life]] of Object.entries(rows)) {
		it(`${skill} plays ${id} at the cell from the ground packet, in ${texture}`, () => {
			expect(read('DB/Skills/SkillEffect.js')).toMatch(
				new RegExp(`SkillEffect\\[SK\\.${skill}\\] = \\{ groundEffectIdByLevel: \\[${id}\\] \\};`)
			);
			const text = rowText(id);
			expect(text).toContain('attachedEntity: false');
			expect(text).toContain(`new CastFunnel(Params.Inst.position, Params.Inst.startTick, ${life}, '${texture}', SAGE_GROUND_FUNNEL)`);
		});
	}
});
