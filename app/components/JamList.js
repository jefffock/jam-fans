import JamCard from './cards/JamCard';

export default function JamList({ jams, sounds, title, user, profile }) {
	if (!jams) return <div>No jams</div>;
	return (
		<div>
				<h1 className='my-3 mx-auto px-2 text-3xl tracking-tight text-gray-900 text-center'>
					{title}
				</h1>
			<div className='flex flex-wrap max-w-100vw justify-center'>
				{jams?.map((version, index) => {
					return (
						<JamCard
							key={index}
							jam={version}
							sounds={sounds}
              user={user}
              profile={profile}
						/>
					);
				})}
			</div>
		</div>
	);
}
