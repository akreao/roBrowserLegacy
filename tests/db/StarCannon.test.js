import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Star Cannon (SKE_STAR_CANNON, 5473), like the official client: the skill's
// ground unit (UNT_STAR_CANNON) runs effect 2350, which drops a star at a random
// point every 18 ticks (300 ms) while the unit exists. The area is 13, 13, 11,
// 11 or 9 cells wide by skill level. A star is two .str files and one sound.
// Nothing plays on each hit; the cast shows the blue cast aura (441).
//
// Read as text: the tables import the renderer, which does not load without a canvas.
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const effectTable = read('DB/Effects/EffectTable.js');

function entry(name) {
	const start = effectTable.indexOf(`\n\t${name}: [`);
	expect(start, `${name} is defined`).toBeGreaterThan(-1);
	const end = effectTable.indexOf('\n\t],', start);
	return vm.runInNewContext(`(${effectTable.slice(start, end + 3).trim().replace(/^\w+:/, '')})`);
}

describe('Star Cannon', () => {
	it('drops a star every 300 ms over an area sized by level', () => {
		expect(entry('ef_ske_star_cannon_field')).toEqual([
			{
				type: 'AREA_SPAWN',
				spawnEffectId: 'ef_ske_star_cannon_star',
				interval: 300,
				areaByLevel: [13, 13, 11, 11, 9]
			}
		]);
	});

	it('plays the falling star with its sound and the floor part under the actors', () => {
		const [star, bottom] = entry('ef_ske_star_cannon_star');
		expect(star).toMatchObject({
			type: 'STR',
			file: 'sky_emperor/ske_star_cannon/star_cannon/ske_star_cannon',
			wav: 'effect/sky_emperor/ske_star_cannon'
		});
		expect(star.renderBeforeEntities).toBeUndefined();
		expect(bottom).toMatchObject({
			type: 'STR',
			file: 'sky_emperor/ske_star_cannon/star_cannon_bottom/ske_star_cannon_bottom',
			renderBeforeEntities: true
		});
		expect(bottom.wav).toBeUndefined();
	});

	it('starts from the skill unit, not from each hit', () => {
		expect(read('DB/Skills/SkillUnit.js')).toContain(
			"SkillUnit[SU.UNT_STAR_CANNON] = 'ef_ske_star_cannon_field';"
		);
		const row = read('DB/Skills/SkillEffect.js')
			.split('\n')
			.find(line => line.startsWith('SkillEffect[SK.SKE_STAR_CANNON] ='));
		expect(row).toContain('{ castAuraEffectId: 441 }');
	});
});
