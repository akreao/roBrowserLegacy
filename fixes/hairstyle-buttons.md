Title: fix(CharCreate): paint every hairstyle list's buttons, not just the first

Before: on the V4 character creation screen, only the human male hairstyle list had button frames and showed the selected style. The female and Doram lists showed bare icons and never highlighted the chosen style.

After: every hairstyle list gets its buttons and the selection highlight.

The grid layout has four hairstyle lists, one per race and gender, each with its own `.style1`, `.style2`, … buttons. When the screen moved from jQuery to `querySelector`, `ui.find('.style' + n)` (every match) became `querySelector(...)` (the first match). It now uses `querySelectorAll`.

**Tests:** `npx vitest run`: all tests pass. ESLint and Prettier are clean on the changed file. No new test, because the screen has no DOM test harness.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01PAhEJtjNehjoQDZAu7js6M
