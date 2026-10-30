import { describe, expect, it } from 'vitest';
import SkillEffect from '../../src/DB/Skills/SkillEffect.js';
import SK from '../../src/DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Swirling Petal (KO_HUUMARANKA, skill 3009): the official client's skilleffectinfo row plays
// T_회오리차기.wav and launches 984 (the spinning huuma), 1000 (the blue rotate-line ribbons) and 1002
// (a scatter) at the ground packet's cell, with no owner. 984 and 1002 are not ported. Nothing at damage
// arrival, no hit flash. kRO 2025-07-16. Spec: effect-port/kagerou-oboro-skills.md.

describe('Swirling Petal', () => {
	it('plays the sound and the blue ribbons at the cell from the ground packet, every level', () => {
		expect(SkillEffect[SK.KO_HUUMARANKA]).toEqual({ groundEffectIdByLevel: ['ef_ko_huumaranka'] });
		const [sound, line] = EffectTable.ef_ko_huumaranka;
		expect(sound).toEqual({
			wav: 'effect/t_\xc8\xb8\xbf\xc0\xb8\xae\xc2\xf7\xb1\xe2',
			attachedEntity: false
		});
		expect(line).toMatchObject({ type: 'FUNC', attachedEntity: false });

		const added = [];
		const position = [10, 20, 0];
		line.func.call({ add: effect => added.push(effect) }, { Init: {}, Inst: { position, startTick: 0 } });
		expect(added).toHaveLength(1);
		expect(added[0].position).toBe(position);
		expect(added[0].frames).toBe(120);
		expect(added[0].look).toEqual({ rgb: [100, 100, 255], additive: true, radius: 3 });
	});
});
