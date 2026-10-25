import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Spirit charm orbs (Kagerou/Oboro, Shinkiro/Shiranui), as the official client
// draws them from ZC_SPIRITS_ATTRIBUTE: one orb per charm, effect 735 to 738 by
// element, circling the actor in a ring that turns with the camera.
const {
	ORB_TICK_MS,
	UNITS_PER_CELL,
	CHARM_ORB_EFFECTS,
	ALL_CHARM_ORB_EFFECTS,
	ORB_LOOKS,
	FADE_TICKS,
	createOrbs,
	orbAlpha,
	orbAt
} = await import('Renderer/Effects/EnergyOrbSim.js');

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

describe('spirit charm orbs', () => {
	it('uses the client clock and units', () => {
		expect(ORB_TICK_MS).toBeCloseTo(1000 / 60);
		expect(UNITS_PER_CELL).toBe(5);
	});

	it('picks the effect, texture and size by charm element', () => {
		expect(CHARM_ORB_EFFECTS).toEqual({ 1: 737, 2: 738, 3: 735, 4: 736 });
		expect(ALL_CHARM_ORB_EFFECTS).toEqual([735, 736, 737, 738]);
		expect(ORB_LOOKS).toEqual({
			735: { texture: 'FireOrb.bmp', size: 2.3 },
			736: { texture: 'LightningOrb.bmp', size: 2.3 },
			737: { texture: 'WaterOrb.bmp', size: 1.3 },
			738: { texture: 'StoneOrb.bmp', size: 2.3 }
		});
	});

	it('spaces the orbs evenly, in whole degrees, with a random phase and bob', () => {
		const values = [0.5, 0.99, 0, 0.4, 0.999, 0.7, 0.25, 0.5, 0.1, 0.1];
		let i = 0;
		const orbs = createOrbs(5, () => values[i++]);
		expect(orbs.map(o => o.angle)).toEqual([0, 72, 144, 216, 288]);
		expect(orbs[0]).toEqual({ angle: 0, phase: 180, bob: 2 });
		expect(orbs[1]).toEqual({ angle: 72, phase: 0, bob: 1 });
		expect(orbs[2]).toEqual({ angle: 144, phase: 359, bob: 2 });
		expect(createOrbs(7, () => 0).map(o => o.angle)).toEqual([0, 51, 102, 153, 204, 255, 306]);
		expect(createOrbs(0)).toEqual([]);
		for (const orb of createOrbs(10)) {
			expect(Number.isInteger(orb.phase) && orb.phase >= 0 && orb.phase < 360).toBe(true);
			expect([0, 1, 2]).toContain(orb.bob);
		}
	});

	it('fades in over 201 ticks to 201/255', () => {
		expect(FADE_TICKS).toBe(201);
		expect(orbAlpha(1)).toBe(1);
		expect(orbAlpha(100)).toBe(100);
		expect(orbAlpha(201)).toBe(201);
		expect(orbAlpha(5000)).toBe(201);
	});

	it('turns 0.75 degrees a tick, 8 s a turn', () => {
		const orb = { angle: 0, phase: 0, bob: 0 };
		expect(orbAt(orb, 1, 2.3).angle).toBe(0);
		expect(orbAt(orb, 2, 2.3).angle).toBe(1);
		expect(orbAt(orb, 120, 2.3).angle).toBe(90);
		expect(orbAt(orb, 480, 2.3).angle).toBe(0);
		expect(orbAt({ ...orb, angle: 288 }, 120, 2.3).angle).toBe(18);
	});

	it('circles 8 units out and 12 up, bobbing with its phase', () => {
		// No bob: the phase stays put, so radius and size keep its sine
		let p = orbAt({ angle: 0, phase: 0, bob: 0 }, 120, 2.3);
		expect(p.x).toBeCloseTo(0, 5);
		expect(p.z).toBeCloseTo(8, 5);
		expect(p.y).toBeCloseTo(-12, 5);
		expect(p.front).toBeCloseTo(2.3, 5);
		expect(p.back).toBeCloseTo(2.53, 5);

		// Bob 2: phase 30 + 2 * 30 = 90 after 30 ticks
		p = orbAt({ angle: 0, phase: 30, bob: 2 }, 30, 1.3);
		expect(p.phase).toBe(90);
		expect(p.angle).toBe(22);
		const r = 8.6;
		expect(p.x).toBeCloseTo(r * Math.cos((22 * Math.PI) / 180), 5);
		expect(p.z).toBeCloseTo(r * Math.sin((22 * Math.PI) / 180), 5);
		expect(p.y).toBeCloseTo(-12 + 0.6 * 2, 5);
		expect(p.front).toBeCloseTo(1.43, 5);
		expect(p.back).toBeCloseTo(1.56, 5);

		expect(orbAt({ angle: 0, phase: 350, bob: 1 }, 20, 2.3).phase).toBe(10);
	});

	it('has effects 735 to 738 draw the orbs on their owner with the charm count', () => {
		const table = read('DB/Effects/EffectTable.js');
		expect(table).toMatch(/import EnergyOrb from 'Renderer\/Effects\/EnergyOrb\.js';/);
		for (const id of [735, 736, 737, 738]) {
			const start = table.indexOf(`\n\t${id}: [`);
			expect(start, `${id} is defined`).toBeGreaterThan(-1);
			const entry = table.slice(start, table.indexOf('\n\t],', start));
			expect(entry).toMatch(/type: 'FUNC',/);
			expect(entry).toMatch(/attachedEntity: true,/);
			expect(entry).toContain(
				`new EnergyOrb(Params.Init.ownerEntity, ${id}, Params.Init.spiritNum, Params.Inst.startTick)`
			);
		}
	});

	it('replaces the orbs on every charm packet, unless hidden or cloaked', () => {
		const code = read('Engine/MapEngine/Skill.js');
		const start = code.indexOf('function onSpiritCharm(');
		const fn = code.slice(start, code.indexOf('\n}\n', start) + 2);
		const entities = { 7: { _effectState: 0 }, 9: { _effectState: 2 }, 10: { _effectState: 4 } };
		const removed = [];
		const played = [];
		const context = vm.createContext({
			EntityManager: { get: aid => entities[aid] || null },
			EffectManager: {
				remove: (effect, aid, ids) => removed.push([aid, ids]),
				spam: params => played.push(params)
			},
			StatusState: { EffectState: { HIDE: 2, CLOAK: 4 } },
			CHARM_ORB_EFFECTS,
			ALL_CHARM_ORB_EFFECTS
		});
		vm.runInContext(fn, context);

		context.onSpiritCharm({ AID: 7, type: 3, num: 5 });
		expect(removed).toEqual([[7, [735, 736, 737, 738]]]);
		expect(played).toEqual([{ effectId: 735, ownerAID: 7, spiritNum: 5 }]);

		// Charms used up: orbs gone, element kept for Four Charm
		context.onSpiritCharm({ AID: 7, type: 0, num: 0 });
		expect(removed.length).toBe(2);
		expect(played.length).toBe(1);
		expect(entities[7].charmType).toBe(3);

		for (const [type, id] of [
			[1, 737],
			[2, 738],
			[4, 736]
		]) {
			context.onSpiritCharm({ AID: 7, type, num: 3 });
			expect(played.at(-1)).toEqual({ effectId: id, ownerAID: 7, spiritNum: 3 });
		}

		// Hidden or cloaked: no orbs and the element is not taken
		context.onSpiritCharm({ AID: 9, type: 1, num: 10 });
		context.onSpiritCharm({ AID: 10, type: 1, num: 10 });
		expect(played.length).toBe(4);
		expect(entities[9].charmType).toBeUndefined();
		expect(entities[10].charmType).toBeUndefined();
		expect(removed.slice(-2)).toEqual([
			[9, [735, 736, 737, 738]],
			[10, [735, 736, 737, 738]]
		]);
	});
});

