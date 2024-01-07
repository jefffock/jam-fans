import {
	Form,
	useLoaderData,
	useFetcher,
	useOutletContext,
	useActionData,
	useNavigate,
	useSubmit,
} from '@remix-run/react';
import { json, redirect } from '@remix-run/node';
import { createServerClient } from '@supabase/auth-helpers-remix';
import { Listbox, Transition, Dialog, Combobox } from '@headlessui/react';
import React, { Fragment, useState, useEffect, useRef, useMemo } from 'react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import InfoAlert from '../../../components/alerts/InfoAlert';
import SuccessAlert from '../../../components/alerts/successAlert';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';

interface SongInSonglist {
	song: string;
	artist: string;
};

interface SongInSetlist {
	value: string;
	label: string;
};

interface Artist {
	artist: string;
	nickname: string;
	emoji_code: string;
	url: string;
	start_year: number;
	end_year: number;
};

interface SongObj {
	id: number;
	song: string;
	artist: string;
	submitter_name: string;
};

interface Sound {
	label: string;
	text: string;
};

interface Jam {
	id: number;
	artist: string;
	song_name: string;
	date: string;
	location: string;
	sounds?: string[];
	user_id: string;
	submitter_name: string;
	song_id: number;
	song_submitter_name: string;
	listen_link: string;
};

interface Profile {
	id: string;
	name: string;
};

interface Rating {
	id: number;
	user_id: string;
	version_id: number;
	rating: string;
	comment: string;
	submitter_name: string;
};

interface Show {
	showdate: string;
	location: string;
	existingJam: Jam;
	label: string;
};
interface Data {
	artists: Artist[];
	songs: SongInSonglist[];
	sounds: Sound[];
	user: any;
	profile: Profile;
	initialArtist: Artist;
	initialSong: string;
	initialDate: string;
	initialLocation: string;
	initialSounds: string[];
	initialSongObj: SongObj;
	initialJam: Jam;
};

export const loader = async ({ request }: LoaderArgs) => {
	const response = new Response();

	if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
		throw new Error("Supabase URL and ANON KEY must be defined");
	}

	const supabaseClient = createServerClient(
		process.env.SUPABASE_URL || '',
		process.env.SUPABASE_ANON_KEY,
		{ request, response }
	);
	const { searchParams } = new URL(request.url);

	const queryParams = Object.fromEntries(searchParams);
	console.log('queryParams', queryParams);
	let initialArtist;
	let initialSong;
	let initialDate;
	let initialLocation;
	let initialSounds;
	let initialSongObj;
	let jam;
	if (queryParams?.jamid) {
		const { data } = await supabaseClient
			.from('versions')
			.select('*')
			.eq('id', JSON.parse(queryParams.jamid))
			.single();
		jam = data;
	} 
	if (queryParams?.song) {
		initialSong = queryParams.song;
		const { data: songObj } = await supabaseClient
			.from('songs')
			.select('*')
			.eq('song', queryParams.song)
			.single();
		initialSongObj = songObj;
	}
	if (queryParams?.artist) {
		const { data: artistObj } = await supabaseClient
			.from('artists')
			.select('*')
			.eq('artist', queryParams.artist)
			.single();
		initialArtist = artistObj;
	}
	if (queryParams?.artistUrl) {
		const { data: artistObj } = await supabaseClient
			.from('artists')
			.select('*')
			.eq('url', queryParams.artistUrl)
			.single();
		initialArtist = artistObj;
	}
	if (queryParams?.date) {
		initialDate = queryParams.date;
	}
	if (queryParams?.location) {
		initialLocation = queryParams.location;
	}
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

	//get supabase session
	//get songs
	const { data: songs } = await supabaseClient
	.from('songs')
	.select('song, artist')
	.order('song', { ascending: true });
	const { data: sounds } = await supabaseClient
	.from('sounds')
	.select('label, text')
	.order('label', { ascending: true });
	//get artists
	let { data: artists } = await supabaseClient
		.from('artists')
		.select('*')
		.order('name_for_order', { ascending: true });
	console.log('initialSong in loader', initialSong);
	console.log('initialSongObj', initialSongObj);
	return json(
		{
			artists,
			initialSongs: songs,
			sounds,
			user,
			profile,
			initialArtist,
			initialSong,
			initialDate,
			initialLocation,
			initialSounds,
			initialSongObj,
			initialJam: jam,
		},
		{
			headers: response.headers,
		}
	);
};

