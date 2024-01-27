export default function SetCard({ set }) {
	console.log('set', set)
	return (
		<div className="p-6 bg-gray-50 border border-gray-200 rounded-lg shadow w-112 max-w-95p my-6 mx-auto flex flex-col justify-between h-90">
			<div className="font-bold text-xl mb-2">{`${set.set_number} from ${set.artists.artist}'s ${set.date} show ${set?.location}`}</div>
			<ul className="text-gray-700 text-base">
				<li>
					<strong>date:</strong> {set?.date}
				</li>
				<li>
					<strong>artist</strong> {set?.artists?.artist}
				</li>
				<li>
					<strong>location:</strong> {set?.location}
				</li>
			</ul>
		</div>
	)
}
