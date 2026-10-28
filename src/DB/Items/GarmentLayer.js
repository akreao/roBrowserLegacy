/**
 * DB/Items/GarmentLayer.js
 *
 * Whether a garment (robe) is drawn over or under the body, read from the client's own tables:
 * - luafiles514/lua files/spreditinfo/_new_biglayerdir_female.lub and _new_biglayerdir_male.lub list,
 *   per job, per action and direction (action * 8 + direction), the frames where the garment goes
 *   under the body;
 * - luafiles514/lua files/spreditinfo/_new_2dlayerdir_f.lub (LAYER_ALL_TABLE_LIST) says which jobs
 *   use another job's table (baby, transcendent and mounted jobs).
 *
 * The rule is the client's _New_DrawOnTop: a listed frame draws the garment under the body, anything
 * else draws it on top. Garments always use the "big" tables: 2dlayerdir_f.lub's GetLayerSizeType
 * never picks the small ones.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/** @type {Array<Map<number, Map<number, Set<number>>>>} sex (0 female, 1 male) -> job -> actNum -> frames */
const tables = [new Map(), new Map()];

/** @type {Map<number, number>} job -> job whose table it uses */
const inherit = new Map();

/** Which sex's table was read: each comes from its own file, and either may be missing */
const loaded = [false, false];

/**
 * Forget every table (tests, or before a reload).
 */
export function clear() {
	tables[0].clear();
	tables[1].clear();
	inherit.clear();
	loaded[0] = false;
	loaded[1] = false;
}

/**
 * @param {number} [sex] 0 female, anything else male; left out, either
 * @return {boolean} true once that sex's table has been read
 */
export function isLoaded(sex) {
	if (sex === undefined) {
		return loaded[0] || loaded[1];
	}
	return loaded[sex === 0 ? 0 : 1];
}

/**
 * Read the dump the loader builds in Lua, one entry a line:
 *   "F <sex> <job> <actNum> <frame>.<frame>..."  frames that draw under the body
 *   "I <job> <job it uses>"                      LAYER_ALL_TABLE_LIST
 *
 * @param {string} dump
 */
export function parse(dump) {
	const lines = dump.split('\n');

	for (let i = 0; i < lines.length; i++) {
		const parts = lines[i].trim().split(' ');

		if (parts[0] === 'I' && parts.length >= 3) {
			inherit.set(Number(parts[1]), Number(parts[2]));
			continue;
		}

		if (parts[0] !== 'F' || parts.length < 4) {
			continue;
		}

		const sex = Number(parts[1]) === 0 ? 0 : 1;
		const job = Number(parts[2]);
		const actNum = Number(parts[3]);
		const frames = new Set();

		if (parts[4]) {
			const list = parts[4].split('.');
			for (let j = 0; j < list.length; j++) {
				frames.add(Number(list[j]));
			}
		}

		let byAct = tables[sex].get(job);
		if (!byAct) {
			byAct = new Map();
			tables[sex].set(job, byAct);
		}
		byAct.set(actNum, frames);
		loaded[sex] = true;
	}
}

/**
 * The client's _New_DrawOnTop.
 *
 * @param {number} sex 0 female, anything else male
 * @param {number} job the job the body sprite is drawn as (mounts included)
 * @param {number} actNum action * 8 + direction, as the act file is indexed
 * @param {number} frame the garment's frame in that action
 * @return {boolean|null} true over the body, false under it, null when that sex's table was not loaded
 */
export function drawOnTop(sex, job, actNum, frame) {
	const index = sex === 0 ? 0 : 1;

	if (!loaded[index]) {
		return null;
	}

	const table = tables[index];
	const byAct = table.get(inherit.has(job) ? inherit.get(job) : job);

	if (!byAct) {
		return true;
	}

	const frames = byAct.get(actNum);

	if (!frames) {
		return true;
	}

	return !frames.has(frame);
}

