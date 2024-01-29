function StatItem({ count, label }) {
	return (
		<div className="flex flex-col items-center">
			<p className="text-xl font-semibold text-gray-700">{count}</p>
			<p className="text-lg text-gray-500">{label}</p>
		</div>
	)
}

export default function SiteStats({ jamsCount, setsCount, showsCount, songsCount, artistsCount, soundsCount }) {
	return (
		<div className="flex flex-wrap justify-center">
			<div className="flex items-center align-center justify-center space-x-10 pb-8 text-center mx-4">
				<StatItem count={jamsCount} label="jams" />
				<StatItem count={setsCount} label="sets" />
				<StatItem count={showsCount} label="shows" />
			</div>
			<div className="flex items-center align-center justify-center space-x-10 pb-8 mx-4">
				<StatItem count={songsCount} label="songs" />
				<StatItem count={artistsCount} label="artists" />
				<StatItem count={soundsCount} label="sounds" />
			</div>
		</div>
	)
}
