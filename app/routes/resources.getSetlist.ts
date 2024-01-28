//create loader function
import { createServerClient, parse, serialize } from '@supabase/ssr'
import { json } from '@remix-run/node'

export const loader = async ({ request, params }) => {
	const response = new Response()
	const cookies = parse(request.headers.get('Cookie') ?? '')
	const headers = new Headers()

	const supabase = createServerClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
		cookies: {
			get(key) {
				return cookies[key]
			},
			set(key, value, options) {
				headers.append('Set-Cookie', serialize(key, value, options))
			},
			remove(key, options) {
				headers.append('Set-Cookie', serialize(key, '', options))
			},
		},
	})
	let urlToFetch
	let location
	let dbName
	const baseUrls = {
		eggyBaseUrl: 'https://thecarton.net/api/v2',
		gooseBaseUrl: 'https://elgoose.net/api/v2',
		umphreysBaseUrl: 'https://allthings.umphreys.com/api/v2',
		neighborBaseUrl: 'https://neighbortunes.net/api/v2',
		phishBaseUrl: 'https://api.phish.net/v5',
		tapersChoiceBaseUrl: 'https://taperschoice.net/api/v2',
		kglwBaseUrl: 'https://kglw.net/api/v2',
	}
	const mbids = {
		'The Allman Brothers Band': '72359492-22be-4ed9-aaa0-efa434fb2b01',
		Aqueous: '5df34416-d6dd-4692-b92d-86f81d724b9d',
		'Billy Strings': '640db492-34c4-47df-be14-96e2cd4b9fe4',
		'Chris Robinson Brotherhood': '21e31312-bfc1-4425-a93b-bab5cc5969af',
		'Dead & Company': '94f8947c-2d9c-4519-bcf9-6d11a24ad006',
		'Disco Biscuits': '4e43632a-afef-4b54-a822-26311110d5c5',
		Dizgo: '8374fe36-ccb2-463b-89c2-5f37a264400f',
		Dopapod: '1f8c1417-ddf7-41f0-9f54-2d5b847c6a80',
		'Frank Zappa': 'e20747e7-55a4-452e-8766-7b985585082d',
		Furthur: '39e07389-bbc0-4629-9ceb-dbd0d13b85fe',
		'Ghost Light': 'a0fa7565-82ff-4744-b932-633b7a4fe249',
		"Gov't Mule": 'f8796712-19fd-49ca-9cc7-99c30215b3cd',
		'Grateful Dead': '6faa7ca7-0d99-4a5e-bfa6-1fd5037520c6',
		'Greensky Bluegrass': '199596a3-a1af-49f8-8795-259eff8461fb',
		'Jerry Garcia Band, Legion of Mary': '3f7a73e5-cb7f-4488-bd7e-f5e26c87fe1b',
		"Joe Russo's Almost Dead": '84a69823-3d4f-4ede-b43f-17f85513181a',
		'King Gizzard': 'f58384a4-2ad2-4f24-89c5-c7b74ae1cce7',
		Lettuce: 'e88313e2-22f6-4f6d-9656-6d2ad20ea415',
		Lotus: 'b4681cdc-4002-4521-8458-ac812f1b6d28',
		'Medeski Martin & Wood': '6eed1ed9-ab02-45cd-a306-828bc1b98671',
		'moe.': '5fab339d-5dd4-42b0-8d70-496a4493ed59',
		'The Mothers of Invention': 'fe98e268-4ddd-441b-95a0-b219375f9ae4',
		Mungion: 'f5a881d7-9c6f-4135-88e6-677aa29547ca',
		'My Morning Jacket': 'ea5883b7-68ce-48b3-b115-61746ea53b8c',
		Osees: '194272cc-dcc8-4640-a4a6-66da7d250d5c',
		'Phil Lesh & Friends': 'ffb7c323-5113-4bb0-a5f7-5b657eec4083',
		'Pigeons Playing Ping Pong': 'ec8e3cea-69f0-4ff3-b42c-74937d336334',
		'Railroad Earth': 'b2e2abfa-fb1e-4be0-b500-56c4584f41cd',
		'The Radiators': '4bd3fb40-1c6f-4056-a0ee-8427685586fc',
		'Sound Tribe Sector 9 (STS9)': '8d07ac81-0b49-4ec3-9402-2b8b479649a2',
		Spafford: 'a4ad4581-721e-4123-aa3e-15b36490cf0f',
		'String Cheese Incident': 'cff95140-6d57-498a-8834-10eb72865b29',
		'Tedeschi Trucks Band': 'e33e1ccf-a3b9-4449-a66a-0091e8f55a60',
		"Umphrey's McGee": '3826a6e0-9ea5-4007-941c-25b9dd943981',
		Twiddle: '5cf454bc-3be0-47ba-9d0b-1e53da631a4e',
		'Widespread Panic': '3797a6d0-7700-44bf-96fb-f44386bc9ab2',
	}
	const url = new URL(request.url)
	const searchParams = new URLSearchParams(url.search)
	const queryParams = Object.fromEntries(url.searchParams.entries())
	const artist = queryParams?.artist.trim()
	const date = queryParams?.date
	console.log('artist, date', artist, date)
	let jfVersions
	const { data, error } = await supabase.from('versions').select('*').eq('artist', artist).eq('date', date)
	if (error) {
		return new Response(error.message, { status: 500 })
	} else {
		jfVersions = data
	}
	let setlist = []
	console.log('artist in getSetlist', artist)
	//phish or tab
	if (artist === 'Phish' || artist === 'Trey Anastasio, TAB') {
		let artistId
		switch (artist) {
			case 'Phish':
				artistId = '1'
				break
			case 'Trey Anastasio, TAB':
				artistId = '2'
				break
			default:
				artistId = '1'
		}
		urlToFetch = `https://api.phish.net/v5/setlists/showdate/${date}.json?apikey=${process.env.PHISHNET_API_KEY}`
		const setlistData = await fetch(urlToFetch)
		setlist = await setlistData.json()
		if (setlist && setlist.data && setlist.data.length > 0) {
			const song = setlist.data[0]
			location = `${song.venue}, ${song.city}, ${song?.country === 'USA' ? song.state : song.country}`
			const titles = setlist.data
				.filter((song) => song.artistid === artistId)
				.map((song) => {
					let title = song.song
					if (song.song === 'Also Sprach Zarathustra') title = 'Also Sprach Zarathustra (2001)'
					const alreadyAdded = jfVersions.find(({ song_name }) => song_name === song.song)
					return {
						label: `${song.isjamchart === '1' ? '☆ ' : ''}${alreadyAdded ? '(Added) ' + title : title}`,
						value: title,
					}
				})
			setlist = titles
		}
	} else if (
		//songfish artists
		artist === 'Goose' ||
		artist === 'Eggy' ||
		artist === 'Neighbor' ||
		// artist === "Umphrey's McGee" ||
		artist === "Taper's Choice" ||
		artist === 'King Gizzard'
	) {
		//use songfish api
		let baseUrl
		switch (artist) {
			case 'Eggy':
				dbName = 'eggy_songs'
				baseUrl = baseUrls.eggyBaseUrl
				break
			case 'Goose':
				dbName = 'goose_songs'
				baseUrl = baseUrls.gooseBaseUrl
				break
			case "Umphrey's McGee":
				dbName = 'um_songs'
				baseUrl = baseUrls.umphreysBaseUrl
				break
			case 'Neighbor':
				dbName = 'neighbor_songs'
				baseUrl = baseUrls.neighborBaseUrl
			case "Taper's Choice":
				dbName = 'tapers_choice_songs'
				baseUrl = baseUrls.tapersChoiceBaseUrl
			case 'King Gizzard':
				dbName = 'kglw_songs'
				baseUrl = baseUrls.kglwBaseUrl
		}
		const url = `${baseUrl}/setlists/showdate/${date}`
		console.log('url to fetch: ', url)
		const setlistData = await fetch(url)
		setlist = await setlistData.json()
		console.log('setlist: ', setlist)
		if (setlist && setlist.data && setlist.data.length > 0) {
			const song = setlist.data[0]
			location = `${song.venuename}, ${song.city}, ${song?.country === 'USA' ? song.state : song.country}`
			const titles = setlist.data
				.filter((song) => song.artist_id === 1)
				.map((song) => {
					let title = song.songname
					if (song.songname === 'Echo Of A Rose') title = 'Echo of a Rose'
					const alreadyAdded = jfVersions.find(({ song_name }) => song_name === song.songname)
					return {
						label: `${song.isjamchart === '1' ? '☆ ' : ''}${alreadyAdded ? '(Added) ' + title : title}`,
						value: title,
					}
				})
			console.log('titles: ', titles)
			console.log('location: ', location)
			setlist = titles
		}
	} else {
		//setlistfm for all other artists
		const [year, month, day] = date.split('-')
		const transformedDate = [day, month, year].join('-')
		const mbid = mbids[artist]
		const setlistFMUrl = `https://api.setlist.fm/rest/1.0/search/setlists?artistMbid=${mbid}&date=${transformedDate}`
		console.log('setlistfm url', setlistFMUrl)
		let apiKey = process.env.SETLISTFM_API_KEY
		const setlistData = await fetch(setlistFMUrl, {
			headers: {
				'x-api-key': `${apiKey}`,
				Accept: 'application/json',
			},
		})
		setlist = await setlistData.json()
		console.log('setlistfm setlist', setlist)
		if (setlist && setlist.setlist && setlist.setlist.length > 0) {
			const song = setlist.setlist[0]
			location = `${song.venue.name}, ${song.venue.city.name}, ${song.venue.city.country.code === 'US' ? song.venue.city.stateCode : song.venue.city.country.name
				}`
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
						}
					})
				)
				.flat()
			setlist = titles
		}
	}
	console.log('setlist', setlist)
	console.log('location', location)
	return json(
		{ setlist: setlist || [], location },
		{
			headers: response.headers,
		}
	)
}
