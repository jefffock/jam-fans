export default function ShowCard({ show, user, displayRatings, setIframeOpen, setIframeUrl }) {
	return (
		<div className="p-6 bg-gray-50 border border-gray-200 rounded-lg shadow w-112 max-w-95p my-6 mx-auto flex flex-col justify-between h-90">
			<div className="font-bold text-xl mb-2">{`Show at ${show?.location}`}</div>
			<ul className="text-gray-700 text-base">
				<li>
					<strong>date:</strong> {show?.date_text || 'N/A'}
				</li>
				<li>
					<strong>artist</strong> {show?.artists?.artist}
				</li>
				<li>
					<strong>location:</strong> {show?.location}
				</li>
				<p>{show?.avg_rating ? `avg_rating: ${show.avg_rating}` : ''}</p>
				<p>{show?.userRating ? `your rating: ${show.userRating}` : ''}</p>
			</ul>
		</div>
	)
}
