import JamCard from "./cards/JamCard";

export default function JamList({ jams }) {
  if (!jams) return <div>No jams</div>;
	return (
		<div>
			{jams?.map((version, index) => {
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