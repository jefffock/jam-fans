import { db } from '../../database'

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

export async function upsertRating({ userId, rating, entityType, entityId, comment, favorite, like, ratingChange }) {
	console.log('in upsertRating', {
		upsertRating: true,
		userId,
		rating,
		comment,
		favorite,
		fave_type: typeof favorite,
		like,
		like_type: typeof like,
		entityType,
		entityId,
		ratingChange,
		rc_type: typeof ratingChange,
	})
	const parsedRating = Number(rating)
	const parsedEntityId = Number(entityId)

	if (like && !ratingChange && !userId) {
		let updatedEntity
		if (entityType === 'Jam') {
			updatedEntity = await db.jams.update({
				where: { id: parsedEntityId },
				data: { likes: { increment: 1 } },
			})
		}
		if (entityType === 'Set') {
			updatedEntity = await db.sets.update({
				where: { id: parsedEntityId },
				data: { likes: { increment: 1 } },
			})
		}
		if (entityType === 'Show') {
			updatedEntity = await db.shows.update({
				where: { id: parsedEntityId },
				data: { likes: { increment: 1 } },
			})
		}
		return updatedEntity
	}

	if (userId) {
		let createData = {
			rating: parsedRating,
			comment,
			favorite,
			entity_type: entityType,
			entity_id: parsedEntityId,
			profiles: { connect: { id: userId } },
		}
		if (entityType === 'Jam') {
			createData.jams = { connect: { id: parsedEntityId } }
		} else if (entityType === 'Set') {
			createData.sets = { connect: { id: parsedEntityId } }
		} else if (entityType === 'Show') {
			createData.shows = { connect: { id: parsedEntityId } }
		}
		let updateData = {
			rating: parsedRating,
			comment,
			favorite,
		}
		if (like) {
			updateData.likes = { increment: 1 }
			createData.likes = 1
		}
		const upsertedRating = await db.ratings.upsert({
			where: {
				profile_id_entity_type_entity_id: {
					entity_type: entityType,
					entity_id: parsedEntityId,
					profile_id: userId,
				},
			},
			create: createData,
			update: updateData,
		})
		if (ratingChange || like) {
			const updatedEntity = await updateRating({ entityId: parsedEntityId, entityType, like })
			console.log('upsertedRating', upsertedRating, 'updatedEntity', updatedEntity)
			return { upsertedRating, updatedEntity }
		}
		console.log('upsertedRating', upsertedRating)
		return { upsertedRating }
	}
	if (!userId && parsedRating) {
		const anonRating = await db.ratings.create({
			data: {
				rating: parsedRating,
				entity_type: entityType,
				entity_id: parsedEntityId,
				jam_id: entityType === 'Jam' ? parsedEntityId : undefined,
				set_id: entityType === 'Set' ? parsedEntityId : undefined,
				show_id: entityType === 'Show' ? parsedEntityId : undefined,
			},
		})
		const updatedEntity = await updateUnverifiedRating({ entityId: parsedEntityId, entityType, like })
		console.log('anonRating', anonRating, 'updatedEntity', updatedEntity)
		return { anonRating, updatedEntity }
	}
}

export async function updateRating({ entityId, entityType, like }) {
	const ratings = await db.ratings.findMany({
		where: { entity_id: entityId, entity_type: entityType, rating: { not: null }, profile_id: { not: null } },
		select: { rating: true },
	})

	const averageRating =
		ratings.length > 0 ? ratings.reduce((sum, { rating }) => sum + rating, 0) / ratings.length : null

	let updateData = {
		avg_rating: averageRating,
		num_ratings: ratings.length,
	}
	if (like) {
		updateData.likes = { increment: 1 }
	}
	if (entityType === 'Jam') {
		const updatedEntity = await db.jams.update({
			where: { id: entityId },
			data: updateData,
		})
		return updatedEntity
	} else if (entityType === 'Set') {
		const updatedEntity = await db.sets.update({
			where: { id: entityId },
			data: updateData,
		})
		return updatedEntity
	} else if (entityType === 'Show') {
		const updatedEntity = await db.shows.update({
			where: { id: entityId },
			data: updateData,
		})
		return updatedEntity
	}
}

export async function updateUnverifiedRating({ entityId, entityType, like }) {
	const ratings = await db.ratings.findMany({
		where: { entity_id: entityId, entity_type: entityType, rating: { not: null } },
		select: { rating: true },
	})

	const averageRating =
		ratings.length > 0 ? ratings.reduce((sum, { rating }) => sum + rating, 0) / ratings.length : null

	let updateData = {
		avg_unverified_rating: averageRating,
		num_unverified_ratings: ratings.length,
	}
	if (like) {
		updateData.likes = { increment: 1 }
	}
	if (entityType === 'Jam') {
		const updatedEntity = await db.jams.update({
			where: { id: entityId },
			data: updateData,
		})
		return updatedEntity
	} else if (entityType === 'Set') {
		const updatedEntity = await db.sets.update({
			where: { id: entityId },
			data: updateData,
		})
		return updatedEntity
	} else if (entityType === 'Show') {
		const updatedEntity = await db.shows.update({
			where: { id: entityId },
			data: updateData,
		})
		return updatedEntity
	}
}
