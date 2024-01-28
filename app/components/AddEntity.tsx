import React, { useState, useEffect } from 'react'
import DatePicker from './DatePicker'
import { Form, useFetcher } from '@remix-run/react'
import { fetchEnsResolver } from 'wagmi/actions'
import RatingButtons from './RatingButtons'

const SETS = [
	{ label: 'set 1', value: 'set_1' },
	{ label: 'set 2', value: 'set_2' },
	{ label: 'set 3', value: 'set_3' },
	{ label: 'encore', value: 'encore' },
	{ label: 'late set', value: 'late_set' },
]

const setNumberMap = {
	set_1: 'set 1',
	set_2: 'set 2',
	set_3: 'set 3',
	encore: 'encore',
	late_set: 'late set',
}

export default function AddEntity({
	artist,
	date,
	artists,
	dateFilter,
	handleDateInputChange,
	filteredMusicalEntities,
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
		if (jamsOnJF) {
			setLocation(jamsOnJF[0].location)
		} else if (setsOnJF) {
			setLocation(setsOnJF[0].location)
		}
	}, [jamsOnJF, setsOnJF])

	useEffect(() => {
		if (selectedArtist && dateFilter && setlist.length === 0) {
			//make sure each song is on jam fans
			//get song id for each song
			//get jamidfor jams
			//get setid for sets
			//get showid for show
			//put each entity in an accordion, especially the setlist
			//add sounds, link, location in dropdown
			//create rating dropdown for each entity that is on jam fans
			//create comment box for each entity that is on jam fans
			//create sounds checkbox for each entity that is on jam fans
			let urlToFetch = '/getSetlist?artist=' + JSON.parse(selectedArtist).artist + '&date=' + dateFilter
			fetcher.load(urlToFetch)
		}
	}, [selectedArtist, dateFilter])

	if (fetcher && fetcher?.data && setlist.length === 0) {
		if (fetcher.data?.location) {
			setLocation(fetcher.data?.location)
		}
		if (fetcher.data?.setlist) {
			setSetlist(fetcher.data?.setlist)
		}
	}

	return (
		<div className="m-4 text-xl text-gray">
			<select className="border-2" value={selectedArtist} onChange={(e) => setSelectedArtist(e.target.value)}>
				<option value="">Select an artist</option>
				{artists.map((art, index) => (
					<option key={index} value={JSON.stringify(art)}>
						{art.artist}
					</option>
				))}
			</select>

			{selectedArtist && (
				<DatePicker
					dateFilter={dateFilter}
					handleDateInputChange={handleDateInputChange}
					date={date}
					showsOnDate={null}
					inAdd={true}
					artist={selectedArtist}
				/>
			)}
			{selectedArtist && <p>{JSON.parse(selectedArtist).artist}</p>}
			<p>{dateFilter}</p>
			<p>{location}</p>
			{showOnJF && (
				<>
					<p className="text-center">your rating</p>
					<RatingButtons entity={showOnJF} entityType="Show" actionName="rate-show" />
				</>
			)}
			{!showOnJF && dateFilter && selectedArtist && (
				<Form method="post" preventScrollReset={true}>
					<input type="hidden" name="entity" value="Show" />
					<input type="hidden" name="date_text" value={dateFilter} />
					<input type="hidden" name="year" value={dateFilter.slice(0, 4)} />
					<input type="hidden" name="month" value={dateFilter.slice(5, 7)} />
					<input type="hidden" name="day" value={dateFilter.slice(8, 10)} />
					<input type="hidden" name="artist_id" value={JSON.parse(selectedArtist).id} />
					<input type="hidden" name="location" value={location} />
					<button type="submit" name="_action" value="add-show" className="border-2">
						Add {JSON.parse(selectedArtist).artist}&apos;s {dateFilter} show
					</button>
				</Form>
			)}
			{selectedArtist && dateFilter && setsOnJF && <p>sets on jam fans</p>}
			{selectedArtist &&
				dateFilter &&
				setsOnJF &&
				setsOnJF.map((set, index) => (
					<>
						<p key={index}>{setNumberMap[set.set_number]}</p>
						<button className="border-2 p-2 m-2">Rate {setNumberMap[set.set_number]}</button>
						<button className="border-2 p-2 m-2">Comment on {setNumberMap[set.set_number]}</button>
						<button className="border-2 p-2 m-2">add rating and comment</button>
					</>
				))}
			{/* {selectedArtist && dateFilter && availableSets && <p>available sets to add to jam fans</p>} */}
			{selectedArtist && dateFilter && availableSets && <p>add a set:</p>}
			{selectedArtist &&
				dateFilter &&
				availableSets.map((set, index) => (
					<>
						<Form method="post" preventScrollReset={true}>
							<input type="hidden" name="entity" value="Set" />
							<input type="hidden" name="set_number" value={set.value} />
							<input type="hidden" name="date" value={dateFilter} />
							<input type="hidden" name="artist_id" value={JSON.parse(selectedArtist).id} />
							<button
								type="submit"
								name="_action"
								value="add-set"
								className="border-2 p-2 m-2"
								key={index}
							>
								Add {set.label} from {dateFilter}
							</button>
						</Form>
					</>
				))}

			{setlist && selectedArtist && dateFilter && (
				<>
					<p>setlist</p>
					{setlist.map((song, index) =>
						song.label.indexOf('Added') === -1 ? (
							<div className="flex" key={index}>
								{/* <p key={index}>{song.label}</p> */}
								<button className="border-2 p-2 m-2">Add {song.label}</button>
							</div>
						) : (
							<div className="flex" key={index}>
								<p key={index}>{song.label}</p>
								<button className="border-2 p-2 m-2"> Rate </button>
								<button className="border-2 p-2 m-2"> Comment </button>
							</div>
						)
					)}
				</>
			)}

			{selectedArtist &&
				dateFilter &&
				filteredMusicalEntities?.map((entity, index) => (
					<div key={index}>
						<pre>{JSON.stringify(entity.entity + entity.id, null, 2)}</pre>
					</div>
				))}
		</div>
	)
}