export async function action({ request, params }: ActionArgs) {
	const response = new Response();
	let formData = await request.formData();
	let { _action, ...values } = Object.fromEntries(formData);
	console.log('_action', _action);

	if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
		throw new Error("Supabase URL and ANON KEY must be defined");
	}

	const supabaseClient = createServerClient(
		process.env.SUPABASE_URL,
		process.env.SUPABASE_ANON_KEY,
		{ request, response }
	);
	async function addOnePoint(profileName: string) {
		const { error } = await supabaseClient.rpc('add_one_point', {
			username: profileName,
		});
		if (error) {
			console.error('error adding one point', error);
		} else console.log('added one point');
	}

	async function addTenPoints(profileName: string) {
		const { error } = await supabaseClient.rpc('add_ten_points', {
			username: profileName,
		});
		if (error) {
			console.error('error adding ten points', error);
		} else {
			console.log('added ten points');
		}
	}

	async function addRatingCountToArtist(artistId: string) {
		const { error } = await supabaseClient.rpc('add_rating_count_artist', {
			artistid: artistId,
		});
		if (error) {
			console.error('error adding rating count to artist', error);
		} else {
			console.log('added rating count to artist');
		}
	}

	async function addRatingCountToSong(songId: string) {
		let song_id = parseInt(songId);
		const { error } = await supabaseClient.rpc('increment_song_rating_count', {
			songid: song_id,
		});
		if (error) {
			console.error('error adding incrementing song rating count', error);
		} else {
			console.log('added rating count to song');
		}
	}

	async function addRatingCountToVersion(versionId: string) {
		let version_id = parseInt(versionId);
		const { error } = await supabaseClient.rpc(
			'increment_version_rating_count',
			{
				versionid: version_id,
			}
		);
		if (error) {
			console.error('error adding incrementing version rating count', error);
		} else {
			console.log('added rating count to version');
		}
	}

	async function calcAverageForVersion(versionId: string) {
		let version = parseInt(versionId);
		const { error } = await supabaseClient.rpc('calc_average', {
			versionid: version,
		});
		if (error) {
			console.error('error calculating average', error);
		} else {
			console.log('calculated average');
		}
	}

	let sounds: string[] = [];
	if (values.sounds) {
		String(values.sounds).split(',').forEach((sound: string) => {
			sounds.push(sound);
		});
	}
	let jam;
	if (values.jam) {
		jam = JSON.parse(String(values.jam));
	}
	let profile;
	if (values.profile) {
		profile = JSON.parse(String(values.profile));
	}
	let songObj;
	console.log('values', values, 'typeof values', typeof values)
	if (values.songObj) {
		songObj = JSON.parse(String(values.songObj));
	} else if (!values.songObj || values.songObj === '') {
		const { data, error } = await supabaseClient
			.from('songs')
			.select('*')
			.eq('song', values['new-song'])
			.single();
		songObj = data;
	}
	if (_action === 'clear') {
		return {
			status: 200,
			body: 'clear',
		};
	}
	if (_action === 'new-song') {
		console.log('in new song')
		const { data, error } = await supabaseClient
			.from('songs')
			.insert({ song: values['new-song'], artist: values.artist });
		if (profile?.name) {
			addTenPoints(profile.name);
		}
		//make search params string with artist, song, date, location
		let searchParams = new URLSearchParams();
		searchParams.append('artist', String(values.artist));
		searchParams.append('song', String(values['new-song']));
		if (values?.date) searchParams.append('date', String(values.date));
		if (values?.location) searchParams.append('location', String(values.location));
		console.log('searchParams', searchParams.toString());
		console.log('params in new song', searchParams.toString());
		return redirect(`/add/jam?${searchParams.toString()}`);
	}
	if (_action === 'add-not-logged-in') {
		if (!values.artist || !values.song || !values.date || !values.location) {
			return json({ status: 400, body: 'missing required fields' });
		}
		const { data, error } = await supabaseClient.from('versions').insert({
			artist: values.artist,
			song_name: values.song,
			date: values.date,
			location: values.location,
			sounds: sounds,
			song_id: songObj?.id,
			song_submitter_name: songObj?.submitter_name,
		});
		console.log('data (add-not-logged-in)', data);
		console.log('error (add-not-logged-in)', error);
		addOnePoint(songObj?.submitter_name);
	}
	if (_action === 'update-not-logged-in') {
		const { data, error } = await supabaseClient
			.from('versions')
			.update({
				sounds: sounds,
			})
			.eq('id', jam?.id);
		console.log('data (update-not-logged-in)', data);
		console.log('error (update-not-logged-in)', error);
	}
	if (_action === 'add-logged-in') {
		console.log('values in add logged in', values)
		const { data, error } = await supabaseClient.from('versions').insert({
			artist: values.artist,
			song_name: values.song,
			date: values.date,
			location: values.location,
			sounds: sounds,
			user_id: profile?.id,
			submitter_name: profile?.name,
			song_id: songObj?.id,
			song_submitter_name: songObj?.submitter_name,
			listen_link: values['listen-link'] || null,
		});
		console.log('data in add-logged-in', data);
		console.log('error in add-logged-in', error);
		addTenPoints(profile?.name);
		if (values['listen-link']) {
			addTenPoints(profile?.name);
		}
		addOnePoint(songObj?.submitter_name);
	}
	if (_action === 'update-logged-in') {
		if (values['listen-link']) {
			const { data, error } = await supabaseClient
				.from('versions')
				.update({
					sounds: sounds,
					listen_link: values['listen-link'],
				})
				.eq('id', jam?.id);
			addTenPoints(profile?.name);
			console.log('error', error);
		} else {
			const { data, error } = await supabaseClient.from('versions').update({
				sounds: sounds,
			})
			.eq('id', jam?.id);
			addOnePoint(profile?.name)
			console.log('error', error);
		}
	}
	if (_action === 'add-and-rating') {
		console.log('in add and rating');
		const { data, error } = await supabaseClient
			.from('versions')
			.insert({
				artist: values.artist,
				song_name: values.song,
				date: values.date,
				location: values.location,
				sounds: sounds,
				listen_link: values['listen-link'] || null,
				user_id: profile?.id,
				submitter_name: profile?.name,
				song_id: songObj?.id,
				song_submitter_name: songObj?.submitter_name,
			})
			.select();
		if (data && data?.length > 0) {
			const jamId = data[0].id;
			const { data: dataFromAddRating, error } = await supabaseClient
				.from('ratings')
				.insert({
					user_id: profile?.id,
					version_id: jamId,
					rating: values.rating,
					comment: values.comment,
					submitter_name: profile?.name,
				})
				.select();
			console.log('error add rating', error);
			addTenPoints(profile?.name);
			addTenPoints(profile?.name);
			addOnePoint(songObj?.submitter_name);
			addRatingCountToArtist(String(values.artist));
			addRatingCountToSong(String(values.song));
			addRatingCountToVersion(jamId);
			calcAverageForVersion(jamId);
		}
		console.log('error add jam', error);
	}
	if (_action === 'rating') {
		console.log('in rating');
		const { data, error } = await supabaseClient
			.from('ratings')
			.upsert({
				user_id: profile?.id,
				version_id: jam?.id,
				rating: values.rating,
				comment: values.comment,
				submitter_name: profile?.name,
			})
			.select();
		console.log('error', error);
		addTenPoints(profile?.name);
		addOnePoint(songObj?.submitter_name);
		addOnePoint(jam?.submitter_name);
		addRatingCountToArtist(String(values.artist));
		addRatingCountToSong(String(values.song));
		addRatingCountToVersion(jam?.id);
		calcAverageForVersion(jam?.id);
	}
	if (_action === 'rating-update') {
		//insert rating
		//update version
		console.log('in rating update');
		const { data, error } = await supabaseClient
			.from('ratings')
			.upsert({
				user_id: profile?.id,
				version_id: jam?.id,
				rating: values.rating,
				comment: values.comment,
				submitter_name: profile?.name,
			})
			.select();
		console.log('error', error);
		if (values['listen-link']) {
			console.log('has listen link');
			const { data, error } = await supabaseClient
				.from('versions')
				.update({
					listen_link: values['listen-link'],
					sounds: sounds,
				})
				.eq('id', jam?.id)
				.select();
			console.log('data in listen-link', data)
			console.log('error', error);
		} else {
			const { data, error } = await supabaseClient
				.from('versions')
				.update({
					sounds: sounds,
				})
				.eq('id', jam?.id)
				.select();
			console.log('dataFromUpdate', data);
			console.log('errorFromUpdate', error);
			addTenPoints(profile?.name);
			addOnePoint(songObj?.submitter_name);
			addOnePoint(jam?.submitter_name);
			addRatingCountToArtist(String(values.artist));
			addRatingCountToSong(String(values.song));
			addRatingCountToVersion(jam?.id);
			calcAverageForVersion(jam?.id);
		}
	}
	return { status: 200, body: 'action complete' };
}

