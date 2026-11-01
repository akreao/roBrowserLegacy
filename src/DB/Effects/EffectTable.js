/**
 * @module DB/Effects/EffectTable
 *
 * List effects
 *
 * The rows live in DB/Effects/Table/: one file per 100 effect IDs (Effects0800.js holds 800 to 899)
 * and one per job for the named ef_<job>_* rows (ef_dk.js holds ef_dk_*), so changes to different
 * effects land in different files and parallel changes stop conflicting. Put a new row in its part,
 * in ID order, and import what it uses there. A module holding one effect's rows is spread at the
 * end of its part; only modules whose rows span several parts are spread here, after the parts.
 *
 * @author Vincent Thibault
 */

import Effects0000 from 'DB/Effects/Table/Effects0000.js';
import Effects0100 from 'DB/Effects/Table/Effects0100.js';
import Effects0200 from 'DB/Effects/Table/Effects0200.js';
import Effects0300 from 'DB/Effects/Table/Effects0300.js';
import Effects0400 from 'DB/Effects/Table/Effects0400.js';
import Effects0500 from 'DB/Effects/Table/Effects0500.js';
import Effects0600 from 'DB/Effects/Table/Effects0600.js';
import Effects0700 from 'DB/Effects/Table/Effects0700.js';
import Effects0800 from 'DB/Effects/Table/Effects0800.js';
import Effects0900 from 'DB/Effects/Table/Effects0900.js';
import Effects1000 from 'DB/Effects/Table/Effects1000.js';
import Effects1100 from 'DB/Effects/Table/Effects1100.js';
import Effects1200 from 'DB/Effects/Table/Effects1200.js';
import Effects1400 from 'DB/Effects/Table/Effects1400.js';
import Effects1500 from 'DB/Effects/Table/Effects1500.js';
import Effects1600 from 'DB/Effects/Table/Effects1600.js';
import Effects1700 from 'DB/Effects/Table/Effects1700.js';
import Effects1800 from 'DB/Effects/Table/Effects1800.js';
import Effects1900 from 'DB/Effects/Table/Effects1900.js';
import Effects2200 from 'DB/Effects/Table/Effects2200.js';
import Effects2300 from 'DB/Effects/Table/Effects2300.js';
import ef_abc from 'DB/Effects/Table/ef_abc.js';
import ef_ag from 'DB/Effects/Table/ef_ag.js';
import ef_bo from 'DB/Effects/Table/ef_bo.js';
import ef_cd from 'DB/Effects/Table/ef_cd.js';
import ef_dk from 'DB/Effects/Table/ef_dk.js';
import ef_druid from 'DB/Effects/Table/ef_druid.js';
import ef_em from 'DB/Effects/Table/ef_em.js';
import ef_gc from 'DB/Effects/Table/ef_gc.js';
import ef_gn from 'DB/Effects/Table/ef_gn.js';
import ef_gs from 'DB/Effects/Table/ef_gs.js';
import ef_hn from 'DB/Effects/Table/ef_hn.js';
import ef_ig from 'DB/Effects/Table/ef_ig.js';
import ef_iq from 'DB/Effects/Table/ef_iq.js';
import ef_ko from 'DB/Effects/Table/ef_ko.js';
import ef_lg from 'DB/Effects/Table/ef_lg.js';
import ef_mt from 'DB/Effects/Table/ef_mt.js';
import ef_nc from 'DB/Effects/Table/ef_nc.js';
import ef_nw from 'DB/Effects/Table/ef_nw.js';
import ef_oldtrap from 'DB/Effects/Table/ef_oldtrap.js';
import ef_ra from 'DB/Effects/Table/ef_ra.js';
import ef_rk from 'DB/Effects/Table/ef_rk.js';
import ef_rl from 'DB/Effects/Table/ef_rl.js';
import ef_sh from 'DB/Effects/Table/ef_sh.js';
import ef_shc from 'DB/Effects/Table/ef_shc.js';
import ef_sj from 'DB/Effects/Table/ef_sj.js';
import ef_ske from 'DB/Effects/Table/ef_ske.js';
import ef_so from 'DB/Effects/Table/ef_so.js';
import ef_soa from 'DB/Effects/Table/ef_soa.js';
import ef_sp from 'DB/Effects/Table/ef_sp.js';
import ef_sr from 'DB/Effects/Table/ef_sr.js';
import ef_ss from 'DB/Effects/Table/ef_ss.js';
import ef_su from 'DB/Effects/Table/ef_su.js';
import ef_tr from 'DB/Effects/Table/ef_tr.js';
import ef_trap from 'DB/Effects/Table/ef_trap.js';
import ef_wh from 'DB/Effects/Table/ef_wh.js';
import ef_wl from 'DB/Effects/Table/ef_wl.js';
import ef_wm from 'DB/Effects/Table/ef_wm.js';
import LevelAuraEffects from 'DB/Effects/LevelAuraEffects.js';
import CostumeSpriteEffects from 'DB/Effects/CostumeSpriteEffects.js';
import BodyEffects from 'DB/Effects/BodyEffects.js';
import TaekwonBodyEffects from 'DB/Effects/TaekwonBodyEffects.js';
import GunslingerBodyEffects from 'DB/Effects/GunslingerBodyEffects.js';
import ChampionMonsterEffects from 'DB/Effects/ChampionMonsterEffects.js';
import SoulBodyEffects from 'DB/Effects/SoulBodyEffects.js';

