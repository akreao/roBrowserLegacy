import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
	FIELD_BAND_VERTICES,
	buildBand,
	createBand,
	pointHeight,
	stepBand
} from '../../src/Renderer/Effects/FieldBandSim.js';

// Volcano, Deluge and Violent Gale ground (effects 239-241): the official client's primitive 36,
// one breathing band of ring texture under every unit cell. Spec: effect-port/sage-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function run(band, ticks) {
	const seen = [];
	for (let t = 1; t <= ticks; t++) {
		stepBand(band);
		seen.push({ t, radius: band.radius, lean: band.lean, alpha: band.alpha });
	}
	return seen;
}

describe('Sage ground field bands', () => {
	it('starts at radius 2.6, lean 80, random angle and alpha 0-99', () => {
		const low = createBand(() => 0);
		const high = createBand(() => 0.999);
		expect(low).toMatchObject({ angle: 0, lean: 80, alpha: 0, age: 0 });
		expect(low.radius).toBeCloseTo(2.6, 5);
		expect(high).toMatchObject({ angle: 359, alpha: 99 });
	});

	it('fades out 2 a tick from its start alpha, then cycles about every 65 ticks', () => {
		const band = createBand(() => 0.5); // alpha 50
		const seen = run(band, 200);
		expect(seen[0]).toMatchObject({ lean: 79, alpha: 48 });
		// alpha reaches 0 on tick 25: a new cycle at radius 2.14, lean 74
		expect(seen[24]).toMatchObject({ lean: 74, alpha: 0 });
		expect(seen[24].radius).toBeCloseTo(2.14, 5);
		// fades in 20 a tick while the radius is under 2.5 (9 ticks), then loses 2 a tick
		expect(seen.slice(25, 35).map(s => s.alpha)).toEqual([20, 40, 60, 80, 100, 120, 140, 160, 180, 178]);
		// cut when the lean would pass under 10, then a new cycle
		const cuts = seen.filter(s => s.alpha === 0).map(s => s.t);
		expect(cuts).toEqual([25, 90, 155]);
		expect(seen[88]).toMatchObject({ lean: 10, alpha: 70 });
	});

	it('is 15 units tall, one side wobbling by 4.5', () => {
		const band = createBand(() => 0);
		band.age = 90;
		expect(pointHeight(band, 0)).toBeCloseTo(15, 6);
		expect(pointHeight(band, 10)).toBeCloseTo(19.5, 6);
		band.age = 270;
		expect(pointHeight(band, 10)).toBeCloseTo(10.5, 6);
	});

	it('builds 10 strips round the cell centre, closing the ring, U over the left half', () => {
		const band = createBand(() => 0);
		band.radius = 5; // one cell
		band.lean = 90;
		const v = new Float32Array(FIELD_BAND_VERTICES * 5);
		expect(buildBand(v, band, [10, 20, 0])).toBe(60);
		// first foot vertex: angle 0, one cell out along x
		expect([v[0], v[1] + 0, v[2], v[3], v[4]]).toEqual([11.5, 0, 20.5, 0, 1]);
		// standing straight up: the tip is 15 units (3 cells) above the foot
		expect(v[11]).toBeCloseTo(-3, 5);
		expect(Math.max(...Array.from({ length: 60 }, (_, i) => v[i * 5 + 3]))).toBeCloseTo(10 / 21, 6);
		// the last strip ends where the first began
		expect(v[(9 * 6 + 1) * 5]).toBeCloseTo(v[0], 5);
		expect(v[(9 * 6 + 1) * 5 + 2]).toBeCloseTo(v[2], 5);
	});

	const rows = { 239: 'ring_red.tga', 240: 'ring_blue.tga', 241: 'magic_green.tga' };
	for (const [id, texture] of Object.entries(rows)) {
		it(`${id} draws the band in ${texture}`, () => {
			const table = read('DB/Effects/EffectTable.js');
			const start = table.indexOf(`\n\t${id}: [`);
			const text = table.slice(start, table.indexOf('\n\t],', start));
			expect(text).toContain(`new FieldBand(Params.Inst.position, Params.Inst.startTick, '${texture}')`);
		});
	}
});
