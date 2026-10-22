Title: fix(CashShop): keep each tab's items under its tab number

Before: rAthena sends one `ZC_ACK_SCHEDULER_CASHITEM` (0x08ca) per tab that has items, carrying the tab's number, and skips empty tabs. The client pushed each one onto an array in arrival order, then looked tabs up by position. With any tab empty, every tab after it showed the next tab's items. Buying from such a tab sent the wrong tab number, so the server refused it, and a tab past the end of the array threw when an item was added to the cart. Only New (tab 0) always lined up, which is why server owners put their whole catalog in New. A tab too big for one packet arrived as several, and each part took a slot of its own.

After: each tab is stored under its tab number, and a tab sent in parts is joined. Search walks the tabs that exist. A clicked tab's index is read as a number.

Also: `ZC_SE_PC_BUY_CASHITEM_RESULT` (0x0849) was read as four 16-bit fields. It is `<item id>.L <result>.W <cash points>.L <kafra points>.L`, so the points shown after a purchase were wrong. It is now read that way, and both point totals are updated.

**Tests:** new `tests/ui/CashShop.tabs.test.js` and `tests/network/CashShopBuyResult.test.js`, which fail without the change. `npx vitest run`: all pass. ESLint and Prettier are clean.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01PAhEJtjNehjoQDZAu7js6M
