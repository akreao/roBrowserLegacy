/**
 * @module DB/Effects/Table/ef_gc
 *
 * The effect table's named ef_gc_* rows. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep a skill's rows together.
 */

export default {
	// Cross Impact (GC_CROSSIMPACT), from the client's own effect folders.
	ef_gc_crossimpact: [
		{
			type: 'STR',
			file: 'new_crossimpact/new_crossimpact/new_crossimpact',
			texturePath: 'new_crossimpact/new_crossimpact/'
		}
	],

	// Poisoning Weapon (GC_POISONINGWEAPON), from the client's own effect folders.
	ef_gc_poisoningweapon: [
		{
			type: 'STR',
			file: 'poison',
			texturePath: ''
		}
	],

	// Counter Slash (GC_COUNTERSLASH), from the client's own effect folders.
	ef_gc_counterslash: [
		{
			type: 'STR',
			file: 'new_counter_slash/new_counter_slash/new_counter_slash',
			texturePath: 'new_counter_slash/new_counter_slash/'
		},
		{
			type: 'STR',
			file: 'new_counter_slash/new_counter_slash_bottom/new_counter_slash_bottom',
			texturePath: 'new_counter_slash/new_counter_slash_bottom/',
			renderBeforeEntities: true
		}
	],

	// Poison Smoke (GC_POISONSMOKE), from the client's own effect folders.
	ef_gc_poisonsmoke: [
		{
			type: 'STR',
			file: 'new_poisonsmoke/new_poisonsmoke/new_poisonsmoke_%d',
			rand: [1, 2],
			texturePath: 'new_poisonsmoke/new_poisonsmoke/'
		}
	],

	// Cross Ripper Slasher (GC_CROSSRIPPERSLASHER), from the client's own effect folders.
	ef_gc_crossripperslasher: [
		{
			type: 'STR',
			file: 'new_crossripperslasher/new_crossripperslasher/new_crossripperslasher',
			texturePath: 'new_crossripperslasher/new_crossripperslasher/'
		}
	]
};
