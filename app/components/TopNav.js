import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useOutletContext, Link } from '@remix-run/react';

const navigation = [
	{ name: 'Home', href: '/', current: true },
	{ name: 'Jams', href: '/jams', current: false },
	{ name: 'Add', href: '/add/jam', current: false },
];
const userNavigation = [
	// { name: 'Settings', href: '#' },
	{ name: 'Sign out', href: '#' },
];

function classNames(...classes) {
	return classes.filter(Boolean).join(' ');
}

export default function TopNav({ title, supabase, session }) {
	const user = session?.user;

	async function handleSignOut() {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
		} else {
			navigate('/');
		}
	}
	return (
		<>
			<div className='min-h-full'>
				<Disclosure
					as='nav'
					className='bg-white shadow-sm'
				>
					{({ open }) => (
						<>
							<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
								<div className='flex h-16 justify-between'>
									<div className='flex'>
										<div className='flex flex-shrink-0 items-center'>
                      <Link to='/'>
											<img
												href='/'
												className='block h-8 w-auto lg:hidden'
												src='/icon-circle.png'
												alt='Jam Fans'
											/>
											<img
												href='/'
												className='hidden h-8 w-auto lg:block'
												src='/icon-circle.png'
												alt='Jam Fans'
											/>
                      </Link>
										</div>
										<div className='hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8'>
											{navigation.map((item) => (
												<a
													key={item.name}
													href={item.href}
													className={classNames(
														item.current
															? 'border-indigo-500 text-gray-900'
															: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
														'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
													)}
													aria-current={item.current ? 'page' : undefined}
												>
													{item.name}
												</a>
											))}
										</div>
									</div>
									<div className='hidden sm:inline self-center'>
										{user && (
											<div className=''>
												{userNavigation.map((item) => (
													<Disclosure.Button
														key={item.name}
														className='border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex px-1 pt-1 border-b-2 text-sm font-medium'
														onClick={handleSignOut}
													>
														{item.name}
													</Disclosure.Button>
												))}
											</div>
										)}
										{!user && (
											<div className='ml-auto space-y-1 self-center'>
												<a
													href='/login'
													className='border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex px-1 pt-1 border-b-2 text-sm font-medium'
												>
													Login
												</a>
											</div>
										)}
									</div>
									<div className='-mr-2 flex items-center sm:hidden'>
										{/* Mobile menu button */}
										<Disclosure.Button className='inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
											<span className='sr-only'>Open main menu</span>
											{open ? (
												<XMarkIcon
													className='block h-6 w-6'
													aria-hidden='true'
												/>
											) : (
												<Bars3Icon
													className='block h-6 w-6'
													aria-hidden='true'
												/>
											)}
										</Disclosure.Button>
									</div>
								</div>
							</div>

							<Disclosure.Panel className='sm:hidden'>
								<div className='space-y-1 pt-2 pb-3'>
									{navigation.map((item) => (
										<Disclosure.Button
											key={item.name}
											as='a'
											href={item.href}
											className={classNames(
												item.current
													? 'bg-indigo-50 border-indigo-500 text-indigo-700'
													: 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
												'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
											)}
											aria-current={item.current ? 'page' : undefined}
										>
											{item.name}
										</Disclosure.Button>
									))}
								</div>
								<div className='border-t border-gray-200 pt-4 pb-3'>
									<div className=' space-y-1'>
										{user &&
											userNavigation.map((item) => (
												<Disclosure.Button
													key={item.name}
													as='a'
													href={item.href}
													className={classNames(
														item?.current
															? 'bg-indigo-50 border-indigo-500 text-indigo-700'
															: 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
														'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
													)}
													onClick={handleSignOut}
												>
													{item.name}
												</Disclosure.Button>
											))}
										{!user && (
											<div className=''>
												<Disclosure.Button className='ml-auto space-y-1 self-center'>
													<a
														href='/login'
														className={classNames(
															'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
															'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
														)}
													>
														Login
													</a>
												</Disclosure.Button>
												<br />
												<Disclosure.Button className='ml-auto space-y-1 self-center'>
													<a
														href='/join'
														className={classNames(
															'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
															'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
														)}
													>
														Sign up
													</a>
												</Disclosure.Button>
											</div>
										)}
									</div>
								</div>
							</Disclosure.Panel>
						</>
					)}
				</Disclosure>
				{/* 
        <div className="py-3">
          <header>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">{title ?? 'Jams'}</h1>
            </div>
          </header>
        </div> */}
			</div>
		</>
	);
}
