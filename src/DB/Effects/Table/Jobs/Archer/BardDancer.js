/**
 * @module DB/Effects/Table/Jobs/Archer/BardDancer
 *
 * The Archer line's BardDancer effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

import SongEffects from 'Renderer/Effects/Songs.js';

const LullabyEffects = SongEffects.LullabyEffects;
const MrKimEffects = SongEffects.MrKimEffects;
const EtChaosEffects = SongEffects.EtChaosEffects;
const DrumEffects = SongEffects.DrumEffects;
const NibelungEffects = SongEffects.NibelungEffects;
const LokiEffects = SongEffects.LokiEffects;
const AbyssEffects = SongEffects.AbyssEffects;
const SiegfiedEffects = SongEffects.SiegfiedEffects;

export default {
	278: [
		{
			//EF_BOTTOM_LULLABY	Lullaby Map Unit
			wav: 'effect/\xc0\xda\xc0\xe5\xb0\xa1', //ŔÚŔĺ°ˇ
			attachedEntity: true
		}
	],

	'278_ground': [
		{
			// Lullaby
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				const self = this;
				LullabyEffects.forEach(function (effect) {
					self.add(new effect(Params.Inst.position, Params.Inst.startTick), Params);
				});
			}
		}
	],

	279: [
		{
			//EF_BOTTOM_RICHMANKIM	Mr Kim a Rich Man Map Unit
			wav: 'effect/\xb1\xe8\xbc\xad\xb9\xe6\xb5\xb7', //±čĽ­ąćµ·
			attachedEntity: true
		}
	],

	'279_ground': [
		{
			// Mr Kim
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				const self = this;
				MrKimEffects.forEach(function (effect) {
					self.add(new effect(Params.Inst.position, Params.Inst.startTick), Params);
				});
			}
		}
	],

	280: [
		{
			//EF_BOTTOM_ETERNALCHAOS	Eternal Chaos Map Unit
			wav: 'effect/\xbf\xb5\xbf\xf8\xc0\xc7\x20\xc8\xa5\xb5\xb7', //żµżřŔÇ ČĄµ·
			attachedEntity: true
		}
	],

	'280_ground': [
		{
			// Chaos
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				const self = this;
				EtChaosEffects.forEach(function (effect) {
					self.add(new effect(Params.Inst.position, Params.Inst.startTick), Params);
				});
			}
		}
	],

	281: [
		{
			//EF_BOTTOM_DRUMBATTLEFIELD	A Drum on the Battlefield Map Unit
			wav: 'effect/\xc0\xfc\xc0\xe5\xc0\xc7', //ŔüŔĺŔÇ
			attachedEntity: true
		}
	],

	'281_ground': [
		{
			// Drum on battlefield
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				const self = this;
				DrumEffects.forEach(function (effect) {
					self.add(new effect(Params.Inst.position, Params.Inst.startTick), Params);
				});
			}
		}
	],

	282: [
		{
			//EF_BOTTOM_RINGNIBELUNGEN	The Ring Of Nibelungen Map Unit
			wav: 'effect/\xb4\xcf\xba\xa7\xb7\xee\xb0\xd5\xc0\xc7\x20\xb9\xdd\xc1\xf6', //´Ďş§·î°ŐŔÇ ąÝÁö
			attachedEntity: true
		}
	],

	'282_ground': [
		{
			// Ring nibelun
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				const self = this;
				NibelungEffects.forEach(function (effect) {
					self.add(new effect(Params.Inst.position, Params.Inst.startTick), Params);
				});
			}
		}
	],

	283: [
		{
			//EF_BOTTOM_ROKISWEIL	Loki's Veil Map Unit
			wav: 'effect/\xb7\xce\xc5\xb0', //·ÎĹ°
			attachedEntity: true
		}
	],

	'283_ground': [
		{
			// Loki Veil
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				const self = this;
				LokiEffects.forEach(function (effect) {
					self.add(new effect(Params.Inst.position, Params.Inst.startTick), Params);
				});
			}
		}
	],

	284: [
		{
			//EF_BOTTOM_INTOABYSS	Into the Abyss Map Unit
			wav: 'effect/\xbd\xc9\xbf\xac\xbc\xd3\xc0\xb8\xb7\xce', //˝Éż¬ĽÓŔ¸·Î
			attachedEntity: true
		}
	],

	'284_ground': [
		{
			// Into abyss
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				const self = this;
				AbyssEffects.forEach(function (effect) {
					self.add(new effect(Params.Inst.position, Params.Inst.startTick), Params);
				});
			}
		}
	],

	285: [
		{
			//EF_BOTTOM_SIEGFRIED	Invunerable Siegfriend Map Unit
			wav: 'effect/\xba\xd2\xbb\xe7\xbd\xc5', //şŇ»ç˝Ĺ
			attachedEntity: true
		}
	],

	'285_ground': [
		{
			// Invulnerable Sieg
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				const self = this;
				SiegfiedEffects.forEach(function (effect) {
					self.add(new effect(Params.Inst.position, Params.Inst.startTick), Params);
				});
			}
		}
	]
};
