import JamCard from './cards/JamCard';
import { Link } from '@remix-run/react';
import InfoAlert from './alerts/InfoAlert';

export default function JamList({
	jams,
	sounds,
	title,
	user,
	profile,
	search,
}) {
	const artistStartIndex = search?.indexOf('artists-') + 'artists-'.length;
	const urlStartIndex = search?.indexOf('=', artistStartIndex);
	const artistUrl = search?.substring(artistStartIndex, urlStartIndex);

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
						<InfoAlert
							title={`No ${title} (yet)`}
							description={
								"If you could go ahead and add one, yeah, that'd be great (no account needed!)"
							}
						/>
						<Link
							to={artistUrl ? `/add/jam?artistUrl=${artistUrl}` : '/add/jam'}
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
