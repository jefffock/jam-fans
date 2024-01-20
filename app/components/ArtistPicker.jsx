import { useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/solid'

export default function ArtistPicker({ artists, handleArtistsChange, artistFilters }) {
	return (
		<div className="sm:col-span-4 mx-4">
			<fieldset>
				{/* <legend className="text-2xl text-gray-900 pt-4">Bands</legend> */}
				<div className="divide-y divide-gray-200 border-t border-b border-gray-200 max-h-60 overflow-y-scroll mb-4">
					{artists &&
						artists?.map((artist, artistIdx) => (
							<div key={artistIdx} className="relative flex items-start py-4">
								<div className="min-w-0 flex-1 text-sm ">
									<label
										htmlFor={`${artist.artist}`}
										className="select-none font-medium text-gray-700 mx-2 whitespace-normal"
									>
										{artist.artist + ` (${artist.jam_count} jams)`}
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
										onChange={handleArtistsChange}
										defaultChecked={artistFilters.includes(artist.id.toString())}
									/>
								</div>
							</div>
						))}
				</div>
			</fieldset>
		</div>
	)
}
