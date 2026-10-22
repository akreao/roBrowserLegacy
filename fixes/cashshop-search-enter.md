Title: fix(CashShop): Enter in the search box searches

Before: only the magnifier button started a Cash Shop search. Pressing Enter in the search box did nothing.

After: Enter searches too.

The chat box already leaves Enter alone while another window's text box has focus, so the key reaches the search box.

**Tests:** new `tests/ui/CashShop.search.test.js`, which fails without the change. `npx vitest run`: all pass. ESLint and Prettier are clean.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01PAhEJtjNehjoQDZAu7js6M
