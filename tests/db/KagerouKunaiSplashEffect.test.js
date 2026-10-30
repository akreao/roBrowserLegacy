import { describe, expect, it } from 'vitest';
import SkillEffect from '../../src/DB/Skills/SkillEffect.js';
import SK from '../../src/DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';
import { rotateLineFrames } from '../../src/Renderer/Effects/RotateLineSim.js';

// Kunai Splash (KO_HAPPOKUNAI, skill 3007): when the use packet has the result set, the official client's
// skilleffectinfo row plays T_회오리차기.wav and launches 981 (eight kunai, not ported) and 986 (the gray
// rotate-line ribbons, faded out by about tick 113) on the caster. Nothing at damage arrival, no hit flash.
// kRO 2025-07-16. Spec: effect-port/kagerou-oboro-skills.md.

describe('Kunai Splash', () => {
	it('plays the sound and the gray ribbons on the caster on success only', () => {
		expect(SkillEffect[SK.KO_HAPPOKUNAI]).toEqual({ successEffectIdOnCaster: 'ef_ko_happokunai' });
		const [sound, line] = EffectTable.ef_ko_happokunai;
		expect(sound).toEqual({
			wav: 'effect/t_\xc8\xb8\xbf\xc0\xb8\xae\xc2\xf7\xb1\xe2',
			attachedEntity: true
		});
		expect(line.type).toBe('FUNC');
		expect(line.attachedEntity).toBe(true);
	});

	it('draws the ribbons for 120 ticks', () => {
		const added = [];
		const position = [1, 2, 0];
		EffectTable.ef_ko_happokunai[1].func.call(
			{ add: effect => added.push(effect) },
			{ Init: { ownerEntity: { position } }, Inst: { startTick: 1000 } }
		);
		expect(added).toHaveLength(1);
		expect(added[0].position).toBe(position);
		expect(added[0].frames).toBe(rotateLineFrames(120 * 16));
		expect(added[0].frames).toBe(120);
		expect(added[0].look.additive).toBe(false);
	});
});
