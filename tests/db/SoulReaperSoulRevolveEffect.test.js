import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Soul Revolution (SP_SOULREVOLVE, skill 2608): the official client's hard-coded use case (result set, target
// known) spawns 1243 (soul_revolve.str) on the target and plays t_방어형.wav at the target. kRO 2025-07-16.
// Spec: effect-port/star-emperor-soul-reaper-skills.md.

describe('Soul Revolution', () => {
	it('plays the STR and its sound on the target on success', () => {
		expect(SkillEffect[SK.SP_SOULREVOLVE]).toEqual({ successEffectId: 'ef_sp_soulrevolve' });
		expect(EffectTable.ef_sp_soulrevolve).toEqual([
			{
				type: 'STR',
				file: 'soul_revolve/soul_revolve',
				texturePath: 'soul_revolve/',
				wav: 'effect/t_\xb9\xe6\xbe\xee\xc7\xfc',
				attachedEntity: true
			}
		]);
	});
});
