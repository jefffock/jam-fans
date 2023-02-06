import { Outlet, useLoaderData } from '@remix-run/react';
import ArtistBar from '../../../components/ArtistBar';
import { createServerClient } from '@supabase/auth-helpers-remix';
import { json } from '@remix-run/node';
import JamList from '../../../components/JamList';
import JamFilters from '../../../components/JamFilters';
import JamFiltersSlideout from '../../../components/JamFilters';
import { useState } from 'react';
import FiltersButton from '../../../components/FiltersButton';
import JamsHome from '../../../components/JamsHome';

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
	const { data: sounds } = await supabaseClient
		.from('sounds')
		.select('label, text')
		.order('label', { ascending: true });
	let { data: artists } = await supabaseClient
		.from('artists')
		.select('nickname, emoji_code, url, artist')
		.order('name_for_order', { ascending: true });

	const url = new URL(request.url);
	const searchParams = new URLSearchParams(url.search);
	const queryParams = Object.fromEntries(searchParams);

	delete queryParams['show-ratings'];
	delete queryParams['limit[label]'];

	const stringParams = JSON.stringify(queryParams);

	//iterate through queryParamsArray and build a supabase query
	let song;
	let beforeDate;
	let afterDate;
	let orderBy = 'avg_rating';
	let asc = false;
	let limit = 100;
	let showListenable = false;
	let urlToShow;
	let queryObjToStore = {};
	let soundsInQuery = [];
	let artistsInQuery = [];

	for (const [key, value] of Object.entries(queryParams)) {
		if (key.includes('sound')) {
			soundsInQuery.push(value);
		}
		if (key.includes('artist')) {
			artistsInQuery.push(value);
		}
		if (key.includes('song')) {
			song = value;
		}
		if (key.includes('before')) {
			beforeDate = value;
		}
		if (key.includes('after')) {
			afterDate = value;
		}
		if (key.includes('order')) {
			orderBy = value;
		}
		if (key.includes('asc')) {
			asc = true;
		}
		if (key.includes('limit')) {
			limit = value;
		}
		if (key.includes('show-links')) {
			showListenable = true;
		}
	}

	const list = await supabaseClient
		.from('jams_lists')
		.select('*')
		.eq('params', stringParams)
		.single();
	if (list.data) {
		urlToShow = '/jams/lists/' + list.data.id;
	}
	let jams = supabaseClient.from('jams').select('*');
	let artistsInQueryNames = [];
	console.log('artistsInQuery', artistsInQuery);
	if (artistsInQuery?.length > 0) {
		//if first element is null, break
		if (artistsInQuery[0] !== 'null') {
			artistsInQuery.forEach((artist) => {
				artistsInQueryNames.push(artists.find((a) => a.url === artist)?.artist);
			});
			console.log('artistsInQueryNames', artistsInQueryNames);
			jams = jams.in('artist', artistsInQueryNames);
		}
	}
	// if (song) {
	// 	jams = jams.eq('song_name', song);
	// }
	// if (afterDate) {
	// 	let after = afterDate + '-01-01';
	// 	jams = jams.gte('date', after);
	// }
	// if (beforeDate) {
	// 	let before = beforeDate + '-12-31';
	// 	jams = jams.lte('date', before);
	// }

	//old sounds
	// if (soundsInQuery) {
	// 	soundsInQuery.forEach((sound) => {
	// 		jams = jams.eq(sound, true);
	// 	});
	// }

	if (showListenable) {
		console.log('showListenable', showListenable);
		jams = jams.not('listen_link', 'is', null);
	}
	if (soundsInQuery) {
		//new sounds
		let arrayOfLabels = [];
		soundsInQuery.forEach((sound) => {
			arrayOfLabels.push(sounds.find((s) => s.text === sound)?.label);
		});
		console.log('arrayOfLabels', arrayOfLabels);
		if (arrayOfLabels.length > 0) {
			jams = jams.contains('sounds', arrayOfLabels);
		}
		// console.log('soundsInQuery', soundsInQuery)
		// jams = jams.filter((jam) => {
		// 	return soundsInQuery.some(sound => jam.sounds.includes(sound));
		// });
	}
	jams = jams.order(orderBy, { ascending: asc });
	if (orderBy === 'avg_rating') {
		jams = jams.order('num_ratings', { ascending: false });
	}
	if (orderBy === 'num_ratings') {
		jams = jams.order('avg_rating', { ascending: false });
	}
	// if (orderBy === 'avg_rating') {
	// 	jams = jams.order('num_ratings', { ascending: false });
	// }
	// if (orderBy === 'num_ratings') {
	// 	jams = jams.order('avg_rating', { ascending: false });
	// }
	jams = jams.limit(limit);
	const { data: jamsFetched } = await jams;
	//get base versions
	// const { data: versions } = await supabaseClient
	// 	.from('versions')
	// 	.select('*')
	// 	.order('avg_rating', { ascending: false })
	// 	.limit(100);
	//get songs
	const { data: songs } = await supabaseClient
		.from('songs')
		.select('song, artist');
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

	let title = '🔥 ';
	if (soundsInQuery?.length > 0) {
		for (var i = 0; i < soundsInQuery.length; i++) {
			title += sounds.find((s) => s.text === soundsInQuery[i])?.label;
			//addcommaexceptlast
			if (i < soundsInQuery.length - 2) title += ', ';
			if (i === soundsInQuery.length - 2) title += ' and ';
			soundsInQuery.forEach((sound) => {});
		}
		//remove last two characters
	}
	if (song) {
		title += ' ' + song;
	}
	title += ' Jams';
	if (artistsInQueryNames?.length > 0) {
		title += ' by ';
		title += ' ';
		for (var j = 0; j < artistsInQueryNames.length; j++) {
			if (artistsInQueryNames[j] === 'Grateful Dead') title += 'The ';
			title += artistsInQueryNames[j];
			if (j < artistsInQueryNames.length - 2) title += ', ';
			if (j === artistsInQueryNames.length - 2) title += ' and ';
		}
	}
	if (artistsInQueryNames?.length === 0) {
		title += ' by All Bands';
	}
	if (beforeDate && afterDate) {
		if (beforeDate === afterDate) {
			title += ' from ' + beforeDate;
		} else {
			title += ' from ' + afterDate + ' to ' + beforeDate;
		}
	}
	if (beforeDate && !afterDate) {
		title += ' from ' + beforeDate + ' and before ';
	}
	if (afterDate && !beforeDate) {
		title += ' from ' + afterDate + ' and after ';
	}
	title.trim();
	const fullTitle = title + ' on Jam Fans';

	let count = await supabaseClient
		.from('versions')
		.select('*', { count: 'exact', head: true });
	count = count.count;
	const search = url.search;

	return json(
		{
			artists,
			songs,
			jams: jamsFetched,
			sounds,
			fullTitle,
			title,
			count,
			search,
			user,
			profile,
		},
		{
			headers: response.headers,
		}
	);
};

export default function Jams({ supabase, session }) {
	const {
		artists,
		songs,
		sounds,
		fullTitle,
		title,
		count,
		search,
		user,
		profile,
		jams,
	} = useLoaderData();
	const [open, setOpen] = useState(false);
	if (!artists) return <div>Loading...</div>;

	return (
		<JamsHome
			supabase={supabase}
			session={session}
			artists={artists}
			songs={songs}
			jams={jams}
			sounds={sounds}
			open={open}
			setOpen={setOpen}
			fullTitle={fullTitle}
			title={title}
			count={count}
			search={search}
			user={user}
			profile={profile}
		/>
	);
}
