import { useFetcher } from '@remix-run/react'
import Button from './Button'
import DatePicker from './DatePicker'
import InfoAlert from './alerts/InfoAlert'
import EntityCard from './cards/EntityCard'

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
	attributes,
	iframeOpen,
	setIframeOpen,
	setIframeUrl,
	displayRatings,
}) {
	const fetcher = useFetcher()
	// const displayRatings = getRatingsVisible()

	return (
		<div className={`flex-col flex items-center max-w-screen `}>
			<select
				className="border-2 rounded-md p-2 m-2"
				value={selectedArtist}
				onChange={(e) => setSelectedArtist(e.target.value)}
			>
				<option value="">Select an artist</option>
				{artists.map((art) => (
					<option key={art.id} value={JSON.stringify(art)}>
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
					description="you can still add jams, sets, and shows, but they won't be associated with your account. if you want to keep track of your contributions, please log in"
					linkTo="/login"
					linkText="log in"
				/>
			)}
			<div className="flex flex-col justify-center items-center text-center w-screen text-3xl m-2 space-5 p-2">
				{selectedArtist && <p>{JSON.parse(selectedArtist).artist}</p>}
				<p className="text-2xl">{dateFilter}</p>
				<p className="text-xl">{location}</p>
			</div>
			{showOnJF && (
				<EntityCard
					item={showOnJF}
					profile={profile}
					displayRatings={displayRatings}
					// showDateArtistLocation={false}
					attributes={attributes}
					inAdd={true}
					setIframeOpen={setIframeOpen}
					setIframeUrl={setIframeUrl}
				/>
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
						text={`${fetcher?.state === 'idle' ? `add ${JSON.parse(selectedArtist).artist}'s ${dateFilter} show` : 'updating...'}`}
						type="submit"
						name="_action"
						value="add-show"
						disabled={fetcher?.state !== 'idle'}
					/>
				</fetcher.Form>
			)}
			{setlist && setlist.length > 0 && selectedArtist && dateFilter && (
				<>
					<p className="text-2xl mt-8">setlist</p>
					<div className="flex flex-col items-center max-w-98p">
						{setlist.map((song) =>
							song.label.indexOf('Added') === -1 ? (
								<div key={song.id} className="p-2">
									<fetcher.Form method="post" preventScrollReset={true} action="resources/jams">
										<input type="hidden" name="entity" value="Jam" />
										<input type="hidden" name="date" value={dateFilter} />
										<input type="hidden" name="artist_id" value={JSON.parse(selectedArtist).id} />
										<input type="hidden" name="location" value={location} />
										<input type="hidden" name="song" value={song.label} />
										<input type="hidden" name="artist" value={selectedArtist} />
										<input type="hidden" name="show_id" value={showOnJF ? showOnJF.id : null} />

										<Button
											size="small"
											type="submit"
											text={`${fetcher?.state === 'idle' ? `add ${song.label}` : 'updating...'}`}
											value="add-jam"
											disabled={fetcher?.state !== 'idle'}
										/>
									</fetcher.Form>
								</div>
							) : (
								<EntityCard
									key={song.jam.id}
									item={song.jam}
									profile={profile}
									displayRatings={displayRatings}
									// showDateArtistLocation={false}
									attributes={attributes}
									inAdd={true}
									setIframeOpen={setIframeOpen}
									setIframeUrl={setIframeUrl}
								/>
							)
						)}
					</div>
				</>
			)}
			{selectedArtist && dateFilter && setsOnJF && setsOnJF.length > 0 && (
				<p className="text-2xl mt-8">sets on jam fans</p>
			)}
			{selectedArtist &&
				dateFilter &&
				setsOnJF &&
				setsOnJF.map((set) => (
					<EntityCard
						key={set.id}
						item={set}
						profile={profile}
						displayRatings={displayRatings}
						// showDateArtistLocation={false}
						attributes={attributes}
						inAdd={true}
						setIframeOpen={setIframeOpen}
						setIframeUrl={setIframeUrl}
					/>
				))}
			{selectedArtist && dateFilter && availableSets && <p className="text-2xl mt-8">add a set</p>}
			<div className="flex flex-col items-center">
				{selectedArtist &&
					dateFilter &&
					availableSets.map((set) => (
						<fetcher.Form
							method="post"
							preventScrollReset={true}
							key={`${set.id}-${set.label}`}
							action="resources/sets"
							className="p-2"
						>
							<input type="hidden" name="entity" value="Set" />
							<input type="hidden" name="set_number" value={set.value} />
							<input type="hidden" name="date" value={dateFilter} />
							<input type="hidden" name="artist_id" value={JSON.parse(selectedArtist).id} />
							<input type="hidden" name="location" value={location} />
							<input type="hidden" name="show_id" value={showOnJF ? showOnJF.id : null} />
							<Button type="submit" name="_action" value="add-set" text={`add ${set.label}`} />
						</fetcher.Form>
					))}
			</div>
		</div>
	)
}
