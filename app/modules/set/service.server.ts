import { db } from '~/database'

export async function getSets() {
	const sets = await db.sets.findMany()
	return sets
}
