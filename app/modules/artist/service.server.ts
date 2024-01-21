import { db } from '../../database'

export async function getArtists({ db }) {
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

export async function getArtistsCount({ db }): Promise<number> {
	const count = await db.artists.count()
	return count
}

// export async function addArtist({ name, emoji, nameForOrder, url }) {
// 	console.log('artist', name, emoji, nameForOrder, url)
// 	const artistAdded = await db.artists.create({
// 		data: {
// 			artist: name,
// 			emoji_code: emoji,
// 			name_for_order: nameForOrder,
// 			url: url,
// 			ratings: 0,
// 			nickname: name,
// 		},
// 	})
// 	console.log('artistAdded', artistAdded)
// 	return artistAdded
// }

export async function addArtist(values) {
	const emoji = values['emoji'] || '💚' // Default to '💚' if emoji is not provided
	const emojiCode = emojiToUnicode(emoji)
	const artistName = values['name']
	const slug = slugify(artistName)
	const artistNameForSort = slug
		.replace(/^(a |the |an |- )/i, '')
		.trim()
		.slice(0, 3)

	const artist = {
		name: artistName,
		emoji: emojiCode,
		nameForOrder: artistNameForSort,
		url: slug,
	}

	console.log('artist', artist)
	const artistAdded = await db.artists.create({
		data: {
			artist: artist.name,
			emoji_code: artist.emoji,
			name_for_order: artist.nameForOrder,
			url: artist.url,
			ratings: 0,
			nickname: artist.name, // Assuming nickname is same as name
		},
	})

	console.log('artistAdded', artistAdded)
	return artistAdded
}
