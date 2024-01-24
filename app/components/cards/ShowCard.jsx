export default function ShowCard({ show }) {
	return (
		<div className="p-6 bg-gray-50 border border-gray-200 rounded-lg shadow w-112 max-w-95p my-6 mx-auto flex flex-col justify-between h-90">
			<div className="font-bold text-xl mb-2">{`Show at ${show.location}`}</div>
			<ul className="text-gray-700 text-base">
				<li>
					<strong>Created At:</strong> {show.created_at}
				</li>
				<li>
					<strong>Date:</strong> {show.date_text || 'N/A'}
				</li>
				<li>
					<strong>Artist ID:</strong> {show.artist_id}
				</li>
				<li>
					<strong>Location:</strong> {show.location}
				</li>
			</ul>
		</div>
	)
}
