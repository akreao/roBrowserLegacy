import { describe, it, expect, vi } from 'vitest';

vi.mock('DB/DBManager.js', () => ({
	default: { getMessage: id => `msg${id}` }
}));

const { JOB_CATEGORIES, getCategoryName, getJobName } = await import(
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

	it('keeps the official codes and adds the newer jobs after them', () => {
		expect(getJobName(1)).toBe('msg1712');
		expect(getJobName(5)).toBe('Swordman');
		expect(getJobName(24)).toBe('Rune Knight');
		expect(getJobName(56)).toBe('Novice');
		expect(getJobName(63)).toBe('Soul Linker');
		expect(getJobName(64)).toBe('Kagerou');
		expect(getJobName(70)).toBe('Dragon Knight');
		expect(getJobName(89)).toBe('Spirit Handler');
		expect(getJobName(90)).toBe('');
		expect(getJobName(-1)).toBe('');
	});

	it('titles the official categories from msgstringtable and ours in English', () => {
		expect(getCategoryName(JOB_CATEGORIES[0])).toBe('msg1755');
		expect(getCategoryName(JOB_CATEGORIES[9])).toBe('4th Jobs');
	});
});
