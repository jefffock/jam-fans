import { db } from '../../database'
import { updateRatingForJam } from '../jam/service.server'
import { updateRatingForSet } from '../set/service.server'
import { updateRatingForShow } from '../show/service.server'

export async function addFavorite({ userId, entityType, entityId, isFavorite }) {
	console.log('addFavorite', userId, entityType, entityId)
	const newFavorite = await db.favorites.create({
		data: {
			user_id: userId,
			entity_type: entityType,
			entity_id: Number(entityId),
		},
	})

	if (['Jam', 'Show', 'Set'].includes(entityType)) {
		await updateEntityFavorites(Number(entityId), entityType, isFavorite)
	}
	return newFavorite
}

export async function removeFavorite({ userId, entityType, entityId, isFavorite }) {
	console.log('removeFavorite', userId, entityType, entityId)
	const removedFavorite = await db.favorites.delete({
		where: {
			user_id_entity_id_entity_type: {
				user_id: userId,
				entity_id: Number(entityId),
				entity_type: entityType,
			},
		},
	})

	if (['Jam', 'Show', 'Set'].includes(entityType)) {
		await updateEntityFavorites(Number(entityId), entityType, isFavorite)
	}
	return removedFavorite
}

export async function updateFavorites({ entityId, userId, entityType, isFavorite }) {
	//if !isFavorite, addFavorite
	//if isFavorite, removeFavorite
	console.log('updateFavorite', entityId, userId, entityType, isFavorite)
	console.log('typeof isFavorite', typeof isFavorite)
	if (!isFavorite || isFavorite === 'false') {
		await addFavorite({ userId, entityType, entityId, isFavorite })
	} else {
		await removeFavorite({ userId, entityType, entityId, isFavorite })
	}
}

export async function updateEntityFavorites(entityId, entityType, isFavorite) {
	try {
		let updateData =
			!isFavorite || isFavorite === 'false' ? { favorites: { increment: 1 } } : { favorites: { decrement: 1 } }

		let updatedEntity
		if (entityType === 'Jam') {
			updatedEntity = await db.jams.update({
				where: { id: entityId },
				data: updateData,
			})
		} else if (entityType === 'Show') {
			updatedEntity = await db.shows.update({
				where: { id: entityId },
				data: updateData,
			})
		} else if (entityType === 'Set') {
			updatedEntity = await db.sets.update({
				where: { id: entityId },
				data: updateData,
			})
		}
		return updatedEntity
	} catch (error) {
		console.error('Error updating favorites:', error)
		throw error
	}
}
