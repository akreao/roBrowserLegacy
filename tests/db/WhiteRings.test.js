import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { effectTableSource } from '../helpers/effectTableSource.js';

// The official client's white cast rings: 911 (EF_GREENCASTING, the cast-aura
// ring in green) and 2369 (its colour-cycling twin, primitive 139)
// (effect-port/white-rings.md).
//
// Read as text: the tables import the renderer, which does not load without a canvas.
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const effectTable = effectTableSource().replace(/\r\n/g, '\n');
const skillEffect = read('DB/Skills/SkillEffect.js');

const { CYCLE_MODES, CYCLE_TICKS, ringFrames, ringTint, modeTint, createRing, stepRing } = await import(
	'Renderer/Effects/CastRingSim.js'
);

function entry(id) {
	const start = effectTable.indexOf(`\n\t${id}: [`);
	expect(start, `${id} is defined`).toBeGreaterThan(-1);
	return effectTable.slice(start, effectTable.indexOf('\n\t],', start)).replace(/\s+/g, ' ');
}

function run(ring, ticks) {
	for (let i = 0; i < ticks; i++) {
		stepRing(ring);
	}
	return ring;
}

describe('white cast rings (911, 2369)', () => {
	it('builds both rings in ring_white.tga, with the begin-spell sound, for the cast', () => {
		for (const [id, args] of [
			[911, "'ring_white.tga', [15, 15] )"],
			[2369, "'ring_white.tga', [0, 0], true )"]
		]) {
			const e = entry(id);
			expect(e).toContain("type: 'FUNC'");
			expect(e).toContain('castLoop: true');
			expect(e).toContain("wav: 'effect/ef_beginspell'");
			expect(e).toContain(
				`new CastRing( Params.Init.ownerEntity.position, Params.Inst.startTick, Params.Init.duration, ${args}`
			);
		}
		// at least 56 ticks
		expect(ringFrames(500)).toBe(56);
	});

	it('wires the client\'s skills', () => {
		for (const [skill, id] of [
			['HN_BREAKINGLIMIT', 2369],
			['HN_RULEBREAK', 2369],
			['SOA_TALISMAN_OF_FOUR_BEARING_GOD', 2369],
			['SOA_TOTEM_OF_TUTELARY', 911]
		]) {
			expect(skillEffect).toMatch(new RegExp(`^SkillEffect\\[SK\\.${skill}\\] = \\{[^}]*castAuraEffectId: ${id} \\}`, 'm'));
		}
	});

	it('911 is green and additive', () => {
		expect(ringTint(15)).toEqual({ color: [100, 255, 100], additive: true });
		expect(createRing(45, 15, 120).bands.map(b => b.length)).toEqual([20, 19, 18, 17]);
	});

	it('2369 starts blue and steps blue, red, green, pale yellow every 25 ticks', () => {
		expect(CYCLE_MODES).toEqual([4, 6, 7, 8]);
		expect(CYCLE_TICKS).toBe(25);
		expect(modeTint(4)).toEqual({ color: [100, 100, 255], additive: true });
		expect(modeTint(6)).toEqual({ color: [255, 100, 100], additive: true });
		expect(modeTint(7)).toEqual({ color: [100, 255, 100], additive: true });
		expect(modeTint(8)).toEqual({ color: [255, 255, 170], additive: true });

		const ring = createRing(25, 0, 300, true);
		expect(ring.mode).toBe(4);
		expect(ring.bands.map(b => b.alpha)).toEqual([160, 115, 70, 25]);
		const modes = [];
		for (let t = 1; t <= 200; t++) {
			stepRing(ring);
			modes.push(ring.mode);
		}
		expect(modes[23]).toBe(4); // tick 24
		expect(modes[24]).toBe(6); // tick 25
		expect(modes[49]).toBe(7);
		expect(modes[74]).toBe(8);
		expect(modes[98]).toBe(8);
		expect(modes[99]).toBe(4); // tick 100
		expect(modes[124]).toBe(6);
	});

	it('2369 moves exactly like the plain ring', () => {
		const plain = run(createRing(45, 0, 200), 150);
		const cycling = run(createRing(45, 0, 200, true), 150);
		expect(cycling.bands).toEqual(plain.bands);
		// The plain ring keeps its argument's mode
		expect(plain.mode).toBe(5);
	});

	it('short casts: late bands set the colour too as their counters pass a step', () => {
		const ring = createRing(45, 0, 56, true);
		expect(ring.bands.map(b => b.counter)).toEqual([0, -5, -10, -15]);
		run(ring, 24);
		expect(ring.mode).toBe(4);
		run(ring, 1);
		expect(ring.mode).toBe(6);
		run(ring, 25);
		expect(ring.mode).toBe(7);
	});
});
