import type { Prisma } from '../../database'
import { db } from '../../database'
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

export async function getJams(userId) {
	const allJams = await db.jams.findMany({
		include: {
			artists: true,
		},
		orderBy: [{ likes: 'desc' }],
	})

	let userRatings = {}

	if (userId) {
		const ratings = await db.ratings.findMany({
			where: {
				profile_id: userId,
				entity_type: 'Jam',
			},
			select: {
				entity_id: true,
				rating: true,
				comment: true,
				favorite: true,
				likes: true,
			},
		})

		userRatings = ratings.reduce((acc, rating) => {
			acc[rating.entity_id] = rating
			return acc
		}, {})

		allJams.forEach((jam) => {
			jam.userRating = userRatings[jam.id] || undefined
		})
	}

	// TODO: REMOVE. implement add show_id to jam or set on creation
	// Fetch all shows
	const allShows = await db.shows.findMany()

	// Create a map of jams with show_id added
	const jamMap = new Map(allJams.map((jam) => [jam.id, { ...jam, show_id: null, key: `jam-${jam.id}` }]))

	// Iterate over each show and update corresponding jams
	allShows.forEach((show) => {
		allJams.forEach((jam) => {
			if (jam.artist_id === show.artist_id && jam.date === show.date_text && jam.show_id === null) {
				const updatedJam = jamMap.get(jam.id)
				if (updatedJam) {
					updatedJam.show_id = show.id
					jamMap.set(jam.id, updatedJam)
				}
			}
		})
	})

	// Convert the map back to an array
	const modifiedJams = Array.from(jamMap.values())
	return modifiedJams
}

interface QueryParams {
	[key: string]: unknown
	page?: string // assuming 'page' is a string, you might need to adjust based on actual data
}

export const loadJams = async (queryParams: QueryParams) => {
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

export const getJamsCount = async (queryParams?: QueryParams) => {
	if (!queryParams) {
		const allJamsCount = await db.jams.count()
		return allJamsCount
	}
	// Initialize query parameters
	let date,
		beforeDate,
		afterDate,
		orderBy = 'avg_rating',
		asc = false,
		limit = 100,
		showListenable
	let artistsInQuery = [],
		songsInQuery = [],
		soundsInQuery = []

	// Parse query parameters
	for (const [key, value] of Object.entries(queryParams)) {
		if (key.includes('sound')) soundsInQuery.push(value)
		if (key.includes('artist')) artistsInQuery.push(parseInt(value))
		if (key.includes('song')) songsInQuery.push(parseInt(value))
		if (key.includes('before')) beforeDate = value
		if (key.includes('after')) afterDate = value
		if (key.includes('order')) orderBy = value
		if (key.includes('asc')) asc = value === 'true'
		if (key.includes('limit')) limit = parseInt(value)
		if (key.includes('show-links')) showListenable = value === 'true'
		if (key.includes('date')) date = value
	}

	// Build Prisma query
	let query = {
		where: {},
		orderBy: {
			[orderBy]: asc ? 'asc' : 'desc',
		},
		take: limit,
	}

	if (artistsInQuery.length) {
		query.where.artist_id = { in: artistsInQuery }
	}
	if (songsInQuery.length) {
		query.where.song_id = { in: songsInQuery }
	}
	if (afterDate) {
		let after = afterDate + '-01-01'
		query.where.date = { gte: after }
	}
	if (beforeDate) {
		let before = beforeDate + '-12-31'
		query.where.date = { lte: before }
	}
	if (soundsInQuery.length) {
		query.where.OR = soundsInQuery.map((sound) => ({ sounds: { has: sound } }))
	}
	if (showListenable) {
		query.where.listen_link = { not: null }
	}
	if (date) {
		query.where.date = date
	}

	// Get count
	console.log('query', query)
	const count = await db.jams.count(query)
	console.log('count', count)
	return count
}

export async function updateRatingForJam(jamId) {
	const ratings = await db.ratings.findMany({
		where: { entity_id: jamId, rating: { not: null }, profile_id: { not: null } },
		select: { rating: true },
	})

	const averageRating =
		ratings.length > 0 ? ratings.reduce((sum, { rating }) => sum + rating, 0) / ratings.length : null // Set to null if there are no ratings

	// Update the jam with the new average
	await db.jams.update({
		where: { id: jamId },
		data: { avg_rating: averageRating, num_ratings: ratings.length },
	})
}

export async function updateUnverifiedRatingForJam(jamId) {
	const ratings = await db.ratings.findMany({
		where: { entity_id: jamId, rating: { not: null } },
		select: { rating: true },
	})

	const averageRating =
		ratings.length > 0 ? ratings.reduce((sum, { rating }) => sum + rating, 0) / ratings.length : null // Set to null if there are no ratings

	// Update the jam with the new average
	await db.jams.update({
		where: { id: jamId },
		data: { avg_unverified_rating: averageRating, num_unverified_ratings: ratings.length },
	})
}
