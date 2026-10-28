/**
 * DB/Effects/ThrowStoneEffect.js
 *
 * The official client's thrown items, thrown from the caster at the target's
 * position as the damage packet arrives, with three fainter copies trailing:
 *  - 308 (EF_THROWITEM3), Throw Stone's stone, in a low arc, spinning;
 *  - 613-616 (EF_THROWITEM7-10), the Ninja's shuriken, kunai, huuma and coin,
 *    bigger, faster, flat and spinning fast, tinted pink;
 *  - 600 (EF_THROWITEM6), Throw Venom Knife's knife, the Ninja's flight;
 *  - 298 (EF_THROWITEM), Acid Terror's green bottle, in a high arc, always
 *    25 ticks in flight.
 * Motion in Renderer/Effects/ThrownStoneSim.js. Specs: effect-port/thief-skills.md,
 * effect-port/ninja-skills.md, effect-port/assassin-skills.md, effect-port/alchemist-skills.md.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { PRIM_TICK_MS, UNITS_PER_CELL } from 'Renderer/Effects/EffectPrimSim.js';
import {
	ACID_BOTTLE,
	NINJA_ITEM,
	STONE,
	STONE_TEXTURE,
	VENOM_KNIFE,
	planThrow,
	stoneAt,
	trailAt
} from 'Renderer/Effects/ThrownStoneSim.js';

/** roBrowser 3D size units across one official unit (35 to a cell). */
const SIZE_PER_UNIT = 35 / UNITS_PER_CELL;

/** Item images under data/texture/유저인터페이스/item, and the coin under data/texture/effect. */
const ITEM = '\xc0\xaf\xc0\xfa\xc0\xce\xc5\xcd\xc6\xe4\xc0\xcc\xbd\xba/item/';
export const NINJA_TEXTURES = {
	613: ITEM + '\xbc\xf6\xb8\xae\xb0\xcb.bmp', // 수리검
	614: ITEM + '\xc4\xed\xb3\xaa\xc0\xcc_\xb5\xb6.bmp', // 쿠나이_독
	615: ITEM + '\xc7\xb3\xb8\xb6_\xbf\xad\xc8\xad.bmp', // 풍마_열화
	616: 'effect/coin_a.bmp'
};

/**
 * Last update the item shows: it stops after floor(1.05 n) updates, then fades 20 a tick.
 *
 * @param {object} t from planThrow
 * @return {number}
 */
export function lastStoneTick(t) {
	return Math.floor(t.kind.moveUntil * t.ticks) + Math.ceil(255 / t.kind.fade);
}

/**
 * The 3D effect drawing the item (copy -1) or trailing copy i.
 *
 * @param {object} t from planThrow, in units from the caster
 * @param {number} copy
 * @param {string} [file] texture (default: the kind's own, else the stone)
 * @return {object}
 */
export function stoneEffect(t, copy, file = t.kind.texture || STONE_TEXTURE) {
	const color = t.kind.color;
	return Object.assign(
		{
			type: '3D',
			file,
			alphaMax: 1,
			attachedEntity: false,
			duration: (lastStoneTick(t) + 1) * PRIM_TICK_MS,
			zIndex: 1,
			track(age) {
				const k = Math.floor(age);
				const p = copy < 0 ? stoneAt(t, k) : trailAt(t, copy, k);
				if (!p || p.alpha < 1) {
					return null;
				}
				return {
					x: p.x / UNITS_PER_CELL,
					y: p.y / UNITS_PER_CELL,
					z: p.up / UNITS_PER_CELL,
					size: 2 * t.kind.half * SIZE_PER_UNIT,
					alpha: p.alpha / 255,
					angle: p.angle
				};
			}
		},
		color && { red: color[0] / 255, green: color[1] / 255, blue: color[2] / 255 }
	);
}

/**
 * EffectTable row for a thrown item.
 *
 * @param {number} effectID
 * @param {string} file texture
 * @param {object} kind STONE or NINJA_ITEM
 * @return {Array}
 */
export function thrownItemRow(effectID, file, kind) {
	return [
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const caster = Params.Init.ownerEntity.position;
				const target = Params.Init.otherEntity && Params.Init.otherEntity.position;
				if (!target) {
					return;
				}
				const at = [caster[0], caster[1], caster[2]];
				const t = planThrow(
					[0, 0, 0],
					[0, 1, 2].map(i => (target[i] - caster[i]) * UNITS_PER_CELL),
					kind
				);
				[-1, 0, 1, 2].forEach((copy, i) => {
					this.spamEffect({
						effect: stoneEffect(t, copy, file),
						Inst: { effectID, duplicateID: i, startTick: Params.Inst.startTick },
						Init: Object.assign({}, Params.Init, { position: at })
					});
				});
			}
		}
	];
}

/** EffectTable row for 308. */
export const throwStoneEffect = thrownItemRow(308, STONE_TEXTURE, STONE);

/** EffectTable row for 600 (EF_THROWITEM6): Throw Venom Knife's knife. */
export const throwVenomKnifeEffect = thrownItemRow(600, VENOM_KNIFE.texture, VENOM_KNIFE);

/** EffectTable row for 298 (EF_THROWITEM): Acid Terror's bottle, no sound. */
export const acidTerrorEffect = thrownItemRow(298, ACID_BOTTLE.texture, ACID_BOTTLE);

/** EffectTable rows for 613-616 (Throw Shuriken, Kunai, Huuma, Zeny): no sound of their own. */
export const ninjaThrowEffects = Object.fromEntries(
	Object.keys(NINJA_TEXTURES).map(id => [id, thrownItemRow(Number(id), NINJA_TEXTURES[id], NINJA_ITEM)])
);