describe('orb ring camera frame', () => {
	it('takes screen right and away-from-camera flat on the ground', async () => {
		const { cameraFrame } = await import('Renderer/Effects/EnergyOrbSim.js');
		const glMatrix = (await import('Utils/gl-matrix.js')).default;
		const { mat4, vec3 } = glMatrix;
		const view = mat4.create();
		const right = new Float32Array(3);
		const away = new Float32Array(3);
		for (const [pitch, yaw] of [
			[230, 0],
			[230, 45],
			[250, -120]
		]) {
			mat4.identity(view);
			mat4.rotateX(view, view, (pitch / 180) * Math.PI);
			mat4.rotateY(view, view, (yaw / 180) * Math.PI);
			cameraFrame(view, right, away);
			expect(right[1]).toBe(0);
			expect(away[1]).toBe(0);
			expect(Math.hypot(...right)).toBeCloseTo(1, 5);
			expect(Math.hypot(...away)).toBeCloseTo(1, 5);
			// right maps to view +x, away to view +y (screen up), whatever the yaw
			const r = vec3.transformMat4(vec3.create(), right, view);
			const a = vec3.transformMat4(vec3.create(), away, view);
			expect(r[0]).toBeCloseTo(1, 5);
			expect(r[1]).toBeCloseTo(0, 5);
			expect(a[0]).toBeCloseTo(0, 5);
			expect(a[1]).toBeGreaterThan(0);
		}
	});
});
