import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import type { ClientActionFunctionArgs, ClientLoaderFunctionArgs } from '@remix-run/react'
import { useLoaderData, useFetcher, Outlet, Link } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import { createServerClient, parse, serialize } from '@supabase/ssr'
import Hero from '../components/Hero'
import { getJamsCount, getJams } from '../modules/jam/index.server'
import {
	useWindowHeight,
	useWindowWidth,
	scrollToBottomOfWindow,
	scrollToTopOfWindow,
	scrollToTopOfRef,
	createFilterURL,
	slugify,
	emojiToUnicode,
} from '../utils'
import { getSets, getSetsCount, addSet } from '../modules/set/index.server'
import { addShow, getShows, getShowsCount } from '../modules/show/index.server'
import { getArtistsCount, getArtists, addArtist } from '../modules/artist/index.server'
import { getSoundsCount, getSounds, filterSounds } from '../modules/sound/index.server'
import { getSongsCount, getSongById, getSongs } from '../modules/song/index.server'
import { useState, useEffect, useRef, useMemo } from 'react'
import JamsHome from '../components/JamsHome'
import { getProfile, getProfileFromRequest } from '../modules/profile/index.server'
import JamList from '../components/JamList'
import JamFiltersSlideout from '../components/JamFilters'
import FiltersButton from '../components/FiltersButton'
import JamsTitle from '../components/JamsTitle'
import VirtualJamList from '../components/VirtualJamList'
import JamFiltersClientside from '../components/JamFiltersClientside'
import JamCard from '../components/cards/JamCard'
import { useDebounce } from '~/hooks'
import SiteStats from '~/components/SiteStats'
import useFilteredMusicalEntities from '~/hooks/use-filtered-musical-entities'
import useFilterEffects from '~/hooks/use-filter-effects'
import EntityListHeader from '~/components/EntityListHeader'
import EntityListContainer from '~/components/EntityListContainer'
import { db } from '../database'
import { getAuthSession } from '~/modules/auth'
import TopNav from '~/components/TopNav'
import BottomNav from '~/components/BottomNav'
import { set } from 'zod'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	// console.log('request', request)

	const response = new Response()

	const url = new URL(request.url)
	const searchParams = new URLSearchParams(url.search)
	const queryParams = Object.fromEntries(searchParams)

	const profile = await getProfileFromRequest(request)
	const jams = await getJams(profile?.id)
	const sets = await getSets(profile?.id)
	const shows = await getShows(profile?.id)
	const artists = await getArtists()
	const songs = await getSongs()
	const sounds = await getSounds()
	const jamsCount = await getJamsCount()
	const setsCount = await getSetsCount()
	const showsCount = await getShowsCount()
	const artistsCount = await getArtistsCount()
	const soundsCount = await getSoundsCount()
	const songsCount = await getSongsCount()
	// let profile = null
	// if (authSession) {
	// 	profile = await getProfile(authSession.userId)
	// }

	// const [
	// 	jams,
	// 	sets,
	// 	shows,
	// 	artists,
	// 	songs,
	// 	sounds,
	// 	// profile,
	// 	jamsCount,
	// 	setsCount,
	// 	showsCount,
	// 	artistsCount,
	// 	soundsCount,
	// 	songsCount,
	// ] = await Promise.all([
	// 	getJams({ db }),
	// 	getSets({ db }),
	// 	getShows({ db }),
	// 	getArtists({ db }),
	// 	getSongs({ db }),
	// 	getSounds({ db }),
	// 	// getProfile(),
	// 	getJamsCount({ db }),
	// 	getSetsCount({ db }),
	// 	getShowsCount({ db }),
	// 	getArtistsCount({ db }),
	// 	getSoundsCount({ db }),
	// 	getSongsCount({ db }),
	// ])

	let song_id = queryParams.song

	return json(
		{
			artists,
			songs,
			allJams: jams,
			allShows: shows,
			allSets: sets,
			sounds,
			count: jams.length,
			profile,
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
	console.log('formData', formData)
	let { _action, ...values } = Object.fromEntries(formData)
	if (_action === 'add-artist') {
		await addArtist(values)
		return json({ ok: true })
	}

	if (_action === 'add-show') {
		console.log('in add show', values)
		const addedShow = await addShow(values)
	}
	if (_action === 'add-set') {
		console.log('in add set', values)
		const addedSet = await addSet(values)
		console.log('addedSet', addedSet)
	}
	return json({ ok: true })
}

export default function Index() {
	const {
		artists,
		songs,
		sounds,
		count,
		search,
		user,
		song,
		allJams,
		allShows,
		allSets,
		jamsCount,
		setsCount,
		showsCount,
		artistsCount,
		soundsCount,
		songsCount,
		profile,
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
	const [jamCardHeight, setJamCardHeight] = useState(0)
	const [title, setTitle] = useState('🔥 jams, sets, and shows')
	const [query, setQuery] = useState('')
	// const debouncedQuery = useDebounce(query, 300)
	const windowHeight = useWindowHeight()
	const windowWidth = useWindowWidth()
	const [showsOnDate, setShowsOnDate] = useState([])

	useEffect(() => {
		setQuery('')
	}, [songFilter])

	const filteredMusicalEntities = useFilteredMusicalEntities({
		allJams,
		allSets,
		allShows,
		musicalEntitiesFilters,
		dateFilter,
		songFilter,
		artistFilters,
		linkFilter,
		soundFilters,
		beforeDateFilter,
		afterDateFilter,
	})

	useFilterEffects({
		dateFilter,
		beforeDateFilter,
		afterDateFilter,
		artistFilters,
		artists,
		soundFilters,
		sounds,
		songFilter,
		setTitle,
		scrollToTopOfRef,
		createFilterURL,
		filteredMusicalEntities,
		allShows,
		setShowsOnDate,
		musicalEntitiesFilters,
	})

	return (
		<div className="w-full h-full" ref={pageRef}>
			<Hero />
			<SiteStats
				jamsCount={jamsCount}
				setsCount={setsCount}
				showsCount={showsCount}
				artistsCount={artistsCount}
				songsCount={songsCount}
				soundsCount={soundsCount}
			/>
			<EntityListContainer>
				<EntityListHeader title={title} open={open} setOpen={setOpen} headerRef={headerRef} />
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
					showsOnDate={showsOnDate}
					filteredMusicalEntities={filteredMusicalEntities}
					profile={profile}
				/>
				<VirtualJamList
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
				/>
			</EntityListContainer>
			{/* <BottomNav /> */}
		</div>
	)
}