import { db } from '../../database'

export async function getShows(userId) {
	console.log('in getShows server', userId)
	const shows = await db.shows.findMany({
		include: {
			artists: true,
		},
		orderBy: [{ avg_rating: 'desc' }, { num_ratings: 'desc' }],
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
			},
		})

		userRatings = ratings.reduce((acc, rating) => {
			acc[rating.entity_id] = rating
			return acc
		}, {})

		const favorites = await db.favorites.findMany({
			where: {
				user_id: userId,
				entity_type: 'Show',
			},
			select: {
				entity_id: true,
			},
		})

		let userFavorites = favorites.reduce((acc, favorite) => {
			acc[favorite.entity_id] = true
			return acc
		}, {})

		// Get Likes
		const likes = await db.likes.findMany({
			where: {
				user_id: userId,
				entity_type: 'Show',
			},
			select: {
				entity_id: true,
			},
		})

		let userLikes = likes.reduce((acc, like) => {
			acc[like.entity_id] = true
			return acc
		}, {})

		console.log('userRatings', userRatings)
		console.log('userFavorites', userFavorites)
		console.log('userLikes', userLikes)
		// Combine the data
		shows.forEach((show) => {
			show.userRating = userRatings[show.id] || undefined
			show.isUserFavorite = !!userFavorites[show.id]
			show.isUserLiked = !!userLikes[show.id]
		})
	}
	console.log(
		'12 show',
		shows.find((show) => show.id === 12)
	)

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
	return newShow
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
