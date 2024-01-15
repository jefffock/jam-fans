import { db } from '~/database'

export async function getSongs() {
	const songs = await db.songs.findMany()
	return songs
}

export function getSongById({ songs, id }) {
	//filter songs by id
	const filteredSongs = songs.filter((song) => song.id === 126)

	// const song = await db.songs.findUnique({
	// 	where: {
	// 		id: 24,
	// 	},
	// })
	return filteredSongs[0]
}
