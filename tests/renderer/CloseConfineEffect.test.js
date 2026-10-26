import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

vi.mock('Renderer/EntityManager.js', () => ({ default: { get: () => null } }));

import { SCHEDULES as MARKS } from 'Renderer/Effects/CasterMarks.js';
import { SCHEDULES as MOTIONS } from 'Renderer/Effects/BodyMotionSim.js';
import CloseConfineEffect from 'DB/Effects/CloseConfineEffect.js';
import StatusEffectTable from 'DB/Status/StatusEffectTable.js';
import StatusConst from 'DB/Status/StatusConst.js';

// Close Confine (RG_CLOSECONFINE, skill 1005), as the official client plays it: 602 on the target
// when the skill works (ef_hit6.wav on tick 20, then quake and a red / white flicker to tick 59),
// and 604 (cconfine.spr, silent) on both actors while the status is on.
// Spec: effect-port/rogue-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');
const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');

describe('Close Confine', () => {
	it('plays 602 on the target when the skill works', () => {
		expect(skills).toContain('SkillEffect[SK.RG_CLOSECONFINE] = { successEffectId: 602 };');
	});

	it('plays ef_hit6 on tick 20 of 602', () => {
		const [sound] = CloseConfineEffect[602];
		expect(sound.wav).toBe('effect/ef_hit6');
		expect(sound.delayWav).toBe(333);
	});

	it('quakes the target and flickers it red and white after tick 20', () => {
		expect(MOTIONS[602](20)).toBe(null);
		expect(MOTIONS[602](21)).toEqual({ quake: true });
		expect(MARKS[602](20).color).toBe(null);
		expect(MARKS[602](21).color).toEqual([255, 255, 255]);
		expect(MARKS[602](22).color).toEqual([250, 50, 50]);
		expect(MARKS[602](22).add).toBe(false);
		expect(MARKS[602](22).glow).toBe(false);
	});

	it('shows 604 on both actors while the status is on, silent and not looping', () => {
		for (const status of [StatusConst.RG_CCONFINE_M, StatusConst.RG_CCONFINE_S]) {
			expect(StatusEffectTable[status]).toEqual({ start: [604], stop: [604] });
		}
		const row = table.match(/\t604: \[\s*\{([^}]*)\}/)[1];
		expect(row).not.toContain('wav');
		expect(row).toContain('stopAtEnd: true');
		expect(row).toContain('delayFrame: 200');
	});
});
