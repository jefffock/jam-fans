import { db } from '../../database'

export async function getSounds({ db }) {
	const sounds = await db.sounds.findMany({
		orderBy: {
			label: 'asc',
		},
	})
	return sounds
}

export async function getSoundsCount({ db }): Promise<number> {
	const count = await db.sounds.count()
	return count
}
