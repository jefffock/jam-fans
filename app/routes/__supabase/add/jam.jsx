import { Form, useLoaderData, useFetcher } from '@remix-run/react';
import { json } from '@remix-run/node';
import { createServerClient } from '@supabase/auth-helpers-remix';
import { Listbox, Transition, Dialog, Combobox } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import InfoAlert from '../../../components/alerts/InfoAlert';

export const loader = async ({ request, params }) => {
	const response = new Response();
	const supabaseClient = createServerClient(
		process.env.SUPABASE_URL,
		process.env.SUPABASE_ANON_KEY,
		{ request, response }
	);
	//get artists
	let { data: artists } = await supabaseClient
		.from('artists')
		.select('nickname, emoji_code, url, artist')
		.order('name_for_order', { ascending: true });
	//get songs
	const { data: songs } = await supabaseClient
		.from('songs')
		.select('song, artist')
		.order('song', { ascending: true });
	const { data: sounds } = await supabaseClient
		.from('sounds')
		.select('label, text')
		.order('label', { ascending: true });
	artists = [
		{
			nickname: 'All Bands',
			emoji_code: '0x221E',
			url: null,
			artist: 'All Bands',
		},
		{ nickname: 'Phish', emoji_code: '0x1F41F', url: 'phish', artist: 'Phish' },
		{
			nickname: 'Grateful Dead',
			emoji_code: '0x1F480',
			url: 'grateful-dead',
			artist: 'Grateful Dead',
		},
	].concat(artists);
	return json(
		{ artists, songs, sounds },
		{
			headers: response.headers,
		}
	);
};

export async function action({ request, params }) {
	const response = new Response();
	console.log('action called');
	let formData = await request.formData();
	console.log('formData', formData);
	console.log('formObj', Object.fromEntries(formData));
	let { _action, ...values } = Object.fromEntries(formData);
	const supabaseClient = createServerClient(
		process.env.SUPABASE_URL,
		process.env.SUPABASE_ANON_KEY,
		{ request, response }
	);
	console.log('values', values);
	console.log('_action', _action);
	if (_action === 'new-song') {
		const { data, error } = await supabaseClient
			.from('songs')
			.insert({ song: values['new-song'], artist: values.artist });
		console.log('data', data);
		console.log('error', error);
		console.log('values in new-song', values);
	}

	return { status: 200, body: 'ok' };
}

