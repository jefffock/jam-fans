import { useFetcher } from '@remix-run/react'
import Button from './Button'
import DatePicker from './DatePicker'
import InfoAlert from './alerts/InfoAlert'
import EntityCard from './cards/EntityCard'

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
	profile,
	jamsOnJF,
}) {
	const fetcher = useFetcher()

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
					showLabel={true}
				/>
			)}
			{!profile && selectedArtist && dateFilter && (
				<InfoAlert
					title="you aren't logged in"
					description="you can still add, like, and rate jams, sets, and shows, but you can't comment or favorite and your "
				/>
			)}
			<div className="flex justify-center w-screen text-2xl m-2 space-x-5 p-2">
				{selectedArtist && <p>{JSON.parse(selectedArtist).artist}</p>}
				<p>{location}</p>
				<p>{dateFilter}</p>
			</div>

			{showOnJF && (
				<EntityCard item={showOnJF} profile={profile} showRatings={false} showDateArtistLocation={false} />
			)}
			{!showOnJF && dateFilter && selectedArtist && (
				<fetcher.Form method="post" preventScrollReset={true} action="resources/shows">
					<input type="hidden" name="entity" value="Show" />
					<input type="hidden" name="date_text" value={dateFilter} />
					<input type="hidden" name="year" value={dateFilter.slice(0, 4)} />
					<input type="hidden" name="month" value={dateFilter.slice(5, 7)} />
					<input type="hidden" name="day" value={dateFilter.slice(8, 10)} />
					<input type="hidden" name="artist_id" value={JSON.parse(selectedArtist).id} />
					<input type="hidden" name="location" value={location} />
					<Button
						text={`add ${JSON.parse(selectedArtist).artist}'s ${dateFilter} show`}
						type="submit"
						name="_action"
						value="add-show"
					/>
				</fetcher.Form>
			)}
			{selectedArtist && dateFilter && setsOnJF && <p>sets on jam fans</p>}
			{selectedArtist &&
				dateFilter &&
				setsOnJF &&
				setsOnJF.map((set) => (
					<EntityCard
						key={set.key}
						item={set}
						profile={profile}
						showRatings={false}
						showDateArtistLocation={false}
					/>
				))}
			{selectedArtist && dateFilter && availableSets && <p>add a set:</p>}
			<div className="flex gap-2">
				{selectedArtist &&
					dateFilter &&
					availableSets.map((set) => (
						<fetcher.Form method="post" preventScrollReset={true} key={set.key} action="resources/sets">
							<input type="hidden" name="entity" value="Set" />
							<input type="hidden" name="set_number" value={set.value} />
							<input type="hidden" name="date" value={dateFilter} />
							<input type="hidden" name="artist_id" value={JSON.parse(selectedArtist).id} />
							<Button
								type="submit"
								name="_action"
								value="add-set"
								text={`add ${set.label} ${set.label === 'set 3' || set.label === 'late set' ? '(if there was one)' : ''}`}
							/>
						</fetcher.Form>
					))}
			</div>

			{setlist && setlist.length > 0 && selectedArtist && dateFilter && (
				<>
					<p>setlist</p>
					<div className="flex flex-col space-y-4">
						{setlist.map((song) =>
							song.label.indexOf('Added') === -1 ? (
								<fetcher.Form
									method="post"
									preventScrollReset={true}
									key={song.label}
									action="resources/jams"
								>
									<input type="hidden" name="entity" value="Jam" />
									<input type="hidden" name="date" value={dateFilter} />
									<input type="hidden" name="artist_id" value={JSON.parse(selectedArtist).id} />
									<input type="hidden" name="song" value={song.label} />
									<Button size="small" type="submit" text={`add ${song.label}`} value="add-jam" />
								</fetcher.Form>
							) : (
								<EntityCard
									key={song.jam.key}
									item={song.jam}
									profile={profile}
									showRatings={false}
									showDateArtistLocation={false}
								/>
							)
						)}
					</div>
				</>
			)}
		</div>
	)
}
