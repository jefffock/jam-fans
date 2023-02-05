import { Link, Outlet, useOutletContext } from '@remix-run/react';

export default function Add() {
  const { supabase, session } = useOutletContext();
	//todo: parse
	return (
		<>
				{/* <div className='block m-4'>
					<p className='text-center m-4 text-xl'>Add and/or Rate a Jam</p>
				</div> */}
			{/* <div className='flex justify-around mx-auto my-4'>
				<div className='rounded-md shadow-sm'>
					<Link to='/add/jam'>
						<button
							type='button'
							className='relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500'
						>
							Jam
						</button>
					</Link>
					<Link to='/add/set'>
						<button
							type='button'
							className='relative -ml-px inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500'
						>
							Set
						</button>
					</Link>
					<Link to='/add/show'>
						<button
							type='button'
							className='relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500'
						>
							Show
						</button>
					</Link>
				</div> */}
			{/* </div> */}
			<Outlet context={{ supabase, session }} />
		</>
	);
}
