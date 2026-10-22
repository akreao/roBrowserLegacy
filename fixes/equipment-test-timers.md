Title: test(equipment): cancel the scrollbar timers left at the end of the file

Before: `tests/ui/Equipment.cartButton.test.js` waits 600 ms in `afterAll` for the scrollbar checks that `prepare()` schedules up to 500 ms out. On a slow runner one can still fire after jsdom is torn down. It throws `ReferenceError: window is not defined` in `checkScrollbars` (`src/UI/GUIComponent.js`), and Vitest fails the run although every test passed. This happened on #1534's "Build and validate" job: 111 files and 1,051 tests passed, with 1 unhandled error.

After: the file tracks the timers it starts and cancels whatever is left in `afterAll`, so nothing can fire after teardown.

How: `setTimeout` is wrapped with `vi.spyOn` for this file only, and the spy is restored in `afterAll`. Only this one test file changes; nothing in `src/` does.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01PAhEJtjNehjoQDZAu7js6M
