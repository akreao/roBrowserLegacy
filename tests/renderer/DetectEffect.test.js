import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

import { createPrimState, advancePrim } from 'Renderer/Effects/EffectPrimSim.js';
import { sendFalcon } from 'Engine/MapEngine/FalconFlight.js';

// Detect (HT_DETECTING, skill 130) as the official client (kRO 2020-12-29)
// plays it: from the ground packet, effect 119 at the cell (hunter_detecting.wav
// and a level square of fashasha.tga streaks one cell up, life 57 ticks, half
// side speed 1.5 / accel 1.5/14, then from tick 17 speed 0.1 / accel 0.1/30,
// fading from tick 40), and the falcon flies to the cell.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function effectRow(id) {
	const source = read('DB/Effects/EffectTable.js');
	const start = source.indexOf(`\n\t${id}: [`);
	expect(start, `${id} is defined`).toBeGreaterThan(-1);
	const end = source.indexOf('\n\t],', start);
	return vm.runInNewContext(`(${source.slice(start, end + 3).trim().replace(/^\w+:/, '').replace(/,$/, '')})`);
}

describe('Detect (119)', () => {
	const [row] = effectRow(119);

	it('is the white fashasha flash at the cell, with the sound', () => {
		expect(row).toMatchObject({
			type: 'PRIM',
			prim: 'quad',
			texture: 'fashasha',
			wav: 'effect/hunter_detecting',
			attachedEntity: false,
			frames: 57,
			height: 5,
			sizeChangeFrame: 17,
			alpha: 254,
			fadeOutFrame: 40
		});
		expect(row.color).toBeUndefined();
	});

	it('spreads fast to tick 17, then slowly', () => {
		const state = createPrimState(row);
		advancePrim(state, 17);
		const fast = state.size;
		let speed = 1.5;
		let s = 0;
		for (let a = 0; a < 17; a++) {
			speed += 1.5 / 14;
			s += speed;
		}
		expect(fast).toBeCloseTo(s, 5);
		advancePrim(state, 18);
		expect(state.size - fast).toBeCloseTo(0.1 + 0.1 / 30, 5);
	});
});

describe('the falcon', () => {
	it('flies to the spot in its master\'s pose', () => {
		const falcon = { position: [1, 2, 0], walk: {}, walkToNonWalkableGround: vi.fn() };
		const owner = { action: 3, falcon };
		expect(sendFalcon(owner, 10, 12)).toBe(true);
		expect(falcon.action).toBe(3);
		expect(falcon.walk.speed).toBe(35);
		expect(falcon.walkToNonWalkableGround).toHaveBeenCalledWith(1, 2, 10, 12, 0, true, true);
		expect(sendFalcon({ action: 1 }, 1, 1)).toBe(false);
	});

	it('goes for Detect from the ground packet', () => {
		const skill = read('Engine/MapEngine/Skill.js');
		expect(skill).toMatch(/pkt\.SKID === SkillId\.HT_DETECTING\) \{\n\t\tsendFalcon\(EntityManager\.get\(pkt\.AID\), pkt\.xPos, pkt\.yPos\);/);
	});
});
