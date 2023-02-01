import { createServerClient } from '@supabase/auth-helpers-remix';
import { json } from '@remix-run/node';

export const loader = async ({ request, params }) => {
	console.log('in getSetlist.js');
	const response = new Response();
	const supabaseClient = createServerClient(
		process.env.SUPABASE_URL,
		process.env.SUPABASE_ANON_KEY,
		{ request, response }
	);
  const url = new URL(request.url);
	const searchParams = new URLSearchParams(url.search);
	const queryParams = Object.fromEntries(url.searchParams.entries());
	const artist = queryParams?.artist;
	let song = queryParams?.song;
  let date = queryParams?.date;
  console.log('artist, song, date', artist, song, date)
	let { data: jam } = await supabaseClient
		.from('versions_duplicate')
		.select('*')
		.eq('artist', artist)
		.eq('song_name', song)
		.eq('date', date)
		.single();
    console.log('jam', jam)
	return json(
		{ jam },
		{
			headers: response.headers,
		}
	);
};
