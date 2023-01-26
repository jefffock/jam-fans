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
  console.log('request.url', request.url)
  const queryString = request.url.split('?')[1]

	const url = new URL(request.url);
	const queryParams = Object.fromEntries(url.searchParams.entries());
  console.log('queryParams', queryParams)
  const stringParams = JSON.stringify(queryParams)
  console.log('stringParams', stringParams)
	const queryParamsArray = Object.entries(queryParams);
	/*
  const showMoreFilters = params?.showMoreFilters;
  const showRatings = params?.showRatings;
  delete params.showMoreFilters;
  delete params.showRatings;
  query = query.replace('&showRatings=true', '');
  query = query.replace('&showMoreFilters=true', '');
  const stringParams = JSON.stringify(params); 
	let urlToShow = 'needToInsertList'
  */
	//iterate through queryParamsArray and build a supabase query
	let tags = [];
	let artistsInQuery = [];
	let song;
	let beforeDate;
	let afterDate;
	let orderBy = 'avg_rating';
	let asc = false;
	let limit = 100;
	let showListenable;
	let urlToShow;
  let queryObjToStore = {}

	// for (var i = 0; i < queryParamsArray.length; i++) {
	// 	if (queryParamsArray[i][0].includes('sound')) {
	// 		console.log('queryParamsArray[i][0]', queryParamsArray[i][0]);
	// 		const sound = queryParamsArray[i][0].split('-')[1];
	// 		console.log('sound', sound);
	// 		tags.push(sound);
	// 	}
	// 	if (queryParamsArray[i][0].includes('band')) {
	// 		const band = queryParamsArray[i][0].split('-')[1];
	// 		artistsInQuery.push(band);
	// 	}
	// }
  //do the same as above but iterating throughq queryParams object
  delete queryParams['limit[label]']
  console.log('queryParams', queryParams)
  for (const [key, value] of Object.entries(queryParams)) {
    console.log(`${key}: ${value}`)
    if (key.includes('sound')) {
      const sound = key.split('-')[1];
      tags.push(sound);
    }
    if (key.includes('band')) {
      const band = key.split('-')[1];
      artistsInQuery.push(band);
    }
  }


	// // const list = await supabaseClient
	// // 	.from('jams_lists')
	// // 	.select('*')
	// // 	.eq('params', stringParams)
	// // 	.single();
	// // if (list.data) {
	// // 	urlToShow = '/jams/lists/' + list.data.id;
	// // }
	// let jams = supabaseClient.from('versions').select('*');
	// // if (artist) {
	// // 	jams = jams.eq('artist', artist);
	// // }
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
	// if (tags) {
	// 	tags.forEach((tag) => {
	// 		jams = jams.eq(tag, true);
	// 	});
	// }
	// if (showListenable) {
	// 	jams = jams.not('listen_link', 'is', null);
	// }
	// jams = jams.order(orderBy, { ascending: asc });
	// if (orderBy === 'avg_rating') {
	// 	jams = jams.order('num_ratings', { ascending: false });
	// }
	// if (orderBy === 'num_ratings') {
	// 	jams = jams.order('avg_rating', { ascending: false });
	// }
	// jams = jams.limit(limit);

	console.log('tags', tags);
	console.log('artistsInQuery', artistsInQuery);
	//get artists
	let { data: artists } = await supabaseClient
		.from('artists')
		.select('nickname, emoji_code, url, artist')
		.order('name_for_order', { ascending: true });
	//get base versions
	const { data: versions } = await supabaseClient
		.from('versions')
		.select('*')
		.order('avg_rating', { ascending: false })
		.limit(100);
	//get songs
	const { data: songs } = await supabaseClient
		.from('songs')
		.select('song, artist');
	const { data: sounds } = await supabaseClient.from('sounds').select('*');
	artists = [{ nickname: 'All Bands', emoji_code: '0x221E', url: null, artist: 'All Bands' }, { nickname: 'Phish', emoji_code: '0x1F41F', url: 'phish', artist: 'Phish' }, { nickname: 'Grateful Dead', emoji_code: '0x1F480', url: 'grateful-dead', artist: 'Grateful Dead' }].concat(artists)
  console.log('artists', artists)

	return json(
		{ artists, songs, versions, sounds },
		{
			headers: response.headers,
		}
	);
};

export default function Jams({ supabase, session }) {
	const { artists, songs, versions, sounds } = useLoaderData();
  const [open, setOpen] = useState(true);
	if (!artists) return <div>Loading...</div>;

	return (
    <JamsHome supabase={supabase} session={session} artists={artists}  songs={songs} versions={versions} sounds={sounds} open={open} setOpen={setOpen} />
  )
}
