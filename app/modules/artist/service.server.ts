import { db } from '../../database'

export async function getArtists() {
	const artists = await db.artists.findMany()

	// Custom sort function
	artists.sort((a, b) => {
		// Sort by jam_count in descending order when jam_count > 0
		if (a.jam_count > 0 || b.jam_count > 0) {
			return b.jam_count - a.jam_count
		}
		// If jam_count is 0 or null for both, sort alphabetically
		return a.artist.localeCompare(b.artist)
	})

	return artists
}

export async function getArtistsCount(): Promise<number> {
	const count = await db.artists.count()
	return count
}
