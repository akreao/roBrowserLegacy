import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

vi.mock('Renderer/EffectManager.js', () => ({
	default: { spam: vi.fn(), has: vi.fn(() => false), remove: vi.fn() }
}));

const { default: EffectManager } = await import('Renderer/EffectManager.js');
const { default: StatusConst } = await import('DB/Status/StatusConst.js');
const { updateStatusEffects } = await import('Engine/MapEngine/StatusEffects.js');

// Bard and Dancer songs (renewal): when a song's status starts on an actor the official
// client removes the actor's earlier aura and launches it again.
// Spec: effect-port/bard-dancer-skills.md.

const AURAS = {
	WHISTLE: 865,
	ASSASSINCROSS: 873,
	POEMBRAGI: 877,
	APPLEIDUN: 861,
	HUMMING: 865,
	DONTFORGETME: 38,
	FORTUNEKISS: 871,
	SERVICEFORYOU: 873,
	RICHMANKIM: 867,
	ETERNALCHAOS: 864,
	DRUMBATTLEFIELD: 871,
	RINGNIBELUNGEN: 875,
	ROKISWEIL: 864,
	INTOABYSS: 865,
	SIEGFRIED: 875
};

describe('Bard and Dancer song status auras', () => {
	beforeEach(() => vi.clearAllMocks());

	for (const [status, effectId] of Object.entries(AURAS)) {
		it(`${status} replays ${effectId} on the actor`, () => {
			updateStatusEffects(9, StatusConst[status], 1);
			expect(EffectManager.remove).toHaveBeenCalledWith(null, 9, effectId);
			expect(EffectManager.spam).toHaveBeenCalledWith({ effectId, ownerAID: 9 });
			expect(EffectManager.remove.mock.invocationCallOrder[0]).toBeLessThan(
				EffectManager.spam.mock.invocationCallOrder[0]
			);
		});
	}

	it('leaves the aura to end on its own when the status ends', () => {
		updateStatusEffects(9, StatusConst.WHISTLE, 0);
		expect(EffectManager.remove).not.toHaveBeenCalled();
		expect(EffectManager.spam).not.toHaveBeenCalled();
	});

	it('draws the auras with the client effects', () => {
		const source = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'latin1');
		const variants = { 861: 2, 865: 3, 867: 4, 871: 5, 873: 6, 875: 7, 877: 8 };
		for (const [id, variant] of Object.entries(variants)) {
			expect(source).toMatch(
				new RegExp(`\\t${id}: \\[[\\s\\S]*?new CirclePower\\(Params\\.Init\\.ownerEntity\\.position, Params\\.Inst\\.startTick, ${variant}\\)`)
			);
		}
		expect(source).toMatch(/\t864: \[[\s\S]*?new CasterMarks\(Params\.Init\.ownerEntity, Params\.Inst\.startTick, 100, 864\)/);
	});
});
