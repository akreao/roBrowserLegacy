import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Document of Sun, Moon and Star (SJ_DOCUMENT, skill 2588): when the use packet has the result set, the
// official client's skilleffectinfo row launches 1219 (sj_document.str) on the caster. kRO 2025-07-16.
// Spec: effect-port/star-emperor-soul-reaper-skills.md.

describe('Document of Sun, Moon and Star', () => {
	it('plays its STR on the caster on success', () => {
		expect(SkillEffect[SK.SJ_DOCUMENT]).toEqual({ successEffectIdOnCaster: 'ef_sj_document' });
		expect(EffectTable.ef_sj_document).toEqual([
			{ type: 'STR', file: 'sj_document/sj_document', texturePath: 'sj_document/', attachedEntity: true }
		]);
	});
});
