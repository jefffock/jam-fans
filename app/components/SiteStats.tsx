export default function SiteStats({ jamsCount, setsCount, showsCount, songsCount, artistsCount, soundsCount }) {
	return (
		<div className="flex flex-wrap justify-center">
			<div className="flex items-center align-center justify-center space-x-10 pb-8 text-center mx-4">
				<div className="text-center w-14 items-center">
					<p className="text-lg font-semibold text-gray-700">{jamsCount}</p>
					<p className="text-sm text-gray-500">jams</p>
				</div>
				<div className="text-center w-14 items-center">
					<p className="text-lg font-semibold text-gray-700">{setsCount}</p>
					<p className="text-sm text-gray-500">sets</p>
				</div>
				<div className="text-center w-14 items-center">
					<p className="text-lg font-semibold text-gray-700">{showsCount}</p>
					<p className="text-sm text-gray-500">shows</p>
				</div>
			</div>
			<div className="flex items-center align-center justify-center space-x-10 pb-8 mx-4">
				<div className="text-center w-14 items-center">
					<p className="text-lg font-semibold text-gray-700">{songsCount}</p>
					<p className="text-sm text-gray-500">songs</p>
				</div>
				<div className="text-center w-14 items-center">
					<p className="text-lg font-semibold text-gray-700">{artistsCount}</p>
					<p className="text-sm text-gray-500">artists</p>
				</div>
				<div className="text-center w-14 items-center">
					<p className="text-lg font-semibold text-gray-700">{soundsCount}</p>
					<p className="text-sm text-gray-500">sounds</p>
				</div>
			</div>
		</div>
	)
}
