import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
	STREAK,
	CONE,
	SOUNDS,
	createStreak,
	stepStreak,
	streakAlive,
	streakQuads,
	coneTicks
} from 'Renderer/Effects/BlitzBeatSim.js';
import { blitzBeatBand, blitzBeatEffect } from 'DB/Effects/BlitzBeatEffect.js';

// Blitz Beat (HT_BLITZBEAT, skill 129): the falcon flies to the target, and the
// hit map's 115 plays once per damage packet that lands (splash targets too),
// with no hit flash. 115 itself (kRO 2025-07-16, 0xba4960): 10 ac_center2
// streaks (primitive 16), one magic_green cone band (primitive 13) per hit from
// tick 36 every 3 ticks, hunter_blitzbeat_1st on tick 5 and hunter_blitzbeat on 30.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

/** Always the same draw. */
const fixed = v => () => v;

describe('Blitz Beat effects', () => {
	it('plays 115 once per damage packet, as its hit', () => {
		expect(source).toMatch(/SkillEffect\[SK\.HT_BLITZBEAT\] = \{ hitEffectId: 115, hitEffectOnce: true \};/);
	});

	it('plays its two sounds on ticks 5 and 30', () => {
		const wavs = blitzBeatEffect.filter(row => row.wav);
		expect(wavs.map(row => row.wav)).toEqual(['effect/hunter_blitzbeat_1st', 'effect/hunter_blitzbeat']);
		expect(wavs.map(row => Math.round(row.delayWav))).toEqual([83, 500]);
		expect(SOUNDS.map(s => s.tick)).toEqual([5, 30]);
	});
});

describe('Blitz Beat streaks', () => {
	it('start 15 units along the facing line, 7 up, 3.5 around the target', () => {
		const s = createStreak(fixed(0));
		expect(s.travel).toBe(15);
		expect(s.base[0]).toBeCloseTo(3.5);
		expect(s.base[1]).toBe(-7);
		expect(s.base[2]).toBeCloseTo(0);
		expect(s.length).toBe(2);
		expect(createStreak(fixed(0.999)).length).toBeCloseTo(5.9);
	});

	it('fly back faster for 10 ticks, then drift slowly', () => {
		const s = createStreak(fixed(0));
		stepStreak(s);
		expect(s.travel).toBeCloseTo(15 - 1.3);
		for (let i = 1; i < STREAK.changeTick; i++) {
			stepStreak(s);
		}
		// 1.3 + 1.4 + ... + 2.2
		expect(s.travel).toBeCloseTo(15 - 17.5);
		stepStreak(s);
		expect(s.travel).toBeCloseTo(15 - 17.5 - 0.299);
	});

	it('fade in over two ticks and out over the last two', () => {
		const s = createStreak(fixed(0));
		const alphas = [];
		for (let i = 0; i < STREAK.life; i++) {
			stepStreak(s);
			alphas.push(s.alpha);
		}
		expect(alphas.slice(0, 3)).toEqual([125, 250, 250]);
		expect(alphas.slice(-3)).toEqual([250, 125, 0]);
		expect(streakAlive(s)).toBe(true);
		stepStreak(s);
		expect(streakAlive(s)).toBe(false);
	});

	it('are two crossed quads, long along the facing line', () => {
		const s = createStreak(fixed(0));
		const [level, upright] = streakQuads(s, 0);
		// yaw 0: the facing line is the client's z
		expect(level[0]).toEqual([3.5 + 0.2, -7, 15 + 2].map(v => expect.closeTo(v, 5)));
		expect(level[2]).toEqual([3.5 - 0.2, -7, 15 - 2].map(v => expect.closeTo(v, 5)));
		expect(upright[0]).toEqual([3.5, -7 + 0.2, 15 + 2].map(v => expect.closeTo(v, 5)));
		const turned = streakQuads(s, 90)[0];
		// yaw 90: the facing line is the client's x
		expect(turned[0][0]).toBeCloseTo(3.5 + 15 + 2);
	});
});

describe('Blitz Beat cone bands', () => {
	it('start on tick 36, one every 3 ticks for each hit', () => {
		expect(coneTicks(1)).toEqual([36]);
		expect(coneTicks(5)).toEqual([36, 39, 42, 45, 48]);
		expect(coneTicks(undefined)).toEqual([36]);
	});

	it('are small magic_green bands laid level, turned by the target facing', () => {
		const band = blitzBeatBand(90, fixed(0));
		expect(band).toMatchObject({
			prim: 'cone',
			texture: 'magic_green',
			frames: CONE.life,
			yaw: 90,
			pitch: -90,
			offsetX: 0,
			height: 11,
			baseRadius: 0.5,
			topRadius: 1.5,
			coneHeight: 3.5,
			driftStart: 2,
			drift: 0.4,
			fadeOutFrame: 6
		});
		expect(blitzBeatBand(0, fixed(0.95))).toMatchObject({ offsetX: 2, height: 1 });
	});
});
