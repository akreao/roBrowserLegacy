import { expect, it, vi } from 'vitest';

vi.mock('UI/GUIComponent.js', () => ({ default: class {} }));
vi.mock('UI/UIManager.js', () => ({ default: { addComponent: c => c } }));
vi.mock('Renderer/Renderer.js', () => ({ default: {} }));
vi.mock('Controls/MouseEventHandler.js', () => ({ default: { screen: { x: 0, y: 0 } } }));
vi.mock('Controls/KeyEventHandler.js', () => ({ default: {} }));
vi.mock('DB/DBManager.js', () => ({ default: {} }));

const { _formatROText } = await import('UI/Components/SkillDescription/SkillDescription.js');

const text = html => {
	const div = document.createElement('div');
	div.innerHTML = html;
	return div.textContent;
};

it('names the job that a job-specific requirement line starts with', () => {
	const desc = 'Earth Spike\n9^CC3399Requirement: Stone Curse 1^000000\n16^CC3399Requirement: Seismic Weapon 1^000000\n';
	expect(text(_formatROText(desc))).toBe(
		'Earth SpikeWizard Requirement: Stone Curse 1Sage Requirement: Seismic Weapon 1'
	);
});

it('names expanded jobs above 4000', () => {
	expect(text(_formatROText('4190^CC3399Requirement: Stone Curse 1^000000'))).toBe(
		'Super Novice Requirement: Stone Curse 1'
	);
});

it('leaves other numbers alone', () => {
	expect(text(_formatROText('Max Level: 10\n1002^CC3399x^000000\n[Lv 1]: ^777777MATK 110%^000000'))).toBe(
		'Max Level: 101002x[Lv 1]: MATK 110%'
	);
});
