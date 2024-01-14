import { db } from '~/database'

export async function getShows() {
	const shows = await db.shows.findMany()
	return shows
}
