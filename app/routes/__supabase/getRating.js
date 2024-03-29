import { createServerClient } from '@supabase/auth-helpers-remix';
import { json } from '@remix-run/node';

export const loader = async ({ request, params }) => {
	const response = new Response();
	const supabaseClient = createServerClient(
		process.env.SUPABASE_URL,
		process.env.SUPABASE_ANON_KEY,
		{ request, response }
	);

  //get the query params
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const queryParams = Object.fromEntries(url.searchParams.entries());
  const name = queryParams?.name
  const jam = queryParams?.jam
  console.log('name, jam', name, jam)
  if (name && jam) {
    //get the users ratings for this jam
    let { data, error } = await supabaseClient
    .from('ratings')
    .select('*')
    .eq('submitter_name', name)
    .eq('version_id', jam)
    .single()
    if (error) {
      console.log('error', error)
      return json(
        { error: error },
        {
          headers: response.headers,
        }
      )
    }
    if (data) {
      console.log('data', data)
      return json(
        { rating: data },
        {
          headers: response.headers,
        }
      );
    }
  }
};
