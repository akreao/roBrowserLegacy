import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// The Druid wind skills as the kRO 2026-02-11 client plays them (effect-port
// druid-wind.md): placement rules in DruidWindSim.js, the mirror and tilt in
// StrEffect, and the skill rows.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

const { quadrant, raptorHit, lowFlight, hailShots, gustSpray, lowFlightDelay, GUST_REACH } = await import(
	'Renderer/Effects/DruidWindSim.js'
);

// A rand() that returns the given values in turn
const sequence = values => {
	let i = 0;
	return () => values[i++ % values.length];
};

describe('Druid wind placement', () => {
	it('splits the screen into quarters: below, left, above, right', () => {
		expect([90, 61, 120, 121, 240, 241, 300, 301, 0, 60].map(quadrant)).toEqual([0, 0, 0, 1, 1, 2, 2, 3, 3, 3]);
		expect(quadrant(-1)).toBe(-1);
	});

	it('turns a raptor hit to the attack, mirrored when left or above', () => {
		expect(raptorHit(30)).toEqual({ flipX: false, screenTurn: 30 });
		expect(raptorHit(90)).toEqual({ flipX: false, screenTurn: 90 });
		expect(raptorHit(180)).toEqual({ flipX: true, screenTurn: 0 });
		expect(raptorHit(270)).toEqual({ flipX: true, screenTurn: 90 });
	});

	it('picks Low Flight\'s art by quarter, mirrored to match', () => {
		expect(lowFlight(90)).toEqual({ art: 'vertical', flipX: false, flipY: true, screenTurn: 180 });
		expect(lowFlight(270)).toEqual({ art: 'vertical', flipX: false, flipY: false, screenTurn: 180 });
		expect(lowFlight(0)).toEqual({ art: 'horizontal', flipX: true, flipY: false, screenTurn: 0 });
		expect(lowFlight(180)).toEqual({ art: 'horizontal', flipX: false, flipY: false, screenTurn: 0 });
		expect(lowFlightDelay(8, 4)).toBe(512);
	});

	it('drops Sharpen Hail in five waves of five to seven shots', () => {
		// rand() always 7: seven shots a wave, each one step back and up
		const shots = hailShots(() => 7);
		expect(shots.length).toBe(35);
		expect(shots[0]).toEqual({ dx: -4, dy: -4, delay: 0 });
		expect(shots.map(s => s.delay).slice(0, 8)).toEqual([0, 29, 57, 86, 114, 143, 171, 200]);
		expect(Math.max(...shots.map(s => s.delay))).toBe(971);
		// rand() always 2: at least five a wave, forward and down
		const few = hailShots(() => 2);
		expect(few.length).toBe(25);
		expect(few[0]).toEqual({ dx: 8, dy: 8, delay: 0 });
	});

	it('sprays Sharpen Gust\'s attack_02 in a wedge ahead of the caster', () => {
		// every copy kept, no jitter, 50 ms, scale 1.0
		const copies = gustSpray([0, 0, 0], [100, 0, 0], sequence([0, 0, 50, 10]));
		expect(copies.length).toBe(9);
		expect(copies.map(c => c.delay)).toEqual([200, 325, 325, 325, 450, 450, 450, 450, 450]);
		expect(copies[0].x).toBeCloseTo(GUST_REACH / 3);
		expect(copies[8].x).toBeCloseTo(GUST_REACH);
		expect(copies[8].z).toBeCloseTo(15);
		expect(copies[4].z).toBeCloseTo(-15);
		expect(copies[0].scale).toBeCloseTo(1);
		// half are left out, the smallest is 0.7
		expect(gustSpray([0, 0, 0], [0, 0, 10], sequence([1])).length).toBe(0);
		expect(gustSpray([0, 0, 0], [0, 0, 10], sequence([0, 0, 0, 3]))[0].scale).toBeCloseTo(0.7);
	});
});

