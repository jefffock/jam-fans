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

export async function getSongsCount(): Promise<number> {
	const count = await db.songs.count()
	return count
}

export async function addSong({ song, artist, profile }) {
	console.log('in addSong', song, artist, profile)
	const parsedArtist = JSON.parse(artist)
	const songAdded = await db.songs.create({
		data: {
			song: song,
			artist: parsedArtist.artist,
			artist_id: parsedArtist.id,
			submitter_name: profile?.name,
			submitter_id: profile?.id,
		},
	})
	console.log('songAdded', songAdded)
	return songAdded
}

export async function getSongFromName({ song, artist, profile }) {
	console.log('in getSongIdFromName', song, artist, profile)
	const songJF = await db.songs.findFirst({
		where: {
			song: song,
		},
	})
	console.log('songJF', songJF)
	if (!songJF) {
		//add song
		const addedSong = await addSong({ song, artist, profile })
		console.log('addedSong', addedSong)
		return addedSong
	}
	return songJF
}
