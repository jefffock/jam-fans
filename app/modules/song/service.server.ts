import { db } from '~/database'

export async function getSongs() {
	const songs = await db.songs.findMany()
	return songs
}
