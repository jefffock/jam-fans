import JamCard from './cards/JamCard';

export default function JamList({ jams, sounds, title, subtitle }) {
	if (!jams) return <div>No jams</div>;
	return (
		<div>
				<h2 className='mt-1 font-normal text-gray-700 mx-auto text-center'>{subtitle}</h2>
				<h1 className='mb-1 mx-auto px-2 text-3xl tracking-tight text-gray-900 text-center'>
					{title}
				</h1>
			<div className='flex flex-wrap max-w-100vw justify-center'>
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