describe('StrEffect mirror and tilt', () => {
	const code = read('Renderer/Effects/StrEffect.js')
		.replace(/^import .*;$/gm, '')
		.replace('export default StrEffect;', 'this.StrEffect = StrEffect;');
	const context = vm.createContext({
		Float32Array,
		Math,
		Client: { loadFile: () => null },
		glMatrix: { mat4: { create: () => new Float32Array(16) } }
	});
	vm.runInContext(code, context);
	const layout = (props, pos) => {
		const str = Object.assign(new context.StrEffect('a.str', [0, 0, 0], 0, ''), props);
		const out = [0, 0];
		str.layout({ pos }, 1, out);
		return out.map(v => Math.round(v * 1e6) / 1e6 + 0);
	};

	it('mirrors the layout about the art\'s centre before turning it', () => {
		expect(layout({ ez2Offset: [0, 0], flipX: true }, [330, 230])).toEqual([-10, -10]);
		expect(layout({ ez2Offset: [0, 0], flipY: true }, [330, 230])).toEqual([10, 10]);
		// mirrored, then a quarter turn: left becomes down the screen
		expect(layout({ ez2Offset: [0, 0], flipX: true, aimAngle: 90 }, [330, 240])).toEqual([0, 10]);
	});

	it('tilts it back: up and down the screen shorten by cos(tilt)', () => {
		expect(layout({ ez2Offset: [0, 0], tilt: 60 }, [330, 220])).toEqual([10, -10]);
	});

	it('turns, mirrors and tilts the corners as the shader would', () => {
		const x = new Float32Array([10, -10, 10, -10]);
		const y = new Float32Array([0, 0, 0, 0]);
		context.transformCorners(0, 0, true, false, 0, x, y);
		expect([...x]).toEqual([-10, 10, -10, 10]);
		const x2 = new Float32Array([0, 0, 0, 0]);
		const y2 = new Float32Array([10, 10, 10, 10]);
		context.transformCorners(0, 0, false, false, 60, x2, y2);
		expect(y2[0]).toBeCloseTo(5);
		// the frame's own turn, then the aim: 90 clockwise then 90 counter-clockwise
		const x3 = new Float32Array([10, 0, 0, 0]);
		const y3 = new Float32Array([0, 0, 0, 0]);
		context.transformCorners(90, 90, false, false, 0, x3, y3);
		expect(x3[0]).toBeCloseTo(10);
		expect(y3[0]).toBeCloseTo(0);
	});
});

