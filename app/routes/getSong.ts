import { createServerClient, parse, serialize } from '@supabase/ssr'
import { json } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const response = new Response();

	if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
		throw new Error("Supabase URL and ANON KEY must be defined");
	}

	const cookies = parse(request.headers.get('Cookie') ?? '')
	const headers = new Headers()

	const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
		cookies: {
			get(key) {
				return cookies[key]
			},
			set(key, value, options) {
				headers.append('Set-Cookie', serialize(key, value, options))
			},
			remove(key, options) {
				headers.append('Set-Cookie', serialize(key, '', options))
			},
		},
	})
	//get search params from url
	const url = new URL(request.url);
	const searchParams = new URLSearchParams(url.search);
	const song = searchParams.get('song');

	const { data, error } = await supabase
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
