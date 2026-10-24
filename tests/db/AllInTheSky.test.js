import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// All in the Sky (SKE_ALL_IN_THE_SKY, 5474), as the official client shows it:
// when the cast starts, the EZ2 effect ske_all_in_the_sky plays on the target
// (PosX 1, PosY 3, with its sound). Nothing plays when the hit lands, and
// nothing plays when the client doesn't know the target.
//
// The tables are read as text: they import the renderer, which does not load
// without a canvas.
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const effectTable = read('DB/Effects/EffectTable.js');
const skillEffect = read('DB/Skills/SkillEffect.js');

function entry(id) {
	const start = effectTable.indexOf(`\n\t${id}: [`);
	expect(start, `${id} is defined`).toBeGreaterThan(-1);
	return effectTable.slice(start, effectTable.indexOf('\n\t],', start));
}

// EffectManager with its imports stubbed, recording what spam() is asked to play.
function manager(SkillEffect, known) {
	const code = read('Renderer/EffectManager.js')
		.replace(/^import .*;$/gm, '')
		.replace('export default EffectManager;', 'this.EffectManager = EffectManager;');
	const context = vm.createContext({
		console,
		Math,
		Number,
		Float32Array,
		SkillEffect,
		SU: {},
		SkillUnit: {},
		EffectDB: {},
		Session: { Entity: { position: [0, 0, 0] } },
		GraphicsSettings: { performanceMode: false },
		Renderer: { tick: 1000 },
		EntityManager: { get: aid => (known.includes(aid) ? { GID: aid } : null) }
	});
	vm.runInContext(code, context);
	const played = [];
	context.EffectManager.spam = params => played.push(params);
	return { EffectManager: context.EffectManager, played };
}

describe('All in the Sky', () => {
	it('plays on the target when the cast starts, not on the hit', () => {
		expect(skillEffect).toMatch(
			/SkillEffect\[SK\.SKE_ALL_IN_THE_SKY\] = \{ beginCastTargetEffectId: 'ef_ske_all_in_the_sky', castAuraEffectId: 845 \};/
		);
	});

	it('casts with the turquoise cone (845, colour variant 8), with no ground squares', () => {
		const text = entry('845');
		expect(text).toMatch(/type: 'FUNC'/);
		expect(text).toMatch(/attachedEntity: true/);
		expect(text).toMatch(/wav: 'effect\/ef_beginspell'/);
		expect(text).toMatch(/new CastCone\([^)]*\{\s*variant: 8\s*\}\)/);
		expect(text).not.toMatch(/ground:/);
	});

	it('removes the cone when the cast is cancelled', () => {
		const entity = read('Engine/MapEngine/Entity.js');
		expect(entity).toMatch(/EffectManager\.remove\(null, entity\.GID, \[[^\]]*\b845\]\)/);
	});

	it('uses the EZ2 entry: file, lighter file, sound, attached, PosX 1, PosY 3', () => {
		const text = entry('ef_ske_all_in_the_sky');
		expect(text).toMatch(/type: 'STR'/);
		expect(text).toMatch(/file: 'sky_emperor\/ske_all_in_the_sky\/ske_all_in_the_sky'/);
		expect(text).toMatch(/min: 'sky_emperor\/ske_all_in_the_sky\/min_ske_all_in_the_sky'/);
		expect(text).toMatch(/wav: 'effect\/sky_emperor\/ske_all_in_the_sky'/);
		expect(text).toMatch(/attachedEntity: true/);
		expect(text).toMatch(/xOffset: 1,/);
		expect(text).toMatch(/yOffset: 3\b/);
		// Not a floor effect: drawn over the characters
		expect(text).not.toMatch(/renderBeforeEntities/);
	});

	it('spawns the cast-start effect on the target, with the caster as the other actor', () => {
		const { EffectManager, played } = manager({ 5474: { beginCastTargetEffectId: 'ef_ske_all_in_the_sky' } }, [7]);
		// Entity.js calls spamSkillCast(SKID, caster, tick, target)
		EffectManager.spamSkillCast(5474, 3, null, 7);
		expect(played).toHaveLength(1);
		expect(played[0].effectId).toBe('ef_ske_all_in_the_sky');
		expect(played[0].ownerAID).toBe(7);
		expect(played[0].otherAID).toBe(3);
	});

	it('plays nothing when the target is unknown or missing', () => {
		const { EffectManager, played } = manager({ 5474: { beginCastTargetEffectId: 'ef_ske_all_in_the_sky' } }, [3]);
		EffectManager.spamSkillCast(5474, 3, null, 7);
		EffectManager.spamSkillCast(5474, 3, null, 0);
		expect(played).toHaveLength(0);
	});
});
