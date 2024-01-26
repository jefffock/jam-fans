import { db } from '../../database'

export async function getShows() {
	const shows = await db.shows.findMany({
		include: {
			artists: true,
		},
	})

	return shows
}

export async function addShow(values) {
	console.log(' in addShow server', values)
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
