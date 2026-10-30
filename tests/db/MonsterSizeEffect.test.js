import { describe, it, expect, vi } from 'vitest';

vi.mock('Renderer/EntityManager.js', () => ({ default: { get: () => null } }));
vi.mock('Renderer/Effects/FieldBand.js', () => ({
	default: class FieldBand {
		constructor(...args) {
			this.args = args;
		}
	}
}));
vi.mock('Renderer/Effects/SwirlingAura.js', () => ({
	default: class SwirlingAura {
		constructor(...args) {
			this.args = args;
		}
	}
}));

import MonsterSizeEffect, { monsterSize, monsterEffects } from 'DB/Monsters/MonsterSizeEffect.js';
import ChampionMonsterEffects, { SUITON_COLOR, GREEN_AURA_MODE } from 'DB/Effects/ChampionMonsterEffects.js';
import { SCHEDULES, glowLayers, READY_COLOR, RED_COLOR } from 'Renderer/Effects/BodyMotionSim.js';

// Numbers from kRO's System/monster_size_effect_new.lub and client 2025-07-16.
describe('monster size and effect table', () => {
	it('draws every champion monster at 1.2 with its prefix effect', () => {
		// rAthena npc/re/mobs/championmobs.txt
		expect(MonsterSizeEffect[2887]).toEqual([1.2, [240]]); // Swift Banshee
		expect(MonsterSizeEffect[2832]).toEqual([1.2, [544]]); // Furious Ferus
		expect(MonsterSizeEffect[2736]).toEqual([1.2, [1003]]); // Necromancer Ringleader
		expect(monsterSize(2887)).toBe(1.2);
		expect(monsterEffects(2832)).toEqual([544]);
	});

	it('leaves monsters out of the table alone', () => {
		expect(monsterSize(1002)).toBe(1); // Poring
		expect(monsterEffects(1002)).toEqual([]);
		expect(monsterSize(7)).toBe(1); // a Knight
	});

	it('keeps the table sizes and drops the empty (-1) effects', () => {
		expect(monsterSize(2080)).toBe(0.6);
		for (const [, [size, effects]] of Object.entries(MonsterSizeEffect)) {
			expect(size).toBeGreaterThan(0);
			expect(effects.every(e => e > 0)).toBe(true);
		}
	});
});

describe('champion monster looks', () => {
	it('glows Ringleaders blue at alpha 160 for good', () => {
		for (const age of [0, 1, 500, 100000]) {
			expect(glowLayers([SCHEDULES[1003](age)])).toEqual([{ color: READY_COLOR, alpha: 160 }]);
		}
	});

	it('fades Furious monsters in red and settles at alpha 130', () => {
		expect(glowLayers([SCHEDULES[544](0)])).toEqual([]);
		expect(glowLayers([SCHEDULES[544](40)])).toEqual([{ color: RED_COLOR, alpha: 75 }]);
		expect(glowLayers([SCHEDULES[544](100)])).toEqual([{ color: RED_COLOR, alpha: 160 }]);
		expect(glowLayers([SCHEDULES[544](200)])).toEqual([{ color: RED_COLOR, alpha: 130 }]);
		expect(glowLayers([SCHEDULES[544](100000)])).toEqual([{ color: RED_COLOR, alpha: 130 }]);
	});

	function spawn(id, init = {}) {
		const added = [];
		const Params = {
			Init: { ownerEntity: { position: [1, 2, 3] }, ...init },
			Inst: { position: [4, 5, 6], startTick: 10 },
			effect: ChampionMonsterEffects[id][0]
		};
		ChampionMonsterEffects[id].forEach(part => part.func.call({ add: e => added.push(e) }, Params));
		return { added, Params };
	}

	it('draws the Elusive band in ring_blue.tga, tinted by colour mode 14', () => {
		const { added, Params } = spawn(620);
		expect(ChampionMonsterEffects[620][0].attachedEntity).toBe(true);
		expect(added[0].args).toEqual([Params.Inst.position, 10, 'ring_blue.tga', undefined, SUITON_COLOR]);
		expect(SUITON_COLOR).toEqual([120, 120, 255]);
	});

	it('draws the Solid aura as the green swirling bands in ring_white.tga, following the monster', () => {
		const { added, Params } = spawn(679);
		expect(added[0].args).toEqual([Params.Init.ownerEntity.position, 'ring_white.tga', 10, GREEN_AURA_MODE]);
		expect(GREEN_AURA_MODE).toBe(7);
	});

	it('keeps the body glows until they are removed', () => {
		for (const id of [544, 1003]) {
			expect(ChampionMonsterEffects[id][0].attachedEntity).toBe(true);
			const { added } = spawn(id);
			expect(added[0].frames).toBe(Infinity);
		}
	});
});
