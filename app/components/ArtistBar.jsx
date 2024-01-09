import { Link } from 'react-router-dom';

export default function ArtistBar({ artists, search }) {
	if (!artists) return <div>Loading...</div>;
	return (
		<>
			<div className='flex h-22 w-screen overflow-x-scroll items-start pl-1 pr-10 align-middle'>
				{artists?.map((artist, index) => {
					let url = '';
					if (search) {
						url = search?.replace(/artists-.+?(?=&|$)/g, '');
						// url = url.replace(/song-.+?(?=&|$)/g, '');
						url = url.replace(/song=[^&]+|&song=[^&]+/g, '');
					}
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
	let emojis = artist?.emoji_code?.split(',');
	return (
		<>
			{artist.url === 'allman-brothers' && (
				<div className='border-l-2 border-gray-400 h-14 self-center rounded-full'></div>
			)}

			<div
				className={`group text-center min-w-20 my-4 hover:mb-0 p-2 m-1 transition-all duration-500 hover:duration-20000 ease-in transform-none hover:transform hover:scale-150 hover:z-10 rounded-2xl bg-gray-50 hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50 hover:drop-shadow-lg bg-opacity-100 motion-reduce:transition-none motion-reduce:hover:transform-none border border-gray-200 drop-shadow-sm active:bg-green-100`}
			>
				<Link to={url}>
					<p className='text-center text-2xl'>
						{emojis &&
							emojis.map((emoji) => String.fromCodePoint(emoji)).join('')}
					</p>
					<p className='text-center text-sm whitespace-nowrap'>
						{artist.nickname}
					</p>
				</Link>
			</div>
		</>
	);
}
