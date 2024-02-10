import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link, NavLink, useFormAction } from '@remix-run/react'

const navigation = [
	// { name: 'jams', href: '/jams', current: false },
	// { name: 'curate', href: '/add/jam', current: false },
	// { name: 'coming soon™️', href: '/roadmap', current: false },
]

const userNavigationLoggedOut = [
	{ name: 'login', href: '/login' },
	// { name: 'create an account', href: '/join' },
	{ name: 'credits', href: '/credits' },
	{ name: 'contact', href: '/contact' },
	// { name: 'terms of service', href: '/terms' },
	// { name: 'privacy policy', href: '/privacy' },
]

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

const activeClassName =
	'border-cyan-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
const inactiveClassName =
	'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'

export default function TopNav({ profile }) {
	// console.log('session', session)
	// view session
	const logout = useFormAction('logout')
	const userNavigationLoggedIn = [
		{ name: `${profile?.name}, welcome back!`, href: '/account' },
		{ name: 'account', href: '/account' },
		{ name: 'credits', href: '/credits' },
		{ name: 'contact', href: '/contact' },
		{ name: 'sign out', href: '/logout' },
	]

	const userNavigation = profile ? userNavigationLoggedIn : userNavigationLoggedOut

	const handleSignOut = () => {
		logout()
	}

	return (
		<>
			<div className="min-h-full">
				<Disclosure as="nav" className="bg-white shadow-sm">
					{({ open }) => (
						<>
							<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
								<div className="flex h-16 justify-between relative">
									<div className="flex">
										<div className="flex flex-shrink-0 items-center cursor-pointer">
											<Link to="/">
												<img
													href="/"
													className="block h-8 w-auto lg:hidden cursor-pointer"
													src="/icon-circle.webp"
													alt="Jam Fans"
												/>
												<img
													href="/"
													className="hidden h-8 w-auto lg:block cursor-pointer"
													src="/icon-circle.webp"
													alt="Jam Fans"
												/>
											</Link>
										</div>
										<div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
											{navigation.map((item, itemIndex) => (
												<NavLink
													key={itemIndex}
													to={item.href}
													className={({ isActive }) =>
														isActive ? activeClassName : inactiveClassName
													}
												>
													{item.name}
												</NavLink>
											))}
										</div>
									</div>
									<div className="absolute left-1/2 transform -translate-x-1/2 mt-4 ">
										<Link to="/" className="flex justify-center items-center">
											<p className="text-center text-xl mondegreen cursor-pointer">
												jam.fans{' '}
												<span className="align-baseline text-xs text-custom-pink">beta</span>
											</p>
										</Link>
									</div>
									<div className="flex sm:flex-row self-center items-end">
										{!profile && (
											<div className="hidden lg:-my-px lg:mx-4 lg:flex lg:space-x-8">
												<a
													href="/login"
													className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex align-baseline px-1 border-b-2 text-sm font-medium mr-8 pb-2"
												>
													login
												</a>
												<a
													href="/join"
													className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex px-1 border-b-2 text-sm font-medium mr-8"
												>
													create an account
												</a>
											</div>
										)}
										<div className="-mr-2 flex items-center">
											{/* Mobile menu button */}
											<Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2">
												<span className="sr-only">Open main menu</span>
												{open ? (
													<XMarkIcon className="block h-6 w-6" aria-hidden="true" />
												) : (
													<Bars3Icon className="block h-6 w-6" aria-hidden="true" />
												)}
											</Disclosure.Button>
										</div>
									</div>
								</div>
							</div>

							<Disclosure.Panel className="">
								<div className="inline sm:hidden space-y-1 pt-2 pb-3 text-right">
									{navigation.map((item) => (
										<Disclosure.Button
											key={item.name}
											as="a"
											href={item.href}
											className={classNames(
												item.current
													? 'bg-cyan-50 border-cyan-500 text-cyan-700'
													: 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
												'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
											)}
											aria-current={item.current ? 'page' : undefined}
										>
											{item.name}
										</Disclosure.Button>
									))}
								</div>
								<div className="border-t border-gray-200 pt-4 pb-3 text-right flex flex-row-reverse">
									<div className=" space-y-1 max-w-fit self-end">
										{userNavigation.map((item) => (
											<Disclosure.Button
												key={item.name}
												as="a"
												href={item.href}
												className={classNames(
													item?.current
														? 'bg-cyan-50 border-cyan-500 text-cyan-700'
														: 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
													'ml-auto space-y-1 self-center block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
												)}
												onClick={item.name === 'Sign out' ? () => handleSignOut() : null}
											>
												{item.name}
											</Disclosure.Button>
										))}
									</div>
								</div>
							</Disclosure.Panel>
						</>
					)}
				</Disclosure>
			</div>
		</>
	)
}
