/**
 * @module DB/Effects/EffectTable
 *
 * List effects
 *
 * The rows live in DB/Effects/Table/, so changes to different effects land in different files:
 *   - Jobs/<first class>/<class>.js: the numbered rows only that class's skills use (by
 *     DB/Skills/SkillEffect.js) and its named ef_<skill prefix>_* rows, e.g. Jobs/Thief/AbyssChaser.js;
 *   - Common/EffectsNNNN.js: every other numbered row, 100 IDs a file (Effects0800.js holds 800 to 899),
 *     and Common/Named.js: the named rows of no single class.
 * Put a new row in its file and import what it uses there. A module holding one effect's rows is
 * spread at the end of its file; only modules whose rows span several files are spread here.
 *
 * @author Vincent Thibault
 */

import Common0000 from 'DB/Effects/Table/Common/Effects0000.js';
import Common0100 from 'DB/Effects/Table/Common/Effects0100.js';
import Common0200 from 'DB/Effects/Table/Common/Effects0200.js';
import Common0300 from 'DB/Effects/Table/Common/Effects0300.js';
import Common0400 from 'DB/Effects/Table/Common/Effects0400.js';
import Common0500 from 'DB/Effects/Table/Common/Effects0500.js';
import Common0600 from 'DB/Effects/Table/Common/Effects0600.js';
import Common0700 from 'DB/Effects/Table/Common/Effects0700.js';
import Common0800 from 'DB/Effects/Table/Common/Effects0800.js';
import Common0900 from 'DB/Effects/Table/Common/Effects0900.js';
import Common1000 from 'DB/Effects/Table/Common/Effects1000.js';
import Common1100 from 'DB/Effects/Table/Common/Effects1100.js';
import Common1200 from 'DB/Effects/Table/Common/Effects1200.js';
import Common1800 from 'DB/Effects/Table/Common/Effects1800.js';
import Common2300 from 'DB/Effects/Table/Common/Effects2300.js';
import CommonNamed from 'DB/Effects/Table/Common/Named.js';
import Acolyte from 'DB/Effects/Table/Jobs/Acolyte/Acolyte.js';
import ArchBishop from 'DB/Effects/Table/Jobs/Acolyte/ArchBishop.js';
import Cardinal from 'DB/Effects/Table/Jobs/Acolyte/Cardinal.js';
import Champion from 'DB/Effects/Table/Jobs/Acolyte/Champion.js';
import HighPriest from 'DB/Effects/Table/Jobs/Acolyte/HighPriest.js';
import Inquisitor from 'DB/Effects/Table/Jobs/Acolyte/Inquisitor.js';
import Monk from 'DB/Effects/Table/Jobs/Acolyte/Monk.js';
import Priest from 'DB/Effects/Table/Jobs/Acolyte/Priest.js';
import Sura from 'DB/Effects/Table/Jobs/Acolyte/Sura.js';
import Archer from 'DB/Effects/Table/Jobs/Archer/Archer.js';
import Bard from 'DB/Effects/Table/Jobs/Archer/Bard.js';
import BardDancer from 'DB/Effects/Table/Jobs/Archer/BardDancer.js';
import ClownGypsy from 'DB/Effects/Table/Jobs/Archer/ClownGypsy.js';
import Dancer from 'DB/Effects/Table/Jobs/Archer/Dancer.js';
import Hunter from 'DB/Effects/Table/Jobs/Archer/Hunter.js';
import MinstrelWanderer from 'DB/Effects/Table/Jobs/Archer/MinstrelWanderer.js';
import Ranger from 'DB/Effects/Table/Jobs/Archer/Ranger.js';
import Sniper from 'DB/Effects/Table/Jobs/Archer/Sniper.js';
import TroubadourTrouvere from 'DB/Effects/Table/Jobs/Archer/TroubadourTrouvere.js';
import Windhawk from 'DB/Effects/Table/Jobs/Archer/Windhawk.js';
import Gunslinger from 'DB/Effects/Table/Jobs/Gunslinger/Gunslinger.js';
import NightWatch from 'DB/Effects/Table/Jobs/Gunslinger/NightWatch.js';
import Rebellion from 'DB/Effects/Table/Jobs/Gunslinger/Rebellion.js';
import ArchMage from 'DB/Effects/Table/Jobs/Mage/ArchMage.js';
import ElementalMaster from 'DB/Effects/Table/Jobs/Mage/ElementalMaster.js';
import HighWizard from 'DB/Effects/Table/Jobs/Mage/HighWizard.js';
import Mage from 'DB/Effects/Table/Jobs/Mage/Mage.js';
import Professor from 'DB/Effects/Table/Jobs/Mage/Professor.js';
import Sage from 'DB/Effects/Table/Jobs/Mage/Sage.js';
import Sorcerer from 'DB/Effects/Table/Jobs/Mage/Sorcerer.js';
import Warlock from 'DB/Effects/Table/Jobs/Mage/Warlock.js';
import Wizard from 'DB/Effects/Table/Jobs/Mage/Wizard.js';
import Alchemist from 'DB/Effects/Table/Jobs/Merchant/Alchemist.js';
import Biolo from 'DB/Effects/Table/Jobs/Merchant/Biolo.js';
import Blacksmith from 'DB/Effects/Table/Jobs/Merchant/Blacksmith.js';
import Creator from 'DB/Effects/Table/Jobs/Merchant/Creator.js';
import Genetic from 'DB/Effects/Table/Jobs/Merchant/Genetic.js';
import Mechanic from 'DB/Effects/Table/Jobs/Merchant/Mechanic.js';
import Meister from 'DB/Effects/Table/Jobs/Merchant/Meister.js';
import Merchant from 'DB/Effects/Table/Jobs/Merchant/Merchant.js';
import Whitesmith from 'DB/Effects/Table/Jobs/Merchant/Whitesmith.js';
import KagerouOboro from 'DB/Effects/Table/Jobs/Ninja/KagerouOboro.js';
import Ninja from 'DB/Effects/Table/Jobs/Ninja/Ninja.js';
import ShinkiroShiranui from 'DB/Effects/Table/Jobs/Ninja/ShinkiroShiranui.js';
import HyperNovice from 'DB/Effects/Table/Jobs/Novice/HyperNovice.js';
import Novice from 'DB/Effects/Table/Jobs/Novice/Novice.js';
import SpiritHandler from 'DB/Effects/Table/Jobs/Summoner/SpiritHandler.js';
import Summoner from 'DB/Effects/Table/Jobs/Summoner/Summoner.js';
import Crusader from 'DB/Effects/Table/Jobs/Swordman/Crusader.js';
import DragonKnight from 'DB/Effects/Table/Jobs/Swordman/DragonKnight.js';
import ImperialGuard from 'DB/Effects/Table/Jobs/Swordman/ImperialGuard.js';
import Knight from 'DB/Effects/Table/Jobs/Swordman/Knight.js';
import LordKnight from 'DB/Effects/Table/Jobs/Swordman/LordKnight.js';
import Paladin from 'DB/Effects/Table/Jobs/Swordman/Paladin.js';
import RoyalGuard from 'DB/Effects/Table/Jobs/Swordman/RoyalGuard.js';
import RuneKnight from 'DB/Effects/Table/Jobs/Swordman/RuneKnight.js';
import Swordman from 'DB/Effects/Table/Jobs/Swordman/Swordman.js';
import SkyEmperor from 'DB/Effects/Table/Jobs/Taekwon/SkyEmperor.js';
import SoulAscetic from 'DB/Effects/Table/Jobs/Taekwon/SoulAscetic.js';
import SoulLinker from 'DB/Effects/Table/Jobs/Taekwon/SoulLinker.js';
import SoulReaper from 'DB/Effects/Table/Jobs/Taekwon/SoulReaper.js';
import StarEmperor from 'DB/Effects/Table/Jobs/Taekwon/StarEmperor.js';
import Taekwon from 'DB/Effects/Table/Jobs/Taekwon/Taekwon.js';
import AbyssChaser from 'DB/Effects/Table/Jobs/Thief/AbyssChaser.js';
import Assassin from 'DB/Effects/Table/Jobs/Thief/Assassin.js';
import AssassinCross from 'DB/Effects/Table/Jobs/Thief/AssassinCross.js';
import GuillotineCross from 'DB/Effects/Table/Jobs/Thief/GuillotineCross.js';
import Rogue from 'DB/Effects/Table/Jobs/Thief/Rogue.js';
import ShadowChaser from 'DB/Effects/Table/Jobs/Thief/ShadowChaser.js';
import ShadowCross from 'DB/Effects/Table/Jobs/Thief/ShadowCross.js';
import Stalker from 'DB/Effects/Table/Jobs/Thief/Stalker.js';
import Thief from 'DB/Effects/Table/Jobs/Thief/Thief.js';

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

	...Common0000,
	...Common0100,
	...Common0200,
	...Common0300,
	...Common0400,
	...Common0500,
	...Common0600,
	...Common0700,
	...Common0800,
	...Common0900,
	...Common1000,
	...Common1100,
	...Common1200,
	...Common1800,
	...Common2300,
	...CommonNamed,
	...Acolyte,
	...ArchBishop,
	...Cardinal,
	...Champion,
	...HighPriest,
	...Inquisitor,
	...Monk,
	...Priest,
	...Sura,
	...Archer,
	...Bard,
	...BardDancer,
	...ClownGypsy,
	...Dancer,
	...Hunter,
	...MinstrelWanderer,
	...Ranger,
	...Sniper,
	...TroubadourTrouvere,
	...Windhawk,
	...Gunslinger,
	...NightWatch,
	...Rebellion,
	...ArchMage,
	...ElementalMaster,
	...HighWizard,
	...Mage,
	...Professor,
	...Sage,
	...Sorcerer,
	...Warlock,
	...Wizard,
	...Alchemist,
	...Biolo,
	...Blacksmith,
	...Creator,
	...Genetic,
	...Mechanic,
	...Meister,
	...Merchant,
	...Whitesmith,
	...KagerouOboro,
	...Ninja,
	...ShinkiroShiranui,
	...HyperNovice,
	...Novice,
	...SpiritHandler,
	...Summoner,
	...Crusader,
	...DragonKnight,
	...ImperialGuard,
	...Knight,
	...LordKnight,
	...Paladin,
	...RoyalGuard,
	...RuneKnight,
	...Swordman,
	...SkyEmperor,
	...SoulAscetic,
	...SoulLinker,
	...SoulReaper,
	...StarEmperor,
	...Taekwon,
	...AbyssChaser,
	...Assassin,
	...AssassinCross,
	...GuillotineCross,
	...Rogue,
	...ShadowChaser,
	...ShadowCross,
	...Stalker,
	...Thief
};
