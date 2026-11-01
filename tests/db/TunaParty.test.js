import { describe, expect, it } from 'vitest';

// Tuna Party (status TUNAPARTY 919): CTunaPartyEffect 1097 in the official client
// (kRO 2025-07-16): su_tunaparty.spr circling the actor 10 units out, 10 up,
// 0.05 radians a tick.
const { default: EffectTable } = await import('DB/Effects/EffectTable.js');
const { default: StatusEffectTable } = await import('DB/Status/StatusEffectTable.js');
const { default: StatusConst } = await import('DB/Status/StatusConst.js');

describe('Tuna Party', () => {
	const row = EffectTable[1097][0];

	it('draws the tuna sprite, looping, for the effect life', () => {
		expect(row.type).toBe('3D');
		expect(row.absoluteSpriteName).toBe('data/sprite/\xc0\xcc\xc6\xd1\xc6\xae/su_tunaparty/su_tunaparty');
		expect(row.playSprite).toBe(true);
		expect(row.sprDelay).toBeCloseTo((8 * 1000) / 60);
		expect(row.attachedEntity).toBe(true);
	});

	it('circles 2 cells out and 2 up, 0.05 radians a tick', () => {
		const a = row.track(0);
		expect(Math.hypot(a.x, a.y)).toBeCloseTo(2);
		expect(a.z).toBe(2);
		expect(Math.atan2(a.y, a.x)).toBeCloseTo(0.05);
		const b = row.track(19);
		expect(Math.atan2(b.y, b.x)).toBeCloseTo(1);
	});

	it('is restarted with the status and removed when it ends', () => {
		expect(StatusEffectTable[StatusConst.TUNAPARTY]).toEqual({ restart: [1097], stop: [1097] });
	});
});
