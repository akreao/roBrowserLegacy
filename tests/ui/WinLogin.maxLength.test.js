import { describe, expect, it } from 'vitest';
import classicHtml from 'UI/Components/WinLogin/WinLogin/WinLogin.html?raw';
import v2Html from 'UI/Components/WinLogin/WinLoginV2/WinLoginV2.html?raw';

/**
 * The official login window caps both fields at 24 characters, the size of
 * the ID and password fields in the login packet. Without the cap a longer
 * entry was cut off silently when the packet was written.
 */
describe.each([
	['WinLogin', classicHtml],
	['WinLoginV2', v2Html]
])('%s fields', (_name, html) => {
	it.each(['.user', '.pass'])('caps %s at 24 characters', selector => {
		const root = document.createElement('div');
		root.innerHTML = html;
		expect(root.querySelector(selector).maxLength).toBe(24);
	});
});
