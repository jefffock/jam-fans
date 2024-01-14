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
	let { data: artists } = await supabase
		.from('artists')
		.select('nickname, emoji_code, url, artist')
		.order('name_for_order', { ascending: true })

	const url = new URL(request.url)
	const searchParams = new URLSearchParams(url.search)
	const queryParams = Object.fromEntries(url.searchParams.entries())

	delete queryParams['show-ratings']
	delete queryParams['limit[label]']

	const stringParams = JSON.stringify(queryParams)

	//iterate through queryParamsArray and build a supabase query
	let song
	let date
	let beforeDate
	let afterDate
	let orderBy = 'avg_rating'
	let asc = false
	let limit = 100
	let showListenable
	let urlToShow
	let queryObjToStore = {}
	let soundsInQuery = []
	let artistsInQuery = []

	for (const [key, value] of Object.entries(queryParams)) {
		if (key.includes('sound')) {
			soundsInQuery.push(value)
		}
		if (key.includes('artist')) {
			artistsInQuery.push(value)
		}
		if (key.includes('song')) {
			song = value
		}
		if (key.includes('before')) {
			beforeDate = value
		}
		if (key.includes('after')) {
			afterDate = value
		}
		if (key.includes('order')) {
			orderBy = value
		}
		if (key.includes('asc')) {
			asc = true
		}
		if (key.includes('limit')) {
			limit = value
		}
		if (key.includes('show-links')) {
			showListenable = true
		}
		if (key.includes('date')) {
			date = value
		}
	}

	let jams = supabase.from('versions').select('*', { count: 'exact', head: true })

	let artistsInQueryNames = []
	if (artistsInQuery?.length > 0) {
		//if first element is null, break
		if (artistsInQuery[0] !== 'null') {
			artistsInQuery.forEach((artist) => {
				artistsInQueryNames.push(artists.find((a) => a.url === artist).artist)
			})
			jams = jams.in('artist', artistsInQueryNames)
		}
	}
	if (song) {
		jams = jams.eq('song_name', song)
	}
	if (afterDate) {
		let after = afterDate + '-01-01'
		jams = jams.gte('date', after)
	}
	if (beforeDate) {
		let before = beforeDate + '-12-31'
		jams = jams.lte('date', before)
	}
	if (soundsInQuery) {
		soundsInQuery.forEach((sound) => {
			jams = jams.eq(sound, true)
		})
	}
	if (showListenable) {
		jams = jams.not('listen_link', 'is', null)
	}
	if (date) {
		let year = date.slice(4, 8)
		let month = date.slice(0, 2)
		let day = date.slice(2, 4)
		date = year + '-' + month + '-' + day
		console.log('date in jamscount', date)
		jams = jams.eq('date', date)
	}
	const { count } = await jams
	return json(
		{ count },
		{
			headers: response.headers,
		}
	)
}
