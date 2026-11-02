/**
 * DB/Effects/GraffitiEffect.js
 *
 * Graffiti (Rogue's Scribble) skill unit 0xB0: the caster's text on the
 * ground, turned by the local player's facing when the unit appears, like the
 * official client (Renderer/Effects/Graffiti.js, GraffitiSim.js).
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import Session from 'Engine/SessionStorage.js';
import Graffiti from 'Renderer/Effects/Graffiti.js';
import { facingAngle } from 'Renderer/Effects/EffectPrimSim.js';

/** EffectTable row for the Graffiti unit; it lasts until the unit goes. */
export const graffitiEffect = [
	{
		type: 'FUNC',
		attachedEntity: false,
		func: function (Params) {
			const player = Session.Entity;
			const angle = facingAngle(player ? player.direction : 0);
			this.add(new Graffiti(Params.Inst.position, Params.Init.unitMessage, angle), Params);
		}
	}
];
