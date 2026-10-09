import { describe, it, expect, vi } from 'vitest';

vi.mock('DB/DBManager.js', () => ({
	default: { getMessage: id => `msg${id}` }
}));

const { JOB_CATEGORIES, getJobName } = await import(
	'UI/Components/PartyBooking/PartyBookingData.js'
);

describe('party booking jobs', () => {
	it('names every code of every category', () => {
		JOB_CATEGORIES.forEach(category => {
			for (let code = category.first; code < category.first + category.count; ++code) {
				expect(getJobName(code), `code ${code}`).not.toBe('');
			}
		});
	});

	it('names the official codes, Novice included', () => {
		expect(getJobName(1)).toBe('msg1712');
		expect(getJobName(5)).toBe('Swordman');
		expect(getJobName(24)).toBe('Rune Knight');
		expect(getJobName(56)).toBe('Novice');
		expect(getJobName(63)).toBe('Soul Linker');
		expect(getJobName(64)).toBe('');
		expect(getJobName(-1)).toBe('');
	});
});
