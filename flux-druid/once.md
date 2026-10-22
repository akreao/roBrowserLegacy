**Builds on the Druid aim PR (`fork/druid-effect-aim`). Merge that one first; until it does, this PR's diff also shows its two commits.**

Before: Druid skills draw each effect twice. Cutting Wind, for example, draws its blade at the caster and a second, leftward copy at the target. An aimed effect is also partly hidden by the ground and by the entity in front of it.

After: each Druid effect is drawn once, and an aimed effect is drawn whole.

kRO's `ez2streffect` table maps effects onto skills by name. For the Druid skills, which also have hand-written rows, that added a second copy of each.

How: the ez2streffect merge in `DBManager.js` now skips a file the skill already plays, so skills with no hand-written row keep everything the table gives them. An aimed effect stands at one entity and reaches the other, so StrEffect draws it without the depth test. `tests/db/Ez2EffectMerge.test.js` covers the merge.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01PAhEJtjNehjoQDZAu7js6M
