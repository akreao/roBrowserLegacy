import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import SkillEffect from '../../src/DB/Skills/SkillEffect.js';
import SK from '../../src/DB/Skills/SkillConst.js';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Soul Linker spirits (445, 447-458, 460, 461, Spirit of Rebirth 494 and 572-575): the official
// client casts them with the blue aura 441 and, when the use packet succeeds, plays 503 and 424 on
// the target; nothing on a failed use (kRO 2025-07-16). 503 plays T_캐스팅.wav at once and
// T_영혼.wav on tick 145. Spec: effect-port/soul-linker-skills.md.

const SPIRITS = [
	'SL_ALCHEMIST',
	'SL_MONK',
	'SL_STAR',
	'SL_SAGE',
	'SL_CRUSADER',
	'SL_SUPERNOVICE',
	'SL_KNIGHT',
	'SL_WIZARD',
	'SL_PRIEST',
	'SL_BARDDANCER',
	'SL_ROGUE',
	'SL_ASSASIN',
	'SL_BLACKSMITH',
	'SL_HUNTER',
	'SL_SOULLINKER',
	'SL_HIGH',
	'SL_DEATHKNIGHT',
	'SL_COLLECTOR',
	'SL_NINJA',
	'SL_GUNNER'
];

const table = effectTableSource();

describe('Soul Linker spirit effects', () => {
	it.each(SPIRITS)('%s: blue cast aura, 503 and 424 only on success', name => {
		expect(SkillEffect[SK[name]]).toEqual({ castAuraEffectId: 441, successEffectId: [503, 424] });
	});

	it('503 plays the cast sound at once and the soul sound on tick 145', () => {
		const start = table.indexOf('\t503: [');
		const row = table.slice(start, table.indexOf('\t],', start));
		expect(row).toMatch(/wav: 'effect\/t_\\xc4\\xb3\\xbd\\xba\\xc6\\xc3',\r?\n\t\t\tattachedEntity: true/);
		expect(row).toMatch(/wav: 'effect\/t_\\xbf\\xb5\\xc8\\xa5',\r?\n\t\t\tdelayWav: 145 \* \(1000 \/ 60\),/);
	});

	it('drops the old STR guesses for the Assassin and Hunter spirits', () => {
		expect(table).not.toMatch(/ef_sl_assasin|ef_sl_hunter/);
	});
});
