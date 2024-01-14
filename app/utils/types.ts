export interface SongInSonglist {
	song: string
	artist: string
}

export interface SongInSetlist {
	value: string
	label: string
}

export interface Artist {
	artist: string
	nickname: string
	emoji_code: string
	url: string
	start_year: number
	end_year: number
}

export interface SongObj {
	id: number
	song: string
	artist: string
	submitter_name: string
}

export interface Sound {
	label: string
	text: string
}

export interface Jam {
	id: number
	artist: string
	song_name: string
	date: string
	location: string
	sounds?: string[]
	user_id: string
	submitter_name: string
	song_id: number
	song_submitter_name: string
	listen_link: string
}

export interface Profile {
	id: string
	name: string
}

export interface Rating {
	id: number
	user_id: string
	version_id: number
	rating: string
	comment: string
	submitter_name: string
}

export interface Show {
	showdate: string
	location: string
	existingJam: Jam
	label: string
}
export interface Data {
	artists: Artist[]
	songs: SongInSonglist[]
	sounds: Sound[]
	user: any
	profile: Profile
	initialArtist: Artist
	initialSong: string
	initialDate: string
	initialLocation: string
	initialSounds: string[]
	initialSongObj: SongObj
	initialJam: Jam
}
