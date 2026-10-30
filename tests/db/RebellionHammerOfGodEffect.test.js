import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import SkillEffect from '../../src/DB/Skills/SkillEffect.js';
import SK from '../../src/DB/Skills/SkillConst.js';

// Hammer of God (RL_HAMMER_OF_GOD, skill 2571): the official client's ground packet case launches 1062
// (RL_HAMER_GOD\hogg2.str) at the packet's cell, with no owner and no sound. Its damage packets play
// nothing of their own (no skilleffectinfo row, no hit flash). kRO 2025-07-16.
// Spec: effect-port/rebellion-skills.md.

const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');

describe('Hammer of God', () => {
	it('plays 1062 from the ground packet', () => {
		expect(SkillEffect[SK.RL_HAMMER_OF_GOD]).toEqual({ effectId: 1062 });
	});

	it('loads the client file at the cell, without the Storm Gust STR', () => {
		const at = table.indexOf('\n\t1062: [');
		const row = table.slice(at, table.indexOf('\n\t],', at));
		expect(row).toContain("file: 'rl_hamer_god/hogg2'");
		expect(row).toContain('attachedEntity: false');
		expect(row).not.toContain('stormgust');
	});
});
