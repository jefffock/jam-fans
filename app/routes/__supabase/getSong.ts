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
	//get search params from url
	const url = new URL(request.url);
	const searchParams = new URLSearchParams(url.search);
	const song = searchParams.get('song');
			
	const { data , error } = await supabaseClient
		.from('songs')
		.select('*')
		.eq('song', song)
		.single();
	if (error) {
		console.log('error in getsong', error);
		return json({ error });
	}
	return json({ data },
		{ headers: response.headers });
}
