import React, { useState, useEffect } from 'react'
import DatePicker from './DatePicker'
import { Form, useFetcher } from '@remix-run/react'
import { fetchEnsResolver } from 'wagmi/actions'
import RatingButtons from './RatingButtons'
import AddJamSetShow from './AddJamSetShow'

const SETS = [
	{ label: 'set 1', value: 'set_1' },
	{ label: 'set 2', value: 'set_2' },
	{ label: 'set 3', value: 'set_3' },
	{ label: 'encore', value: 'encore' },
	{ label: 'late set', value: 'late_set' },
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
		if (jamsOnJF && jamsOnJF.length > 0 && jamsOnJF[0]?.location) {
			setLocation(jamsOnJF[0]?.location)
		} else if (showOnJF && showOnJF.length > 0 && showOnJF[0]?.location) {
			setLocation(showOnJF[0]?.location)
		}
	}, [jamsOnJF, showOnJF])

	useEffect(() => {
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

	if (fetcher && fetcher?.data && setlist.length === 0) {
		console.log('fetcher.data', fetcher.data)
		if (fetcher.data?.location) {
			setLocation(fetcher.data?.location)
		}
		if (fetcher.data?.setlist) {
			let modifiedSetlist = []
			fetcher.data?.setlist.forEach((item) => {
				if (!item.jamId) {
					modifiedSetlist.push(item)
				}
				if (item.jamId !== undefined) {
					// Find the jam with the matching ID in jamOnJF
					const matchingJam = jamsOnJF.find((jam) => jam.id === item.jamId)

					if (matchingJam) {
						// Perform the connection logic here
						// For example, you might want to add the matching jam details to the item
						item.jam = matchingJam
						modifiedSetlist.push(item)
					}
				}
			})
			console.log('modifiedSetlist', modifiedSetlist)
			setSetlist(modifiedSetlist)
		}
	}

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
				<button
					type="button"
					className={`${activeAddTab === 'artist' ? 'text-cyan-700' : 'text-neutral-500'}`}
					disabled={activeAddTab === 'artist'}
					onClick={() => setActiveAddTab('artist')}
				>
					bands
				</button>
				<button
					type="button"
					className={`${activeAddTab === 'song' ? 'text-cyan-700 ' : 'text-neutral-500'}`}
					disabled={activeAddTab === 'song'}
					onClick={() => setActiveAddTab('song')}
				>
					songs
				</button>
				<button
					type="button"
					className={`${activeAddTab === 'sound' ? 'text-cyan-700 ' : 'text-neutral-500'}`}
					disabled={activeAddTab === 'sound'}
					onClick={() => setActiveAddTab('sound')}
				>
					sounds
				</button>
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
					setlist={setlist}
					location={location}
					setSelectedArtist={setSelectedArtist}
					profile={profile}
				/>
			)}
		</div>
	)
}
