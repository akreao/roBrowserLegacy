import { describe, expect, it, vi } from 'vitest';
import {
	ORBS,
	CORE_COLORS,
	SPARK_GREYS,
	createOrbs,
	createOrb,
	stepOrb,
	coreSize,
	sparkCorners
} from 'Renderer/Effects/DupleLightSim.js';
import DupleLight from 'Renderer/Effects/DupleLight.js';
import EffectTable from 'DB/Effects/EffectTable.js';
import StatusEffectTable from 'DB/Status/StatusEffectTable.js';
import StatusConst from 'DB/Status/StatusConst.js';

// Duple Light's orbs, kRO 2025-07-16: EFST 350 relaunches 833 with count 2; 0xc07700, primitive 145
// (update 0xb80fb0, draw 0xb87250). effect-port/duple-light.md.

vi.mock('Core/Client.js', () => ({ default: { loadFile() {} } }));
vi.mock('Renderer/Camera.js', () => ({ default: { angle: [240, 0] } }));

const fixed = v => () => v;

describe('Duple Light orbs', () => {
	it('comes and goes with the status', () => {
		expect(StatusEffectTable[StatusConst.DUPLELIGHT]).toEqual({
			restart: ['ef_ab_duplelight_orbs'],
			stop: ['ef_ab_duplelight_orbs']
		});
		const added = [];
		EffectTable.ef_ab_duplelight_orbs[0].func.call(
			{ add: e => added.push(e) },
			{ Inst: { startTick: 0 }, Init: { ownerEntity: { position: [1, 2, 0] } } }
		);
		expect(added[0]).toBeInstanceOf(DupleLight);
		expect(added[0].orbs).toHaveLength(2);
	});

	it('builds two orbs half a turn apart, sparks 20 ticks apart', () => {
		const orbs = createOrbs(ORBS, fixed(0));
		expect(orbs.map(o => o.phase)).toEqual([0, 180]);
		expect(orbs[0].sparks.map(s => s.age)).toEqual([0, -20, -40, -60]);
		expect(orbs[0].sparks[0]).toMatchObject({ size: 3, alpha: 200 });
		expect(CORE_COLORS).toEqual([
			[68, 42, 255],
			[155, 155, 255]
		]);
		expect(SPARK_GREYS).toEqual([105, 35, 75, 5]);
	});

	it('fades in to 200, circles 7 out and 15 up, turning a degree every 2 ticks', () => {
		const rand = n => 0 * n;
		const orb = createOrb(0, rand);
		for (let i = 0; i < 250; i++) {
			stepOrb(orb, rand);
		}
		expect(orb.alpha).toBe(200);
		expect(orb.phase).toBe(125);
		expect(orb.center[1]).toBeCloseTo(-15, 0);
		expect(Math.hypot(orb.center[0], orb.center[2])).toBeCloseTo(7, 0);
	});

	it('grows each spark 2% a tick from 3 and fades it past 6', () => {
		const rand = () => 0;
		const orb = createOrb(0, rand);
		stepOrb(orb, rand);
		expect(orb.sparks[0].size).toBeCloseTo(3.06);
		for (let i = 0; i < 40; i++) {
			stepOrb(orb, rand);
		}
		expect(orb.sparks[0].size).toBeGreaterThan(6);
		expect(orb.sparks[0].alpha).toBeLessThan(200);
		expect(orb.sparks[1].age).toBe(21);
	});

	it('breathes the core by 5%', () => {
		const orb = createOrb(0, () => 0);
		orb.spin = 90;
		expect(coreSize(orb, 0)).toBeCloseTo(1.05);
		expect(coreSize(orb, 1)).toBeCloseTo(0.55);
	});

	it('stands each spark upright through the orb', () => {
		const orb = createOrb(0, () => 0);
		orb.center = [1, -15, 2];
		const corners = sparkCorners(orb, { heading: 0, shown: 4 });
		expect(corners).toEqual([
			[3, -13, 2],
			[-1, -13, 2],
			[-1, -17, 2],
			[3, -17, 2]
		]);
	});

	it('replays at most 120 missed ticks after a long gap', () => {
		const lights = new DupleLight({ position: [0, 0, 0] }, 0, 2);
		lights.init({ createBuffer: () => ({}) });
		lights.orbs.forEach(orb => {
			orb.age = 0;
		});
		lights.render({ bindBuffer() {} }, 100000 * (1000 / 60));
		expect(lights.orbs[0].age).toBe(120);
	});
});
