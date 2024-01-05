import { createServerClient } from '@supabase/auth-helpers-remix';
import { json } from '@remix-run/node';
import type { LoaderArgs } from '@remix-run/node';

export const loader = async ({ request, params }: LoaderArgs) => {
	const response = new Response();

	if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
		throw new Error("Supabase URL and ANON KEY must be defined");
	}
	
	const supabaseClient = createServerClient(
		process.env.SUPABASE_URL,
		process.env.SUPABASE_ANON_KEY,
		{ request, response }
	);
	console.log('params in getSong', params)
	const initialSong = params.song;
	console.log('initialSong in getSong', initialSong)
			
	const { data , error } = await supabaseClient
		.from('songs')
		.select('*')
		.eq('song', initialSong)
		.single();
	if (error) {
		console.log('error in getsong', error);
		return json({ error });
	}
	return json({ data },
		{ headers: response.headers });
}
