import { beforeEach, describe, expect, it, vi } from 'vitest';

const running = new Set();
vi.mock('Renderer/EffectManager.js', () => ({
	default: {
		spam: vi.fn(par => running.add(par.ownerAID + ':' + par.effectId)),
		has: vi.fn((AID, effectId) => running.has(AID + ':' + effectId)),
		remove: vi.fn((effect, AID, ids) => ids.forEach(id => running.delete(AID + ':' + id)))
	}
}));

const { default: EffectManager } = await import('Renderer/EffectManager.js');
const { showMonsterEffects, removeMonsterEffects } = await import('Engine/MapEngine/MonsterSizeEffects.js');

describe('monster effects on appearing', () => {
	beforeEach(() => {
		running.clear();
		vi.clearAllMocks();
	});

	it('puts a champion monster\'s effect on it, kept while it lasts', () => {
		showMonsterEffects({ GID: 5, job: 2887 }); // Swift Banshee
		expect(EffectManager.spam.mock.calls.map(c => c[0])).toEqual([
			{ effectId: 240, ownerAID: 5, persistent: true }
		]);
	});

	it('does not stack them when the monster is announced again', () => {
		showMonsterEffects({ GID: 5, job: 2736 });
		showMonsterEffects({ GID: 5, job: 2736 });
		expect(EffectManager.spam).toHaveBeenCalledTimes(1);
	});

	it('puts every effect of the row on, in order', () => {
		showMonsterEffects({ GID: 9, job: 1039 }); // Baphomet: the green 99 aura's three parts
		expect(EffectManager.spam.mock.calls.map(c => c[0].effectId)).toEqual([678, 679, 680]);
	});

	it('does nothing for players and monsters out of the table', () => {
		showMonsterEffects({ GID: 1, job: 7 });
		showMonsterEffects({ GID: 2, job: 1002 });
		removeMonsterEffects({ GID: 2, job: 1002 });
		expect(EffectManager.spam).not.toHaveBeenCalled();
		expect(EffectManager.remove).not.toHaveBeenCalled();
	});

	it('takes them off when the monster dies', () => {
		const furious = { GID: 5, job: 2832 };
		showMonsterEffects(furious);
		removeMonsterEffects(furious);
		expect(EffectManager.remove).toHaveBeenCalledWith(null, 5, [544]);
	});

	it('swaps them when the monster changes looks', () => {
		const monster = { GID: 5, job: 2887 }; // Swift
		showMonsterEffects(monster);
		monster.job = 2832; // now Furious
		showMonsterEffects(monster);
		expect(EffectManager.remove).toHaveBeenCalledWith(null, 5, [240]);
		expect(EffectManager.spam.mock.calls.map(c => c[0].effectId)).toEqual([240, 544]);
		monster.job = 1002; // a plain Poring
		showMonsterEffects(monster);
		expect(EffectManager.remove).toHaveBeenLastCalledWith(null, 5, [544]);
		expect(EffectManager.spam).toHaveBeenCalledTimes(2);
	});
});
