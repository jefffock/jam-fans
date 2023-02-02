import {
	Form,
	useLoaderData,
	useFetcher,
	useOutletContext,
} from '@remix-run/react';
import { json } from '@remix-run/node';
import { createServerClient } from '@supabase/auth-helpers-remix';
import { Listbox, Transition, Dialog, Combobox } from '@headlessui/react';
import { Fragment, useState, useEffect, useRef } from 'react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import InfoAlert from '../../../components/alerts/InfoAlert';
import { textSpanContainsPosition } from 'typescript';

export const loader = async ({ request, params }) => {
	const response = new Response();
	const supabaseClient = createServerClient(
		process.env.SUPABASE_URL,
		process.env.SUPABASE_ANON_KEY,
		{ request, response }
	);
	const {
		data: { user },
	} = await supabaseClient.auth.getUser();

	let profile;
	if (user && user?.id && user != null) {
		const { data } = await supabaseClient
			.from('profiles')
			.select('*')
			.eq('id', user.id)
			.single();
		profile = data;
	}

	//get artists
	//get supabase session
	let { data: artists } = await supabaseClient
		.from('artists')
		.select('*')
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
			nickname: 'Phish',
			emoji_code: '0x1F41F',
			url: 'phish',
			artist: 'Phish',
			start_year: 1983,
			end_year: null,
		},
		{
			nickname: 'Grateful Dead',
			emoji_code: '0x1F480',
			url: 'grateful-dead',
			artist: 'Grateful Dead',
			start_year: 1965,
			end_year: 1995,
		},
	].concat(artists);
	return json(
		{ artists, songs, sounds, user, profile },
		{
			headers: response.headers,
		}
	);
};

export async function action({ request, params }) {
	const response = new Response();
	let formData = await request.formData();
	let { _action, ...values } = Object.fromEntries(formData);
	const supabaseClient = createServerClient(
		process.env.SUPABASE_URL,
		process.env.SUPABASE_ANON_KEY,
		{ request, response }
	);
	if (_action === 'new-song') {
		const { data, error } = await supabaseClient
			.from('songs')
			.insert({ song: values['new-song'], artist: values.artist });
	}

	return { status: 200, body: 'ok' };
}

