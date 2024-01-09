import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Link } from '@remix-run/react';

function classNames(...classes) {
	return classes.filter(Boolean).join(' ');
}

export default function Sorter({ orderBy, setOrderBy, search }) {
	let newSearch = search.replace(/[?&]order=[^&]*/g, '');
	if (newSearch.charAt(0) === '?') {
		newSearch = '&' + newSearch.slice(1);
	} else if (newSearch.charAt(0) !== '&' && newSearch.length > 0) {
		newSearch = '&' + newSearch;
	}
	const ratingSearch = '?order=avg_rating' + newSearch;
	const recentSearch = '?order=id' + newSearch;
	const numRatingsSearch = '?order=num_ratings' + newSearch;
	return (
		<Menu
			as='div'
			className='relative inline-block text-left'
		>
			<div>
				<Menu.Button className='inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-100'>
					{search.includes('order=avg_rating') ? (
						<div className='flex'>
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
							<p>s</p>
						</div>
					) : search.includes('order=id') ? (
						'Recently Added'
					) : search.includes('order=num_ratings') ? (
						'Most Curated'
					) : (
						'Sort By'
					)}
					<ChevronDownIcon
						className='-mr-1 ml-2 h-5 w-5'
						aria-hidden='true'
					/>
				</Menu.Button>
			</div>

			<Transition
				as={Fragment}
				enter='transition ease-out duration-100'
				enterFrom='transform opacity-0 scale-95'
				enterTo='transform opacity-100 scale-100'
				leave='transition ease-in duration-75'
				leaveFrom='transform opacity-100 scale-100'
				leaveTo='transform opacity-0 scale-95'
			>
				<Menu.Items className='absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
					<ul className='py-1'>
						<Menu.Item>
							{({ active }) => (
								<Link
									to={ratingSearch}
									className={classNames(
										active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
										'block px-4 py-2 text-sm'
									)}
								>
									<div className='flex text-sm'>
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
							<p >s</p>
						</div>
								</Link>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<Link
									to={recentSearch}
									className={classNames(
										active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
										'block px-4 py-2 text-sm'
									)}
								>
									Recently Added
								</Link>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<Link
									to={numRatingsSearch}
									className={classNames(
										active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
										'block px-4 py-2 text-sm'
									)}
								>
									Most Curated
								</Link>
							)}
						</Menu.Item>
					</ul>
				</Menu.Items>
			</Transition>
		</Menu>
	);
}
