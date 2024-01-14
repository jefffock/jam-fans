import { db } from '~/database'

export async function getArtists() {
	const artists = await db.artists.findMany({
		orderBy: {
			name_for_order: 'asc',
		},
	})
	return artists
}
