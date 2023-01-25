import JamCard from "./cards/JamCard";

export default function JamList({ jams }) {
	return (
		<div>
			{jams.map((version, index) => {
				return (
					<JamCard
						key={index}
						jam={version}
					/>
				);
			})}
		</div>
	);
}
