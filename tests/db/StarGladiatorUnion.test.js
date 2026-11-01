import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Star Gladiator Union (SG_FUSION) sets the flying option (0x8000). The official
// client (kRO 2025-07-16, 0xc43b10) then draws the flying body: 4047 -> 4048,
// 4226 -> 4238, 4302 -> 4316.
const { default: MountTable } = await import('DB/Jobs/MountTable.js');
const { default: JobId } = await import('DB/Jobs/JobConst.js');

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

describe('Star Gladiator Union body', () => {
	it('maps each Star Gladiator to its flying body', () => {
		expect(MountTable[JobId.STAR]).toBe(4048);
		expect(MountTable[JobId.STAR_B]).toBe(4238);
		expect(MountTable[JobId.SKY_EMPEROR]).toBe(4316);
	});

	it('switches on the flying option, for those jobs only', () => {
		const state = read('Renderer/Entity/EntityState.js');
		expect(state).toContain('const FLYING_JOBS = new Set([JobId.STAR, JobId.STAR_B, JobId.SKY_EMPEROR]);');
		expect(state).toContain('if (value & StatusConst.EffectState.FLYING && FLYING_JOBS.has(this._job)) {');
	});
});
