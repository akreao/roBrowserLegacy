import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Soul energy orbs (effect 1225), as the official client draws them for a
// Soul Reaper or Soul Ascetic from ZC_SOULENERGY. Numbers in soul-collect.md
// of the effect-port notes.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

const {
	SOUL_COLLECT_EFFECT,
	SOUL_ENERGY_JOBS,
	TEXTURE,
	RADIUS,
	HEIGHT,
	TURN,
	OVERLAY,
	soulLook,
	soulShown,
	soulAlpha,
	ringPhase,
	soulOffset
} = await import('Renderer/Effects/SoulCollectSim.js');

describe('soul energy orbs', () => {
	it('is effect 1225 for Soul Reaper, baby Soul Reaper and Soul Ascetic', () => {
		expect(SOUL_COLLECT_EFFECT).toBe(1225);
		expect(SOUL_ENERGY_JOBS).toEqual([4240, 4242, 4303]);
		expect(TEXTURE).toBe('soul_collect/soul_collect.bmp');
	});

	it('shows only the newest five souls', () => {
		expect([0, 1, 2, 3, 4].map(i => soulShown(i, 5))).toEqual([true, true, true, true, true]);
		expect([6, 7, 8, 9, 10, 11].map(i => soulShown(i, 12))).toEqual([false, true, true, true, true, true]);
		expect(soulShown(12, 12)).toBe(false);
	});

	it('looks by tier: small then large green, then large then larger red', () => {
		expect(soulLook(0)).toEqual({ size: 2, rgb: [0, 255, 0], cap: 150 });
		expect(soulLook(4)).toEqual({ size: 2, rgb: [0, 255, 0], cap: 150 });
		expect(soulLook(5)).toEqual({ size: 3.5, rgb: [0, 255, 0], cap: 150 });
		expect(soulLook(10)).toEqual({ size: 3.5, rgb: [255, 0, 0], cap: 255 });
		expect(soulLook(15)).toEqual({ size: 5.5, rgb: [255, 0, 0], cap: 255 });
		expect(soulLook(19)).toEqual({ size: 5.5, rgb: [255, 0, 0], cap: 255 });
		expect(OVERLAY).toEqual({ scale: 0.5, rgb: [255, 255, 255], cap: 255 });
	});

	it('fades in 2 a tick up to the cap', () => {
		expect(soulAlpha(1, 150)).toBe(2);
		expect(soulAlpha(75, 150)).toBe(150);
		expect(soulAlpha(200, 150)).toBe(150);
		expect(soulAlpha(128, 255)).toBe(255);
	});

	it('circles 10 units out and 10 up, turning 0.5 degrees a tick', () => {
		expect([RADIUS, HEIGHT, TURN]).toEqual([10, -10, 0.5]);
		expect(ringPhase(1)).toBe(0);
		expect(ringPhase(721)).toBe(0);
		expect(ringPhase(181)).toBe(90);

		const a = soulOffset(0, 3, 0);
		expect(a.x).toBeCloseTo(10);
		expect(a.z).toBeCloseTo(0);
		expect(a.y).toBe(-10);
		// three souls: 120 degrees apart
		const b = soulOffset(1, 3, 0);
		expect(Math.atan2(b.z, b.x) * (180 / Math.PI)).toBeCloseTo(120);
		// more than five: slot is index mod 5, 72 degrees apart
		const c = soulOffset(7, 12, 0);
		expect(Math.atan2(c.z, c.x) * (180 / Math.PI)).toBeCloseTo(144);
	});

	it('has effect 1225 draw the orbs on their owner with the count', () => {
		const table = effectTableSource().replace(/\r\n/g, '\n');
		expect(table).toMatch(/import SoulCollect from 'Renderer\/Effects\/SoulCollect\.js';/);
		const start = table.indexOf('\n\t1225: [');
		expect(start).toBeGreaterThan(-1);
		const entry = table.slice(start, table.indexOf('\n\t],', start));
		expect(entry).toMatch(/type: 'FUNC',/);
		expect(entry).toMatch(/attachedEntity: true,/);
		expect(entry).toContain('new SoulCollect(Params.Init.ownerEntity, Params.Init.spiritNum, Params.Inst.startTick)');
	});

	it('parses and hooks ZC_SOULENERGY (0x0b73)', () => {
		expect(read('Network/PacketRegister.js')).toContain('0xb73: PACKET.ZC.SOULENERGY,');
		const structure = read('Network/PacketStructure.js');
		expect(structure).toContain('this.AID = fp.readULong();\n\tthis.num = fp.readShort();\n};\nPACKET.ZC.SOULENERGY.size = 8;');
		expect(read('Engine/MapEngine/Skill.js')).toContain('Network.hookPacket(PACKET.ZC.SOULENERGY, onSoulEnergy);');
	});

	it('keeps one effect per actor, updates its count, and shows none when hidden', () => {
		const code = read('Engine/MapEngine/Skill.js');
		const start = code.indexOf('function onSoulEnergy(');
		const fn = code.slice(start, code.indexOf('\n}\n', start) + 2);
		const entities = {
			7: { job: 4303, _effectState: 0 },
			8: { job: 4240, _effectState: 2 },
			9: { job: 4252, _effectState: 0 }
		};
		const running = new Set();
		const removed = [];
		const played = [];
		const context = vm.createContext({
			EntityManager: { get: aid => entities[aid] || null },
			EffectManager: {
				has: (aid, id) => running.has(`${aid}:${id}`),
				remove: (effect, aid, ids) => removed.push([aid, ids]),
				spam: params => {
					played.push(params);
					running.add(`${params.ownerAID}:${params.effectId}`);
					entities[params.ownerAID].soulCollect = {
						count: params.spiritNum,
						setCount(n) {
							this.count = n;
						}
					};
				}
			},
			StatusState: { EffectState: { HIDE: 2, CLOAK: 4 } },
			SOUL_COLLECT_EFFECT,
			SOUL_ENERGY_JOBS
		});
		vm.runInContext(fn, context);

		context.onSoulEnergy({ AID: 7, num: 3 });
		expect(played).toEqual([{ effectId: 1225, ownerAID: 7, spiritNum: 3 }]);

		// Updated in place, not restarted
		context.onSoulEnergy({ AID: 7, num: 8 });
		expect(played.length).toBe(1);
		expect(entities[7].soulCollect.count).toBe(8);

		// Hidden: removed
		context.onSoulEnergy({ AID: 8, num: 4 });
		expect(removed).toEqual([[8, [1225]]]);
		expect(played.length).toBe(1);

		// Not a soul-energy job: ignored
		context.onSoulEnergy({ AID: 9, num: 4 });
		expect(played.length).toBe(1);
	});
});
