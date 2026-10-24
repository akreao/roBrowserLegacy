import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Star Light Kick, as the official client plays it. When the use-skill packet
// succeeds, two EZ2 effects go on the target and follow it: the falling star
// (star_light_kick, with the skill's sound, PosY 13) and the ground ring
// (star_light_kick_bottom, a floor effect, PosY 11). Each damage packet then
// plays star_light_kick_hit on the target it hits, with its own sound, PosY 7.
//
// Read as text: the tables import the renderer, which does not load without a canvas.
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const skillEffect = read('DB/Skills/SkillEffect.js');
const effectTable = read('DB/Effects/EffectTable.js');

function entry(id) {
	const start = effectTable.indexOf(`\n\t${id}: [`);
	expect(start, `${id} is defined`).toBeGreaterThan(-1);
	return effectTable.slice(start, effectTable.indexOf('\n\t],', start));
}

function layers(id) {
	return entry(id).split('\n\t\t},').map(part => part.trim());
}

describe('Star Light Kick', () => {
	it('plays the star once per successful use and the hit effect on each damage, both on the target', () => {
		const start = skillEffect.indexOf('SkillEffect[5504 /* SKE_STAR_LIGHT_KICK */] = {');
		expect(start).toBeGreaterThan(-1);
		const row = skillEffect.slice(start, skillEffect.indexOf('};', start));
		expect(row).toContain("successEffectId: 'ef_ske_star_light_kick'");
		expect(row).toContain("hitEffectId: 'ef_ske_star_light_kick_hit'");
		expect(row).not.toMatch(/\b(effectId|effectIdOnCaster|hitEffectIdOnCaster):/);
	});

	it('draws the falling star with the skill sound, following the target, PosY 13', () => {
		const [star, ring] = layers('ef_ske_star_light_kick');
		expect(star).toContain("file: 'sky_emperor/ske_star_light_kick/star_light_kick/star_light_kick'");
		expect(star).toContain("min: 'sky_emperor/ske_star_light_kick/star_light_kick/min_star_light_kick'");
		expect(star).toContain("wav: 'effect/sky_emperor/ske_star_light_kick'");
		expect(star).toContain('attachedEntity: true');
		expect(star).toContain('yOffset: 13');
		expect(star).not.toMatch(/xOffset|delayStart|delayOffset|repeat|renderBeforeEntities/);

		expect(ring).toContain("file: 'sky_emperor/ske_star_light_kick/star_light_kick_bottom/star_light_kick_bottom'");
		expect(ring).toContain("min: 'sky_emperor/ske_star_light_kick/star_light_kick_bottom/min_star_light_kick_bottom'");
		expect(ring).toContain('renderBeforeEntities: true');
		expect(ring).toContain('attachedEntity: true');
		expect(ring).toContain('yOffset: 11');
		expect(ring).not.toMatch(/wav|xOffset|delayStart|repeat/);
	});

	it('draws the hit with its own sound, following the target, PosY 7', () => {
		const [hit, extra] = layers('ef_ske_star_light_kick_hit');
		expect(extra).toBeUndefined();
		expect(hit).toContain("file: 'sky_emperor/ske_star_light_kick/star_light_kick_hit/star_light_kick_hit'");
		expect(hit).toContain("min: 'sky_emperor/ske_star_light_kick/star_light_kick_hit/min_star_light_kick_hit'");
		expect(hit).toContain("wav: 'effect/sky_emperor/ske_star_light_kick_hit'");
		expect(hit).toContain('attachedEntity: true');
		expect(hit).toContain('yOffset: 7');
	});

	it('is not mapped again as plain effects when the client EZ2 table loads', () => {
		const db = read('DB/DBManager.js');
		const start = db.indexOf('function loadBSONFile(');
		const end = db.indexOf('function loadAttendanceFile(');
		expect(start).toBeGreaterThan(-1);
		expect(end).toBeGreaterThan(start);
		// The client's EZ2STREffect rows for the skill.
		const row = (name, extra) => ({
			FilePath: `SKY_EMPEROR\\SKE_STAR_LIGHT_KICK\\${name}\\${name}.str`,
			PosX: 0,
			StartDelayTime: 0,
			...extra
		});
		const Ez2streffect = {
			star_light_kick: row('star_light_kick', { PosY: 13, IsFloor: false, SoundPath: 'effect\\SKY_EMPEROR\\SKE_STAR_LIGHT_KICK.wav' }),
			star_light_kick_bottom: row('star_light_kick_bottom', { PosY: 11, IsFloor: true, SoundPath: '' }),
			star_light_kick_hit: row('star_light_kick_hit', { PosY: 7, IsFloor: false, SoundPath: 'effect\\SKY_EMPEROR\\SKE_STAR_LIGHT_KICK_hit.wav' })
		};
		const context = vm.createContext({ console: { log() {} }, Ez2streffect, SKID: { SKE_STAR_LIGHT_KICK: 5504 } });
		vm.runInContext(db.slice(start, end), context);
		const dir = 'sky_emperor/ske_star_light_kick';
		const EffectTable = {
			ef_ske_star_light_kick: [
				{ type: 'STR', file: `${dir}/star_light_kick/star_light_kick` },
				{ type: 'STR', file: `${dir}/star_light_kick_bottom/star_light_kick_bottom` }
			],
			ef_ske_star_light_kick_hit: [{ type: 'STR', file: `${dir}/star_light_kick_hit/star_light_kick_hit` }]
		};
		const row5504 = { successEffectId: 'ef_ske_star_light_kick', hitEffectId: 'ef_ske_star_light_kick_hit' };
		const SkillEffect = { 5504: { ...row5504 } };
		context.mergeEz2Effects(EffectTable, SkillEffect);
		expect({ ...SkillEffect[5504] }).toEqual(row5504);
	});
});
