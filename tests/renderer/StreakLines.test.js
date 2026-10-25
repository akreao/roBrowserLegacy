import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const {
	STREAK_FRAMES,
	STREAKS_PER_SET,
	TRACK_BACK,
	TRACK_LENGTH,
	STREAK_HEIGHT,
	SET_ORDER,
	ROUNDS,
	TINT_GREY,
	streakAngle,
	createStreak,
	createStreakSets,
	stepStreak,
	advanceStreaks,
	buildStreak
} = await import('Renderer/Effects/StreakLinesSim.js');

// Quill Spear's second part, as the official client draws it: effect 2442,
// eight sets of four streak lines (prim type 56). See
// effect-port/quill-spear-streaks.md.
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const low = () => 0;
const high = n => n - 1;

describe('streak lines (Quill Spear, effect 2442)', () => {
	it('builds two rounds of black and colour sets on both sides, four streaks each', () => {
		expect(STREAK_FRAMES).toBe(300);
		expect(ROUNDS).toBe(2);
		expect(STREAKS_PER_SET).toBe(4);
		expect(SET_ORDER).toEqual([
			{ texture: 'black', side: 1 },
			{ texture: 'black', side: -1 },
			{ texture: 'color', side: 1 },
			{ texture: 'color', side: -1 }
		]);
		const streaks = createStreakSets(low);
		expect(streaks.length).toBe(32);
		expect(streaks.slice(0, 4).every(s => s.texture === 'black' && s.offset > 0)).toBe(true);
		expect(streaks.slice(4, 8).every(s => s.texture === 'black' && s.offset < 0)).toBe(true);
		expect(streaks.slice(12, 16).every(s => s.texture === 'color' && s.offset < 0)).toBe(true);
		expect(streaks[16].texture).toBe('black');
	});

	it('draws each streak\'s numbers from the client\'s ranges', () => {
		expect(createStreak(1, low)).toEqual({
			age: 0,
			alpha: 0,
			halfWidth: 0.5,
			tint: 125,
			offset: 15,
			position: 0,
			length: 40,
			speed: 1
		});
		const top = createStreak(-1, high);
		expect(top.halfWidth).toBeCloseTo(1.0);
		expect(top.tint).toBe(127);
		expect(top.offset).toBe(-25);
		expect(top.position).toBe(199);
		expect(top.length).toBe(70);
		expect(top.speed).toBeCloseTo(2.0);
	});

	it('fades in 20 a tick to 200, holds, then fades 2 a tick to 0 on tick 120', () => {
		const s = createStreak(1, low);
		const alpha = [];
		for (let t = 1; t <= 130; t++) {
			stepStreak(s);
			alpha[t] = s.alpha;
		}
		expect(alpha[1]).toBe(20);
		expect(alpha[10]).toBe(200);
		expect(alpha[20]).toBe(200);
		expect(alpha[21]).toBe(198);
		expect(alpha[119]).toBe(2);
		expect(alpha[120]).toBe(0);
		expect(alpha[130]).toBe(0);
	});

	it('speeds up 0.05 a tick and starts again at the back of the 200 unit track', () => {
		const s = createStreak(1, low);
		stepStreak(s);
		expect(s.speed).toBeCloseTo(1.05);
		expect(s.position).toBeCloseTo(1.05);
		const f = createStreak(1, high);
		stepStreak(f);
		expect(f.position).toBeCloseTo(199 + 2.05 - TRACK_LENGTH);
	});

	it('never steps past the lifetime', () => {
		const streaks = createStreakSets(low);
		expect(advanceStreaks(streaks, 500)).toBe(true);
		expect(streaks.every(s => s.age === 300)).toBe(true);
		expect(advanceStreaks(streaks, 501)).toBe(false);
	});

	it('measures the direction in whole degrees like the client', () => {
		expect(streakAngle(1, 0)).toBe(0);
		expect(streakAngle(0, 1)).toBe(90);
		expect(streakAngle(-1, 0)).toBe(180);
		expect(streakAngle(0, -1)).toBe(270);
		expect(streakAngle(1, 1)).toBe(45);
		expect(streakAngle(1, -1)).toBe(315);
		// rounds up to the next whole degree
		expect(streakAngle(Math.cos(0.5), Math.sin(0.5))).toBe(29);
		expect(streakAngle(0, 0)).toBe(180);
	});

	it('lays a flat quad 6 units up, 100 units back along the line, beside it', () => {
		expect(TRACK_BACK).toBe(100);
		expect(STREAK_HEIGHT).toBe(6);
		const s = { ...createStreak(1, low), position: 150, length: 50, offset: 20, halfWidth: 1 };
		const out = new Float32Array(30);
		const center = [10, 20, 3];
		expect(buildStreak(out, 0, s, 0, center)).toBe(30);
		const v = i => Array.from(out.slice(i * 5, i * 5 + 5)).map(n => Math.round(n * 1000) / 1000);
		// angle 0: forward is +x, across (angle - 90) is -y; 5 units to a cell
		// front inner: along 100, across 19
		expect(v(0)).toEqual([10.5 + 20, -3 - 1.2, 20.5 - 3.8, 0, 1]);
		// back inner: along 50
		expect(v(1)).toEqual([10.5 + 10, -3 - 1.2, 20.5 - 3.8, 1, 1]);
		// back outer: across 21
		expect(v(2)).toEqual([10.5 + 10, -3 - 1.2, 20.5 - 4.2, 1, 0]);
		expect(v(3)).toEqual([10.5 + 20, -3 - 1.2, 20.5 - 4.2, 0, 0]);
	});

	it('tints white, 215 or 185 grey', () => {
		expect(TINT_GREY).toEqual({ 125: 255, 126: 215, 127: 185 });
	});

	it('plays from Quill Spear, on the caster, with the quill_spear_line textures', () => {
		const table = read('DB/Effects/EffectTable.js');
		const start = table.indexOf('\n\tef_druid_quill_spear_line: [');
		expect(start).toBeGreaterThan(-1);
		const row = table.slice(start, table.indexOf('\n\t],', start));
		expect(row).toContain("type: 'FUNC'");
		expect(row).toContain('new StreakLines(caster.position, target.position, Params.Inst.startTick');
		expect(row).toContain("black: 'druid/at_quill_spear/quill_spear_line/line_black.tga'");
		expect(row).toContain("color: 'druid/at_quill_spear/quill_spear_line/line_color.tga'");
		expect(row).toMatch(/if \(!caster \|\| !target/);
		const skills = read('DB/Skills/SkillEffect.js');
		for (const name of ['AT_QUILL_SPEAR', 'AT_QUILL_SPEAR_S']) {
			const line = skills.slice(skills.indexOf(`SkillEffect[SK.${name}] =`)).split('\n')[0];
			expect(line).toContain("successEffectIdOnCaster: 'ef_druid_quill_spear_line'");
		}
	});
});
