export default function Hero() {
	return (
		<div className='flex flex-col items-center justify-center p-10 bg-white text-cyan-700'>
			<h1 className='text-3xl font-bold'>Discover your next favorite jam 💃</h1>
			<ul className='text-xl font-normal mt-3'>
				<li className='my-2'>&#8226; Crowdsourced by the community</li>
				<li className='my-2'>&#8226; Use the filters to find specific sounds</li>
				<li className='my-2'>&#8226; Add your favorites (no account required)</li>
			</ul>
		</div>
	);
}
