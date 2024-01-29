import { db } from '../../database'

export async function addLike({ userId, entityType, entityId }) {
	console.log('addLike', userId, entityType, entityId)
	const newLike = await db.likes.create({
		data: {
			user_id: userId,
			entity_type: entityType,
			entity_id: Number(entityId),
		},
	})

	if (['Jam', 'Show', 'Set'].includes(entityType)) {
		await updateLikes(Number(entityId), entityType)
	}
	return newLike
}

export async function updateLikes(entityId, entityType) {
	try {
		let updatedEntity
		if (entityType === 'Jam') {
			updatedEntity = await db.jams.update({
				where: { id: entityId },
				data: { likes: { increment: 1 } },
			})
		} else if (entityType === 'Show') {
			updatedEntity = await db.shows.update({
				where: { id: entityId },
				data: { likes: { increment: 1 } },
			})
		} else if (entityType === 'Set') {
			updatedEntity = await db.sets.update({
				where: { id: entityId },
				data: { likes: { increment: 1 } },
			})
		}
		return updatedEntity
	} catch (error) {
		console.error('Error updating likes:', error)
		throw error
	}
}
