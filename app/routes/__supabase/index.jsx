import { Link, Outlet, useNavigate } from '@remix-run/react';
import { createServerClient } from '@supabase/auth-helpers-remix';
import { useLoaderData } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';
import ArtistBar from '../../components/ArtistBar';
import JamList from '../../components/JamList';
import JamFilters from '../../components/JamFilters';
import JamFiltersSlideout from '../../components/JamFilters';
import { useState, useEffect } from 'react';
import FiltersButton from '../../components/FiltersButton';
import JamsHome from '../../components/JamsHome';
import Hero from '../../components/Hero';

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
	console.log('user', user);
	console.log('profile', profile);
	if (user && !profile) {
		console.log('redirecting to /welcome');
		return redirect('/welcome');
	}

	//get artists
	let { data: artists } = await supabaseClient
		.from('artists')
		.select('nickname, emoji_code, url, artist')
		.order('name_for_order', { ascending: true });
	//get base versions
	// let { data: versions } = await supabaseClient
	// 	.from('versions')
  //   .select('*')
  //   // .select('*,ratings(*), ')
	// 	.order('avg_rating', { ascending: false })
	// 	.order('num_ratings', { ascending: false })
	// 	.order('song_name', { ascending: true })
	// 	.limit(100);
	//get songs
	const { data: songs } = await supabaseClient
		.from('songs')
		.select('song, artist')
		.order('song', { ascending: true });
	const { data: sounds } = await supabaseClient
		.from('sounds')
		.select('label, text')
		.order('label', { ascending: true });
  const { data: profiles } = await supabaseClient
    .from('profiles')
    .select('name, points')
    .order('points', { ascending: false })
  const { data: jams } = await supabaseClient
    .from('jams')
    .select('*')
    .order('avg_rating', { ascending: false })
		.order('num_ratings', { ascending: false })
		.order('song_name', { ascending: true })
		.limit(100);  

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
	//make title
	let title = 'Jams by All Bands';
	let count = await supabaseClient
		.from('versions')
		.select('*', { count: 'exact', head: true });
	count = count.count;
	return json(
		{ artists, songs, sounds, count, user, profile, title, profiles, jams },
		{
			headers: response.headers,
		}
	);
};

export default function Index({ supabase, session }) {
	const { artists, songs, sounds, title, count, user, profile, jams } =
		useLoaderData();
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);

	return (
    <>
    <Hero/>
		<JamsHome
			supabase={supabase}
			session={session}
			artists={artists}
			songs={songs}
			jams={jams}
			sounds={sounds}
			open={open}
			setOpen={setOpen}
			count={count}
			user={user}
			profile={profile}
			title={title}
		/>
    </>
	);
}
