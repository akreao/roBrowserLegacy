/**
 * DB/Effects/RecognizedSpellEffect.js
 *
 * Recognized Spell's cast effect 803 (EF_RECOGNIZED) as the official client
 * (kRO 2025-07-16) plays it on the caster: ten Mage / Wizard skill icons
 * appearing above it, one every 30 ticks. Numbers in
 * Renderer/Effects/RecognizedSpellSim.js. Spread into EffectTable.js.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import DB from 'DB/DBManager.js';
import SK from 'DB/Skills/SkillConst.js';
import { PRIM_TICK_MS } from 'Renderer/Effects/EffectPrimSim.js';
import { ICONS, ICON_LIFE, planIcons, copyAt } from 'Renderer/Effects/RecognizedSpellSim.js';

/** Skill id to its constant name (the icon is named after it). */
let _names = null;

/**
 * The icon file of a skill, under data/texture/: 유저인터페이스/item/<name>.bmp.
 *
 * @param {number} skillId
 * @return {string|null}
 */
export function iconFile(skillId) {
	if (!_names) {
		_names = {};
		Object.keys(SK).forEach(name => {
			_names[SK[name]] = name;
		});
	}
	const name = _names[skillId];
	return name ? `${DB.INTERFACE_PATH.slice('data/texture/'.length)}item/${name.toLowerCase()}.bmp` : null;
}

/**
 * The 3D effect drawing copy j of an icon.
 *
 * @param {string} file icon file
 * @param {number} j 1-10
 * @return {object}
 */
export function iconCopyEffect(file, j) {
	return {
		type: '3D',
		file,
		sharedTexture: true,
		alphaMax: 1,
		blendMode: 8,
		attachedEntity: true,
		duration: ICON_LIFE * PRIM_TICK_MS,
		zIndex: 1,
		track(age) {
			const copy = copyAt(j, age);
			return copy && { x: 0, y: 0, z: copy.z, size: copy.size, angle: 0, alpha: copy.alpha / 255 };
		}
	};
}

export default {
	803: [
		{
			//EF_RECOGNIZED	   Recognized Spell cast: the icons, each from its own tick (its sound comes with the use packet)
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				let i = 0;
				planIcons().forEach(icon => {
					const file = iconFile(icon.skillId);
					if (!file) {
						return;
					}
					for (let j = 1; j <= ICONS.copies; j++) {
						this.spamEffect({
							effect: iconCopyEffect(file, j),
							Inst: {
								effectID: 803,
								duplicateID: i++,
								startTick: Params.Inst.startTick + icon.start * PRIM_TICK_MS
							},
							Init: Params.Init
						});
					}
				});
			}
		}
	]
};
