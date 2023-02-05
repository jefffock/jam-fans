import { Link } from 'react-router-dom';

export default function ArtistBar({ artists, search }) {
	if (!artists) return <div>Loading...</div>;
	return (
		<>
			<div className='flex h-25 w-screen overflow-x-scroll items-start pl-1 pr-10 align-middle'>
				{artists?.map((artist, index) => {
					let url = '';
					if (search) url = search?.replace(/artists-.+?(?=&|$)/g, '');
					if (!search) url = `/jams/?`;
					url += `&artists-${artist.url}=${artist.url}`;
					return (
						<ArtistInBar
							key={index}
							artist={artist}
							url={url}
						/>
					);
				})}
			</div>
		</>
	);
}

function ArtistInBar({ artist, url }) {
	return (
		<>
			{artist.url === 'allman-brothers' && (
				<div className='border-l-2 border-gray-200 h-16 self-center rounded-full'></div>
			)}

			<div
				className={`group text-center min-w-20 my-6 hover:mb-0 p-2 px-4 transition-all duration-20000 ease-in transform-none hover:transform hover:scale-150 hover:z-10 rounded-2xl bg-none bg-opacity-0 hover:bg-gradient-to-br hover:from-cyan-50 hover:to-blue-50 hover:drop-shadow-lg hover:bg-opacity-100 motion-reduce:transition-none motion-reduce:hover:transform-none`}
			>
				<Link to={url}>
					<p className='text-center text-2xl'>
						{String.fromCodePoint(artist.emoji_code)}
					</p>
					<p className='text-center text-sm whitespace-nowrap'>
						{artist.nickname}
					</p>
				</Link>
			</div>
		</>
	);
}
