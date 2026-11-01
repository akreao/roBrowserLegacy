/**
 * DB/Effects/TetraFireEffect.js
 *
 * What effect 804 (EF_TETRA) draws over the target: the tv-1..8 pillar and
 * the red lines. Numbers in Renderer/Effects/TetraFireSim.js, spec in
 * effect-port/warlock-skills.md. Used by the 804 row of EffectTable.js.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { PRIM_TICK_MS } from 'Renderer/Effects/EffectPrimSim.js';
import { PILLAR, LINES_END, pillarAt, planLines, lineAt } from 'Renderer/Effects/TetraFireSim.js';

/** The pillar's pictures and the lines' texture. */
export const PILLAR_TEXTURES = [1, 2, 3, 4, 5, 6, 7, 8].map(i => `effect/tv-${i}.bmp`);
export const LINE_TEXTURE = 'effect/ring_red.tga';

/** Ticks a pillar lasts. */
const PILLAR_LIFE = (() => {
	let n = 0;
	while (pillarAt(n)) {
		n++;
	}
	return n;
})();

/**
 * The 3D effect drawing one pillar. The client's blend argument for 804 asks
 * for normal alpha blending, which would show the black of the bmp; it is
 * drawn adding light, as the coloured variants (970-973) are.
 *
 * @return {object}
 */
export function pillarEffect() {
	return {
		type: '3D',
		fileList: PILLAR_TEXTURES,
		sharedTexture: true,
		alphaMax: 1,
		blendMode: 2,
		attachedEntity: false,
		duration: PILLAR_LIFE * PRIM_TICK_MS,
		zIndex: 1,
		track(age) {
			const p = pillarAt(age);
			return (
				p && {
					x: 0,
					y: 0,
					z: p.z,
					sizeX: p.width,
					sizeY: p.height,
					angle: 0,
					texture: p.picture,
					alpha: p.alpha / 255
				}
			);
		}
	};
}

/**
 * The 3D effect drawing one red line, from the effect's start.
 *
 * @param {object} line from planLines
 * @return {object}
 */
export function lineEffect(line) {
	return {
		type: '3D',
		file: LINE_TEXTURE,
		sharedTexture: true,
		alphaMax: 1,
		blendMode: 8,
		attachedEntity: false,
		duration: LINES_END * PRIM_TICK_MS,
		zIndex: 1,
		track(age) {
			const p = lineAt(line, age);
			return (
				p && {
					x: p.x,
					y: p.y,
					z: p.z,
					sizeX: p.width,
					sizeY: p.height,
					angle: 0,
					alpha: p.alpha / 255
				}
			);
		}
	};
}

/**
 * The FUNC row: the pillars and lines over the target, each part from its
 * own tick. Nothing shows without a known target.
 */
export const tetraFireLook = {
	type: 'FUNC',
	attachedEntity: false,
	func: function (Params) {
		if (!Params.Init.otherEntity) {
			return;
		}
		const at = Params.Init.otherEntity.position;
		const Init = { ...Params.Init, position: [at[0], at[1], at[2]] };
		const parts = PILLAR.ticks.map(tick => ({ effect: pillarEffect(), spawn: tick }));
		planLines().forEach(line => parts.push({ effect: lineEffect(line), spawn: 0 }));
		parts.forEach(({ effect, spawn }, i) => {
			this.spamEffect({
				effect,
				Inst: { effectID: 804, duplicateID: i, startTick: Params.Inst.startTick + spawn * PRIM_TICK_MS },
				Init
			});
		});
	}
};
