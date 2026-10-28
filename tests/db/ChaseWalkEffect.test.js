import { describe, expect, it } from 'vitest';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import EffectTable from 'DB/Effects/EffectTable.js';

// Chase Walk (ST_CHASEWALK, skill 389): when the use packet's result is set, the official client puts
// a smoke puff (smoke.spr) where the caster stands, going into and out of hiding. It plays nothing
// at cast start. Spec: effect-port/rogue-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Chase Walk smoke', () => {
	it('puffs smoke on the caster when the skill works', () => {
		expect(skills).toContain("SkillEffect[SK.ST_CHASEWALK] = { successEffectIdOnCaster: 'ef_chase_walk_smoke' };");
	});

	it('leaves the smoke where the caster stood', () => {
		expect(EffectTable.ef_chase_walk_smoke).toEqual([{ type: 'SPR', file: 'smoke', attachedEntity: false }]);
	});
});
