import { createServerClient } from '@supabase/auth-helpers-remix';
import { json } from '@remix-run/node';

export const loader = async ({ request, params }) => {
	const response = new Response();
	const supabaseClient = createServerClient(
		process.env.SUPABASE_URL,
		process.env.SUPABASE_ANON_KEY,
		{ request, response }
	);

	async function wait500() {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve('resolved');
			}, 500);
		});
	}

	const baseUrls = {
		eggyBaseUrl: 'https://thecarton.net/api/v1',
		gooseBaseUrl: 'https://elgoose.net/api/v1',
		umphreysBaseUrl: 'https://allthings.umphreys.com/api/v1',
		neighborBaseUrl: 'https://neighbortunes.net/api/v1',
		phishBaseUrl: 'https://api.phish.net/v5',
    tapersChoiceBaseUrl: 'https://taperschoice.net/api/v1',
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
		'Pigeons Playing Ping Pong': 'ec8e3cea-69f0-4ff3-b42c-74937d336334',
		'Railroad Earth': 'b2e2abfa-fb1e-4be0-b500-56c4584f41cd',
		'Sound Tribe Sector 9 (STS9)': '8d07ac81-0b49-4ec3-9402-2b8b479649a2',
		Spafford: 'a4ad4581-721e-4123-aa3e-15b36490cf0f',
		'String Cheese Incident': 'cff95140-6d57-498a-8834-10eb72865b29',
		'Tedeschi Trucks Band': 'e33e1ccf-a3b9-4449-a66a-0091e8f55a60',
		Twiddle: '5cf454bc-3be0-47ba-9d0b-1e53da631a4e',
		'Widespread Panic': '3797a6d0-7700-44bf-96fb-f44386bc9ab2',
	};
	const url = new URL(request.url);
	const searchParams = new URLSearchParams(url.search);
	const queryParams = Object.fromEntries(url.searchParams.entries());

	const artist = queryParams?.artist;
	let song = queryParams?.song;
	const year = queryParams?.year;
	let shows;
	let songId
  let jfVersions = []
	//get all versions of a song (for select artists)
	if (artist && song && !year) {
		const { data, error } = await supabaseClient
			.from('versions')
			.select('*')
			.eq('artist', artist)
			.eq('song_name', song);
    jfVersions = data
		//if artistis phish or tab, use phisnet api
		if (artist === 'Phish' || artist === 'Trey Anastasio, TAB') {
			const artistId = artist === 'Phish' ? '1' : '2';
			const tableName = artist === 'Phish' ? 'phishnet_songs' : 'tab_songs';
			switch (song) {
				case 'Also Sprach Zarathustra (2001)':
					songId = 21;
					break;
				default:
					const { data, error } = await supabaseClient
						.from(tableName)
						.select('songid')
						.eq('song', song);
					if (error || data.length === 0) {
						console.error('error getting phishnet songs from supabase', error);
						return json({ shows: [] }, { status: 500 });
					}
					songId = data[0]?.songid;
			}
			if (songId) {
				const url = `https://api.phish.net/v5/setlists/songid/${songId}.json?apikey=${process.env.PHISHNET_API_KEY}`;
				shows = await fetch(url);
				shows = await shows.json();
				shows = shows?.data
					.filter((show) => show.artistid === artistId)
					.map((show) => {
						const date = new Date(show.showdate + 'T18:00:00Z');
						const alreadyAdded = jfVersions.find((version) => version.date === show.showdate);
						return {
							showdate: show.showdate,
							location: `${show.venue}, ${show.city}, ${
								show.country === 'USA' ? show.state : show.country
							}`,
							artistid: show.artistid,
							label: `${show.isjamchart === '1' ? '☆ ' : ''}${
								alreadyAdded ? '(Added) ' : ''
							}${show.showdate} - ${show.venue}, ${show.city}, ${
								show.country === 'USA' ? show.state : show.country
							}`,
							existingJam: alreadyAdded ?? null,
						};
					});
				shows = shows.reverse();
			}
		} else {
			//artist & song & not Phish or TAB = use songfish api
			if (song === 'Echo of a Rose') song = 'Echo Of A Rose';
			let dbName;
			let baseUrl;
      console.log('artist', artist)
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
        case "Taper's Choice":
          dbName = 'tapers_choice_songs';
          baseUrl = baseUrls.tapersChoiceBaseUrl;
			}
			let songId;
			//get song id from supabase
			console.log('dbName', dbName);
			console.log('song', song);
			const { data, error } = await supabaseClient
				.from(dbName)
				.select('id')
				.eq('name', song);
			if (error || data.length === 0) {
				console.error('error getting songfish songid from supabase', error);
				//todo: handle error
			} else {
				songId = data[0]?.id;
				const url = `${baseUrl}/setlists/song_id/${songId}`;
				shows = await fetch(url);
				shows = await shows.json();
				shows = shows?.data.map((show) => {
					const date = new Date(show.showdate + 'T18:00:00Z');
					const alreadyAdded = jfVersions.find((version) => version.date === show.showdate);
					return {
						showdate: show.showdate,
						location: `${show.venuename}, ${show.city}, ${
							show.country === 'USA' ? show.state : show.country
						}`,
						label: `${alreadyAdded ? '(Added) ' : ''}${show.showdate} - ${
							show.venuename
						}, ${show.city}, ${
							show.country === 'USA' ? show.state : show.country
						}`,
						existingJam: alreadyAdded ?? null,
					};
				});
				// shows = shows.reverse();
			}
		}
	} else if (artist && year) {
		//get shows by year
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
			const url = `https://api.phish.net/v5/shows/showyear/${year}.json?apikey=${process.env.PHISHNET_API_KEY}`;
			await fetch(url)
				.then((data) => data.json())
				.then((showsData) => {
					if (showsData && showsData.data && showsData.data.length > 0) {
						const showsRes = showsData.data
							.filter((song) => song.artistid === artistId)
							.map((show) => {
								const location = `${show.venue}, ${show.city}, ${
									show.country === 'USA' ? show.state : show.country
								}`;
								const date = new Date(show.showdate + 'T18:00:00Z');
								return {
									location,
									showdate: show.showdate,
									label: `${date.toLocaleDateString()} - ${location}`,
								};
							});
						shows = showsRes;
					}
				});
		} else if (
			artist === 'Goose' ||
			artist === 'Eggy' ||
			artist === 'Neighbor' ||
			artist === "Umphrey's McGee" ||
      artist === "Taper's Choice"
		) {
			let baseUrl;
			switch (artist) {
				case 'Goose':
					baseUrl = baseUrls.gooseBaseUrl;
					break;
				case 'Eggy':
					baseUrl = baseUrls.eggyBaseUrl;
					break;
				case "Umphrey's McGee":
					baseUrl = baseUrls.umphreysBaseUrl;
					break;
				case 'Neighbor':
					baseUrl = baseUrls.neighborBaseUrl;
					break;
        case "Taper's Choice":
          baseUrl = baseUrls.tapersChoiceBaseUrl;
			}
			// const url = `${baseUrl}/shows/show_year/${year}.json?order_by=showdate`
			const url = `${baseUrl}/shows/show_year/${year}.json?order_by=showdate`;
			const showsData = await fetch(url);
			const showsRes = await showsData.json();
			if (showsRes && showsRes.data && showsRes.data.length > 0) {
				shows = showsRes.data.map((show) => {
					const location = `${show.venuename}, ${show.city}, ${
						show.country === 'USA' ? show.state : show.country
					}`;
					const date = new Date(show.showdate + 'T18:00:00Z');
					return {
						location,
						showdate: show.showdate,
						label: `${date.toLocaleDateString()} - ${location}`,
					};
				});
			}
		} else {
			//get shows from setlistfm for all other artists
			const mbid = mbids[artist];
			const url = `https://api.setlist.fm/rest/1.0/search/setlists?artistMbid=${mbid}&year=${year}`;
			let apiKey = process.env.SETLISTFM_API_KEY;
			async function paginatedFetch(url, page = 1, previousResponse = []) {
				console.log('in paginated fetch', url, page, previousResponse);
				await new Promise((resolve) => setTimeout(resolve, 600));
				return fetch(`${url}&p=${page}`, {
					headers: {
						'x-api-key': `${apiKey}`,
						Accept: 'application/json',
					},
				}) // Append the page number to the base URL
					.then((response) => response.json())
					.then((newResponse) => {
						console.log('newResponse', newResponse);
						const setlist = newResponse?.setlist || [];

						const response = [...setlist, ...previousResponse]; // Combine the two arrays

						if (setlist?.length !== 0) {
							page++;

							return paginatedFetch(url, page, response);
						}

						return response;
					});
			}
			if (mbid && year) {
				const data = await paginatedFetch(url);
				shows = data.map((show) => {
					const location = `${show?.venue?.name ? show.venue.name + ', ' : ''}${
						show.venue.city.name
					}, ${
						show.venue.city.country.code === 'US'
							? show.venue.city.state
							: show.venue.city.country.name
					}`;
					//convert date to yyyy-mm-dd from dd-mm-yyyy
					const formattedDate = show.eventDate.split('-').reverse().join('-');
					const date = new Date(formattedDate + 'T12:00:00Z');
					return {
						location,
						showdate: formattedDate,
						label: `${date.toLocaleDateString()} - ${location}`,
					};
				});
			}
		}
	}
	if (artist && year) {
		shows.sort((a, b) => {
			return new Date(a.showdate) - new Date(b.showdate);
		});
	}
	if (artist && song) {
		shows.sort((a, b) => {
			return new Date(b.showdate) - new Date(a.showdate);
		});
	}
	return json(
		{ shows: shows || [] },
		{
			headers: response.headers,
		}
	);
};
