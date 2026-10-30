import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Falling Star (SJ_FALLINGSTAR 2584, its attack SJ_FALLINGSTAR_ATK 2594): Falling Star itself has no
// skilleffectinfo row and no case. The attack's row plays wizard_sightrasher.wav and launches 1220
// (falling_star.str) on the target as each damage packet arrives. No hit flash. kRO 2025-07-16.
// Spec: effect-port/star-emperor-soul-reaper-skills.md.

describe('Falling Star', () => {
	it('plays the star and its sound on each attack target at damage arrival', () => {
		expect(SkillEffect[SK.SJ_FALLINGSTAR]).toEqual({});
		expect(SkillEffect[SK.SJ_FALLINGSTAR_ATK]).toEqual({ damageEffectIdOnTarget: 'ef_sj_fallingstar' });
		expect(EffectTable.ef_sj_fallingstar).toEqual([
			{
				type: 'STR',
				file: 'falling_star/falling_star',
				texturePath: 'falling_star/',
				wav: 'effect/wizard_sightrasher',
				attachedEntity: true
			}
		]);
	});
});
