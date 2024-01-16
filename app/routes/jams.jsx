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
import JamList from '../components/JamList'
import JamFiltersSlideout from '../components/JamFilters'
import FiltersButton from '../components/FiltersButton'
import JamsTitle from '../components/JamsTitle'
import VirtualJamList from '../components/VirtualJamList'
import JamFiltersClientside from '../components/JamFiltersClientside'
import { useWindowHeight, useWindowWidth } from '../utils'
import JamCard from '../components/cards/JamCard'
import { date } from 'zod'

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
	let song_id = queryParams.song
	const song = getSongById({ songs, id: song_id })

	return json(
		{
			artists,
			songs,
			jamsFromServer: jams,
			sounds,
			count: jams.length,
			profile,
			search: url.search,
		},
		{
			headers: response.headers,
		}
	)
}

export default function Jams() {
	const { artists, songs, sounds, count, search, user, profile, jamsFromServer, pageFromServer } = useLoaderData()
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
	const [allJams, setAllJams] = useState(jamsFromServer)
	const [showIframe, setShowIframe] = useState(false)
	const [iframeUrl, setIframeUrl] = useState('')
	const [showRatings, setShowRatings] = useState(false)
	const headerRef = useRef(null)
	const pageRef = useRef(null)
	const [headerHeight, setHeaderHeight] = useState(0)
	const [filteredJams, setFilteredJams] = useState(jamsFromServer)
	const [artistFilters, setArtistFilters] = useState([])
	const [songFilter, setSongFilter] = useState('')
	const [soundFilters, setSoundFilters] = useState([])
	const [orderBy, setOrderBy] = useState('avg_rating')
	const [showComments, setShowComments] = useState(false)
	const [beforeDateFilter, setBeforeDateFilter] = useState(null)
	const [afterDateFilter, setAfterDateFilter] = useState('')
	const [dateFilter, setDateFilter] = useState('')
	const [linkFilter, setLinkFilter] = useState(false)
	const [spotifyFilter, setSpotifyFilter] = useState(false)
	const [youtubeFilter, setYoutubeFilter] = useState(false)
	const [appleFilter, setAppleFilter] = useState(false)
	const [scrollTop, setScrollTop] = useState(0)
	const jamListRef = useRef(null)
	const jamCardRef = useRef(null)
	const [jamCardHeight, setJamCardHeight] = useState(0)
	const prevJamListRef = useRef(null)

	if (jamCardRef.current) {
		if (jamCardHeight !== jamCardRef.current?.clientHeight) {
			setJamCardHeight(jamCardRef.current?.clientHeight)
		}
	}

	const windowHeight = useWindowHeight()
	const windowWidth = useWindowWidth()

	useEffect(() => {
		if (headerRef.current) {
			setHeaderHeight(headerRef.current.clientHeight)
		}
	}, [])

	const scrollToTop = (ref) => {
		if (ref.current) {
			// Use appropriate method based on the library
			ref.current.scrollTop = 0 // For react-window
			// listRef.current.scrollToRow(0); // For react-virtualized
		}
	}

	// const scrollToBottom = (ref) => {
	// 	if (ref.current) {
	// 		// The maximum scrollable amount is scrollHeight - clientHeight
	// 		const maxScrollTop = ref.current.scrollHeight - ref.current.clientHeight
	// 		ref.current.scrollTop = maxScrollTop
	// 	}
	// }

	const scrollToBottomOfWindow = () => {
		window?.scrollTo({
			top: document.body.scrollHeight,
			behavior: 'smooth',
		})
	}

	const scrollToTopOfWindow = () => {
		window?.scrollTo({
			top: 0,
			behavior: 'smooth',
		})
	}
	const scrollingDown = prevJamListRef.current < scrollTop

	if (jamListRef.current && scrollTop > 100 && scrollingDown) {
		if (window) {
			scrollToBottomOfWindow()
		}
	}

	if (jamListRef.current && scrollTop < 10 && !scrollingDown) {
		if (window) {
			scrollToTopOfWindow()
		}
	}

	useEffect(() => {
		let filtered = allJams
		if (artistFilters.length > 0) {
			filtered = filtered.filter((jam) => {
				return artistFilters.includes(jam.artist_id.toString())
			})
		}
		if (songFilter) {
			//filter by song id
			filtered = filtered.filter((jam) => {
				return jam.song_name === songFilter
			})
		}
		if (linkFilter) {
			filtered = filtered.filter((jam) => {
				return jam.listen_link
			})
		}
		if (soundFilters.length > 0) {
			filtered = filtered.filter((jam) => {
				return soundFilters.every((filter) => jam.sound_ids.includes(filter.toString()))
			})
		}
		if (dateFilter) {
			filtered = filtered.filter((jam) => {
				return jam.date === dateFilter
			})
		}
		if (beforeDateFilter) {
			console.log('beforeDateFilter', beforeDateFilter)
			filtered = filtered.filter((jam) => {
				return jam.year <= beforeDateFilter
			})
		}
		if (afterDateFilter) {
			console.log('afterDateFilter', afterDateFilter)
			filtered = filtered.filter((jam) => {
				return jam.year >= Number(afterDateFilter)
			})
		}
		console.log('filtered length after filtering', filtered.length)
		setFilteredJams(filtered)
		scrollToTop(jamListRef)
		// scrollToTopOfWindow()
	}, [artistFilters, songFilter, soundFilters, beforeDateFilter, afterDateFilter, dateFilter, linkFilter, allJams])

	const artistNames = artistFilters.map((id) => {
		return artists.find((artist) => artist.id === parseInt(id))?.artist
	})
	const soundNames = soundFilters.map((id) => {
		return sounds.find((sound) => sound.id === parseInt(id))?.label
	})
	const { title } = buildTitle({
		queryParams: search,
		beforeDateFilter,
		afterDateFilter,
		artistNames,
		soundNames,
		songFilter,
		artists,
		songs,
		sounds,
	})

	return (
		<div ref={pageRef}>
			{!search && <Hero />}
			<div className="bg-gray-100">
				<div className="flex-column justify-center items-center pt-3 pb-2 mb-0" ref={headerRef}>
					<JamsTitle title={title} />
					<FiltersButton open={open} setOpen={setOpen} />
					<div
						className={`w-112 max-w-full ${scrollTop ? 'shadow-bottom' : ''} h-2 mx-auto z-100 mb-1`}
					></div>
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
					jamListRef={jamListRef}
					items={filteredJams}
					user={user}
					setShowIframe={setShowIframe}
					setIframeUrl={setIframeUrl}
					showRatings={showRatings}
					headerHeight={headerHeight}
					windowHeight={windowHeight}
					windowWidth={windowWidth}
					scrollTop={scrollTop}
					setScrollTop={setScrollTop}
					scrollToTop={scrollToTop}
					jamCardHeight={jamCardHeight}
					prevJamListRef={prevJamListRef}
				/>
				{filteredJams.length > 0 && (
					<JamCard
						jam={filteredJams[0]}
						user={user}
						showRatings={showRatings}
						className="measure-div"
						ref={jamCardRef}
					/>
				)}
			</div>
		</div>
	)
}
