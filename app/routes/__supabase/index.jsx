import { Link, Outlet } from '@remix-run/react';
import { createServerClient } from '@supabase/auth-helpers-remix';
import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import ArtistBar from '../../components/ArtistBar';
import JamList from '../../components/JamList';
import JamFilters from '../../components/JamFilters';
import JamFiltersSlideout from '../../components/JamFilters';
import { useState } from 'react';
import FiltersButton from '../../components/FiltersButton';
import JamsHome from '../../components/JamsHome';

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
	let { data: artists } = await supabaseClient
		.from('artists')
		.select('nickname, emoji_code, url, artist')
		.order('name_for_order', { ascending: true });
	//get base versions
	const { data: versions } = await supabaseClient
		.from('versions')
		.select('*')
		.order('avg_rating', { ascending: false })
		.order('num_ratings', { ascending: false })
		.limit(100);
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
	//make title
	let count = await supabaseClient
		.from('versions')
		.select('*', { count: 'exact', head: true });
	count = count.count;
	return json(
		{ artists, songs, versions, sounds, count, user, profile },
		{
			headers: response.headers,
		}
	);
};

export default function Index({ supabase, session }) {
	const { artists, songs, versions, sounds, title, count, user, profile } = useLoaderData();
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
			count={count}
      user={user}
      profile={profile}
		/>
	);
}
