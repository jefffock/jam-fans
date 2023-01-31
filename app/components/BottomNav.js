import { Link } from '@remix-run/react';

export default function BottomNav({ supabase, session }) {
	return (
		<section
			id='bottom-navigation'
			className='block fixed inset-x-0 bottom-0 z-10 bg-white shadow h-14'
		>
			<nav className='flex justify-around max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='-mb-px flex space-x-8 justify-center align-middle pt-1'>
					<div className='text-center text-neutral-700 hover:text-neutral-900 flex flex-col'>
						<Link
							to='/jams'
							className='text-center text-neutral-700 hover:text-neutral-900 flex flex-col'
						>
							<div className='mx-auto'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
									strokeWidth='1.5'
									stroke='currentColor'
									className='w-6 h-6'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										d='M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z'
									/>
								</svg>
							</div>
							Discover
						</Link>
					</div>
					<Link
						to='/add'
						className='text-center text-neutral-700 hover:text-neutral-900 flex flex-col'
					>
						<div  className='mx-auto'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth='1.5'
								stroke='currentColor'
								className='w-6 h-6'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z'
								/>
							</svg>
						</div>
						Add
					</Link>
				</div>
			</nav>
		</section>
	);
}
