import { db } from '../../database'

export async function getAttributes() {
	const sounds = await db.attributes.findMany({
		orderBy: {
			label: 'asc',
		},
	})
	return sounds
}

export async function getSoundsCount(): Promise<number> {
	const count = await db.attributes.count({
		where: {
			is_sound: true,
		},
	})
	return count
}

export async function addAttributesToEntity({ entityType, entityId, attributes }) {
	if (!entityType || !entityId || !attributes) {
		throw new Error('Invalid input')
	}
	const parsedAttributes = JSON.parse(attributes)
	const attributeIds = parsedAttributes.map((attr) => attr.id)
	const attributeLabels = parsedAttributes.map((attr) => attr.label)
	const formattedEntityType = entityType.toLowerCase() + 's'

	console.log('formattedEntityType', formattedEntityType)
	console.log('entityId', entityId)
	console.log('attributeIds', attributeIds)
	console.log('attributeLabels', attributeLabels)

	const updatedEntity = await db[formattedEntityType].update({
		where: {
			id: Number(entityId),
		},
		data: {
			attribute_ids: attributeIds,
			attributes: attributeLabels,
		},
	})

	console.log('updatedEntity', updatedEntity)

	return updatedEntity
}
