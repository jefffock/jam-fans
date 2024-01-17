import { Fragment, useState, useEffect } from 'react'
import { Form, useSubmit, useFetcher, Link } from '@remix-run/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Combobox, Listbox, Transition, Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { set } from 'zod'

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

export default function JamFiltersClientside({
	songs,
	artists,
	sounds,
	open,
	setOpen,
	totalCount,
	search,
	showIframe,
	setArtistFilters,
	setSoundFilters,
	setSongFilter,
	setBeforeDateFilter,
	setAfterDateFilter,
	setDateFilter,
	setOrderBy,
	setShowComments,
	setShowRatings,
	songFilter,
	artistFilters,
	soundFilters,
	beforeDateFilter,
	afterDateFilter,
	dateFilter,
	showComments,
	showRatings,
	orderBy,
	jamsLength,
	linkFilter,
	setLinkFilter,
	query,
	setQuery,
}) {
	const submit = useSubmit()
	const fetcher = useFetcher()
	const [date, setDate] = useState('')
	const [dateInput, setDateInput] = useState('')
	const [songSelected, setSongSelected] = useState(null)

	const dates = []
	let currentYear = new Date().getFullYear()
	for (var i = currentYear; i > 1959; i--) {
		dates.push(i)
	}

	const filteredSongs =
		query === ''
			? songs
			: songs?.filter((song) => {
					return song.song.toLowerCase().includes(query.toLowerCase())
				})
	if (filteredSongs?.length === 1 && query !== '' && songFilter !== filteredSongs[0].id.toString()) {
		setSongSelected(filteredSongs[0].song)
		setSongFilter(filteredSongs[0].id.toString())
	}

	const beforeYearDisplayValue = beforeDateFilter ? `${beforeDateFilter} or earlier` : `${currentYear} or earlier`

	const afterYearDisplayValue = afterDateFilter ? `${afterDateFilter} or later` : '1960 or later'

	function clearFilters() {
		setQuery('')
		setArtistFilters([])
		setSoundFilters([])
		setSongFilter('')
		setDateFilter('')
		setBeforeDateFilter('')
		setAfterDateFilter('')
		const form = document.querySelector('#jam-filter-form')
		const inputs = form?.querySelectorAll('input, select')

		inputs.forEach((input) => {
			if (input.type === 'checkbox') input.checked = false
			else {
				input.value = ''
			}
		})
	}

	function handleArtistsChange(e) {
		let artistId = e.target.value
		if (e.target.checked) {
			setArtistFilters((prev) => [...prev, artistId])
		} else {
			setArtistFilters((prev) => prev.filter((artist) => artist !== artistId))
		}
	}

	function handleSoundsChange(e) {
		let soundId = e.target.value
		if (e.target.checked) {
			setSoundFilters((prev) => [...prev, soundId])
		} else {
			setSoundFilters((prev) => prev.filter((sound) => sound !== soundId))
		}
	}

	function handleDateInputChange(e) {
		setDateInput(e.target.value)
		let dateInput = e.target.value
		if (dateInput.length === 8) {
			let month = dateInput.slice(0, 2)
			let day = dateInput.slice(2, 4)
			let year = dateInput.slice(4, 8)
			let date = new Date(year, month - 1, day)
			if (date.toString() === 'Invalid Date') {
				//handleerror
			} else {
				// setDate(date.toJSON().slice(0, 10))
				setDateFilter(date.toJSON().slice(0, 10))
			}
		}
	}

	function handleAfterChange(e) {
		let afterYear = e.target.value
		//afterYear is a string value in a select input, not a checkbox
		if (afterYear) {
			setAfterDateFilter(afterYear)
		}
	}

	function handleShowCommentsChange(e) {
		let showComments = e.target.value
		//showComments is a string value in a select input, not a checkbox
		if (showComments) {
			setShowComments(showComments)
		}
	}

	function handleShowRatingsChange(e) {
		let showRatings = e.target.value
		//showRatings is a string value in a select input, not a checkbox
		if (showRatings) {
			setShowRatings(showRatings)
		}
	}

	function handleCloseFilters(e) {
		e.preventDefault()
		setOpen(false)
	}

	function handleLinkChange(e) {
		// this event is from a checkbox
		setLinkFilter(e.target.checked)
	}

	function clearSong() {
		console.log('clear song')
		setSongFilter('')
		setSongSelected(null)
		setQuery('')
	}

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
												<div className="flex items-start justify-between">
													<Dialog.Title className="text-2xl font-med text-gray-900 px-4">
														Filters
													</Dialog.Title>
													<div className="ml-3 flex h-7 items-center">
														<button
															type="button"
															className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
															onClick={() => setOpen(false)}
														>
															<span className="sr-only">Close panel</span>
															<XMarkIcon className="h-6 w-6" aria-hidden="true" />
														</button>
													</div>
												</div>
											</div>
											{/* Jam Filters*/}
											<Form
												action="/jams"
												className="space-y-6 divide-y divide-gray-200"
												id="jam-filter-form"
												onSubmit={() => e.preventDefault()}
											>
												<div className="relative mt-6 flex-1 px-4 sm:px-6">
													<div className="space-y-6 divide-y divide-gray-200">
														{/* sound picker*/}
														<div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
															<div className="sm:col-span-6 mx-4">
																<div className="mt-1 flex rounded-md shadow-sm">
																	<fieldset>
																		<legend className="text-2xl text-gray-900">
																			Sounds
																		</legend>
																		<div className="mt-4 divide-y divide-gray-200 border-t border-b border-gray-200 max-h-60 overflow-y-scroll sm:col-span-6">
																			{sounds &&
																				sounds?.map((sound, soundIdx) => (
																					<div
																						key={soundIdx}
																						className="relative flex items-start py-4"
																					>
																						<div className="min-w-0 flex-1 text-sm">
																							<label
																								htmlFor={`${sound.text}`}
																								className="select-none font-medium text-gray-700 mx-2"
																							>
																								{sound?.label}
																							</label>
																						</div>
																						<div className="ml-3 flex h-5 items-center">
																							<input
																								value={`${sound.id}`}
																								id={`${sound.text}`}
																								name="sounds"
																								type="checkbox"
																								className="h-6 w-6 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500  border-2 mr-2"
																								onChange={
																									handleSoundsChange
																								}
																								defaultChecked={soundFilters.includes(
																									sound.id.toString()
																								)}
																							/>
																						</div>
																					</div>
																				))}
																		</div>
																	</fieldset>
																</div>
															</div>
														</div>
														{/* Artist Band Picker */}
														<div className="sm:col-span-4 mx-4 mt-6">
															<div className="mt-1 flex rounded-md shadow-sm">
																<fieldset>
																	<legend className="text-2xl text-gray-900 pt-4">
																		Bands
																	</legend>
																	<div className="mt-4 divide-y divide-gray-200 border-t border-b border-gray-200 max-h-60 overflow-y-scroll">
																		{artists &&
																			artists?.map((artist, artistIdx) => (
																				<div
																					key={artistIdx}
																					className="relative flex items-start py-4"
																				>
																					<div className="min-w-0 flex-1 text-sm ">
																						<label
																							htmlFor={`${artist.artist}`}
																							className="select-none font-medium text-gray-700 mx-2 whitespace-normal"
																						>
																							{artist.artist +
																								` (${artist.jam_count} jams)`}
																						</label>
																					</div>
																					<div className="ml-3 flex h-5 items-center">
																						<input
																							id={`${artist.url}`}
																							value={`${artist.id}`}
																							name={`artists`}
																							type="checkbox"
																							className="h-6 w-6 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 mr-2 border-2"
																							// onChange={
																							// 	handleArtistsChange
																							// }
																							onChange={
																								handleArtistsChange
																							}
																							defaultChecked={artistFilters.includes(
																								artist.id.toString()
																							)}
																						/>
																					</div>
																				</div>
																			))}
																	</div>
																</fieldset>
															</div>
														</div>
														{/* Song Picker */}
														<div className="max-w-sm p-4">
															<Combobox
																as="div"
																value={songSelected}
																placeholder="All songs"
																onChange={(event) => {
																	setSongFilter(event)
																	setSongSelected(event)
																}}
																name="song"
															>
																<Combobox.Label className="block text-2xl  text-gray-900">
																	Song
																</Combobox.Label>
																<div className="relative mt-1 px-30">
																	<Combobox.Input
																		className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 sm:text-sm"
																		onChange={(event) => {
																			console.log(
																				'event in first on change',
																				event
																			)
																			setQuery(event.target.value)

																			// setSongFilter(event.target.value)
																		}}
																		displayValue={(song) => song}
																		placeholder="Search for a song"
																	/>
																	<Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
																		<ChevronUpDownIcon
																			className="h-5 w-5 text-gray-400"
																			aria-hidden="true"
																		/>
																	</Combobox.Button>

																	{filteredSongs?.length > 0 && (
																		<Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
																			{filteredSongs?.map((song, songIdx) => (
																				<Combobox.Option
																					key={songIdx}
																					value={song.song}
																					className={({ active }) =>
																						classNames(
																							'relative cursor-default select-none py-2 pl-3 pr-9',
																							active
																								? 'bg-cyan-600 text-white'
																								: 'text-gray-900'
																						)
																					}
																				>
																					{({ active, songFilter }) => (
																						<>
																							<span
																								className={classNames(
																									'block truncate',
																									songFilter &&
																										'font-semibold'
																								)}
																							>
																								{song.song}
																							</span>

																							{songFilter && (
																								<span
																									className={classNames(
																										'absolute inset-y-0 right-0 flex items-center pr-4',
																										active
																											? 'text-white'
																											: 'text-cyan-600'
																									)}
																								>
																									<CheckIcon
																										className="h-5 w-5"
																										aria-hidden="true"
																									/>
																								</span>
																							)}
																						</>
																					)}
																				</Combobox.Option>
																			))}
																		</Combobox.Options>
																	)}
																</div>
															</Combobox>
															{songFilter && (
																<div className="flex justify-end">
																	<button
																		type="button"
																		className="rounded-md border border-gray-300 bg-white mt-4 py-2 px-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 text-right focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ml-5 mr-0"
																		onClick={clearSong}
																	>
																		Clear song filter
																	</button>
																</div>
															)}
														</div>
														{/* Year Pickers */}
														{/* <h3 className='block text-2xl font-medium text-gray-900 px-4 pt-4'>
															When
														</h3> */}
														{/* On Date picker */}
														<div className="p-4">
															<label
																htmlFor="date"
																// className='block text-md font-medium text-gray-700'
																className="block text-2xl text-gray-900"
															>
																Date
															</label>
															<input
																type="text"
																name="date"
																id="date"
																value={dateInput || ''}
																onChange={handleDateInputChange}
																className="border border-gray-300 rounded-md p-2"
															/>
															<p className="text-sm">mmddyyyy</p>
															<p className="text-2xl">
																{date
																	? new Date(date + 'T16:00:00').toLocaleDateString()
																	: ''}
															</p>
														</div>
														{/* Before year picker */}
														<div className="p-4">
															<Listbox
																value={beforeDateFilter || ''}
																onChange={setBeforeDateFilter}
																className="max-w-sm"
																name="before"
															>
																{({ open }) => (
																	<div>
																		<Listbox.Label className="block text-2xl text-gray-900">
																			Before
																		</Listbox.Label>
																		<div className="relative mt-1">
																			<Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 sm:text-sm">
																				<span className="block truncate">
																					{beforeYearDisplayValue}
																				</span>
																				<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
																					<ChevronUpDownIcon
																						className="h-5 w-5 text-gray-400"
																						aria-hidden="true"
																					/>
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
																					{dates &&
																						dates.map((date, beforeIdx) => (
																							<Listbox.Option
																								key={beforeIdx}
																								className={({
																									active,
																								}) =>
																									classNames(
																										active
																											? 'text-white bg-cyan-600'
																											: 'text-gray-900',
																										'relative cursor-default select-none py-2 pl-3 pr-9'
																									)
																								}
																								value={date}
																							>
																								{({
																									beforeDateFilter,
																									active,
																								}) => (
																									<>
																										<span
																											className={classNames(
																												beforeDateFilter
																													? 'font-semibold'
																													: 'font-normal',
																												'block truncate'
																											)}
																										>
																											{date} or
																											earlier
																										</span>

																										{beforeDateFilter ? (
																											<span
																												className={classNames(
																													active
																														? 'text-white'
																														: 'text-cyan-600',
																													'absolute inset-y-0 right-0 flex items-center pr-4'
																												)}
																											>
																												<CheckIcon
																													className="h-5 w-5"
																													aria-hidden="true"
																												/>
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
														</div>
														{/* After year */}
														<div className="p-4">
															<Listbox
																value={afterDateFilter}
																onChange={setAfterDateFilter}
																className="max-w-sm"
																name="after"
															>
																{({ open }) => (
																	<div>
																		<Listbox.Label className="block text-2xl text-gray-900">
																			After
																		</Listbox.Label>
																		<div className="relative mt-1">
																			<Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 sm:text-sm">
																				<span className="block truncate">
																					{afterYearDisplayValue}
																				</span>
																				<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
																					<ChevronUpDownIcon
																						className="h-5 w-5 text-gray-400"
																						aria-hidden="true"
																					/>
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
																					{dates &&
																						dates.map((date, afterIdx) => (
																							<Listbox.Option
																								key={afterIdx}
																								className={({
																									active,
																								}) =>
																									classNames(
																										active
																											? 'text-white bg-cyan-600'
																											: 'text-gray-900',
																										'relative cursor-default select-none py-2 pl-3 pr-9'
																									)
																								}
																								value={date}
																							>
																								{({
																									afterDateFilter,
																									active,
																								}) => (
																									<>
																										<span
																											className={classNames(
																												afterDateFilter
																													? 'font-semibold'
																													: 'font-normal',
																												'block truncate'
																											)}
																										>
																											{date} or
																											later
																										</span>

																										{afterDateFilter ? (
																											<span
																												className={classNames(
																													active
																														? 'text-white'
																														: 'text-cyan-600',
																													'absolute inset-y-0 right-0 flex items-center pr-4'
																												)}
																											>
																												<CheckIcon
																													className="h-5 w-5"
																													aria-hidden="true"
																												/>
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
														</div>
														{/* Checkbox options (show ratings, only show links) */}
														<div className="px-4 py-2 pb-16">
															<fieldset className="space-y-5">
																<legend className="sr-only">Options</legend>
																<div className="relative flex items-start">
																	<div className="flex h-5 items-center">
																		<input
																			id="show-links"
																			aria-describedby="show-links-description"
																			name="show-links"
																			type="checkbox"
																			className="h-6 w-6 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 border-2"
																			onChange={handleLinkChange}
																			defaultChecked={linkFilter}
																		/>
																	</div>
																	<div className="ml-3 text-sm">
																		<label
																			htmlFor="show-links"
																			className="font-medium text-gray-700"
																		>
																			Must have a link
																		</label>
																		<p
																			id="show-links-description"
																			className="text-gray-500"
																		>
																			Only show jams that have a link to a
																			recording.
																		</p>
																	</div>
																</div>
																{/* <div className='relative flex items-start'>
																	<div className='flex h-5 items-center'>
																		<input
																			id='show-ratings'
																			aria-describedby='show-ratings-description'
																			name='show-ratings'
																			type='checkbox'
																			className='h-6 w-6 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 border-2'
																			onChange={createQueryString}
                                      defaultChecked={search?.includes('ratings')}
																		/>
																	</div>
																	<div className='ml-3 text-sm'>
																		<label
																			htmlFor='show-ratings'
																			className='font-medium text-gray-700'
																		>
																			Show ratings
																		</label>
																		<p
																			id='show-ratings-description'
																			className='text-gray-500 pb-16'
																		>
																			Show jam ratings on the cards.
																		</p>
																	</div>
																</div> */}
															</fieldset>
														</div>
													</div>
												</div>
												<div className="absolute flex justify-evenly flex-row-reverse bottom-0 right-0 py-4 bg-white w-full max-w-md px-2">
													{jamsLength === 0 && (
														<Link
															to="/add/jam"
															className="underline mr-2 bottom-0 self-center"
														>
															Add a Jam?
														</Link>
													)}

													<button
														className={
															jamsLength !== 0
																? 'inline-flex justify-center rounded-md border border-transparent bg-cyan-600 py-2 px-2 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2'
																: 'inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 cursor-not-allowed'
														}
														onClick={(e) => handleCloseFilters(e)}
														disabled={jamsLength === 0}
													>
														{jamsLength !== 0 ? `See ${jamsLength} jams` : `0 😢`}
													</button>

													<button
														type="button"
														className="rounded-md border border-gray-300 bg-white py-2 px-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
														onClick={clearFilters}
													>
														Clear Filters
													</button>
													<button
														type="button"
														className="rounded-md border border-gray-300 bg-white py-2 px-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
														onClick={() => setOpen(false)}
													>
														Cancel
													</button>
												</div>
											</Form>
										</div>
										{/* end jam filters */}
										{/* </Form> */}
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