export default function AddJam() {
	const fetcher = useFetcher();
	const { artists, songs, sounds, initialArtist, initialSong } =
		useLoaderData();
	const [songSelected, setSongSelected] = useState('');
	const [soundsSelected, setSoundsSelected] = useState('');
	const [jamDate, setJamDate] = useState('');
	const [jamLocation, setJamLocation] = useState('');
	const [query, setQuery] = useState('');
	const [artist, setArtist] = useState(initialArtist ?? '');
	const [song, setSong] = useState(initialSong ?? '');
	const [songObj, setSongObj] = useState(null);
	const [songExists, setSongExists] = useState(false);
	const [loading, setLoading] = useState(null);
	const [open, setOpen] = useState(false);
	const [songErrorText, setSongErrorText] = useState(null);
	const [artistErrorText, setArtistErrorText] = useState(null);
	const [dateErrorText, setDateErrorText] = useState(null);
	const [locationErrorText, setLocationErrorText] = useState(null);
	const [successAlertText, setSuccessAlertText] = useState(null);
	const [tags, setTags] = useState([]);
	const [date, setDate] = useState(null);
	const [location, setLocation] = useState(null);
	const [tagsText, setTagsText] = useState('');
	const [rating, setRating] = useState('');
	const [comment, setComment] = useState('');
	const [listenLink, setListenLink] = useState(null);
	const [show, setShow] = useState(null);
	const [loadingShows, setLoadingShows] = useState(false);
	const [loadingSetlist, setLoadingSetlist] = useState(false);
	const [allShows, setAllShows] = useState(null);
	const [njVersionsDatesOnly, setNjVersionsDatesOnly] = useState(null);
	const [versionExists, setVersionExists] = useState(false);
	const [jams, setJams] = useState(null);
	const [jam, setJam] = useState(null);
	const [year, setYear] = useState('');
	const [showLocationInput, setShowLocationInput] = useState(true);
	const [noSetlistFound, setNoSetlistFound] = useState(false);
	const [setlistUrl, setSetlistUrl] = useState(null);
	const [showsInYearFromSetlistFM, setShowsInYearFromSetlistFM] =
		useState(false);

	console.log('artist', artist);
	console.log('song', song);
	console.log('songSelected', songSelected);
	console.log('query', query);

	const sortedSongs = artist
		? songs.sort((a, b) => {
				if (a.artist === artist.artist) return -1;
				if (b.artist === artist.artist) return 1;
				if (a.song < b.song) return -1;
				if (a.song > b.song) return 1;
				return 0;
		  })
		: songs;

	const filteredSongs =
		query === ''
			? sortedSongs
			: sortedSongs?.filter((song) => {
					return song.song.toLowerCase().includes(query.toLowerCase());
			  });

	console.log('filteredSongs.length', filteredSongs?.length);
	function handleArtistChange(artist) {
		setArtist(artist);
	}

	async function handleAddSong(e) {
		console.log(e);
	}

	function classNames(...classes) {
		return classes.filter(Boolean).join(' ');
	}

	function clear() {
		setArtist('');
		setSongSelected('');
		setSoundsSelected('');
		setJamDate('');
		setJamLocation('');
	}

	//get shows by song for select artists
	useEffect(() => {
		if (
			artist &&
			songSelected &&
			(artist.artist === 'Goose' ||
				artist.artist === 'Eggy' ||
				artist.artist === 'Neighbor' ||
				artist.artist === "Umphrey's McGee" ||
				artist.artist === 'Phish' ||
				artist.artist === 'Trey Anastasio, TAB')
		) {
			let urlToFetch =
				'/getShows?artist=' + artist.artist + '&song=' + songSelected;
			fetcher.load(urlToFetch);
		}
	}, [songSelected]);

	console.log('fetcher.data', fetcher.data);
	const shows = fetcher?.data?.shows;
	const setlist = fetcher?.data?.setlist;

	return (
		<Form method='post'>
			<div className='flex flex-col space-y-4 p-4 pb-20'>
				<h1>Add Jam</h1>
				<input
					type='hidden'
					name='artist'
					value={artist.artist}
				/>
				<input
					type='hidden'
					name='song'
					value={songSelected}
				/>
				<div className='max-h-40'>
					<Listbox
						value={artist}
						onChange={handleArtistChange}
					>
						{({ open }) => (
							<>
								<Listbox.Label className='block text-sm font-medium text-gray-700'>
									Band
								</Listbox.Label>
								<div className='relative mt-1'>
									<Listbox.Button className='relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm h-10'>
										<span className='block truncate'>{artist.artist}</span>
										<span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
											<ChevronUpDownIcon
												className='h-8 w-8 text-gray-400'
												aria-hidden='true'
											/>
										</span>
									</Listbox.Button>

									<Transition
										show={open}
										as={Fragment}
										leave='transition ease-in duration-100'
										leaveFrom='opacity-100'
										leaveTo='opacity-0'
									>
										<Listbox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm h-60'>
											{artists?.map((artist, artistIdx) => (
												<Listbox.Option
													key={artistIdx}
													className={({ active }) =>
														classNames(
															active
																? 'text-white bg-indigo-600'
																: 'text-gray-900',
															'relative cursor-default select-none py-2 pl-3 pr-9'
														)
													}
													value={artist}
												>
													{({ selected, active }) => (
														<>
															<span
																className={classNames(
																	selected ? 'font-semibold' : 'font-normal',
																	'block truncate'
																)}
															>
																{artist.artist}
															</span>

															{selected ? (
																<span
																	className={classNames(
																		active ? 'text-white' : 'text-indigo-600',
																		'absolute inset-y-0 right-0 flex items-center pr-4'
																	)}
																>
																	<CheckIcon
																		className='h-5 w-5'
																		aria-hidden='true'
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
							</>
						)}
					</Listbox>
				</div>
				{artist &&
					(artist.artist === 'Goose' ||
						artist.artist === 'Eggy' ||
						artist.artist === 'Neighbor' ||
						artist.artist === "Umphrey's McGee" ||
						artist.artist === 'Phish' ||
						artist.artist === 'Trey Anastasio, TAB') && (
						<div className='max-w-sm p-4'>
							<Combobox
								as='div'
								value={songSelected}
								onChange={(e) => {
									setSongSelected(e);
								}}
								name='song'
							>
								<Combobox.Label className='block text-lg font-medium text-gray-900'>
									Song
								</Combobox.Label>
								<div className='relative mt-1 px-30'>
									<Combobox.Input
										className='w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm'
										onChange={(event) => {
											setQuery(event.target.value);
										}}
										displayValue={(song) => song}
										placeholder='Search for a song'
									/>
									<Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
										<ChevronUpDownIcon
											className='h-5 w-5 text-gray-400'
											aria-hidden='true'
										/>
									</Combobox.Button>

									{filteredSongs?.length > 0 && (
										<Combobox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
											{filteredSongs?.map((song, songIdx) => (
												<Combobox.Option
													key={songIdx}
													value={song.song}
													className={({ active }) =>
														classNames(
															'relative cursor-default select-none py-2 pl-3 pr-9',
															active
																? 'bg-indigo-600 text-white'
																: 'text-gray-900'
														)
													}
												>
													{({ active, songSelected }) => (
														<>
															<span
																className={classNames(
																	'block truncate',
																	songSelected && 'font-semibold'
																)}
															>
																{song.song}
															</span>

															{songSelected && (
																<span
																	className={classNames(
																		'absolute inset-y-0 right-0 flex items-center pr-4',
																		active ? 'text-white' : 'text-indigo-600'
																	)}
																>
																	<CheckIcon
																		className='h-5 w-5'
																		aria-hidden='true'
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
						</div>
					)}
				{/* Add Song if doesnt exist*/}
				{query && filteredSongs?.length === 0 && (
					<div>
						<InfoAlert
							title={`No songs containing ${query} found`}
							description={`This is a travesty! Please rectify this situation by adding a new song below`}
						/>
						<label
							htmlFor='new-song'
							className='block text-sm font-medium text-gray-700'
						>
							New song to add
						</label>
						<div className='mt-1'>
							<input
								type='text'
								name='new-song'
								id='new-song'
								defaultValue={query}
								className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
								aria-describedby='new-song'
							/>
						</div>
						<p
							className='mt-2 text-sm text-gray-500'
							id='new-song-description'
						>
							Please double check for typos. Thank you!
						</p>
						<button
							type='submit'
							name='_action'
							value='new-song'
							className=' my-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
						>
							Add Song
						</button>
					</div>
				)}
				{/* Show Picker */}
				{shows && shows.length > 1 && (
					<div className='max-h-40'>
						<Listbox
							value={show}
							onChange={setShow}
						>
							{({ open }) => (
								<>
									<Listbox.Label className='block text-sm font-medium text-gray-700'>
										Show
									</Listbox.Label>
									<div className='relative mt-1'>
										<Listbox.Button className='relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm h-10'>
											<span className='block truncate'>{show?.label || 'Choose a show'}</span>
											<span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
												<ChevronUpDownIcon
													className='h-8 w-8 text-gray-400'
													aria-hidden='true'
												/>
											</span>
										</Listbox.Button>

										<Transition
											show={open}
											as={Fragment}
											leave='transition ease-in duration-100'
											leaveFrom='opacity-100'
											leaveTo='opacity-0'
										>
											<Listbox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm h-60'>
												{shows?.map((show, showIdx) => (
													<Listbox.Option
														key={showIdx}
														className={({ active }) =>
															classNames(
																active
																	? 'text-white bg-indigo-600'
																	: 'text-gray-900',
																'relative cursor-default select-none py-2 pl-3 pr-9'
															)
														}
														value={show}
													>
														{({ selected, active }) => (
															<>
																<span
																	className={classNames(
																		selected ? 'font-semibold' : 'font-normal',
																		'block truncate'
																	)}
																>
																	{show?.label}
																</span>

																{selected ? (
																	<span
																		className={classNames(
																			active ? 'text-white' : 'text-indigo-600',
																			'absolute inset-y-0 right-0 flex items-center pr-4'
																		)}
																	>
																		<CheckIcon
																			className='h-5 w-5'
																			aria-hidden='true'
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
								</>
							)}
						</Listbox>
					</div>
				)}
				<p>YearPicker</p>
				<p>Date Input</p>
				<p>Song Picker</p>
				<p>Show Picker</p>
				<p>Location</p>
				<p>Sounds</p>
				<p>Rating</p>
				<p>Comment</p>
				<div className='flex justify-evenly flex-row-reverse bottom-0 right-0 py-4 bg-white w-full max-w-md px-2'>
					<button
						type='submit'
						className={
							'inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
						}
						disabled={false}
					>
						Add this jam
					</button>

					<button
						type='button'
						className='rounded-md border border-gray-300 bg-white py-2 px-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
						onClick={clear}
					>
						Clear
					</button>
				</div>
			</div>
		</Form>
	);
}
