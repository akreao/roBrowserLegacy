import { describe, expect, it } from 'vitest';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import EffectTable from 'DB/Effects/EffectTable.js';

// Full Strip / Divest All (ST_FULLSTRIP, skill 476): the official client plays 495 on the target when
// it works: the strip sound 복호격.wav on the effect's ticks 1, 11, 21 and 31. roBrowser had no 495
// row, so nothing played. Spec: effect-port/rogue-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Full Strip effect', () => {
	it('is played on the target when the skill works', () => {
		expect(skills).toContain('SkillEffect[SK.ST_FULLSTRIP] = { successEffectId: 495 };');
	});

	it('plays the strip sound four times, ten ticks apart', () => {
		const rows = EffectTable[495];
		expect(rows.map(r => r.wav)).toEqual(Array(4).fill('effect/\xba\xb9\xc8\xa3\xb0\xdd'));
		expect(rows.map(r => r.delayWav)).toEqual([17, 183, 350, 517]);
	});
});
