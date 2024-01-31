import { db } from '../../database'
import type { sets } from '@prisma/client'
import { SetNumber } from '@prisma/client'

export async function getSets(userId: string) {
	const sets = await db.sets.findMany({
		include: {
			artists: true,
			ratings: true,
		},
	})
	let userRatings = {}

	if (userId) {
		const ratings = await db.ratings.findMany({
			where: {
				profile_id: userId,
				entity_type: 'Set',
			},
			select: {
				entity_id: true,
				rating: true,
				comment: true,
				favorite: true,
				likes: true,
			},
		})

		userRatings = ratings.reduce((acc, rating) => {
			acc[rating.entity_id] = rating
			return acc
		}, {})

		sets.forEach((set) => {
			set.userRating = userRatings[set.id] || undefined
		})
	}
	return sets
}
export async function getSetsCount(): Promise<number> {
	const count = await db.sets.count()
	return count
}

export async function addSet(values: sets) {
	console.log('values', values)
	const set = await db.sets.findFirst({
		where: {
			artist_id: Number(values.artist_id),
			date: values.date,
			set_number: values.set_number,
		},
	})
	console.log('set', set)
	if (set) {
		throw new Error('Set already exists')
	}
	const newSet = await db.sets.create({
		data: {
			...values,
			artist_id: Number(values.artist_id),
		},
	})
	console.log('added set', newSet)
	return set
}

export async function updateRatingForSet(setId) {
	const ratings = await db.ratings.findMany({
		where: { entity_id: setId, rating: { not: null } },
		select: { rating: true },
	})

	const averageRating =
		ratings.length > 0 ? ratings.reduce((sum, { rating }) => sum + rating, 0) / ratings.length : null

	await db.sets.update({
		where: { id: setId },
		data: { avg_rating: averageRating, num_ratings: ratings.length },
	})
}
