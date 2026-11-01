import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import WarlockSphereEffect, {
	SPHERE_EFFECTS,
	sphereEffectId,
	sphereLayout
} from 'DB/Effects/WarlockSphereEffect.js';

// A Warlock's summoned spheres (EFST_SUMMON1..5), as the kRO 2025-07-16 client draws them
// (CTetraBallEffect, 1262-1265): one looping tetra_ball STR a filled slot, spread round the
// circle by starting each floor(fps x slot / count) frames in. Spec: effect-port/warlock-spheres.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

describe('Warlock summoned spheres', () => {
	it('picks the ball by element (value & 3)', () => {
		expect([0x44, 0x45, 0x46, 0x47].map(sphereEffectId)).toEqual([1262, 1264, 1263, 1265]);
		expect(SPHERE_EFFECTS).toEqual([1262, 1263, 1264, 1265]);
	});

	it('loops each element its own tetra_ball STR on the actor', () => {
		const files = {
			1262: 'tetravortex/tetra_ball_01_fire/tetra_01_fire',
			1263: 'tetravortex/tetra_ball_04_water/tetra_04_water',
			1264: 'tetravortex/tetra_ball_02_wind/tetra_02_wind',
			1265: 'tetravortex/tetra_ball_03_earth/tetra_03_earth'
		};
		for (const [id, file] of Object.entries(files)) {
			expect(WarlockSphereEffect[id]).toEqual([
				{
					type: 'STR',
					file,
					texturePath: file.slice(0, file.lastIndexOf('/') + 1),
					loop: true,
					attachedEntity: true
				}
			]);
		}
	});

	it('spreads the balls by slot over the number filled', () => {
		expect(sphereLayout([0x44, 0x45, 0x46, 0x47, 0x47])).toEqual([
			{ slot: 0, effectId: 1262, lead: 0 },
			{ slot: 1, effectId: 1264, lead: 0.2 },
			{ slot: 2, effectId: 1263, lead: 0.4 },
			{ slot: 3, effectId: 1265, lead: 0.6 },
			{ slot: 4, effectId: 1265, lead: 0.8 }
		]);
		// the slot number counts, not the place among the filled ones
		expect(sphereLayout([0x44, 0, 0, 0x46, 0])).toEqual([
			{ slot: 0, effectId: 1262, lead: 0 },
			{ slot: 3, effectId: 1263, lead: 1.5 }
		]);
		expect(sphereLayout([0, 0, 0x45, 0, 0])).toEqual([{ slot: 2, effectId: 1264, lead: 0 }]);
		expect(sphereLayout([0, 0, 0, 0, 0])).toEqual([]);
	});

	it('replaces the old placeholder', () => {
		const table = read('DB/Effects/EffectTable.js');
		expect(table).not.toContain('temporary_warlock_sphere');
		expect(table).toContain('\n\t...WarlockSphereEffect,');
		const entity = read('Engine/MapEngine/Entity.js');
		expect(entity).toContain('EffectManager.remove(null, entity.GID, SPHERE_EFFECTS);');
		expect(entity).toContain('strLead: ball.lead');
	});

	it('starts a looping STR some frames in', () => {
		const str = read('Renderer/Effects/StrEffect.js');
		expect(str).toContain('keyIndex += Math.floor(strFile.fps * this.lead);');
		const manager = read('Renderer/EffectManager.js');
		expect(manager).toContain('if (Params.effect.loop) {\n\t\tstr.persistent = true;');
		expect(manager).toContain('str.lead = Params.Init.strLead;');
	});
});
