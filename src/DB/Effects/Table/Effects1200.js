/**
 * @module DB/Effects/Table/Effects1200
 *
 * Effects 1200 to 1299 of the effect table. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep rows in effect ID order.
 */

export default {
	1240: [
		{
			//EF_DIGITAL_SPACE - Hat effect example (SPR)
			type: 'SPR',
			file: 'digital_space/digital_space',
			texturePath: 'digital_space/',
			attachedEntity: true,
			repeat: true,
			renderBeforeEntities: true
		}
	]
};
