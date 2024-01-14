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
import { getProfile } from '../modules/profile'
import { set } from 'zod'

export const loader = async ({ request }) => {
	const response = new Response()

	const url = new URL(request.url)
	const searchParams = new URLSearchParams(url.search)
	const queryParams = Object.fromEntries(searchParams)

	const jams = await loadJams(queryParams)
	const artists = await getArtists()
	const songs = await getSongs()
	const sounds = await getSounds()
	const profile = await getProfile()
	const page = queryParams.page || 1

	return json(
		{
			artists,
			songs,
			jamsFromServer: jams,
			sounds,
			fullTitle: 'Jams',
			title: 'Jams',
			count: 100,
			profile,
			pageFromServer: page,
			search: url.search,
		},
		{
			headers: response.headers,
		}
	)
}

export default function Jams() {
	const { artists, songs, sounds, fullTitle, title, count, search, user, profile, jamsFromServer, pageFromServer } =
		useLoaderData()
	const [open, setOpen] = useState(false)
	const [scrollPosition, setScrollPosition] = useState(0)
	const [clientHeight, setClientHeight] = useState(null)
	const [shouldFetch, setShouldFetch] = useState(true)
	const [height, setHeight] = useState(null)
	const [page, setPage] = useState(pageFromServer)
	const fetcher = useFetcher()
	const [urlToLoad, setUrlToLoad] = useState(null)
	const [jams, setJams] = useState(jamsFromServer)
	const [newSearch, setNewSearch] = useState(search)
	const [isFetching, setIsFetching] = useState(false)

	if (!artists) return <div>Loading...</div>

	const fetchContent = () => {
		let urlToFetch = `/jams?${newSearch}&page=${page}`
		console.log('urlToFetch', urlToFetch)
		fetcher.load(urlToFetch)
	}

	const isScrollNearBottom = () => {
		const scrollPosition = window.innerHeight + document.documentElement.scrollTop
		const threshold = document.documentElement.offsetHeight - 1500
		if (scrollPosition >= threshold) {
			setIsFetching(true)
		}
		return scrollPosition >= threshold
	}

	const handleScroll = () => {
		if (isScrollNearBottom() && !isFetching) {
			setPage((prevPage) => prevPage + 1)
		}
	}

	useEffect(() => {
		if (typeof window !== 'undefined') {
			window.addEventListener('scroll', handleScroll)
		}

		return () => {
			if (typeof window !== 'undefined') {
				window.removeEventListener('scroll', handleScroll)
			}
		}
	}, [isFetching])

	useEffect(() => {
		fetchContent()
	}, [page])

	useEffect(() => {
		if (!fetcher.data || fetcher.state === 'loading') {
			return
		}
		if (fetcher.data.jamsFromServer.length > 0) {
			console.log('jams', jams)
			console.log('fetcher.data.jamsFromServer', fetcher.data.jamsFromServer)
			if (fetcher.data.jamsFromServer[fetcher.data.jamsFromServer.length - 1].id !== jams[jams.length - 1].id) {
				console.log('appending jams')
				setJams((jams) => [...jams, ...fetcher.data.jamsFromServer])
				// setIsFetching(false)
			}
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
