import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';
import MapPreferences from 'Preferences/Map.js';
import { glowColor } from 'Renderer/Effects/IceSpikes.js';
import { planJackFrostShards } from 'DB/Effects/JackFrostEffect.js';

// Jack Frost (WL_JACKFROST 2204): cast aura 1449 + 1446; use packet: jack_frost.wav (and ten 801s, not ported);
// hit-map effect 51 with the first hit, no hit flash.
// kRO 2025-07-16, spec: effect-port/warlock-skills.md.

describe('Jack Frost cast circle, sound and cold hit as the official client plays them', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.WL_JACKFROST]).toEqual({ castAuraEffectId: 1449, beginCastEffectId: 1446, successEffectIdOnCaster: 'ef_jackfrost', damageEffectIdOnTarget: 'ef_wl_jackfrost_shards', firstHitEffectId: 51 });
		expect(EffectTable.ef_jackfrost[0]).toMatchObject({ wav: 'jack_frost' });
	});

	it('puts three ice shards 5-14 units round the target of each damage packet', () => {
		for (let n = 0; n < 20; n++) {
			const shards = planJackFrostShards();
			expect(shards).toHaveLength(3);
			for (const s of shards) {
				expect([1443, 1444, 1445]).toContain(s.effectId);
				const d = Math.hypot(s.dx, s.dy) * 5;
				expect(d).toBeGreaterThanOrEqual(5 - 1e-9);
				expect(d).toBeLessThanOrEqual(14 + 1e-9);
			}
			// the first shard sits at 0 degrees (along the map's x)
			expect(Math.abs(shards[0].dy)).toBeLessThan(1e-9);
		}
		expect(EffectTable[1444][0]).toMatchObject({
			file: 'new_jackfrost/new_jackfrost/new_jackfrost_01',
			min: 'mineffect/new_jackfrost/new_jackfrost_ice/new_jackfrost_01',
			attachedEntity: false
		});
		const spammed = [];
		EffectTable.ef_wl_jackfrost_shards[0].func.call({ spam: p => spammed.push(p) }, { Inst: { position: [1, 1, 0], startTick: 2 }, Init: {} });
		expect(spammed).toHaveLength(3);
	});

	it('sends ten glowing Frost Diver paths 80 units out round the caster on success (801)', () => {
		const ring = EffectTable.ef_jackfrost[1];
		expect(ring.type).toBe('FUNC');
		const added = [];
		const params = { Init: { ownerEntity: { position: [10, 10, 0] } }, Inst: { startTick: 0 } };
		ring.func.call({ add: e => added.push(e) }, params);
		expect(added).toHaveLength(10);
		for (const spikes of added) {
			expect(spikes.glow).toBe(true);
			const last = spikes.spikes[spikes.spikes.length - 1];
			expect(Math.hypot(last.x, last.y)).toBeGreaterThan(75);
			expect(Math.hypot(last.x, last.y)).toBeLessThan(85);
		}
		MapPreferences.mineffect = true;
		try {
			added.length = 0;
			ring.func.call({ add: e => added.push(e) }, params);
			expect(added).toHaveLength(0);
		} finally {
			MapPreferences.mineffect = false;
		}
	});

	it('flickers a deep blue', () => {
		expect(glowColor(() => 0)).toEqual([40, 40, 255]);
		expect(glowColor(() => 0.99)).toEqual([50, 50, 255]);
	});
});
