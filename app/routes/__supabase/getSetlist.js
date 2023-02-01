import { createServerClient } from '@supabase/auth-helpers-remix';
import { json } from '@remix-run/node';

export const loader = async ({ request, params }) => {
	console.log('in getSetlist.js');
	const response = new Response();
	const supabaseClient = createServerClient(
		process.env.SUPABASE_URL,
		process.env.SUPABASE_ANON_KEY,
		{ request, response }
	);
	let urlToFetch;
  let location
	const baseUrls = {
		eggyBaseUrl: 'https://thecarton.net/api/v1',
		gooseBaseUrl: 'https://elgoose.net/api/v1',
		umphreysBaseUrl: 'https://allthings.umphreys.com/api/v1',
		neighborBaseUrl: 'https://neighbortunes.net/api/v1',
		phishBaseUrl: 'https://api.phish.net/v5',
	};
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
		'King Gizzard & the Lizard Wizard': 'f58384a4-2ad2-4f24-89c5-c7b74ae1cce7',
		Lettuce: 'e88313e2-22f6-4f6d-9656-6d2ad20ea415',
		Lotus: 'b4681cdc-4002-4521-8458-ac812f1b6d28',
		'Medeski Martin & Wood': '6eed1ed9-ab02-45cd-a306-828bc1b98671',
		'moe.': '5fab339d-5dd4-42b0-8d70-496a4493ed59',
		'The Mothers of Invention': 'fe98e268-4ddd-441b-95a0-b219375f9ae4',
		Mungion: 'f5a881d7-9c6f-4135-88e6-677aa29547ca',
		'My Morning Jacket': 'ea5883b7-68ce-48b3-b115-61746ea53b8c',
		Osees: '194272cc-dcc8-4640-a4a6-66da7d250d5c',
		'Phil Lesh & Friends': 'ffb7c323-5113-4bb0-a5f7-5b657eec4083',
		'Railroad Earth': 'b2e2abfa-fb1e-4be0-b500-56c4584f41cd',
		'Sound Tribe Sector 9 (STS9)': '8d07ac81-0b49-4ec3-9402-2b8b479649a2',
		'String Cheese Incident': 'cff95140-6d57-498a-8834-10eb72865b29',
		'Tedeschi Trucks Band': 'e33e1ccf-a3b9-4449-a66a-0091e8f55a60',
		'Widespread Panic': '3797a6d0-7700-44bf-96fb-f44386bc9ab2',
	};
	const url = new URL(request.url);
	const searchParams = new URLSearchParams(url.search);
	const queryParams = Object.fromEntries(url.searchParams.entries());
	const artist = queryParams?.artist;
	const date = queryParams?.date;
	console.log('artist', artist, 'date', date);
	const { data, error } = await supabaseClient
		.from('versions')
		.select('*')
		.eq('artist', artist)
		.eq('date', date);
	console.log('data', data, 'error', error);
	let setlist;
	if (artist === 'Phish' || artist === 'Trey Anastasio, TAB') {
		let artistId;
		switch (artist) {
			case 'Phish':
				artistId = '1';
				break;
			case 'Trey Anastasio, TAB':
				artistId = '2';
				break;
			default:
				artistId = '1';
		}
		urlToFetch = `https://api.phish.net/v5/setlists/showdate/${date}.json?apikey=${process.env.PHISHNET_API_KEY}`;
		const setlistData = await fetch(urlToFetch);
		setlist = await setlistData.json();
		if (setlist && setlist.data && setlist.data.length > 0) {
      const song = setlist.data[0]
      location = `${song.venue}, ${song.city}, ${song?.country === 'USA' ? song.state : song.country}`
			const titles = setlist.data
				.filter((song) => song.artistid === artistId)
				.map(({ song }) => {
					if (song === 'Also Sprach Zarathustra') {
						return 'Also Sprach Zarathustra (2001)';
					}
					return song;
				});
			setlist = titles;
		}
	} else if (
		artist === 'Goose' ||
		artist === 'Eggy' ||
		artist === 'Neighbor' ||
		artist === "Umphrey's McGee"
	) {

		//use songfish api
			let baseUrl;
			switch (artist) {
				case 'Eggy':
					dbName = 'eggy_songs';
					baseUrl = baseUrls.eggyBaseUrl;
					break;
				case 'Goose':
					dbName = 'goose_songs';
					baseUrl = baseUrls.gooseBaseUrl;
					break;
				case "Umphrey's McGee":
					dbName = 'um_songs';
					baseUrl = baseUrls.umphreysBaseUrl;
					break;
				case 'Neighbor':
					dbName = 'neighbor_songs';
					baseUrl = baseUrls.neighborBaseUrl;
			}
      const url = `${baseUrl}/setlists/showdate/${date}`
    const setlistData = await fetch(url)
    setlist = await setlistData.json()
    if (setlist && setlist.data && setlist.data.length > 0) {
      const song = setlist.data[0]
      location = `${song.venuename}, ${song.city}, ${song?.country === 'USA' ? song.state : song.country}`
      const titles = setlist.data
        .filter((song) => song.artist_id === '1')
        .map(({ songname }) => {
          if (songname === 'Echo Of A Rose') return 'Echo of a Rose'
          return songname
        })
      setlist = titles
    }
	} else {
    		//setlistfm for all other artists
    const [year, month, day] = date.split('-')
  const transformedDate = [day, month, year].join('-')
  const mbid = mbids[artist]
  const setlistFMUrl = `https://api.setlist.fm/rest/1.0/search/setlists?artistMbid=${mbid}&date=${transformedDate}`
  let apiKey = process.env.SETLISTFM_API_KEY
      const setlistData = await fetch(setlistFMUrl, {
        headers: {
          'x-api-key': `${apiKey}`,
          'Accept': 'application/json'
        }
      })
      setlist = await setlistData.json()
      if (setlist && setlist.setlist && setlist.setlist.length > 0) {
        const song = setlist.setlist[0]
        location = `${song.venue.name}, ${song.venue.city.name}, ${song.venue.city.country.code === 'US' ? song.venue.city.stateCode : song.venue.city.country.name}`
        const titles = setlist.setlist[0].sets.set
          .map(({ song }) => song.map(({ name }) => name))
          .flat()
        setlist = titles
      }
	}
	return json(
		{ setlist: setlist || [],
    location },
		{
			headers: response.headers,
		}
	);
};
