/**
 * @module DB/Effects/Table/Jobs/Mage/Mage
 *
 * The Mage line's Mage effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

import BoltRain from 'Renderer/Effects/BoltRain.js';
import IceSpikes from 'Renderer/Effects/IceSpikes.js';
import { planPath as planIcePath, PATH as ICE_PATH } from 'Renderer/Effects/IceSpikesSim.js';
import { soulStrikeEffect } from 'DB/Effects/SoulStrikeEffect.js';

export default {
	15: soulStrikeEffect,

	23: [
		{
			//EF_STONECURSE	Stone Curse
			type: 'STR',
			file: 'stonecurse',
			attachedEntity: true
		}
	],

	stonecurse_sound: [
		{
			// The sound the official client plays with Stone Curse's effect 23 (not part of 23 itself)
			wav: '_stonecurse',
			attachedEntity: true
		}
	],

	24: [
		{
			//EF_FIREBALL	Fire Ball, played on the caster: the official client throws four fireball sprites at the
			//target on ticks 20, 24, 28 and 32, each flying 20 ticks from 15 units up, each with its own sound.
			//The first is plain, the next three tinted (246, 199, 76) and fainter (alpha 180, 130, 80).
			type: '3D',
			spriteName: 'fireball',
			playSprite: true,
			attachedEntity: false,
			fromSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			zOffset: 3,
			delayStart: 333,
			duration: 333,
			alphaMax: 1,
			size: 130,
			zIndex: 1
		},
		{
			type: '3D',
			spriteName: 'fireball',
			playSprite: true,
			attachedEntity: false,
			fromSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			zOffset: 3,
			delayStart: 400,
			duration: 333,
			alphaMax: 180 / 255,
			red: 246 / 255,
			green: 199 / 255,
			blue: 76 / 255,
			size: 130,
			zIndex: 1
		},
		{
			type: '3D',
			spriteName: 'fireball',
			playSprite: true,
			attachedEntity: false,
			fromSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			zOffset: 3,
			delayStart: 467,
			duration: 333,
			alphaMax: 130 / 255,
			red: 246 / 255,
			green: 199 / 255,
			blue: 76 / 255,
			size: 130,
			zIndex: 1
		},
		{
			type: '3D',
			spriteName: 'fireball',
			playSprite: true,
			attachedEntity: false,
			fromSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			zOffset: 3,
			delayStart: 533,
			duration: 333,
			alphaMax: 80 / 255,
			red: 246 / 255,
			green: 199 / 255,
			blue: 76 / 255,
			size: 130,
			zIndex: 1
		},
		{
			wav: 'effect/ef_fireball',
			delayWav: 333
		},
		{
			wav: 'effect/ef_fireball',
			delayWav: 400
		},
		{
			wav: 'effect/ef_fireball',
			delayWav: 467
		},
		{
			wav: 'effect/ef_fireball',
			delayWav: 533
		}
	],

	25: [
		{
			//EF_FIREWALL	Fire Wall
			type: 'STR',
			file: 'firewall%d',
			rand: [1, 2],
			attachedEntity: false
		},
		{
			wav: 'effect/ef_firewall'
		}
	],

	26: [
		{
			//EF_ICEARROW	Cold Bolt, on the target: one ice bolt per hit, 10 ticks apart from tick 12,
			//each opening a ring_blue ring as it lands (BoltRainSim.js)
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				this.add(
					new BoltRain(Params.Init.ownerEntity.position, Params.Inst.startTick, Params.Init.hitCount, 'cold'),
					Params
				);
			}
		},
		{
			// One sound per cast, on tick 12
			wav: 'effect/ef_icearrow%d',
			rand: [1, 3],
			delayWav: 200,
			attachedEntity: true
		}
	],

	27: [
		{
			//EF_FROSTDIVER	Frost Diver, on the caster: one thin ice spike a tick along the line to the
			//target, pushing out of the ground (IceSpikesSim.js)
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const caster = Params.Init.ownerEntity;
				const target = Params.Init.otherEntity;
				if (!target) {
					return;
				}
				const at = [caster.position[0], caster.position[1], caster.position[2]];
				const spikes = planIcePath((target.position[0] - at[0]) * 5, (target.position[1] - at[1]) * 5);
				this.add(new IceSpikes(at, Params.Inst.startTick, spikes, ICE_PATH.life), Params);
			}
		}
	],

	29: [
		{
			//EF_LIGHTBOLT	Lightning Bolt (the official client plays Lightning.str only; the wind hit is 52)
			attachedEntity: true,
			duplicate: 1,
			file: 'lightning',
			type: 'STR'
		}
	],

	30: [
		{
			//EF_THUNDERSTORM	Thunder Storm
			type: 'STR',
			file: 'thunderstorm',
			wav: 'effect/magician_thunderstorm',
			attachedEntity: false
		}
	],

	31: [
		{
			//EF_FIREARROW	Fire Bolt, on the target: one fire bolt per hit, 10 ticks apart from tick 12,
			//each opening a ring_yellow ring as it lands, and a spark every 4 ticks from the newest
			//bolt (BoltRainSim.js)
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const target = Params.Init.ownerEntity;
				const spark = (s, startTick) => {
					// A particle4 sprite flying from the bolt back up its line, shrinking away
					const at = [target.position[0], target.position[1], target.position[2]];
					this.spamEffect({
						effect: {
							type: '3D',
							spriteName: 'particle4',
							playSprite: true,
							attachedEntity: false,
							duration: (s.life * 1000) / 60,
							posxStart: s.start.x / 5,
							posyStart: s.start.y / 5,
							poszStart: s.start.up / 5,
							posxEnd: s.end.x / 5,
							posyEnd: s.end.y / 5,
							poszEnd: s.end.up / 5,
							sizeStart: s.scale * 100,
							sizeEnd: 1,
							alphaMax: 1,
							fadeOut: true,
							zIndex: 1
						},
						Inst: { effectID: 31, duplicateID: 0, startTick },
						Init: Object.assign({}, Params.Init, { position: at })
					});
				};
				this.add(
					new BoltRain(
						target.position,
						Params.Inst.startTick,
						Params.Init.hitCount,
						'fire',
						Math.random,
						spark
					),
					Params
				);
			}
		},
		{
			// One sound per cast, on tick 12
			wav: 'effect/ef_firearrow%d',
			rand: [1, 3],
			delayWav: 200,
			attachedEntity: true
		}
	],
	//167: [{}],	//EF_TAMINGSUCCESS	   (Nothing)
	//168: [{}],	//EF_TAMINGFAILED	   (Nothing)

	169: [
		{
			//EF_ENERGYCOAT	Energy Coat Animation
			type: 'STR',
			file: 'energycoat',
			attachedEntity: true
		}
	]
};
