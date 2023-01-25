import SongPicker from './SongPicker';
import { useState, useEffect } from 'react';
import SoundPicker from './SoundPicker';
import { Form } from '@remix-run/react';
import YearFilter from './YearFilter';
import LimitPicker from './LimitPicker';
import CheckboxList from './CheckboxList';

export default function JamFilters({ sounds, artists, songs }) {
	return (
		<div>
			<Form
				method='post'
				action='/jams'
				className='space-y-8 divide-y divide-gray-200'
			>
				<div className='space-y-8 divide-y divide-gray-200'>
					<div>
						<p>
							Sounds, Band, Song, After, Before, How Many, Sort, Must Have Link,
							Show Ratings
						</p>
						<div className='mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
							<div className='sm:col-span-4 mx-4'>
								<div className='mt-1 flex rounded-md shadow-sm'>
									{/* sound picker*/}
									<fieldset>
										<legend className='text-lg font-medium text-gray-900'>
											Sounds
										</legend>
										<div className='mt-4 divide-y divide-gray-200 border-t border-b border-gray-200 max-h-52 overflow-y-scroll'>
											{sounds &&
												sounds?.map((sound, soundIdx) => (
													<div
														key={soundIdx}
														className='relative flex items-start py-4'
													>
														<div className='min-w-0 flex-1 text-sm'>
															<label
																htmlFor={`sound-${sound.text}`}
																className='select-none font-medium text-gray-700 mx-2'
															>
																{sound.label}
															</label>
														</div>
														<div className='ml-3 flex h-5 items-center'>
															<input
																id={`sound-${sound.text}`}
																name={`sound-${sound.text}`}
																type='checkbox'
																className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-2'
															/>
														</div>
													</div>
												))}
										</div>
									</fieldset>
								</div>
							</div>
						</div>
						<div className='sm:col-span-4 mx-4 mt-6'>
							<div className='mt-1 flex rounded-md shadow-sm'>
								<fieldset>
									<legend className='text-lg font-medium text-gray-900'>
										Bands
									</legend>
									<div className='mt-4 divide-y divide-gray-200 border-t border-b border-gray-200 max-h-52 overflow-y-scroll'>
										{artists &&
											artists?.map((band, bandIdx) => (
												<div
													key={bandIdx}
													className='relative flex items-start py-4'
												>
													<div className='min-w-0 flex-1 text-sm'>
														<label
															htmlFor={`band-${band.artist}`}
															className='select-none font-medium text-gray-700 mx-2'
														>
															{band.artist}
														</label>
													</div>
													<div className='ml-3 flex h-5 items-center'>
														<input
															id={`band-${band.url}`}
															name={`band-${band.url}`}
															type='checkbox'
															className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-2'
														/>
													</div>
												</div>
											))}
									</div>
								</fieldset>
							</div>
						</div>
						<div className='max-w-sm p-4'>
							<SongPicker songs={songs} />
						</div>
						<h3 className='block text-lg font-medium text-gray-900 px-4'>
							When
						</h3>
						<div className='px-4 py-2'>
							<YearFilter before={true} />
						</div>
						<div className='px-4'>
							<YearFilter before={false} />
						</div>
						<div className='px-4 py-2'>
							<LimitPicker />
						</div>
            <div className='px-4 py-2'>
              <CheckboxList />
            </div>
					</div>
				</div>
			</Form>
		</div>
	);
}
