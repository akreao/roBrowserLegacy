import { beforeEach, describe, expect, it } from 'vitest';
import Configs from '../../src/Core/Configs.js';
import { selectLayout, useOfficialLayout } from '../../src/UI/OfficialLayout.js';

describe('officialLayout config', () => {
	beforeEach(() => {
		Configs.setServer({});
		Configs.set('officialLayout', undefined);
	});

	it('keeps roBrowser layouts when unset', () => {
		expect(useOfficialLayout('Vending')).toBe(false);
	});

	it('accepts true or a list of window names', () => {
		Configs.set('officialLayout', true);
		expect(useOfficialLayout('Vending')).toBe(true);

		Configs.set('officialLayout', ['Navigation']);
		expect(useOfficialLayout('Navigation')).toBe(true);
		expect(useOfficialLayout('Vending')).toBe(false);
	});

	it('forwards to the version the config picks, each time it is used', () => {
		const stock = {
			name: 'stock',
			who() {
				return this.name;
			}
		};
		const official = {
			name: 'official',
			who() {
				return this.name;
			}
		};
		const window = selectLayout('Vending', stock, official);

		expect(window.who()).toBe('stock');

		Configs.set('officialLayout', ['Vending']);
		expect(window.who()).toBe('official');

		window.flag = 1;
		expect(official.flag).toBe(1);
		expect(stock.flag).toBeUndefined();
	});
});
