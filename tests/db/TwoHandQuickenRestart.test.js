import { describe, expect, it } from 'vitest';
import EffectTable from 'DB/Effects/EffectTable.js';

// Two-Hand Quicken (130): the official client removes a running 130 on the actor before it starts a new one.

describe('Two-Hand Quicken 130', () => {
	it('removes the running copy before the new one starts', () => {
		const removed = [];
		EffectTable[130][0].func.call({ remove: (...args) => removed.push(args) }, { Init: { ownerAID: 9 }, Inst: {} });
		expect(removed).toEqual([[null, 9, 130]]);
		expect(EffectTable[130][1]).toMatchObject({ type: 'STR', file: 'twohand', wav: 'effect/knight_twohandquicken' });
	});
});
