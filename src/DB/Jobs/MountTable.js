/**
 * DB/Jobs/MountTable.js
 *
 * Look up table <job> => <job mount>
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */

import JobId from './JobConst.js';

const MountTable = {};

// MountTable[<Base job>]       = <Mount job>

MountTable[JobId.KNIGHT] = JobId.KNIGHT2;
MountTable[JobId.KNIGHT_H] = JobId.KNIGHT2_H;
MountTable[JobId.KNIGHT_B] = JobId.KNIGHT2_B;

MountTable[JobId.CRUSADER] = JobId.CRUSADER2;
MountTable[JobId.CRUSADER_H] = JobId.CRUSADER2_H;
MountTable[JobId.CRUSADER_B] = JobId.CRUSADER2_B;
MountTable[JobId.CRUSADER_2ND] = JobId.CRUSADER2_2ND;

MountTable[JobId.RUNE_KNIGHT] = JobId.RUNE_KNIGHT2;
MountTable[JobId.RUNE_KNIGHT_H] = JobId.RUNE_KNIGHT2_H;
MountTable[JobId.RUNE_KNIGHT_B] = JobId.RUNE_KNIGHT2_B;
MountTable[JobId.RUNE_KNIGHT_2ND] = JobId.RUNE_KNIGHT2_2ND;

MountTable[JobId.ROYAL_GUARD] = JobId.ROYAL_GUARD2;
MountTable[JobId.ROYAL_GUARD_H] = JobId.ROYAL_GUARD2_H;
MountTable[JobId.ROYAL_GUARD_B] = JobId.ROYAL_GUARD2_B;
MountTable[JobId.ROYAL_GUARD_2ND] = JobId.ROYAL_GUARD2_2ND;

MountTable[JobId.RANGER] = JobId.RANGER2;
MountTable[JobId.RANGER_H] = JobId.RANGER2_H;
MountTable[JobId.RANGER_B] = JobId.RANGER2_B;
MountTable[JobId.RANGER_2ND] = JobId.RANGER2_2ND;

MountTable[JobId.MECHANIC] = JobId.MECHANIC2;
MountTable[JobId.MECHANIC_H] = JobId.MECHANIC2_H;
MountTable[JobId.MECHANIC_B] = JobId.MECHANIC2_B;
MountTable[JobId.MECHANIC_2ND] = JobId.MECHANIC2_2ND;

// Star Gladiator Union (SG_FUSION): with the flying option (0x8000) the official client
// draws the flying body (kRO 2025-07-16, 0xc43b10: 4047 -> 4048, 4226 -> 4238, 4302 -> 4316).
// EntityState switches to it on EffectState.FLYING, not on the riding bits.
MountTable[JobId.STAR] = JobId.STAR2;
MountTable[JobId.STAR_B] = JobId.STAR2_B;
MountTable[JobId.SKY_EMPEROR] = JobId.SKY_EMPEROR2;

// 4th job
MountTable[JobId.WINDHAWK] = JobId.WINDHAWK2;
MountTable[JobId.MEISTER] = JobId.MEISTER2;
MountTable[JobId.DRAGON_KNIGHT] = JobId.DRAGON_KNIGHT2;
MountTable[JobId.IMPERIAL_GUARD] = JobId.IMPERIAL_GUARD2;

export default MountTable;
