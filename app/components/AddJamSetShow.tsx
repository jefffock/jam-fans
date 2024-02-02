import { Form } from '@remix-run/react'
import DatePicker from './DatePicker'
import Button from './Button'
import LikeHeartRateComment from './LikeHeartRateComment'
import InfoAlert from './alerts/InfoAlert'
import JamCard from './cards/JamCard'

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
			<p>Likes : {showOnJF?.likes}</p>
			<p>Favorites : {showOnJF?.favorites}</p>
			<p>Rating : {showOnJF?.avg_rating}</p>
			<p>Comments : {showOnJF?.ratings?.length}</p>
			{/* {showOnJF?.ratings?.map((comment, index) => {
				return <p key={`comment-${index}`}>{comment}</p>
			})} */}

			<p>User rating: {showOnJF?.userRating?.rating}</p>
			<p>User comment: {showOnJF?.userRating?.comment}</p>
			<p>User favorite: {showOnJF?.userRating?.favorite ? 'yes' : 'no'}</p>
			<p>User like: {showOnJF?.userRating?.likes ? 'yes' : 'no'}</p>
			{showOnJF && <LikeHeartRateComment profile={profile} entity={showOnJF} entityType={'Show'} />}
			{!showOnJF && dateFilter && selectedArtist && (
				<Form method="post" preventScrollReset={true}>
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
				</Form>
			)}
			{selectedArtist && dateFilter && setsOnJF && <p>sets on jam fans</p>}
			{selectedArtist &&
				dateFilter &&
				setsOnJF &&
				setsOnJF.map((set, index) => (
					<>
						<p key={index}>{setNumberMap[set.set_number]}</p>
						<p>rating: {set?.avg_rating}</p>
						<p>comments: {set?.ratings?.length}</p>
						<p>likes: {set?.likes}</p>
						<p>favorites: {set?.favorites}</p>
						<p>userRating: {set?.userRating?.rating}</p>
						<p>userComment: {set?.userRating?.comment}</p>
						<p>userFavorite: {set?.userRating?.favorite ? 'yes' : 'no'}</p>
						<p>userLike: {set?.userRating?.likes ? 'yes' : 'no'}</p>
						<LikeHeartRateComment profile={profile} entity={set} entityType={'Set'} />
					</>
				))}
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
							<Button
								type="submit"
								name="_action"
								value="add-set"
								text={`add ${set.label} ${set.label === 'set 3' || set.label === 'late set' ? '(if there was one)' : ''}`}
							/>
						</Form>
					))}
			</div>

			{setlist && selectedArtist && dateFilter && (
				<>
					<p>setlist</p>
					<div className="flex flex-col space-y-4">
						{setlist.map((song, index) =>
							song.label.indexOf('Added') === -1 ? (
								<div className="flex" key={index}>
									{/* <p key={index}>{song.label}</p> */}
									<Button size="small" type="submit" text={`add ${song.label}`} />
								</div>
							) : (
								<JamCard
									key={index}
									jam={song.jam}
									user={profile}
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
