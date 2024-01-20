import { db } from '~/database'

export async function getVenues() {
	const venues = await db.venues.findMany()
	return venues
}
