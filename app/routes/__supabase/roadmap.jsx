import { Link } from "@remix-run/react";

export default function RoadMap() {
	return (
    <div className='w-100 h-100'>
		<div className='p-4 bg-white border border-gray-200 rounded-lg shadow m-4 mt-6 w-80 flex flex-col justify-between mx-auto sm:px-6'>
       <div className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
      <h3 className="text-lg font-medium leading-6 text-gray-900 m-4">Coming Soon™️</h3>
    </div>
    <ul className='flex flex-col space-y-4 m-4 list-disc px-4'>
				<li>Shows</li>
				<li>Sets</li>
				<li>Top Contributors</li>
				<li>Individual fan pages</li>
				<li>Make each filtered jams results page have a shorter, shareable address</li>
			</ul>
      <p className='mx-4'>All ideas welcome: <Link to='/contact' className='underline hover:font-medium'>hit me up</Link>!</p>
		</div>
    </div>
	);
}
