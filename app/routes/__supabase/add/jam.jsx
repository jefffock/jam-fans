import {
	Form,
	useLoaderData,
	useFetcher,
	useOutletContext,
	useActionData,
	useNavigate,
  useSubmit
} from '@remix-run/react';
import { json, redirect } from '@remix-run/node';
import { createServerClient } from '@supabase/auth-helpers-remix';
import { Listbox, Transition, Dialog, Combobox } from '@headlessui/react';
import { Fragment, useState, useEffect, useRef } from 'react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import InfoAlert from '../../../components/alerts/InfoAlert';
import SuccessAlert from '../../../components/alerts/SuccessAlert';
import { textSpanContainsPosition } from 'typescript';

export const loader = async ({ request, params }) => {
	const response = new Response();
	const supabaseClient = createServerClient(
		process.env.SUPABASE_URL,
		process.env.SUPABASE_ANON_KEY,
		{ request, response }
	);
	const url = new URL(request.url);
	const searchParams = new URLSearchParams(url.search);
	const queryParams = Object.fromEntries(searchParams);
	console.log('queryParams', queryParams);
	let jam = null;
	if (queryParams?.jamid) {
		const { data } = await supabaseClient
			.from('versions')
			.select('*')
			.eq('id', JSON.parse(queryParams.jamid))
			.single();
		jam = data;
	}
	let initialArtist;
	let initialSong;
	let initialDate;
	let initialLocation;
	let initialSounds;
	let initialSongObj;
	if (jam) {
		initialSong = jam.song_name;
		initialDate = jam.date;
		initialLocation = jam.location;
		initialSounds = jam.sounds;
		const { data: songObj } = await supabaseClient
			.from('songs')
			.select('*')
			.eq('name', jam.song_name)
			.single();
		initialSongObj = songObj;
		//get artist obj
		const { data: artistObj } = await supabaseClient
			.from('artists')
			.select('*')
			.eq('artist', jam.artist)
			.single();
		initialArtist = artistObj;
	} else if (queryParams?.song) {
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
	console.log('initialSong in loader', initialSong);
	console.log('initialSongObj', initialSongObj);
	return json(
		{
			artists,
			songs,
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

export async function action({ request, params }) {
	const response = new Response();
	let formData = await request.formData();
	let { _action, ...values } = Object.fromEntries(formData);
  console.log('_action', _action)
	const supabaseClient = createServerClient(
		process.env.SUPABASE_URL,
		process.env.SUPABASE_ANON_KEY,
		{ request, response }
	);
	async function addOnePoint(profileName) {
		const { error } = await supabaseClient.rpc('add_one_point', {
			username: profileName,
		});
		if (error) {
			console.error('error adding one point', error);
		} else console.log('added one point');
	}

	async function addTenPoints(profileName) {
		const { error } = await supabaseClient.rpc('add_ten_points', {
			username: profileName,
		});
		if (error) {
			console.error('error adding ten points', error);
		} else {
			console.log('added ten points');
		}
	}

	async function addRatingCountToArtist(artistId) {
		const { error } = await supabaseClient.rpc('add_rating_count_artist', {
			artistid: artistId,
		});
		if (error) {
			console.error('error adding rating count to artist', error);
		} else {
			console.log('added rating count to artist');
		}
	}

	async function addRatingCountToSong(songId) {
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

	async function addRatingCountToVersion(versionId) {
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

	async function calcAverageForVersion(versionId) {
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

	console.log('values', values);
	let sounds = [];
	if (values.sounds) {
		values.sounds.split(',').forEach((sound) => {
			sounds.push(sound);
		});
	}
	let jam;
	if (values.jam) {
		jam = JSON.parse(values.jam);
	}
	let profile;
	if (values.profile) {
		profile = JSON.parse(values.profile);
	}
	let songObj;
	if (values.songObj) {
		songObj = JSON.parse(values.songObj);
	} else if (!values.songObj || values.songObj === '"') {
		const { data, error } = await supabaseClient
			.from('songs')
			.select('*')
			.eq('song', values['new-song'])
			.single();
		songObj = data;
	}
	console.log('songObj', songObj);
	console.log('song_id', songObj?.id);
	console.log('profile', profile);
	if (_action === 'clear') {
		return {
			status: 200,
			body: 'clear',
		};
	}
	if (_action === 'new-song') {
		const { data, error } = await supabaseClient
			.from('songs')
			.insert({ song: values['new-song'], artist: values.artist });
		if (profile?.name) {
			addTenPoints(profile.name);
		}
		//make search params string with artist, song, date, location
		let searchParams = new URLSearchParams();
		searchParams.append('artist', values.artist);
		searchParams.append('song', values['new-song']);
		if (values?.date) searchParams.append('date', values.date);
		if (values?.location) searchParams.append('location', values.location);
		console.log('searchParams', searchParams.toString());
		console.log('params', searchParams.toString());
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
		console.log('data', data);
		console.log('error', error);
		addOnePoint(songObj?.submitter_name);
	}
	if (_action === 'update-not-logged-in') {
		const { data, error } = await supabaseClient
			.from('versions')
			.update({
				sounds: sounds,
			})
			.eq('id', jam?.id);
		console.log('data', data);
		console.log('error', error);
	}
	if (_action === 'add-logged-in') {
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
		});
		console.log('data', data);
		console.log('error', error);
		addTenPoints(profile?.name);
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
			console.log('data', data);
			console.log('error', error);
		} else {
			const { data, error } = await supabaseClient.from('versions').update({
				sounds: sounds,
			});
			addOnePoint(profile?.name).eq('id', jam?.id);
			console.log('data', data);
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
		console.log('data', data);
		if (data && data.length > 0) {
			console.log('going to add rating to this jam', data);
			const jamId = data[0].id;
			const { dataFromAddRating, error } = await supabaseClient
				.from('ratings')
				.insert({
					user_id: profile?.id,
					version_id: jamId,
					rating: values.rating,
					comment: values.comment,
					submitter_name: profile?.name,
				})
				.select();
			console.log('data add rating', dataFromAddRating);
			console.log('error add rating', error);
			addTenPoints(profile?.name);
			addTenPoints(profile?.name);
			addOnePoint(songObj?.submitter_name);
			addRatingCountToArtist(values.artist);
			addRatingCountToSong(values.song);
			addRatingCountToVersion(jamId);
			calcAverageForVersion(jamId);
		}
		console.log('error add jam', error);
	}
	if (_action === 'rating') {
		console.log('in rating');
		const { data, error } = await supabaseClient
			.from('ratings')
			.insert({
				user_id: profile?.id,
				version_id: jam?.id,
				rating: values.rating,
				comment: values.comment,
				submitter_name: profile?.name,
			})
			.select();
		console.log('data', data);
		console.log('error', error);
		addTenPoints(profile?.name);
		addOnePoint(songObj?.submitter_name);
		addOnePoint(jam?.submitter_name);
		addRatingCountToArtist(values.artist);
		addRatingCountToSong(values.song);
		addRatingCountToVersion(jam?.id);
		calcAverageForVersion(jam?.id);
	}
	if (_action === 'rating-update') {
		//insert rating
		//update version
		console.log('in rating update');
		const { data, error } = await supabaseClient
			.from('ratings')
			.insert({
				user_id: profile?.id,
				version_id: jam?.id,
				rating: values.rating,
				comment: values.comment,
				submitter_name: profile?.name,
			})
			.select();
		console.log('data', data);
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
			console.log('data', data);
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
			addRatingCountToArtist(values.artist);
			addRatingCountToSong(values.song);
			addRatingCountToVersion(jam?.id);
			calcAverageForVersion(jam?.id);
		}
	}
	return { status: 200, body: 'action complete' };
}

export default function AddJam() {
	const { supabase, session } = useOutletContext();
	const fetcher = useFetcher();
	const actionData = useActionData();
	const {
		artists,
		songs,
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
	const [songSelected, setSongSelected] = useState(initialSong ?? '');
	const [soundsSelected, setSoundsSelected] = useState(initialSounds ?? '');
	const [jamDate, setJamDate] = useState('');
	const [jamLocation, setJamLocation] = useState('');
	const [query, setQuery] = useState('');
	const [artist, setArtist] = useState(initialArtist ?? '');
	const [song, setSong] = useState(initialSong ?? '');
	const [songObj, setSongObj] = useState(initialSongObj ?? null);
	const [songExists, setSongExists] = useState(false);
	const [showLoadingInfo, setShowLoadingInfo] = useState(false);
	const [open, setOpen] = useState(false);
	const [songErrorText, setSongErrorText] = useState(null);
	const [artistErrorText, setArtistErrorText] = useState(null);
	const [dateErrorText, setDateErrorText] = useState(null);
	const [locationErrorText, setLocationErrorText] = useState(null);
	const [showSuccessAlert, setShowSuccessAlert] = useState(false);
	const [successAlertText, setSuccessAlertText] = useState(null);
	const [setlist, setSetlist] = useState(null);
	const [tags, setTags] = useState([]);
	const [date, setDate] = useState(initialDate ?? '');
	const [location, setLocation] = useState(initialLocation ?? '');
	const [tagsText, setTagsText] = useState('');
	const [rating, setRating] = useState('');
	const [comment, setComment] = useState('');
	const [listenLink, setListenLink] = useState('');
	const [show, setShow] = useState('');
	const [loadingShows, setLoadingShows] = useState(false);
	const [loadingSetlist, setLoadingSetlist] = useState(false);
	const [jams, setJams] = useState(null);
	const [jam, setJam] = useState(initialJam);
	const [year, setYear] = useState('');
	const [showLocationInput, setShowLocationInput] = useState(false);
	const [noSetlistFound, setNoSetlistFound] = useState(false);
	const [setlistUrl, setSetlistUrl] = useState(null);
	const [showsInYearFromSetlistFM, setShowsInYearFromSetlistFM] =
		useState(false);
	const [added, setAdded] = useState(false);
	const [dateInput, setDateInput] = useState('');
	const [dateInputError, setDateInputError] = useState(false);
	const [showsBySong, setShowsBySong] = useState(null);
	const [showsByYear, setShowsByYear] = useState(null);
	const [songId, setSongId] = useState(null);
	const [useApis, setUseApis] = useState(true);
	const [showPickerLabel, setShowPickerLabel] = useState('Shows');
	const navigate = useNavigate();
  const submit = useSubmit();

	useEffect(() => {
		if (user && !profile && typeof document !== 'undefined') {
			navigate('/welcome');
		}
		if (initialSong && !songObj) {
			async function getSongObj() {
				const { data, error } = await supabase
					.from('songs')
					.select('*')
					.eq('song', initialSong)
					.single();
				if (data) {
					setSongObj(data);
				}
			}
			getSongObj();
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
			? songSelected
				? sortedSongs?.filter((song) => {
						return (
							song.song.toLowerCase().includes(songSelected.toLowerCase()) &&
							song.song.length === songSelected.length
						);
				  })
				: sortedSongs
			: sortedSongs?.filter((song) => {
					return song.song.toLowerCase().includes(query.toLowerCase());
			  });

	function handleArtistChange(artist) {
		console.log('changing artist');
		submit({ _action: 'clear' });
		setSongSelected('');
		setJam(null);
		setShowsByYear(null);
		setShowsBySong(null);
		setShow(null);
		setLocation('');
		setDate('');
		setYear('');
		setSoundsSelected('');
		setShowLoadingInfo(false);
		setArtist(artist);
	}

	function handleAddMethodChange(addMethod) {
		setUseApis(addMethod === 'auto');
	}

	function classNames(...classes) {
		return classes.filter(Boolean).join(' ');
	}

	//get shows by song for select artists
	useEffect(() => {
		setShowsBySong(null);
		setQuery('');
		if (
			artist &&
			artist.artist !== 'Squeaky Feet' &&
			artist.artist !== 'Houseplant' &&
			songSelected &&
			useApis &&
			(artist.artist === 'Goose' ||
				artist.artist === 'Eggy' ||
				artist.artist === 'Neighbor' ||
				artist.artist === "Umphrey's McGee" ||
				artist.artist === 'Phish' ||
				artist.artist === "Taper's Choice" ||
				artist.artist === 'Trey Anastasio, TAB')
		) {
			let urlToFetch =
				'/getShows?artist=' + artist.artist + '&song=' + songSelected;
			fetcher.load(urlToFetch);
		}
		async function getSongObj() {
			const { data, error } = await supabase
				.from('songs')
				.select('*')
				.eq('song', songSelected)
				.single();
			if (data) {
				setSongObj(data);
				if (actionData?.body.includes('added song')) {
					navigate('/');
				}
			}
		}
		if (filteredSongs?.length !== 0) {
			getSongObj();
		}
	}, [songSelected, actionData?.body]);

	function handleShowChange(show) {
		if (show) {
			setSetlist(null);
			//dont get setlist song bc checkJamAdded takes care of it
			if (
				useApis &&
				artist &&
				artist !== 'Squeaky Feet' &&
				artist !== 'Houseplant' &&
				!songSelected
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
			let songInSetlist = setlist.find(({ value }) => value === songSelected);
			if (!songInSetlist) {
				setSongSelected('');
			}
		}
	}, [setlist]);

	function clearArtist() {
		submit({ _action: 'clear' });
		setArtist('');
		setSong('');
		setQuery('');
		setSongSelected('');
		setDate('');
		setYear('');
		setLocation('');
		setShowsBySong(null);
		setShowsByYear(null);
		setJam('');
		setShow('');
		setShowLoadingInfo(false);
		setShowLocationInput(false);
		setSoundsSelected('');
		setShowSuccessAlert(false);
	}

	function clearSong() {
		submit({ _action: 'clear' });
		setSong('');
		setSongSelected('');
		setJam('');
	}

	function clearDate() {
		submit({ _action: 'clear' });
		setDate('');
		setShow('');
		setLocation('');
		setJam('');
		setSetlist('');
	}

	function showEditLocation() {
		setShowLocationInput(true);
	}

	function handleLocationChange(e) {
		if (e.target.value !== location) {
			setLocation(e.target.value);
		}
	}

	async function handleYearChange(e) {
		if (showsByYear) setShowsByYear(null);
		if (location) setLocation('');
		if (setlist) setSetlist(null);
		if (e === 'Clear Year') {
			setYear('');
		} else {
			if (
				useApis &&
				artist &&
				artist.artist !== 'Squeaky Feet' &&
				artist.artist !== 'Houseplant'
			) {
				let urlToFetch = '/getShows?artist=' + artist.artist + '&year=' + e;
				fetcher.load(urlToFetch);
			}
			setYear(e);
			if (
				artist.artist !== 'Phish' &&
				artist.artist !== "Umphrey's McGee" &&
				artist.artist !== 'Trey Anastasio, TAB' &&
				artist.artist !== 'Goose' &&
				artist.artist !== 'Eggy' &&
				artist.artist !== 'Neighbor' &&
				artist.artist !== "Taper's Choice"
			) {
				setShowLoadingInfo(true);
			}
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
		if (setlist) setSetlist(null);
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
				if (useApis) {
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

	function handleCommentChange(e) {
		setComment(e.target.value);
	}

	function handleSoundsChange(e) {
		// if e.target.value is not in soundsSelected, add it, else, remove it
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

	function handleLinkChange(e) {
		setListenLink(e.target.value);
	}

	if (
		artist &&
		fetcher &&
		fetcher.data &&
		fetcher.data.showsBySong &&
		fetcher.data.showsBySong[0] &&
		(!showsBySong ||
			fetcher.data.showsBySong[0].showdate.normalize() !==
				showsBySong[0]?.showdate.normalize())
	) {
		setShowsBySong(fetcher?.data?.showsBySong);
	}
	if (
		artist &&
		fetcher &&
		fetcher.data &&
		fetcher.data.showsByYear &&
		fetcher.data.showsByYear[0] &&
		(!showsByYear ||
			fetcher.data.showsByYear[0].showdate.normalize() !==
				showsByYear[0]?.showdate.normalize())
	) {
		setShowsByYear(fetcher?.data?.showsByYear);
	}
	if (
		fetcher?.data?.setlist &&
		fetcher?.data?.setlist.length > 0 &&
		(!setlist ||
			(setlist[0].value !== fetcher?.data?.setlist[0].value &&
				setlist[1].value !== fetcher?.data?.setlist[1].value &&
				setlist[2].value !== fetcher?.data?.setlist[2].value))
	) {
		setSetlist(fetcher?.data?.setlist);
	}
	if (
		fetcher?.data?.location &&
		artist &&
		fetcher?.data?.location !== location
	) {
		setLocation(fetcher?.data?.location);
	}
	if (fetcher?.data?.jam && fetcher?.data?.jam !== jam) {
		setJam(fetcher?.data?.jam);
		setSoundsSelected(fetcher?.data?.jam?.sounds);
	}
	if (fetcher?.data?.year && fetcher?.data?.year !== year) {
		setYear(fetcher?.data?.year);
	}
	if (
		actionData &&
		actionData?.status === 200 &&
		actionData?.body === 'action complete' &&
		!showSuccessAlert
	) {
		setShowSuccessAlert(true);
	}

	//check if song exists
	useEffect(() => {
		setJam('');
		if (songSelected && artist && date) {
      const getShowsByYear = (!showsByYear || showsByYear[0].showdate.slice(0, 4) !== date.slice(0, 4)) ? 'true' : 'false';
      const getSetlist = !setlist ? 'true' : 'false';
			let urlToFetch =
				'/checkJamAdded?artist=' +
				artist.artist +
				'&song=' +
				songSelected +
				'&date=' +
				date +
        '&fetchShowsByYear=' +
        getShowsByYear +
        '&fetchSetlist=' +
        getSetlist;
			fetcher.load(urlToFetch);
		}
	}, [songSelected, date]);

	const showAddSong = (query || songSelected) && filteredSongs?.length === 0;

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
							{[
								{ id: 'auto', title: 'Easiest way' },
								{ id: 'manual', title: 'Still pretty easy way' },
							].map((addingMethod) => (
								<div
									key={addingMethod?.id}
									className='flex align-middle'
								>
									<input
										key={addingMethod.id}
										id={addingMethod.id}
										name='adding-method'
										type='radio'
										defaultChecked={addingMethod.id === 'auto'}
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
					value={JSON.stringify(jam)}
				/>
				<input
					type='hidden'
					name='sounds'
					value={soundsSelected}
				/>
				<input
					type='hidden'
					name='rating'
					value={rating}
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
				{/* artist picker*/}
				{!artist && (
					<div className='max-h-40 max-w-sm'>
						<Listbox
							value={artist}
							onChange={(e) => handleArtistChange(e)}
						>
							{({ open }) => (
								<>
									<Listbox.Label className='block text-md font-medium text-gray-700'>
										Band
									</Listbox.Label>
									<div className='relative mt-1'>
										<Listbox.Button className='relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 sm:text-sm h-10'>
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
																		selected ? 'font-semibold' : 'font-normal',
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
					(!setlist || !date) &&
					!songSelected &&
					(artist.artist === 'Goose' ||
						artist.artist === 'Eggy' ||
						artist.artist === 'Neighbor' ||
						artist.artist === "Umphrey's McGee" ||
						artist.artist === 'Phish' ||
						artist.artist === "Taper's Choice" ||
						artist.artist === 'Trey Anastasio, TAB' ||
						!useApis) && (
						<div className='max-w-sm py-4'>
							<Combobox
								as='div'
								value={songSelected}
								onChange={(e) => {
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
																? 'bg-cyan-600 text-white'
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
					showsBySong &&
					!date &&
					(artist.artist === 'Goose' ||
						artist.artist === 'Eggy' ||
						artist.artist === 'Neighbor' ||
						artist.artist === "Umphrey's McGee" ||
						artist.artist === 'Phish' ||
						artist.artist === "Taper's Choice" ||
						artist.artist === 'Trey Anastasio, TAB') && (
						<div className='max-h-40'>
							<Listbox
								value={show}
								onChange={handleShowChange}
							>
								{({ open }) => (
									<>
										<Listbox.Label className='block text-md font-medium text-gray-700'>
											Shows with a {songSelected}
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
													{showsBySong?.map((show, showIdx) => (
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
																				active ? 'text-white' : 'text-cyan-600',
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
				{(query || songSelected) && filteredSongs?.length === 0 && (
					<div>
						<InfoAlert
							title={`No songs containing ${
								query && query !== '' ? query : songSelected
							} found`}
							description={`This is a travesty! Please rectify this situation by adding a new song below`}
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
								defaultValue={query !== '' ? query : songSelected}
								className='block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm'
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
							className=' my-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500'
						>
							Add Song
						</button>
					</div>
				)}
				{/* Year picker */}
				{useApis && artist && !date && (
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
												{yearsArr?.map((year, yearIdx) => (
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
																		selected ? 'font-semibold' : 'font-normal',
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
				{useApis &&
					showsByYear &&
					showsByYear?.length > 1 &&
					!date &&
					year &&
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
													{showsByYear?.map((show, showIdx) => (
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
																				active ? 'text-white' : 'text-cyan-600',
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
				{useApis && !date && artist && (
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
				{useApis && setlist && setlist !== '' && date && !songSelected && (
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
												{setlist?.map((songInSet, songInSetIdx) => (
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
																		selected ? 'font-semibold' : 'font-normal',
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
							MMDDYYYY format please, no / or -
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
							onClick={() => showEditLocation()}
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
								defaultValue={location}
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
				{useApis && artist.artist && (
					<div
						className={`text-sm text-gray-500 ${
							(!(artist && songSelected && date) &&!showLoadingInfo) ? 'pb-40' : ''
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
									: artist.artist === "Umphrey's McGee"
									? 'https://allthings.umphreys.com'
									: artist.artist === 'Neighbor'
									? 'https://neighbortunes.net'
									: artist.artist === 'Eggy'
									? 'https://thecarton.net'
									: artist.artist === "Taper's Choice"
									? 'https://taperschoice.net'
									: 'https://www.setlist.fm'
							}
							className='underline'
						>
							{artist.artist === 'Phish' ||
							artist.artist === 'Trey Anastasio, TAB'
								? 'phish.net'
								: artist.artist === 'Goose'
								? 'elgoose.net'
								: artist.artist === "Umphrey's McGee"
								? 'allthings.umphreys.com'
								: artist.artist === 'Neighbor'
								? 'neighbortunes.net'
								: artist.artist === 'Eggy'
								? 'thecarton.net'
								: artist.artist === "Taper's Choice"
								? 'taperschoice.net'
								: 'setlist.fm'}
						</a>
						.{' '}
						{artist.artist === 'Phish' ||
						artist.artist === 'Trey Anastasio, TAB' ||
						artist.artist === 'Goose' ||
						artist.artist === 'Eggy' ||
						artist.artist === 'Neighbor' ||
						artist.artist === "Taper's Choice" ||
						artist.artist === "Umphrey's McGee" ? (
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
							"If the info isn't on setlist.fm, please consider adding it if you know it. Thanks for contributing!"
						) : (
							''
						)}
					</div>
				)}
				{useApis &&
					showLoadingInfo &&
          !(artist && songSelected && date && location) &&
					artist.artist !== 'Phish' &&
					artist.artist !== 'Trey Anastasio, TAB' &&
					artist.artist !== 'Eggy' &&
					artist.artist !== 'Goose' &&
					artist.artist !== 'Neighbor' &&
					artist.artist !== "Umphrey's Mcgee" &&
					artist.artist !== "Taper's Choice" && (
						<InfoAlert
							title={'Thanks for your patience!'}
							description={
								"Setlist.fm limits how fast we can get data and how much data we can get, so if it's not working, please try the 'Still pretty easy way.' Thanks for contributing!"
							}
						/>
					)}
				{artist && songSelected && date && location && jam && jam !== '' && (
					<SuccessAlert
						title={"It's on Jam Fans!"}
						description={`You can add sounds ${
							profile ? 'and your rating and comment' : ''
						} below. Thanks for helping other fans!`}
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
																	className='h-6 w-6 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500  border-2 mr-2'
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
				{artist &&
					songSelected &&
					date &&
					location &&
					soundsSelected &&
					soundsSelected !== [] && <p>Sounds: {soundsSelected.join(', ')}</p>}
				{/* listen link */}
				{artist &&
					songSelected &&
					date &&
					location &&
					profile &&
					(!jam || (jam && !jam?.listen_link)) && (
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
										Rating
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
											<Listbox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm h-60'>
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
									className='block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm'
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
					{!profile && jam && jam?.sounds?.length !== soundsSelected?.length && (
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
						!jam &&
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
					{profile && !jam && (rating || comment) && (
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
					{/*logged in, jam exists, add rating/comment, no new sounds*/}
					{profile &&
						jam &&
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
								"Thanks for contributing! You're a great person making a positive impact in the world."
							}
						/>
					</div>
				)}
				{actionData && actionData?.status !== 200 && (
					<div className='pb-20'>
						<ErrorAlert
							title={'Error :('}
							description={
								'Something went wrong. Please try again and/or let me know on twitter'
							}
						/>
						<a href='https://twitter.com/jeffphox'>@jeffphox on twitter</a>
					</div>
				)}
			</div>
		</Form>
	);
}
