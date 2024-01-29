import { useState, useMemo } from 'react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Combobox } from '@headlessui/react'
import Button from './Button'

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

export default function SongPicker({
	setSongFilter,
	songFilter,
	setQuery,
	songSelected,
	clearSong,
	setSongSelected,
	songs,
	query,
}) {
	const filteredSongs = useMemo(() => {
		// If query is empty, return all songs
		if (query === '') {
			return songs
		}

		// Otherwise, filter songs based on the query
		return songs?.filter((song) => song.song.toLowerCase().includes(query.toLowerCase()))
	}, [songs, query])

	// if (filteredSongs?.length === 1 && query !== '' && songFilter !== filteredSongs[0].id.toString()) {
	// 	console.log('query', query)
	// 	console.log('songFilter', songFilter)
	// 	console.log('filteredSongs[0]', filteredSongs[0])

	// 	setSongSelected(filteredSongs[0].song)
	// 	setSongFilter(filteredSongs[0].id.toString())
	// }

	const handleQueryChange = (event) => {
		setQuery(event.target.value)
	}

	return (
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
				<Combobox.Label className="block text-2xl  text-gray-900 hidden">song</Combobox.Label>
				<div className="relative mt-1 px-30">
					<Combobox.Input
						className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 sm:text-sm"
						onChange={handleQueryChange}
						displayValue={(song) => song}
						placeholder="Search for a song"
					/>
					<Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
						<ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
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
											active ? 'bg-cyan-600 text-white' : 'text-gray-900'
										)
									}
								>
									{({ active, songFilter }) => (
										<>
											<span
												className={classNames('block truncate', songFilter && 'font-semibold')}
											>
												{song.song}
											</span>

											{songFilter && (
												<span
													className={classNames(
														'absolute inset-y-0 right-0 flex items-center pr-4',
														active ? 'text-white' : 'text-cyan-600'
													)}
												>
													<CheckIcon className="h-5 w-5" aria-hidden="true" />
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
					<Button
						onClick={clearSong}
						text="clear"
						// className="rounded-md border border-gray-300 bg-white mt-4 py-2 px-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 text-right focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ml-5 mr-0"
					/>
				</div>
			)}
		</div>
	)
}
