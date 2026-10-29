import { describe, expect, it } from 'vitest';

// Slim Potion Pitcher (CR_SLIMPITCHER, skill 478), effects 497-499 (EF_SLIM to EF_SLIM3): the official
// client's falling slim potion (Gloria Domini's falling-cross primitive, potion variants), from the ground
// packet. kRO 2025-07-16. Spec: effect-port/creator-skills.md.

const { HALF_SIZE, START_UP, LAST_UPDATE, LIFETIME, SLIM_POTIONS, slimPotionFor, potionAt, trailAt } = await import(
	'Renderer/Effects/SlimPotionSim.js'
);
const { slimPotionPart, slimPotionEffects } = await import('DB/Effects/SlimPotionEffect.js');
const { default: SkillEffect } = await import('DB/Skills/SkillEffect.js');
const { default: SK } = await import('DB/Skills/SkillConst.js');
const { default: EffectTable } = await import('DB/Effects/EffectTable.js');

describe('falling slim potion', () => {
	it('picks red for levels 1-5, yellow for 6-9, white for 10', () => {
		expect([1, 5, 6, 9, 10].map(slimPotionFor)).toEqual([497, 497, 498, 498, 499]);
		expect(SLIM_POTIONS[497].color).toEqual([255, 135, 135]);
		expect(SLIM_POTIONS[498].color).toEqual([255, 255, 135]);
		expect(SLIM_POTIONS[499].color).toEqual([255, 255, 255]);
		expect(SLIM_POTIONS[497].texture).toMatch(/\/item\/.+\.bmp$/);
	});

	it('starts 80 units up, half size 8, and lives 250 ticks', () => {
		expect([START_UP, HALF_SIZE, LIFETIME]).toEqual([80, 8, 250]);
		expect(potionAt(100, 0)).toEqual({ up: 80, angle: 100, alpha: 0 });
	});

	it('fades in 20 an update, falls 3 and turns -15 for 24 updates', () => {
		expect(potionAt(100, 1)).toEqual({ up: 77, angle: 85, alpha: 20 });
		expect(potionAt(100, 10).alpha).toBe(200);
		expect(potionAt(100, 24)).toEqual({ up: 8, angle: (100 - 360 + 360 * 2) % 360, alpha: 200 });
		expect(potionAt(100, 32)).toEqual({ up: 8, angle: 100, alpha: 200 });
	});

	it('fades 5 an update from update 33, gone on update 72', () => {
		expect(potionAt(0, 33).alpha).toBe(195);
		expect(potionAt(0, 71).alpha).toBe(5);
		expect(potionAt(0, 72).alpha).toBe(0);
		expect(LAST_UPDATE).toBe(72);
	});

	it('trails three copies, each an update behind, 100 then 25 fainter', () => {
		expect(trailAt(0, 1, 1)).toBeNull();
		expect(trailAt(0, 1, 12)).toEqual(Object.assign(potionAt(0, 11), { alpha: 100 }));
		expect(trailAt(0, 2, 12).alpha).toBe(75);
		expect(trailAt(0, 3, 12).alpha).toBe(30);
		expect(trailAt(0, 3, 3)).toBeNull();
	});

	it('draws the potion tinted, at its height in cells', () => {
		const part = slimPotionPart(497, 30, 0);
		expect(part.type).toBe('3D');
		expect([part.red, part.green, part.blue]).toEqual([1, 135 / 255, 135 / 255]);
		expect(part.track(0)).toEqual({ x: 0, y: 0, z: 77 / 5, size: 2 * 8 * 7, alpha: 20 / 255, angle: 15 });
		expect(part.track(80)).toBeNull();
	});
});

describe('Slim Potion Pitcher rows', () => {
	it('plays one potion from the ground packet, by level', () => {
		expect(SkillEffect[SK.CR_SLIMPITCHER]).toEqual({
			groundEffectIdOnCaster: 'ef_slim_pitcher_sound',
			groundEffectIdByLevel: [497, 497, 497, 497, 497, 498, 498, 498, 498, 499]
		});
	});

	it('has rows for 497-499, silent, and the ground packet sound at the caster', () => {
		[497, 498, 499].forEach(id => {
			expect(EffectTable[id]).toBe(slimPotionEffects[id]);
			expect(EffectTable[id][0].wav).toBeUndefined();
		});
		expect(EffectTable.ef_slim_pitcher_sound).toEqual([{ wav: 'assulter_attack', attachedEntity: true }]);
	});

	it('no longer plays them for Twilight Alchemy', () => {
		expect(SkillEffect[SK.AM_TWILIGHT1]).toEqual({});
		expect(SkillEffect[SK.AM_TWILIGHT2]).toEqual({});
		expect(SkillEffect[SK.AM_TWILIGHT3]).toEqual({});
	});
});
