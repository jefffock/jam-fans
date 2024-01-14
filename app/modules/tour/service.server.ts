import { db } from '~/database'

export async function getTours() {
	const tours = await db.tours.findMany()
	return tours
}
