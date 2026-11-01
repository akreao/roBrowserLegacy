/**
 * @module DB/Effects/Table/Common/Effects0600
 *
 * Effects 0600 to 699 of the effect table that no single class's skills
 * use: shared rows, monsters, items, statuses. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep rows in effect ID order.
 */

import Camera from 'Renderer/Camera.js';
import SongEffects from 'Renderer/Effects/Songs.js';
import CloudWeatherEffect from 'Renderer/Effects/CloudWeatherEffect.js';
import SpiritSphere from 'Renderer/Effects/SpiritSphere.js';

const EvillandEffects = SongEffects.EvillandEffects;

export default {
	//601: [{}],	//EF_SIGHT2	   Sight Blaster
	//602: [{}],	//EF_QUAKEBODY4	   Close Confine (Grab Effect)

	603: [
		{
			//EF_FIREHIT2	Spinning fire ball (like 50, but smaller)
			type: 'STR',
			file: 'firehit%d',
			rand: [1, 3],
			attachedEntity: true
		}
	],

	608: [
		{
			//EF_COOKING_OK	Cooking Success
			type: 'STR',
			file: 'cook_suc',
			wav: '_heal_effect',
			attachedEntity: true
		}
	],

	609: [
		{
			//EF_COOKING_FAIL	Cooking Failed
			type: 'STR',
			file: 'cook_fail',
			wav: 'caramel_die',
			attachedEntity: true
		}
	],

	//610: [{ file: 'effect/success.bmp' }],	//EF_TEMP_OK	   Success
	//611: [{ file: 'effect/failed.bmp' }],	//EF_TEMP_FAIL	   Failed

	612: [
		{
			//EF_HAPGYEOK	Korean Words and /no1 Emoticon
			type: 'SPR',
			file: '\xc7\xd5\xb0\xdd\x5f',
			attachedEntity: true
		},
		{
			type: 'STR',
			file: 'itempokjuk',
			wav: 'effect/itempokjuk',
			attachedEntity: true
		}
	],

	629: [
		{
			//EF_CHOOKGI3	   (Nothing) - Used for spirit spheres (gunslinger classes)
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const spiritNum = Params.Init.spiritNum || 0;
				const Spheres = new SpiritSphere(Params.Init.ownerEntity, spiritNum, true);
				this.add(Spheres, Params);
			}
		}
	],

	638: [
		{
			//EF_LIGHTNING_S	Ground Drift Grenade
			type: 'SPR',
			file: '\xb6\xf3\xc0\xcc\xc6\xae\xb4\xd7\xbd\xba\xc7\xc7\xbe\xee',
			attachedEntity: false
		}
	],

	639: [
		{
			//EF_BLIND_S	Ground Drift Grenade
			type: 'SPR',
			file: '\xba\xed\xb6\xf3\xc0\xce\xb5\xe5\xbd\xba\xc7\xc7\xbe\xee',
			attachedEntity: false
		}
	],

	640: [
		{
			//EF_POISON_S	Ground Drift Grenade
			type: 'SPR',
			file: '\xc6\xf7\xc0\xcc\xc1\xf0\xbd\xba\xc7\xc7\xbe\xee',
			attachedEntity: false
		}
	],

	641: [
		{
			//EF_FREEZING_S	Ground Drift Grenade
			type: 'SPR',
			file: '\xc7\xc1\xb8\xae\xc2\xa1\xbd\xba\xc7\xc7\xbe\xee',
			attachedEntity: false
		}
	],

	642: [
		{
			//EF_FLARE_S	Ground Drift Grenade
			type: 'SPR',
			file: '\xc7\xc3\xb7\xb9\xbe\xee\xbd\xba\xc7\xc7\xbe\xee',
			attachedEntity: false
		}
	],

	//650: [{}],	//EF_MAP_MAGICZONE	   Ice Cave Level 4 Circle
	//651: [{}],	//EF_MAP_MAGICZONE2	   Ice Cave Level 4 Big Circle
	//652: [{}],	//EF_DAMAGE1	   Like Regeneration Number but Red with a Sound
	//653: [{}],	//EF_DAMAGE1_2	   Like Regeneration Number but Red
	//654: [{}],	//EF_DAMAGE1_3	   Like Regeneration Number but Purple
	//655: [{}],	//EF_UNDEADBODY	   Mobs Skill (Change Undead Element)
	//656: [{}],	//EF_UNDEADBODY_DEL	   Last animation before Change Undead Element finish
	//657: [{}],	//EF_GREEN_NUMBER	   (Nothing)
	//658: [{}],	//EF_BLUE_NUMBER	   (Nothing)
	//659: [{}],	//EF_RED_NUMBER	   (Nothing)
	//660: [{}],	//EF_PURPLE_NUMBER	   (Nothing)
	//661: [{}],	//EF_BLACK_NUMBER	   (Nothing)
	//662: [{}],	//EF_WHITE_NUMBER	   (Nothing)
	//663: [{}],	//EF_YELLOW_NUMBER	   (Nothing)
	//664: [{}],	//EF_PINK_NUMBER	   (Nothing)
	//665: [{}],	//EF_BUBBLE_DROP	   Little Blue Ball Falling From the Sky

	666: [
		{
			//Earthquake	//EF_NPC_EARTHQUAKE	Earthquake
			type: 'SPR',
			file: '\xbe\xee\xbd\xba\xc4\xf9\xc0\xcc\xc5\xa9',
			wav: 'effect/earth_quake',
			attachedEntity: true
		},
		{
			type: 'FUNC',
			attachedEntity: true,
			duplicate: 3,
			timeBetweenDupli: 35,
			func: function (Params) {
				const start = Params.Inst.startTick;
				Camera.setQuake(start);
			}
		}
	],

	//667: [{}],	//EF_DA_SPACE	   (Nothing)

	668: [
		{
			//EF_DRAGONFEAR	Dragonfear
			type: 'STR',
			file: 'dragon_h',
			wav: 'effect/dragonfear',
			attachedEntity: true
		},
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const start = Params.Inst.startTick;
				Camera.setQuake(start);
			}
		}
	],

	669: [
		{
			//wide bleeding	//EF_BLEEDING	Wide Bleeding
			type: 'STR',
			file: 'wideb',
			wav: 'effect/wideb',
			attachedEntity: true
		}
	],

	670: [
		{
			//EF_WIDECONFUSE	Dragon fear (Visual Effect)
			type: 'STR',
			file: 'dfear',
			wav: 'effect/dragonfear',
			attachedEntity: true
		}
	],

	671: [
		{
			//EF_BOTTOM_RUNNER	   The Japan Earth Symbol (like 'Seven Wind Lv1', but on the ground)
			file: 'effect/hanmoon1.tga'
		}
	],

	672: [
		{
			//EF_BOTTOM_TRANSFER	   The Japan Wind Symbol (like 'Seven Wind Lv2', but on the ground)
			file: 'effect/hanmoon2.tga'
		}
	],

	//673: [{}],	//EF_CRYSTAL_BLUE	   Map turns Blue (like Soul Link)

	674: [
		{
			// evil land
			type: 'FUNC',
			attachedEntity: false,
			//file: 'status-curse',
			func: function (Params) {
				const self = this;
				EvillandEffects.forEach(function (effect) {
					self.add(new effect(Params.Inst.position, Params.Inst.startTick), Params);
				});
			}
		}
	],

	675: [
		{
			//EF_GUARD3	   Like Parrying/Kyrie Eleison barrier but Yellow with small Cross in every barrier piece
			wav: 'effect/kyrie_guard',
			attachedEntity: true
		}
	],

	677: [
		{
			//EF_CRITICALWOUND	Critical Wounds/Bleeding Attack
			type: 'STR',
			file: 'cwound',
			attachedEntity: true
		}
	],

	//678: [{}],	//EF_GREEN99_3	   White 99 Aura Bubbles
	//679: [{}],	//EF_GREEN99_5	   Green Aura (Middle)
	//680: [{}],	//EF_GREEN99_6	   Green Aura (Bottom)
	//681: [{}],	//EF_MAPSPHERE	   Dimensional Gorge Map Effect

	682: [
		{
			//EF_POK_LOVE	   I Love You Banner
			type: 'SPR',
			file: '\xc6\xf8\xc1\xd7\x5f\xb7\xaf\xba\xea',
			attachedEntity: true
		},
		{
			type: 'STR',
			file: 'itempokjuk',
			wav: 'effect/itempokjuk',
			attachedEntity: true
		}
	],
	683: [
		{
			//EF_POK_WHITE	   Happy White Day Banner
			type: 'SPR',
			file: '\xc6\xf8\xc1\xd7\x5f\xc8\x5f\xc0\xcc\xc6\xae\xb5\xa5\xc0\xcc',
			attachedEntity: true
		},
		{
			type: 'STR',
			file: 'itempokjuk',
			wav: 'effect/itempokjuk',
			attachedEntity: true
		}
	],
	684: [
		{
			//EF_POK_VALEN	   Happy Valentine Day Banner
			type: 'SPR',
			file: '\xc6\xf8\xc1\xd7\x5f\xb9\xdf\xb7\xbb\xc5\xb8\xc0\xce',
			attachedEntity: true
		},
		{
			type: 'STR',
			file: 'itempokjuk',
			wav: 'effect/itempokjuk',
			attachedEntity: true
		}
	],
	685: [
		{
			//EF_POK_BIRTH	   Happy Birthday Banner
			type: 'SPR',
			file: '\xc6\xf8\xc1\xd7\x5f\xbb\xfd\xc0\xcf',
			attachedEntity: true
		},
		{
			type: 'STR',
			file: 'itempokjuk',
			wav: 'effect/itempokjuk',
			attachedEntity: true
		}
	],
	686: [
		{
			//EF_POK_CHRISTMAS	   Merry Christmas Banner
			type: 'SPR',
			file: '\xc6\xf8\xc1\xd7\x5f\xc5\xa9\xb8\xae\xbd\xba\xb8\xb6\xbd\xba',
			attachedEntity: true
		},
		{
			type: 'STR',
			file: 'itempokjuk',
			wav: 'effect/itempokjuk',
			attachedEntity: true
		}
	],
	//687: [{}],	//EF_MAP_MAGICZONE3	   Cast Circle-Like effect 1
	//688: [{}],	//EF_MAP_MAGICZONE4	   Cast Circle-Like effect 2
	//689: [{}],	//EF_DUST	   Endless Tower Map Effect
	//690: [{}],	//EF_TORCH_RED	   Burning Flame (Red)
	//691: [{}],	//EF_TORCH_GREEN	   Burning Flame (Green)
	//692: [{}],	//EF_MAP_GHOST	   Unknown Aura Bubbles (Small ghosts)
	//693: [{}],	//EF_GLOW1	   Translucent yellow circle
	//694: [{}],	//EF_GLOW2	   Translucent green circle
	//695: [{}],	//EF_GLOW4	   Rotating green light
	//696: [{}],	//EF_TORCH_PURPLE	   The same of 690 and 691 but Blue/Purple

	697: [
		{
			//EF_CLOUD7	   (Night Clouds [Dark Blue])
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				CloudWeatherEffect.startOrRestart(Params);
			}
		}
	],

	698: [
		{
			//EF_CLOUD8	   (Sunset Clouds [Orange])
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				CloudWeatherEffect.startOrRestart(Params);
			}
		}
	],

	699: [
		{
			//EF_FLOWERLEAF	Fall of powder from the sky and raise of some leaf
			type: 'STR',
			file: 'flower_leaf',
			attachedEntity: true
		}
	]
};
