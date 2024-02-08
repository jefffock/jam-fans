import { db } from '../../database'

export async function getShows(userId: string) {
	const shows = await db.shows.findMany({
		include: {
			artists: true,
			ratings: true,
		},
		orderBy: [{ likes: 'desc' }],
	})

	let userRatings = {}

	if (userId) {
		const ratings = await db.ratings.findMany({
			where: {
				profile_id: userId,
				entity_type: 'Show',
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

		shows.forEach((show) => {
			show.key = 'show-' + show.id
			show.userRating = userRatings[show.id] || undefined
		})
	}
	if (!userId) {
		shows.forEach((show) => {
			show.key = 'show-' + show.id
		})
	}

	return shows
}

export async function addShow(values) {
	console.log(' in addShow server', values)
	// make sure show isn't already in db
	const show = await db.shows.findFirst({
		where: {
			date_text: values.date_text,
			artist_id: Number(values.artist_id),
		},
	})
	console.log('show', show)
	if (show) {
		throw new Error('Show already exists')
	}
	const newShow = await db.shows.create({
		data: {
			...values,
			artist_id: Number(values.artist_id),
			year: Number(values.year),
			month: Number(values.month),
			day: Number(values.day),
		},
	})
	console.log('newShow', newShow)
	const updatedJams = await updateShowIdForJams(Number(values.artist_id), values.date_text, newShow.id)

	return { newShow, updatedJams }
}

export async function updateShowIdForJams(artistId: number, date: string, showId: number) {
	try {
		const updatedJams = await db.jams.updateMany({
			where: {
				artist_id: artistId,
				date: date, // Assuming 'date' is stored in a format that matches the input format
			},
			data: {
				show_id: showId,
			},
		})

		console.log('Update successful')
		return updatedJams
	} catch (error) {
		console.error('Error updating jams:', error)
	}

	console.error('Error updating jams:', error)
}

export async function addShowByJamId(jamId: number | string) {
	const jam = await db.jams.findUnique({
		where: {
			id: jamId,
		},
	})

	if (!jam) {
		throw new Error('Jam not found')
	}

	const { artist_id, date, location } = jam

	const newShow = await db.shows.create({
		data: {
			artist_id,
			date_text: date,
		},
	})

	return newShow
}

export async function getShowById(showId: number | string) {
	console.log('showId', showId)
	const show = await db.shows.findUnique({
		where: {
			id: showId,
		},
		include: {
			artists: true,
		},
	})
	console.log('show', show)
	return show
}

export async function getShowsCount(): Promise<number> {
	const count = await db.shows.count()
	return count
}

export async function updateRatingForShow(showId) {
	const ratings = await db.ratings.findMany({
		where: { entity_id: showId, rating: { not: null } },
		select: { rating: true },
	})

	const averageRating =
		ratings.length > 0 ? ratings.reduce((sum, { rating }) => sum + rating, 0) / ratings.length : null

	await db.shows.update({
		where: { id: showId },
		data: { avg_rating: averageRating, num_ratings: ratings.length },
	})
}
