import { describe, expect, it } from 'vitest';
import {
	parsePrice,
	safeCheckAmount,
	stripColors,
	taxRate,
	transactionZeny
} from '../../src/UI/Components/Vending/VendingRules.js';

const messages = {
	2475: '^ff0000%d^0000ffmilion',
	2477: '^ff0000%d^0000ff0,000,000'
};

describe('Vend a Shop number rules', () => {
	it('taxes only prices above 10,000,000 zeny, at 5%', () => {
		expect(taxRate(10000000)).toBe(0);
		expect(taxRate(10000001)).toBe(5);
	});

	it('shows what the seller receives and what a buying store pays', () => {
		expect(transactionZeny(5000, false)).toBe(5000);
		expect(transactionZeny(20000000, false)).toBe(19000000);
		expect(transactionZeny(20000000, true)).toBe(21000000);
		expect(transactionZeny(10000003, false)).toBe(9500003);
	});

	it('accepts digits only', () => {
		expect(parsePrice('')).toBe(0);
		expect(parsePrice(' 120 ')).toBe(120);
		expect(parsePrice('12a')).toBeNull();
		expect(parsePrice('-5')).toBeNull();
	});

	it('words the safe check amount like the official messages', () => {
		const get = id => messages[id];
		expect(safeCheckAmount(9999999, get)).toBe('');
		expect(safeCheckAmount(30000000, get)).toBe('30,000,000');
		expect(safeCheckAmount(250000000, get)).toBe('250milion');
	});

	it('drops colour codes', () => {
		expect(stripColors('It is more than ^0000ffZeny^000000.')).toBe('It is more than Zeny.');
	});
});
