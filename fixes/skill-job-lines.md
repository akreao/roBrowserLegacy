Title: fix(SkillDescription): show only the character's job line in skill requirements

Before: a skill requirement that applies to one job only showed the job's raw id in front of it ("16Requirement: Seismic Weapon 1"), and the tooltip listed the lines of every job.

After: the tooltip shows only the line for the character's own job line, without the id, as the official client does. A Sage reads "Requirement: Seismic Weapon 1" in pink.

The line is picked the same way the skill tree picks its requirements: the nearest job in the character's lineage that has a line, aliases included. The lineage walk moves into `findLineageJob` in `SkillRequirements.js`, so both share it.

**Tests:** new `tests/ui/SkillDescription.jobLines.test.js`, which fails without the change. `npx vitest run`: all pass. ESLint and Prettier are clean.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01PAhEJtjNehjoQDZAu7js6M