describe('Druid wind skill rows', () => {
	const skills = read('DB/Skills/SkillEffect.js');
	const table = read('DB/Effects/EffectTable.js');
	const row = name => {
		const start = skills.indexOf(`SkillEffect[SK.${name}] =`);
		expect(start, name).toBeGreaterThan(-1);
		return vm.runInNewContext(`(${skills.slice(skills.indexOf('{', start), skills.indexOf('};', start) + 1)})`);
	};
	const entry = id => {
		const start = table.indexOf(`\n\t${id}: [`);
		expect(start, id).toBeGreaterThan(-1);
		return vm.runInNewContext(table.slice(table.indexOf('[', start), table.indexOf('\n\t],', start) + 3));
	};

	it('plays each skill\'s art once, from the use packet', () => {
		expect({ ...row('DR_CUTTING_WIND') }).toEqual({
			castAuraEffectId: 'ef_druid_cast_circle_green',
			successEffectIdOnCasterAimed: 'ef_druid_cutting_wind',
			hitEffectId: 'ef_druid_cutting_wind_hit'
		});
		expect({ ...row('DR_WIND_BOMB') }).toEqual({
			castAuraEffectId: 'ef_druid_cast_circle_green',
			successEffectThrowAtTarget: 'ef_druid_wind_bomb_throw',
			successEffectId: 'ef_druid_wind_bomb',
			hitEffectId: 'ef_druid_wind_bomb_hit'
		});
		expect(row('DR_SHOOTING_FEATHER').successEffectIdOnCasterAimed).toBe('ef_druid_shooting_feather');
		expect(row('AT_PINION_SHOT').successEffectIdOnCasterAimed).toBe('ef_druid_pinion_shot');
		expect(row('KR_SHARPEN_GUST').successEffectIdOnCasterAimed).toBe('ef_druid_sharpen_gust');
		expect(row('KR_FEATHER_SPRINKLE').successEffectIdOnCaster).toBe('ef_druid_feather_sprinkle');
		expect(row('DR_FLICKING_TONADO').successEffectId).toBe('ef_druid_flicking_tonado');
		expect(row('AT_TEMPEST_FLAP').successEffectId).toBe('ef_druid_tempest_flap');
		expect({ ...row('DR_LOW_FLIGHT').successEffectIdOnTargetByAxis }).toEqual({
			vertical: 'ef_druid_low_flight_up',
			horizontal: 'ef_druid_low_flight',
			always: 'ef_druid_low_flight_bottom'
		});
		expect([...row('KR_SHARPEN_HAIL').successEffectHailScatter]).toEqual(['ef_druid_sharpen_hail_shot']);
		for (const name of ['DR_SHOOTING_FEATHER', 'AT_PINION_SHOT', 'KR_SHARPEN_GUST', 'KR_FEATHER_SPRINKLE', 'DR_LOW_FLIGHT', 'DR_FLICKING_TONADO', 'AT_TEMPEST_FLAP']) {
			const r = row(name);
			expect(r.effectId, name).toBeUndefined();
			expect(r.effectIdOnCaster, name).toBeUndefined();
		}
	});

	it('adds the client\'s raptor attack hit as each damage packet arrives', () => {
		expect(row('DR_SHOOTING_FEATHER').damageEffectIdOnTargetTurned).toBe('ef_druid_raptor_attack_00');
		for (const name of ['AT_PINION_SHOT', 'KR_SHARPEN_GUST', 'KR_FEATHER_SPRINKLE', 'KR_SHARPEN_HAIL']) {
			expect(row(name).damageEffectIdOnTargetTurned, name).toBe('ef_druid_raptor_attack_01');
			expect(row(name).hitEffectId, name).toBeUndefined();
		}
		expect(row('KR_SHARPEN_GUST').damageEffectGustSpray).toBe('ef_druid_raptor_attack_02');
		for (const name of ['DR_LOW_FLIGHT', 'DR_FLICKING_TONADO', 'AT_TEMPEST_FLAP']) {
			expect(row(name).hitEffectId, name).toBeUndefined();
		}
		expect(entry('ef_druid_raptor_attack_00')[0]).toMatchObject({ file: 'druid/wereraptor_attack/attack_00/attack_00', yOffset: 2, attachedEntity: true });
		expect(entry('ef_druid_raptor_attack_01')[0]).toMatchObject({ yOffset: 5, attachedEntity: true });
		expect(entry('ef_druid_raptor_attack_02')[0].yOffset).toBe(10);
		expect(entry('ef_druid_raptor_attack_02')[0].attachedEntity).toBeUndefined();
	});

	it('turns Cutting Wind half a circle past the aim and tilts Sharpen Gust back', () => {
		expect(entry('ef_druid_cutting_wind')[0].turnOffset).toBe(180);
		expect(entry('ef_druid_cutting_wind')[0].rotateToTarget).toBeUndefined();
		expect(entry('ef_druid_sharpen_gust').map(r => r.tilt)).toEqual([30, 30]);
	});

	it('throws Wind Bomb\'s tornado and starts its burst 300 ms later', () => {
		expect(entry('ef_druid_wind_bomb_throw')[0]).toMatchObject({ file: 'druid/dr_wind_bomb/wind_bomb_tornado/wind_bomb_tornado', arcThrow: true });
		expect(entry('ef_druid_wind_bomb')).toHaveLength(1);
		expect(entry('ef_druid_wind_bomb')[0]).toMatchObject({ delayStart: 304, delayWav: 304 });
	});

	it('keeps the EZ2 merge from adding shooting_feather_attack back', () => {
		expect([...row('DR_SHOOTING_FEATHER').ez2NotPlayed]).toEqual(['ef_druid_shooting_feather_hit']);
		expect(entry('ef_druid_shooting_feather_hit')[0].file).toBe('druid/dr_shooting_feather/shooting_feather_attack/shooting_feather_attack');
	});
});