export default function AddJam() {
	const { supabase, session } = useOutletContext();
	const fetcher = useFetcher();
	const { artists, songs, sounds, initialArtist, initialSong, user, profile } =
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
	const [setlist, setSetlist] = useState(null);
	const [tags, setTags] = useState([]);
	const [date, setDate] = useState('');
	const [location, setLocation] = useState('');
	const [tagsText, setTagsText] = useState('');
	const [rating, setRating] = useState('');
	const [comment, setComment] = useState('');
	const [listenLink, setListenLink] = useState(null);
	const [show, setShow] = useState('');
	const [loadingShows, setLoadingShows] = useState(false);
	const [loadingSetlist, setLoadingSetlist] = useState(false);
	const [jams, setJams] = useState(null);
	const [jam, setJam] = useState('');
	const [year, setYear] = useState('');
	const [showLocationInput, setShowLocationInput] = useState(false);
	const [noSetlistFound, setNoSetlistFound] = useState(false);
	const [setlistUrl, setSetlistUrl] = useState(null);
	const [showsInYearFromSetlistFM, setShowsInYearFromSetlistFM] =
		useState(false);
	const [added, setAdded] = useState(false);
	const [dateInput, setDateInput] = useState('');
	const [dateInputError, setDateInputError] = useState(false);
	const [shows, setShows] = useState(null);

	useEffect(() => {
		if (user && !profile && typeof document !== 'undefined') {
			let username;
			async function checkUsername() {
				username = window.prompt('Please choose a username', '');
				if (username) {
					const { data } = await supabase
						.from('profiles')
						.select('*')
						.eq('name', username)
						.single();
					if (data) {
						alert(
							'Looks like someone already snagged that username. Please choose another.'
						);
						checkUsername();
					} else {
						setUsername();
					}
				} else {
					checkUsername();
				}
			}
			async function setUsername() {
				const { data, error } = await supabase
					.from('profiles')
					.insert([{ name: username, id: user.id }]);
				if (!error) {
					alert(
						`Welcome, ${username}! Have fun rating stuff and making great jams easier to find! (Username created successfully)`
					);
				}
			}
			checkUsername();
		}
	}, []);

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

	function handleArtistChange(artist) {
		setSongSelected('');
		setJam(null);
		setShows(null);
		if (artist && date && artist !== 'Squeaky Feet') {
			//fetch setlist
		} else if (artist && year && !date && artist !== 'Squeaky Feet') {
			//fetch shows
			let urlToFetch = '/getShows?artist=' + artist.artist + '&year=' + year;
			fetcher.load(urlToFetch);
		}
		setArtist(artist);
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
		setShows(null);
		if (
			artist &&
			artist.artist !== 'Squeaky Feet' &&
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

	function handleShowChange(show) {
		setSetlist(null);
		if (artist && artist !== 'Squeaky Feet') {
			//fetch setlist
			let urlToFetch =
				'/getSetlist?artist=' + artist.artist + '&date=' + show.showdate;
			fetcher.load(urlToFetch);
		}
		setShow(show);
		setDate(show.showdate);
		setLocation(show.location);
		if (show.existingJam) {
			setJam(show.existingJam);
		}
	}

	function handleRatingChange(rating) {
		if (rating === 'No rating') {
			setRating(null);
		} else {
			setRating(rating);
		}
	}

	//if song not in setlist, remove it
	useEffect(() => {
		if (setlist && songSelected) {
			let songInSetlist = setlist.find((song) => song === songSelected);
			if (!songInSetlist) {
				setSongSelected('');
			}
		}
	}, [setlist]);

	function clearArtist() {
		setArtist('');
		setSong('');
		setDate('');
		setShow('');
		setLocation('');
		setJam('');
		setSongSelected('');
	}

	function clearSong() {
		setSong('');
		setSongSelected('');
	}

	function clearDate() {
		setDate('');
		setShow('');
		setLocation('');
	}

	function showEditLocation() {
		setShowLocationInput(true);
	}

	function handleLocationChange(e) {
		if (e.target.value !== location) {
			setLocation(e.target.value);
		}
	}

	function handleYearChange(e) {
		if (shows) setShows(null);
		if (e === 'Clear Year') {
			setYear('');
		} else {
			if (artist && artist !== 'Squeaky Feet') {
				let urlToFetch = '/getShows?artist=' + artist.artist + '&year=' + e;
				fetcher.load(urlToFetch);
			}
			setYear(e);
		}
	}

	const startYear = artist?.start_year;
	const endYear = artist?.end_year || new Date().getFullYear();
	let yearsArr = [];
	if (startYear && endYear) {
		for (var i = endYear; i >= startYear; i--) {
			yearsArr.push(i);
		}
		yearsArr.push('Clear Year');
	}

	useEffect(() => {
		if (!date) {
			setDateInput(null);
		}
	}, [date]);

	function handleDateInputChange(e) {
		setDateInput(e.target.value);
		let dateInput = e.target.value;
		if (dateInput.length === 8) {
			let month = dateInput.slice(0, 2);
			let day = dateInput.slice(2, 4);
			let year = dateInput.slice(4, 8);
			let date = new Date(year, month - 1, day);
			if (date.toString() === 'Invalid Date') {
				setdateInputError(true);
			} else {
				setDateInputError(false);
				setDate(date.toJSON().slice(0, 10));
				let urlToFetch =
					'/getSetlist?artist=' +
					artist.artist +
					'&date=' +
					date.toJSON().slice(0, 10);
				fetcher.load(urlToFetch);
			}
		}
	}

	function handleCommentChange(e) {
		setComment(e.target.value);
	}

	function handleSoundsChange(e) {
		// if e.target.value is not in soundsSelected, add it, else, remove it
		if (soundsSelected.includes(e.target.value)) {
			let newSoundsSelected = soundsSelected.filter(
				(sound) => sound !== e.target.value
			);
			setSoundsSelected(newSoundsSelected);
		} else {
			const sortedSounds = [...soundsSelected, e.target.value].sort();
			setSoundsSelected(sortedSounds);
		}
	}

	if (fetcher?.data?.shows && !shows) {
		setShows(fetcher?.data?.shows);
	}
	if (fetcher?.data?.setlist && !setlist) {
		setSetlist(fetcher?.data?.setlist);
	}
	if (fetcher?.data?.location && !location) {
		setLocation(fetcher?.data?.location);
	}
	if (fetcher?.data?.jam && fetcher?.data?.jam !== jam) {
		setJam(fetcher?.data?.jam);
		setSoundsSelected(fetcher?.data?.jam?.sounds);
	}

	//check if song exists
	useEffect(() => {
		if (songSelected && artist && date && setlist && shows) {
			let urlToFetch =
				'/checkJamAdded?artist=' +
				artist.artist +
				'&song=' +
				songSelected +
				'&date=' +
				date;
			fetcher.load(urlToFetch);
		}
	}, [songSelected, date, setlist]);

	//log artist, songSelected, date, location, jam, soundsSelected with strings for each
	console.log('profile: ' + profile);
	console.log('artist: ' + artist.artist);
	console.log('songSelected: ' + songSelected);
	console.log('date: ' + date);
	console.log('location: ' + location);
	console.log('jam sounds: ' + jam?.sounds?.length);
	console.log('soundsSelected: ' + soundsSelected?.length);
	console.log('rating: ' + rating);
	console.log('comment: ' + comment);

	return (
		<Form method='post'>
			<div className='flex flex-col space-y-4 p-4 pb-20 max-w-xl mx-auto'>
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
				<input
					type='hidden'
					name='date'
					value={date}
				/>
				<input
					type='hidden'
					name='location'
					value={location}
				/>
				<input
					type='hidden'
					name='jam'
					value={jam}
				/>
				<input
					type='hidden'
					name='sounds'
					value={soundsSelected}
				/>
				{/* artist picker*/}
				{!artist && (
					<div className='max-h-40 max-w-sm'>
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
				)}
				{/* display artist */}
				{artist && (
					<div className='flex justify-between text-sm'>
						<p className='text-base'>{artist.artist}</p>
						<button
							type='button'
							onClick={clearArtist}
						>
							Change Artist
						</button>
					</div>
				)}
				{/* song picker (not setlist)*/}
				{artist &&
					(!setlist || !date) &&
					!songSelected &&
					(artist.artist === 'Goose' ||
						artist.artist === 'Eggy' ||
						artist.artist === 'Neighbor' ||
						artist.artist === "Umphrey's McGee" ||
						artist.artist === 'Phish' ||
						artist.artist === 'Trey Anastasio, TAB') && (
						<div className='max-w-sm py-4'>
							<Combobox
								as='div'
								value={songSelected}
								onChange={(e) => {
									setSongSelected(e);
								}}
								name='song'
							>
								<Combobox.Label className='block font-medium text-gray-900'>
									Song
								</Combobox.Label>
								<div className='relative mt-1'>
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
				{/* display song*/}
				{songSelected && (
					<div className='flex justify-between text-sm'>
						<p className='text-base'>{songSelected}</p>
						<button
							type='button'
							onClick={clearSong}
						>
							Change Song
						</button>
					</div>
				)}
				{/* show picker if songfish artist and no date/year*/}
				{songSelected &&
					artist &&
					!date &&
					!year &&
					(artist.artist === 'Goose' ||
						artist.artist === 'Eggy' ||
						artist.artist === 'Neighbor' ||
						artist.artist === "Umphrey's McGee" ||
						artist.artist === 'Phish' ||
						artist.artist === 'Trey Anastasio, TAB') && (
						<div className='max-h-40'>
							<Listbox
								value={show}
								onChange={handleShowChange}
							>
								{({ open }) => (
									<>
										<Listbox.Label className='block text-sm font-medium text-gray-700'>
											Shows with a {songSelected}
										</Listbox.Label>
										<div className='relative mt-1'>
											<Listbox.Button className='relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm h-10'>
												<span className='block truncate'>
													{show?.label || 'Choose a show'}
												</span>
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
																			selected
																				? 'font-semibold'
																				: 'font-normal',
																			'block truncate'
																		)}
																	>
																		{show?.label}
																	</span>

																	{selected ? (
																		<span
																			className={classNames(
																				active
																					? 'text-white'
																					: 'text-indigo-600',
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
				{/* Year picker */}
				{artist && !date && (
					<div className='max-h-40 max-w-xs'>
						<Listbox
							value={year}
							onChange={handleYearChange}
						>
							{({ open }) => (
								<>
									<Listbox.Label className='block text-sm font-medium text-gray-700'>
										Year
									</Listbox.Label>
									<div className='relative mt-1'>
										<Listbox.Button className='relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm h-10'>
											<span className='block truncate'>
												{year || 'Choose year'}
											</span>
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
												{yearsArr?.map((year, yearIdx) => (
													<Listbox.Option
														key={yearIdx}
														className={({ active }) =>
															classNames(
																active
																	? 'text-white bg-indigo-600'
																	: 'text-gray-900',
																'relative cursor-default select-none py-2 pl-3 pr-9'
															)
														}
														value={year}
													>
														{({ selected, active }) => (
															<>
																<span
																	className={classNames(
																		selected ? 'font-semibold' : 'font-normal',
																		'block truncate'
																	)}
																>
																	{year}
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
				{/* Show Picker if not from songfish artist + year*/}
				{shows && shows?.length > 1 && !show && !date && !location && year && (
					<div className='max-h-40'>
						<Listbox
							value={show}
							onChange={handleShowChange}
						>
							{({ open }) => (
								<>
									<Listbox.Label className='block text-sm font-medium text-gray-700'>
										Shows from {year}
									</Listbox.Label>
									<div className='relative mt-1'>
										<Listbox.Button className='relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm h-10'>
											<span className='block truncate'>
												{show?.label || 'Choose a show'}
											</span>
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
				{/* Date input */}
				{!date && artist && (
					<div>
						<p>Or enter a date to get the setlist</p>
						<p className='text-sm'>MMDDYYYY format</p>
						<input
							type='text'
							value={dateInput}
							onChange={handleDateInputChange}
							className='border border-gray-300 rounded-md p-2'
						/>
					</div>
				)}
				{/* song picker from setlist */}
				{setlist && !songSelected && date && artist && (
					<div className='max-h-40'>
						<Listbox
							value={songSelected || ''}
							onChange={setSongSelected}
						>
							{({ open }) => (
								<>
									<Listbox.Label className='block text-sm font-medium text-gray-700'>
										Songs in Setlist
									</Listbox.Label>
									<div className='relative mt-1'>
										<Listbox.Button className='relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm h-10'>
											<span className='block truncate'>
												{songSelected || 'Choose song'}
											</span>
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
												{setlist?.map((songInSet, songInSetIdx) => (
													<Listbox.Option
														key={songInSetIdx}
														className={({ active }) =>
															classNames(
																active
																	? 'text-white bg-indigo-600'
																	: 'text-gray-900',
																'relative cursor-default select-none py-2 pl-3 pr-9'
															)
														}
														value={songInSet}
													>
														{({ selected, active }) => (
															<>
																<span
																	className={classNames(
																		selected ? 'font-semibold' : 'font-normal',
																		'block truncate'
																	)}
																>
																	{songInSet}
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
				{/* display date*/}
				{date && (
					<div className='flex justify-between text-sm'>
						<p className='text-base'>{date}</p>
						<button
							type='button'
							onClick={clearDate}
						>
							Change Date
						</button>
					</div>
				)}
				{/* display location */}
				{location && !showLocationInput && (
					<div className='flex justify-between text-sm'>
						<p className='text-base'>{location}</p>
						<button
							type='button'
							onClick={showEditLocation}
						>
							Edit Location
						</button>
					</div>
				)}
				{showLocationInput && (
					<div>
						<label
							htmlFor='location'
							className='block text-sm font-medium text-gray-700'
						>
							Location
						</label>
						<div className='mt-1'>
							<input
								type='text'
								name='location'
								id='location'
								defaultValue={location}
								onChange={handleLocationChange}
								className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
								placeholder='you@example.com'
								aria-describedby='location-description'
							/>
						</div>
					</div>
				)}
				{artist && songSelected && date && location && (
					<>
						<p>Optional fields:</p>
						{/* Sounds picker */}
						<div className=''>
							<div className='mt-1 flex rounded-md shadow-sm max-w-fit'>
								<fieldset>
									<legend className='text-lg font-medium text-gray-900'>
										Sounds to Add
									</legend>
									<div className='mt-4 divide-y divide-gray-200 border-t border-b border-gray-200 max-h-52 overflow-y-scroll max-w-fit'>
										{sounds &&
											sounds?.map((sound, soundIdx) => {
												if (!jam?.sounds?.includes(sound.label)) {
													return (
														<div
															key={soundIdx}
															className='relative flex items-start py-4'
														>
															<div className='min-w-0 flex-1 text-sm'>
																<label
																	htmlFor={`${sound.text}`}
																	className='select-none font-medium text-gray-700 mx-2'
																>
																	{sound?.label}
																</label>
															</div>
															<div className='ml-3 flex h-5 items-center'>
																<input
																	value={`${sound.label}`}
																	id={`${sound.text}`}
																	name={`sounds-${sound.text}`}
																	disabled={jam?.sounds?.includes(sound.label)}
																	type='checkbox'
																	className='h-6 w-6 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500  border-2 mr-2'
																	onChange={handleSoundsChange}
																/>
															</div>
														</div>
													);
												}
											})}
									</div>
								</fieldset>
							</div>
						</div>
					</>
				)}
				{soundsSelected && <p>Sounds: {soundsSelected.join(', ')}</p>}
				{/* rating picker */}
				{artist && songSelected && date && location && profile && (
					<div className='max-h-40  max-w-xs'>
						<Listbox
							value={rating}
							onChange={handleRatingChange}
						>
							{({ open }) => (
								<>
									<Listbox.Label className='block text-sm font-medium text-gray-700'>
										Rating
									</Listbox.Label>
									<div className='relative mt-1'>
										<Listbox.Button className='relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm h-10'>
											<span className='block truncate'>
												{rating || 'No rating'}
											</span>
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
												{[10, 9, 8, 7, 6, 5, 4, 'No rating'].map(
													(rating, ratingIdx) => (
														<Listbox.Option
															key={ratingIdx}
															className={({ active }) =>
																classNames(
																	active
																		? 'text-white bg-indigo-600'
																		: 'text-gray-900',
																	'relative cursor-default select-none py-2 pl-3 pr-9'
																)
															}
															value={rating}
														>
															{({ selected, active }) => (
																<>
																	<span
																		className={classNames(
																			selected
																				? 'font-semibold'
																				: 'font-normal',
																			'block truncate'
																		)}
																	>
																		{rating}
																	</span>

																	{selected ? (
																		<span
																			className={classNames(
																				active
																					? 'text-white'
																					: 'text-indigo-600',
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
													)
												)}
											</Listbox.Options>
										</Transition>
									</div>
								</>
							)}
						</Listbox>
						<div className='my-4 max-w-md'>
							<label
								htmlFor='comment'
								className='block text-sm font-medium text-gray-700'
							>
								Comment
							</label>
							<div className='mt-1'>
								<textarea
									type='text'
									name='comment'
									id='comment'
									cols={30}
									rows={5}
									defaultValue={''}
									onChange={handleCommentChange}
									className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
									aria-describedby='comment'
								></textarea>
							</div>
						</div>
					</div>
				)}
				{/* submit buttons */}
				{/* 
        not logged in:
        Add jam 
        Update jam, (jam added, add sounds)
        logged in:
        add jam
        update jam, (jam added, add sounds)
        Add jam and comment/rating (not added yet), with rating
        Add rating/comments jam (already added), with rating

        
        */}
				<div className='flex justify-around py-4 bg-white w-full px-2'>
					{/* not logged in, add new jam*/}
					{!profile && !jam && artist && songSelected && date && location && (
						<button
							type='submit'
							name='_action'
							value='add'
							className={`inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
						>
							Add this jam
						</button>
					)}
					{/* not logged in, jam exists, update sounds*/}
					{!profile && jam && jam?.sounds?.length !== soundsSelected?.length && (
						<button
							type='submit'
							name='_action'
							value='add'
							className={`inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
						>
							Add sounds to this jam
						</button>
					)}
					{/*logged in, add new jam, no rating*/}
					{profile &&
						artist &&
						songSelected &&
						date &&
						location &&
						!jam &&
						!rating &&
						!comment && (
							<button
								type='submit'
								name='_action'
								value='add'
								className={`inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
							>
								Add this jam
							</button>
						)}
					{/*logged in, add new jam, no rating*/}
					{profile &&
						jam &&
						jam?.sounds?.length !== soundsSelected?.length &&
						!rating &&
						!comment && (
							<button
								type='submit'
								name='_action'
								value='add'
								className={`inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
							>
								Add sounds to this jam
							</button>
						)}
					{/*logged in, add new jam, with rating/comment*/}
					{profile && !jam && (rating || comment) && (
						<button
							type='submit'
							name='_action'
							value='add'
							className={`inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
						>
							Add jam and rating/comment
						</button>
					)}
					{/*logged in, jam exists, add rating/comment, no new sounds*/}
					{profile &&
						jam &&
						(rating || comment) &&
						jams?.sounds?.length === soundsSelected?.length && (
							<button
								type='submit'
								name='_action'
								value='add'
								className={`inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
							>
								Add rating/comment
							</button>
						)}
					{/*logged in, jam exists, add rating/comment and sounds*/}
					{profile &&
						jam &&
						(rating || comment) &&
						jam?.sounds?.length !== soundsSelected?.length && (
							<button
								type='submit'
								name='_action'
								value='add'
								className={`inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
							>
								Add rating/comment and update sounds
							</button>
						)}
				</div>
			</div>
		</Form>
	);
}
