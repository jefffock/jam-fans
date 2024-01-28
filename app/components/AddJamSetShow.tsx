import { Form } from '@remix-run/react'
import DatePicker from './DatePicker'
import RatingButtons from './RatingButtons'
import ButtonSmall from './ButtonSmall'

const setNumberMap = {
	set_1: 'set 1',
	set_2: 'set 2',
	set_3: 'set 3',
	encore: 'encore',
	late_set: 'late set',
}

export default function AddJamSetShow({
	artists,
	date,
	dateFilter,
	handleDateInputChange,
	location,
	selectedArtist,
	setSelectedArtist,
	setlist,
	setsOnJF,
	showOnJF,
	availableSets,
}) {
	return (
		<div className="flex-col flex items-center">
			<select
				className="border-2 rounded-md p-2 m-2"
				value={selectedArtist}
				onChange={(e) => setSelectedArtist(e.target.value)}
			>
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
					showLabel={false}
				/>
			)}
			<div className="flex justify-center w-screen text-2xl m-2 space-x-5 p-2">
				{selectedArtist && <p>{JSON.parse(selectedArtist).artist}</p>}
				<p>{location}</p>
				<p>{dateFilter}</p>
			</div>
			{showOnJF && (
				<div className="flex flex-wrap justify-center space-x-5 space-y-2">
					<p>👍</p>
					<p>❤️</p>
					<select>
						<option value="">your rating</option>
						<option value="10">10</option>
						<option value="9">9</option>
						<option value="8">8</option>
						<option value="7">7</option>
						<option value="6">6</option>
					</select>
					<textarea placeholder="comments (optional)" />
				</div>
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
					<ButtonSmall
						text={`Add ${JSON.parse(selectedArtist).artist}'s ${dateFilter} show`}
						type="submit"
						name="_action"
						value="add-show"
					/>
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
			<div className="flex gap-2">
				{selectedArtist &&
					dateFilter &&
					availableSets.map((set, index) => (
						<Form method="post" preventScrollReset={true} key={index}>
							<input type="hidden" name="entity" value="Set" />
							<input type="hidden" name="set_number" value={set.value} />
							<input type="hidden" name="date" value={dateFilter} />
							<input type="hidden" name="artist_id" value={JSON.parse(selectedArtist).id} />
							<ButtonSmall
								type="submit"
								name="_action"
								value="add-set"
								// className="border-2 p-2 m-2"

								text={`add ${set.label}`}
							/>
						</Form>
					))}
			</div>

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
		</div>
	)
}
