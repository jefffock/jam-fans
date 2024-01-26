import { db } from '../../database'
import type { sets } from '@prisma/client'
import { SetNumber } from '@prisma/client'

export async function getSets() {
	const sets = await db.sets.findMany()
	return sets
}

export async function getSetsCount(): Promise<number> {
	const count = await db.sets.count()
	return count
}

export async function addSet(values: sets) {
	console.log('values', values)
	const set = await db.sets.create({
		data: {
			...values,
			artist_id: Number(values.artist_id),
		},
	})
	console.log('added set', set)
	return set
}
