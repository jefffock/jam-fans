import type { Prisma } from '~/database'
import { db } from '~/database'

export async function addJam(data: {
	date: string
	artist: string
	song_id: number
	avg_rating?: number
	location?: string
	submitter_name?: string
	user_id?: string
	listen_link?: string
	song_name?: string
	num_ratings?: number
	song_submitter_name?: string
	sounds?: string[]
}) {
	const newVersion = await db.versions.create({
		data,
	})
	return newVersion
}

export async function getJam(data: { version_id: number }) {
	const { version_id } = data

	const version = await db.versions.findUnique({
		where: {
			id: version_id,
		},
	})

	return version
}

export async function rateJam(data: { profile_id: string; version_id: number; rating?: number; comment?: string }) {
	const { profile_id, version_id, rating, comment } = data

	const newRating = await db.ratings.create({
		data: {
			profile_id,
			version_id,
			rating,
			comment,
		},
	})

	const updatedVersion = await db.versions.update({
		where: {
			id: version_id,
		},
		data: {
			avg_rating: {
				increment: rating,
			},
			num_ratings: {
				increment: 1,
			},
		},
	})

	// Return both newRating and updatedVersion if needed
	return { newRating, updatedVersion }
}

export async function addLinkToJam(data: { username: string; link: string; version_id: number }) {
	const { username, link, version_id } = data

	const newLink = await db.add_link.create({
		data: {
			username,
			link,
			version_id,
		},
	})

	const updatedVersion = await db.versions.update({
		where: {
			id: version_id,
		},
		data: {
			listen_link: link,
		},
	})

	return { newLink, updatedVersion }
}

export const addSoundsToJam = async (data: { username: string; sounds: string[]; version_id: number }) => {
	const { username, sounds, version_id } = data

	const newSounds = await db.update_tags.create({
		data: {
			username,
			tags_added: sounds.join(','),
			version_id,
		},
	})

	const updatedVersion = await db.versions.update({
		where: {
			id: version_id,
		},
		data: {
			sounds,
		},
	})

	return { newSounds, updatedVersion }
}

export async function getJamsByShow(data: { show_id: number }) {
	const { show_id } = data

	const versions = await db.versions.findMany({
		where: {
			show_id,
		},
	})

	return versions
}

export async function getJams() {
	const jams = await db.jams.findMany()
	return jams
}

interface QueryParams {
	[key: string]: unknown
	page?: string // assuming 'page' is a string, you might need to adjust based on actual data
}

export const loadJams = async (queryParams: QueryParams) => {
	console.log('Loading jams with queryParams:', queryParams)

	function formatDateString(dateString: string) {
		const year = dateString.slice(4, 8)
		const month = dateString.slice(0, 2)
		const day = dateString.slice(2, 4)
		return `${year}-${month}-${day}`
	}

	const whereConditions: Prisma.jamsWhereInput = {}

	for (const [key, value] of Object.entries(queryParams)) {
		if (key.includes('sound') && value) {
			if (typeof value === 'string') {
				whereConditions.sounds = {
					has: value,
				}
			}
		}
		// if (key.includes('artist') && value) {
		// 	whereConditions.artist = value
		// }
		if (key.includes('song') && value) {
			whereConditions.song_name = value
		}
		if (key.includes('date') && value && typeof value === 'string') {
			whereConditions.date = formatDateString(value)
		}
		if (key.includes('before') && value) {
			whereConditions.date = {
				lte: `${value}-12-31`,
			}
		}
		if (key.includes('after') && value) {
			whereConditions.date = {
				gte: `${value}-01-01`,
			}
		}
		if (key.includes('show-links')) {
			whereConditions.listen_link = {
				not: null,
			}
		}
	}

	const page = parseInt(queryParams.page || '1')
	console.log('page', page)
	const pageSize = 20
	const jamsQuery = db.jams.findMany({
		where: whereConditions,
		orderBy: [{ avg_rating: 'desc' }, { num_ratings: 'desc' }],
		// take: pageSize,
		// skip: (page - 1) * pageSize,
	})
	try {
		const jams = await jamsQuery
		return jams
	} catch (error) {
		console.error(error)
	}
}

export async function getJamCount() {
	const count = await db.jams.count()
	return count
}

// export async function getJamsTitle({ queryParams }: { queryParams: QueryParams }) {
// 	let title = '🔥 '

// 	// Assume these functions exist to fetch sounds and artists by their IDs
// 	const sounds = await fetchSoundsByIds(queryParams.soundsInQuery)
// 	const artists = await fetchArtistsByIds(queryParams.artistsInQuery)

// 	if (queryParams.soundsInQuery?.length > 0) {
// 		queryParams.soundsInQuery.forEach((soundId, i) => {
// 			const soundLabel = sounds.find((s) => s.id === soundId)?.label
// 			title += soundLabel ? soundLabel : ''
// 			if (i < queryParams.soundsInQuery.length - 2) title += ', '
// 			if (i === queryParams.soundsInQuery.length - 2) title += ' and '
// 		})
// 	}

// 	if (queryParams.song) {
// 		title += ' ' + queryParams.song
// 	}

// 	title += ' Jams'

// 	if (artists?.length > 0 && !queryParams.date) {
// 		title += ' by '
// 		artists.forEach((artist, j) => {
// 			title += artist.name === 'Grateful Dead' ? 'The ' : ''
// 			title += artist.name
// 			if (j < artists.length - 2) title += ', '
// 			if (j === artists.length - 2) title += ' and '
// 		})
// 	} else if (!artists || (artists.length === 0 && !queryParams.date)) {
// 		title += ' by All Bands'
// 	}

// 	if (queryParams.date) {
// 		title += ' from ' + new Date(queryParams.date + 'T16:00:00').toLocaleDateString()
// 	}

// 	if (queryParams.beforeDate && queryParams.afterDate && !queryParams.date) {
// 		title +=
// 			queryParams.beforeDate === queryParams.afterDate
// 				? ' from ' + queryParams.beforeDate
// 				: ' from ' + queryParams.afterDate + ' to ' + queryParams.beforeDate
// 	}

// 	if (queryParams.beforeDate && !queryParams.afterDate && !queryParams.date) {
// 		title += ' from ' + queryParams.beforeDate + ' and before '
// 	}

// 	if (queryParams.afterDate && !queryParams.beforeDate && !queryParams.date) {
// 		title += ' from ' + queryParams.afterDate + ' and after '
// 	}

// 	return title.trim() + ' on Jam Fans'
// }
