import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import type { ClientActionFunctionArgs, ClientLoaderFunctionArgs } from '@remix-run/react'
import { useLoaderData, useFetcher, Outlet, Link } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import { createServerClient, parse, serialize } from '@supabase/ssr'
import Hero from '../components/Hero'
import { getJamsCount, getJams } from '../modules/jam/index.server'
import {
	buildTitle,
	useWindowHeight,
	useWindowWidth,
	scrollToBottomOfWindow,
	scrollToTopOfWindow,
	scrollToTopOfRef,
	createFilterURL,
	slugify,
	emojiToUnicode,
} from '../utils'
import { getSets, getSetsCount } from '../modules/set/index.server'
import { getShows, getShowsCount } from '../modules/show/index.server'
import { getArtistsCount, getArtists, addArtist } from '../modules/artist/index.server'
import { getSoundsCount, getSounds, filterSounds } from '../modules/sound/index.server'
import { getSongsCount, getSongById, getSongs } from '../modules/song/index.server'
import { useState, useEffect, useRef, useMemo } from 'react'
import JamsHome from '../components/JamsHome'
import { getProfile } from '../modules/profile/index.server'
import JamList from '../components/JamList'
import JamFiltersSlideout from '../components/JamFilters'
import FiltersButton from '../components/FiltersButton'
import JamsTitle from '../components/JamsTitle'
import VirtualJamList from '../components/VirtualJamList'
import JamFiltersClientside from '../components/JamFiltersClientside'
import JamCard from '../components/cards/JamCard'
import { useDebounce } from '~/hooks'
import SiteStats from '~/components/SiteStats'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const response = new Response()

	const url = new URL(request.url)
	const searchParams = new URLSearchParams(url.search)
	const queryParams = Object.fromEntries(searchParams)

	const jams = await getJams()
	const sets = await getSets()
	const shows = await getShows()
	const artists = await getArtists()
	const songs = await getSongs()
	const sounds = await getSounds()
	// const profile = await getProfile()
	const jamsCount = await getJamsCount()
	const setsCount = await getSetsCount()
	const showsCount = await getShowsCount()
	const artistsCount = await getArtistsCount()
	const soundsCount = await getSoundsCount()
	const songsCount = await getSongsCount()

	let song_id = queryParams.song
	// const song = await getSongById({ songs, id: song_id })

	return json(
		{
			artists,
			songs,
			allJams: jams,
			allShows: shows,
			allSets: sets,
			sounds,
			count: jams.length,
			// profile,
			search: url.search,
			song: song_id,
			jamsCount,
			setsCount,
			showsCount,
			artistsCount,
			soundsCount,
			songsCount,
		},
		{
			headers: response.headers,
		}
	)
}

export async function action({ request }: ActionFunctionArgs) {
	//get action name
	let formData = await request.formData()
	let { _action, ...values } = Object.fromEntries(formData)
	console.log('_action', _action)
	if (_action === 'add-artist') {
		console.log('...values', values)
		//get emoji code from input
		const emoji = values['emoji']
		const emojiCode = emoji ? emojiToUnicode(emoji) : emojiToUnicode('💚')
		console.log('emojiCode', emojiCode)
		//get artist name from input
		const artistName = values['name']
		console.log('artistName', artistName)
		//create url slug
		const slug = slugify(artistName)
		const artistNameForSort = slug
			.replace(/^(a |the |an |- )/i, '')
			.trim()
			.slice(0, 3)

		const artist = {
			name: artistName,
			emoji: emojiCode,
			nameForOrder: artistNameForSort,
			url: slug,
		}
		await addArtist(artist)
		return json({ ok: true })
	}
	return json({ ok: true })
}

// let isInitialRequest = true

// export async function clientLoader({ request, serverLoader }: ClientLoaderFunctionArgs) {
// 	// const cacheKey = generateKey(request)

// 	if (isInitialRequest) {
// 		isInitialRequest = false
// 		const serverData = await serverLoader()
// 		// cache.set(cacheKey, serverData)
// 		return serverData
// 	}

// 	// const cachedData = await cache.get(cacheKey)
// 	// if (cachedData) {
// 	// 	return cachedData
// 	// }

// 	const serverData = await serverLoader()
// 	// cache.set(cacheKey, serverData)
// 	return serverData
// }
// clientLoader.hydrate = true // (2)

