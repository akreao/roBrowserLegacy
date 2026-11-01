/**
 * @module DB/Effects/Table/Jobs/Archer/Bard
 *
 * The Archer line's Bard effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

import SongEffects from 'Renderer/Effects/Songs.js';
import DB from 'DB/DBManager.js';
import Session from 'Engine/SessionStorage.js';
import ChatBox from 'UI/Components/ChatBox/ChatBox.js';

const getBragiSpellNote = SongEffects.getBragiSpellNote;
const WhistleEffects = SongEffects.WhistleEffects;
const SinEffects = SongEffects.SinEffects;
const AppleEffects = SongEffects.AppleEffects;

export default {
	286: [
		{
			//EF_BOTTOM_WHISTLE	A Wistle Map Unit
			wav: 'effect/\xb4\xde\xba\xfb\xbc\xbc\xb7\xb9\xb3\xaa\xb5\xa5', //´ŢşűĽĽ·ąłŞµĄ
			attachedEntity: true
		}
	],

	'286_ground': [
		{
			// A whistle
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				const self = this;
				WhistleEffects.forEach(function (effect) {
					self.add(new effect(Params.Inst.position, Params.Inst.startTick), Params);
				});
			}
		}
	],

	287: [
		{
			//EF_BOTTOM_ASSASSINCROSS	Assassin Cross of Sunset Map Unit
			wav: 'effect/\xbc\xae\xbe\xe7\xc0\xc7\x20\xbe\xee\xbd\xd8\xbd\xc5', //Ľ®ľçŔÇ ľî˝Ř˝Ĺ
			attachedEntity: true
		}
	],

	'287_ground': [
		{
			// Assassin cross
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				const self = this;
				SinEffects.forEach(function (effect) {
					self.add(new effect(Params.Inst.position, Params.Inst.startTick), Params);
				});
			}
		}
	],

	288: [
		{
			//EF_BOTTOM_POEMBRAGI	A Poem of Bragi Map Unit
			wav: 'effect/\xba\xea\xb6\xf3\xb1\xe2\xc0\xc7\x20\xbd\xc3', //şę¶ó±âŔÇ ˝Ă
			attachedEntity: true
		}
	],

	'288_ground': [
		{
			// Bragi
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				const self = this;
				const bragiNoteEffect = getBragiSpellNote();
				self.add(new bragiNoteEffect(Params.Inst.position, Params.Inst.startTick, 2), Params);
			}
		}
	],

	289: [
		{
			//EF_BOTTOM_APPLEIDUN	The Apple Of Idun Map Unit
			wav: 'effect/\xc0\xcc\xb5\xd0\xc0\xc7\x20\xbb\xe7\xb0\xfa',
			//ISO-8859-1:	ÀÌµÐÀÇ »ç°ú
			//Windows 1250: ŔĚµĐŔÇ »ç°ú
			//EUC-KR:		 이둔의 사과
			//Hex:			 \xc0\xcc\xb5\xd0\xc0\xc7\x20\xbb\xe7\xb0\xfa
			//reference for finding encoding
			attachedEntity: true
		}
	],

	'289_ground': [
		{
			// Apple
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				const self = this;
				AppleEffects.forEach(function (effect) {
					self.add(new effect(Params.Inst.position, Params.Inst.startTick), Params);
				});
			}
		}
	],

	295: [
		{
			//EF_TALK_FROSTJOKE	   Frost Joke
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				if (Params.Init.ownerAID == Session.Entity.GID) {
					const msg = DB.getRandomJoke();
					if (msg) {
						ChatBox.onRequestTalk('', msg, ChatBox.TYPE.PUBLIC);
					}
				}
			}
		}
	],

	//605: [{}],	//EF_NPC_STOP2_DEL	   (Nothing)

	606: [
		{
			//EF_FVOICE	   Pang Voice (Visual Effect)
			type: 'SPR',
			file: 'fvoice',
			wav: 'amon_ra_die01'
		}
	]
};
