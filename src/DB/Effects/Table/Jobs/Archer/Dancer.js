/**
 * @module DB/Effects/Table/Jobs/Archer/Dancer
 *
 * The Archer line's Dancer effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

import SongEffects from 'Renderer/Effects/Songs.js';
import DB from 'DB/DBManager.js';
import Session from 'Engine/SessionStorage.js';
import ChatBox from 'UI/Components/ChatBox/ChatBox.js';

const ServiceEffects = SongEffects.ServiceEffects;
const HummingEffects = SongEffects.HummingEffects;
const ForgetEffects = SongEffects.ForgetEffects;
const FortuneEffects = SongEffects.FortuneEffects;

export default {
	291: [
		{
			//EF_BOTTOM_HUMMING	Humming Map Unit
			wav: 'effect/\xc8\xef\xbe\xf3\xb0\xc5\xb8\xb2', //Čďľó°Ĺ¸˛
			attachedEntity: true
		}
	],

	'291_ground': [
		{
			// Humming
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				const self = this;
				HummingEffects.forEach(function (effect) {
					self.add(new effect(Params.Inst.position, Params.Inst.startTick), Params);
				});
			}
		}
	],

	292: [
		{
			//EF_BOTTOM_DONTFORGETME	Please don't Forget Me Map Unit
			wav: 'effect/\xb3\xaa\xb8\xa6\xc0\xd8\xc1\xf6\xb8\xbb\xbe\xc6\xbf\xe4', //łŞ¸¦ŔŘÁö¸»ľĆżä
			attachedEntity: true
		}
	],

	'292_ground': [
		{
			// Dont forget
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				const self = this;
				ForgetEffects.forEach(function (effect) {
					self.add(new effect(Params.Inst.position, Params.Inst.startTick), Params);
				});
			}
		}
	],

	293: [
		{
			//EF_BOTTOM_FORTUNEKISS	Fortune's Kiss Map Unit
			wav: 'effect/\xc7\xe0\xbf\xee\xc0\xc7', //ÇŕżîŔÇ
			attachedEntity: true
		}
	],

	'293_ground': [
		{
			// Fortune kiss /ladyluck
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				const self = this;
				FortuneEffects.forEach(function (effect) {
					self.add(new effect(Params.Inst.position, Params.Inst.startTick), Params);
				});
			}
		}
	],

	294: [
		{
			//EF_BOTTOM_SERVICEFORYOU	Service For You Map Unit
			wav: 'effect/\xb4\xe7\xbd\xc5\xc0\xbb\x20\xc0\xa7\xc7\xd1\x20\xbc\xad\xba\xf1\xbd\xba', //´ç˝ĹŔ» Ŕ§ÇŃ Ľ­şń˝ş
			attachedEntity: true
		}
	],

	'294_ground': [
		{
			// Service
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				const self = this;
				ServiceEffects.forEach(function (effect) {
					self.add(new effect(Params.Inst.position, Params.Inst.startTick), Params);
				});
			}
		}
	],

	296: [
		{
			//EF_TALK_SCREAM	   Scream
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				if (Params.Init.ownerAID == Session.Entity.GID) {
					const msg = DB.getRandomScream();
					if (msg) {
						ChatBox.onRequestTalk('', msg, ChatBox.TYPE.PUBLIC);
					}
				}
			}
		}
	],

	607: [
		{
			//EF_WINK	   Wink of Charm (Visual Effect)
			type: 'SPR',
			file: 'wink'
		}
	]
};
