import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

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

	it('draws the flying body with the flying option only, and other mounts as before', () => {
		const state = read('Renderer/Entity/EntityState.js');
		const start = state.indexOf('function mountCostume(');
		const fn = state.slice(start, state.indexOf('\n}\n', start) + 2);
		const { RIDING, FLYING, DRAGON1 } = { RIDING: 0x20, FLYING: 0x8000, DRAGON1: 0x80000 };
		const context = vm.createContext({
			MountTable,
			StatusConst: { EffectState: { FLYING } },
			FLYING_JOBS: new Set([JobId.STAR, JobId.STAR_B, JobId.SKY_EMPEROR]),
			RIDING_OPTIONS: RIDING | DRAGON1
		});
		vm.runInContext(fn, context);
		const { mountCostume } = context;

		for (const job of [JobId.STAR, JobId.STAR_B, JobId.SKY_EMPEROR]) {
			expect(mountCostume(job, 0)).toBe(0);
			expect(mountCostume(job, RIDING)).toBe(0);
			expect(mountCostume(job, FLYING)).toBe(MountTable[job]);
			expect(mountCostume(job, FLYING | RIDING)).toBe(MountTable[job]);
		}

		// Other jobs: riding as before, the flying option changes nothing
		expect(mountCostume(JobId.KNIGHT, RIDING)).toBe(MountTable[JobId.KNIGHT]);
		expect(mountCostume(JobId.KNIGHT, FLYING)).toBe(0);
		expect(mountCostume(JobId.RUNE_KNIGHT, DRAGON1)).toBe(MountTable[JobId.RUNE_KNIGHT]);
		expect(mountCostume(JobId.NOVICE, RIDING)).toBe(0);
	});
});
