import React, { useState } from 'react'
import DatePicker from './DatePicker'

const SETS = ['Set 1', 'Set 2', 'Set 3', 'Encore']

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

	console.log('selectedArtist', selectedArtist)

	const showOnJF = selectedArtist && dateFilter && filteredMusicalEntities.find((entity) => entity.entity === 'Show')

	return (
		<div>
			{selectedArtist ? (
				<pre>Artist: {JSON.parse(selectedArtist).artist}</pre>
			) : (
				<select value={selectedArtist} onChange={(e) => setSelectedArtist(e.target.value)}>
					<option value="">Select an artist</option>
					{artists.map((art, index) => (
						<option key={index} value={JSON.stringify(art)}>
							{art.artist}
						</option>
					))}
				</select>
			)}
			{dateFilter ? (
				<p>Date: {dateFilter}</p>
			) : (
				<DatePicker dateFilter={dateFilter} handleDateInputChange={handleDateInputChange} date={date} />
			)}
			<p>Location</p>
			{showOnJF && (
				<>
					<p>Show is already on JF</p>
					<p>Rate show</p>
					<textarea>Comment</textarea>
				</>
			)}
			<p>SetPicker ch</p>
			{selectedArtist &&
				dateFilter &&
				filteredMusicalEntities
					.filter((entity) => entity.entity === 'Set')
					.map((set, index) => <p>{set.type}</p>)}
			{selectedArtist &&
				dateFilter &&
				SETS.map((set, index) => (
					<>
						<button className="border-2" key={index} onClick={() => console.log('set', set)}>
							Add {set}
						</button>
					</>
				))}
			{selectedArtist && dateFilter && (
				<>
					<label htmlFor="festival">Festival</label>
					<input type="checkbox" name="festival" />
				</>
			)}
			<p>Get setlist</p>
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
