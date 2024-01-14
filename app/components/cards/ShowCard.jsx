export default function ShowCard({ show }) {
	return (
		<div>
			<h1>{show.name}</h1>
			<h2>{show.description}</h2>
			<h3>{show.artist}</h3>
			<h4>{show.year}</h4>
			<h5>{show.genre}</h5>
			<h6>{show.subgenre}</h6>
		</div>
	)
}
