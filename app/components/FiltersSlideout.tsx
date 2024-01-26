import { Combobox, Listbox, Transition, Dialog } from '@headlessui/react'
import { Fragment } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function FiltersSlideout({ open, setOpen, showIframe, activeTab, setActiveTab, children }) {
	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={setOpen}>
				<div className="fixed inset-0" />
				<div className="fixed inset-0 overflow-hidden">
					<div className="absolute inset-0 overflow-hidden">
						<div className="pointer-events-none fixed inset-y-0 right-0 flex align-bottom max-w-full">
							<Transition.Child
								as={Fragment}
								enter="transform transition ease-in-out duration-500 sm:duration-700"
								enterFrom="translate-x-full"
								enterTo="translate-x-0"
								leave="transform transition ease-in-out duration-500 sm:duration-700"
								leaveFrom="translate-x-0"
								leaveTo="translate-x-full"
							>
								<Dialog.Panel className="pointer-events-auto w-screen max-w-md">
									<div
										className={`flex h-full flex-col divide-y divide-gray-200 bg-white pt-4 shadow-xl rounded-t-xl ${
											showIframe ? 'pb-40' : 'pb-0'
										} sm:pb-0`}
									>
										<div className="flex min-h-0 flex-1 flex-col overflow-y-scroll py-6">
											<div className="px-4 sm:px-6">
												<div className="flex justify-between">
													<div className="flex space-x-10 mx-auto">
														<button
															type="button"
															className={`${
																activeTab === 'explore'
																	? 'text-cyan-600 underline'
																	: 'text-gray-500'
															}`}
															onClick={() => setActiveTab('explore')}
														>
															explore
														</button>
														<button
															type="button"
															className={`${
																activeTab === 'add'
																	? 'text-cyan-600 underline'
																	: 'text-gray-500'
															}`}
															onClick={() => setActiveTab('add')}
														>
															add
														</button>
													</div>
													<button
														type="button"
														className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
														onClick={() => setOpen(false)}
													>
														<span className="sr-only">Close panel</span>
														<XMarkIcon className="h-6 w-6" aria-hidden="true" />
													</button>
												</div>
											</div>
											{children}
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	)
}
