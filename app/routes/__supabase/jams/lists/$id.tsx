'use-client';

import { createBrowserClient } from '@supabase/auth-helpers-remix';
import { Link, useLoaderData } from '@remix-run/react';
import { useParams } from '@remix-run/react';
import { useOutletContext } from '@remix-run/react';
import { json } from '@remix-run/node' // change this import to whatever runtime you are using
import { createServerClient } from '@supabase/auth-helpers-remix'

import type { LoaderArgs } from '@remix-run/node' // change this import to whatever runtime you are using

export const loader = async ({ request, params }: LoaderArgs) => {
  const response = new Response()
  const supabaseClient = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  )
  console.log('PARAMS', params)

  const { data } = await supabaseClient.from('jams_lists').select('*').eq('id', params.id).single()
  console.log('data in loader', data)
  console.log('parsed params', JSON.parse(data.params))
  const listParams = JSON.parse(data.params);
		const url = data.query;
		const artist = listParams?.artist;
		const song = listParams?.song;
		const sounds = listParams?.sounds;
		let tags = sounds?.split(',') ?? [];
		const beforeDate = listParams?.beforeDate;
		const afterDate = listParams?.afterDate;
		const orderBy = listParams?.orderBy ?? 'id';
		const asc = listParams?.order === 'asc' ? true : false;
		const limit = listParams?.limit ?? 100;
		const showListenable = listParams?.showListenable === 'true';
		let jams = supabaseClient.from('versions').select('*');
		if (artist) {
			jams = jams.eq('artist', artist);
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
		if (tags) {
			tags.forEach((tag: any) => {
				jams = jams.eq(tag, true);
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
		jams = jams.limit(limit);
    const { data: jamsData, error } = await jams;
    console.log('jamsData', jamsData)
  return json(
    { jamsData },
    {
      headers: response.headers,
    }
  )
}

export default function JamList() {

  const { jamsData } = useLoaderData<typeof loader>()
	const params = useParams();


	if (!jamsData) {
		return <div>no list yet</div>;
	}
	return (
		<main className='mx-auto max-w-4xl'>
			<p className='my-6 border-b-2 text-center text-3xl'>
				Some Post: {JSON.stringify(jamsData, 0, 2)}
			</p>
		</main>
	);
}
