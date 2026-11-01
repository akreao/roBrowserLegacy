import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Crimson Rock (WL_CRIMSONROCK 2211): damage arrival: crimson_r.wav, 1274 + 1275 on the target.
// kRO 2025-07-16, spec: effect-port/warlock-skills.md. The client plays its damage-arrival effects
// as the ZC_NOTIFY_SKILL packet arrives and shows the damage attackMT later, so the meteor lands
// with the damage instead of starting its fall when the damage number appears.

describe('Crimson Rock explosion when the damage arrives', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.WL_CRIMSONROCK]).toEqual({
			arrivalEffectIdOnTarget: ['ef_wl_crimsonrock_sound', 1274, 1275],
			extraHitEffectId: 1298
		});
		expect(EffectTable[1274][0].file).toBe('new_crimsonrock/new_crimsonrock/new_crimsonrock');
		expect(EffectTable.ef_wl_crimsonrock_sound).toEqual([{ wav: 'crimson_r', attachedEntity: true }]);
	});

	it('starts the meteor as the damage packet arrives, attackMT before the damage', () => {
		const entity = readFileSync(join(process.cwd(), 'src', 'Engine/MapEngine/Entity.js'), 'utf8');
		expect(entity).toMatch(
			/EffectManager\.spamSkillDamage\(pkt\.SKID, pkt\.targetID, Renderer\.tick, pkt\.AID, undefined, pkt\.count\);/
		);
	});
});
