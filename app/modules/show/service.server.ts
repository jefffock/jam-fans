import { db } from '../../database'

export async function getShows() {
	const shows = await db.shows.findMany()
	return shows
}

export async function addShow({ date, location, artist_id }) {
	console.log(' in addShow server', date, location, artist_id)
	const artistId = Number(artist_id)
	const newShow = await db.shows.create({
		data: {
			artist_id: artistId,
			date_text: date,
			location: location,
		},
	})

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
	const show = await db.shows.findUnique({
		where: {
			id: showId,
		},
	})

	return show
}

export async function getShowsCount(): Promise<number> {
	const count = await db.shows.count()
	return count
}
