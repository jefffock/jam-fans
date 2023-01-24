import { Outlet, useLoaderData } from '@remix-run/react';
import ArtistBar from '../ArtistBar'
import { createServerClient } from '@supabase/auth-helpers-remix';
import { json } from '@remix-run/node';

export const loader = async ({ request, params }) => {
	const response = new Response();
	const supabaseClient = createServerClient(
		process.env.SUPABASE_URL,
		process.env.SUPABASE_ANON_KEY,
		{ request, response }
	);
	//get artists
	const { data: artists } = await supabaseClient
		.from('artists')
		.select('nickname, emoji_code')
		.order('name_for_order', { ascending: true })
	//get base versions
	const { data: versions } = await supabaseClient
		.from('versions')
		.select('*')
		.order('avg_rating', { ascending: false })
		.limit(100);
	//get songs
	const { data: songs } = await supabaseClient.from('songs').select('*');
	artists.unshift({ nickname: 'Grateful Dead', emoji_code: '0x1F480' });
	artists.unshift({ nickname: 'Phish', emoji_code: '0x1F41F' });
	console.log('artists', artists);

	return json(
		{ artists, songs, versions },
		{
			headers: response.headers,
		}
	);
};

export default function JamsHome({
  supabase,
  session,
}) {
  const { artists, songs, versions } = useLoaderData();
  if (!artists) return <div>Loading...</div>;

	return (
		<div>
      <h1>at /jams</h1>
      <ArtistBar artists={artists}/>
		</div>
	);
}
