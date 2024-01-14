import { db } from '~/database'

export async function getSounds() {
	const sounds = await db.sounds.findMany()
	return sounds
}
