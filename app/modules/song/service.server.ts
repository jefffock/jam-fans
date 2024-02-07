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

export async function addSong({ song, artist, submitter }) {
	console.log('in addSong', song, artist, submitter)
	const songAdded = await db.songs.create({
		data: {
			song: song,
			artist: artist.artist,
			artist_id: artist.id,
			submitter_name: submitter.submitter,
			submitter_id: submitter_id,
		},
	})
	console.log('songAdded', songAdded)
	return songAdded
}

export async function getSongIdFromName({ song, artist, submitter }) {
	console.log('in getSongIdFromName', song, artist, submitter)
	const songId = await db.songs.findFirst({
		where: {
			song: song,
		},
		select: {
			id: true,
		},
	})
	console.log('songId', songId)
	if (!songId) {
		//add song
		const addedSong = await addSong({ song, artist, submitter })
		console.log('addedSong', addedSong)
		return addedSong.id
	}
	return songId
}
