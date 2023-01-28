import { Link } from '@remix-run/react';

export default function JamCard({ jam, sounds, user, profile }) {
	let soundsString = '';
	//itereate through jam, if key in jam matches text in sounds, add sound label to sounds String
	for (const [key, value] of Object.entries(jam)) {
		if (
			key === 'id' ||
			key === 'song_name' ||
			key === 'artist' ||
			key === 'date' ||
			key === 'location' ||
			key === 'avg_rating' ||
			key === 'submitter_name'
		)
			continue;
		if (value === true) {
			sounds.forEach((sound) => {
				if (sound.text === key) {
					soundsString += sound.label + ', ';
				}
			});
		}
	}
	soundsString = soundsString.slice(0, -2);
	const ratingToShow = (jam.avg_rating / 2).toFixed(3)?.replace(/\.?0+$/, '');
	return (
		<div className='p-6 bg-white border border-gray-200 rounded-lg shadow m-6 w-80 flex flex-col justify-between'>
			<div>
				<a href='#'>
					<h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900'>
						{jam.song_name}
					</h5>
				</a>
				<h5 className='mb-2 text-xl tracking-tight text-gray-900'>
					{jam.date}
				</h5>
				<h6 className='mb-2 text-xl tracking-tight text-gray-900'>
					{jam.artist}
				</h6>
				<div className='flex justify-between'>
					<p className='mb-3 font-normal text-gray-700 mr-auto'>
						{jam.location}
					</p>
					<div className='flex float-right'>
						<p className='mb-3 font-normal text-gray-700 ml-auto'>
							{ratingToShow}{' '}
						</p>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 20 20'
							fill='currentColor'
							className='w-5 h-5'
						>
							<path
								fillRule='evenodd'
								d='M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z'
								clipRule='evenodd'
							/>
						</svg>
					</div>
				</div>
				{soundsString && (
					<p className='mb-3 font-normal text-gray-700'>{soundsString}</p>
				)}
				<p className='font-normal text-gray-700'>
					{'Added by ' + jam.submitter_name}
				</p>
			</div>
			<div className='flex justify-between mt-3'>
				{!user && !profile && (
					<Link
						to='login'
						className='underline self-center'
					>
						Login to rate
					</Link>
				)}
				{user && profile && <button>Rate</button>}
				<div>
          {jam.listen_link &&
					<a
						href='#'
						className='inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300'
					>
						Listen
						<svg
							aria-hidden='true'
							className='w-4 h-4 ml-2 -mr-1'
							fill='currentColor'
							viewBox='0 0 20 20'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								fillRule='evenodd'
								d='M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z'
								clipRule='evenodd'
							></path>
						</svg>
					</a>
          }
          {!jam.listen_link &&
          <button
          type="button"
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add a link
        </button>
          }
				</div>
			</div>
		</div>
	);
}
