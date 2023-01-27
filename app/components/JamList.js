import JamCard from "./cards/JamCard";

export default function JamList({ jams, sounds, title, subtitle }) {
  if (!jams) return <div>No jams</div>;
	return (
    <div>
      <div>
        <h1>{title}</h1>
        <h2>{subtitle}</h2>
      </div>
		<div className="flex flex-wrap max-w-100vw justify-center">

			{jams?.map((version, index) => {
				return (
					<JamCard
						key={index}
						jam={version}
            sounds={sounds}
					/>
				);
			})}
		</div>
    </div>
	);
}
