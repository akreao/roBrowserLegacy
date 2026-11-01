import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import SkillEffect from '../../src/DB/Skills/SkillEffect.js';
import SK from '../../src/DB/Skills/SkillConst.js';
import StatusEffectTable from '../../src/DB/Status/StatusEffectTable.js';
import StatusConst from '../../src/DB/Status/StatusConst.js';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Crimson Marker (RL_C_MARKER, skill 2560): the official client plays nothing from the use packet (the
// skilleffectinfo row only has a sound for damage packets, which the skill does not send). The marks come
// from the C_MARKER status: 1061 (RL_C_MAKER\deffender.str) and 1075 (RL_C_MAKER\cm.str) once each when it
// starts; 1075 is removed whenever the status changes. kRO 2025-07-16. Spec: effect-port/rebellion-skills.md.

const table = effectTableSource();
const entity = readFileSync(join(process.cwd(), 'src/Engine/MapEngine/Entity.js'), 'utf8');

describe('Crimson Marker', () => {
	it('plays nothing from the skill packets', () => {
		expect(SkillEffect[SK.RL_C_MARKER]).toEqual({});
	});

	it('plays 1061 and 1075 when the status starts and removes 1075 when it ends', () => {
		expect(StatusEffectTable[StatusConst.C_MARKER]).toEqual({ start: [1061], restart: [1075], stop: [1075] });
	});

	it('has rows with the client files', () => {
		expect(table).toMatch(/\n\t1061: \[[^\]]*file: 'rl_c_maker\/deffender'/);
		expect(table).toMatch(/\n\t1075: \[[^\]]*file: 'rl_c_maker\/cm'/);
	});

	it('no longer plays the old pulse from the status handler', () => {
		expect(entity).not.toContain('ef_c_marker2');
	});
});