// export async function clientAction({ request, serverAction }: ClientActionFunctionArgs) {
// 	// const cacheKey = generateKey(request)
// 	// cache.delete(cacheKey)
// 	const serverData = await serverAction()
// 	return serverData
// }

export default function Index() {
	const {
		artists,
		songs,
		sounds,
		count,
		search,
		user,
		song,
		profile,
		allJams,
		allShows,
		allSets,
		pageFromServer,
		jamsCount,
		setsCount,
		showsCount,
		artistsCount,
		soundsCount,
		songsCount,
	} = useLoaderData()
	const [open, setOpen] = useState(false)
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
	const [musicalEntitiesFilters, setMusicalEntitiesFilters] = useState({
		jams: true,
		sets: true,
		shows: true,
	})
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
	// const debouncedQuery = useDebounce(query, 300)
	const windowHeight = useWindowHeight()
	const windowWidth = useWindowWidth()
	const scrollingDown = prevJamListRef.current < scrollTop
	const [addJamLink, setAddJamLink] = useState('/add/jam')
	const [showJams, setShowJams] = useState(true)
	const [showSets, setShowSets] = useState(true)
	const [showShows, setShowShows] = useState(true)

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

	const filteredMusicalEntities = useMemo(() => {
		let combinedArray = []
		if (musicalEntitiesFilters.jams) {
			combinedArray = [...combinedArray, ...allJams]
		}
		if (musicalEntitiesFilters.sets) {
			combinedArray = [...combinedArray, ...allSets]
		}
		if (musicalEntitiesFilters.shows) {
			combinedArray = [...combinedArray, ...allShows]
		}
		return combinedArray
			.filter((item) => {
				return (
					(!dateFilter || item.date === dateFilter) &&
					(!songFilter || item?.song_name === songFilter) &&
					(artistFilters.length === 0 || artistFilters.includes(item.artist_id.toString())) &&
					(!linkFilter || item.listen_link) &&
					(soundFilters.length === 0 ||
						soundFilters.every((filter) => jitem.sound_ids.includes(filter.toString()))) &&
					(!beforeDateFilter || item.year <= beforeDateFilter) &&
					(!afterDateFilter || item.year >= Number(afterDateFilter))
				)
			})
			.sort((a, b) => b.avg_rating - a.avg_rating)
	}, [
		allJams,
		dateFilter,
		songFilter,
		artistFilters,
		linkFilter,
		soundFilters,
		beforeDateFilter,
		afterDateFilter,
		musicalEntitiesFilters,
	])

	useEffect(() => {
		const filters = {
			dateFilter: dateFilter,
			beforeDateFilter,
			afterDateFilter,
			artistNames: artistFilters.map((id) => artists.find((artist) => artist.id === parseInt(id))?.artist),
			soundNames: soundFilters.map((id) => sounds.find((sound) => sound.id === parseInt(id))?.label),
			songName: songFilter,
			showJams,
			showSets,
			showShows,
		}

		const newTitle = buildTitle(filters)
		setTitle(newTitle)

		scrollToTopOfRef(jamListRef)

		const filterURL = createFilterURL('/add/jam', filters)
		console.log('filterURL', filterURL)
		setAddJamLink(filterURL)
	}, [filteredMusicalEntities])

	return (
		<div ref={pageRef}>
			<Hero />
			<SiteStats
				jamsCount={jamsCount}
				setsCount={setsCount}
				showsCount={showsCount}
				artistsCount={artistsCount}
				songsCount={songsCount}
				soundsCount={soundsCount}
			/>
			<div className="bg-gray-100">
				<div className="flex-column justify-center items-center pt-3 pb-2 mb-0" ref={headerRef}>
					<JamsTitle title={title} />
					<div className="flex justify-center gap-8 items-center">
						<FiltersButton open={open} setOpen={setOpen} />
					</div>
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
					musicalEntitiesLength={filteredMusicalEntities.length}
					linkFilter={linkFilter}
					setLinkFilter={setLinkFilter}
					query={query}
					setQuery={setQuery}
					musicalEntitiesFilters={musicalEntitiesFilters}
					setMusicalEntitiesFilters={setMusicalEntitiesFilters}
					jamsCount={jamsCount}
					setsCount={setsCount}
					showsCount={showsCount}
				/>
				<VirtualJamList
					jamListRef={jamListRef}
					items={filteredMusicalEntities}
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
				{filteredMusicalEntities.length > 0 && (
					<JamCard
						jam={filteredMusicalEntities[0]}
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
