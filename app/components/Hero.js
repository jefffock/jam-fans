import { useState, useEffect } from 'react';

export default function Hero({open, setOpen}) {

	return (
		<div className='flex flex-col items-center justify-center p-4 pb-6 bg-white text-cyan-600'>
			{/* <h1 className='text-3xl font-bold'>Discover your next favorite jam 💃</h1> */}
			{/* <ul className='text-xl font-normal mt-3'>
				<li className='my-2'>&#8226; Crowdsourced by the community</li>
				<li className='my-2'>&#8226; Use the filters to find specific sounds</li>
				<li className='my-2'>&#8226; Add your favorites, no account needed!</li>
			</ul> */}
			<h1 className='text-3xl font-bold my-2 p-4'>
				<a href="/add/jam" className="underline">Curate* jams</a>
			</h1>
      <p className='text-cyan-600 text-xl'>+</p>
      <h1 className='text-3xl font-bold my-2 p-4 underline cursor-pointer' onClick={() => setOpen(!open)}>
				Find jams
			</h1>
			<div className='max-w-4xl flex align-middle text-cyan-700 mt-6'>
				{/* <h2 className='font-bold text-2xl m-4 mb-0'>It's all subjective, that's part of the fun</h2> */}
				<p className='text-xl mx-auto text-center'>
        *This is subjective, which is part of the fun! It's about love, gratitude, and sharing the music, not competition. <br/><br/>"If you get confused, listen to the music play"
				</p>
			</div>
		</div>
	);
}