/**
 * Job names the client's tables use that JobConst spells differently, with the client's ids
 * (luafiles514/lua files/datainfo/jobidentity.lub, kRO 2025).
 */
export const OFFICIAL_JOB_ALIASES = {
	JT_SANTA: 26,
	JT_CHICKEN: 13,
	JT_CHICKEN2: 21,
	JT_CHICKEN_B: 4036,
	JT_CHICKEN2_B: 4044,
	JT_THIRDJOB_BEGIN: 4053,
	JT_RUNE_CHICKEN: 4080,
	JT_RUNE_CHICKEN_H: 4081,
	JT_ROYAL_CHICKEN: 4082,
	JT_ROYAL_CHICKEN_H: 4083,
	JT_WOLF_RANGER: 4084,
	JT_WOLF_RANGER_H: 4085,
	JT_MADOGEAR: 4086,
	JT_MADOGEAR_H: 4087,
	JT_RUNE_CHICKEN_B: 4109,
	JT_ROYAL_CHICKEN_B: 4110,
	JT_WOLF_RANGER_B: 4111,
	JT_MADOGEAR_B: 4112,
	JT_THIRDJOB_END: 4113,
	JT_DO_CART_SUMMONER: 4219,
	JT_DO_CART_SUMMONER_B: 4221,
	JT_STAR2_EMPEROR: 4243,
	JT_STAR2_EMPEROR_B: 4244
};

/**
 * Lua run after the three files: returns their tables as one string for parse(), and frees them.
 */
export const DUMP_LUA = `
	local out = {}
	if type(LAYER_ALL_TABLE_LIST) == "table" then
		for from, to in pairs(LAYER_ALL_TABLE_LIST) do
			if type(from) == "number" and type(to) == "number" and from >= 0 and to >= 0 then
				out[#out + 1] = "I " .. from .. " " .. to
			end
		end
	end
	local function dump(sex, tbl)
		if type(tbl) ~= "table" then
			return
		end
		for job, acts in pairs(tbl) do
			if type(job) == "number" and type(acts) == "table" then
				for act, frames in pairs(acts) do
					if type(act) == "number" and type(frames) == "table" then
						local list = {}
						for _, frame in ipairs(frames) do
							list[#list + 1] = frame
						end
						out[#out + 1] = "F " .. sex .. " " .. job .. " " .. act .. " " .. table.concat(list, ".")
					end
				end
			end
		end
	end
	dump(0, _New_BigLayerDir_F)
	dump(1, _New_BigLayerDir_M)
	local dump = table.concat(out, "\\n")
	_New_BigLayerDir_F = nil
	_New_BigLayerDir_M = nil
	_New_SmallLayerDir_F = nil
	_New_SmallLayerDir_M = nil
	LAYER_ALL_TABLE_LIST = nil
	collectgarbage()
	return dump
`;

/**
 * The whole chunk the loader runs: JOBID set from __GARMENT_JOBID (an unknown name reads -1, which
 * the dump skips), the mounted files run with the plain dofile, the dump returned, JOBID put back.
 * One chunk, so no other loader runs in between.
 *
 * @param {string[]} files mounted file names, in order
 * @return {string} Lua returning the dump
 */
export function loadChunk(files) {
	// Through a local: a line starting with "(" reads as a call on the line before (Lua 5.1)
	const run = files.map(name => `runFile(${JSON.stringify(name)})`).join('\n');

	return `
local savedJobId = JOBID
JOBID = setmetatable({}, {
	__index = function(t, k)
		local id = __GARMENT_JOBID[k]
		if id == nil then
			return -1
		end
		return id
	end
})
local runFile = __ro_orig_dofile or dofile
local ok, result = pcall(function()
${run}
${DUMP_LUA}
end)
JOBID = savedJobId
__GARMENT_JOBID = nil
if not ok then
	error(result)
end
return result
`;
}

export default { clear, isLoaded, parse, drawOnTop, loadChunk, OFFICIAL_JOB_ALIASES, DUMP_LUA };
