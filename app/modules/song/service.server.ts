import { db } from '../../database'

export async function getSongs() {
	const songs = await db.songs.findMany({
		select: {
			song: true,
			artist: true,
			id: true,
		},
		orderBy: {
			song: 'asc',
		},
	})
	return songs
}

export function getSongById({ songs, id }) {
	//filter songs by id
	const filteredSongs = songs.filter((song) => song.id === id)

	// const song = await db.songs.findUnique({
	// 	where: {
	// 		id: 24,
	// 	},
	// })
	return filteredSongs[0]
}

export async function getSongsCount(): Promise<number> {
	const count = await db.songs.count()
	return count
}
