import { beforeEach, describe, expect, it, vi } from 'vitest';

const running = new Set();
vi.mock('Renderer/EffectManager.js', () => ({
	default: {
		spam: vi.fn(par => running.add(par.ownerAID + ':' + par.effectId)),
		has: vi.fn((AID, effectId) => running.has(AID + ':' + effectId)),
		remove: vi.fn()
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
		showMonsterEffects({ GID: 5, _job: 2887 }); // Swift Banshee
		expect(EffectManager.spam.mock.calls.map(c => c[0])).toEqual([
			{ effectId: 240, ownerAID: 5, persistent: true }
		]);
	});

	it('does not stack them when the monster is announced again', () => {
		showMonsterEffects({ GID: 5, _job: 2736 });
		showMonsterEffects({ GID: 5, _job: 2736 });
		expect(EffectManager.spam).toHaveBeenCalledTimes(1);
	});

	it('puts every effect of the row on, in order', () => {
		showMonsterEffects({ GID: 9, _job: 1039 }); // Baphomet: the green 99 aura's three parts
		expect(EffectManager.spam.mock.calls.map(c => c[0].effectId)).toEqual([678, 679, 680]);
	});

	it('does nothing for players and monsters out of the table', () => {
		showMonsterEffects({ GID: 1, _job: 7 });
		showMonsterEffects({ GID: 2, _job: 1002 });
		removeMonsterEffects({ GID: 2, _job: 1002 });
		expect(EffectManager.spam).not.toHaveBeenCalled();
		expect(EffectManager.remove).not.toHaveBeenCalled();
	});

	it('takes them off when the monster dies', () => {
		removeMonsterEffects({ GID: 5, _job: 2832 });
		expect(EffectManager.remove).toHaveBeenCalledWith(null, 5, [544]);
	});
});
