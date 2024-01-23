import { db } from '../../database'

export async function getSets() {
	const sets = await db.sets.findMany()
	return sets
}

export async function getSetsCount(): Promise<number> {
	const count = await db.sets.count()
	return count
}
