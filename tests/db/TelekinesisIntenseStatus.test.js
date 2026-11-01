import { beforeEach, describe, expect, it, vi } from 'vitest';

// Telekinesis Intense's status (EFST 717) through the status effect handler: each start removes the actor's
// 1048 and launches a repeating one; the end removes it.

vi.mock('Renderer/EffectManager.js', () => ({
	default: { spam: vi.fn(), has: vi.fn(() => false), remove: vi.fn() }
}));

const { default: EffectManager } = await import('Renderer/EffectManager.js');
const { default: StatusConst } = await import('DB/Status/StatusConst.js');
const { updateStatusEffects } = await import('Engine/MapEngine/StatusEffects.js');

describe('Telekinesis Intense status', () => {
	beforeEach(() => vi.clearAllMocks());

	it('relaunches a repeating 1048 on each start and removes it at the end', () => {
		updateStatusEffects(7, StatusConst.TELEKINESIS_INTENSE, 1, [0, 0, 0]);
		expect(EffectManager.remove.mock.calls.map(c => c.slice(1))).toEqual([[7, 1048]]);
		expect(EffectManager.spam.mock.calls.map(c => c[0])).toEqual([{ effectId: 1048, ownerAID: 7, persistent: true }]);
		vi.clearAllMocks();
		updateStatusEffects(7, StatusConst.TELEKINESIS_INTENSE, 0);
		expect(EffectManager.remove.mock.calls.map(c => c.slice(1))).toEqual([[7, 1048]]);
		expect(EffectManager.spam).not.toHaveBeenCalled();
	});
});
