import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import SkillEffect from '../../src/DB/Skills/SkillEffect.js';
import SK from '../../src/DB/Skills/SkillConst.js';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Fallen Angel (RL_FALLEN_ANGEL, skill 2564): the official client launches 1140 (RL_fallen_angel\Penne.str,
// its own effect class) on the caster when the cast packet arrives, and leaves it where the caster was.
// The ground packet plays nothing. kRO 2025-07-16. Spec: effect-port/rebellion-skills.md.

const table = effectTableSource();

describe('Fallen Angel', () => {
	it('plays Penne.str on the caster when the cast starts, not at the cell', () => {
		expect(SkillEffect[SK.RL_FALLEN_ANGEL]).toEqual({ beginCastEffectId: 'ef_rl_fallen_angel' });
	});

	it('does not follow the caster', () => {
		const at = table.indexOf('\n\tef_rl_fallen_angel: [');
		const row = table.slice(at, table.indexOf('\n\t],', at));
		expect(row).toContain("file: 'rl_fallen_angel/penne'");
		expect(row).not.toContain('attachedEntity: true');
	});
});
