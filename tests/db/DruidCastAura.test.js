import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Druid, Karnos and Alitea casts, as the official client plays them: no element
// cast aura for skills 6525-6606, only what each skill's own cast slot plays
// (effect-port/druid-cast-aura.md).
//
// Read as text: the tables import the renderer, which does not load without a canvas.
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const skillEffect = read('DB/Skills/SkillEffect.js');
const effectTable = effectTableSource().replace(/\r\n/g, '\n');
const skillConst = read('DB/Skills/SkillConst.js');

const { NO_ELEMENT_AURA_RANGES, hasElementCastAura } = await import('DB/Skills/CastAuraRule.js');
const { TINT_MODES, BANDS, bandAlpha, pointHeight } = await import('Renderer/Effects/CastCircleSim.js');

const SK = Object.fromEntries([...skillConst.matchAll(/^\t([A-Z0-9_]+): (\d+),?$/gm)].map(m => [m[1], +m[2]]));

function row(name) {
	const start = skillEffect.indexOf(`SkillEffect[SK.${name}] =`);
	expect(start, `${name} has a SkillEffect row`).toBeGreaterThan(-1);
	return skillEffect.slice(start, skillEffect.indexOf('\n', start));
}

function field(name, key) {
	const m = row(name).match(new RegExp(`\\b${key}: ('[\\w]+'|\\d+)`));
	return m ? m[1].replace(/'/g, '') : undefined;
}

function entry(id) {
	const start = effectTable.indexOf(`\n\t${id}: [`);
	expect(start, `${id} is defined`).toBeGreaterThan(-1);
	return effectTable.slice(start, effectTable.indexOf('\n\t],', start)).replace(/\s+/g, ' ');
}

// What each Druid skill's cast slot (vf8) plays in the 2026-02-11 client
const BLUE = 'DR_ENRAGE_WOLF DR_BLOOD_HOWLING DR_TRUTH_OF_ICE KR_CLAW_WAVE KR_IRON_HOWLING AT_PULSE_OF_MADNESS AT_ALPHA_PHASE';
const GREEN =
	'DR_ENRAGE_RAPTOR DR_PREENING DR_TRUTH_OF_WIND DR_CUTTING_WIND DR_WIND_BOMB KR_SHARPEN_GUST KR_SHARPEN_HAIL KR_TYPHOON_WING KR_WIND_VEIL AT_PINION_SHOT AT_QUILL_SPEAR';
const YELLOW =
	'DR_TRUTH_OF_EARTH DR_EARTH_FLOWER DR_AROUND_FLOWER KR_EARTH_DRILL KR_EARTH_STAMP AT_TERRA_WAVE AT_TERRA_HARVEST AT_SOLID_STOMP';
const CLASSIC_12 = 'DR_NATURE_SHIELD AT_GRAVITY_HOLE';
const ICE =
	'DR_ICE_TOTEM DR_ICE_CLOUD KR_ICE_PILLAR KR_ICE_SPLASH AT_GLACIER_MONOLITH AT_GLACIER_NOVA AT_GLACIER_SHARD AT_GLACIER_STOMP AT_CHILLING_BLAST';
const THUNDER =
	'KR_THUNDERING_FOCUS KR_THUNDERING_FOCUS_S KR_THUNDERING_ORB KR_THUNDERING_ORB_S KR_THUNDERING_CALL KR_THUNDERING_CALL_S AT_ROARING_PIERCER AT_ROARING_PIERCER_S AT_ROARING_CHARGE AT_ROARING_CHARGE_S AT_FURIOS_STORM';

const AURA = {
	...Object.fromEntries(BLUE.split(' ').map(n => [n, 'ef_druid_cast_circle_blue'])),
	...Object.fromEntries(GREEN.split(' ').map(n => [n, 'ef_druid_cast_circle_green'])),
	...Object.fromEntries(YELLOW.split(' ').map(n => [n, 'ef_druid_cast_circle_yellow'])),
	...Object.fromEntries(CLASSIC_12.split(' ').map(n => [n, '12']))
};

describe('Druid cast aura rule', () => {
	it('gives no element aura to skills 6525-6606', () => {
		expect(NO_ELEMENT_AURA_RANGES).toContainEqual([6525, 6606]);
		expect(SK.DR_ENRAGE_WOLF).toBe(6525);
		expect(SK.AT_NATURE_AID).toBe(6606);
		expect(hasElementCastAura(6524)).toBe(true); // DR_WEREWOLF, outside the range
		expect(hasElementCastAura(6525)).toBe(false);
		expect(hasElementCastAura(SK.KR_TYPHOON_WING)).toBe(false);
		expect(hasElementCastAura(6606)).toBe(false);
		expect(hasElementCastAura(6607)).toBe(true); // AT_NATURE_HARMONY, outside the range
		expect(hasElementCastAura(SK.WZ_FIREPILLAR)).toBe(true);
	});

	it('is applied before the element aura, unless the skill has its own cast aura', () => {
		const entity = read('Engine/MapEngine/Entity.js');
		expect(entity).toContain("import { hasElementCastAura, fixedCastAura } from 'DB/Skills/CastAuraRule.js';");
		expect(entity.replace(/\s+/g, ' ')).toContain(
			'(!hasElementCastAura(pkt.SKID) && !(castSkill && castSkill.castAuraEffectId))'
		);
		expect(entity).toContain('if (pkt.delayTime && !hideCastAura) {');
	});

	it('plays each skill\'s own cast circle, and no other skill in the range has one', () => {
		for (const [name, id] of Object.entries(SK)) {
			if (id < 6525 || id > 6606 || !skillEffect.includes(`SkillEffect[SK.${name}] =`)) {
				continue;
			}
			expect(field(name, 'castAuraEffectId'), name).toBe(AURA[name]);
			expect(row(name), name).not.toContain('hideCastAura');
		}
		for (const name of Object.keys(AURA)) {
			expect(field(name, 'castAuraEffectId'), name).toBe(AURA[name]);
		}
	});

	it('plays the ice and thunder cast rows on every skill whose cast slot does', () => {
		for (const name of ICE.split(' ')) {
			expect(field(name, 'beginCastEffectId'), name).toBe('ef_druid_ice_cast');
		}
		for (const name of THUNDER.split(' ')) {
			expect(field(name, 'beginCastEffectId'), name).toBe('ef_druid_thunder_cast');
		}
	});

	it('plays Sharpen Hail\'s sharpen_hail rows at cast start, and the shots from the use packet', () => {
		expect(field('KR_SHARPEN_HAIL', 'beginCastEffectId')).toBe('ef_druid_sharpen_hail');
		expect(row('KR_SHARPEN_HAIL')).toContain("successEffectHailScatter: ['ef_druid_sharpen_hail_shot']");
	});

	it('plays Tempest Flap\'s cast row at cast start, only in Wereraptor form', () => {
		expect(field('AT_TEMPEST_FLAP', 'beginCastEffectIdInRaptorForm')).toBe('ef_druid_tempest_flap_cast');
		expect(row('AT_TEMPEST_FLAP')).not.toContain('effectIdOnCaster');

		const source = read('Renderer/EffectManager.js')
			.replace(/^import .*;$/gm, '')
			.replace('export default EffectManager;', 'this.EffectManager = EffectManager;');
		const entities = {};
		const context = vm.createContext({
			console,
			Math,
			Number,
			Float32Array,
			SU: {},
			SkillUnit: {},
			Renderer: { tick: 1000 },
			JobId: { WEREWOLF: 4356, WERERAPTOR: 4357 },
			EntityManager: { get: aid => entities[aid] },
			SkillEffect: { [SK.AT_TEMPEST_FLAP]: { beginCastEffectIdInRaptorForm: 'ef_druid_tempest_flap_cast' } }
		});
		vm.runInContext(source, context);
		const spammed = [];
		context.EffectManager.spam = params => spammed.push(params);

		for (const [form, plays] of [
			[null, false],
			[4356, false],
			[4357, true]
		]) {
			entities[10] = { job_transform: form };
			spammed.length = 0;
			context.EffectManager.spamSkillCast(SK.AT_TEMPEST_FLAP, 10, null, 20, 1500);
			expect(spammed.map(p => [p.effectId, p.ownerAID]), `form ${form}`).toEqual(
				plays ? [['ef_druid_tempest_flap_cast', 10]] : []
			);
		}
		expect(read('DB/Jobs/JobConst.js')).toMatch(/\bWERERAPTOR: 4357,/);
	});
});

describe('Druid cast circles (client effects 54, 56, 57)', () => {
	it('uses the client\'s textures and variants, lasts the cast and goes on cancel', () => {
		for (const [id, args] of [
			['ef_druid_cast_circle_green', "'magic_green.tga' )"],
			['ef_druid_cast_circle_blue', "'ring_blue.tga', 2 )"],
			['ef_druid_cast_circle_yellow', "'ring_yellow.tga', 0 )"]
		]) {
			const e = entry(id);
			expect(e).toContain("type: 'FUNC'");
			expect(e).toContain('attachedEntity: true');
			expect(e).toContain('castLoop: true');
			expect(e).toContain("wav: 'effect/ef_beginspell'");
			expect(e).toContain(
				`new CastCircle( Params.Init.ownerEntity.position, Params.Inst.startTick, Params.Init.duration, ${args}`
			);
		}
		expect(effectTable).not.toContain('ef_druid_typhoon_wing_cast');
	});

	it('tints by mode: 0 white and 2 bluish with normal blending, 1 pinkish additive', () => {
		expect(TINT_MODES).toEqual({
			0: { color: [255, 255, 255], additive: false },
			1: { color: [255, 175, 175], additive: true },
			2: { color: [195, 195, 255], additive: false }
		});
	});

	it('keeps the tinted circle\'s tall band at alpha 60, losing 2 a tick at the end', () => {
		const frames = 100; // fade from tick 60
		expect([1, 5, 19, 59].map(t => bandAlpha(3, t, frames, true))).toEqual([60, 60, 60, 60]);
		expect([60, 61, 89, 100].map(t => bandAlpha(3, t, frames, true))).toEqual([58, 56, 0, 0]);
		// bands 0-2 are the same as the untinted circle
		for (let b = 0; b < 3; b++) {
			for (const t of [1, 59, 60, 70, 100]) {
				expect(bandAlpha(b, t, frames, true)).toBe(bandAlpha(b, t, frames));
			}
		}
		// untinted: rises to 100, loses 3 a tick
		expect([1, 4, 59, 60].map(t => bandAlpha(3, t, frames))).toEqual([78, 100, 100, 97]);
	});

	it('does not pulse: the tall band grows over 90 ticks and holds', () => {
		const full = BANDS[3].height * Math.sin((9 * 10 * Math.PI) / 180);
		expect(pointHeight(3, 10, 45, true)).toBeCloseTo(full * Math.sin((45 * Math.PI) / 180), 6);
		for (const t of [91, 120, 180, 270, 400]) {
			expect(pointHeight(3, 10, t, true)).toBeCloseTo(full, 6);
		}
		expect(pointHeight(3, 10, 180)).not.toBeCloseTo(full, 3);
	});

	it('draws the tint and switches to additive blending only for mode 1', () => {
		const circle = read('Renderer/Effects/CastCircle.js');
		expect(circle).toContain('this.tinted = mode in TINT_MODES;');
		expect(circle).toContain('buildCircle(this.vertices, t, this.position, this.tinted)');
		expect(circle).toContain('bandAlpha(b, t, self.frames, self.tinted)');
		expect(circle).toContain('gl.blendFunc(gl.SRC_ALPHA, gl.ONE);');
	});
});
