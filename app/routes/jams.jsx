import { Outlet, useLoaderData, useFetcher } from '@remix-run/react'
import { createServerClient, parse, serialize } from '@supabase/ssr'
import { json } from '@remix-run/node'
import { useState, useEffect, useRef, useMemo } from 'react'
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
import {
	useWindowHeight,
	useWindowWidth,
	scrollToBottomOfWindow,
	scrollToTopOfWindow,
	scrollToTopOfRef,
} from '../utils'
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
	let song_id = queryParams.song
	// const song = await getSongById({ songs, id: song_id })

	return json(
		{
			artists,
			songs,
			allJams: jams,
			sounds,
			count: jams.length,
			profile,
			search: url.search,
			song: song_id,
		},
		{
			headers: response.headers,
		}
	)
}

export default function Jams() {
	const { artists, songs, sounds, count, search, user, song, profile, allJams, pageFromServer } = useLoaderData()
	const [open, setOpen] = useState(false)
	// const [scrollPosition, setScrollPosition] = useState(0)
	// const [clientHeight, setClientHeight] = useState(null)
	// const [shouldFetch, setShouldFetch] = useState(true)
	// const [height, setHeight] = useState(null)
	// const [page, setPage] = useState(pageFromServer)
	// const fetcher = useFetcher()
	// const [urlToLoad, setUrlToLoad] = useState(null)
	// const [newSearch, setNewSearch] = useState(search)
	// const [isFetching, setIsFetching] = useState(false)
	const [showIframe, setShowIframe] = useState(false)
	const [iframeUrl, setIframeUrl] = useState('')
	const [showRatings, setShowRatings] = useState(false)
	const headerRef = useRef(null)
	const pageRef = useRef(null)
	const [headerHeight, setHeaderHeight] = useState(0)
	const [artistFilters, setArtistFilters] = useState([])
	const [songFilter, setSongFilter] = useState(song)
	const [soundFilters, setSoundFilters] = useState([])
	const [orderBy, setOrderBy] = useState('avg_rating')
	const [showComments, setShowComments] = useState(false)
	const [beforeDateFilter, setBeforeDateFilter] = useState(null)
	const [afterDateFilter, setAfterDateFilter] = useState(null)
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
	const [title, setTitle] = useState('🔥 Jams')
	const [query, setQuery] = useState('')
	const windowHeight = useWindowHeight()
	const windowWidth = useWindowWidth()
	const scrollingDown = prevJamListRef.current < scrollTop

	if (jamCardRef.current) {
		if (jamCardHeight !== jamCardRef.current?.clientHeight) {
			setJamCardHeight(jamCardRef.current?.clientHeight)
		}
	}

	useEffect(() => {
		setQuery('')
	}, [songFilter])

	useEffect(() => {
		if (headerRef.current) {
			setHeaderHeight(headerRef.current.clientHeight)
		}
	}, [])

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

	const filteredJams = useMemo(() => {
		return allJams.filter((jam) => {
			return (
				(!dateFilter || jam.date === dateFilter) &&
				(!songFilter || jam.song_name === songFilter) &&
				(artistFilters.length === 0 || artistFilters.includes(jam.artist_id.toString())) &&
				(!linkFilter || jam.listen_link) &&
				(soundFilters.length === 0 ||
					soundFilters.every((filter) => jam.sound_ids.includes(filter.toString()))) &&
				(!beforeDateFilter || jam.year <= beforeDateFilter) &&
				(!afterDateFilter || jam.year >= Number(afterDateFilter))
			)
		})
	}, [allJams, dateFilter, songFilter, artistFilters, linkFilter, soundFilters, beforeDateFilter, afterDateFilter])

	useEffect(() => {
		scrollToTopOfRef(jamListRef)
		const newTitle = buildTitle({
			queryParams: search,
			beforeDateFilter,
			afterDateFilter,
			artistNames: artistFilters.map((id) => {
				return artists.find((artist) => artist.id === parseInt(id))?.artist
			}),
			soundNames: soundFilters.map((id) => {
				return sounds.find((sound) => sound.id === parseInt(id))?.label
			}),
			songName: songFilter,
			artists,
			songs,
			sounds,
			date: dateFilter,
		})
		setTitle(newTitle)
	}, [filteredJams])

	return (
		<div ref={pageRef}>
			{!search && <Hero />}
			<div className="bg-gray-100">
				<div className="flex-column justify-center items-center pt-3 pb-2 mb-0" ref={headerRef}>
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
					query={query}
					setQuery={setQuery}
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
