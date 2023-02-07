export default function Hero() {
	return (
		<div className='flex flex-col items-center justify-center p-4 py-6 bg-white text-cyan-700'>
			{/* <h1 className='text-3xl font-bold'>Discover your next favorite jam 💃</h1> */}
			{/* <ul className='text-xl font-normal mt-3'>
				<li className='my-2'>&#8226; Crowdsourced by the community</li>
				<li className='my-2'>&#8226; Use the filters to find specific sounds</li>
				<li className='my-2'>&#8226; Add your favorites, no account needed!</li>
			</ul> */}
			<h1 className='text-3xl font-bold my-2 p-4'>
				Help other fans discover your favorite jams 💃
			</h1>
			<div className='max-w-4xl flex flex-col align-middle items-start'>
				<h2 className='font-bold text-2xl m-4 mb-0'>Your time to shine</h2>
				<p className='text-xl m-4 mt-0'>
					Contribute to the collective jam knowledge by adding and rating your favorite jams.
				</p>
				<h2 className='font-bold text-2xl m-4 mb-0'>Reward</h2>
				<p className='text-xl m-4 mt-0'>
					An easy way to check out bands or dive deep with your favorites.
					Enjoy the satisfaction of knowing you're helping beautiful sounds reach new
					ears and hearts.
				</p>
			</div>

			{/* <div className='max-w-3xl flex flex-col align-middle items-start'>
      <h2 className='text-2xl m-2'>Mission: Make great jams easy to find</h2>
      <h2 className='text-2xl m-2'>Challenge: Reach a critical mass of jams (100+ jams by every artist)</h2>
      <h2 className='text-2xl m-2'>Adventure: Contribute to the collective "wisdom" of jam fans</h2>
      <h2 className='text-2xl m-2'>Reward: An easy way to explore new music or dive deep with your favorites, and the satisfaction of knowing you helped beautiful sounds reach new ears.</h2>
      </div> */}
			{/* <ul className='text-xl font-normal mt-3'>
				<li className='my-2'>&#8226; Crowdsourced by the community</li>
				<li className='my-2'>&#8226; Use the filters to find specific sounds</li>
				<li className='my-2'>&#8226; Add your favorites, no account needed!</li>
			</ul> */}
		</div>
	);
}
