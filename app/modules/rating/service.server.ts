import { db } from '../../database'
import { updateRatingForJam } from '../jam/service.server'
import { updateRatingForSet } from '../set/service.server'
import { updateRatingForShow } from '../show/service.server'

export async function getRating({ user_id, entity_id, entity_type }) {
	const rating = await db.ratings.findFirst({
		where: {
			user_id_entity_id_entity_type: {
				user_id,
				entity_id,
				entity_type,
			},
		},
	})
	return rating
}

export async function upsertRating({ userId, rating, entityType, entityId }) {
	console.log('upsertRating', userId, rating, entityType, entityId)
	const upsertedRating = await db.ratings.upsert({
		where: {
			profile_id_entity_type_entity_id: {
				entity_type: entityType,
				entity_id: Number(entityId),
				profile_id: userId,
			},
		},
		create: {
			// profile_id: userId,
			rating: Number(rating),
			entity_type: entityType,
			entity_id: Number(entityId),
			profiles: {
				connect: { id: userId },
			},
		},
		update: {
			rating: Number(rating),
		},
	})

	if (entityType === 'Jam') {
		await updateRatingForJam(Number(entityId))
	}
	if (entityType === 'Show') {
		await updateRatingForShow(Number(entityId))
	}
	if (entityType === 'Set') {
		await updateRatingForSet(Number(entityId))
	}

	return upsertedRating
}
