import { db } from '../../database'

export async function getSounds() {
	const sounds = await db.sounds.findMany({
		orderBy: {
			label: 'asc',
		},
	})
	return sounds
}

export async function getSoundsCount(): Promise<number> {
	const count = await db.sounds.count()
	return count
}
