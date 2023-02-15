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
	console.log('newSearch', newSearch);
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
					{search.includes('order=avg_rating')
						? 'Highest Rated'
						: search.includes('order=id')
						? 'Recently Added'
						: search.includes('order=num_ratings')
						? 'Most Rated'
						: 'Sort By'}
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
									Highest Rated
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
									Most Rated
								</Link>
							)}
						</Menu.Item>
					</ul>
				</Menu.Items>
			</Transition>
		</Menu>
	);
}
