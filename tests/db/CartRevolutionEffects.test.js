import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Cart Revolution (MC_CARTREVOLUTION, skill 153), as the official client plays it: effect 170 on
// the caster as each damage packet arrives, and 0 + 170 on each target once per damage packet
// when the hit lands. 170 is CartRevolution.str plus, on ticks 7 and 20, ef_magnumbreak.wav with
// a yellow ring and a fire sphere (20 ticks each). Spec: effect-port/merchant-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function effect170() {
	const table = read('DB/Effects/EffectTable.js');
	const start = table.indexOf('\n\t170: [');
	const text = table.slice(table.indexOf('[', start), table.indexOf('\n\t],', start) + 3);
	return vm.runInNewContext(`(${text})`);
}

const TICK = 1000 / 60;
const close = (a, b) => expect(Math.abs(a - b)).toBeLessThan(1e-6);

describe('Cart Revolution effects', () => {
	it('plays 170 on the caster per damage packet and 0 + 170 once on each hit', () => {
		expect(read('DB/Skills/SkillEffect.js')).toMatch(
			/SkillEffect\[SK\.MC_CARTREVOLUTION\] = \{ damageEffectIdOnCaster: 170, hitEffectId: \[0, 170\], hitEffectOnce: true \};/
		);
	});

	it('plays the STR without a sound of its own', () => {
		const str = effect170().filter(part => part.type === 'STR');
		expect(str).toHaveLength(1);
		expect(str[0].file).toBe('cartrevolution');
		expect(str[0].wav).toBeUndefined();
	});

	it('bursts a ring and a sphere, with the Magnum Break sound, on ticks 7 and 20', () => {
		const prims = effect170().filter(part => part.type === 'PRIM');
		expect(prims.map(p => p.prim)).toEqual(['ring', 'sphere', 'ring', 'sphere']);
		[7, 7, 20, 20].forEach((t, i) => close(prims[i].delayStart, t * TICK));
		const sounds = effect170().filter(part => part.wav);
		expect(sounds.map(s => s.wav)).toEqual(['effect/ef_magnumbreak', 'effect/ef_magnumbreak']);
		sounds.forEach((s, i) => close(s.delayWav, [7, 20][i] * TICK));
		prims.forEach(p => {
			expect(p.frames).toBe(20);
			expect(p.attachedEntity).toBe(false);
			expect(p.alpha).toBe(0);
			expect(p.fadeOutFrame).toBe(5);
		});
	});

	it('uses the client numbers for the ring and the sphere', () => {
		const [ring, sphere] = effect170().filter(part => part.type === 'PRIM');
		expect(ring.texture).toBe('ring_yellow');
		expect(ring.width).toBe(5);
		close(ring.radiusSpeed, 1.75);
		close(ring.radiusAccel, -(1.75 / 20) * 0.5);
		close(ring.alphaSpeed, 12);
		expect(ring.alphaMax).toBe(180);
		close(sphere.radiusSpeed, 1.35);
		close(sphere.radiusAccel, -(1.35 / 20) * 0.5);
		expect(sphere.spin).toBe(3);
		close(sphere.alphaSpeed, 240 / 7);
		expect(sphere.alphaMax).toBe(240);
	});
});
