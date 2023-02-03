import JamCard from './cards/JamCard';
import { Link } from '@remix-run/react';

export default function JamList({ jams, sounds, title, user, profile }) {
	console.log('jams in jamlist', jams.length);
	return (
		<div className='pb-16'>
			{jams?.length > 0 && (
				<h1 className='my-3 mx-auto px-2 text-3xl tracking-tight text-gray-900 text-center'>
					{title}
				</h1>
			)}
			<div className='flex flex-wrap max-w-100vw justify-center'>
				{jams?.length > 0 &&
					jams?.map((version, index) => {
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
				{jams?.length === 0 && (
					<div className='flex flex-col m-4 justify-center'>
						<div className='text-center text-xl m-6'>No {title} (yet!)</div>
						<Link
							to='/add/jam'
							className='text-center text-xl underline'
						>
							Add a jam
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