export default {
	/// Common parameters
	///
	/// - duration:
	///   specifies the duration of the effect
	///
	/// - duplicate:
	///   the EffectManager duplicates the effect this many times
	///
	/// - timeBetweenDupli:
	///   if the duplicate param is specified, then the EffectManager waits for this long between duplicates
	///
	/// - wav:
	///   audio file stored in data/wav/ folder
	///
	/// - attachedEntity:
	///   if set to true, the effect will follow the entity attached

	/// type = STR
	///
	/// - file:
	///   STR file name stored in data/texture/effect/(.*).str
	///
	/// - min:
	///   minify str file stored in data/texture/effect/(.*).str
	///   used when /mineffect is enabled
	///
	/// - minTexturePath:
	///   texture path for the min file, when it sits in another folder
	///
	/// - minSkip:
	///   the part is not drawn when /mineffect is enabled
	///
	/// - rand
	///   replace the %d in the file name with a rand(val1, val2).
	///
	/// - texturePath:
	///   path to look for the textures
	///   instead of the regular data/texture/effect path

	/// type = SPR
	///
	/// - file:
	///   Sprite file name stored in data/sprite/AIANA®/(.*).spr
	///
	/// - head
	///   if set to true, the sprite will be at the character's head
	///
	/// - stopAtEnd
	///   do not remove when animation end
	///
	/// - direction
	///   if set to true, the sprite will inherit character's direction

	/// type = FUNC
	///
	/// - func:
	///   callback to use

	/// type = CYLINDER
	///
	/// - textureName:
	///   name of the targa texture stored in data/texture/effect/(.*).tga
	///
	/// - red, green, blue:
	///   overrides the color values of the texture (0.0 ~ 1.0)
	///
	/// - totalCircleSides:
	///   number of sides of the base "circle" of the cylinder
	///
	/// - circleSides:
	///   number of sides shown out of the totalCircleSides
	///
	/// - repeatTextureX:
	///   how many times the texture is repeated on the side of the cylinder (the whole 360 turn regardless of how many sides are actually visible)
	///   use it to fit the texture to sides or semi-circles
	///
	/// - rotate:
	///   if set to true, the cylinder will continously rotate around it's Y (vertical) axis before any other rotation is applied
	///
	/// - angleX, angleY, angleZ:
	///   rotates the cylinder on the X, Y, Z axis by the set amount of degrees (applied after rotate)
	///
	/// - rotateWithCamera
	///   if set to true the cylinder rotates with the camera on the final Y (vertical) axis after every other rotation is applied
	///
	/// - rotateToTarget
	///   if set to true the notrh side of the cylinder is rotated to face the target
	///
	/// - rotateWithSource
	///   if set to true the notrh side of the cylinder will be rotated to match the source's direction
	///
	/// - topSize:
	///   top radius of the circle
	///
	/// - bottomSize:
	///   bottom radius of the circle
	///
	/// - height:
	///   height of the cylinder
	///
	/// - posX, posY, posZ:
	///   offsets the cylinder's position on it's X, Y, Z axis
	///
	/// - fade:
	///   if set to true the cylinder will fade out at the end of the duration
	///
	/// - alphaMax:
	///   sets the opacity of the cylinder (0.0 ~ 1.0)
	///
	/// - animation:
	///   sets the animation type of the cylinder
	///	 - 1: the height of the cylinder grows to the set height from 0
	///	 - 2: top radius of the cylinder grows to the topSize value from 0
	///	 - 3: the radius of the whole cylinder shrinks to 0
	///	 - 4: the radius of the whole cylinder grows to the set topSize and bottomSize values from 0
	///	 - 5: the height of the cylinder grows to the set height value, and then shrinks back to 0
	///
	/// - blendMode:
	///   sets the webgl blendFunc target mode of the cylinder
	///	 - 1: ZERO
	///	 - 2: ONE (transparent light effect)
	///	 - 3: SRC_COLOR
	///	 - 4: ONE_MINUS_SRC_COLOR
	///	 - 5: DST_COLOR
	///	 - 6: ONE_MINUS_DST_COLOR
	///	 - 7: SRC_ALPHA
	///	 - 8: ONE_MINUS_SRC_ALPHA (default)
	///	 - 9: DST_ALPHA
	///	 - 10: ONE_MINUS_DST_ALPHA
	///	 - 11: CONSTANT_COLOR
	///	 - 12: ONE_MINUS_CONSTANT_COLOR
	///	 - 13: CONSTANT_ALPHA
	///	 - 14: ONE_MINUS_CONSTANT_ALPHA
	///	 - 15: SRC_ALPHA_SATURATE
	///   the webgl blendFunc source mode is always SRC_ALPHA
	///
	/// - repeat
	///   if set to true the effect will play repeatedly until removed

	/// type = 2D
	///
	/// - file:
	///   Texture file name stored in data/texture/(.*.bmp|tga)
	///
	/// - wav:
	///   audio file stored in data/wav/ folder
	///
	/// - red:
	///   if set to >0, overrides the red color of the texture
	///
	/// - green:
	///   if set to >0, overrides the green color of the texture
	///
	/// - blue:
	///   if set to >0, overrides the blue color of the texture
	///
	/// - alphaMax:
	///   sets the opacity of the texture (0.0 ~ 1.0)
	///
	/// - fadeIn:
	///   if set to true the texture will fade in at the beginning of the duration
	///
	/// - fadeOut:
	///   if set to true the texture will fade out at the end of the duration
	///
	/// - fadeIn:
	///   if set to true the texture will fade in at the beginning of the duration
	///
	/// - posx, posy, posz:
	///   sets the relative position of the texture
	///
	/// - posxStart, posyStart, poszStart, posxEnd, posyEnd, poszEnd:
	///   sets the relative starting and ending position of the texture
	///
	/// - posxRand, posyRand, poszRand:
	///   sets a +- range for a random relative position
	///
	/// - posxRandDiff, posyRandDiff, poszRandDiff:
	///   sets a +- range for a random relative starting and ending position. The start and end is 2 different random numbers in the same range.
	///
	/// - posxStartRand, posyStartRand, poszStartRand, posxEndRand, posyEndRand, poszEndRand:
	///   sets a +- range for a random relative starting and ending position
	///
	/// - posxSmooth, posySmooth, poszSmooth:
	///   smoohtes out the movement on an axis
	///
	/// - size, sizeX, sizeY, sizeStart, sizeEnd, sizeStartX, sizeStartY, sizeEndX, sizeEndY:
	/// - sizeRand, sizeRandx, sizeEndY:
	/// - sizeSmooth:
	///   works the same way as positions, but effects the size of the texture
	///
	/// - poszStartRandMiddle, poszEndRandMiddle:
	///   sets the relative middle position of the random range of the starting and ending Z position
	///
	/// - sizeRandXMiddle, sizeRandYMiddle:
	///   sets the middle value for the random range for the size X&Y values
	///
	/// - rotate:
	///   if set to true makes the texture rotate on it's y axis (turn around)
	///
	/// - angle:
	///   sets the starting angle of the texture in degrees (eg: 180=upside down)
	///
	/// - toAngle:
	///   sets the final angle of the texture in degrees (eg: 180=upside down)
	///
	/// - zIndex:
	///   sets the zindex of the texture (closer to the camera or farther)

	/// type = 3D
	///
	/// - file:
	///   Texture file name stored in data/texture/(.*.bmp|tga)
	///
	/// - fileList:
	///   An array of texture file name stored in data/texture/(.*.bmp|tga)
	///
	/// - frameDelay:
	///   For how many ticks (time) one texture is shown when using fileList. Used for "hand animated" effects that are created from multiple textures.
	///
	/// - delayStart:
	///   delays the visual start of this effect entry by the given number of
	///   milliseconds. Sound (wav) is NOT delayed — it plays at the original startTick.
	///
	/// - spriteName:
	///   Sprite file name stored in data/sprite/AIANA®/(.*).spr
	///
	/// - absoluteSpriteName:
	///   Sprite file name stored in the absolute path.spr
	///   eg: data/sprite/npc/skel_archer_arrow.spr
	///
	/// - playSprite:
	///   if set to true plays the sprite animation
	///
	/// - sprDelay:
	///   frame delay for a sprite animation
	///
	/// - wav:
	///   audio file stored in data/wav/ folder
	///
	/// - red:
	///   if set to >0, overrides the red color of the texture
	///
	/// - green:
	///   if set to >0, overrides the green color of the texture
	///
	/// - blue:
	///   if set to >0, overrides the blue color of the texture
	///
	/// - alphaMax:
	///   sets the opacity of the texture (0.0 ~ 1.0)
	///
	/// - alphaMaxDelta:
	///   when using duplicates, increase alpaMax value between duplicates by this amount
	///
	/// - fadeIn:
	///   if set to true the texture will fade in at the beginning of the duration
	///
	/// - fadeOut:
	///   if set to true the texture will fade out at the end of the duration
	///
	/// - fadeIn:
	///   if set to true the texture will fade in at the beginning of the duration
	///
	/// - posx, posy, posz:
	///   sets the relative position of the texture
	///
	/// - posxStart, posyStart, poszStart, posxEnd, posyEnd, poszEnd:
	///   sets the relative starting and ending position of the texture
	///
	/// - posxRand, posyRand, poszRand:
	///   sets a +- range for a random relative position
	///
	/// - posxRandDiff, posyRandDiff, poszRandDiff:
	///   sets a +- range for a random relative starting and ending position. The start and end is 2 different random numbers in the same range.
	///
	/// - posxStartRand, posyStartRand, poszStartRand, posxEndRand, posyEndRand, poszEndRand:
	///   sets a +- range for a random relative starting and ending position
	///
	/// - posxSmooth, posySmooth, poszSmooth:
	///   smoohtes out the movement on an axis
	///
	/// - size, sizeX, sizeY, sizeStart, sizeEnd, sizeStartX, sizeStartY, sizeEndX, sizeEndY:
	/// - sizeRand, sizeRandx, sizeEndY:
	/// - sizeSmooth:
	///   works the same way as positions, but effects the size of the texture
	///
	/// - sizeDelta
	///   when using duplicates, increase sizeDelta value between duplicates by this amount
	///
	/// - posxStartRandMiddle, posyStartRandMiddle, poszStartRandMiddle, posxEndRandMiddle, posyEndRandMiddle, poszEndRandMiddle:
	///   sets the relative middle position of the random range of the starting and ending
	///
	/// - sizeRandXMiddle, sizeRandYMiddle:
	///   sets the middle value for the random range for the size X&Y values
	///
	/// - zOffsetStart:
	///   initial Z offset when using fromSrc or toSrc
	///
	/// - zOffsetEnd:
	///   final Z offset when using fromSrc or toSrc
	///
	/// - arc:
	///   creates an arced trajectory using sine wave
	///   positive values create upward arc, negative values create downward arc
	///
	/// - retreat:
	///   makes projectile retreat backward before moving forward
	///   creates a "pull back" effect in the middle of the trajectory
	///
	/// - rotate:
	///   if set to true makes the texture rotate on it's y axis (turn around)
	///
	/// - rotatePosX, rotatePosY, rotatePosZ:
	///   offsets the rotation axis
	///
	/// - nbOfRotation:
	///   sets the number of rotations
	///
	/// - rotateLate:
	///   sets a delay before the rotation
	///
	/// - rotateLateDelta:
	///   when using duplicates, increase rotateLate value between duplicates by this amount
	///
	/// - rotationClockwise:
	///   if set to true then rotates clockwise
	///
	/// - angle:
	///   sets the starting angle of the texture in degrees (eg: 180=upside down)
	///
	/// - toAngle:
	///   sets the final angle of the texture in degrees (eg: 180=upside down)
	///
	/// - rotateToTarget:
	///   if set to true the upper side of the texture is rotated to face the target
	///
	/// - rotateWithCamera:
	///   if set to true the texture rotates if the camera is rotated makig it's sides always face the same coordinate in the 3D environment
	///
	/// - zIndex:
	///   sets the zindex of the texture (closer to the camera or farther)
	///
	/// - shadowTexture:
	///   if set to true then enables the shadow
	///
	/// - blendMode:
	///   sets the webgl blendFunc target mode of the cylinder
	///	 - 1: ZERO
	///	 - 2: ONE (transparent light effect)
	///	 - 3: SRC_COLOR
	///	 - 4: ONE_MINUS_SRC_COLOR
	///	 - 5: DST_COLOR
	///	 - 6: ONE_MINUS_DST_COLOR
	///	 - 7: SRC_ALPHA
	///	 - 8: ONE_MINUS_SRC_ALPHA (default)
	///	 - 9: DST_ALPHA
	///	 - 10: ONE_MINUS_DST_ALPHA
	///	 - 11: CONSTANT_COLOR
	///	 - 12: ONE_MINUS_CONSTANT_COLOR
	///	 - 13: CONSTANT_ALPHA
	///	 - 14: ONE_MINUS_CONSTANT_ALPHA
	///	 - 15: SRC_ALPHA_SATURATE
	///   the webgl blendFunc source mode is always SRC_ALPHA
	///
	/// - sparkling
	///   if set to true then makes the effect blink/sparkle
	///
	/// - sparkNumber
	///   sets how often the effect blinks/sparkles
	///
	/// - repeat
	///   if set to true the effect will play repeatedly until removed

	...Effects0000,
	...Effects0100,
	...Effects0200,
	...Effects0300,
	...Effects0400,
	...Effects0500,
	...Effects0600,
	...Effects0700,
	...Effects0800,
	...Effects0900,
	...Effects1000,
	...Effects1100,
	...Effects1200,
	...Effects1400,
	...Effects1500,
	...Effects1600,
	...Effects1700,
	...Effects1800,
	...Effects1900,
	...Effects2200,
	...Effects2300,
	...ef_abc,
	...ef_ag,
	...ef_bo,
	...ef_cd,
	...ef_dk,
	...ef_druid,
	...ef_em,
	...ef_gc,
	...ef_gn,
	...ef_gs,
	...ef_hn,
	...ef_ig,
	...ef_iq,
	...ef_ko,
	...ef_lg,
	...ef_mt,
	...ef_nc,
	...ef_nw,
	...ef_oldtrap,
	...ef_ra,
	...ef_rk,
	...ef_rl,
	...ef_sh,
	...ef_shc,
	...ef_sj,
	...ef_ske,
	...ef_so,
	...ef_soa,
	...ef_sp,
	...ef_sr,
	...ef_ss,
	...ef_su,
	...ef_tr,
	...ef_trap,
	...ef_wh,
	...ef_wl,
	...ef_wm,

	// The level auras past 99 and the coloured auras: LevelAuraEffects.js.
	...LevelAuraEffects,

	// The costume hat effects drawn as a sprite: CostumeSpriteEffects.js.
	...CostumeSpriteEffects,

	// The effects that change how their owner's body is drawn: BodyEffects.js.
	...BodyEffects,

	// The Taekwon body effects (press, spin, kick, quake, ready glow): TaekwonBodyEffects.js.
	...TaekwonBodyEffects,

	// The Gunslinger body glows (Fling, Madness Canceller, Adjustment, Gatling Fever): GunslingerBodyEffects.js.
	...GunslingerBodyEffects,

	// Champion monster looks (Furious 544, Elusive 620, Solid 679, Ringleader 1003): ChampionMonsterEffects.js.
	...ChampionMonsterEffects,

	// Soul Linker / Star Gladiator body looks (Kaite 419, Soul Link 424, Comfort 488, 542, 543): SoulBodyEffects.js.
	...SoulBodyEffects
};
