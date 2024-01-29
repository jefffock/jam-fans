import { db } from '../../database'
import type { sets } from '@prisma/client'
import { SetNumber } from '@prisma/client'

export async function getSets(profileId: string) {
	const sets = await db.sets.findMany({
		include: {
			artists: true,
		},
	})
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
