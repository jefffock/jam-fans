export default function JamCard({ jam }) {
	return (
		<div className='border-2 rounded border-black'>
			<h1>{jam.song_name}</h1>
			<h2>{jam.artist}</h2>
			<h3>{jam.date}</h3>
			<h4>{jam.location}</h4>
      <h5>{jam.avg_rating}</h5>
		</div>
	);
}
