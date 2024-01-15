import { Outlet, useLoaderData, useFetcher } from '@remix-run/react'
import { createServerClient, parse, serialize } from '@supabase/ssr'
import { json } from '@remix-run/node'
import { useState, useEffect, useRef } from 'react'
import JamsHome from '../components/JamsHome'
import Hero from '../components/Hero'
import { getArtists, filterArtists } from '../modules/artist'
import { getSongById, getSongs } from '../modules/song'
import { getSounds, filterSounds } from '../modules/sound'
import { loadJams, buildTitle } from '../modules/jam'
import { getProfile } from '../modules/profile'
import AutoSizer from 'react-virtualized-auto-sizer'
import JamList from '../components/JamList'
import JamFiltersSlideout from '../components/JamFilters'
import FiltersButton from '../components/FiltersButton'
import JamsTitle from '../components/JamsTitle'
import VirtualJamList from '../components/VirtualJamList'
import JamFiltersClientside from '../components/JamFiltersClientside'

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

	return json(
		{
			artists,
			songs,
			jamsFromServer: jams,
			sounds,
			fullTitle,
			title,
			count: jams.length,
			profile,
			search: url.search,
		},
		{
			headers: response.headers,
		}
	)
}

const useWindowHeight = () => {
	// Initialize state with a default value
	const [height, setHeight] = useState(0)

	useEffect(() => {
		// Define a function to update the state with the current window height
		const updateHeight = () => {
			setHeight(window.innerHeight)
		}

		// Update the height once the component mounts
		updateHeight()

		// Optionally, listen for window resize events and update the height
		window.addEventListener('resize', updateHeight)

		// Cleanup function to remove the event listener
		return () => window.removeEventListener('resize', updateHeight)
	}, []) // Empty dependency array ensures this runs once on mount

	return height
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
	const [iframeUrl, setIframeUrl] = useState('')
	const [showRatings, setShowRatings] = useState(false)
	const headerRef = useRef(null)
	const [headerHeight, setHeaderHeight] = useState(0)
	const [filteredJams, setFilteredJams] = useState(jamsFromServer)
	const [artistFilters, setArtistFilters] = useState([])
	const [songFilter, setSongFilter] = useState('')
	const [soundFilters, setSoundFilters] = useState([])
	const [orderBy, setOrderBy] = useState('avg_rating')
	const [showComments, setShowComments] = useState(false)
	const [beforeDateFilter, setBeforeDateFilter] = useState('')
	const [afterDateFilter, setAfterDateFilter] = useState('')
	const [dateFilter, setDateFilter] = useState('')
	const [linkFilter, setLinkFilter] = useState(false)
	const [spotifyFilter, setSpotifyFilter] = useState(false)
	const [youtubeFilter, setYoutubeFilter] = useState(false)
	const [appleFilter, setAppleFilter] = useState(false)

	const windowHeight = useWindowHeight()
	useEffect(() => {
		if (headerRef.current) {
			setHeaderHeight(headerRef.current.clientHeight)
		}
	}, [])

	useEffect(() => {
		console.log('artistFilters', artistFilters)
		let filtered = jamsFromServer
		if (artistFilters.length > 0) {
			filtered = filtered.filter((jam) => {
				return artistFilters.includes(jam.artist_id.toString())
			})
		}
		if (songFilter) {
			console.log('songFilter', songFilter, typeof songFilter)
			//filter by song id
			filtered = filtered.filter((jam) => {
				return jam.song.toString() === songFilter
			})
		}
		if (linkFilter) {
			filtered = filtered.filter((jam) => {
				return jam.listen_link
			})
		}
		setFilteredJams(filtered)
	}, [artistFilters, songFilter, soundFilters, beforeDateFilter, afterDateFilter, dateFilter, linkFilter])

	console.log('filteredJams', filteredJams[0])

	return (
		<>
			{!search && <Hero open={open} setOpen={setOpen} />}
			<div className="bg-gray-100">
				<div className="flex-column justify-center items-center pt-3 pb-0 mb-0" ref={headerRef}>
					<JamsTitle title={title} />
					<FiltersButton open={open} setOpen={setOpen} />
				</div>
				<JamFiltersClientside
					sounds={sounds}
					artists={artists}
					songs={songs}
					open={open}
					setOpen={setOpen}
					totalCount={count}
					search={search}
					showIframe={showIframe}
					setArtistFilters={setArtistFilters}
					setSongFilter={setSongFilter}
					setSoundFilters={setSoundFilters}
					setBeforeDateFilter={setBeforeDateFilter}
					setAfterDateFilter={setAfterDateFilter}
					setDateFilter={setDateFilter}
					setShowComments={setShowComments}
					setShowRatings={setShowRatings}
					setOrderBy={setOrderBy}
					songFilter={songFilter}
					artistFilters={artistFilters}
					soundFilters={soundFilters}
					beforeDateFilter={beforeDateFilter}
					afterDateFilter={afterDateFilter}
					dateFilter={dateFilter}
					showComments={showComments}
					showRatings={showRatings}
					orderBy={orderBy}
					jamsLength={filteredJams.length}
					linkFilter={linkFilter}
					setLinkFilter={setLinkFilter}
				/>
				<VirtualJamList
					items={filteredJams}
					user={user}
					setShowIframe={setShowIframe}
					setIframeUrl={setIframeUrl}
					showRatings={showRatings}
					headerHeight={headerHeight}
					windowHeight={windowHeight}
				/>
				{/* <JamList
					sounds={sounds}
					title={title}
					user={user}
					profile={profile}
					search={search}
					jams={jamsFromServer}
					showIframe={showIframe}
					setShowIframe={setShowIframe}
				/> */}
			</div>
		</>
	)
}
