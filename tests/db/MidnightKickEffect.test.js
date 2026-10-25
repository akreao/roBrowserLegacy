import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Midnight Kick (SKE_MIDNIGHT_KICK), played like the official client: the cast
// aura is always the holy one (effect 58), whatever the packet's element, and
// the skill plays the EZ2 effect "ske_midnight_kick" once, on the caster, when
// it is used. The EZ2 entry gives the file, the sound and a PosY of 10.
//
// Read as text: the tables import the renderer, which does not load without a canvas.
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const skillEffect = read('DB/Skills/SkillEffect.js');
const effectTable = read('DB/Effects/EffectTable.js');
const entity = read('Engine/MapEngine/Entity.js');

function entry(id) {
	const start = effectTable.indexOf(`\n\t${id}: [`);
	expect(start, `${id} is defined`).toBeGreaterThan(-1);
	return effectTable.slice(start, effectTable.indexOf('\n\t],', start));
}

describe('Midnight Kick effect', () => {
	const line = skillEffect.split('\n').find(l => l.startsWith('SkillEffect[SK.SKE_MIDNIGHT_KICK] ='));

	it('plays its effect on the skill packet and casts in the holy aura', () => {
		expect(line).toContain("effectId: 'ef_ske_midnight_kick'");
		expect(line).toContain('castAuraEffectId: 58');
		expect(line).not.toMatch(/hitEffectId|beforeHitEffectId|effectIdOnCaster/);
	});

	it('plays the EZ2 STR on the caster with its sound and height offset', () => {
		const e = entry('ef_ske_midnight_kick');
		expect(e.match(/type: '/g)).toHaveLength(1);
		expect(e).toContain("type: 'STR'");
		expect(e).toContain("file: 'sky_emperor/ske_midnight_kick/ske_midnight_kick'");
		expect(e).toContain("min: 'sky_emperor/ske_midnight_kick/min_ske_midnight_kick'");
		expect(e).toContain("wav: 'effect/sky_emperor/ske_midnight_kick'");
		expect(e).toContain('attachedEntity: true');
		expect(e).toContain('yOffset: 10');
		expect(e).not.toMatch(/xOffset|delayStart|repeat|renderBeforeEntities/);
	});
});

describe('castAuraEffectId', () => {
	it('replaces the aura picked from the element, just before it is spawned', () => {
		const castSkill = entity.slice(entity.indexOf('function onEntityCastSkill('));
		const override = castSkill.indexOf('[castSkill.castAuraEffectId].flat()');
		expect(override).toBeGreaterThan(castSkill.indexOf('EffectConst.EF_DARKCASTING'));
		expect(override).toBeLessThan(castSkill.indexOf('EffectManager.spam({ ...EF_Init_Par, effectId })', override));
	});
});
