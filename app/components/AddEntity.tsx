import { useFetcher } from '@remix-run/react'
import { useEffect, useState } from 'react'
import AddJamSetShow from './AddJamSetShow'

const SETS = [
	{ label: 'set 1', value: 'set_1', id: 1 },
	{ label: 'set 2', value: 'set_2', id: 2 },
	{ label: 'set 3', value: 'set_3', id: 3 },
	{ label: 'encore', value: 'encore', id: 4 },
	{ label: 'late set', value: 'late_set', id: 5 },
]

export default function AddEntity({
	artist,
	date,
	artists,
	dateFilter,
	handleDateInputChange,
	filteredMusicalEntities,
	activeAddTab,
	setActiveAddTab,
	profile,
	attributes,
}) {
	const [selectedArtist, setSelectedArtist] = useState(
		JSON.stringify(artists.find((art) => art.id === Number(artist))) || ''
	)
	const [location, setLocation] = useState('')
	const [setlist, setSetlist] = useState([])
	const fetcher = useFetcher()

	const showOnJF = selectedArtist && dateFilter && filteredMusicalEntities.find((entity) => entity.entity === 'Show')

	const setsOnJF = selectedArtist && dateFilter && filteredMusicalEntities.filter((entity) => entity.entity === 'Set')

	const jamsOnJF = selectedArtist && dateFilter && filteredMusicalEntities.filter((entity) => entity.entity === 'Jam')

	const availableSets =
		setsOnJF && SETS.filter((set) => !setsOnJF?.some((setsOnJfItem) => setsOnJfItem.set_number === set.value))

	useEffect(() => {
		if (!location && jamsOnJF && jamsOnJF.length > 0 && jamsOnJF[0]?.location) {
			setLocation(jamsOnJF[0]?.location)
		} else if (!location && showOnJF && showOnJF.length > 0 && showOnJF[0]?.location) {
			setLocation(showOnJF[0]?.location)
		}
	}, [jamsOnJF, showOnJF])

	useEffect(() => {
		setSetlist([])
		if (selectedArtist && dateFilter && setlist.length === 0) {
			//make sure each song is on jam fans
			//get song id for each song
			//put each entity in an accordion, especially the setlist
			//add sounds, link, location in dropdown
			//create sounds checkbox for each entity that is on jam fans
			const selectedArtistFields = {
				artist: JSON.parse(selectedArtist).artist,
				mbid: JSON.parse(selectedArtist).mbid,
				baseUrl: JSON.parse(selectedArtist).api_base_url,
				data_source: JSON.parse(selectedArtist).data_source,
			}
			let urlToFetch = '/resources/setlist?artist=' + JSON.stringify(selectedArtistFields) + '&date=' + dateFilter
			fetcher.load(urlToFetch)
		}
	}, [selectedArtist, dateFilter])

	return (
		<div className="m-4 text-lg text-gray">
			<div className="flex space-x-10 mx-auto text-center max-w-fit mb-4">
				<button
					type="button"
					className={`${activeAddTab === 'jamSetShow' ? 'text-cyan-700 ' : 'text-neutral-500'}`}
					disabled={activeAddTab === 'jamSetShow'}
					onClick={() => setActiveAddTab('jamSetShow')}
				>
					jams, sets, shows
				</button>
				{/* <button
					type="button"
					className={`${activeAddTab === 'artist' ? 'text-cyan-700' : 'text-neutral-500'}`}
					disabled={activeAddTab === 'artist'}
					onClick={() => setActiveAddTab('artist')}
				>
					bands
				</button> */}
				<button
					type="button"
					className={`${activeAddTab === 'song' ? 'text-cyan-700 ' : 'text-neutral-500'}`}
					disabled={activeAddTab === 'song'}
					onClick={() => setActiveAddTab('song')}
				>
					songs
				</button>
				{/* <button
					type="button"
					className={`${activeAddTab === 'sound' ? 'text-cyan-700 ' : 'text-neutral-500'}`}
					disabled={activeAddTab === 'sound'}
					onClick={() => setActiveAddTab('sound')}
				>
					sounds
				</button> */}
			</div>
			{activeAddTab === 'jamSetShow' && (
				<AddJamSetShow
					selectedArtist={selectedArtist}
					dateFilter={dateFilter}
					artists={artists}
					date={date}
					handleDateInputChange={handleDateInputChange}
					showOnJF={showOnJF}
					setsOnJF={setsOnJF}
					jamsOnJF={jamsOnJF}
					availableSets={availableSets}
					setlist={fetcher?.data?.enrichedSetlist?.setlist || setlist}
					location={fetcher?.data?.enrichedSetlist?.location || location}
					setSelectedArtist={setSelectedArtist}
					profile={profile}
					attributes={attributes}
				/>
			)}
		</div>
	)
}
