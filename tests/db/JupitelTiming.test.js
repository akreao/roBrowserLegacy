import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Jupitel Thunder, timed like the official client: the ball (effect 93) leaves
// when the skill packet arrives and flies for 20 ticks of the 60 Hz effect
// clock; the hit effect (94) comes with the damage, after the attack motion.
// roBrowser used to start the ball only after the attack motion, so it landed
// after the damage numbers and the hit flashes it should have caused.
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

describe('Jupitel Thunder timing', () => {
	it.each(['WZ_JUPITEL', 'NPC_DARKTHUNDER'])('%s releases the ball at once and shows the hit with the damage', skill => {
		const line = skillEffect.split('\n').find(l => l.startsWith(`SkillEffect[SK.${skill}] =`));
		expect(line).toContain('releaseEffectId: 93');
		expect(line).toContain('hitEffectId: 94');
		expect(line).not.toMatch(/\beffectId: 93|beforeHitEffectId/);
	});

	it('flies the ball for 20 ticks (1/3 s)', () => {
		const durations = [...entry(93).matchAll(/duration: (\d+)/g)].map(m => Number(m[1]));
		expect(durations).toEqual([333, 333]);
	});

	it('shows each hit flash for 10 ticks', () => {
		expect(entry(94)).toMatch(/thunder_pang\.bmp',\n\t\t\tduration: 167,/);
	});
});
