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
	let showListenable;
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
	let jams = supabaseClient.from('versions').select('*');

	let artistsInQueryNames = [];
	if (artistsInQuery?.length > 0) {
		//if first element is null, break
		if (artistsInQuery[0] !== 'null') {
			artistsInQuery.forEach((artist) => {
				artistsInQueryNames.push(artists.find((a) => a.url === artist).artist);
			});
			jams = jams.in('artist', artistsInQueryNames);
		}
	}
	if (song) {
		jams = jams.eq('song_name', song);
	}
	if (afterDate) {
		let after = afterDate + '-01-01';
		jams = jams.gte('date', after);
	}
	if (beforeDate) {
		let before = beforeDate + '-12-31';
		jams = jams.lte('date', before);
	}
	if (soundsInQuery) {
		soundsInQuery.forEach((sound) => {
			jams = jams.eq(sound, true);
		});
	}
	if (showListenable) {
		jams = jams.not('listen_link', 'is', null);
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
	const { data: versions } = await jams;
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
	const { data: sounds } = await supabaseClient
		.from('sounds')
		.select('label, text');
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

	let title = '';
	if (soundsInQuery?.length > 0) {
		soundsInQuery.forEach((sound) => {
			title += sounds.find((s) => s.text === sound).label + ', ';
		});
    title = title.slice(0, -2);
		//remove last two characters
	}
	if (song) {
		title += ' ' + song;
	}
	title += ' Jams';
	if (artistsInQueryNames?.length > 0) {
		title += ' by ';
		for (var j = 0; j < artistsInQueryNames.length; j++) {
			title += artistsInQueryNames[j];
			if (j < artistsInQueryNames.length - 1) title += ', ';
		}
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
	let subtitle = '';
	let newLimit = limit !== 'null' ? limit : 'All';
	if (orderBy) {
		switch (orderBy) {
			case 'id':
				subtitle += newLimit + ' recently added';
				break;
			case 'artist':
				subtitle += newLimit !== 'All' ? 'First ' + newLimit : 'All';
				subtitle += 'by artist name';
				order === 'asc' ? (subtitle += ' (A-Z)') : (subtitle += ' (Z-A)');
				break;
			case 'song_name':
				subtitle += newLimit !== 'All' ? 'First ' + newLimit : 'All';
				subtitle += 'by song name';
				order === 'asc' ? (subtitle += ' (A-Z)') : (subtitle += ' (Z-A)');
				break;
			case 'date':
				if (order === 'asc') {
					subtitle += newLimit + ' oldest';
				} else {
					subtitle += newLimit + ' newest';
				}
				break;
			case 'avg_rating':
				subtitle += newLimit + ' highest-rated';
				break;
			case 'num_ratings':
				subtitle += newLimit + ' most-rated';
				break;
		}
	}
	title.trim();
	subtitle.trim();
	const fullTitle = title + ': ' + subtitle + ' on Jam Fans';

  let count = await supabaseClient
  .from('versions')
  .select('*', { count: 'exact', head: true });
  count = count.count
  const search = url.search
  console.log('search', typeof search)

	return json(
		{ artists, songs, versions, sounds, fullTitle, title, subtitle, count, search },
		{
			headers: response.headers,
		}
	);
};

export default function Jams({ supabase, session }) {
	const { artists, songs, versions, sounds, fullTitle, title, subtitle, count, search } =
		useLoaderData();
	const [open, setOpen] = useState(false);
	if (!artists) return <div>Loading...</div>;

	return (
		<JamsHome
			supabase={supabase}
			session={session}
			artists={artists}
			songs={songs}
			versions={versions}
			sounds={sounds}
			open={open}
			setOpen={setOpen}
			fullTitle={fullTitle}
			title={title}
			subtitle={subtitle}
      count={count}
      search={search}
		/>
	);
}
