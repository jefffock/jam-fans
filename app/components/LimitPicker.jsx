import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

const limits = [
	{ value: 10, label: 'Show 10' },
	{ value: 20, label: 'Show 20' },
	{ value: 50, label: 'Show 50' },
	{ value: 100, label: 'Show 100' },
	{ value: 200, label: 'Show 200' },
	{ value: 500, label: 'Show 500' },
	{ value: 1000, label: 'Show 1000' },
	{ value: null, label: 'Show All' },
]

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

export default function Example() {
	const [selectedLimit, setSelectedLimit] = useState(limits[3])

	return (
		<Listbox value={selected} onChange={setSelected}>
			{({ open }) => (
				<div className="max-w-20">
					<Listbox.Label className="block text-lg font-medium text-gray-900">How many?</Listbox.Label>
					<div className="relative mt-1">
						<Listbox.Button className="relative cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 sm:text-sm">
							<span className="block truncate">{selected.label}</span>
							<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
								<ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
							</span>
						</Listbox.Button>

						<Transition
							show={open}
							as={Fragment}
							leave="transition ease-in duration-100"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<Listbox.Options className="absolute z-10 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
								{limits.map((limit, limitIndex) => (
									<Listbox.Option
										key={limitIndex}
										className={({ active }) =>
											classNames(
												active ? 'text-white bg-cyan-600' : 'text-gray-900',
												'relative cursor-default select-none py-2 pl-3 pr-9'
											)
										}
										value={limit}
									>
										{({ selected, active }) => (
											<>
												<span
													className={classNames(
														selected ? 'font-semibold' : 'font-normal',
														'block truncate'
													)}
												>
													{limit.label}
												</span>

												{selected ? (
													<span
														className={classNames(
															active ? 'text-white' : 'text-cyan-600',
															'absolute inset-y-0 right-0 flex items-center pr-4'
														)}
													>
														<CheckIcon className="h-5 w-5" aria-hidden="true" />
													</span>
												) : null}
											</>
										)}
									</Listbox.Option>
								))}
							</Listbox.Options>
						</Transition>
					</div>
				</div>
			)}
		</Listbox>
	)
}