export default function AddJam() {
	const fetcher = useFetcher();
	const actionData = useActionData();
	const {
		artists,
		initialSongs,
		sounds,
		initialArtist,
		initialSong,
		initialDate,
		initialLocation,
		initialSounds,
		initialSongObj,
		user,
		profile,
		initialJam,
	} = useLoaderData();
	const [songSelected, setSongSelected] = useState<string | null>(initialSong ?? null);
	const [songs, setSongs] = useState<SongInSonglist[] | null>(initialSongs ?? null);
	const [soundsSelected, setSoundsSelected] = useState<string[] | null>(initialSounds ?? null);
	const [query, setQuery] = useState<string>('');
	const [artist, setArtist] = useState<Artist | null>(initialArtist ?? null);
	const [songObj, setSongObj] = useState<SongObj | null>(initialSongObj ?? null);
	const [showLoadingInfo, setShowLoadingInfo] = useState(false);
	const [showSuccessAlert, setShowSuccessAlert] = useState(false);
	const [setlist, setSetlist] = useState<SongInSetlist[] | null>(null);
	const [date, setDate] = useState<string | null>(initialDate ?? null);
	const [location, setLocation] = useState<string | null>(initialLocation ?? null);
	const [rating, setRating] = useState<string | null>(null);
	const [comment, setComment] = useState<string>('');
	const [listenLink, setListenLink] = useState<string>('');
	const [show, setShow] = useState<Show | null>(null);
	const [jam, setJam] = useState<Jam | null | string>(initialJam ?? null);
	const [year, setYear] = useState<string | null>(null);
	const [showLocationInput, setShowLocationInput] = useState(false);
	const [dateInput, setDateInput] = useState('');
	const [dateInputError, setDateInputError] = useState(false);
	const [shows, setShows] = useState<Show[] | null>([]);
	const [useApis, setUseApis] = useState(true);
	const [ratingId, setRatingId] = useState('');
	const navigate = useNavigate();
	const submit = useSubmit();
	// const [showAddSong, setShowAddSong] = useState(false);
	// const [filteredSongs, setFilteredSongs] = useState<SongInSonglist[] | null>(null);

	useEffect(() => {
		if (user && !profile && typeof document !== 'undefined') {
			navigate('/welcome');
		}
	}, []);

	const sortedSongs = useMemo(() => {
		return artist ? songs?.sort((a: SongInSonglist, b: SongInSonglist) => {
				if (a.artist === artist.artist) return -1;
				if (b.artist === artist.artist) return 1;
				if (a.song < b.song) return -1;
				if (a.song > b.song) return 1;
				return 0;
		  })
		: songs}, [artist, songs]);

		// useEffect(()=> {
		// 	let newlyFilteredSongs: SongInSonglist[] | null = null
		// 	if (sortedSongs && query && query !== '') {
		// 		newlyFilteredSongs = sortedSongs.filter((song: SongInSonglist) => {
		// 			return song.song.toLowerCase().includes(query.toLowerCase());
		// 	  });
		// 	} else if (songSelected && query === '' && sortedSongs) {
		// 		newlyFilteredSongs = sortedSongs.filter((song: SongInSonglist) => {
		// 			return (
		// 				song.song.toLowerCase().includes(songSelected.toLowerCase()) &&
		// 				song.song.length === songSelected.length
		// 			);
		// 	  });
		// 	} else if (sortedSongs) {
		// 		newlyFilteredSongs = sortedSongs;
		// 	}
		// 	setFilteredSongs(newlyFilteredSongs);
		// }, [sortedSongs, query, songSelected])
	const filteredSongs = useMemo(() => {
		if (query === '') {
			if (songSelected) {
				return sortedSongs?.filter((song: SongInSonglist) => {
					return (
						song.song.toLowerCase().includes(songSelected.toLowerCase()) &&
						song.song.length === songSelected.length
					);
				});
			} else {
				return sortedSongs;
			}
		} else {
			return sortedSongs?.filter((song: SongInSonglist) => {
				return song.song.toLowerCase().includes(query.toLowerCase());
			});
		}
	}, [sortedSongs, query, songSelected]);

	console.log('filteredSongs', filteredSongs?.length);

	function handleArtistChange(artist: Artist) {
		submit({ _action: 'clear' });
		setSongSelected('');
		setJam(null);
		setShows([]);
		setShow(null);
		setLocation('');
		setDate('');
		setYear(null);
		setSoundsSelected(null);
		setShowLoadingInfo(false);
		if (
			artist &&
			year &&
			!date &&
			artist.artist !== 'Squeaky Feet' &&
			artist.artist !== 'Houseplant'
		) {
			//fetch shows
			let urlToFetch = '/getShows?artist=' + artist.artist + '&year=' + year;
			console.log('going to get shows', urlToFetch);
			fetcher.load(urlToFetch);
		}
		setArtist(artist);
	}

	function handleAddMethodChange(addMethod: 'auto' | 'manual') {
		setUseApis(addMethod === 'auto');
	}

	//ts-ignore
	function classNames(...classes: string[]) {
		return classes.filter(Boolean).join(' ');
	}

	//get shows by song for select artists
	useEffect(() => {
		console.log('actionData?.body', actionData?.body)
		if (!actionData?.body?.includes('action complete') && artist) {
			setJam(null);
			setQuery('');
			if (
				artist &&
				artist.artist !== 'Squeaky Feet' &&
				artist.artist !== 'Houseplant' &&
				songSelected &&
				useApis &&
				[
					'Goose',
					'Eggy',
					'Neighbor',
					// "Umphrey's McGee",
					'Phish',
					"Taper's Choice",
					'Trey Anastasio, TAB',
					'King Gizzard & the Lizard Wizard',
				].includes(artist.artist)
			) {
				setShows([]);
				let urlToFetch =
					'/getShows?artist=' + artist.artist + '&song=' + songSelected;
				fetcher.load(urlToFetch);
			} else if (filteredSongs?.length !== 0 && songSelected) {
				console.log('fetcher.state before get song not songfish', fetcher.state)
				const urlToFetch = '/getSong?song=' + songSelected;
				fetcher.load(urlToFetch);
			}
		}
	}, [songSelected, actionData?.body]);

	useEffect(() => {
		if (shows && shows.length > 0 && filteredSongs?.length !== 0 && songSelected && useApis && artist &&
			[
				'Goose',
				'Eggy',
				'Neighbor',
				// "Umphrey's McGee",
				'Phish',
				"Taper's Choice",
				'Trey Anastasio, TAB',
				'King Gizzard & the Lizard Wizard',
			].includes(artist.artist)) {
			console.log('fetcher.state before get song songfish', fetcher.state)
				const urlToFetch = '/getSong?song=' + songSelected;
				fetcher.load(urlToFetch);
		}
	}, [shows])

	function handleShowChange(show: Show) {
		if (show) {
			setSetlist(null);
			//dont get setlist song bc checkJamAdded takes care of it
			if (
				useApis &&
				artist &&
				artist.artist !== 'Squeaky Feet' &&
				artist.artist !== 'Houseplant'
			) {
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
	}

	function handleRatingChange(rating: string) {
		console.log('typeof rating', typeof rating);
		if (rating === 'No rating') {
			setRating('');
		} else {
			setRating(rating);
		}
	}

	//if song not in setlist, remove it
	useEffect(() => {
		if (setlist && songSelected) {
			let songInSetlist = setlist.find(({ value }) => value === songSelected);
			if (!songInSetlist) {
				setSongSelected('');
			}
		}
	}, [setlist]);

	useEffect(() => {
		// handle when user changes jam and is logged in
		if (profile && profile?.name && jam && typeof jam !== 'string') {
			let urlToFetch = `/getRating?jam=${jam.id}&name=${profile.name}`;
			fetcher.load(urlToFetch);
		}
		//update sounds when jam changes
		if (jam && typeof jam !== 'string') {
			setSoundsSelected(jam.sounds ?? null);
		}
	}, [jam, profile]);

	useEffect(() => {
		const { data } = fetcher || {};
	
		console.log('data', data);
		if (data?.shows?.[0] && (!shows || data.shows[0].showdate.normalize() !== shows[0]?.showdate.normalize())) {
			console.log('should set shows')
			setShows(data.shows);
		}
	
		if (data?.setlist?.length > 0 && (!setlist || 
			(setlist[0].value !== data.setlist[0].value &&
			 setlist[1].value !== data.setlist[1].value &&
			 setlist[2].value !== data.setlist[2].value))) {
			setSetlist(data.setlist);
		}
	
		if (artist && data?.location && data.location !== location && !showLocationInput && date) {
			setLocation(data.location);
		}
	
		if (data?.jam === 'not on jf' && jam) {
			setJam(null);
		}
	
		if (data?.jam && data.jam !== 'not on jf' && (!jam || typeof jam === 'string' || data.jam.id !== jam.id) && songSelected === data.jam.song_name) {
			setJam(data.jam);
		}
	
		if (data?.rating && !rating && !comment) {
			setRating(data.rating.rating);
			setComment(data.rating.comment);
		}

		if (data?.song && !songObj) {
			setSongObj(data.song);
		}

		if (data?.songs && data?.songs.length !== songs?.length) {
			console.log('should set songs', data.songs.length, songs?.length)
			setSongs(data.songs)
		}
		console.log('songs.length', songs?.length)
	
	}, [fetcher, shows, setlist, artist, location, showLocationInput, date, jam, soundsSelected, rating, comment, songs]);

	useEffect(() => {
		if (actionData?.status === 200 && !jam && !showSuccessAlert) {
			setShowSuccessAlert(true);
		}
	}
	, [actionData, jam, showSuccessAlert]);

	useEffect(() => {
		if (typeof jam !== 'string' && jam?.sounds && jam?.sounds?.length > 0 && (!soundsSelected || soundsSelected.length === 0)) {
			setSoundsSelected(jam.sounds);
		}
	}, [jam, soundsSelected]);

	function clearArtist() {
		submit({ _action: 'clear' });
		setArtist(null);
		setQuery('');
		setSongSelected(null);
		setDate(null);
		setYear(null);
		setLocation('');
		setShows(null);
		setJam(null);
		setShow(null);
		setShowLoadingInfo(false);
		setShowLocationInput(false);
		setSoundsSelected(null);
		setShowSuccessAlert(false);
	}

	function clearSong() {
		submit({ _action: 'clear' });
		setSongSelected(null);
		setJam(null);
		setSoundsSelected(null);
		if (!setlist) {
			let urlToFetch;
			if (show) {
				//use fetcher.load to get setlist
				urlToFetch =
					'/getSetlist?artist=' + artist?.artist + '&date=' + show?.showdate;
			} else if (date) {
				urlToFetch = '/getSetlist?artist=' + artist?.artist + '&date=' + date;
			}
			if (urlToFetch) {
				fetcher.load(urlToFetch);
			}
		}
	}

	function clearDate() {
		submit({ _action: 'clear' });
		setDate(null);
		setShow(null);
		setLocation(null);
		setJam(null);
		setSetlist(null);
		setSoundsSelected(null);
		if (
			artist &&
			songSelected &&
			useApis &&
			[
				'Phish',
				// "Umphrey's McGee",
				'Trey Anastasio, TAB',
				'Goose',
				'Eggy',
				'Neighbor',
				"Taper's Choice",
				'King Gizzard & the Lizard Wizard',
			].includes(artist.artist)
		) {
			setYear(null);
			let urlToFetch =
				'/getShows?artist=' + artist.artist + '&song=' + songSelected;
			console.log('going to get shows by song', urlToFetch);
			fetcher.load(urlToFetch);
		} else {
			console.log('clearing song')
			clearSong();
		}
	}

	function showEditLocation() {
		setShowLocationInput(true);
	}

	function handleLocationChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.value !== location) {
			setLocation(e.target.value);
		}
	}

	async function handleYearChange(year: string) {
		if (location) setLocation(null);
		if (setlist) setSetlist(null);
		if (year === 'Clear Year') {
			setYear(null);
		} else {
			if (
				useApis &&
				artist &&
				artist.artist !== 'Squeaky Feet' &&
				artist.artist !== 'Houseplant'
			) {
				let urlToFetch = '/getShows?artist=' + artist.artist + '&year=' + year;
				console.log('going to get shows year change', urlToFetch);
				fetcher.load(urlToFetch);
			}
			if (artist &&
				![
					'Goose',
					'Eggy',
					'Neighbor',
					// "Umphrey's McGee",
					'Phish',
					"Taper's Choice",
					'Trey Anastasio, TAB',
					'King Gizzard & the Lizard Wizard',
				].includes(artist.artist)
				) {
					setShowLoadingInfo(true);
				}
				setYear(year);
			}
	}

	const startYear = artist?.start_year;
	const endYear = artist?.end_year || new Date().getFullYear();
	let yearsArr: string[] = [];
	if (startYear && endYear) {
		for (var i = endYear; i >= startYear; i--) {
			yearsArr.push(String(i));
		}
		yearsArr.push('Clear Year');
	}

	useEffect(() => {
		if (!date) {
			setDateInput('');
		}
	}, [date]);

	function handleDateInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (setlist) setSetlist(null);
		setDateInput(e.target.value);
		let dateInput = e.target.value;
		if (dateInput.length === 8) {
			let month = Number(dateInput.slice(0, 2))
			let day = Number(dateInput.slice(2, 4));
			let year = Number(dateInput.slice(4, 8));
			//Dates in JavaScript are zero-indexed LOL
			let date = new Date(year, month - 1 , day);
			if (date.toString() === 'Invalid Date') {
				setDateInputError(true);
			} else {
				setDateInputError(false);
				setDate(date.toJSON().slice(0, 10));
				if (useApis && artist) {
					let urlToFetch =
						'/getSetlist?artist=' +
						artist.artist +
						'&date=' +
						date.toJSON().slice(0, 10);
					fetcher.load(urlToFetch);
				}
			}
		}
	}

	function handleCommentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		setComment(e.target.value);
	}

	function handleSoundsChange(e: React.ChangeEvent<HTMLInputElement>) {
		// if e.target.value is not in soundsSelected, add it, else, remove it (if not in initial sounds)
		//if new sound is already selected and not in initial sounds, remove it
		if (soundsSelected?.includes(e.target.value)) {
			let newSoundsSelected = soundsSelected.filter(
				(sound) => sound !== e.target.value
			);
			setSoundsSelected(newSoundsSelected);
		} else if (soundsSelected) {
			const sortedSounds = [...soundsSelected, e.target.value].sort();
			setSoundsSelected(sortedSounds);
		} else {
			setSoundsSelected([e.target.value]);
		}
	}

	function handleLinkChange(e: React.ChangeEvent<HTMLInputElement>) {
		setListenLink(e.target.value);
	}

	//check if song exists
	useEffect(() => {
		if (songSelected && artist && date && location) {
			let urlToFetch =
				'/checkJamAdded?artist=' +
				artist.artist +
				'&song=' +
				songSelected +
				'&date=' +
				date;
			fetcher.load(urlToFetch);
		}
	}, [songSelected, date]);

	useEffect(() => {
		if (artist?.artist === 'Houseplant' || artist?.artist === 'Squeaky Feet') {
			setUseApis(false);
		} else {
			setUseApis(true);
		}
	}, [artist]);

	// useEffect(() => {
	// 	//console.log all dependencies
	// 	console.log('artist', artist);
	// 	console.log('songSelected', songSelected);
	// 	console.log('query', query);
	// 	console.log('filteredSongs', filteredSongs);
	// 	console.log('initialSongObj', initialSongObj);
	// 	console.log('initialSong', initialSong);
	// 	console.log('showAddSong', showAddSong);
	// 	console.log('songObj', songObj);
	// 	if ((query || songSelected) && filteredSongs?.length === 0 && !initialSongObj && !initialSong && !showAddSong && !songObj) {
	// 		setShowAddSong(true);
	// 	} if (songObj || initialSongObj || initialSong && showAddSong) {
	// 		setShowAddSong(false);
	// 	}
	// }, [query, songSelected, filteredSongs, initialSongObj, initialSong, showAddSong, songObj]);
	console.log('query', query, songSelected, filteredSongs?.length)
	const showAddSong: boolean = Boolean((query || songSelected) && filteredSongs?.length === 0)


	interface AddingMethod {
		id: 'auto' | 'manual';
		title: string;
	}

	const addingMethods: AddingMethod[] = [
		{ id: 'auto', title: 'Easiest way' },
		{ id: 'manual', title: 'Still pretty easy way' }
		];

	return (
		<Form
			method='post'
			className='h-screen pb-40'
		>
			<div className='flex flex-col space-y-4 p-4 pb-40 max-w-xl mx-auto h-full'>
				<p className='text-center mt-4 text-xl'>
					Add {profile ? 'and/or Rate ' : ''}a Jam
				</p>
				{!profile && <p className='text-lg text-center'>No account needed</p>}
				<div className='flex justify-around'>
					<fieldset className='mt-0'>
						<legend className='sr-only'>Jam Adding Method</legend>
						{/* <div className='space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10'> */}
						<div className='space-y-0 space-x-4 flex items-center'>
							{addingMethods.map((addingMethod) => (
								<div
									key={addingMethod?.id}
									className='flex align-middle'
								>
									<input
										key={addingMethod.id}
										id={addingMethod.id}
										name='adding-method'
										type='radio'
										defaultChecked={
											artist?.artist === 'Squeaky Feet' ||
											artist?.artist === 'Houseplant'
												? addingMethod.id === 'manual'
												: addingMethod.id === 'auto'
										}
										disabled={
											artist?.artist === 'Squeaky Feet' ||
											artist?.artist === 'Houseplant'
												? addingMethod.id === 'auto'
												: false
										}
										className='h-4 w-4 border-gray-300 text-cyan-600 focus:ring-cyan-500'
										onClick={() => handleAddMethodChange(addingMethod.id)}
									/>
									<label
										htmlFor={addingMethod.id}
										className='ml-3 block text-sm font-medium text-gray-700'
									>
										{addingMethod.title}
									</label>
								</div>
							))}
						</div>
					</fieldset>
				</div>
				<input
					type='hidden'
					name='artist'
					value={artist?.artist}
				/>
				<input
					type='hidden'
					name='song'
					value={songSelected ?? undefined}
				/>
				<input
					type='hidden'
					name='date'
					value={date ?? undefined}
				/>
				<input
					type='hidden'
					name='location'
					value={location ?? undefined}
				/>
				<input
					type='hidden'
					name='jam'
					value={JSON.stringify(jam)}
				/>
				<input
					type='hidden'
					name='sounds'
					value={soundsSelected ?? undefined}
				/>
				<input
					type='hidden'
					name='rating'
					value={rating ?? undefined}
				/>
				<input
					type='hidden'
					name='songObj'
					value={JSON.stringify(songObj)}
				/>
				<input
					type='hidden'
					name='profile'
					value={JSON.stringify(profile)}
				/>
				<input
					type='hidden'
					name='ratingId'
					value={ratingId || ''}
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
									<Listbox.Label className='block text-md font-medium text-gray-700'>
										Band
									</Listbox.Label>
									<div className='relative mt-1'>
										<Listbox.Button className='relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 sm:text-sm h-10'>
											<span className='block truncate'>{''}</span>
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
												{artists &&
													artists?.map((artist: Artist, artistIdx: number) => (
														<Listbox.Option
															key={artistIdx}
															className={({ active }) =>
																classNames(
																	active
																		? 'text-white bg-cyan-600'
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
																			selected
																				? 'font-semibold'
																				: 'font-normal',
																			'block truncate'
																		)}
																	>
																		{artist.artist}
																	</span>

																	{selected ? (
																		<span
																			className={classNames(
																				active ? 'text-white' : 'text-cyan-600',
																				'absolute inset-y-0 right-0 flex items-center pr-4'
																			)}
																		>
																			<CheckIcon
																				className='h-5 w-5'
																				aria-hidden='true'
																			/>
																		</span>
																	) : (
																		''
																	)}
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
						<p className='text-lg'>{artist.artist}</p>
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
					!songSelected &&
					(((!setlist || !date) &&
						!year &&
						[
							'Goose',
							'Eggy',
							'Neighbor',
							// "Umphrey's McGee",
							'Phish',
							"Taper's Choice",
							'Trey Anastasio, TAB',
							'King Gizzard & the Lizard Wizard',
						].includes(artist.artist)) ||
						(![
							'Goose',
							'Eggy',
							'Neighbor',
							// "Umphrey's McGee",
							'Phish',
							"Taper's Choice",
							'Trey Anastasio, TAB',
							'King Gizzard & the Lizard Wizard',
						].includes(artist.artist) &&
							date) ||
						!useApis) && (
						<div className='max-w-sm py-4'>
							<Combobox
								as='div'
								value={songSelected}
								onChange={(e: string) => {
									setSongSelected(e);
								}}
								name='song'
							>
								<Combobox.Label className='block text-md font-medium text-gray-700'>
									Song
								</Combobox.Label>
								<div className='relative mt-1'>
									<Combobox.Input
										className='w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 sm:text-sm'
										onChange={(event) => {
											setQuery(event.target.value);
										}}
										// displayValue={(songItem) => songSelected ?? ''}
										placeholder='Search for a song'
									/>
									<Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
										<ChevronUpDownIcon
											className='h-5 w-5 text-gray-400'
											aria-hidden='true'
										/>
									</Combobox.Button>

									{filteredSongs && filteredSongs?.length > 0 && (
										<Combobox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
											{filteredSongs &&
												filteredSongs?.map((song: SongInSonglist, songIdx: number) => (
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
														{({ active, selected }: { active: boolean; selected: boolean }) => (
															<>
																<span
																	className={classNames(
																		'block truncate',
																		selected ? 'font-semibold' : ''
																	)}
																>
																	{song.song}
																</span>

																{selected && (
																	<span
																		className={classNames(
																			'absolute inset-y-0 right-0 flex items-center pr-4',
																			active ? 'text-white' : 'text-cyan-600'
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
						<p className='text-lg'>{songSelected}</p>
						<button
							type='button'
							onClick={clearSong}
						>
							Change Song
						</button>
					</div>
				)}
				{/* show picker if songfish artist and no date/year*/}
				{useApis &&
					songSelected &&
					artist &&
					!date &&
					!year &&
					shows &&
					[
						'Goose',
						'Eggy',
						'Neighbor',
						// "Umphrey's McGee",
						'Phish',
						"Taper's Choice",
						'Trey Anastasio, TAB',
						'King Gizzard & the Lizard Wizard',
					].includes(artist.artist) && (
						<div className='max-h-40'>
							<Listbox
								value={show}
								onChange={handleShowChange}
							>
								{({ open }) => (
									<>
										<Listbox.Label className='block text-md font-medium text-gray-700'>
											Shows with a
											{songSelected[0] === 'A' ||
											songSelected[0] === 'E' ||
											songSelected[0] === 'I' ||
											songSelected[0] === 'O' ||
											songSelected[0] === 'U'
												? 'n'
												: ''}{' '}
											{songSelected}
										</Listbox.Label>
										<div className='relative mt-1'>
											<Listbox.Button className='relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 sm:text-sm h-10'>
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
													{shows &&
														shows?.map((show, showIdx) => (
															<Listbox.Option
																key={showIdx}
																className={({ active }) =>
																	classNames(
																		active
																			? 'text-white bg-cyan-600'
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
																						: 'text-cyan-600',
																					'absolute inset-y-0 right-0 flex items-center pr-4'
																				)}
																			>
																				<CheckIcon
																					className='h-5 w-5'
																					aria-hidden='true'
																				/>
																			</span>
																		) : (
																			''
																		)}
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
				{showAddSong && (
					<div>
						<InfoAlert
							title={`No songs containing "${
								query && query !== '' ? query : songSelected
							}" found`}
							description={`Click the button below to add "${
								query && query !== '' ? query : songSelected
							}" to Jam Fans`}
						/>
						<label
							htmlFor='new-song'
							className='block text-md font-medium text-gray-700'
						>
							New song to add
						</label>
						<div className='mt-1'>
							<input
								type='text'
								name='new-song'
								id='new-song'
								value={songSelected ?? query ?? ''}
								className='block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm'
								aria-describedby='new-song'
								onChange={(event) => event && setQuery(event.target.value)}
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
							className=' my-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500'
						>
							Add "{query && query !== '' ? query : songSelected}"
						</button>
					</div>
				)}
				{/* Year picker */}
				{useApis && artist && !date && !songSelected && (
					<div className='max-h-40 max-w-xs'>
						<Listbox
							value={year}
							onChange={handleYearChange}
						>
							{({ open }) => (
								<>
									<Listbox.Label className='block text-md font-medium text-gray-700'>
										Year
									</Listbox.Label>
									<div className='relative mt-1'>
										<Listbox.Button className='relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 sm:text-sm h-10'>
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
												{yearsArr &&
													yearsArr?.map((year, yearIdx) => (
														<Listbox.Option
															key={yearIdx}
															className={({ active }) =>
																classNames(
																	active
																		? 'text-white bg-cyan-600'
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
																			selected
																				? 'font-semibold'
																				: 'font-normal',
																			'block truncate'
																		)}
																	>
																		{year}
																	</span>

																	{selected ? (
																		<span
																			className={classNames(
																				active ? 'text-white' : 'text-cyan-600',
																				'absolute inset-y-0 right-0 flex items-center pr-4'
																			)}
																		>
																			<CheckIcon
																				className='h-5 w-5'
																				aria-hidden='true'
																			/>
																		</span>
																	) : (
																		''
																	)}
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
				{useApis &&
					shows &&
					shows?.length > 0 &&
					!date &&
					year &&
					!songSelected &&
					(!fetcher ||
						(fetcher && fetcher.state && fetcher.state !== 'loading')) && (
						<div className='max-h-40'>
							<Listbox
								value={show}
								onChange={handleShowChange}
							>
								{({ open }) => (
									<>
										<Listbox.Label className='block text-md font-medium text-gray-700'>
											Shows from {year}
										</Listbox.Label>
										<div className='relative mt-1'>
											<Listbox.Button className='relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 sm:text-sm h-10'>
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
													{shows &&
														shows?.map((show, showIdx) => (
															<Listbox.Option
																key={showIdx}
																className={({ active }) =>
																	classNames(
																		active
																			? 'text-white bg-cyan-600'
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
																						: 'text-cyan-600',
																					'absolute inset-y-0 right-0 flex items-center pr-4'
																				)}
																			>
																				<CheckIcon
																					className='h-5 w-5'
																					aria-hidden='true'
																				/>
																			</span>
																		) : (
																			''
																		)}
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
				{/* Loading spinner
				{fetcher &&
					fetcher.state &&
					fetcher.state === 'loading' &&
					!(artist && songSelected && date && location) && (
						<div className='flex flex-col justify-center'>
							<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-700'></div>
						</div>
					)} */}
				{/* Date picker input */}
				{useApis && !date && artist && !songSelected && !year && (
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
				{useApis && setlist && date && !songSelected && (
					<div className='max-h-40'>
						<Listbox
							value={songSelected || ''}
							onChange={setSongSelected}
						>
							{({ open }) => (
								<>
									<Listbox.Label className='block text-md font-medium text-gray-700'>
										Setlist from {new Date(date + 'T18:00:00').toDateString()}
									</Listbox.Label>
									<div className='relative mt-1'>
										<Listbox.Button className='relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 sm:text-sm h-10'>
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
												{setlist &&
													setlist?.map((songInSet: SongInSetlist, songInSetIdx: number) => (
														<Listbox.Option
															key={songInSetIdx}
															className={({ active }) =>
																classNames(
																	active
																		? 'text-white bg-cyan-600'
																		: 'text-gray-900',
																	'relative cursor-default select-none py-2 pl-3 pr-9'
																)
															}
															value={songInSet.value}
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
																		{songInSet.label}
																	</span>

																	{selected ? (
																		<span
																			className={classNames(
																				active ? 'text-white' : 'text-cyan-600',
																				'absolute inset-y-0 right-0 flex items-center pr-4'
																			)}
																		>
																			<CheckIcon
																				className='h-5 w-5'
																				aria-hidden='true'
																			/>
																		</span>
																	) : (
																		''
																	)}
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
				{!useApis && !date && artist && songSelected && (
					<>
						<label
							htmlFor='datManual'
							className='block text-md font-medium text-gray-700'
						>
							Date
						</label>
						<p
							className='mt-2 text-sm text-gray-500'
							id='date-description'
						>
							MMDDYYYY format, please
						</p>
						<div className='mt-1'>
							<input
								type='text'
								name='date'
								id='dateManual'
								className='block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm'
								aria-describedby='date-description'
								value={dateInput}
								onChange={handleDateInputChange}
							/>
						</div>
					</>
				)}
				{/* display date*/}
				{date && (
					<div className='flex justify-between text-sm'>
						<p className='text-lg'>
							{new Date(date + 'T16:00:00').toLocaleDateString()}
						</p>
						<button
							type='button'
							onClick={clearDate}
						>
							Change Date
						</button>
					</div>
				)}
				{/* display location */}
				{location && location !== '' && (
					<div className='flex justify-between text-sm'>
						<p className='text-lg'>{location}</p>
						<button
							type='button'
							onClick={showEditLocation}
						>
							Edit Location
						</button>
					</div>
				)}
				{((useApis && (showLocationInput || (date && !location))) ||
					(!useApis && date)) && (
					<div>
						<label
							htmlFor='location'
							className='block text-md font-medium text-gray-700'
						>
							Location
						</label>
						<p
							className='mt-2 text-sm text-gray-500'
							id='location-description'
						>
							Venue, City, State (or Country, if not US)
						</p>
						<div className='mt-1'>
							<input
								type='text'
								name='location'
								id='location'
								defaultValue={location ?? ''}
								onChange={handleLocationChange}
								className='block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm'
								aria-describedby='location-description'
							/>
						</div>
					</div>
				)}
				{/* Loading spinner*/}
				{fetcher && fetcher.state && fetcher.state === 'loading' && (
					<div className='flex flex-col justify-center'>
						<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-700'></div>
					</div>
				)}
				{/* api attribution */}
				{useApis && artist?.artist && (
					<div
						className={`text-sm text-gray-500 ${
							!(artist && songSelected && date) && !showLoadingInfo
								? 'pb-40'
								: ''
						}`}
					>
						Shows and setlists from{' '}
						<a
							href={
								artist.artist === 'Phish' ||
								artist.artist === 'Trey Anastasio, TAB'
									? 'https://phish.net'
									: artist.artist === 'Goose'
									? 'https://elgoose.net'
									// : artist.artist === "Umphrey's McGee"
									// ? 'https://allthings.umphreys.com'
									: artist.artist === 'Neighbor'
									? 'https://neighbortunes.net'
									: artist.artist === 'Eggy'
									? 'https://thecarton.net'
									: artist.artist === "Taper's Choice"
									? 'https://taperschoice.net'
									: artist.artist === 'King Gizzard & the Lizard Wizard' ?
									'https://kglw.net'
									: 'https://www.setlist.fm'
							}
							className='underline'
						>
							{artist.artist === 'Phish' ||
							artist.artist === 'Trey Anastasio, TAB'
								? 'phish.net'
								: artist.artist === 'Goose'
								? 'elgoose.net'
								// : artist.artist === "Umphrey's McGee"
								// ? 'allthings.umphreys.com'
								: artist.artist === 'Neighbor'
								? 'neighbortunes.net'
								: artist.artist === 'Eggy'
								? 'thecarton.net'
								: artist.artist === "Taper's Choice"
								? 'taperschoice.net'
								: artist.artist === 'King Gizzard & the Lizard Wizard'
								? 'kglw.net'
								: 'setlist.fm'}
						</a>
						.{' '}
						{[
							'Goose',
							'Eggy',
							'Neighbor',
							// "Umphrey's McGee",
							'Phish',
							"Taper's Choice",
							'Trey Anastasio, TAB',
							'King Gizzard & the Lizard Wizard',
						].includes(artist.artist) ? (
							<p>
								Thanks{' '}
								<a
									className='underline'
									href='https://adamscheinberg.com'
								>
									Adam Scheinberg
								</a>
								!
							</p>
						) : !(artist && songSelected && date && location) ? (
							"If the info isn't on setlist.fm, please consider adding it there if you know it. Thanks for contributing!"
						) : (
							''
						)}
					</div>
				)}
				{useApis &&
					showLoadingInfo &&
					artist && 
					!(songSelected && date && location) &&
					![
						'Goose',
						'Eggy',
						'Neighbor',
						// "Umphrey's McGee",
						'Phish',
						"Taper's Choice",
						'Trey Anastasio, TAB',
						'King Gizzard & the Lizard Wizard',
					].includes(artist.artist) && (
						<InfoAlert
							title={'Thanks for your patience!'}
							description={
								"Setlist.fm limits how fast we can get data and how much data we can get, so if it's not working, please try the 'Still pretty easy way.' Thanks for contributing!"
							}
						/>
					)}
				{artist &&
					songSelected &&
					date &&
					location &&
					jam &&
					jam !== 'not on jf' && (
						<SuccessAlert
							title={"It's on Jam Fans!"}
							description={`You can add sounds ${
								profile
									? ' and your subjective rating and comments below'
									: 'below. If you want to rate or comment, please log in'
							}. Thanks for helping other fans!`}
						/>
					)}
				{artist && songSelected && date && location && (
					<>
						<p className='text-sm'>Optional fields:</p>
						{/* Sounds picker */}
						<div className=''>
							<div className='mt-1 flex rounded-md shadow-sm max-w-fit'>
								<fieldset>
									<legend className='block text-sm font-medium text-gray-700'>
										Sounds to Add
									</legend>
									<div className='mt-4 divide-y divide-gray-200 border-t border-b border-gray-200 max-h-60 overflow-y-scroll max-w-fit'>
										{sounds &&
											sounds?.map((sound: Sound, soundIdx: number) => {
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
																{sound.label}
															</label>
														</div>
														<div className='ml-3 flex h-5 items-center'>
															<input
																value={`${sound.label}`}
																id={`${sound.text}`}
																name={`sounds-${sound.text}`}
																type='checkbox'
																className='h-6 w-6 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500  border-2 mr-2'
																checked={
																	(typeof jam !== 'string' && jam?.sounds?.includes(sound.label)) ||
																	soundsSelected?.includes(sound.label)
																}
																onChange={handleSoundsChange}
																disabled={typeof jam !== 'string' && jam?.sounds?.includes(sound.label)}
															/>
														</div>
													</div>
												);
											})}
									</div>
								</fieldset>
							</div>
						</div>
					</>
				)}
				{/* list of sounds selected */}
				{artist &&
					songSelected &&
					date &&
					location &&
					soundsSelected &&
					soundsSelected.length > 0 && <p>Sounds: {soundsSelected.join(', ')}</p>}
				{/* listen link */}
				{artist &&
					songSelected &&
					date &&
					location &&
					profile &&
					(!jam || (typeof jam !== 'string' && !jam?.listen_link)) && (
						<div className='mt-6'>
							<label
								htmlFor='listen-link'
								className='block text-sm font-medium text-gray-700'
							>
								Listen Link
							</label>
							<div className='mt-1'>
								<input
									type='text'
									name='listen-link'
									id='listen-link'
									className='shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md'
									value={listenLink}
									onChange={handleLinkChange}
								/>
							</div>
						</div>
					)}
				{/* rating picker */}
				{artist && songSelected && date && location && profile && (
					<div className='max-w-xs'>
						<Listbox
							value={rating}
							onChange={handleRatingChange}
						>
							{({ open }) => (
								<>
									<Listbox.Label className='block text-sm font-medium text-gray-700'>
										Your subjective rating. This is just to help fans find it.
										No stress!
									</Listbox.Label>
									<div className='relative mt-1'>
										<Listbox.Button className='relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 sm:text-sm h-10'>
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
											<Listbox.Options className='absolute z-10 mt-1 max-h-50 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm h-60'>
												{[10, 9, 8, 7, 6, 5, 4, 'No rating'].map(
													(rating, ratingIdx) => (
														<Listbox.Option
															key={ratingIdx}
															className={({ active }) =>
																classNames(
																	active
																		? 'text-white bg-cyan-600'
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
																				active ? 'text-white' : 'text-cyan-600',
																				'absolute inset-y-0 right-0 flex items-center pr-4'
																			)}
																		>
																			<CheckIcon
																				className='h-5 w-5'
																				aria-hidden='true'
																			/>
																		</span>
																	) : (
																		''
																	)}
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
							<div className='mt-1 mb-10'>
								<textarea
									name='comment'
									id='comment'
									cols={30}
									rows={5}
									defaultValue={''}
									value={comment}
									onChange={handleCommentChange}
									className='block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm'
									aria-describedby='comment'
								></textarea>
								<InfoAlert
									title={'Rating and comment can be updated'}
									description={
										'You can add or change your comment and rating later'
									}
								></InfoAlert>
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
				<div
					className={`flex justify-around bg-white w-full px-2 ${
						actionData && actionData?.body === 'action complete' ? '' : 'pb-20'
					}`}
				>
					{/* not logged in, add new jam*/}
					{!profile && !jam && artist && songSelected && date && location && (
						<button
							type='submit'
							name='_action'
							value='add-not-logged-in'
							className={`inline-flex justify-center rounded-md border border-transparent bg-cyan-600 py-2 px-2 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2`}
							disabled={showAddSong}
						>
							Add this jam
						</button>
					)}
					{/* not logged in, jam exists, update sounds*/}
					{!profile &&
						jam &&
						typeof jam !== 'string' &&
						jam?.sounds?.length !== soundsSelected?.length && (
							<button
								type='submit'
								name='_action'
								value='update-not-logged-in'
								className={`inline-flex justify-center rounded-md border border-transparent bg-cyan-600 py-2 px-2 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2`}
								disabled={showAddSong}
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
						(!jam || jam === 'not on jf') &&
						!rating &&
						!comment && (
							<button
								type='submit'
								name='_action'
								value='add-logged-in'
								className={`inline-flex justify-center rounded-md border border-transparent bg-cyan-600 py-2 px-2 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2`}
								disabled={showAddSong}
							>
								Add this jam
							</button>
						)}
					{/*logged in, existing jam, no rating*/}
					{profile &&
						jam &&
						typeof jam !== 'string' &&
						(jam?.sounds?.length !== soundsSelected?.length ||
							(!jam?.listen_link && listenLink)) &&
						!rating &&
						!comment && (
							<button
								type='submit'
								name='_action'
								value='update-logged-in'
								className={`inline-flex justify-center rounded-md border border-transparent bg-cyan-600 py-2 px-2 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2`}
								disabled={showAddSong}
							>
								Update this jam
							</button>
						)}
					{/*logged in, add new jam, with rating/comment*/}
					{profile && (!jam || jam === 'not on jf') && (rating || comment) && (
						<button
							type='submit'
							name='_action'
							value='add-and-rating'
							className={`inline-flex justify-center rounded-md border border-transparent bg-cyan-600 py-2 px-2 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2`}
							disabled={showAddSong}
						>
							Add jam and rating/comment
						</button>
					)}
					{/*logged in, jam exists, add rating/comment, no new sounds, no link*/}
					{profile &&
						jam &&
						typeof jam !== 'string' &&
						(rating || comment) &&
						jam?.sounds?.length === soundsSelected?.length &&
						(jam.listen_link || !listenLink) && (
							<button
								type='submit'
								name='_action'
								value='rating'
								className={`inline-flex justify-center rounded-md border border-transparent bg-cyan-600 py-2 px-2 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2`}
								disabled={showAddSong}
							>
								Add rating/comment
							</button>
						)}
					{/*logged in, jam exists, add rating/comment and sounds*/}
					{profile &&
						jam &&
						typeof jam !== 'string' &&
						(rating || comment) &&
						(jam?.sounds?.length !== soundsSelected?.length ||
							(!jam?.listen_link && listenLink)) && (
							<button
								type='submit'
								name='_action'
								value='rating-update'
								className={`inline-flex justify-center rounded-md border border-transparent bg-cyan-600 py-2 px-2 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2`}
								disabled={showAddSong}
							>
								Update jam and add rating/comment
							</button>
						)}
				</div>
				{actionData && actionData?.body === 'action complete' && (
					<div className='pb-20'>
						<SuccessAlert
							title={'Success!'}
							description={
								"Thanks for contributing and helping other fans find this jam"
							}
						/>
					</div>
				)}
				{actionData && actionData?.status !== 200 && (
					<div className='pb-20'>
						<InfoAlert
							title={'Error :('}
							description={
								'Something went wrong. Please try again and/or let me know'
							}
						/>
						<a href='https://twitter.com/jeffphox'>@jeffphox</a>
					</div>
				)}
			</div>
		</Form>
	);
}
