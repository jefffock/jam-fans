function Filters({ sounds, artists, songs }) {
	const [query, setQuery] = useState('');
	const [songSelected, setSongSelected] = useState(null);
	const [beforeYearSelected, setBeforeYearSelected] = useState(null);
	const [afterYearSelected, setAfterYearSelected] = useState(null);
	const [limitSelected, setLimitSelected] = useState(limits[3]);

	const dates = [];
	let currentYear = new Date().getFullYear();
	for (var i = currentYear; i > 1959; i--) {
		dates.push(i);
	}

	const filteredSongs =
		query === ''
			? songs
			: songs?.filter((song) => {
					return song.song.toLowerCase().includes(query.toLowerCase());
			  });

	const beforeYearDisplayValue = beforeYearSelected
		? `Played in ${beforeYearSelected} or before`
		: `Played in ${currentYear} or before`;

	const afterYearDisplayValue = afterYearSelected
		? `Played in ${afterYearSelected} or after`
		: 'Played in 1965 or after';

	return ( null )
		// <div className='space-y-8 divide-y divide-gray-200'>
		// 	<div>
		// 		<div className='mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
		// 			<div className='sm:col-span-4 mx-4'>
		// 				<div className='mt-1 flex rounded-md shadow-sm'>
		// 					{/* sound picker*/}
		// 					<fieldset>
		// 						<legend className='text-lg font-medium text-gray-900'>
		// 							Sounds
		// 						</legend>
		// 						<div className='mt-4 divide-y divide-gray-200 border-t border-b border-gray-200 max-h-52 overflow-y-scroll'>
		// 							{sounds &&
		// 								sounds?.map((sound, soundIdx) => (
		// 									<div
		// 										key={soundIdx}
		// 										className='relative flex items-start py-4'
		// 									>
		// 										<div className='min-w-0 flex-1 text-sm'>
		// 											<label
		// 												htmlFor={`sound-${sound.text}`}
		// 												className='select-none font-medium text-gray-700 mx-2'
		// 											>
		// 												{sound.label}
		// 											</label>
		// 										</div>
		// 										<div className='ml-3 flex h-5 items-center'>
		// 											<input
		// 												id={`sound-${sound.text}`}
		// 												name={`sound-${sound.text}`}
		// 												type='checkbox'
		// 												className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-2'
		// 											/>
		// 										</div>
		// 									</div>
		// 								))}
		// 						</div>
		// 					</fieldset>
		// 				</div>
		// 			</div>
		// 		</div>
		// 		{/* Artist Picker */}
		// 		<div className='sm:col-span-4 mx-4 mt-6'>
		// 			<div className='mt-1 flex rounded-md shadow-sm'>
		// 				<fieldset>
		// 					<legend className='text-lg font-medium text-gray-900'>
		// 						Bands
		// 					</legend>
		// 					<div className='mt-4 divide-y divide-gray-200 border-t border-b border-gray-200 max-h-52 overflow-y-scroll'>
		// 						{artists &&
		// 							artists?.map((band, bandIdx) => (
		// 								<div
		// 									key={bandIdx}
		// 									className='relative flex items-start py-4'
		// 								>
		// 									<div className='min-w-0 flex-1 text-sm'>
		// 										<label
		// 											htmlFor={`band-${band.artist}`}
		// 											className='select-none font-medium text-gray-700 mx-2'
		// 										>
		// 											{band.artist}
		// 										</label>
		// 									</div>
		// 									<div className='ml-3 flex h-5 items-center'>
		// 										<input
		// 											id={`band-${band.url}`}
		// 											name={`band-${band.url}`}
		// 											type='checkbox'
		// 											className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-2'
		// 										/>
		// 									</div>
		// 								</div>
		// 							))}
		// 					</div>
		// 				</fieldset>
		// 			</div>
		// 		</div>
		// 		{/* Song Picker */}
		// 		<div className='max-w-sm p-4'>
		// 			<Combobox
		// 				as='div'
		// 				value={songSelected}
		// 				onChange={setSongSelected}
		// 				name='song'
		// 			>
		// 				<Combobox.Label className='block text-lg font-medium text-gray-900'>
		// 					Song
		// 				</Combobox.Label>
		// 				<div className='relative mt-1 px-30'>
		// 					<Combobox.Input
		// 						className='w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm'
		// 						onChange={(event) => setQuery(event.target.value)}
		// 						displayValue={(song) => song}
		// 					/>
		// 					<Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
		// 						<ChevronUpDownIcon
		// 							className='h-5 w-5 text-gray-400'
		// 							aria-hidden='true'
		// 						/>
		// 					</Combobox.Button>

		// 					{filteredSongs?.length > 0 && (
		// 						<Combobox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
		// 							{filteredSongs?.map((song) => (
		// 								<Combobox.Option
		// 									key={song.id}
		// 									value={song.song}
		// 									className={({ active }) =>
		// 										classNames(
		// 											'relative cursor-default select-none py-2 pl-3 pr-9',
		// 											active ? 'bg-indigo-600 text-white' : 'text-gray-900'
		// 										)
		// 									}
		// 								>
		// 									{({ active, songSelected }) => (
		// 										<>
		// 											<span
		// 												className={classNames(
		// 													'block truncate',
		// 													songSelected && 'font-semibold'
		// 												)}
		// 											>
		// 												{song.song}
		// 											</span>

		// 											{songSelected && (
		// 												<span
		// 													className={classNames(
		// 														'absolute inset-y-0 right-0 flex items-center pr-4',
		// 														active ? 'text-white' : 'text-indigo-600'
		// 													)}
		// 												>
		// 													<CheckIcon
		// 														className='h-5 w-5'
		// 														aria-hidden='true'
		// 													/>
		// 												</span>
		// 											)}
		// 										</>
		// 									)}
		// 								</Combobox.Option>
		// 							))}
		// 						</Combobox.Options>
		// 					)}
		// 				</div>
		// 			</Combobox>
		// 		</div>
		// 		{/* Year Pickers */}
		// 		<h3 className='block text-lg font-medium text-gray-900 px-4'>When</h3>
		// 		{/* Before year picker */}
		// 		<div className='px-4 py-2 max-w-xs'>
		// 			<Listbox
		// 				value={beforeYearSelected}
		// 				onChange={setBeforeYearSelected}
		// 				className='max-w-sm'
		// 				name='before-year'
		// 			>
		// 				{({ open }) => (
		// 					<div>
		// 						<Listbox.Label className='block text-sm font-medium text-gray-700'>
		// 							Before
		// 						</Listbox.Label>
		// 						<div className='relative mt-1'>
		// 							<Listbox.Button className='relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm'>
		// 								<span className='block truncate'>
		// 									{beforeYearDisplayValue}
		// 								</span>
		// 								<span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
		// 									<ChevronUpDownIcon
		// 										className='h-5 w-5 text-gray-400'
		// 										aria-hidden='true'
		// 									/>
		// 								</span>
		// 							</Listbox.Button>

		// 							<Transition
		// 								show={open}
		// 								as={Fragment}
		// 								leave='transition ease-in duration-100'
		// 								leaveFrom='opacity-100'
		// 								leaveTo='opacity-0'
		// 							>
		// 								<Listbox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
		// 									{dates &&
		// 										dates.map((date, index) => (
		// 											<Listbox.Option
		// 												key={index}
		// 												className={({ active }) =>
		// 													classNames(
		// 														active
		// 															? 'text-white bg-indigo-600'
		// 															: 'text-gray-900',
		// 														'relative cursor-default select-none py-2 pl-3 pr-9'
		// 													)
		// 												}
		// 												value={date}
		// 											>
		// 												{({ beforeYearSelected, active }) => (
		// 													<>
		// 														<span
		// 															className={classNames(
		// 																beforeYearSelected
		// 																	? 'font-semibold'
		// 																	: 'font-normal',
		// 																'block truncate'
		// 															)}
		// 														>
		// 															{date} or before
		// 														</span>

		// 														{beforeYearSelected ? (
		// 															<span
		// 																className={classNames(
		// 																	active ? 'text-white' : 'text-indigo-600',
		// 																	'absolute inset-y-0 right-0 flex items-center pr-4'
		// 																)}
		// 															>
		// 																<CheckIcon
		// 																	className='h-5 w-5'
		// 																	aria-hidden='true'
		// 																/>
		// 															</span>
		// 														) : null}
		// 													</>
		// 												)}
		// 											</Listbox.Option>
		// 										))}
		// 								</Listbox.Options>
		// 							</Transition>
		// 						</div>
		// 					</div>
		// 				)}
		// 			</Listbox>
		// 		</div>
		// 		{/* After year */}
		// 		<div className='px-4'>
		// 			<Listbox
		// 				value={afterYearSelected}
		// 				onChange={setAfterYearSelected}
		// 				className='max-w-sm'
		// 				name='after-year'
		// 			>
		// 				{({ open }) => (
		// 					<div>
		// 						<Listbox.Label className='block text-sm font-medium text-gray-700'>
		// 							After
		// 						</Listbox.Label>
		// 						<div className='relative mt-1'>
		// 							<Listbox.Button className='relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm'>
		// 								<span className='block truncate'>
		// 									{afterYearDisplayValue}
		// 								</span>
		// 								<span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
		// 									<ChevronUpDownIcon
		// 										className='h-5 w-5 text-gray-400'
		// 										aria-hidden='true'
		// 									/>
		// 								</span>
		// 							</Listbox.Button>

		// 							<Transition
		// 								show={open}
		// 								as={Fragment}
		// 								leave='transition ease-in duration-100'
		// 								leaveFrom='opacity-100'
		// 								leaveTo='opacity-0'
		// 							>
		// 								<Listbox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
		// 									{dates &&
		// 										dates.map((date, index) => (
		// 											<Listbox.Option
		// 												key={index}
		// 												className={({ active }) =>
		// 													classNames(
		// 														active
		// 															? 'text-white bg-indigo-600'
		// 															: 'text-gray-900',
		// 														'relative cursor-default select-none py-2 pl-3 pr-9'
		// 													)
		// 												}
		// 												value={date}
		// 											>
		// 												{({ afterYearSelected, active }) => (
		// 													<>
		// 														<span
		// 															className={classNames(
		// 																afterYearSelected
		// 																	? 'font-semibold'
		// 																	: 'font-normal',
		// 																'block truncate'
		// 															)}
		// 														>
		// 															{date} or after
		// 														</span>

		// 														{afterYearSelected ? (
		// 															<span
		// 																className={classNames(
		// 																	active ? 'text-white' : 'text-indigo-600',
		// 																	'absolute inset-y-0 right-0 flex items-center pr-4'
		// 																)}
		// 															>
		// 																<CheckIcon
		// 																	className='h-5 w-5'
		// 																	aria-hidden='true'
		// 																/>
		// 															</span>
		// 														) : null}
		// 													</>
		// 												)}
		// 											</Listbox.Option>
		// 										))}
		// 								</Listbox.Options>
		// 							</Transition>
		// 						</div>
		// 					</div>
		// 				)}
		// 			</Listbox>
		// 		</div>
		// 		{/* Limit Picker */}
		// 		<div className='px-4 py-2'>
		// 			<Listbox
		// 				value={limitSelected}
		// 				onChange={setLimitSelected}
		// 				name='limit'
		// 			>
		// 				{({ open }) => (
		// 					<div className='max-w-20'>
		// 						<Listbox.Label className='block text-lg font-medium text-gray-900'>
		// 							How many
		// 						</Listbox.Label>
		// 						<div className='relative mt-1'>
		// 							<Listbox.Button className='relative cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm'>
		// 								<span className='block truncate'>{limitSelected}</span>
		// 								<span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
		// 									<ChevronUpDownIcon
		// 										className='h-5 w-5 text-gray-400'
		// 										aria-hidden='true'
		// 									/>
		// 								</span>
		// 							</Listbox.Button>

		// 							<Transition
		// 								show={open}
		// 								as={Fragment}
		// 								leave='transition ease-in duration-100'
		// 								leaveFrom='opacity-100'
		// 								leaveTo='opacity-0'
		// 							>
		// 								<Listbox.Options className='absolute z-10 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
		// 									{limits.map((limit, limitIndex) => (
		// 										<Listbox.Option
		// 											key={limitIndex}
		// 											className={({ active }) =>
		// 												classNames(
		// 													active
		// 														? 'text-white bg-indigo-600'
		// 														: 'text-gray-900',
		// 													'relative cursor-default select-none py-2 pl-3 pr-9'
		// 												)
		// 											}
		// 											value={limit}
		// 										>
		// 											{({ limitSelected, active }) => (
		// 												<>
		// 													<span
		// 														className={classNames(
		// 															limitSelected
		// 																? 'font-semibold'
		// 																: 'font-normal',
		// 															'block truncate'
		// 														)}
		// 													>
		// 														{limit}
		// 													</span>

		// 													{limitSelected ? (
		// 														<span
		// 															className={classNames(
		// 																active ? 'text-white' : 'text-indigo-600',
		// 																'absolute inset-y-0 right-0 flex items-center pr-4'
		// 															)}
		// 														>
		// 															<CheckIcon
		// 																className='h-5 w-5'
		// 																aria-hidden='true'
		// 															/>
		// 														</span>
		// 													) : null}
		// 												</>
		// 											)}
		// 										</Listbox.Option>
		// 									))}
		// 								</Listbox.Options>
		// 							</Transition>
		// 						</div>
		// 					</div>
		// 				)}
		// 			</Listbox>
		// 		</div>
		// 		{/* Checkbox options (show ratings, only show links) */}
		// 		<div className='px-4 py-2'>
		// 			<fieldset className='space-y-5'>
		// 				<legend className='sr-only'>Options</legend>
		// 				<div className='relative flex items-start'>
		// 					<div className='flex h-5 items-center'>
		// 						<input
		// 							id='show-links'
		// 							aria-describedby='show-links-description'
		// 							name='show-links'
		// 							type='checkbox'
		// 							className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
		// 						/>
		// 					</div>
		// 					<div className='ml-3 text-sm'>
		// 						<label
		// 							htmlFor='show-links'
		// 							className='font-medium text-gray-700'
		// 						>
		// 							Must have a link
		// 						</label>
		// 						<p
		// 							id='show-links-description'
		// 							className='text-gray-500'
		// 						>
		// 							Only show jams that have a link to a recording.
		// 						</p>
		// 					</div>
		// 				</div>
		// 				<div className='relative flex items-start'>
		// 					<div className='flex h-5 items-center'>
		// 						<input
		// 							id='show-ratings'
		// 							aria-describedby='show-ratings-description'
		// 							name='show-ratings'
		// 							type='checkbox'
		// 							className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
		// 						/>
		// 					</div>
		// 					<div className='ml-3 text-sm'>
		// 						<label
		// 							htmlFor='show-ratings'
		// 							className='font-medium text-gray-700'
		// 						>
		// 							Show ratings
		// 						</label>
		// 						<p
		// 							id='show-ratings-description'
		// 							className='text-gray-500'
		// 						>
		// 							Show jam ratings on the cards.
		// 						</p>
		// 					</div>
		// 				</div>
		// 			</fieldset>
		// 			{/* <button type='submit'>Apply filters</button> */}
		// 		</div>
		// 	</div>
		// </div>
// 	);
}
