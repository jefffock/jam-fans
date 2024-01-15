import { Outlet, useLoaderData, useFetcher } from '@remix-run/react'
import { createServerClient, parse, serialize } from '@supabase/ssr'
import { json } from '@remix-run/node'
import { useState, useEffect } from 'react'
import JamsHome from '../components/JamsHome'
import Hero from '../components/Hero'
import { getArtists, filterArtists } from '../modules/artist'
import { getSongById, getSongs } from '../modules/song'
import { getSounds, filterSounds } from '../modules/sound'
import { loadJams, buildTitle } from '../modules/jam'
import { getProfile } from '../modules/profile'
import AutoSizer from 'react-virtualized-auto-sizer'
import { InfiniteJamList } from '../components/VirtualJamList'
import JamList from '../components/JamList'
import JamFiltersSlideout from '../components/JamFilters'
import FiltersButton from '../components/FiltersButton'
import JamsTitle from '../components/JamsTitle'

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
	const filteredArtists = filterArtists({ artists, queryParams })
	const filteredSounds = filterSounds({ sounds, queryParams })
	let id = 12
	const song = getSongById({ songs, id })
	const { title, fullTitle } = buildTitle({
		queryParams,
		artists: filteredArtists,
		sounds: filteredSounds,
		song,
	})
	console.log('title', title)

	return json(
		{
			artists,
			songs,
			jamsFromServer: jams,
			sounds,
			fullTitle,
			title,
			count: 100,
			profile,
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
	// const [scrollPosition, setScrollPosition] = useState(0)
	// const [clientHeight, setClientHeight] = useState(null)
	// const [shouldFetch, setShouldFetch] = useState(true)
	// const [height, setHeight] = useState(null)
	// const [page, setPage] = useState(pageFromServer)
	// const fetcher = useFetcher()
	// const [urlToLoad, setUrlToLoad] = useState(null)
	// const [jams, setJams] = useState(jamsFromServer)
	// const [newSearch, setNewSearch] = useState(search)
	// const [isFetching, setIsFetching] = useState(false)
	const [showIframe, setShowIframe] = useState(false)

	return (
		<>
			{!search && <Hero open={open} setOpen={setOpen} />}
			<div className="bg-gray-100">
				<div className="flex-column justify-center items-center pt-3 pb-0 mb-0">
					<JamsTitle title={title} />
					<FiltersButton open={open} setOpen={setOpen} />
				</div>
				<JamFiltersSlideout
					sounds={sounds}
					artists={artists}
					songs={songs}
					open={open}
					setOpen={setOpen}
					totalCount={count}
					search={search}
					showIframe={showIframe}
				/>
				<JamList
					sounds={sounds}
					title={title}
					user={user}
					profile={profile}
					search={search}
					jams={jamsFromServer}
					showIframe={showIframe}
					setShowIframe={setShowIframe}
				/>
			</div>
		</>
	)
}
