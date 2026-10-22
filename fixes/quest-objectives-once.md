Title: fix(Quest): print each quest objective once when a quest is added

Before: accepting a hunting quest printed every objective line in the chat twice.

After: each objective is printed once. Kill progress still prints as before.

rAthena sends a new quest's objective counts twice: `ZC_HUNTING_QUEST_INFO` (0x8fe) right after the quest, then `ZC_UPDATE_MISSION_HUNT_EX` (0x9fa) from `quest_add`. Both reach `updateMissionHunt`, which printed a line for every objective each time. It now prints only when an objective's count or target changed.

**Tests:** new `tests/ui/Quest.missionHuntChat.test.js`, which fails without the change. `npx vitest run`: all pass. ESLint and Prettier are clean.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01PAhEJtjNehjoQDZAu7js6M
