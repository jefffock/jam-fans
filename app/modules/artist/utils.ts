export function filterArtists(artists, queryParams) {
	if (!queryParams?.artistIds || !Array.isArray(queryParams.artistIds)) {
		return null
	}

	const artistIdSet = new Set(queryParams.artistIds.map((id) => id.toString()))

	return artists.filter((artist) => artistIdSet.has(artist.id.toString()))
}
