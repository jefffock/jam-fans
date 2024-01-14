import { Outlet, useLoaderData, useFetcher } from '@remix-run/react'
import { createServerClient, parse, serialize } from '@supabase/ssr'
import { json } from '@remix-run/node'
import { useState, useEffect } from 'react'
import JamsHome from '../components/JamsHome'
import Hero from '../components/Hero'
import { getArtists } from '../modules/artist'
import { getSongs } from '../modules/song'
import { getSounds } from '../modules/sound'
import { loadJams } from '../modules/jam'

export const loader = async ({ request, params }) => {
	console.log('in /jams loader')
	const response = new Response()
	const cookies = parse(request.headers.get('Cookie') ?? '')
	const headers = new Headers()

	// let profile
	// if (user && user?.id && user != null) {
	// 	const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
	// 	profile = data
	// }
	// const { data: sounds } = await supabase.from('sounds').select('label, text').order('label', { ascending: true })
	// let { data: artists } = await supabase
	// 	.from('artists')
	// 	.select('nickname, emoji_code, url, artist')
	// 	.order('name_for_order', { ascending: true })

	const url = new URL(request.url)
	const searchParams = new URLSearchParams(url.search)
	const queryParams = Object.fromEntries(searchParams)

	const { data: jamsFetched } = await loadJams(queryParams)
	const { data: artists } = await getArtists()
	const { data: songs } = await getSongs()
	const { data: sounds } = await getSounds()

	// let count = await supabase.from('versions').select('*', { count: 'exact', head: true })
	// count = count.count
	const search = url.search

	return json(
		{
			artists,
			songs,
			initialJams: jamsFetched,
			sounds,
			fullTitle,
			title,
			count,
			search,
			user,
			profile,
			initialPage: page,
		},
		{
			headers: response.headers,
		}
	)
}

export default function Jams() {
	const { artists, songs, sounds, fullTitle, title, count, search, user, profile, initialJams, initialPage } =
		useLoaderData()
	const [open, setOpen] = useState(false)
	const [scrollPosition, setScrollPosition] = useState(0)
	const [clientHeight, setClientHeight] = useState(null)
	const [shouldFetch, setShouldFetch] = useState(true)
	const [height, setHeight] = useState(null)
	const [page, setPage] = useState(2)
	const fetcher = useFetcher()
	const [jams, setJams] = useState(initialJams)
	const [urlToLoad, setUrlToLoad] = useState(null)

	if (!artists) return <div>Loading...</div>

	useEffect(() => {
		const scrollListener = () => {
			setClientHeight(window.innerHeight)
			setScrollPosition(window.scrollY)
		}

		if (typeof window !== 'undefined') {
			window.addEventListener('scroll', scrollListener)
		}

		return () => {
			if (typeof window !== 'undefined') {
				window.removeEventListener('scroll', scrollListener)
			}
		}
	}, [])

	useEffect(() => {
		if (typeof document !== 'undefined' && urlToLoad) {
			console.log('loading', urlToLoad)
			fetcher.load(urlToLoad)
			setUrlToLoad(null)
		}
	}, [urlToLoad])

	useEffect(() => {
		if (typeof window !== 'undefined') {
			if (initialPage === 1) {
				setJams(initialJams)
			}
		}
	}, [initialJams])

	useEffect(() => {
		if (!shouldFetch || !height) return
		if (
			(page !== 2 && clientHeight + scrollPosition + 2000 < height) ||
			(page === 2 && clientHeight + scrollPosition + 1500 < height)
		)
			return
		let newSearch = search.slice(1)
		let urlToFetch = `/jams?index&${newSearch}&page=${page}`
		fetcher.load(urlToFetch)
		setShouldFetch(false)
	}, [clientHeight, scrollPosition])

	useEffect(() => {
		if (fetcher.data && fetcher.data.initialJams.length === 0) {
			setShouldFetch(false)
			return
		}

		if (fetcher.data && fetcher.data.initialJams.length > 0) {
			setJams((jams) => [...jams, ...fetcher.data.initialJams])
			setPage((page) => page + 1)
			setShouldFetch(true)
		}
	}, [fetcher.data])

	return (
		<>
			{!search && <Hero open={open} setOpen={setOpen} />}
			<JamsHome
				artists={artists}
				songs={songs}
				jams={jams}
				sounds={sounds}
				open={open}
				setOpen={setOpen}
				fullTitle={fullTitle}
				title={title}
				count={count}
				search={search}
				user={user}
				profile={profile}
				setHeight={setHeight}
				setUrlToLoad={setUrlToLoad}
			/>
		</>
	)
}
