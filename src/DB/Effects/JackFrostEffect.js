/**
 * DB/Effects/JackFrostEffect.js
 *
 * Jack Frost's ice shards as the official client (kRO 2025-07-16,
 * ZC_NOTIFY_SKILL case 0xd0825b) places them for each damage packet: a turn
 * step of (8 + r(5)) x 10 degrees, then three shards, shard i at i x step
 * degrees and 5 + r(10) units from the target, each one of 1443-1445 at
 * random (their mineffect copies 1540-1542 under /mineffect, through the rows'
 * `min`). They stand free where they start. Spec: effect-port/warlock-skills.md.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { UNITS_PER_CELL } from 'Renderer/Effects/EffectPrimSim.js';

const r = (random, k) => Math.floor(random() * k);

/**
 * The three shards of one damage packet.
 *
 * @param {function} [random] returns a number in [0, 1)
 * @return {Array<object>} { effectId, dx, dy } (cells)
 */
export function planJackFrostShards(random = Math.random) {
	const step = (8 + r(random, 5)) * 10;
	const shards = [];
	for (let i = 0; i < 3; i++) {
		const distance = 5 + r(random, 10);
		const angle = (i * step * Math.PI) / 180;
		shards.push({
			effectId: 1443 + r(random, 3),
			dx: (distance * Math.cos(angle)) / UNITS_PER_CELL,
			dy: (-distance * Math.sin(angle)) / UNITS_PER_CELL
		});
	}
	return shards;
}

/** EffectTable row: the shards round the target of a damage packet. */
export const jackFrostShardsEffect = [
	{
		type: 'FUNC',
		attachedEntity: false,
		func: function (Params) {
			const position = Params.Inst.position;
			if (!position) {
				return;
			}
			planJackFrostShards().forEach(shard => {
				this.spam({
					effectId: shard.effectId,
					position: [position[0] + shard.dx, position[1] + shard.dy, position[2]],
					startTick: Params.Inst.startTick
				});
			});
		}
	}
];
