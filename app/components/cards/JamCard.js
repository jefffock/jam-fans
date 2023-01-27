export default function JamCard({ jam, sounds }) {
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
	return (
		// <div className='border-2 rounded border-black'>
		// 	<h1>{jam.song_name}</h1>
		// 	<h2>{jam.artist}</h2>
		// 	<h3>{jam.date}</h3>
		// 	<h4>{jam.location}</h4>
		//   <h5>{jam.avg_rating}</h5>
		// </div>
		<div class='p-6 bg-white border border-gray-200 rounded-lg shadow m-6 w-80 relative'>
			<a href='#'>
				<h5 class='mb-2 text-2xl font-bold tracking-tight text-gray-900'>
					{jam.song_name}
				</h5>
			</a>
			<h5 class='mb-2 text-xl tracking-tight text-gray-900'>
				{jam.date}
			</h5>
			<h6 class='mb-2 text-xl tracking-tight text-gray-900'>
				{jam.artist}
			</h6>
      <div className='flex justify-between'>
			<p class='mb-3 font-normal text-gray-700 mr-auto'>{jam.location}</p>
      <div className="flex float-right">
			<p class='mb-3 font-normal text-gray-700 ml-auto'>
				{jam.avg_rating / 2}{' '}
			</p>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 20 20'
					fill='currentColor'
					class='w-5 h-5'
				>
					<path
						fill-rule='evenodd'
						d='M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z'
						clip-rule='evenodd'
					/>
				</svg>
      </div>

      </div>
			<p class='mb-3 font-normal text-gray-700'>{soundsString}</p>
			<p class='mb-3 font-normal text-gray-700 pb-10'>
				{'Added by ' + jam.submitter_name}
			</p>
      <div className="absolute bottom-0 p-6">
			<a
				href='#'
				class='inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300'
			>
				Listen
				<svg
					aria-hidden='true'
					class='w-4 h-4 ml-2 -mr-1'
					fill='currentColor'
					viewBox='0 0 20 20'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path
						fill-rule='evenodd'
						d='M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z'
						clipRule='evenodd'
					></path>
				</svg>
			</a>
      <button>Rate</button>
      </div>
		</div>
	);
}
