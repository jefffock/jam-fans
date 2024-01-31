import { db } from '../../database'

export async function getSetlist({ artist, date }) {
	const parsedArtist = JSON.parse(artist)
	const jfVersions = await db.jams.findMany({
		where: {
			artist: artist.artist,
			date: date,
		},
	})
	console.log('jfVersions', jfVersions)
	console.log('parsedArtist', parsedArtist)
	console.log('date', date)
	if (artist.data_source === 'Phishnet') {
		const { setlist, location } = await getPhishnetSetlist({ artist: parsedArtist, date, jfVersions })
		return { setlist, location }
	} else if (artist.date_source === 'Songfish') {
		const { setlist, location } = await getSongfishSetlist({ artist: parsedArtist, date, jfVersions })
		return { setlist, location }
	} else if (artist.data_source === 'SetlistFM') {
		const { setlist, location } = await getSetlistFMSetlist({ artist: parsedArtist, date, jfVersions })
		return { setlist, location }
	}
}

async function getPhishnetSetlist({ artist, date, jfVersions }) {
	let artistId
	switch (artist.artist) {
		case 'Phish':
			artistId = '1'
			break
		case 'Trey Anastasio, TAB':
			artistId = '2'
			break
		default:
			artistId = '1'
	}
	let urlToFetch = `${artist.baseUrl}/setlists/showdate/${date}.json?apikey=${process.env.PHISHNET_API_KEY}`
	const setlistData = await fetch(urlToFetch)
	let setlist = await setlistData.json()
	if (setlist && setlist.data && setlist.data.length > 0) {
		const song = setlist.data[0]
		const location = `${song.venue}, ${song.city}, ${song?.country === 'USA' ? song.state : song.country}`
		const titles = setlist.data
			.filter((song) => song.artistid === artistId)
			.map((song) => {
				let title = song.song
				if (song.song === 'Also Sprach Zarathustra') title = 'Also Sprach Zarathustra (2001)'
				const alreadyAdded = jfVersions.find(({ song_name }) => song_name === song.song)
				return {
					label: `${song.isjamchart === '1' ? '☆ ' : ''}${alreadyAdded ? '(Added) ' + title : title}`,
					value: title,
					jamId: alreadyAdded?.id,
				}
			})
		setlist = titles
		return { setlist, location }
	}
}

async function getSongfishSetlist({ artist, date, jfVersions }) {
	const url = `${artist.baseUrl}/setlists/showdate/${date}`
	const setlistData = await fetch(url)
	let setlist = await setlistData.json()
	if (setlist && setlist.data && setlist.data.length > 0) {
		const song = setlist.data[0]
		const location = `${song.venuename}, ${song.city}, ${song?.country === 'USA' ? song.state : song.country}`
		const titles = setlist.data
			.filter((song) => song.artist_id === 1)
			.map((song) => {
				let title = song.songname
				if (song.songname === 'Echo Of A Rose') title = 'Echo of a Rose'
				const alreadyAdded = jfVersions.find(({ song_name }) => song_name === song.songname)
				return {
					label: `${song.isjamchart === '1' ? '☆ ' : ''}${alreadyAdded ? '(Added) ' + title : title}`,
					value: title,
					jamId: alreadyAdded?.id,
				}
			})

		setlist = titles
		return { setlist, location }
	}
}

async function getSetlistFMSetlist({ artist, date, jfVersions }) {
	const [year, month, day] = date.split('-')
	const transformedDate = [day, month, year].join('-')
	const setlistFMUrl = `https://api.setlist.fm/rest/1.0/search/setlists?artistMbid=${artist.mbid}&date=${transformedDate}`
	console.log('setlistfm url', setlistFMUrl)
	let apiKey = process.env.SETLISTFM_API_KEY
	const setlistData = await fetch(setlistFMUrl, {
		headers: {
			'x-api-key': `${apiKey}`,
			Accept: 'application/json',
		},
	})
	let setlist = await setlistData.json()
	if (setlist && setlist.setlist && setlist.setlist.length > 0) {
		const song = setlist.setlist[0]
		const location = `${song.venue.name}, ${song.venue.city.name}, ${song.venue.city.country.code === 'US' ? song.venue.city.stateCode : song.venue.city.country.name}`
		const titles = setlist.setlist[0].sets.set
			.map(({ song }) =>
				song.map(({ name }) => {
					const alreadyAdded = jfVersions.find(({ song_name }) => song_name === name)
					if (name === '2 x 2') {
						name = '2x2'
					}
					return {
						label: alreadyAdded ? '(Added) ' + name : name,
						value: name,
						jamId: alreadyAdded?.id,
					}
				})
			)
			.flat()
		setlist = titles
		return { setlist, location }
	}
}
