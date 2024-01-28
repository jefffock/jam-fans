import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

const YearFilter = ({ filterType, value, onChange, dates, displayValue }) => {
	return (
		<div className="p-4 w-full">
			<Listbox value={value} onChange={onChange}>
				{({ open }) => (
					<>
						<Listbox.Label className="block text-2xl text-gray-900 hidden">
							{filterType === 'before' ? 'before' : 'after'}
						</Listbox.Label>
						<div className="relative mt-1">
							<Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-2 pr-4 text-left shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 sm:text-sm">
								<span className="block truncate">{displayValue}</span>
								<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1">
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
								<Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
									{dates.map((date, idx) => (
										<Listbox.Option
											key={idx}
											className={({ active }) =>
												`relative cursor-default select-none py-2 pl-3 pr-4 ${
													active ? 'text-white bg-cyan-600' : 'text-gray-900'
												}`
											}
											value={date}
										>
											{({ selected, active }) => (
												<>
													<span
														className={`block truncate ${
															selected ? 'font-semibold' : 'font-normal'
														}`}
													>
														{`${date} or ${filterType === 'before' ? 'earlier' : 'later'}`}
													</span>
													{selected ? (
														<span
															className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
																active ? 'text-white' : 'text-cyan-600'
															}`}
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
					</>
				)}
			</Listbox>
		</div>
	)
}

export default YearFilter
