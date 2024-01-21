import { db } from '../../database'

export async function getShows({ db }) {
	const shows = await db.shows.findMany()
	return shows
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
	const show = await db.shows.findUnique({
		where: {
			id: showId,
		},
	})

	return show
}

export async function getShowsCount({ db }): Promise<number> {
	const count = await db.shows.count()
	return count
}
